#!/usr/bin/env node

const { Doc2Ts } = require('../dist/src/index')
const { Command } = require('commander')
const program = new Command();

program.option('-i, --init', '初始化配置文件').action(() => {
  console.log('TODO: 初始化配置文件')
})

program.option('-g, --generate', '生成代码').action(() => {
  const doc2ts = new Doc2Ts()
  doc2ts.build()
})
