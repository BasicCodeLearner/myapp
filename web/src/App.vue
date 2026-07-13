<template>
  <nav>
      <!-- 必须用 router-link，地址栏才会变 -->
      <router-link to="/">商品大厅</router-link> | 
      <router-link to="/login">登录</router-link> | 
      <router-link to="/purchase">结算</router-link>
  </nav>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
/* 这里可以放一些全系统的全局基础样式 */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}
</style>
