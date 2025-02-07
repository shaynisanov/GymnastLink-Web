import {Comment, CommentRequest} from '@customTypes/Comment';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const getAllComments = async (postId: string) => {
  const response = await axiosInstance.get<Comment[]>(`/${ServerRoutes.COMMENTS}`, {
    params: {
      postId,
    },
  });

  return response.data;
};

const createNewComment = async (newComment: CommentRequest) => {
  const response = await axiosInstance.post<Comment>(`/${ServerRoutes.COMMENTS}`, newComment);

  return response.data;
};

const deleteCommentsByPostId = async (postId: string) => {
  await axiosInstance.delete(`${ServerRoutes.COMMENTS}`, {
    params: {
      postId,
    },
  });
};

export {getAllComments, createNewComment, deleteCommentsByPostId};
