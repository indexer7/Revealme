import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '@/hooks/useAuth';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockAuth = {
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    isLoading: false,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuth}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render }; 