#!/usr/bin/env node

const program = require('commander')
const { Doc2Ts, init } = require('../lib/scripts/index')

program
  .command('init')
  .description('初始化配置文件')
  .action(() => {
    init()
  })

program
  .command('build')
  .description('生成代码')
  .action(() => {
    new Doc2Ts()
  })

program.parse(process.argv)
