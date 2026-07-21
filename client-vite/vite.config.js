import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // or whatever your backend port is
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
