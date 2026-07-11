import { createRouter, createWebHistory } from 'vue-router'
// 1. 引入我们自己的商品大厅画面（作为首页显示）
import ProductView from '../views/ProductView.vue'

const router = createRouter({
  // 核心修改：直接写入 '/myapp/'，锚定你的项目名 http://IP/myapp/
  history: createWebHistory('/myapp/'),
  
  routes: [
    {
      // 🛍️ 默认首页：展示商品大厅
      path: '/',
      name: 'products',
      component: ProductView,
    },
    {
      // 🎟️ 登录模块画面
      path: '/login',
      name: 'login',
      // 采用懒加载模式引入
      component: () => import('../views/LoginView.vue'),
    },
    {
      // 💰 购买模块结算画面
      path: '/purchase',
      name: 'purchase',
      component: () => import('../views/PurchaseView.vue'),
    },
  ],
})

export default router
