#!/usr/bin/env node

process.on('unhandledRejection', error => {
  console.log(`${require('chalk').red('Unhandled Rejection:')}`, error)
  process.exit(1)
})

const chalk = require('chalk')
const { name, version } = require('../package.json')

console.log('\n')
console.log(chalk.blueBright.bold(`${name} v${version}\n`))

const cli = require('cac')()

/**
 * 创建项目命令
 */
cli
  .command('[name]', '创建项目')
  .option('--remote [remote]', '远程项目模板')
  .action(async (name, options) => {
    const { remote } = options.remote
    require('./core/create')({ name, remote })
  })

/**
 * 打印环境信息
 */
cli
  .command('info', '打印环境信息')
  .action(require('./core/info'))

cli
  .help()
  .version(version)
  .parse()
