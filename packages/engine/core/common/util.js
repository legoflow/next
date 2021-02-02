/**
 * 工具函数
 */

const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const { version } = require('../../package.json')

process.env.mode = 'production'
process.env.projectRoot = process.cwd()

/**
 * 设置缓存 mode
 */
const setMode = mode => (process.env.mode = mode)
exports.setMode = setMode

/**
 * 获取缓存 mode
 */
const getMode = () => process.env.mode
exports.getMode = getMode

/**
 * 获取项目根目录
 */
const getProjectRoot = () => process.env.projectRoot
exports.getProjectRoot = getProjectRoot

/**
 * 扩展配置
 */
exports.extendConfig = () => {
  const extendConfigScript = path.resolve(getProjectRoot(), 'legoflow.js')
  const extendConfigFunc = fs.existsSync(extendConfigScript) ? require(extendConfigScript) : undefined

  switch (typeof extendConfigFunc) {
    case 'function':
      return extendConfigFunc
  }
}

/**
 * 获取 sourceMap
 */
exports.getSourceMap = () => {
  return getMode() === 'development' ? 'inline-source-map' : 'source-map'
}

/**
 * 获取是否带 hash
 */
exports.isWithHash = () => {
  if (process.env.lf$disableFileNameHash) {
    return ''
  }

  return getMode() === 'development' ? '' : '.[contenthash:8]'
}

/**
 * 打印版本号
 */
exports.logVersion = () => console.log(chalk.blue.bold(`LegoFlow Engine v${version}`))

/**
 * 获取项目信息
 */
const getPackageJson = () => {
  const projectPackageJson = path.resolve(getProjectRoot(), 'package.json')

  if (!fs.existsSync(projectPackageJson)) {
    return {}
  }

  try {
    return JSON.parse(fs.readFileSync(projectPackageJson, 'utf8'))
  } catch (error) {
    return {}
  }
}
exports.getPackageJson = getPackageJson

/**
 * 加载 legoflow-plugin-${name} 插件
 */
exports.loadPlugins = async (...args) => {
  const projectInfo = getPackageJson()
  const projectRoot = getProjectRoot()

  if (projectInfo.devDependencies) {
    for (const key in projectInfo.devDependencies) {
      if (key.indexOf('legoflow-plugin-') >= 0) {
        const pluginModule = path.join(projectRoot, 'node_modules', key)
        if (fs.existsSync(pluginModule)) {
          console.log(`\n📦 Load ${chalk.blueBright(key)}...`)
          await require(pluginModule)(...args)
          console.log('\n')
        }
      }
    }
  }
}
