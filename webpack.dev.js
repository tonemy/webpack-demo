const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const glob = require('glob');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const layuiSrc =  './node_modules/layui-src/src/lay' ;

//多页面输出应用打包
const setMPA = () => {
    const entry = {};
    const HtmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/js/index.js'));
    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];
            const match = entryFile.match(/src\/(.*)\/js\/index\.js/);
            const pageName = match && match[1];
            // console.log('match',match);
            entry[pageName] = entryFile;
            // console.log('fileName',pageName)
            HtmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, `./src/${pageName}/index.html`),
                    filename: `${pageName}.html`,
                    chunks: [pageName],
                    inject: true,
                    //html-文件压缩
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreak: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false
                    }
                })
            )
        })
    // console.log("entryfiles",entryFiles);
    return {
        entry,
        HtmlWebpackPlugins
    }
}
const {entry, HtmlWebpackPlugins} = setMPA();


module.exports = {
    entry:  entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[hash:8].js'
    },
    mode: 'development',
    //资源解析
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    //css 自动补齐前缀处理
                    {
                        loader: 'postcss-loader',
                        options:{
                            plugins: () => [
                                require('autoprefixer')({
                                    overrideBrowserslist : ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    // // 移动端css px转rem
                    // {
                    //     loader: 'px2rem-loader',
                    //     options: {
                    //         remUnit: 75,
                    //         remPrecision: 8
                    //     }
                    // }
                ]
            },
            {
                test: /.(png|jpg|jepg|gif|svg)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        //css-文件指纹以及抽取
        new MiniCssExtractPlugin({
            filename: '[name]_[hash:8].css'
        }),
        //清理输出目录
        new CleanWebpackPlugin(),
        // 静态资源输出,不需要经过webpack处理，直接输出到指定的地方
        new CopyWebpackPlugin([{
            from:path.resolve(__dirname, layuiSrc), to:'lay'
        }]),
        //ProvidePlugin只有你在使用到定义的库的时候，才会打包进去
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ].concat(HtmlWebpackPlugins),

    //代码热更新
    devServer: {
        contentBase: './dist',
        hot: true
    },
    //代码调试
    // devtool: 'source-map'
};

