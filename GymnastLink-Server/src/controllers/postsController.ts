import {Request, Response} from 'express';
import {BaseController} from './baseController';
import {IPost, postModel} from '../models/postsModel';
import {RequestWithUserId} from '../types/request';

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

  async handleLike(req: RequestWithUserId, res: Response): Promise<void> {
    const {postId} = req.params;

    try {
      const post = await this.model.findById(postId);
      if (!post) {
        res.status(404).send('Post not found');
        return;
      }

      if (post.likes.includes(req.body.userId)) {
        post.likes = post.likes.filter(
          (id: any) => id.toString() !== req.body.userId.toString()
        ) as any;
      } else {
        post.likes.push(req.body.userId);
      }

      await post.save();
      res.status(200).send(post);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default new PostsController();
