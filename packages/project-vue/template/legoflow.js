/**
 * 扩展 legoflow-engine webpack 配置 vue 项目
 */
module.exports = ({ webpackConfig }) => {
  // rule - vue
  webpackConfig
    .module
    .rule('vue')
    .before('js')
    .test(/\.vue$/)
    .use('vue-loader').loader('vue-loader').options({
      compilerOptions: {
        preserveWhitespace: false
      }
    }).end()

  // vue css
  webpackConfig
    .module
    .rule('css')
    .test(/\.css$/)
    .oneOf('vue-css')
    .resourceQuery(/^\?vue/)
    .use('vue-style-loader').loader('vue-style-loader').end()
    .use('css-loader').loader('css-loader').end()
    .use('postcss-loader').loader('postcss-loader').end()
    .end()

  // vue scss
  webpackConfig
    .module
    .rule('sass')
    .test(/\.s(a|c)ss$/)
    .oneOf('vue-sass')
    .resourceQuery(/^\?vue/)
    .use('vue-style-loader').loader('vue-style-loader').end()
    .use('css-loader').loader('css-loader').end()
    .use('postcss-loader').loader('postcss-loader').end()
    .use('sass-loader').loader('sass-loader').options({
      implementation: require('sass')
    }).end()
    .end()

  // vue plugin
  webpackConfig
    .plugin('vue-loader')
    .use(require('vue-loader/lib/plugin'))
}
