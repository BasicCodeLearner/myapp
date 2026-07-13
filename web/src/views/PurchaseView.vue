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
        
        <!-- 🌟 优化：根据不同状态切换按钮文字，且当 loading 或 paySuccess 为 true 时都禁用按钮 -->
        <!-- 🌟 优化：通过 :class 当支付成功时追加 btn-success-disabled 样式 -->
        <button 
          :class="['btn-pay', { 'btn-success-disabled': paySuccess }]" 
          @click="handlePay" 
          :disabled="loading || paySuccess"
        >
          {{ loading ? '正在提交...' : (paySuccess ? '✓ 支付已完成' : '确认安全支付') }}
        </button>
      </div>

      <p v-if="resultMsg" :class="['result-message', { 'is-error': isError }]">{{ resultMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { request } from '../utils/api'; 

const route = useRoute();
const router = useRouter();

const productId = ref('');
const loading = ref(false);
const resultMsg = ref('');
const isError = ref(false); 
const paySuccess = ref(false); // 🌟 新增：标记是否成功完成支付

onMounted(() => {
  // 1. 防偷渡线：检查 URL 里到底有没有带商品 ID 过来
  const targetProductId = route.query.productId;
  
  if (!targetProductId) {
    router.push('/');
    return;
  }

  // 2. 安全防线：如果带了商品 ID，但发现没登录，照常踢去登录页
  const token = localStorage.getItem('token');
  if (!token) {
    router.push({
      path: '/login',
      query: { 
        productId: targetProductId,
        redirect: '/purchase' 
      }
    });
    return;
  }

  // 3. 只有既带了商品 ID、又登录成功的正规军，才允许留下并绑定数据
  productId.value = targetProductId;
});

// 返回商品大厅
const goBack = () => {
  router.push('/'); 
};

// 点击支付
const handlePay = async () => {
  loading.value = true; 
  resultMsg.value = ''; 
  isError.value = false; 
  paySuccess.value = false; // 每次点击时重置成功状态

  try {
    const res = await request('/myapp/api/purchase/submit', { 
      method: 'POST', 
      body: JSON.stringify({ productId: productId.value }) 
    });

    if (res && res.success) { 
      resultMsg.value = `🎉 恭喜！${res.message}`; 
      paySuccess.value = true; // 🌟 核心：支付成功，激活不可逆转状态
    } else if (res) {
      isError.value = true;
      resultMsg.value = `❌ 支付失败：${res.message || '未知错误'}`;
    }
  } catch (error) {
    isError.value = true; 
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
  background-color: #c8e6c9; /* 正在加载时的绿色禁用色 */
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

.result-message.is-error {
  background-color: #fef0f0;
  color: #f56c6c;
}

/* 🌟 新增：支付成功后，按钮被强制变灰的专属样式 */
.btn-pay.btn-success-disabled,
.btn-pay.btn-success-disabled:hover {
  background-color: #909399 !important; /* 沉稳的灰色 */
  color: #ffffff !important;
  cursor: not-allowed;
}
</style>
