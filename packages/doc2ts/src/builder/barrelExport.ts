import _ from 'lodash'

/**
 * @description 单个 origin 的模块导出信息，供汇总生成 barrel（index.ts）时消歧使用
 */
export type ExportEntry = {
  /** 该模块所属 origin 的名字（匿名 origin 为空） */
  originName?: string
  /** 该模块的导出标识符（通常为模块名的小驼峰形式） */
  exportName: string
  /** 相对于输出根目录的模块路径，如 `./buddy/signIn` */
  fileExPath: string
}

/**
 * @description 匿名 origin 的目录名 / 前缀回退值，与 Base.getOutputDir 共用同一常量
 */
export const anonymousOriginName = 'module'

/**
 * @description 将 origin 名清洗为可用于标识符前缀的形式
 */
export function normalizeOriginPrefix(originName?: string) {
  const prefix = _.camelCase(originName ?? '')
  if (!prefix) return anonymousOriginName
  // camelCase 不会去掉前导数字，而数字开头的标识符非法（TS1003），加下划线前缀兜底
  return prefix.replace(/^\d/, '_$&')
}

/**
 * @description 转义模块路径中的引号与反斜杠，避免生成的字符串字面量语法错误
 */
function escapeModulePath(fileExPath: string) {
  return fileExPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

/**
 * @description 保证名称唯一的兜底：重名时追加数字后缀（语义与 doc-pre-data 的 checkName 一致）
 */
function uniqueName(name: string, used: Set<string>) {
  const lastNumReg = /((?!0)\d+)$/
  let newName = name
  while (used.has(newName)) {
    newName = lastNumReg.test(newName)
      ? newName.replace(lastNumReg, $1 => `${Number($1) + 1}`)
      : `${newName}1`
  }
  return newName
}

/**
 * @description 同一模块（导出名 + 路径）只保留一条，避免重复引用导致 barrel 重复导出
 */
function dedupeEntries(entries: ExportEntry[]) {
  const seen = new Set<string>()
  return entries.filter(entry => {
    const key = `${entry.exportName}\u0000${entry.fileExPath}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * @description 生成 barrel 的导出名列表（与入参下标一一对应）：仅对跨 origin 重名的导出标识符追加 origin 前缀
 */
export function resolveExportNames(entries: ExportEntry[]): string[] {
  const countMap = new Map<string, number>()
  entries.forEach(({ exportName }) => {
    countMap.set(exportName, (countMap.get(exportName) ?? 0) + 1)
  })

  const names: string[] = new Array(entries.length)
  const used = new Set<string>()

  // 第一轮：非冲突名优先占位保持原名，避免被冲突消歧名抢占而被迫改名
  entries.forEach((entry, index) => {
    if ((countMap.get(entry.exportName) ?? 0) === 1) {
      names[index] = entry.exportName
      used.add(entry.exportName)
    }
  })

  // 第二轮：冲突名追加 origin 前缀；按稳定顺序分配兜底后缀，保证结果与输入顺序无关
  entries
    .map((_, index) => index)
    .filter(index => names[index] === undefined)
    .sort((a, b) =>
      `${entries[a].exportName}|${entries[a].fileExPath}`.localeCompare(`${entries[b].exportName}|${entries[b].fileExPath}`)
    )
    .forEach(index => {
      const { originName, exportName } = entries[index]
      const candidate = `${normalizeOriginPrefix(originName)}${_.upperFirst(exportName)}`
      const finalName = uniqueName(candidate, used)
      names[index] = finalName
      used.add(finalName)
    })

  return names
}

/**
 * @description 汇总各 origin 的模块导出，生成 index.ts 内容；跨 origin 重名的导出名会被追加 origin 前缀
 */
export function buildBarrelContent(entries: ExportEntry[]) {
  const uniqueEntries = dedupeEntries(entries)
  const names = resolveExportNames(uniqueEntries)
  return uniqueEntries
    .map((entry, index) => {
      const finalName = names[index]
      const specifier = finalName === entry.exportName ? entry.exportName : `${entry.exportName} as ${finalName}`
      return `export { ${specifier} } from '${escapeModulePath(entry.fileExPath)}'`
    })
    .sort((a, b) => a.length - b.length || a.localeCompare(b))
    .join('\r\n')
}
