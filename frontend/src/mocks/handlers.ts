import { http, HttpResponse } from 'msw';
import type { 
  User, 
  AuthResponse, 
  ScanJob, 
  ScoringData, 
  ReportData,
  UploadFile 
} from '@/lib/types';

// Mock data
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  role: 'analyst',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockScanJob: ScanJob = {
  id: 'scan-123',
  targets: [
    { id: '1', value: 'example.com', type: 'domain' },
    { id: '2', value: '192.168.1.1', type: 'ip' },
  ],
  status: 'running',
  progress: 45,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockScoringData: ScoringData = {
  jobId: 'scan-123',
  weights: {
    osint: 25,
    technical: 30,
    reputation: 25,
    behavioral: 20,
  },
  scores: {
    overall: 75,
    osint: 80,
    technical: 70,
    reputation: 75,
    behavioral: 80,
  },
  chartData: [
    { category: 'OSINT', score: 80, weight: 25 },
    { category: 'Technical', score: 70, weight: 30 },
    { category: 'Reputation', score: 75, weight: 25 },
    { category: 'Behavioral', score: 80, weight: 20 },
  ],
};

// API handlers
export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json<AuthResponse>({
      user: mockUser,
      accessToken: 'mock-access-token',
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json<User>(mockUser);
  }),

  // Scan endpoints
  http.post('/api/scan', () => {
    return HttpResponse.json({ jobId: 'scan-123' });
  }),

  http.get('/api/scans/:jobId/status', () => {
    return HttpResponse.json<ScanJob>(mockScanJob);
  }),

  http.get('/api/scans/:jobId/tasks', () => {
    return HttpResponse.json([
      {
        id: 'task-1',
        jobId: 'scan-123',
        name: 'Domain Analysis',
        status: 'completed',
        progress: 100,
        startedAt: new Date(Date.now() - 60000).toISOString(),
        completedAt: new Date().toISOString(),
      },
      {
        id: 'task-2',
        jobId: 'scan-123',
        name: 'IP Analysis',
        status: 'running',
        progress: 45,
        startedAt: new Date(Date.now() - 30000).toISOString(),
      },
    ]);
  }),

  // Scoring endpoints
  http.get('/api/scoring/:jobId', () => {
    return HttpResponse.json<ScoringData>(mockScoringData);
  }),

  http.post('/api/scoring/:jobId/weights', () => {
    return HttpResponse.json<ScoringData>(mockScoringData);
  }),

  // Reports endpoints
  http.post('/api/reports/:jobId/generate', () => {
    return HttpResponse.json({ reportId: 'report-123' });
  }),

  http.get('/api/reports/:jobId', () => {
    return HttpResponse.json<ReportData>({
      jobId: 'scan-123',
      status: 'ready',
      downloadUrl: '/api/reports/scan-123/download',
      format: 'pdf',
      generatedAt: new Date().toISOString(),
    });
  }),

  // Upload endpoints
  http.post('/api/upload', () => {
    return HttpResponse.json<UploadFile>({
      id: 'file-123',
      filename: 'test-file.txt',
      size: 1024,
      type: 'text/plain',
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
    });
  }),

  http.get('/api/upload', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'file-1',
          filename: 'document1.pdf',
          size: 2048576,
          type: 'application/pdf',
          uploadedAt: new Date(Date.now() - 86400000).toISOString(),
          status: 'uploaded',
        },
        {
          id: 'file-2',
          filename: 'data.csv',
          size: 512000,
          type: 'text/csv',
          uploadedAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'uploaded',
        },
      ],
      total: 2,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    });
  }),
]; 