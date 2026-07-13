<template>
  <div style="padding: 40px; text-align: center; background-color: #fff; max-width: 300px; margin: 100px auto; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1);">
    <h2>🎟️ 用户登录 (myapp)</h2>
    <input v-model="username" placeholder="请输入 admin" style="width:100%; padding:8px; margin-bottom:15px;" /><br>
    <input v-model="password" type="password" placeholder="请输入 123456" style="width:100%; padding:8px; margin-bottom:20px;" /><br>
    <button @click="login" style="width:100%; padding:10px; background:#409eff; color:white; border:none; border-radius:4px; cursor:pointer;">登 录</button>
    <p style="color: #f56c6c; margin-top: 15px;">{{ errMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // 🌟 1. 引入 Vue Router 的核心组合式 API
import { request } from '../utils/api';

const router = useRouter(); // 🌟 用于控制跳转动作
const route = useRoute();   // 🌟 用于读取当前 URL 中的参数

const username = ref('');
const password = ref('');
const errMsg = ref('');

const login = async () => {
  // 调用登录认证微服务 (指向端口 3000)
  const res = await request('/myapp/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: username.value, password: password.value })
  });

  if (res && res.success) {
    localStorage.setItem('token', res.token);
    
    // 🌟 2. 优雅地通过 Vue Router 获取传过来的参数（省去了复杂的原生 URL 解析）
    const redirectPath = route.query.redirect; // 拿到 '/purchase'
    const productId = route.query.productId;   // 拿到商品 ID
    
    if (redirectPath) {
      // 🟢 如果有指定目的地，使用 router.push 进行页面无刷新跳转，并把商品ID带过去
      router.push({
        path: redirectPath,
        query: productId ? { productId } : {} // 最终会跳到 /purchase?productId=xxx
      });
    } else {
      // 🔵 如果是单纯点进登录页面的，登录成功后直接返回商品大厅首页
      router.push('/');
    }
  } else if (res) {
    errMsg.value = res.message;
  }
};
</script>
