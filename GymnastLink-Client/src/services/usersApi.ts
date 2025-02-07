import {LoggedUser, User} from '@customTypes/User';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const getUserById = async (userId: string) => {
  const response = await axiosInstance.get<User>(`/${ServerRoutes.USERS}/${userId}`);

  return response.data;
};

const updateUserProfilePicture = async (imageUrl: string) => {
  const response = await axiosInstance.put<LoggedUser>(`/${ServerRoutes.USERS}/profile-picture`, {imageUrl});

  return response.data;
};

const updateUserName = async (userName: string) => {
  const response = await axiosInstance.put<LoggedUser>(`/${ServerRoutes.USERS}/username`, {userName});

  return response.data;
};

export {getUserById, updateUserProfilePicture, updateUserName};
