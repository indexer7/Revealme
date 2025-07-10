import React from 'react';

interface PenaltyStep {
  text: string;
  penalty: number;
  category?: string;
}

export default function PenaltyViz({ steps }: { steps: PenaltyStep[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Penalty Breakdown</h3>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <span className="text-gray-700">{step.text}</span>
            <span className="text-red-600 font-semibold">-{step.penalty}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Penalty</span>
          <span className="text-xl font-bold text-red-600">
            -{steps.reduce((sum, step) => sum + step.penalty, 0)}
          </span>
        </div>
      </div>
    </div>
  );
} 