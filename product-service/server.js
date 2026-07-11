const express = require('express');
const app = express();

const products = [
    { id: 1, name: '雷神游戏笔记本', price: 8999, detail: '16核CPU，满血RTX4060显卡。' },
    { id: 2, name: '机械键盘', price: 399, detail: '红轴机械开关，PBT键帽。' }
];

// 商品列表接口（无需认证）
app.get('/api/product/list', (req, res) => res.json(products));

// 商品详情接口（无需认证）
app.get('/api/product/detail/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    product ? res.json(product) : res.status(404).json({ message: '商品不存在' });
});

app.listen(3001, () => console.log('📦 商品微服务已启动: 3001'));
