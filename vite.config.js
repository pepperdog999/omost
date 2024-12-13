import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // 改为绝对路径
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    cors: true
  }
}) 