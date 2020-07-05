const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); //引入清除文件插件



const path = require('path');//引入path模块
function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}


module.exports = {
    publicPath: process.env.NODE_ENV === 'production'? '/production-sub-path/': '/',
    outputDir:'dist',
    assetsDir:'static',
    indexPath:'index.html',
    filenameHashing:true,
    pages: {
        index: {
          // entry for the page
          entry: 'src/main.js',
          // the source template
          template: 'public/index.html',
          // output as dist/index.html
          filename: 'index.html',
          // when using title option,
          // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
          title: 'Bing Bang Pong',
          // chunks to include on this page, by default includes
          // extracted common chunks and vendor chunks.
          chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        // when using the entry-only string format,
        // template is inferred to be `public/subpage.html`
        // and falls back to `public/index.html` if not found.
        // Output filename is inferred to be `subpage.html`.
        // subpage: 'src/subpage/main.js'
    },
    lintOnSave:true,
    transpileDependencies: [ /* string or regex */ ],
    productionSourceMap:true,
    crossorigin: "",
    integrity: false,
    //  调整内部的 webpack 配置
    configureWebpack: (config) => {
        new CleanWebpackPlugin() //设置清除的目录
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(new BundleAnalyzerPlugin())
        }
    }, //(Object | Function)
    // 是一个函数，允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack: (config) => {
        // 配置别名
        config.resolve.alias
        .set('@', resolve('src'))
        .set('assets', resolve('src/assets'))
        .set('components', resolve('src/components'))
        .set('views', resolve('src/views'))

        config.optimization.minimizer('terser').tap((args) => {
        // 去除生产环境console
        args[0].terserOptions.compress.drop_console = true
        return args
        })
    },
    devServer: {
    open: false, // 配置自动启动浏览器  open: 'Google Chrome'-默认启动谷歌
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
        '/api': {
                target: "http://app.rmsdmedia.com",
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    "^/api": ""
                }
            }, 
        '/foo': {
            target: '<other_url>'
        }
    },
    before: app => {}
    },
    // CSS 相关选项
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        sourceMap: true,
        // css预设器配置项
        loaderOptions: {
          postcss: {
            plugins: [
            //   require('postcss-px2rem')({
            //     remUnit: 100,
            //   }),
            ],
          },
        },
        // 启用 CSS modules for all css / pre-processor files.
        requireModuleExtension: true
      },


    // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`  
    // 在多核机器下会默认开启。
    parallel: require('os').cpus().length > 1,
    // PWA 插件的选项。
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md
    pwa: {},
    // 三方插件的选项
    pluginOptions: {
        'style-resources-loader':{
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, './src/assets/css/index.less')] // less所在文件路径
        },

    }
    
    
}