import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // 🌟 保持和你的新项目名、IIS虚拟目录名一致的基准路径
  base: '/myapp/', 
  
  plugins: [
    vue(),
  ],
  
  resolve: {
    alias: {
      // 🌟 标准的别名配置，确保在 TS 下引入 @/utils/api 能够被正确识别
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  // 🌟 核心：配置本地开发服务器的代理网关，解决 JSON 解析报 '<' (HTML) 的错误
  server: {
    proxy: {
      // 1. 登录微服务分流 (auth-service: 端口 3000)
      '^/myapp/api/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/myapp/, '') // 转发时去掉 /myapp，变成 /api/auth/...
      },
      // 2. 商品微服务分流 (product-service: 端口 3001)
      '^/myapp/api/product': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/myapp/, '') // 转发时变成 /api/product/...
      },
      // 3. 购买微服务分流 (purchase-service: 端口 3002)
      '^/myapp/api/purchase': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/myapp/, '') // 转发时变成 /api/purchase/...
      }
    }
  }
})
