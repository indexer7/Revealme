import { useContext } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedLayout() {
  const { user } = useContext(AuthContext);
  const loc = useLocation();

  if (!user) return <Navigate to="/login" replace />;
  if (loc.pathname.startsWith('/admin') && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
} 