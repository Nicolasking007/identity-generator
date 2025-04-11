module.exports = {
    output: 'standalone', // 关键配置
    async rewrites() {
        return [
            // 测试环境
            {
                source: '/api/test/:path*',
                destination: 'https://yxd-reapp-h5-test-tx.yuxuandao.com/:path*'
            },
            // 预发布环境
            {
                source: '/api/beta/:path*',
                destination: 'https://yxd-reapp-uat-h5.yuxuandao.com/:path*'
            },
            // 生产环境
            {
                source: '/api/prod/:path*',
                destination: 'https://yxd-reapp-h5.yuxuandao.com/:path*'
            },
            // 默认重定向到测试环境（兼容旧代码）
            {
                source: '/api/:path*',
                destination: 'https://yxd-reapp-uat-h5.yuxuandao.com/:path*'
            }
        ]
    }
}
