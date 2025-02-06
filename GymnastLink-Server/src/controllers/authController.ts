import {NextFunction, Request, RequestHandler, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {userModel} from '../models/usersModel';
import {RequestWithUserId} from '../types/request';
import {OAuth2Client} from 'google-auth-library';

const INVALID_CREDENTIALS = 'Invalid login credentials';
const INTERNAL_ERROR = 'Internal Server Error';
const INVALID_REFRESH_TOKEN = 'Invalid refresh token';
const EMAIL_ALREADY_REGISTERED = 'Given email was already registered';
const ACCESS_DENIED = 'Access Denied';

const register = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const existingUser = await userModel.exists({email: req.body.email});

    if (existingUser !== null) {
      res.status(400).send(EMAIL_ALREADY_REGISTERED);
      return;
    }

    const userName = req.body.email.split('@')[0];

    await userModel.create({
      email: req.body.email,
      password: hashedPassword,
      profileImageUrl: null,
      userName,
    });

    res.status(200).send('User registered successfully');
  } catch (err) {
    res.status(400).send(err);
  }
};

interface JwtPayload {
  _id: string;
  random: string;
}

const generateUserJwtToken = (userId: string) => {
  if (!process.env.JWT_TOKEN_SECRET) {
    return null;
  }

  const random = Math.random().toString();
  const accessToken = jwt.sign(
    {
      _id: userId,
      random,
    },
    process.env.JWT_TOKEN_SECRET,
    {expiresIn: process.env.JWT_TOKEN_EXPIRES}
  );

  const jwtContent: JwtPayload = {
    _id: userId,
    random,
  };

  const refreshToken = jwt.sign(jwtContent, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });

  return {accessToken, refreshToken};
};

const updateUserTokens = async (user: any) => {
  const tokens = generateUserJwtToken(user._id);

  if (!tokens) {
    throw new Error(INTERNAL_ERROR);
  }

  if (!user.refreshToken) {
    user.refreshToken = [];
  }

  user.refreshToken.push(tokens.refreshToken);
  await user.save();

  return tokens;
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({email: req.body.email});

    if (!user) {
      res.status(401).send(INVALID_CREDENTIALS);
      return;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      res.status(401).send(INVALID_CREDENTIALS);
      return;
    }

    const tokens = await updateUserTokens(user);

    res.status(200).send({
      userName: user.userName,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      profileImageUrl: user.profileImageUrl,
      _id: user._id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const getUserByJwtToken = async (token?: string) => {
  if (!process.env.JWT_TOKEN_SECRET || !token) {
    return null;
  }

  try {
    const jwtPayload = jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET
    ) as JwtPayload;

    return await userModel.findById(jwtPayload._id);
  } catch (err) {
    return null;
  }
};

const getCurrentUserData = async (
  req: RequestWithUserId,
  res: Response
): Promise<void> => {
  try {
    const user = await userModel.findById(req.body.userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({error: INTERNAL_ERROR});
  }
};

const verifyRefreshToken = async (refreshToken?: string) => {
  if (!refreshToken) {
    return false;
  }

  try {
    const user = await getUserByJwtToken(refreshToken);

    if (!user) {
      return false;
    }
    if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
      user.refreshToken = [];
      await user.save();

      return false;
    }

    user.refreshToken = user.refreshToken?.filter(
      (token) => token !== refreshToken
    );
    await user.save();

    return true;
  } catch (err) {
    return false;
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const isRefreshTokenValid = await verifyRefreshToken(req.body.refreshToken);

    if (!isRefreshTokenValid) {
      res.status(401).send(INVALID_REFRESH_TOKEN);
      return;
    }

    const user = await getUserByJwtToken(req.body.refreshToken);

    if (user) {
      user.refreshToken = user.refreshToken?.filter(
        (token) => token !== req.body.refreshToken
      );
      await user.save();
    }

    res.status(200).send('logout successfully');
  } catch (err) {
    res.status(400).send(INTERNAL_ERROR);
  }
};

const refreshUserToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    const isRefreshTokenValid = await verifyRefreshToken(refreshToken);

    if (!isRefreshTokenValid) {
      res.status(400).send(INVALID_REFRESH_TOKEN);
      return;
    }

    const user = await getUserByJwtToken(refreshToken);

    if (!user) {
      res.status(400).send(INVALID_REFRESH_TOKEN);
      return;
    }

    const newTokens = generateUserJwtToken(user._id);

    if (!newTokens) {
      res.status(500).send(INTERNAL_ERROR);
      return;
    }

    if (!user.refreshToken) {
      user.refreshToken = [];
    }

    user.refreshToken = user.refreshToken?.filter(
      (token) => token !== refreshToken
    );
    user.refreshToken.push(newTokens.refreshToken);
    await user.save();

    res.status(200).send({
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(400).send(INTERNAL_ERROR);
  }
};

const authMiddleware = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header('authorization');
  const token = authorization && authorization.split(' ')[1];

  if (!process.env.JWT_TOKEN_SECRET) {
    res.status(500).send(INTERNAL_ERROR);
    return;
  }

  const user = await getUserByJwtToken(token);

  if (user) {
    req.body.userId = user._id;
    next();
  } else res.status(401).send(ACCESS_DENIED);
};

const client = new OAuth2Client();
const googleLogin: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const credential = req.body.credential;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    let user = await userModel.findOne({email: email});

    if (user == null) {
      const userName = email?.split('@')[0];

      user = await userModel.create({
        email: email,
        password: `${Math.random()}${payload?.iat}`,
        profileImageUrl: payload?.picture,
        userName,
      });
    }

    const tokens = await updateUserTokens(user);

    res.status(200).send({
      userName: user.userName,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(400).send('error missing email or password');
  }
};

export {
  register,
  login,
  logout,
  getCurrentUserData,
  refreshUserToken,
  authMiddleware,
  googleLogin,
};
