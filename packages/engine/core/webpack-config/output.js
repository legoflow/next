/**
 * webpack 配置 - 输出
 */

const path = require('path')
const { isWithHash, getProjectRoot } = require('../common/util')

module.exports = ({ config }) => {
  const hash = isWithHash()
  const projectRoot = getProjectRoot()

  config
    .output
    .path(path.resolve(projectRoot, 'dist'))
    .filename(`js/[name]${hash}.js`)
    .chunkFilename(`js/[name]${hash}.js`)
    .publicPath('./')
}
