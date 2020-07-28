/**
 * 打印环境配置信息
 */

const path = require('path')
const fs = require('fs')
const os = require('os')
const lfPackageJson = require('../package.json')
const execa = require('execa')
const glob = require('glob')
const chalk = require('chalk')

module.exports = async () => {
  const version = lfPackageJson.version
  const isWin = os.platform() === 'win32'
  const projectPackageJsonPath = path.resolve(process.cwd(), 'package.json')
  const isInProject = fs.existsSync(projectPackageJsonPath)

  let nodeVerison = ''
  let npmVersion = ''
  let yarnVersion = ''

  let nodePath = ''
  let npmPath = ''
  let yarnPath = ''

  try {
    nodeVerison = (await execa('node', ['-v'])).stdout.replace('v', '')
    npmVersion = (await execa('npm', ['-v'])).stdout.replace('v', '')
    yarnVersion = (await execa('yarn', ['-v'])).stdout.replace('v', '')

    if (!isWin) {
      nodePath = (await execa('which', ['node'])).stdout
      npmPath = (await execa('which', ['npm'])).stdout
      yarnPath = (await execa('which', ['yarn'])).stdout
    } else {
      nodePath = (await execa('where', ['node'])).stdout
      npmPath = (await execa('where', ['npm'])).stdout
      yarnPath = (await execa('where', ['yarn'])).stdout
    }
  } catch (error) {}

  console.log('')
  console.log(chalk.bold(' LegoFlow'))
  console.log(`   version: ${version}`)
  console.log(`   path: ${path.resolve(__dirname, '../')}`)
  console.log(`   cwd: ${process.cwd()}`)

  console.log('')
  console.log(chalk.bold(' System'))
  console.log(`   platform: ${os.platform()} ${os.arch()}`)

  console.log('')
  console.log(chalk.bold(' Binaries'))
  console.log(`   node: ${nodeVerison} - ${nodePath}`)
  console.log(`   npm: ${npmVersion} - ${npmPath}`)
  console.log(`   yarn: ${yarnVersion} - ${yarnPath}`)

  if (isInProject) {
    const projectPackageJson = require(projectPackageJsonPath)
    const projectDependencies = projectPackageJson.dependencies
    const projectDevDependencies = projectPackageJson.devDependencies

    // 配置
    const projectFiles = glob.sync(path.resolve(projectPackageJsonPath, '../*'), { dot: true })
    console.log('')
    console.log(chalk.bold(' Project config'))
    projectFiles.forEach((file, index) => {
      const name = path.basename(file)
      if (!fs.lstatSync(file).isDirectory() && name.indexOf('.md') < 0) {
        console.log(`   ${name}`)
      }
    })

    // 依赖
    console.log('')
    console.log(chalk.bold(' Project dependencies'))
    if (projectDependencies && Object.keys(projectDependencies).length > 0) {
      Object.keys(projectDependencies).forEach(item => {
        let remark = ''
        if (['vue', 'vue-router', 'vuex'].indexOf(item) >= 0) {
          const engine = path.resolve(projectPackageJsonPath, `../node_modules/${item}/package.json`)
          if (fs.existsSync(engine)) {
            const engineVersion = require(engine).version
            remark = `[${engineVersion}]`
          }
        }
        console.log(`   ${item}: ${projectDependencies[item]} ${remark}`)
      })
    } else {
      console.log('   -')
    }

    // 开发依赖
    console.log('')
    console.log(chalk.bold(' Project devDependencies'))
    if (projectDevDependencies && Object.keys(projectDevDependencies).length > 0) {
      Object.keys(projectDevDependencies).forEach(item => {
        let remark = ''
        if (['legoflow-engine', 'vue-loader', 'vue-style-loader', 'vue-template-compiler'].indexOf(item) >= 0) {
          const engine = path.resolve(projectPackageJsonPath, `../node_modules/${item}/package.json`)
          if (fs.existsSync(engine)) {
            const engineVersion = require(engine).version
            remark = `[${engineVersion}]`
          }
        }
        console.log(`   ${item}: ${projectDevDependencies[item]} ${remark}`)
      })
    } else {
      console.log('   -')
    }
  }

  console.log('')
}
