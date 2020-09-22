#!/usr/bin/env node

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection', reason)
  process.exit(1)
})
process.on('uncaughtException', error => {
  console.error('uncaughtException', error)
  process.exit(1)
})

require('v8-compile-cache')
require('../core/lf-engine')
