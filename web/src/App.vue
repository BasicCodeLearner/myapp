<template>
  <div id="app-layout">
    <!-- 头部导航栏 -->
    <header class="nav-header">
      <router-link to="/">🛍️ 商品大厅</router-link>
      
      <!-- 🌟 核心：使用 v-if 判断。只有当 isLogin 为 false（未登录）时才显示登录 Link -->
      <router-link v-if="!isLogin" to="/login">🎟️ 账户登录</router-link>
      
      <!-- 💡 赠送贴心小功能：已登录时，可以显示一个“退出登录”的假 Link 提高体验 -->
      <a v-else @click="handleLogout" href="javascript:;" class="logout-btn">👋 退出登录</a>
    </header>

    <!-- 核心视图渲染坑位 -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isLogin = ref(false);

// 检查登录状态的函数
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLogin.value = !!token; // 如果有 token 就是 true，没有就是 false
};

// 1. 页面首次加载时，检查一次状态
onMounted(() => {
  checkLoginStatus();
});

// 2. 🌟 灵魂监听：每次路由发生变化时（比如从 /login 成功跳回 /），重新检查本地 Token
// 这样可以确保用户刚点完登录按钮跳回来时，顶部的“账户登录”字样会立刻瞬间消失！
watch(() => route.path, () => {
  checkLoginStatus();
});

// 退出登录的逻辑
const handleLogout = () => {
  localStorage.removeItem('token'); // 擦除手环
  isLogin.value = false;           // 改变状态
  router.push('/');                // 轰回首页
};
</script>

<style scoped>
/* 简单的导航样式优化 */
.nav-header {
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  gap: 20px;
}
.nav-header a {
  text-decoration: none;
  color: #606266;
  font-size: 16px;
}
.router-link-active {
  color: #409eff !important;
  font-weight: bold;
}
.logout-btn:hover {
  color: #f56c6c !important;
}
</style>
