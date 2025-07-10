import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../../api/auth';
import toast from 'react-hot-toast';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const mutation = useMutation({
    mutationFn: login as (data: FormValues) => Promise<any>,
    onSuccess: () => {
      toast.success('Logged in');
      qc.invalidateQueries();
      navigate('/');
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="max-w-sm mx-auto p-4">
      <h1 className="text-xl mb-4">Login</h1>
      <input {...register('email')} placeholder="Email" className="block w-full mb-2 border rounded p-2" />
      {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      <input {...register('password')} type="password" placeholder="Password" className="block w-full mb-4 border rounded p-2" />
      {errors.password && <p className="text-red-600">{errors.password.message}</p>}
      <button type="submit" disabled={mutation.isPending} className="w-full bg-blue-600 text-white p-2 rounded">
        {mutation.isPending ? 'Logging in…' : 'Log In'}
      </button>
    </form>
  );
} 