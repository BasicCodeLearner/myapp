<template>
  <div style="padding: 20px;">
    <h2>📦 商品大厅（项目名：myapp）</h2>
    <div style="display: flex; gap: 20px;">
      <div style="width: 250px; border-right: 1px solid #ccc;">
        <h3>商品列表</h3>
        <ul>
          <li v-for="p in productList" :key="p.id" @click="fetchDetail(p.id)" style="cursor:pointer; color:#409eff; margin-bottom:12px;">
            {{ p.name }} (￥{{ p.price }})
          </li>
        </ul>
      </div>
      <div style="flex: 1; padding-left: 20px;" v-if="detail">
        <h3>🔍 商品详细信息</h3>
        <p><strong>名称：</strong>{{ detail.name }}</p>
        <p><strong>价格：</strong>￥{{ detail.price }}</p>
        <p><strong>介绍：</strong>{{ detail.detail }}</p>
        <button @click="handlePurchase(detail.id)" style="padding: 10px 20px; background: #f56c6c; color: white; border: none; cursor: pointer; border-radius: 4px;">
          立即购买
        </button>
        <p v-if="buyMsg" style="color: #67c23a; font-weight: bold; margin-top: 10px;">{{ buyMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // 🌟 1. 引入路由
import { request } from '../utils/api';

const router = useRouter(); // 🌟 2. 初始化路由实例

const productList = ref([]);
const detail = ref(null);
const buyMsg = ref('');

onMounted(async () => {
  productList.value = await request('/myapp/api/product/list');
});

const fetchDetail = async (id) => {
  buyMsg.value = '';
  detail.value = await request(`/myapp/api/product/detail/${id}`);
};

const handlePurchase = async (productId) => {
  // 🌟 3. 从 localStorage 检查用户手环（Token）是否存在
  const token = localStorage.getItem('token'); 

  if (!token) {
    // 没登录：闪现到登录页，并用 query 把“商品ID”和“最终目的地”藏进 URL 里
    router.push({
      path: '/login',
      query: { 
        productId: productId,
        redirect: '/purchase' // 告诉登录页，待会登录完了去哪
      }
    });
    return;
  }

  // 已登录：直接带着商品ID，意气风发地飞向结算中心
  router.push({
    path: '/purchase',
    query: { productId: productId }
  });
};
</script>
