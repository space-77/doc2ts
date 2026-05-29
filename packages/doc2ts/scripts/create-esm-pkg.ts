import fs from 'fs-extra'
import path from 'path'

const libDir = path.join(__dirname, '../lib')
const esmDir = path.join(libDir, 'esm')

// 创建 ESM 目录的 package.json
const esmPkgJson = {
  type: 'module'
}

const esmPkgPath = path.join(esmDir, 'package.json')
fs.writeJSONSync(esmPkgPath, esmPkgJson, { spaces: 2 })

console.log('Created package.json for ESM build')