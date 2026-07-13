<template>
  <div id="app-layout">
    <header class="nav-header">
      <router-link to="/">🛍️ 商品大厅</router-link>
      <!-- 未登录时显示登录 -->
      <router-link v-if="!isLogin" to="/login">🎟️ 账户登录</router-link>
      <!-- 已登录时显示退出登录 -->
      <a v-else @click="handleLogout" href="javascript:;" class="logout-btn">👋 退出登录</a>
    </header>

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

const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLogin.value = !!token;
};

onMounted(() => {
  checkLoginStatus();
});

// 监听路由变化，实时更新登录状态
watch(() => route.path, () => {
  checkLoginStatus();
});

const handleLogout = () => {
  localStorage.removeItem('token');
  isLogin.value = false;
  router.push('/');
};
</script>

<style scoped>
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
.logout-btn {
  text-decoration: none;
  color: #606266;
  cursor: pointer;
}
.logout-btn:hover {
  color: #f56c6c !important;
}
.content {
  padding: 20px;
}
</style>
