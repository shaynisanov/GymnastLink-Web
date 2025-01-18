import {model, Schema, Types} from 'mongoose';

interface IPost {
  title: string;
  content: string;
  userId: Types.ObjectId;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
});

const postModel = model('Posts', postSchema);

export type {IPost};
export {postModel};
