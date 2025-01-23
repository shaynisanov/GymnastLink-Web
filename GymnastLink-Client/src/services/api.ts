import {axiosInstance} from '@services/axiosConfig';
import axios from 'axios';
import Cookies from 'js-cookie';
import {UserLoginForm} from '@components/LoginForm/form';
import {LoggedUser} from '@customTypes/User';
import {parseExpirationInDays} from '@utils/dateUtils';

const BASE_URL = import.meta.env.VITE_SERVER_URL;
const JWT_TOKEN_EXPIRES = import.meta.env.VITE_JWT_TOKEN_EXPIRES;

const registerUser = async (loginForm: UserLoginForm) => {
  const response = await axios.post<LoggedUser>(`${BASE_URL}/users/register`, loginForm);

  return response.data;
};

const userLogin = async (loginForm: UserLoginForm) => {
  const response = await axios.post<LoggedUser>(`${BASE_URL}/users/login`, loginForm);
  Cookies.set('access_token', response.data.accessToken, {expires: parseExpirationInDays(JWT_TOKEN_EXPIRES)});
  Cookies.set('refresh_token', response.data.refreshToken);

  return response.data;
};

const userLogout = async () => {
  const refreshToken = Cookies.get('refresh_token');

  if (refreshToken) {
    await axiosInstance.post('/users/logout', {refreshToken});

    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  } else {
    throw new Error('No refresh token found');
  }
};

const getUserData = async () => {
  const response = await axiosInstance.get<LoggedUser>('/users/user-data');

  return response.data;
};

export {registerUser, userLogin, userLogout, getUserData};
