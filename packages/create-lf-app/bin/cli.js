#!/usr/bin/env node

process.on('unhandledRejection', error => {
  console.log(`${require('chalk').red('Unhandled Rejection:')}`, error)
  process.exit(1)
})

const chalk = require('chalk')
const { name, version } = require('../package.json')

console.log('\n')
console.log(chalk.blueBright.bold(`${name} v${version}\n`))

require('../core/lf')
