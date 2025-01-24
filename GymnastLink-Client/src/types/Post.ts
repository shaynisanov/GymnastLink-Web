interface Post {
  _id: string;
  content: string;
  image?: string;
  userId: string;
  createdTime: string;
}

type PostRequest = Omit<Post, '_id'>;
export type {Post, PostRequest};
