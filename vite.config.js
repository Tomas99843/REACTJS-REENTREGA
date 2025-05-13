import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // Permite acceso desde la red local
    port: 5173,         // Puerto por defecto
    open: true,         // Abre automáticamente el navegador
    strictPort: true,   // Evita cambiar el puerto si está ocupado
  },
  resolve: {
    alias: {
      // Aliases para todas las carpetas importantes
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/context'),
      '@services': path.resolve(__dirname, './src/services'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@pages': path.resolve(__dirname, './src/pages'),
    }
  },
  build: {
    outDir: 'dist',     // Carpeta de producción
    emptyOutDir: true,  // Limpia la carpeta antes de cada build
    sourcemap: true,    // Genera sourcemaps para debugging
  },
  base: '/',           // Ruta base para despliegue (ajusta si usas subdirectorio)
});