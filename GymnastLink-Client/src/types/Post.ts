interface Post {
  _id: string;
  content: string;
  imageUrl: string | null;
  userId: string;
  createdTime: string;
  likes: string[]
}

type PostRequest = Omit<Post, '_id'>;
export type {Post, PostRequest};
