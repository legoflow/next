/**
 * 入口文件
 * 识别命令，分发调用相应函数
 */

const cli = require('cac')()
const pkg = require('../package.json')
const { version } = pkg

/**
 * 创建项目命令
 */
cli
  .command('[name]', '创建项目')
  .option('--remote [remote]', '远程项目模板')
  .action(async (name, options) => {
    require('./create')({
      name,
      remote: options.remote
    })
  })

/**
 * 打印环境信息
 */
cli
  .command('info', '打印环境信息')
  .action(require('./info'))

cli.help()

cli.version(version)

cli.parse()
