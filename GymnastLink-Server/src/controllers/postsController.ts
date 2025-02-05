import {Request, Response} from 'express';
import {BaseController} from './baseController';
import {IPost, postModel} from '../models/postsModel';

class PostsController extends BaseController<IPost> {
  constructor() {
    super(postModel);
  }

  async getAll(req: Request, res: Response) {
    const userId = req.query.userId;

    try {
      if (userId) {
        const items = await this.model.find({userId});
        res.send(items);
      } else {
        const items = await this.model.find();
        res.send(items);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default new PostsController();
