import axios from 'axios';

const REACT_APP_API_URL = 'http://localhost:4444';
export const instance = axios.create({
  baseURL: REACT_APP_API_URL
});
instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
})
