import path from 'path'
import { Config } from '../common/config'
import { DisableParams, Doc2TsConfig, ModelList, ApifoxConfig } from '../types/types'
import { DocListItem } from '../types/newType'
import { findDiffPath, resolveOutPath } from '../utils'
import { anonymousOriginName } from './barrelExport'

export default class Base {
  constructor(protected doc: DocListItem, protected config: Config, public origin: ModelList | ApifoxConfig) {}

  /**
   * @description 当前 origin 生效的 disableParams（origin 优先、全局回退）
   */
  protected get effDisableParams(): DisableParams[] {
    return this.origin.disableParams ?? this.config.disableParams
  }

  /**
   * @description 当前 origin 生效的 baseClassName（origin 优先、全局回退）
   */
  protected get effBaseClassName(): string {
    return this.origin.baseClassName ?? this.config.baseClassName
  }

  /**
   * @description 当前 origin 生效的 baseClassPath（origin 优先、全局回退）；两者均空时抛出明确错误
   */
  protected get effBaseClassPath(): string {
    const p = this.origin.baseClassPath ?? this.config.baseClassPath
    if (!p) {
      const originName = this.origin.name ?? '(匿名)'
      throw new Error(
        `无法解析 baseClassPath：origin "${originName}" 未配置且全局未提供。请在该 origin 上配置 baseClassPath，或在全局 Doc2TsConfig.baseClassPath 中提供默认值`
      )
    }
    return p
  }

  /**
   * @description 当前 origin 生效的 resultTypeRender（origin 优先、全局回退）
   */
  protected get effResultTypeRender(): Doc2TsConfig['resultTypeRender'] {
    return this.origin.resultTypeRender ?? this.config.resultTypeRender
  }

  get getBaseFileName(): string {
    const baseClassName = this.effBaseClassName
    return baseClassName.replace(/^\{(.+)\}$/, (_, $1) => $1)
  }

  getOutputDir(moduleName: string) {
    const { outDir } = this.config
    // FIXME 存在 模块重名，方法重名 问题。
    return path.join(resolveOutPath(outDir), moduleName ?? anonymousOriginName)
  }

  getClientPath(filePath: string) {
    const baseClassPath = this.effBaseClassPath
    const tempClassDirList = filePath.split(path.sep)
    const tempClassDir = tempClassDirList.slice(0, tempClassDirList.length - 1).join(path.sep)
    return findDiffPath(tempClassDir, resolveOutPath(baseClassPath))
  }
}
