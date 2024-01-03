import _ from 'lodash'
import path from 'path'
import { Config } from '../common/config'
import { TypeDataKey } from '../common/reg'
import { typeStringList } from './buildType'
import { FileContentType } from './tsFileBuilder'
import { DocApi, TypeItem, TypeInfoBase } from 'doc-pre-data'
import { firstToUpper, isKeyword, resolveOutPath } from '../utils'

export type TypeBase = TypeInfoBase

export function getOutputDir(moduleName: string, { outDir }: Config) {
  // FIXME 存在 模块重名，方法重名 问题。
  return path.join(resolveOutPath(outDir), `${moduleName}${moduleName ? 'M' : 'm'}odule`)
}

export function getTypeName(type: TypeItem['type']) {
  if (typeof type === 'string') return type
  return type?.typeName ?? 'unknown'
}

export function checkName(name: string) {
  return isKeyword(name) ? `_${name}` : name
}

type ParamType = Required<TypeItem['paramType']>
type ConstType = 'query' | 'headers' | 'path' | 'body'
export type ParamsInfo = ReturnType<typeof createParams>

// 按照这个顺序排序
const constTypeSort = ['path', 'header', 'query', 'body']

export function createParams(paramsTypeInfo: TypeBase[], typeItems: TypeItem[]) {
  const paramsInfo = {
    // 参数种类
    kind: 0,
    resType: '',
    paramType: '',
    paramName: '',
    paramTypeDesc: undefined as string | undefined,
    // typeItems: [] as TypeItem[],
    deconstruct: '', // 参数解构
    paramTypes: [] as ParamType[],
    typeGroupList: [] as [string, TypeItem[]][],

    // 以下是需要 在 params 解构参数 再 重构参数成对应的参数类型
    paramsContents: [] as { type: ConstType; content: string }[]
  }

  const typeGroup = _.groupBy(typeItems, 'paramType')
  const typeGroupList = Object.entries(typeGroup).sort(
    (a, b) => constTypeSort.indexOf(a[0]) - constTypeSort.indexOf(b[0])
  )

  // paramsInfo.typeItems = typeItems
  // paramsInfo.typeLength = typeItems.length
  paramsInfo.typeGroupList = typeGroupList
  const paramTypeLen = typeGroupList.length

  if (typeItems.length === 1) {
    // 只有一个参数，直接取出来
    const [firstItem] = typeItems
    const { name, paramType, type, ref, required, deprecated, description } = firstItem
    paramsInfo.kind = 1

    const isDefType = typeof type === 'string' && !ref
    const oneTypeValue = firstItem.getKeyValue()
    const reqStr = required ? '' : '?'
    const typeInfo = isDefType ? `${reqStr}:${oneTypeValue}` : `:types.${paramsTypeInfo[0].typeName}['${name}']`

    paramsInfo.paramType = typeInfo
    paramsInfo.paramTypeDesc = isDefType
      ? `* @param { ${firstToUpper(oneTypeValue)} } ${name} ${description || ''}`
      : undefined
    paramsInfo.paramName = checkName(name)
    paramsInfo.paramTypes = [paramType]
  } else if (typeItems.length > 1) {
    paramsInfo.kind = paramTypeLen
    paramsInfo.paramTypes = typeGroupList.map(([paramType]) => paramType) as TypeItem['paramType'][]

    paramsInfo.paramType = paramsTypeInfo.map(i => `:types.${i.typeName}`).join('&')

    if (paramTypeLen === 1) {
      // 所有参数都是同一种类型，这里是多个参数一起，需要解构
      const paramName = typeGroupList[0][0]
      if (paramName === 'path') {
        const params = typeItems.map(({ name }) => checkName(name))
        paramsInfo.paramName = `{${params.join(',')}}`
      } else {
        paramsInfo.paramName = paramName
      }
    } else if (paramTypeLen > 1) {
      // 存在不同类型的参数，需要分开
      paramsInfo.paramName = 'params'

      let [lastType] = typeGroupList[paramTypeLen - 1]
      if (lastType === 'header') lastType = 'headers'
      const overType = typeGroupList.slice(0, paramTypeLen - 1).map(([, type]) => type)

      // 参数解构
      const params = _.flatten(overType).map(({ name }) => checkName(name))
      paramsInfo.deconstruct = `const {${params.join(',')}, ...${lastType}} = params`
    }
  }

  // 参数只有个一 或 参数多于一个并且参数类型大于一个时，生成参数类型重组代码。【参数类型只有一个时，形参就是对应类型名字】
  if (typeItems.length === 1 || (typeItems.length > 1 && paramTypeLen > 1)) {
    let index = -1

    for (const [paramType, typeitems] of typeGroupList) {
      index++
      let key = paramType as any
      if (key === 'path' || (paramTypeLen > 1 && index === paramTypeLen - 1)) continue
      if (key === 'header') key = 'headers'
      const content = typeitems.map(({ name }) => (isKeyword(name) ? `${name}:_${name}` : name)).join(',')
      paramsInfo.paramsContents.push({ type: key, content: `{ ${content} }` })
    }
  }

  return paramsInfo
}

export function createReturnType(config: Config, docApi: DocApi, funcName: string, responseType?: TypeInfoBase) {
  const { resultTypeRender: render } = config
  const { resConentType } = responseType ?? {}

  function createNewType(typeValue: string) {
    const typeInfo = docApi.typeGroup.addCustomType(firstToUpper(`${funcName}Res`), [])
    typeInfo.attrs.hide = true // 只占名字不生成类型，在 customInfoList 里生成对应类型
    typeStringList.push({ typeName: typeInfo.typeName, typeValue })
    return typeInfo.typeName
  }

  // 这是文件类型返回
  if (resConentType && FileContentType.has(resConentType)) return 'Blob'

  if (render) {
    let typeValue = ''
    if (typeof render === 'string') {
      // typeValue = render(funcName, responseType)
      const typeInfo = responseType?.getRealBody()
      typeValue = render
      let [_, keyName] = render.match(TypeDataKey) || []
      if (keyName) {
        if (typeInfo) {
          keyName = keyName.replace(/['"]/g, '')
          const dataKeyItemType = typeInfo.typeItems.find(i => i.name === keyName)
          const required = dataKeyItemType?.required ?? false
          const typeName = dataKeyItemType?.getKeyValue() ?? ''

          const typeValueStr = typeName
            ? `${typeName}${!required && typeName !== 'null' ? ' | undefined' : ''}`
            : 'unknown'
          typeValue = typeValue.replace(TypeDataKey, typeValueStr)
        } else {
          typeValue = typeValue.replace(TypeDataKey, 'unknown')
        }
      }

      typeValue = typeValue.replace(/\{typeName\}/g, typeInfo?.typeName ?? 'unknown')
    } else if (typeof render === 'function') {
      typeValue = render(funcName, responseType?.getRealBody())
    }
    return `<types.${createNewType(typeValue)}>`
  }
  return responseType ? `<types.${responseType.getRealBody().typeName}>` : '<unknown>'
}
