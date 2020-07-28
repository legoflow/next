/**
 * 扩展 legoflow-engine webpack 配置 jquery 项目
 */

module.exports = ({ webpackConfig }) => {
  webpackConfig
    .module
    .rule('tpl')
    .test(/\.tpl/)
    .exclude
    .add(/node_modules/)
    .end()
    .use('tpl')
    .loader('art-template-loader')
    .end()

  webpackConfig
    .plugin('html-webpack-plugin')
    .use(require('html-webpack-plugin'), [{
      template: './src/templates/index.tpl',
      filename: 'index.html',
      templateParameters: {
        title: 'Page 1',
        page: 1
      }
    }])

  webpackConfig
    .plugin('html-webpack-plugin-2')
    .use(require('html-webpack-plugin'), [{
      template: './src/templates/index.tpl',
      filename: 'index2.html',
      templateParameters: {
        title: 'Page 2',
        page: 2
      }
    }])
}
