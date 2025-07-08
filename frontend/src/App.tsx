// App root for Reveal.me frontend
// Renders a Card component for sanity check
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import HomePage from '@/pages/HomePage';
import AssessmentPage from '@/pages/AssessmentPage';
import FlowDiagramPage from '@/pages/FlowDiagramPage';
import ScanStatusPage from '@/pages/ScanStatusPage';
import ScoringPage from '@/pages/ScoringPage';
import ReportPage from '@/pages/ReportPage';
import UploadPage from '@/pages/UploadPage';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui';

// App component sets up all main routes for the Reveal.me frontend
export default function App() {
  return (
    // MainLayout wraps all pages with sidebar, header, etc.
    <MainLayout>
      {/* Routes define the SPA navigation structure */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<AssessmentPage />} />
        <Route path="/flow" element={<FlowDiagramPage />} />
        <Route path="/status/:jobId" element={<ScanStatusPage />} />
        <Route path="/scoring/:jobId" element={<ScoringPage />} />
        <Route path="/report/:jobId" element={<ReportPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </MainLayout>
  );
} 