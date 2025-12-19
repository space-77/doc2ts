import fs from 'fs-extra'
import path from 'path'
import log from '../src/utils/log'

log.clear()

// 清理并创建 lib 目录
const libDir = path.join(__dirname, '../lib')
const esmDir = path.join(libDir, 'esm')

if (fs.existsSync(libDir)) {
  fs.emptyDirSync(libDir)
} else {
  fs.ensureDirSync(libDir)
}

// 确保 esm 目录存在
fs.ensureDirSync(esmDir)

const copyList = ['temp', 'types']
log.info('资源复制中...')

// 复制到 CommonJS 目录
copyList.forEach(p => {
  const sourceTemp = path.join(__dirname, `../src/${p}`)
  const destinationTemp = path.join(__dirname, `../lib/${p}`)
  try {
    fs.copySync(sourceTemp, destinationTemp)
  } catch (error) {
    console.error(error)
  }
})

// 复制到 ESM 目录
copyList.forEach(p => {
  const sourceTemp = path.join(__dirname, `../src/${p}`)
  const destinationTemp = path.join(__dirname, `../lib/esm/${p}`)
  try {
    fs.copySync(sourceTemp, destinationTemp)
  } catch (error) {
    console.error(error)
  }
})

log.info('资源复制完成')
log.info('文件编译中...')
