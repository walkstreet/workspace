/*-----------------------------
 单页面应用开发环境构建
 命令：npm run dev
 作者：qing.yan@click-v.com
 备注：目前scss文件编译后会在源文件所属目录自动创建一个.js的文件，具体原因还需进一步观察，和ExtractTextPlugin，scss编译无关。
 */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');

module.exports = {
    //单入口
    entry: [
        'webpack-dev-server/client?http://localhost:3000', 
        'webpack/hot/only-dev-server', 
        './src/main.js'
    ],
    //输入选项
    output: {
        path: path.join(__dirname, 'build'),
        filename: "bundle.js",
        publicPath: './', //html注入css和js时的目录
        sourceMapFilename: 'bundle.map'
    },
    //打开sourcemap，方便调试js
    devtool: '#inline-source-map',
    module: {
        rules: [
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=images/[name].[ext]'
            }, {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }, 
            {
                test: /\.(scss|sass)$/,
                loader: "style-loader!css-loader!sass-loader?root=./src!postcss-loader?sourceMap"
            },{
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },{
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    compact: false
                }
            }
        ]
    },
    resolve: {
        extensions: [
            '.js',
            '.png',
            '.gif',
            '.jpg'
        ]
    },
    plugins: [
        //html模板，带自动注入功能
        new HtmlWebpackPlugin({
            template: './src/index.html', //html的源文件地址
            inject: 'body', //js注入的位置
            title: 'React', //html里head中的title标签
            favicon: '', //页面的.ico
            minify: false,
            cache: false,
            hash: false,
            showErrors: true
        }),
        //scss的兼容性配置
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer()]
            }
        }),
        //热加载
        new webpack.HotModuleReplacementPlugin()
    ],
    //缓存，增量调试，加快速度
    cache: true
}