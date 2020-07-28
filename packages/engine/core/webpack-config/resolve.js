/**
 * webpack 配置 - resolve
 */

const path = require('path')
const { getProjectRoot } = require('../common/util')

module.exports = ({ config }) => {
  const projectRoot = getProjectRoot()

  // alias
  config
    .resolve
    .alias
    .set('@', path.resolve(projectRoot, 'src'))

  // extensions
  config
    .resolve
    .extensions
    .add('.js')
    .add('.jsx')
    .add('.ts')
    .add('.tsx')
    .add('.vue')
    .add('.html')
    .add('.scss')
    .add('.css')
    .add('.json')
}
