interface PostRequest {
  content: string;
  imageUrl: string | null;
  userId: string;
  createdTime: string;
}

interface Post extends PostRequest {
  _id: string;
  likes: string[];
  commentCount: number;
}

export type {Post, PostRequest};
