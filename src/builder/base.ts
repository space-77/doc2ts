import path from 'path'
import { Config } from '../common/config'
import { ModelList, ApifoxConfig } from '../types/types'
import { DocListItem } from '../types/newType'
import { findDiffPath, resolveOutPath } from '../utils'

export default class Base {
  constructor(protected doc: DocListItem, protected config: Config, public origin: ModelList | ApifoxConfig) {}

  get getBaseFileName(): string {
    const { baseClassName } = this.config
    return baseClassName.replace(/^\{(.+)\}$/, (_, $1) => $1)
  }

  getOutputDir(moduleName: string) {
    const { outDir } = this.config
    // FIXME 存在 模块重名，方法重名 问题。
    return path.join(resolveOutPath(outDir), moduleName ?? 'module')
  }

  getClientPath(filePath: string) {
    const { baseClassPath } = this.config
    const tempClassDirList = filePath.split(path.sep)
    const tempClassDir = tempClassDirList.slice(0, tempClassDirList.length - 1).join(path.sep)
    return findDiffPath(tempClassDir, resolveOutPath(baseClassPath))
  }
}
