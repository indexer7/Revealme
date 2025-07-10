import { api } from './client';

export function launchScan(data: { domain: string; email: string; phone: string }) {
  return api.post('/scans', data);
}

export function getScanStatus(id: string) {
  return api.get(`/scans/${id}/status`);
} 