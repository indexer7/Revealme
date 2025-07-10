import { api } from './client';

export const fetchLatestScore = () => api.get('/reports/latest/score');
export const fetchBreakdown = () => api.get('/reports/latest/breakdown');
export const fetchTrend = () => api.get('/reports/trends');
export const fetchHistory = () => api.get('/reports'); 