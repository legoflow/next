/**
 * webpack 配置 - rule
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { getMode, isWithHash } = require('../common/util')

module.exports = ({ config }) => {
  const mode = getMode()
  const hash = isWithHash()

  const miniCssOptions = {
    publicPath: '../'
  }

  // rule - js
  config
    .module
    .rule('js')
    .test(/\.*(js|jsx)$/)
    .exclude
    .add(/node_modules/)
    .end()
    .use('thread-loader').loader('thread-loader').end()
    .use('babel-loader').loader('babel-loader').end()

  // rule - ts
  config
    .module
    .rule('ts')
    .test(/\.*(ts|tsx)$/)
    .exclude
    .add(/node_modules/)
    .end()
    .use('babel-loader').loader('babel-loader').end()
    .use('ts-loader').loader('ts-loader').end()

  // rule - html
  config
    .module
    .rule('html')
    .test(/\.html$/)
    .exclude
    .add(/node_modules/)
    .end()
    .use('html-loader').loader('html-loader').end()

  // rule - css & scss
  config
    .module
    .rule('css')
    .test(/\.css$/)
    .oneOf('normal-css')
    .use('mini-css-extract-plugin').loader(MiniCssExtractPlugin.loader).options(miniCssOptions).end()
    .use('css-loader').loader('css-loader').end()
    .use('postcss-loader').loader('postcss-loader')
    .end()
    .end()

  // 普通 sass 类型文件
  config
    .module
    .rule('sass')
    .test(/\.s(a|c)ss$/)
    .oneOf('normal-scss')
    .use('mini-css-extract-plugin').loader(MiniCssExtractPlugin.loader).options(miniCssOptions).end()
    .use('css-loader').loader('css-loader').end()
    .use('postcss-loader').loader('postcss-loader').end()
    .use('sass-loader').loader('sass-loader').options({
      implementation: require('sass')
    }).end()
    .end()

  // rule - image
  config
    .module
    .rule('image')
    .test(/\.(png|jpg|gif|jpeg|svg)$/)
    .use('url-loader').loader('url-loader').options({
      limit: 1024 * parseInt(process.env.lf$base64ImageMaxSize || 1),
      name: `img/[name]${hash}.[ext]`,
      esModule: false
    }).end()
    .when(mode === 'production',
      config => config.use('image-webpack-loader').loader('image-webpack-loader').options({
        mozjpeg: {
          progressive: true,
          quality: 80
        },
        optipng: {
          enabled: false
        },
        pngquant: {
          quality: [0.80, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false
        }
      }).end()
    )

  // rule - assets
  config
    .module
    .rule('assets')
    .test(/\.(ttf|woff|otf|eot|svga)$/)
    .use('url-loader').loader('url-loader').options({
      limit: 1024 * 3,
      name: `assets/[name]${hash}.[ext]`
    }).end()

  // rule - other
  config
    .module
    .rule('other')
    .test(/\.*(js|jsx)$/)
    .include
    .add(/ansi-regex/)
    .add(/strip-ansi/)
    .end()
    .use('babel-loader').loader('babel-loader').end()
}
