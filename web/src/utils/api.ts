// 📐 定义一个通用的扩展请求配置接口
interface CustomRequestInit extends RequestInit {
    // 允许传入覆盖或自定义的 headers
    headers?: Record<string, string>;
}

/**
 * 🚀 强类型通用请求工具函数
 * @param url 请求物理路径
 * @param options 请求配置项（如 method, body 等）
 * @returns 经过类型对账后的后端返回数据
 */
export const request = async <T = any>(
    url: string, 
    options: CustomRequestInit = {}
): Promise<T | null> => {
    
    const token = localStorage.getItem('token');
    
    // 初始化并对齐 headers 账本
    options.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // 自动挂载手环 Token
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, options as RequestInit);

        // 🚨 核心拦截：如果任何一个后端微服务报 401
        if (response.status === 401) {
            localStorage.removeItem('token'); // 清理垃圾Token
            const currentPath = window.location.pathname + window.location.search;
            // 强踢到 myapp 项目的登录页，小尾巴记住当前所在的页面
            window.location.href = `/myapp/login?redirect=${encodeURIComponent(currentPath)}`;
            return null;
        }

        // 显式断言为我们期望的泛型 T
        return await response.json() as T;
    } catch (error) {
        console.error('网络请求异常', error);
        throw error;
    }
};
