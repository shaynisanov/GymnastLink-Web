import {model, Schema, Types} from 'mongoose';

interface IComments {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComments>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Posts',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const commentModel = model('Comments', commentSchema);

export type {IComments};
export {commentModel};
