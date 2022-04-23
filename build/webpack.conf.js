const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = require('./config');
console.log(config)
module.exports = {
  // 模式
  mode: 'production',
  // 入口
  entry: {
    app: ['./src/index.js']
  },
  // 输出
  output: {
    path: path.resolve(process.cwd(), './lib'),
    publicPath: '/dist/',
    // 输出的文件名
    filename: 'index.js',
    // 初始的chunk文件名称
    chunkFilename: '[id].js',
    //  library 暴露为 AMD 模块。 在 AMD 或 CommonJS 的 require 之后可访问（libraryTarget:'umd'）
    libraryTarget: 'umd',
    // 入口的默认导出将分配给 library target：
    // if your entry has a default export of `MyDefaultModule`
    // var MyDefaultModule = _entry_return_.default;
    libraryExport: 'default',
    // 输出一个库，为你的入口做导出。
    library: 'ELEMENT',
    // 会把 AMD 模块命名为 UMD 构建
    umdNamedDefine: true,
    // 为了使 UMD 构建在浏览器和 Node.js 上均可用，应将 output.globalObject 选项设置为 'this'。对于类似 web 的目标，默认为 self。
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  // 解析
  resolve: {
    // 能够使用户在引入模块时不带扩展.尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    extensions: ['.js', '.vue', '.json'],
    // 创建 import 或 require 的别名，来确保模块引入变得更简单。
    alias: config.alias
  },
  // 外部扩展
  externals: {
    vue: config.vue
  },
  // 优化
  optimization: {
    // 允许你通过提供一个或多个定制过的 TerserPlugin 实例， 覆盖默认压缩工具(minimizer)
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  // 性能
  performance: {
    // 不展示警告或错误提示。
    // 官网推荐使用error,有助于防止把体积大的bundle部署到生产环境,从而影响网页的性能
    // 很奇怪这里要把它关闭
    hints: false
  },
  // stats对象
  stats: {
    // 告知 stats 是否添加关于子模块的信息。
    children: false
  },
  // 模块
  module: {
    // 使用babel-loader和vue-loader
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: config.jsexclude,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      }
    ]
  },
  // 插件
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin()
  ]
};
