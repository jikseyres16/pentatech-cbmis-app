import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/cbmis/',   // 👈 ensures correct asset paths when built
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/cbmis/api': {
        target: 'http://webserver:80',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
