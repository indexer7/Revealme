import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import Scan from './pages/Scan';
import InputPage from './pages/Input';
import AdminConsole from './pages/Admin/UsersList';
import Weights from './pages/Settings/Weights';
import ProtectedLayout from './components/ProtectedLayout';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/input" element={<InputPage />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/admin" element={<AdminConsole />} />
            <Route path="/settings/weights" element={<Weights />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
} 