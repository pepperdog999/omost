import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',  // 监听所有网络接口
    strictPort: true  // 如果端口被占用则报错而不是尝试下一个端口
  },
  base: './' // 添加这行，使用相对路径
}) 