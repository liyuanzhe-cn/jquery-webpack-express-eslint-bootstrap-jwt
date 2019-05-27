//webpack是node 写出来的

//引入绝对路径的解析模块
let path = require('path');
//html-webpack-plugin 插件是用于编译 Webpack 项目中的 html 类型的文件
let HtmlWebpackPlugin = require('html-webpack-plugin');
// 压缩css的插件
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
//压缩css插件
let OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
//压缩js插件 
let UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
// 引入webpack ， 使用webpack.ProvidePlugin
let webpack = require('webpack');

module.exports = {
    devServer: { //开发服务器的配置
        host: 'localhost',
        port: 3000, // 
        progress: true, //进度条+
        contentBase: './build', //文件路径
        open: true, //打开浏览器
        proxy: { // 配置跨域
            '/api': {
                target: 'http://localhost:5000/api/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
    },
    entry: { //多入口
        info: './src/js/info.js',
        article: './src/js/article.js',
        index: './src/js/index.js',
    },
    output: {
        filename: '[name].bundle.js', //打包后的文件名,可以加入哈希防止缓存 'bundle.[hash:5].js'
        path: path.resolve(__dirname, 'build'), //路径必须是绝对路径 当前目录下的build文件夹
    },
    mode: "production",
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['index']
            // hash: true, //引入文件路径后面加入哈希
        }),
        new HtmlWebpackPlugin({
            template: './src/info.html',
            filename: 'info.html',
            chunks: ['info']
            // hash: true, //引入文件路径后面加入哈希
        }),
        new HtmlWebpackPlugin({
            template: './src/article.html',
            filename: 'article.html',
            chunks: ['article']
            // hash: true, //引入文件路径后面加入哈希
        }),
        new MiniCssExtractPlugin({
            filename: "./css/[name].[hash:7].css",
            chunkFilename: "[id].css", // css目录下的main.css下

        }),
    ],
    externals: { //不打包的插件
        jquery: '$'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ["html-withimg-loader"]
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src/js'),
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: { //把es6 -> es5
                        presets: [
                            "@babel/preset-env"
                        ],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose": true }],
                            ["@babel/plugin-transform-runtime"]
                        ]
                    }
                },
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5 * 1024,
                        //url-loader 如果图片小于1000k会转为base64url，否则用file-loader
                        outputPath: '/image'
                        //生成到这个目录下
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
        ]
    },
}


// 作者：liyuanzhe-cn
// 链接：https://juejin.im/post/5cdd6a8cf265da03981fed4c
//         来源：掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。