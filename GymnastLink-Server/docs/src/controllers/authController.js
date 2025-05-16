"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.authMiddleware = exports.refreshUserToken = exports.getCurrentUserData = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersModel_1 = require("../models/usersModel");
const google_auth_library_1 = require("google-auth-library");
const INVALID_CREDENTIALS = 'Invalid login credentials';
const INTERNAL_ERROR = 'Internal Server Error';
const INVALID_REFRESH_TOKEN = 'Invalid refresh token';
const EMAIL_ALREADY_REGISTERED = 'Given email was already registered';
const ACCESS_DENIED = 'Access Denied';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
        const existingUser = yield usersModel_1.userModel.exists({ email: req.body.email });
        if (existingUser !== null) {
            res.status(400).send(EMAIL_ALREADY_REGISTERED);
            return;
        }
        const userName = req.body.email.split('@')[0];
        yield usersModel_1.userModel.create({
            email: req.body.email,
            password: hashedPassword,
            profileImageUrl: null,
            userName,
        });
        res.status(200).send('User registered successfully');
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.register = register;
const generateUserJwtToken = (userId) => {
    if (!process.env.JWT_TOKEN_SECRET) {
        return null;
    }
    const random = Math.random().toString();
    const accessToken = jsonwebtoken_1.default.sign({
        _id: userId,
        random,
    }, process.env.JWT_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRES });
    const jwtContent = {
        _id: userId,
        random,
    };
    const refreshToken = jsonwebtoken_1.default.sign(jwtContent, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
    });
    return { accessToken, refreshToken };
};
const updateUserTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = generateUserJwtToken(user._id);
    if (!tokens) {
        throw new Error(INTERNAL_ERROR);
    }
    if (!user.refreshToken) {
        user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    yield user.save();
    return tokens;
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield usersModel_1.userModel.findOne({ email: req.body.email });
        if (!user) {
            res.status(401).send(INVALID_CREDENTIALS);
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(401).send(INVALID_CREDENTIALS);
            return;
        }
        const tokens = yield updateUserTokens(user);
        res.status(200).send({
            userName: user.userName,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            profileImageUrl: user.profileImageUrl,
            _id: user._id,
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.login = login;
const getUserByJwtToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.JWT_TOKEN_SECRET || !token) {
        return null;
    }
    try {
        const jwtPayload = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN_SECRET);
        return yield usersModel_1.userModel.findById(jwtPayload._id);
    }
    catch (err) {
        return null;
    }
});
const getCurrentUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield usersModel_1.userModel.findById(req.body.userId);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(400).json({ error: INTERNAL_ERROR });
    }
});
exports.getCurrentUserData = getCurrentUserData;
const verifyRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!refreshToken) {
        return false;
    }
    try {
        const user = yield getUserByJwtToken(refreshToken);
        if (!user) {
            return false;
        }
        if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
            user.refreshToken = [];
            yield user.save();
            return false;
        }
        user.refreshToken = (_a = user.refreshToken) === null || _a === void 0 ? void 0 : _a.filter((token) => token !== refreshToken);
        yield user.save();
        return true;
    }
    catch (err) {
        return false;
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isRefreshTokenValid = yield verifyRefreshToken(req.body.refreshToken);
        if (!isRefreshTokenValid) {
            res.status(401).send(INVALID_REFRESH_TOKEN);
            return;
        }
        const user = yield getUserByJwtToken(req.body.refreshToken);
        if (user) {
            user.refreshToken = (_a = user.refreshToken) === null || _a === void 0 ? void 0 : _a.filter((token) => token !== req.body.refreshToken);
            yield user.save();
        }
        res.status(200).send('logout successfully');
    }
    catch (err) {
        res.status(400).send(INTERNAL_ERROR);
    }
});
exports.logout = logout;
const refreshUserToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refreshToken = req.body.refreshToken;
        const isRefreshTokenValid = yield verifyRefreshToken(refreshToken);
        if (!isRefreshTokenValid) {
            res.status(400).send(INVALID_REFRESH_TOKEN);
            return;
        }
        const user = yield getUserByJwtToken(refreshToken);
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
        user.refreshToken = (_a = user.refreshToken) === null || _a === void 0 ? void 0 : _a.filter((token) => token !== refreshToken);
        user.refreshToken.push(newTokens.refreshToken);
        yield user.save();
        res.status(200).send({
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            _id: user._id,
        });
    }
    catch (err) {
        res.status(400).send(INTERNAL_ERROR);
    }
});
exports.refreshUserToken = refreshUserToken;
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];
    if (!process.env.JWT_TOKEN_SECRET) {
        res.status(500).send(INTERNAL_ERROR);
        return;
    }
    const user = yield getUserByJwtToken(token);
    if (user) {
        req.body.userId = user._id;
        next();
    }
    else
        res.status(401).send(ACCESS_DENIED);
});
exports.authMiddleware = authMiddleware;
const client = new google_auth_library_1.OAuth2Client();
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credential = req.body.credential;
    try {
        const ticket = yield client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        let user = yield usersModel_1.userModel.findOne({ email: email });
        if (user == null) {
            const userName = email === null || email === void 0 ? void 0 : email.split('@')[0];
            user = yield usersModel_1.userModel.create({
                email: email,
                password: `${Math.random()}${payload === null || payload === void 0 ? void 0 : payload.iat}`,
                profileImageUrl: payload === null || payload === void 0 ? void 0 : payload.picture,
                userName,
            });
        }
        const tokens = yield updateUserTokens(user);
        res.status(200).send({
            userName: user.userName,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id,
        });
    }
    catch (err) {
        res.status(400).send('error missing email or password');
    }
});
exports.googleLogin = googleLogin;
//# sourceMappingURL=authController.js.map