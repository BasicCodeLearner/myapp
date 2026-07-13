import express from 'express';

import type { Request, Response } from 'express';

const app = express();

app.use(express.json());

// 定义商品数据结构的契约
interface Product {
    id: number;
    name: string;
    price: number;
    detail: string;
}

const products: Product[] = [
    { id: 1, name: '雷神游戏笔记本', price: 8999, detail: '16核CPU，满血RTX4060显卡。' },
    { id: 2, name: '机械键盘', price: 399, detail: '红轴机械开关，PBT键帽。' }
];

// 商品列表接口（无需认证）
app.get('/api/product/list', (req: Request, res: Response) => {
    res.json(products);
});

// 定义详情接口的路径参数类型
interface DetailParams {
    id: string;
}

// 商品详情接口（无需认证）
app.get('/api/product/detail/:id', (req: Request<DetailParams>, res: Response) => {
    const productId = parseInt(req.params.id, 10);
    const product = products.find((p) => p.id === productId);
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: '商品不存在' });
    }
});

const PORT: number = 3001;
app.listen(PORT, () => console.log(`📦 商品微服务已启动: ${PORT}`));
