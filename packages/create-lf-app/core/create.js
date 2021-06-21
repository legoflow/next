/**
 * 创建项目
 */

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const { downloadTemplate, remoteTemplatePrefix } = require('./util')
const inquirer = require('inquirer')
const glob = require('glob')
const mustache = require('mustache')
const ora = require('ora')
const del = require('del')
const got = require('got')

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

    const { body: npmResult } = await got('https://registry.npmjs.org/-/v1/search?text=legoflow-project-')

    const allRemoteProjectTemplateJsonData = (JSON.parse(npmResult).objects).filter(item => item.package.name.indexOf('legoflow-project-') >= 0)
    const allRemoteProjectTemplate = []

    spinner.stop()

    allRemoteProjectTemplateJsonData.forEach(({ package: item }) => {
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
    allRemoteProjectTemplateJsonData.map(item => item.package.name === _template && (template = item.package))
  }

  if (!template) {
    console.log(chalk.red('模板配置 undefined'))
    process.exit(1)
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
    // node_modules register
    registerUrl: 'https://registry.npmjs.org/'
  }

  /** answers resolve complete **/

  // 判断是否新建文件夹
  if (answers.isNewProjectFolder) {
    fs.mkdirSync(projectPath)
  }

  const excludeFiles = ['.DS_Store']

  glob.sync(path.resolve(projectTemplatePath, './**/*'), { dot: true }).forEach(file => {
    const basename = path.basename(file)
    if (!fs.lstatSync(file).isDirectory() && !excludeFiles.includes(basename)) {
      let distFile = path.normalize(file).replace(projectTemplatePath, projectPath)
      if (basename[0] === '_') distFile = distFile.replace(basename, basename.replace('_', '.'))
      const content = mustache.render(fs.readFileSync(file, 'utf8'), {
        name: projectName
      })
      fs.outputFileSync(distFile, content, 'utf8')
    }
  })

  // 删除从远程拉取的项目模板
  remote && del.sync(projectTemplateRemoteFolder, { force: true })

  // 创建 .npmrc (duowan npm 源)
  template.description.indexOf('YY') >= 0 && fs.writeFileSync(path.resolve(projectPath, '.npmrc'), 'registry=https://npm-registry.duowan.com')

  console.log(`✨ Created project in ${chalk.yellow(projectPath)}`)
  console.log('🚀 Installing dependencies...\n')

  /** complete **/

  console.log(`\n🎉 Successfully created project ${chalk.yellow(projectName)}`)
  console.log('👉 Get started with the following commands:\n')

  answers.isNewProjectFolder && console.log(`${chalk.gray('$')} ${chalk.cyan(`cd ${projectName}`)}`)
  console.log(`${chalk.gray('$')} ${chalk.cyan('yarn install')}\n`)
  console.log(`${chalk.gray('$')} ${chalk.cyan('yarn start')}\n`)
}
