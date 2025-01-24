import {Post, PostRequest} from '@customTypes/Post';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const getAllPosts = async () => {
  const response = await axiosInstance.get<Post[]>(`/${ServerRoutes.POSTS}`);

  return response.data;
};

const getPostById = async (postId: string) => {
  const response = await axiosInstance.get<Post>(`/${ServerRoutes.POSTS}/${postId}`);

  return response.data;
};

const createNewPost = async (post: PostRequest) => {
  const response = await axiosInstance.post<Post>(`/${ServerRoutes.POSTS}`, post);

  return response.data;
};

export {getAllPosts, getPostById, createNewPost};
