import {model, Schema, Types} from 'mongoose';

interface IPost {
  content: string;
  imageUrl: string | null;
  userId: Types.ObjectId;
  createdTime: string;
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
});

const postModel = model('Posts', postSchema);

export type {IPost};
export {postModel};
