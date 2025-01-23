import axios from 'axios';
import Cookies from 'js-cookie';
import {ServerRoutes} from '@enums/serverRoutes';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('access_token');

    if (accessToken && config.url !== `/${ServerRoutes.AUTH}/logout`) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(`${BASE_URL}/${ServerRoutes.AUTH}/refresh-token`, {refreshToken});

          const newAccessToken = response.data.accessToken;
          Cookies.set('access_token', newAccessToken);
          Cookies.set('refresh_token', response.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axios(originalRequest);
        } catch (error) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

export {axiosInstance};
