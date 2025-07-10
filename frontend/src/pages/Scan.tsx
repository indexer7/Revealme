import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { launchScan } from '../api/scan';

export default function Scan() {
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const mutation = useMutation({
    mutationFn: launchScan,
    onSuccess: (data) => {
      console.log('Scan launched:', data);
      setDomain('');
      setEmail('');
      setPhone('');
    },
    onError: (error) => {
      console.error('Scan failed:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ domain, email, phone });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">OSINT Scan</h1>
          <p className="mt-2 text-gray-600">
            Launch comprehensive OSINT scans to assess cyber-risk posture
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">New Scan</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                Domain
              </label>
              <input
                type="text"
                id="domain"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="Enter domain (e.g., example.com)"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={mutation.isPending || (!domain && !email && !phone)}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 'Launching Scan...' : 'Launch Scan'}
              </button>
              {mutation.isPending && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Processing...
                </div>
              )}
            </div>
          </form>
          {mutation.isSuccess && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">
                Scan launched successfully! Check the dashboard for progress updates.
              </p>
            </div>
          )}
          {mutation.isError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">
                Failed to launch scan. Please try again.
              </p>
            </div>
          )}
        </div>
        {/* Scan Information */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About OSINT Scans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">What we scan:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Domain registration information</li>
                <li>• DNS records and configurations</li>
                <li>• SSL/TLS certificate details</li>
                <li>• Open ports and services</li>
                <li>• Email security configurations</li>
                <li>• Social media presence</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Risk assessment:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Security vulnerabilities</li>
                <li>• Data exposure risks</li>
                <li>• Reputation analysis</li>
                <li>• Compliance gaps</li>
                <li>• Threat intelligence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 