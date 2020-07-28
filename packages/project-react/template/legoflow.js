/**
 * 扩展 legoflow-engine webpack 配置 react 项目
 */

module.exports = ({ webpackConfig }) => {
  // entry
  webpackConfig
    .entryPoints.delete('main')

  webpackConfig
    .entry('main')
    .add('./src/index.tsx')
    .end()
}
