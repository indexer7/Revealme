import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateWeights } from '../../api/admin';
import toast from 'react-hot-toast';

export default function Weights() {
  const defaultWeights: Record<string, number> = { D1: 10, D2: 25, D3: 20, D4: 20, D5: 15, D6: 10 };
  const [weights, setWeights] = useState<Record<string, number>>(defaultWeights);
  
  const mutation = useMutation({
    mutationFn: updateWeights,
    onSuccess: () => {
      toast.success('Weights saved successfully');
    },
    onError: (e: any) => {
      toast.error(e.message || 'Failed to save weights');
    },
  });

  const handleWeightChange = (key: string, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    mutation.mutate(weights);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Adjust Scoring Weights</h1>
          
          <div className="space-y-4">
            {Object.entries(weights).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  {key}:
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => handleWeightChange(key, +e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Total:</span>
              <span className="text-sm font-bold text-gray-900">
                {Object.values(weights).reduce((sum: number, weight: number) => sum + weight, 0 as number)}%
              </span>
            </div>
            
            <button
              onClick={handleSave}
              disabled={mutation.isPending}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {mutation.isPending ? 'Saving...' : 'Save Weights'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 