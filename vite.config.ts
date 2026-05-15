import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // GitHub Pages 部署时使用仓库名作为 base 路径
  // 本地开发时可通过环境变量覆盖: BASE_URL=/ npm run dev
  base: process.env.BASE_URL || '/sbl-platform/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
