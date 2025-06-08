import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
        ],
      },
    }),
  ],
  define: {
    '__VUE_PROD_DEVTOOLS__': false,
    '__REACT_DEVTOOLS_GLOBAL_HOOK__': { isDisabled: true },
    'process.env': {},
  },
  server: {
    host: true,
    port: 5173,
    open: true,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@containers': path.resolve(__dirname, './src/containers'),
      '@context': path.resolve(__dirname, './src/context'),
      '@services': path.resolve(__dirname, './src/services'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },
  optimizeDeps: {
    exclude: ['firebase', 'firebase/app', 'firebase/firestore'],
    include: ['react', 'react-dom']
  },
  build: {
    chunkSizeWarningLimit: 1600
  }
});