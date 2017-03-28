/*-----------------------------
 单页面应用发布打包环境构建
 命令：npm run build
 作者：qing.yan@click-v.com
 */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');

module.exports = {
    //单入口
    entry: {
        'bundle': './src/main.js',
        'vendor': ['react','./src/main.js']
    },
    //输入选项
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.[hash].js",
        publicPath: './', //html注入css和js时的目录
        sourceMapFilename: 'bundle.map'
    },
    //打开sourcemap，方便调试js
    devtool: '#source-map',
    module: {
        rules: [
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=fonts/[name].[hash].[ext]'
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=images/[name].[hash].[ext]'
            }, {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }, {
                test: /\.(scss|sass)$/,
                loader: ExtractTextPlugin.extract({fallbackLoader: "style-loader", loader: "css-loader!sass-loader?root=./src!postcss-loader"})
            }, {
                test: /\.js?$/, //表示要变异的文件的类型，这里要编译的是js文件
                loader: 'babel-loader', //装载的哪些模块
                exclude: /node_modules/, //标示不变异node_modules文件夹下面的内容
                query: { //具体的编译的类型，
                    compact: false //表示不压缩
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
        new ExtractTextPlugin('style.[hash].css'),
        //scss的兼容性配置
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer()]
            }
        }),
        //提取出react核心包
        new webpack.optimize.CommonsChunkPlugin(
            {name:'vendor', filename:'vendor.[hash].js'}
        ),
        //js压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}