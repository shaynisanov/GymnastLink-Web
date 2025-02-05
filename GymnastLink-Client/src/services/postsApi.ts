import {Post, PostRequest} from '@customTypes/Post';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const getAllPosts = async () => {
  const response = await axiosInstance.get<Post[]>(`/${ServerRoutes.POSTS}`);

  return response.data;
};

const getUserPosts = async (userId?: string) => {
    const response = await axiosInstance.get<Post[]>(`/${ServerRoutes.POSTS}`, {params: userId});

    return response.data;
}

const getPostById = async (postId: string) => {
  const response = await axiosInstance.get<Post>(`/${ServerRoutes.POSTS}/${postId}`);

  return response.data;
};

const createNewPost = async (newPost: PostRequest) => {
  const response = await axiosInstance.post<Post>(`/${ServerRoutes.POSTS}`, newPost);

  return response.data;
};

const updatePost = async (postId: string, editedPost: PostRequest) => {
  const response = await axiosInstance.put<Post>(`/${ServerRoutes.POSTS}/${postId}`, editedPost);

  return response.data;
};

const deletePost = async (postId: string) => {
  await axiosInstance.delete(`/${ServerRoutes.POSTS}/${postId}`);
};

const handleLike = async (postId: string) => {
  const response = await axiosInstance.post(`/${ServerRoutes.POSTS}/like/${postId}`);

  return response.data;
};

export {getAllPosts, getUserPosts, getPostById, createNewPost, updatePost, deletePost, handleLike};
