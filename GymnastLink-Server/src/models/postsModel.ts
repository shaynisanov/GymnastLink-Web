import {model, Schema, Types} from 'mongoose';

interface IPost {
  content: string;
  imageUrl?: string;
  userId: Types.ObjectId;
  createdTime: string;
  likes: [Types.ObjectId];
}

const postSchema = new Schema<IPost>({
  content: {
    type: String,
    required: true,
  },
  imageUrl: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  createdTime: {
    type: String,
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'Users',
    default: [],
  },
});

const postModel = model('Posts', postSchema);

export type {IPost};
export {postModel};
