import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BASE_URL__: JSON.stringify('http://mainline.proxy.rlwy.net:27071/api'),
  },
  preview: {
    allowedHosts: [
      'charismatic-generosity-production-57b7.up.railway.app',
      'crossover.proxy.rlwy.net'
    ]
  }
})
