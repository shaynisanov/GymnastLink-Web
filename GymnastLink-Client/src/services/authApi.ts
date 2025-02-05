import axios from 'axios';
import Cookies from 'js-cookie';
import {UserLoginForm} from '@components/LoginForm/form';
import {LoggedUser} from '@customTypes/User';
import {ServerRoutes} from '@enums/serverRoutes';
import {CredentialResponse} from '@react-oauth/google';
import {axiosInstance} from '@services/axiosConfig';
import {parseExpirationInDays} from '@utils/dateUtils';

const BASE_URL = import.meta.env.VITE_SERVER_URL;
const JWT_TOKEN_EXPIRES = import.meta.env.VITE_JWT_TOKEN_EXPIRES;

const registerUser = async (loginForm: UserLoginForm) => {
  await axios.post(`${BASE_URL}/${ServerRoutes.AUTH}/register`, loginForm);
};

const userLogin = async (loginForm: UserLoginForm) => {
  const response = await axios.post<LoggedUser>(`${BASE_URL}/${ServerRoutes.AUTH}/login`, loginForm);
  Cookies.set('access_token', response.data.accessToken, {expires: parseExpirationInDays(JWT_TOKEN_EXPIRES)});
  Cookies.set('refresh_token', response.data.refreshToken);

  return response.data;
};

const userLogout = async () => {
  const refreshToken = Cookies.get('refresh_token');

  if (refreshToken) {
    await axiosInstance.post(`/${ServerRoutes.AUTH}/logout`, {refreshToken});

    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  } else {
    throw new Error('No refresh token found');
  }
};

const getCurrentUserData = async () => {
  const response = await axiosInstance.get<LoggedUser>(`/${ServerRoutes.AUTH}/user-data`);

  return response.data;
};

const googleSignin = async (credentialResponse: CredentialResponse) => {
  const response = await axios.post<LoggedUser>(`${BASE_URL}/${ServerRoutes.AUTH}/google-signin`, {
    credential: credentialResponse.credential,
  });
  
  Cookies.set('access_token', response.data.accessToken, {expires: parseExpirationInDays(JWT_TOKEN_EXPIRES)});
  Cookies.set('refresh_token', response.data.refreshToken);

  return response.data;
};

export {registerUser, userLogin, userLogout, getCurrentUserData, googleSignin};
