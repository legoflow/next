/**
 * 构建 dll
 */

const path = require('path')
const chalk = require('chalk')
const del = require('del')
const webpack = require('webpack')
const { getProjectRoot } = require('./common/util')

module.exports = ({ modules, filename }) => {
  const projectRoot = getProjectRoot()
  const dllPath = path.resolve(projectRoot, 'dll')

  del.sync(dllPath, { force: true })

  console.log(`output dll: ${chalk.cyan(dllPath)}\n`)

  const webpackCofig = {
    mode: 'production',
    entry: {
      vendor: modules
    },
    output: {
      filename: `${filename}.dll.js`,
      path: dllPath,
      library: `_dll_${filename}`
    },
    plugins: [
      new webpack.DllPlugin({
        name: `_dll_${filename}`,
        path: path.join(projectRoot, 'dll', `${filename}.manifest.json`)
      })
    ]
  }

  const compiler = webpack(webpackCofig)
  compiler.run((error, stats) => {
    if (error) {
      console.erroror(error)
      return
    }
    console.log(stats.toString({
      chunks: false,
      colors: true
    }))
  })
}
