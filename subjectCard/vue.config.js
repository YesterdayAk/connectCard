module.exports = {
    runtimeCompiler: true,
    lintOnSave: false,
    devServer: {
        host: '0.0.0.0',
        port: "8081",
        overlay: {
            warning: false,
            errors: false
        },
        proxy: {
            '/api': {
                //target: 'https://binzhoujifuka.qdszgh.cn/',
                // target: 'http://192.168.0.127:3666/',
                target: 'https://zxsbzzqjk.qdszgh.cn/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
        },
    },
}