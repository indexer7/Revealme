import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { launchScan } from '../api/scan';
import toast from 'react-hot-toast';

type FormValues = { domain: string; email: string; phone: string };

export default function InputPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: launchScan,
    onSuccess: ({ data }) => {
      toast.success('Scan started successfully');
      navigate(`/scan/${data.id}`);
    },
    onError: (e: any) => toast.error(e.message || 'Failed to start scan'),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">New OSINT Scan</h1>
          
          <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain
              </label>
              <input
                {...register('domain')}
                placeholder="Enter domain to scan"
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.domain && <p className="text-red-600 text-sm mt-1">{errors.domain.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('email')}
                placeholder="Enter email to scan"
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                {...register('phone')}
                placeholder="Enter phone to scan"
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {mutation.isPending ? 'Launching Scan...' : 'Start Scan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 