/**
 * 工具函数
 */

const fs = require('fs')
const path = require('path')
const execa = require('execa')
const download = require('download-git-repo')
const chalk = require('chalk')

/**
 * 临时文件夹
 */
const getTmp = () => {
  const tmp = path.resolve(__dirname, '../tmp')
  !fs.existsSync(tmp) && fs.mkdirSync(tmp)
  return tmp
}
exports.getTmp = getTmp

const remoteTemplatePrefix = 'legoflow-project-'
exports.remoteTemplatePrefix = remoteTemplatePrefix

/**
 * 下载 npm repo
 */
const downloadNpmRepo = async name => {
  const tmp = getTmp()
  const tmpFolder = path.resolve(tmp, new Date().getTime().toString())

  name.indexOf(remoteTemplatePrefix) < 0 && (name = `${remoteTemplatePrefix}${name}`)

  const { stdout: url } = await execa.command(`npm view ${name} dist.tarball`)

  await new Promise(resolve => download(`direct:${url}`, tmpFolder, err => {
    if (err) {
      console.error(chalk.red(`😢 Download NPM-Repo(${name}) Fail \n`), err)
      process.exit(1)
    }
    resolve()
  }))

  return tmpFolder
}
exports.downloadNpmRepo = downloadNpmRepo

/**
 * 下载 Git Repo
 */
const downloadGitRepo = async url => {
  const tmp = getTmp()
  const tmpFolder = path.resolve(tmp, new Date().getTime().toString())

  await new Promise(resolve => download(`direct:${url}`, tmpFolder, { clone: true }, err => {
    if (err) {
      console.error(chalk.red(`😢 Download Git-Repo(${url}) Fail \n`), err)
      process.exit(1)
    }
    resolve()
  }))

  return tmpFolder
}
exports.downloadGitRepo = downloadGitRepo

/**
 * 下载项目模板
 */
const downloadTemplate = async remote => {
  let templateFolder

  if (remote.indexOf('http') === 0) {
    templateFolder = await downloadGitRepo(remote)
  } else {
    templateFolder = await downloadNpmRepo(remote)
  }

  return {
    folder: templateFolder,
    template: path.resolve(templateFolder, 'template')
  }
}
exports.downloadTemplate = downloadTemplate
