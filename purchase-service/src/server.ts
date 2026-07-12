import express = require('express');
import jwt = require('jsonwebtoken');

import type { Request, Response, NextFunction } from 'express';

import type { JwtPayload } from 'jsonwebtoken';

const app = express();

app.use(express.json());
const SECRET_KEY: string = process.env.SECRET_KEY || 'company_secret_key_123456';

// 📐 1. 扩展 Express 的 Request 接口，允许挂载自定义的 userId
interface AuthenticatedRequest extends Request {
    userId?: number | undefined; 
    role?: string;
}

// 📐 2. 定义解密后的 Token 载荷结构
interface CustomJwtPayload extends JwtPayload {
    userId?: number;
    role?: string;
}

// 🛠️ JWT 纯数学验钞零件（中间件）
const verifyTokenMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 剥离出 Bearer 后面的 Token 字符串

    if (!token) {
        return res.status(401).json({ message: '凭证缺失，拒绝访问' });
    }

    // 纯数学解密验证，不上网调用别的服务
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err || !decoded) {
            return res.status(401).json({ message: '凭证无效或已过期，请重新登录' });
        }
        
        // 显式断言类型为我们定义的 CustomJwtPayload
        const payload = decoded as CustomJwtPayload;
        
        req.userId = payload.userId; // 解密成功，把用户ID挂在请求上，交给下一个函数
        next();
    });
};

// 定义购买接口请求体的类型契约
interface PurchaseRequestBody {
    productId?: number;
}

// 购买接口（必须挂载验钞零件）
app.post(
    '/api/purchase/submit', 
    verifyTokenMiddleware as express.RequestHandler, // 转换为标准的中间件类型
    (req: AuthenticatedRequest, res: Response) => {
        const { productId } = req.body as PurchaseRequestBody;
        
        console.log(`用户 ${req.userId} 正在请求购买商品 ${productId}`);
        res.json({ 
            success: true, 
            message: `购买成功！已成功为用户 ${req.userId} 下单商品 ${productId}` 
        });
    }
);

const PORT: number = 3002;
app.listen(PORT, () => console.log(`💰 购买微服务已启动: ${PORT}`));
