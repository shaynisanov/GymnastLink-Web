import {User} from '@customTypes/User';

interface PostRequest {
  content: string;
  imageUrl: string | null;
  userId: string;
  createdTime: string;
}

interface Post extends Omit<PostRequest, 'userId'> {
  _id: string;
  likes: string[];
  user: User;
  commentCount: number;
}

export type {Post, PostRequest};
