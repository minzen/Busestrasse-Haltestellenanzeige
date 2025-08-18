import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/busestrasse/anzeige/',
  plugins: [react()],
   server: {
    proxy: {
      // kaikki /api/* pyynnöt ohjataan Node-proxylle
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
