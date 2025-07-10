import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  r => r,
  e => {
    if (e.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(e);
  }
); 