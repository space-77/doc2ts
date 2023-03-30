#!/usr/bin/env node
const chalk = require('chalk')
const boxen = require('boxen')
const program = require('commander')
const { compare, compareVersions } = require('compare-versions')
const log = require('../lib/utils/log').default
const cmd = require('../lib/utils/cmd').default
const { Doc2Ts, init, Manage } = require('../lib/scripts/index')
const package = require('../package.json')

const name = package.name
const version = package.version

program.version(version).usage('[命令] [配置项]')

program.description('根据接口文档生成代码')

const [newVersion] = JSON.parse(cmd(`npm view ${name} versions`).replace(/'/g, '"'))
  .filter(i => /^(\d+\.){2}\d+$/.test(i))
  .sort(compareVersions)
  .reverse()

if (compare(newVersion, version, '>')) {
  console.log(
    boxen(
      `\
Update available! ${chalk.red(version)} → ${chalk.green(newVersion)}.
${chalk.magenta('Homepage:')} ${package.homepage}
Run "${chalk.magenta('npm install -g doc2ts')}" to update.`,
      {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round'
      }
    )
  )
}

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
    generator(!!git || !!g)
  })

async function generator(useGit = false) {
  if (useGit) {
    new Manage()
  } else {
    const doc2ts = new Doc2Ts()
    await doc2ts.init()
    log.clear()
    log.success(log.done(' ALL DONE '))
  }
}

program.parse(process.argv)
