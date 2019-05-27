const axios = require('axios');

//中间件方式处理axios 
//拦截器
//请求拦截
axios.interceptors.request.use(
    (config) => {
        if (localStorage.getItem('lyz-blog-token')) {
            //要将返回的token 存入到localstorage
            config.headers.Authorization = localStorage.getItem('lyz-blog-token');
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
)

//响应拦截
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (err) => {
        const { status } = err.response;
        // 后端对非法请求会返回 401 Unauthorized.
        if (status == 401) {
            localStorage.removeItem("lyz-blog-token");
            //刷新页面
            window.location.reload();
        }
        return Promise.reject(err);
    }
)

module.exports = axios;