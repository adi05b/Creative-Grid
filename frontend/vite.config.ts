
// vite.config.ts (in frontend root directory)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:8000',
        target: 'https://aditib-backend-hw3.wl.r.appspot.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})