import axios from 'axios';

const REACT_APP_API_URL = 'https://self-collection-server.onrender.com';
export const instance = axios.create({
  baseURL: REACT_APP_API_URL
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
});
