/**
 * 扩展 legoflow-engine webpack 配置 vue 项目
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { VueLoaderPlugin } = require('vue-loader')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = ({ webpackConfig }) => {
  // entry
  webpackConfig
    .entryPoints
    .delete('main')
    .clear()
    .end()
    .entry('main')
    .add('./src/main.ts')
    .end()

  // rule - ts
  webpackConfig
    .module
    .rule('ts')
    .test(/\.*(ts|tsx)$/)
    .use('babel-loader').loader('babel-loader').end()
    .use('ts-loader').loader('ts-loader').options({
      appendTsSuffixTo: [/\.vue$/],
      transpileOnly: true
    }).end()

  // rule - vue
  webpackConfig
    .module
    .rule('vue')
    .before('ts')
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
    .use(VueLoaderPlugin)

  webpackConfig
    .plugin('fork-ts-checker')
    .use(ForkTsCheckerWebpackPlugin)

  webpackConfig
    .plugin('User/DefinePlugin')
    .use(webpack.DefinePlugin, [{
      'process.env.BUILD_MODE': `"${process.env.BUILD_MODE}"`
    }])
}
