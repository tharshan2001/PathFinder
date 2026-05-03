import axios from 'axios';
import { useToastStore } from '../stores/toastStore';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      useToastStore.getState().error('Your session has expired. Please sign in again.');
      window.location.href = '/';
    } else if (status === 403) {
      useToastStore.getState().error(message || 'You do not have permission to perform this action.');
    } else if (status === 500) {
      useToastStore.getState().error('Something went wrong on our end. Please try again later.');
    } else if (status === 404) {
      useToastStore.getState().error(message || 'The requested resource was not found.');
    } else if (message) {
      useToastStore.getState().error(message);
    }

    return Promise.reject(error);
  }
);

export default api;