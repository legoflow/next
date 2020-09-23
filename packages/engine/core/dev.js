/**
 * 开发工作流
 */

const WebpackConfig = require('./webpack-config')
const { extendConfig, setMode, logVersion, loadPlugins } = require('./common/util.js')
const findFreePort = require('find-free-port')
const chalk = require('chalk')
const logProgress = require('./common/log-progress')

module.exports = async () => {
  const mode = 'development'
  // 局域网 IP
  const ip = require('ip').address()

  // 设置 webpack mode
  setMode(mode)

  // 打印 cli 版本号
  logVersion()

  // 扩展配置
  const extendConfigFunc = extendConfig()

  // 构建基础 webpack config
  let webpackConfig = WebpackConfig()

  // 加载插件
  await loadPlugins({ webpackConfig })

  // dev server 配置
  let webpackDevServerConfig = {
    host: '0.0.0.0',
    contentBase: './public',
    publicPath: '/',
    watchContentBase: true,
    hot: true,
    historyApiFallback: false,
    compress: false,
    noInfo: false,
    lazy: false,
    quiet: true,
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    },
    filename: 'bundle.js',
    proxy: {},
    disableHostCheck: true,
    https: false
  }

  // 执行扩展配置函数
  if (extendConfigFunc) {
    const __extendConfig__ = await extendConfigFunc({
      mode,
      webpackConfig,
      webpackDevServerConfig
    })
    __extendConfig__ && __extendConfig__.webpackConfig && (webpackConfig = __extendConfig__.webpackConfig)
    __extendConfig__ && __extendConfig__.webpackDevServerConfig && (webpackDevServerConfig = __extendConfig__.webpackDevServerConfig)
  }

  // 进度输出控制台
  logProgress.show(mode)

  // webpack
  webpackConfig = webpackConfig.toConfig ? webpackConfig.toConfig() : webpackConfig

  const compiler = require('webpack')(webpackConfig)
  const port = await new Promise(resolve => findFreePort(8080, ip, (error, port) => {
    if (error) throw error
    resolve(port)
  }))

  // webpack dev server
  const WebpackDevServer = require('webpack-dev-server')
  new WebpackDevServer(compiler, webpackDevServerConfig).listen(port, '0.0.0.0')

  // 控制台打印 server 信息
  compiler.hooks.done.tap('lf-engine dev', stats => {
    const protocol = webpackDevServerConfig.https ? 'https:' : 'http:'
    const hasError = stats.hasErrors()

    hasError && console.error(stats.toString({
      chunks: false,
      colors: true
    }))

    console.log('  App running at:')
    console.log(`  - Local:   ${(!hasError ? chalk.cyan : chalk.red)(`${protocol}//127.0.0.1:${port}/`)}`)
    console.log(`  - Network: ${(!hasError ? chalk.cyan : chalk.red)(`${protocol}//${process.env.DOCKER_HOST_IP || ip}:${port}/`)}`)
    console.log('\n')
  })
}
