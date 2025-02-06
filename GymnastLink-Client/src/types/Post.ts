import {User} from '@customTypes/User';

interface PostRequest {
  content: string;
  imageUrl: string | null;
  user: User;
  createdTime: string;
}

interface Post extends PostRequest {
  _id: string;
  likes: string[];
  commentCount: number;
}

export type {Post, PostRequest};
