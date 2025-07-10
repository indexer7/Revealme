import { api } from './client';

export function login(data: { email: string; password: string }) {
  return api.post('/auth/login', data);
} 