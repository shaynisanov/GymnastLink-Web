import {Request, Response} from 'express';
import {BaseController} from './baseController';
import {IPost, postModel} from '../models/postsModel';
import {RequestWithUserId} from '../types/request';
import {commentModel} from '../models/commentsModel';
import {userModel} from '../models/usersModel';

class PostsController extends BaseController<IPost> {
  constructor() {
    super(postModel);
  }

  async getAll(req: Request, res: Response) {
    const userId = req.query.userId;

    try {
      let posts;

      if (userId) {
        posts = await this.model.find({userId});
      } else {
        posts = await this.model.find();
      }

      const mappedPost = await Promise.all(
        posts.map(async (item) => {
          const commentCount = await commentModel.countDocuments({
            postId: item._id,
          });
          const postUser = await userModel.findById(item.userId);

          return {
            ...item.toObject(),
            commentCount,
            user: {
              id: postUser?._id.toString(),
              userName: postUser?.userName,
              profileImageUrl: postUser?.profileImageUrl,
            },
          };
        })
      );

      res.send(mappedPost);
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
