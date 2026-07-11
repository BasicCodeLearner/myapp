<template>
  <div class="purchase-container">
    <div class="purchase-card">
      <h2>💰 结算收银台</h2>
      <hr />
      
      <div class="order-info">
        <p><strong>项目名称：</strong> myapp 微服务系统</p>
        <p><strong>购买商品ID：</strong> <span class="highlight">{{ productId }}</span></p>
        <p><strong>支付金额：</strong> <span class="price">￥99.00</span></p>
        <p><strong>支付方式：</strong> 局域网内部虚拟支付</p>
      </div>

      <div class="actions">
        <button class="btn-cancel" @click="goBack">返回商品大厅</button>
        <button class="btn-pay" @click="handlePay" :disabled="loading">
          {{ loading ? '正在提交...' : '确认安全支付' }}
        </button>
      </div>

      <p v-if="resultMsg" class="result-message">{{ resultMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { request } from '../utils/api'; // 引入我们高智商的统一请求拦截零件

const route = useRoute();
const router = useRouter();

const productId = ref('');
const loading = ref(false);
const resultMsg = ref('');

onMounted(() => {
  // 顺着路由拿到从商品页传过来的商品ID，如果没有默认给 1
  productId.value = route.query.productId || '1';
});

// 返回商品大厅
const goBack = () => {
  router.push('/');
};

// 点击支付
const handlePay = async () => {
  loading.value = true;
  resultMsg.value = '';

  try {
    // 🌟 关键：向 IIS 80 端口发起相对路径请求
    // IIS 将根据 web.config 自动将此请求转发给 3002 端口的 purchase-service
    const res = await request('/myapp/api/purchase/submit', {
      method: 'POST',
      body: JSON.stringify({ productId: productId.value })
    });

    // 如果 res 为空，说明触发了 api.js 里的 401 拦截，已经被踢去登录页了
    if (res && res.success) {
      resultMsg.value = `🎉 恭喜！${res.message}`;
    }
  } catch (error) {
    resultMsg.value = '❌ 支付失败，请检查购买微服务(3002)是否正常启动。';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.purchase-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  background-color: #f8f9fa;
  padding: 20px;
}
.purchase-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
}
h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}
hr {
  border: 0;
  border-top: 1px solid #eaeaea;
  margin-bottom: 20px;
}
.order-info p {
  font-size: 15px;
  color: #555;
  margin: 12px 0;
  line-height: 1.6;
}
.highlight {
  background: #e8f4ff;
  color: #409eff;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}
.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
}
.actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}
button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel {
  background-color: #f0f2f5;
  color: #606266;
}
.btn-cancel:hover {
  background-color: #e4e7ed;
}
.btn-pay {
  background-color: #67c23a;
  color: white;
  font-weight: bold;
}
.btn-pay:hover {
  background-color: #5daf34;
}
button:disabled {
  background-color: #c8e6c9;
  cursor: not-allowed;
}
.result-message {
  margin-top: 20px;
  text-align: center;
  padding: 10px;
  background-color: #f0f9eb;
  color: #67c23a;
  border-radius: 4px;
  font-weight: bold;
}
</style>
