import {model, Schema} from 'mongoose';

interface IUser {
  _id: string;
  email: string;
  password: string;
  userName: string;
  profileImage?: string;
  refreshToken?: string[];
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  profileImage: String,
  refreshToken: {
    type: [String],
    default: [],
  },
});

const userModel = model<IUser>('Users', userSchema);

export type {IUser};
export {userModel};
