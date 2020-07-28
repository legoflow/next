/**
 * 控制台打印输出进度
 */

let label = ''
let spinner

/**
 * 初始化显示
 */
exports.show = mode => {
  switch (mode) {
    case 'development':
      label = 'Starting development server'
      break
    case 'production':
      label = 'Building for production'
      spinner = require('ora')().start()
      break
  }
}

/**
 * 设置进度
 */
exports.setProgress = percentage => {
  if (!spinner && percentage <= 0.12) return
  !spinner && (spinner = require('ora')().start())
  spinner.text = `${label} ${parseInt(percentage * 100)}%`
}

/**
 * webpack 插件
 */
exports.plugin = class ProgressPlugin {
  apply (compiler) {
    compiler.hooks.done.tap('Progress Plugin', stats => {
      spinner.stop()
    })
  }
}
