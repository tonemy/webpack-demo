const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const glob = require('glob');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const layuiSrc ='node_modules/layui-src/src';


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
                    filename: `./template/${pageName}.html`,
                    chunks: [pageName, 'commons'],
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
        filename:  './static/js/[name]_[chunkhash:8].js'
    },
    mode: 'production',
    //资源解析
    resolve: {
        alias: {
            //路径配置,配合最上边的路径使用

            layui: path.resolve(__dirname, layuiSrc),

        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    // MiniCssExtractPlugin.loader,
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 这里可以指定一个 publicPath
                            // 默认使用 webpackOptions.output中的publicPath
                            publicPath: '../'
                        },
                    },
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
                test: /.(png|jpg|jepg|gif|svg|woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader:  'url-loader',

                        options:{
                            limit: 10240,
                            name: '[name]_[hash:8].[ext]',
                            publicPath: "../../static/layui-src/img/",
                            outputPath: "static/layui-src/img/"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        //css-文件指纹以及抽取
        new MiniCssExtractPlugin({
            filename:  'static/css/[name]_[contenthash:8].css',
            chunkFilename: "static/css/common.css",
            publicPath: "./static/"
        }),
        //清理输出目录
        new CleanWebpackPlugin(),
        //css-文件压缩
        // new OptimizeCssAssetsWebpackPlugin({
        //     assetNameRegExp: /\.css$/g,
        //     cssProcessor: require('cssnano'),
        //     cssProcessorPluginOptions: {
        //         preset: ['default', {
        //             discardComments: {
        //                 removeAll: true,
        //             },
        //             normalizeUnicode: false
        //         }]
        //     },
        //     canPrint: true
        // }),
        // 静态资源输出,不需要经过webpack处理，直接输出到指定的地方
        new CopyWebpackPlugin([{from: path.join(layuiSrc, 'lay'), to: 'static/js/lay'}]),
        new CopyWebpackPlugin([{from: path.join(layuiSrc, 'css'), to: 'static/js/css'}]),
        //ProvidePlugin只有你在使用到此库的时候，才会打包进去
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),


    ].concat(HtmlWebpackPlugins),

    optimization: {

        minimizer: [
            new OptimizeCssAssetsWebpackPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                // cssProcessorOptions: cssnanoOptions,
                cssProcessorPluginOptions: {
                    preset: ['default', {
                        discardComments: {
                            removeAll: true,
                        },
                        normalizeUnicode: false
                    }]
                },
                canPrint: true
            })
        ],

        splitChunks: {

            chunks: 'all',// 必须三选一： "initial" | "all"(默认就是all) | "async"
            minSize: 30,
            maxSize: 0,
            minChunks: 1,// 最小 chunk ，默认1
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            // automaticNameDelimiter: '~',
            name: 'commons', // 名称，此选项课接收 function,
            // filename: "commons",

            // filename: "static/js/commons.js",
            // filename: 'static/js/[name]_bundle_[hash].js',//打包后输出文件的文件名

            cacheGroups: {
                commons: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'commons',  // 打包后的文件名，任意命名
                    enforce: true,
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10,

                    // test: '/\.css$/',  // 只提取公共css ，命名可改styles
                    //             minChunks: 2, //表示提取公共部分最少的文件数
                    //             minSize: 0, //表示提取公共部分最小的大小
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                // styles: {
                //     name: '../css/styles',
                //     test: /\.css$/,
                //     chunks: 'initial',
                //     enforce: true,
                //     priority: 20,
                // }
            }
        }
    }

};