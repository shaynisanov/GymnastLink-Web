interface Post {
  _id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  createdTime: string;
}

type PostRequest = Omit<Post, '_id'>;
export type {Post, PostRequest};
