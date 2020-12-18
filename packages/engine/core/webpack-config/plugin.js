/**
 * webpack 配置 - 插件
 */

const path = require('path')
const webpack = require('webpack')
const fg = require('fast-glob')
const { getMode, isWithHash, getPackageJson, getProjectRoot } = require('../common/util')
const logProgress = require('../common/log-progress')

module.exports = ({ config }) => {
  const mode = getMode()
  const hash = isWithHash()
  const projectRoot = getProjectRoot()
  const { name: projectName, version: projectVersion } = getPackageJson()

  config
    .plugin('html-webpack-plugin')
    .use(require('html-webpack-plugin'), [{
      template: 'public/index.html',
      filename: 'index.html'
    }])

  const cssFilename = `css/[name]${hash}.css`
  config
    .plugin('mini-css-extract-plugin')
    .use(require('mini-css-extract-plugin'), [{
      filename: cssFilename,
      chunkFilename: cssFilename
    }])

  config
    .plugin('webpack/DefinePlugin')
    .use(webpack.DefinePlugin, [{
      'process.env.MODE': JSON.stringify(mode)
    }])

  config
    .plugin('webpack/ProgressPlugin')
    .use(webpack.ProgressPlugin, [{
      handler (percentage, message, ...args) {
        logProgress.setProgress(percentage)
      }
    }])

  config
    .plugin('logProgressPlugin')
    .use(logProgress.plugin)

  // 开发环境插件
  if (mode === 'development') {
    config
      .plugin('friendly-errors-webpack-plugin')
      .use(require('friendly-errors-webpack-plugin'))
  }

  // 构建环境插件
  if (mode === 'production') {
    config
      .plugin('case-sensitive-paths-webpack-plugin')
      .use(require('case-sensitive-paths-webpack-plugin'))

    config
      .plugin('clean-webpack-plugin')
      .use(require('clean-webpack-plugin').CleanWebpackPlugin)

    config
      .plugin('webpack/ModuleConcatenationPlugin')
      .use(webpack.optimize.ModuleConcatenationPlugin)

    config
      .plugin('webpack/BannerPlugin')
      .use(webpack.BannerPlugin, [{
        banner: `
/*!
  * ${projectName}
  *
  * @version: ${projectVersion}
  * @build: ${require('dayjs')().format('YYYY-MM-DD HH:mm:ss')}
  */
`,
        raw: true
      }])

    // dll
    const dllFiles = fg.sync(path.join(projectRoot, 'dll', '*.dll.js'))
    const manifestJson = fg.sync(path.join(projectRoot, 'dll', '*.manifest.json'))

    if (manifestJson && manifestJson.length > 0 && manifestJson.length === dllFiles.length) {
      manifestJson.forEach(item => {
        config
          .plugin('webpack/DllReferencePlugin')
          .use(webpack.DllReferencePlugin, [{
            context: projectRoot,
            manifest: require(item)
          }])
      })

      config
        .plugin('html-webpack-tags-plugin')
        .use(require('html-webpack-tags-plugin'), [{
          tags: dllFiles.map(file => path.basename(file)),
          append: false,
          usePublicPath: true,
          addPublicPath: (path, publicPath) => {
            return publicPath + 'js/' + path
          }
        }])

      config
        .plugin('copy-webpack-plugin')
        .use(require('copy-webpack-plugin'), [
          dllFiles.map(file => {
            return {
              from: file,
              to: path.join(projectRoot, 'dist', 'js', path.basename(file))
            }
          })
        ])
    }
  }
}
