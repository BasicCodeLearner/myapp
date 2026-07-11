const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
const SECRET_KEY = 'company_secret_key_123456';

// 🛠️ JWT 纯数学验钞零件（中间件）
const verifyTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 剥离出 Bearer 后面的 Token 字符串

    if (!token) return res.status(401).json({ message: '凭证缺失，拒绝访问' });

    // 纯数学解密验证，不上网调用别的服务
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: '凭证无效或已过期，请重新登录' });
        
        req.userId = decoded.userId; // 解密成功，把用户ID挂在请求上，交给下一个函数
        next();
    });
};

// 购买接口（必须挂载验钞零件）
app.post('/api/purchase/submit', verifyTokenMiddleware, (req, res) => {
    const { productId } = req.body;
    console.log(`用户 ${req.userId} 正在请求购买商品 ${productId}`);
    res.json({ success: true, message: `购买成功！已成功为用户 ${req.userId} 下单商品 ${productId}` });
});

app.listen(3002, () => console.log('💰 购买微服务已启动: 3002'));
