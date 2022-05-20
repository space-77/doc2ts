import fs from 'fs-extra'
import path from 'path'
import log from '../src/utils/log'
log.clear()
fs.emptyDirSync(path.join(__dirname, '../lib'))

const copyList = ['temp', 'types', 'pont-engine']
log.info('资源复制中...')
copyList.forEach(p => {
  const sourceTemp = path.join(__dirname, `../src/${p}`)
  const destinationTemp = path.join(__dirname, `../lib/${p}`)
  try {
    fs.copySync(sourceTemp, destinationTemp)
  } catch (error) {
    console.error(error)
  }
})
log.info('资源完成')
log.info('文件编译中...')
