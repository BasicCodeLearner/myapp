import express = require('express');
import jwt = require('jsonwebtoken');

import type { Request, Response } from 'express';

const app = express();

app.use(express.json());

// 🌟 所有微服务公用的验钞密钥（生产环境中会读环境变量）
const SECRET_KEY: string = process.env.SECRET_KEY || 'company_secret_key_123456';

// 定义接口请求体的类型对账单
interface LoginRequestBody {
    username?: string;
    password?: string;
}

app.post('/api/auth/login', (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === '123456') {
        // 签发手环 Token，并在里面揉进用户ID
        const token = jwt.sign(
            { userId: 1001, role: 'admin' }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );
        res.json({ success: true, message: '登录成功', token });
    } else {
        res.status(401).json({ success: false, message: '账号或密码错误' });
    }
});

const PORT: number = 3000;
app.listen(PORT, () => console.log(`🎟️ 登录微服务已启动: ${PORT}`));
