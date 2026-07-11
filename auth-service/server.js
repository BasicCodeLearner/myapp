const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// 🌟 所有微服务公用的验钞密钥（平岡さん提示：生产环境中会读环境变量）
const SECRET_KEY = 'company_secret_key_123456';

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === '123456') {
        // 签发手环 Token，并在里面揉进用户ID
        const token = jwt.sign({ userId: 1001, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ success: true, message: '登录成功', token });
    } else {
        res.status(401).json({ success: false, message: '账号或密码错误' });
    }
});

app.listen(3000, () => console.log('🎟️ 登录微服务已启动: 3000'));
