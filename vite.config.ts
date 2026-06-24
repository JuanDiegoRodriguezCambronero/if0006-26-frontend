import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/products': {
        target: 'https://if0006-26-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
