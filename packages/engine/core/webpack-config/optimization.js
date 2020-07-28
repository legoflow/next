/**
 * webpack optimization 配置
 */

module.exports = ({ config }) => {
  config
    .optimization
    .minimizer('terser-webpack-plugin')
    .use(require('terser-webpack-plugin'), [{
      cache: true,
      parallel: true,
      sourceMap: true,
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
    .minimizer('optimize-css-assets-webpack-plugin')
    .use(require('optimize-css-assets-webpack-plugin'), [{
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        autoprefixer: { browsers: ['> 0.01%'] },
        map: {
          inline: false,
          annotation: true
        }
      },
      canPrint: true
    }])
}
