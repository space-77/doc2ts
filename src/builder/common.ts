import _ from 'lodash'
import path from 'path'
import { Config } from '../common/config'
import { TypeDataKey } from '../common/reg'
import { typeStringList } from './buildType'
import { FileContentType } from './tsFileBuilder'
import { DocApi, TypeItem, TypeInfoBase, commonTypeKey } from 'doc-pre-data'
import { checkJsLang, firstToUpper, isKeyword, resolveOutPath } from '../utils'

export type TypeBase = TypeInfoBase

export type ParamsContents = { type: ConstType; content: string }

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

type ConstType = 'query' | 'headers' | 'path' | 'body'
export type ParamsInfo = ReturnType<typeof createParams>

// 按照这个顺序排序
const typeIndexMap = { path: 0, header: 1, query: 2, body: 3 } as Record<string, number>

export function createParams(paramsTypeInfo: TypeBase[], typeItems: TypeItem[]) {
  const paramsInfo = {
    // 参数种类
    paramType: '',
    paramName: '',

    /**
     * @description 解构信息
     */
    deconstruct: '',
    paramTypeDesc: undefined as string | undefined,

    typeGroupList: [] as [string, TypeItem[]][],

    // 以下是需要 在 params 解构参数 再 重构参数成对应的参数类型
    paramsContents: [] as ParamsContents[]
  }

  const typeGroup = _.groupBy(typeItems, 'paramType')
  const typeGroupList = Object.entries(typeGroup).sort(([a], [b]) => typeIndexMap[a] - typeIndexMap[b])

  paramsInfo.typeGroupList = typeGroupList
  const paramTypeLen = typeGroupList.length

  if (typeItems.length === 1) {
    // 只有一个参数，直接取出来
    const [firstItem] = typeItems
    const { name, paramType, type, ref, required, deprecated, description } = firstItem

    const isDefType = typeof type === 'string' && !ref
    const oneTypeValue = firstItem.getKeyValue()
    const reqStr = required ? '' : '?'
    const typeInfo = isDefType ? `${reqStr}:${oneTypeValue}` : `:types.${paramsTypeInfo[0].getSpaceName()}['${name}']`

    paramsInfo.paramType = typeInfo
    paramsInfo.paramTypeDesc = isDefType
      ? `* @param { ${firstToUpper(oneTypeValue)} } ${name} ${description || ''}`
      : undefined
    paramsInfo.paramName = checkName(name)
  } else if (typeItems.length > 1) {
    paramsInfo.paramType = paramsTypeInfo.map(i => `:types.${i.getSpaceName()}`).join('&')

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

      let [lastType, paramItems] = typeGroupList[paramTypeLen - 1]
      if (lastType === 'header') lastType = 'headers'
      const overType = typeGroupList.slice(0, paramTypeLen - 1).map(([, typeList]) => typeList)

      // 参数解构
      let some = false
      let every = true
      const sameList: string[] = []
      const params = _.flatten(overType).map(({ name }) => {
        const newName = checkName(name)

        const has = paramItems.some(j => j.name === name)
        if (!has) every = false
        if (has) {
          some = true
          sameList.push(newName)
        }
        return newName
      })

      // 解构出来的参数也存在最后的剩余参数里，需要重新整理剩余参数
      let textCode = ''
      if (some) {
        const preType = lastType

        if (every) {
          // 完全相同
          lastType = '' // 不需要接收剩余类型了
          textCode = `\nconst ${preType} = ${paramsInfo.paramName}`
        } else {
          // 部分相同
          lastType = `, ..._${lastType}`
          textCode = `\nconst ${preType} = {${sameList.join(',')}${lastType}}`
        }
      } else {
        lastType = `, ...${lastType}`
      }

      paramsInfo.deconstruct = `const {${params.join(',')} ${lastType}} = ${paramsInfo.paramName}${textCode}`
    }
  }

  // 参数只有个一 或 参数多于一个并且参数类型大于一个时，生成参数类型重组代码。【参数类型只有一个时，形参就是对应类型名字】
  if (typeItems.length === 1 || (typeItems.length > 1 && paramTypeLen > 1)) {
    for (let i = 0; i < typeGroupList.length; i++) {
      const [paramType, typeitems] = typeGroupList[i]
      let key = paramType as any
      // 参数类型是 path  或者 多个类型的最后一个不用处理【上面已经做了解构处理】
      if (key === 'path' || (paramTypeLen > 1 && i === paramTypeLen - 1)) continue
      if (key === 'header') key = 'headers'

      const content = typeitems.map(({ name }) => (isKeyword(name) ? `${name}:_${name}` : name)).join(',')
      paramsInfo.paramsContents.push({ type: key, content: `{ ${content} }` })
    }
  }

  return paramsInfo
}

export function formatType(type: string, isJs: boolean) {
  const [first, second, ...types] = type.split('.')

  if (second === commonTypeKey) {
    return `${/^:/.test(type) ? ':' : ''}${[second, ...types].join('.')}`
  }

  if (isJs) return type
  return [first, ...types].join('.')
}

export function createReturnType(
  config: Config,
  docApi: DocApi,
  funcName: string,
  groupName?: string,
  responseType?: TypeInfoBase
) {
  const { resultTypeRender: render, languageType } = config
  const isJs = checkJsLang(languageType)
  const { resConentType } = responseType ?? {}

  function createNewType(typeValue: string) {
    const typeInfo = docApi.typeGroup.addCustomType(`R${firstToUpper(`${funcName}`)}`, [], groupName)
    typeInfo.attrs.typeValue = typeValue
    typeInfo.attrs.defineType = true
    return typeInfo.getSpaceName()
  }

  // 这是文件类型返回
  if (resConentType && FileContentType.has(resConentType)) return ''

  if (render) {
    let typeValue = ''
    if (typeof render === 'string') {
      const typeInfo = responseType?.getRealBody()

      typeValue = render
      let [_, keyName] = render.match(TypeDataKey) || []
      if (keyName) {
        if (typeInfo) {
          keyName = keyName.replace(/['"]/g, '')
          const dataKeyItemType = typeInfo.typeItems.find(i => i.name === keyName)
          const required = dataKeyItemType?.required ?? false
          const { spaceName } = dataKeyItemType?.typeRef ?? {}
          const typeName = spaceName ?? dataKeyItemType?.getKeyValue() ?? ''
          const requiredStr = !required && typeName !== 'null' ? ' | undefined' : ''
          const typeValueStr = typeName ? `${typeName}${requiredStr}` : 'unknown'

          typeValue = typeValue.replace(TypeDataKey, typeValueStr)
        } else {
          typeValue = typeValue.replace(TypeDataKey, 'unknown')
        }
      }

      typeValue = typeValue.replace(/\{typeName\}/g, typeInfo?.getSpaceName() ?? 'unknown')
    } else if (typeof render === 'function') {
      typeValue = render(funcName, responseType?.getRealBody())
    }
    return `<${formatType(`types.${createNewType(typeValue)}`, isJs)}>`
  }
  return responseType ? `<${formatType(`types.${responseType.getRealBody().getSpaceName()}`, isJs)}>` : '<unknown>'
}
