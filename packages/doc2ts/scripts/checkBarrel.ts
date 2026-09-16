import fs from 'fs'
import path from 'path'
import { resolveOutPath } from '../src/utils'

/**
 * @description 校验生成的 barrel（index.ts）：
 *   1. 无重复导出标识符（对应 TS2300）
 *   2. 每条导出都能在目标模块中找到 `as` 左侧的真实成员（对应 TS2305/TS2614/TS2724）
 * 不依赖使用者自备的基类文件，故比 tsc 更适合作为生成后的自检。
 */
function checkBarrel() {
  const servicesDir = resolveOutPath('./src/services')
  const barrelPath = path.join(servicesDir, 'index.ts')

  if (!fs.existsSync(barrelPath)) {
    console.error(`未找到 barrel 文件：${barrelPath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(barrelPath, 'utf8')
  const lines = content.split('\n').filter(Boolean)
  const exportRe = /^export \{ (\S+?)(?: as (\S+))? \} from '(.+)'$/

  const errors: string[] = []
  const seen = new Map<string, number>()

  lines.forEach((line, index) => {
    const matched = line.match(exportRe)
    if (!matched) {
      errors.push(`第 ${index + 1} 行无法解析：${line}`)
      return
    }

    const [, sourceName, aliasName, importPath] = matched
    const publicName = aliasName ?? sourceName

    const count = (seen.get(publicName) ?? 0) + 1
    seen.set(publicName, count)
    if (count > 1) errors.push(`导出名重复：${publicName}（第 ${index + 1} 行）`)

    const modulePath = path.join(servicesDir, `${importPath.slice(2)}.ts`)
    if (!fs.existsSync(modulePath)) {
      errors.push(`模块文件不存在：${modulePath}（第 ${index + 1} 行）`)
      return
    }

    const moduleContent = fs.readFileSync(modulePath, 'utf8')
    if (!new RegExp(`export const ${sourceName}\\b`).test(moduleContent)) {
      errors.push(`模块 ${importPath} 未导出成员 ${sourceName}（第 ${index + 1} 行）`)
    }
  })

  if (errors.length > 0) {
    console.error(`barrel 校验失败，共 ${errors.length} 个问题：`)
    errors.forEach(msg => console.error(`  - ${msg}`))
    process.exit(1)
  }

  console.log(`barrel 校验通过：${lines.length} 条导出，无重复、成员均可解析`)
}

checkBarrel()
