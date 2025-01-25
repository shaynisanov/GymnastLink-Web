import {Request, Response} from 'express';
import {BaseController} from './baseController';
import {IUser, userModel} from '../models/usersModel';
import {UserResponse} from '../types/UserResponse';

class UsersController extends BaseController<IUser> {
  constructor() {
    super(userModel);
  }

  async getUserById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const user = await this.model.findById(id);

      if (user) {
        const userResponse: UserResponse = {
          id: user._id.toString(),
          userName: user.userName,
          profileImageUrl: user.profileImageUrl,
        };
        res.send(userResponse);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default new UsersController();
