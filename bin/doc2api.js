#!/usr/bin/env node

const log = require('../lib/utils/log').default
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
  .action(async ({ git }) => {
    if (git) {
      new Manage()
    } else {
      const doc2ts = new Doc2Ts()
      await doc2ts.init()
      log.clear()
      log.success(log.done(' ALL DONE '))
    }
  })

program.parse(process.argv)
