/**
 * 创建项目
 */

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const { downloadTemplate, remoteTemplatePrefix } = require('./common/util')
const inquirer = require('inquirer')
const glob = require('glob')
const execa = require('execa')
const Mustache = require('mustache')
const ora = require('ora')
const del = require('del')

module.exports = async ({ name, remote }) => {
  let projectName = name
  let projectPath = process.cwd()
  let checkPath

  if (!name) {
    projectName = path.basename(process.cwd())
    checkPath = path.resolve(projectPath, 'package.json')
  } else {
    projectPath = path.resolve(process.cwd(), projectName)
    checkPath = projectPath
  }

  if (fs.existsSync(checkPath)) {
    console.log(chalk.red('😢 Project already exists\n'))
    return
  }

  let projectTemplatePath = path.resolve(__dirname, '../template')
  let projectTemplateRemoteFolder
  let template

  // 没有指定 remote，默认拉取所有远程模板信息
  if (!remote) {
    const spinner = ora('拉取模板中...').start()
    const { stdout: npmResult } = await execa.command(`npm search --json ${remoteTemplatePrefix} --long true`)
    const { stdout: yyNpmResult } = await execa.command(`npm search --json @yy/${remoteTemplatePrefix}`)
    const allRemoteProjectTemplateJsonData = JSON.parse(npmResult).concat(JSON.parse(yyNpmResult).filter(item => item.name.indexOf('@yy') >= 0))
    const allRemoteProjectTemplate = []

    spinner.stop()

    allRemoteProjectTemplateJsonData.map(item => {
      if (item.description === 'archived') return
      if (item.name.indexOf(remoteTemplatePrefix) >= 0) {
        const name = item.name.split(remoteTemplatePrefix)[1]
        allRemoteProjectTemplate[name.indexOf('vue') >= 0 ? 'unshift' : 'push']({
          name: name + chalk.gray(` (${item.description})`),
          value: item.name
        })
      }
    })

    const { template: _template } = await inquirer.prompt([{
      type: 'list',
      name: 'template',
      message: '请选择项目模板',
      choices: allRemoteProjectTemplate
    }])

    remote = _template
    allRemoteProjectTemplateJsonData.map(item => item.name === _template && (template = item))
  }

  // 拉取远程模板
  if (remote) {
    const spinner = ora('正在下载远程项目模板...').start()

    const { folder, template } = await downloadTemplate(remote)

    spinner.stop()
    console.log(chalk.green('👏 下载完成\n'))

    projectTemplatePath = template
    projectTemplateRemoteFolder = folder
  }

  /** answers resolve start **/

  const answers = {
    // 是否新建文件夹，默认新建文件夹
    isNewProjectFolder: !!name,
    // node_modules 安装方式，默认使用 yarn
    nodeModulesInstallMethod: 'yarn',
    // node_modules register
    registerUrl: 'https://registry.npmjs.org/'
  }

  try {
    await execa.command('yarn -v')
  } catch (error) {
    answers.nodeModulesInstallMethod = 'npm'
  }

  /** answers resolve complete **/

  // 判断是否新建文件夹
  if (answers.isNewProjectFolder) {
    fs.mkdirSync(projectPath)
  }

  const needResolveFiles = ['package.json', 'README.md']
  const noIncludeFiles = ['.DS_Store']

  // 识别各类文件
  const files = glob.sync(path.resolve(projectTemplatePath, './**/*'), { dot: true }).filter(file => {
    const name = path.basename(file)

    if (needResolveFiles.indexOf(name) >= 0) {
      needResolveFiles[needResolveFiles.indexOf(name)] = file
    } else if (!fs.lstatSync(file).isDirectory() && noIncludeFiles.indexOf(name) < 0) {
      return true
    }

    return false
  })

  // 复制普通文件
  files.forEach(file => fs.copySync(path.normalize(file), path.normalize(file).replace(projectTemplatePath, projectPath)))

  // 创建 .gitignore
  fs.writeFileSync(path.resolve(projectPath, '.gitignore'), 'dist\nnode_modules\nyarn-error.log\nnpm-debug.log')

  // 复制【变量注入】文件
  needResolveFiles.forEach(file => {
    file = path.normalize(file)

    if (file.indexOf(projectTemplatePath) === 0) {
      const basename = path.basename(file)
      const filePath = file.replace(projectTemplatePath, projectPath).replace(basename, '')
      const content = Mustache.render(fs.readFileSync(file, 'utf8'), {
        name: projectName
      })

      fs.writeFileSync(filePath + basename, content, 'utf8')
    }
  })

  // 删除从远程拉取的项目模板
  remote && del.sync(projectTemplateRemoteFolder, { force: true })

  console.log(`✨ Created project in ${chalk.yellow(projectPath)}`)
  console.log('🚀 Installing dependencies...\n')

  // 创建 .npmrc (yy npm 源)
  template.description.indexOf('YY') >= 0 && fs.writeFileSync(path.resolve(projectPath, '.npmrc'), 'registry=https://npm-registry.yy.com')

  // 安装 node_modules 依赖
  await execa.command(`${answers.nodeModulesInstallMethod} install`, { cwd: projectPath, stdio: 'inherit' })

  /** complete **/

  console.log(`\n🎉 Successfully created project ${chalk.yellow(projectName)}`)
  console.log('👉 Get started with the following commands:\n')

  answers.isNewProjectFolder && console.log(`${chalk.gray('$')} ${chalk.cyan(`cd ${projectName}`)}`)
  console.log(`${chalk.gray('$')} ${chalk.cyan(`${answers.nodeModulesInstallMethod} start`)}\n`)
}
