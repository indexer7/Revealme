import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLatestScore, fetchBreakdown, fetchTrend, fetchHistory } from '../api/report';
import OESRing from '../components/OESRing';
import RadarChart from '../components/RadarChart';
import TrendChart from '../components/TrendChart';
import SummaryCards from '../components/SummaryCards';
import PenaltyViz from '../components/PenaltyViz';
import HistoryTable from '../components/HistoryTable';

export default function Dashboard() {
  const { data: scoreData, isLoading: scoreLoading } = useQuery({
    queryKey: ['report', 'score'],
    queryFn: fetchLatestScore,
  });
  
  const { data: breakdownData, isLoading: breakdownLoading } = useQuery({
    queryKey: ['report', 'breakdown'],
    queryFn: fetchBreakdown,
  });
  
  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ['report', 'trend'],
    queryFn: fetchTrend,
  });
  
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['report', 'history'],
    queryFn: fetchHistory,
  });

  // Show loading state while data is being fetched
  if (scoreLoading || breakdownLoading || trendLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Fallback data if API is not available
  const score = scoreData?.data?.score || 72;
  const radarData = breakdownData?.data || [
    { category: 'D1', value: 8 },
    { category: 'D2', value: 20 },
    { category: 'D3', value: 15 },
    { category: 'D4', value: 12 },
    { category: 'D5', value: 10 },
    { category: 'D6', value: 7 }
  ];
  const trendDataPoints = trendData?.data || [
    { timestamp: 'Day 1', score: 60 },
    { timestamp: 'Day 2', score: 72 },
    { timestamp: 'Day 3', score: 68 },
    { timestamp: 'Day 4', score: 75 },
    { timestamp: 'Day 5', score: 70 }
  ];
  
  const summary = historyData?.data?.map((r: any) => ({ 
    title: r.name, 
    value: r.value,
    change: r.change,
    changeType: r.changeType
  })) || [
    { title: 'Scans this week', value: 5, change: '+2', changeType: 'positive' as const },
    { title: 'Avg. score', value: 68, change: '+3', changeType: 'positive' as const },
    { title: 'High risk items', value: 2, change: '-1', changeType: 'positive' as const },
    { title: 'Active scans', value: 1, change: '0', changeType: 'neutral' as const }
  ];
  
  const penaltySteps = breakdownData?.data?.map((b: any) => ({ 
    text: `${b.category} (${b.value})`, 
    penalty: b.penalty || 0 
  })) || [
    { text: 'No DMARC/SPF/DKIM configured', penalty: 3 },
    { text: 'Expired SSL certificate', penalty: 2 },
    { text: 'Open ports detected', penalty: 5 },
    { text: 'Weak password policy', penalty: 2 },
    { text: 'Missing security headers', penalty: 3 }
  ];

  // Mock history data for demonstration
  const mockHistoryData = [
    {
      id: '1',
      date: '2024-01-15T10:30:00Z',
      score: 85,
      target: 'example.com',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-14T14:20:00Z',
      score: 72,
      target: 'test.org',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-01-13T09:15:00Z',
      score: 45,
      target: 'demo.net',
      status: 'completed'
    }
  ];

  const reports = historyData?.data || mockHistoryData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to Reveal.me - OSINT-Driven Cyber-Risk Assessment Platform
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex gap-4">
              <Link
                to="/input"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Start New Scan
              </Link>
              <Link
                to="/scan"
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                View Scans
              </Link>
              <Link
                to="/admin"
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                User Management
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8">
          <SummaryCards items={summary} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* OES Ring Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">OES Score</h2>
            <OESRing score={score} />
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Categories</h2>
            <RadarChart data={radarData} />
          </div>
        </div>

        {/* Trend Chart */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Trend</h2>
            <TrendChart data={trendDataPoints} />
          </div>
        </div>

        {/* Penalty Visualization */}
        <div className="mb-8">
          <PenaltyViz steps={penaltySteps} />
        </div>

        {/* Report History */}
        <div className="mb-8">
          <HistoryTable reports={reports} isLoading={historyLoading} />
        </div>
      </div>
    </div>
  );
} 