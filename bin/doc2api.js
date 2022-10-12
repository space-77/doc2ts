#!/usr/bin/env node

const program = require('commander')
const { Doc2Ts, init, Manage } = require('../lib/scripts/index')

program
  .command('init')
  .description('初始化配置文件')
  .action(() => {
    init()
  })

program
  .command('build')
  .option('--git', '使用 git 管理生成的代码')
  .description('生成代码')
  .action(({ git }) => {
    if (git) {
      new Manage()
    } else {
      const doc2ts = new Doc2Ts()
      doc2ts.init()
    }
  })

program.parse(process.argv)
