import _ from 'lodash'
import path from 'path'
import { Config } from '../common/config'
import TypeItem from '../doc/docApi/typeItem'
import { isKeyword, resolveOutPath } from '../utils'
import { ComponentsChildBase } from '../doc/docApi/type'

type TypeBase = ComponentsChildBase

export function getOutputDir(moduleName: string, { outDir }: Config) {
  // FIXME 存在 模块重名，方法重名 问题。
  return path.join(resolveOutPath(outDir), `${moduleName}${moduleName ? 'M' : 'm'}odule`)
}

export function getTypeName(type: TypeItem['type']) {
  if (typeof type === 'string') return type
  return type?.typeName ?? 'any'
}

type ParamType = Required<TypeItem['paramType']>
type ConstType = 'query' | 'headers' | 'path' | 'body'
export type ParamsInfo = ReturnType<typeof createParams>

export function createParams(param?: TypeBase, body?: TypeBase) {
  const paramsInfo = {
    // 参数种类
    kind: 0,
    resType: '',
    paramType: '',
    paramName: '',
    typeItems: [] as TypeItem[],
    deconstruct: '', // 参数解构
    paramTypes: [] as ParamType[],
    typeGroupList: [] as [string, TypeItem[]][],

    // 以下是需要 在 params 解构参数 再 重构参数成对应的参数类型
    paramsContents: [] as { type: ConstType; content: string }[]
  }

  const typeInfo = [param, body].filter(i => i && !i.isEmpty) as TypeBase[]
  const typeItems = _.flatten(typeInfo.map(i => i.typeItems))
  const typeGroup = _.groupBy(typeItems, 'paramType')
  const typeGroupList = Object.entries(typeGroup)

  paramsInfo.typeItems = typeItems
  // paramsInfo.typeLength = typeItems.length
  paramsInfo.typeGroupList = typeGroupList

  if (typeItems.length === 1) {
    // 只有一个参数，直接取
    const { name, type, paramType } = typeItems[0]
    paramsInfo.kind = 1
    paramsInfo.paramType = getTypeName(type)
    paramsInfo.paramName = isKeyword(name) ? `_${name}` : name
    paramsInfo.paramTypes = [paramType]
  } else if (typeItems.length > 1) {
    paramsInfo.kind = typeGroupList.length
    paramsInfo.paramTypes = typeGroupList.map(([paramType]) => paramType) as TypeItem['paramType'][]

    paramsInfo.paramType = typeInfo.map(i => i.typeName).join('&')
    if (typeGroupList.length === 1) {
      // 所有参数都是同一种类型
      paramsInfo.paramName = typeGroupList[0][0]
    } else if (typeGroupList.length > 1) {
      // 存在不同类型的参数，需要分开
      paramsInfo.paramName = 'params'
      // 参数结构
      const deconstructStr = typeItems.map(({ name }) => `${isKeyword(name) ? `_${name}` : name}`)
      paramsInfo.deconstruct = `const {${deconstructStr.join(',')}} = params`
    }
  }

  // 参数只有个一 或 参数多余一个并且参数类型大于一个时，生成参数类型重组代码。【参数类型只有一个时，形参就是对应类型名字】
  if (typeItems.length === 1 || (typeItems.length > 1 && typeGroupList.length > 1)) {
    for (const [paramType, typeitems] of typeGroupList) {
      let key = paramType as any
      if (key === 'path') continue
      if (key === 'header') key = 'headers'
      const content = typeitems.map(({ name }) => (isKeyword(name) ? `${name}:_${name}` : name)).join(',')
      paramsInfo.paramsContents.push({ type: key, content: `{ ${content} }` })
    }
  }

  return paramsInfo
}
