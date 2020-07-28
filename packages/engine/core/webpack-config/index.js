/**
 * webpack 配置工厂
 */

const Config = require('webpack-chain')
const { getMode, getSourceMap } = require('../common/util')

module.exports = () => {
  const mode = getMode()
  const sourceMap = getSourceMap()
  const config = new Config()

  // mode
  config.mode(mode)

  // devtool
  config.devtool(sourceMap)

  // entry
  require('./entry')({ config })

  // output
  require('./output')({ config })

  // rule
  require('./rule')({ config })

  // plugin
  require('./plugin')({ config })

  // resolve
  require('./resolve')({ config })

  // build optimization
  mode === 'production' && require('./optimization')({ config })

  return config
}
