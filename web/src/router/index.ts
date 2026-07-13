import { createRouter, createWebHistory } from 'vue-router'
// 引入商品页面作为首页显示
import ProductView from '../views/ProductView.vue'

const router = createRouter({
  // 核心修改：直接写入 '/myapp/'，锚定你的项目名 http://IP/myapp/
  history: createWebHistory('/myapp/'),
  
  routes: [
    {
      // 🛍️ 商品页面
      path: '/',
      name: 'products',
      component: ProductView,
    },
    {
      // 🎟️ 登录页面
      path: '/login',
      name: 'login',
      // 采用懒加载模式引入
      component: () => import('../views/LoginView.vue'),
    },
    {
      // 💰 购买页面
      path: '/purchase',
      name: 'purchase',
      // 采用懒加载模式引入
      component: () => import('../views/PurchaseView.vue'),
    },
  ],
})

export default router
