// Vite config for Reveal.me frontend
import { defineConfig } from 'vite';
// Vite plugin for React: provides JSX support, fast refresh, etc.
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
  server: {
    port: 5173,
  },
}); 