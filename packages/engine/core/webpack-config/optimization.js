/**
 * webpack optimization 配置
 */

module.exports = ({ config }) => {
  config
    .optimization
    .minimizer('terser-webpack-plugin')
    .use(require('terser-webpack-plugin'), [{
      parallel: true,
      terserOptions: {
        parse: {
          ecma: 8
        },
        compress: {
          ecma: 5,
          warnings: false,
          comparisons: false,
          inline: 2
        },
        mangle: {
          safari10: true
        },
        output: {
          ecma: 5,
          comments: false
        }
      }
    }])

  config
    .optimization
    .minimizer('css-minimizer-webpack-plugin')
    .use(require('css-minimizer-webpack-plugin'), [{}])
}
