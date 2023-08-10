#!/usr/bin/env node
const program = require('commander')
const { compare, getVersion } = require('./version')
const log = require('../lib/utils/log').default
const { Doc2Ts, init, Manage } = require('../lib/scripts/index')
const package = require('../package.json')

const version = package.version

program.version(version).usage('[命令] [配置项]')

program.description('根据接口文档生成代码')

program
  .command('init')
  .description('初始化配置文件')
  .action(() => {
    init()
  })

program
  .command('start')
  .option('-g, --git', '使用 git 管理生成的代码')
  .description('生成代码')
  .action(({ git, g }) => {
    compare()
    generator(!!git || !!g)
    getVersion()
  })

async function generator(useGit = false) {
  if (useGit) {
    new Manage()
  } else {
    const doc2ts = new Doc2Ts()
    await doc2ts.build()
    doc2ts.buildLog()
    // log.clear()
    // log.success(log.done(' ALL DONE '))
  }
}

program.parse(process.argv)
