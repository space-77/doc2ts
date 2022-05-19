#!/usr/bin/env node

const { Doc2Ts, initConfig } = require('../dist/scripts/index')
const { Command } = require('commander')
const program = new Command();

program.option('-i, --init', '初始化配置文件').action(() => {
  initConfig()
})

program.option('-b, --build', '生成代码').action(() => {
  const doc2ts = new Doc2Ts()
  doc2ts.build()
})
