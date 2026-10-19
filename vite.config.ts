import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5174,
    proxy: {
      '/api/crop-recommendation': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/api/crops': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/api/sample-conditions': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/api/ai-advisor': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/api/predict': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
      '/api/health/disease': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/health\/disease/, '/api/health')
      },
      '/api/health/recommendation': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/health\/recommendation/, '/api/health')
      }
    }
  }
})
