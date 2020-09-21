/**
 * 构建工作流
 */

const WebpackConfig = require('./webpack-config')
const { extendConfig, setMode, logVersion, loadPlugins } = require('./common/util.js')
const logProgress = require('./common/log-progress')

module.exports = async options => {
  options.base64ImageMaxSize && (process.env.lf$base64ImageMaxSize = options.base64ImageMaxSize)
  options.disableFileNameHash && (process.env.lf$disableFileNameHash = options.disableFileNameHash)

  const mode = 'production'

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

  // 执行扩展配置函数
  if (extendConfigFunc) {
    const __extendConfig__ = await extendConfigFunc({
      mode,
      webpackConfig
    })
    __extendConfig__ && __extendConfig__.webpackConfig && (webpackConfig = __extendConfig__.webpackConfig)
  }

  // 进度输出控制台
  logProgress.show(mode)

  // 启动 webpack
  webpackConfig = webpackConfig.toConfig ? webpackConfig.toConfig() : webpackConfig
  require('webpack')(webpackConfig, (error, stats) => {
    if (error || stats.hasErrors()) {
      error && console.error(error)
      stats.hasErrors() && console.error(stats.toString({
        chunks: false,
        colors: true
      }))
      process.exit(1)
    }

    console.log(stats.toString({
      chunks: false,
      colors: true
    }))
  })
}
