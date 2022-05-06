#!/usr/bin/env node

const exec = require('child_process').exec

const cmdStr = 'npm run build'
exec(cmdStr, (err, stdout) => {
  if (err) {
    console.log(err)
    // console.warn(new Date(), ' API文档编译命令执行失败')
  } else {
    console.log('[doc2ts] ', stdout)
    // console.warn(new Date(), ' API文档编译命令执行成功')
  }
})
