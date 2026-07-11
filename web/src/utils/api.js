export const request = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    options.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, options);

        // 🚨 核心拦截：如果任何一个后端微服务报 401
        if (response.status === 401) {
            localStorage.removeItem('token'); // 清理垃圾Token
            const currentPath = window.location.pathname + window.location.search;
            // 强踢到 myapp 项目的登录页，小尾巴记住当前所在的页面
            window.location.href = `/myapp/login?redirect=${encodeURIComponent(currentPath)}`;
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('网络请求异常', error);
        throw error;
    }
};
