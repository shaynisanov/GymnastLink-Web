interface Comment {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  createdTime: string;
}

type CommentRequest = Omit<Comment, '_id'>;
export type {Comment, CommentRequest};
