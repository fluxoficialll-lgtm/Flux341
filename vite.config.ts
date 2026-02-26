
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NOTA: A gestão de variáveis de ambiente foi simplificada.
// O Vite carrega automaticamente as variáveis de ambiente de ficheiros .env
// e expõe aquelas com o prefixo VITE_ em `import.meta.env`.
// O bloco `define` foi removido para evitar a substituição de código e falhas silenciosas.

export default defineConfig({
  root: __dirname,
  base: '/',
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false, // `false` para produção
    minify: 'terser',
    terserOptions: {
        compress: {
            drop_console: true,
            drop_debugger: true
        }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': __dirname,
      'hooks': path.resolve(__dirname, 'hooks'),
      'Componentes': path.resolve(__dirname, 'Componentes'),
      'ServiçosFrontend': path.resolve(__dirname, 'ServiçosFrontend'),
      'pages': path.resolve(__dirname, 'pages'),
      'utils': path.resolve(__dirname, 'utils'),
      'routes': path.resolve(__dirname, 'routes'),
      'styles': path.resolve(__dirname, 'styles'),
      'assets': path.resolve(__dirname, 'assets'),
    }
  }
});
