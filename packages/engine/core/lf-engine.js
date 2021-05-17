/**
 * 入口文件
 * 识别命令，分发调用相应函数
 */

const chalk = require('chalk')
const cli = require('cac')()
const { version } = require('../package.json')

/**
 * 启动开发项目命令
 */
cli
  .command('dev', '开发项目')
  .action(options => require('./dev')())

/**
 * 启动构建项目命令
 */
cli
  .command('build', '构建项目')
  .option('--base64ImageMaxSize <base64ImageMaxSize>', '转为 base64 图片最大阀值（kb）')
  .option('--disableFileNameHash', '关闭文件名带 hash 值')
  .option('--disableSourceMap', '关闭构建出 SourceMap')
  .action(options => require('./build')(options))

/**
 * 构建 dll
 */
cli
  .command('dll', '构建 dll')
  .option('-m <modules>', '输入模块')
  .option('-o <filename>', '输出文件名')
  .action(options => {
    const { m: modulesString, o: filename } = options

    if (!modulesString) {
      console.log(chalk.red('缺少【输入模块 -m】参数\n'))
      process.exit(1)
    }

    if (!filename) {
      console.log(chalk.red('缺少【输出文件名 -o】参数\n'))
      process.exit(1)
    }

    const modules = modulesString.split(',').filter(item => item !== '')

    require('./dll')({ modules, filename })
  })

/**
 * 未识别命令输出提示
 */
cli.on('command:*', () => {
  console.log(`${chalk.red.bold('Unknown Command.')} Run ${chalk.blue.bold('lf-engine -h')} for detailed usage.`)
})

cli.help()

cli.version(version)

cli.parse()
