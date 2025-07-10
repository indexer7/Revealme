import { api } from './client';

export const fetchUsers = () => api.get('/admin/users');

export const createUser = (u: { email: string; password: string; role: string }) =>
  api.post('/admin/users', u);

export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`);
export const updateWeights = (weights: Record<string, number>) =>
  api.put('/admin/weights', weights); 