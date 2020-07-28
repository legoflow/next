/**
 * webpack 配置 - entry
 */

module.exports = ({ config }) => {
  config
    .entry('main')
    .add('./src/main.js')
    .end()
}
