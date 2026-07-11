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
import { request } from '../utils/api';

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
    
    // 🌟 顺着小尾巴原路返回
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    window.location.href = redirectUrl ? redirectUrl : '/myapp/';
  } else if (res) {
    errMsg.value = res.message;
  }
};
</script>
