const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const glob = require('glob');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const layuiSrc ='./node_modules/layui-src/src/lay';
const templatePath = 'template/';
const staticPath = 'static/';

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
                    filename: templatePath + `${pageName}.html`,
                    chunks: [pageName],
                    inject: true,
                    //html-文件压缩参数
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreak: false,
                        minifyCSS: true, //用于压缩开始时内联的CSS
                        minifyJS: true,  //用于压缩开始时内联的JS
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

module.exports =  {
    entry:  entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: staticPath + 'js/[name]_[chunkhash:8].js'
    },
    mode: 'production',
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
                    MiniCssExtractPlugin.loader,
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
                    // //移动端css px转rem
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
                    {
                        loader:  'file-loader',
                        options:{
                            name: staticPath + 'img/[name]_[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader:  'file-loader',
                        options: {
                            name: staticPath + 'fonts/[name]_[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        //css-文件指纹以及抽取
        new MiniCssExtractPlugin({
            filename: staticPath + 'css/[name]_[contenthash:8].css'
        }),
        //清理输出目录
        new CleanWebpackPlugin(),
        //css-文件压缩
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        // 静态资源输出,不需要经过webpack处理，直接输出到指定的地方
        new CopyWebpackPlugin([{
            from:path.resolve(__dirname, layuiSrc), to:'./lay'
        }]),
        //ProvidePlugin只有你在使用到此库的时候，才会打包进去
        new webpack.ProvidePlugin({
            $: 'jquery'
        })

    ].concat(HtmlWebpackPlugins),
    optimization: {
        splitChunks: {
            cacheGroups: {
                //打包多次请求的js文件
                commons: {
                    name: "commons",
                    chunks: "all", // 必须三选一： "initial" | "all" | "async"(默认就是async)
                    minChunks: 1 // 某个方法至少引用了两次，才会单独抽离
                },
                //提取js公共部分
                // vendors: {
                //     test: /(react|react-dom)/,
                //     name: "vendors", // 要缓存的 分隔出来的 chunk 名称,需加入到html输出的脚本里
                //     chunks: "all"
                // }
            }
        }
    },

};