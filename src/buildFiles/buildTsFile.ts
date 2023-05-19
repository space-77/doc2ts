// TODO 方法缺少 title
import _ from 'lodash'
import path from 'path'
import { Config } from '../common/config'
import { fileList } from '../generators/fileList'
import { DocListItem } from '../types/newType'
import { customInfoList } from './buildType'
import { DocApi, PathInfo, RequestBodies, Custom } from 'doc-pre-data'
import { createParams, createReturnType, getOutputDir, TypeBase } from './common'
import { checkJsLang, findDiffPath, firstToLower, firstToUpper, getDesc, resolveOutPath } from '../utils'

export const FileContentType = new Set(['application/octet-stream'])
export const FormDataKey = new Set(['multipart/form-data', 'application/x-www-form-urlencoded'])
export const indexFileContent: string[] = []

export const importList: string[] = []
export const exportList: string[] = []

function getClientPath(config: Config, filePath: string) {
  const { baseClassPath } = config
  const tempClassDirList = filePath.split(path.sep)
  const tempClassDir = path.join(...tempClassDirList.slice(0, tempClassDirList.length - 1))
  return findDiffPath(tempClassDir, resolveOutPath(baseClassPath))
}

function getBaseFileName(config: Config) {
  const { baseClassName } = config
  return baseClassName.replace(/^\{(.+)\}$/, (_, $1) => $1)
}

function createClass(moduleInfo: PathInfo, className: string, docApi: DocApi, config: Config) {
  const { tagInfo, pathItems } = moduleInfo
  const { description, name } = tagInfo ?? {}

  pathItems.sort((a, b) => a.name.length - b.name.length)

  const { disableParams, arrowFunc, declaration, languageType } = config
  const baseClassName = getBaseFileName(config)

  const desc = getDesc({ description, name })
  const isJs = checkJsLang(languageType)
  let typesList: string[] = []
  let content = `${desc} export default class ${className} extends ${baseClassName} {`
  for (const funcItem of pathItems) {
    const { item, name, method, apiPath } = funcItem
    const { responseType, parameterType, requestBodyType } = funcItem
    const { deprecated, description, externalDocs, summary } = item

    let paramsTypeInfo = [parameterType, requestBodyType].map(i => i?.getRealBody()).filter(Boolean) as TypeBase[]

    let typeItems = _.uniqBy(_.flatten(paramsTypeInfo.map(i => i.getTypeItems())), 'name')

    // TODO 文档： 过滤 cookie 类型参数
    // TODO 文档： 过滤 header 类型参数，header 参数一般是用于设置token，token信息一般都是在拦截器为所有接口配置，不需要每个参数都显式传入

    typeItems = typeItems
      .filter(i => {
        i.disable =
          i.paramType === 'cookie' ||
          // paramType === 'header' ||
          !!disableParams.find(j => j.paramType === i.paramType && j.keys.includes(i.name))
        return !i.disable
      })
      .sort((a, b) => a.name.length - b.name.length)

    paramsTypeInfo = paramsTypeInfo.filter(i => i && !i.isEmpty) as TypeBase[]

    let typeInfo: Custom | undefined = undefined
    if (paramsTypeInfo.length === 2) {
      // 需要做类型合并
      typeInfo = docApi.typeGroup.addCustomType(firstToUpper(`${name}Params`), [])
      typeInfo.init()
      typeInfo.refs.push(...paramsTypeInfo.map(i => ({ typeInfo: i })))
      typeInfo.attrs.hide = true // 只占名字不生成类型，在 customInfoList 里生成对应类型
      customInfoList.push(typeInfo)
    }

    const paramsInfo = createParams(paramsTypeInfo, typeItems)
    const { paramName = '', paramsContents, deconstruct, paramType, typeGroupList, paramTypeDesc } = paramsInfo
    let paramTypeStr = ''
    if (typeItems.length > 0) {
      let { typeName } = typeInfo ?? {}
      typeName = typeName ? `:types.${typeName}` : undefined
      paramTypeStr = typeName || paramType
    }

    // 整理 query 参数
    const hasQuery = typeItems.some(i => i.paramType === 'query')
    let query = ''
    if (hasQuery) {
      if (typeGroupList.length === 1 && typeItems.length > 1) {
        query = '?${this.serialize(query)}'
      } else {
        const index = paramsContents.findIndex(i => i.type === 'query')
        if (index > -1) {
          query = `?\${this.serialize(${paramsContents[index].content})}`
          paramsContents.splice(index, 1)
        } else {
          query = '?${this.serialize(query)}'
        }
      }
    }

    const hasPath = typeItems.some(i => i.paramType === 'path')
    const urlSemicolon = hasPath || hasQuery ? '`' : "'"

    const hasHeader = typeItems.some(i => i.paramType === 'header')
    let headersStr = hasHeader ? ',headers' : ''

    const paramList: string[] = []
    const hasBody = typeItems.some(i => i.paramType === 'body')
    const bodyStr = hasBody ? ',body' : ''
    if (hasBody) {
      const { contentType } = requestBodyType!.getRealBody() as RequestBodies
      if (contentType && FormDataKey.has(contentType)) {
        const bodyItem = paramsContents.find(i => i.type === 'body')
        if (bodyItem) bodyItem.content = `this.formData(${bodyItem.content})`

        const headersItem = paramsContents.find(i => i.type === 'headers')
        if (headersItem) {
          headersItem.content.replace(/\}/, `, ...this.formDataType}`)
        } else {
          headersStr = ',headers: {...this.formDataType}'
        }
      }
    }

    const returnType = createReturnType(config, docApi, name, responseType?.getRealBody())

    // 生成 js文件，并且 不保留 .d.ts 类型文件时，生成方法类型注释
    let returnTypeStrName: string | undefined
    if (declaration === false && isJs) {
      const [, returnTypeStr] = returnType.match(/\<types\.(.*)\>/) ?? []
      const [, _paramTypeStr] = paramTypeStr.match(/:types\.(.*)/) ?? []

      if (_paramTypeStr) {
        paramList.push(`* @param { ${_paramTypeStr} } ${paramName}`)
        typesList.push(` * @typedef { import("./types").${_paramTypeStr} } ${_paramTypeStr}`)
      }
      if (returnTypeStr) {
        returnTypeStrName = `* @return { ${returnTypeStr} }`
        typesList.push(` * @typedef { import("./types").${returnTypeStr} } ${returnTypeStr}`)
      }
    }

    if (paramTypeDesc) paramList.push(paramTypeDesc)
    const desc = getDesc(
      { description, deprecated, externalDocs, summary },
      { paramList, returnType: returnTypeStrName }
    )

    //TODO 根据返回类型 调用下载方法
    // Blob ArrayBuffer
    // application/octet-stream
    const { resConentType } = responseType?.getRealBody() ?? {}

    // 接口数据返回的是不是 文件流，如果是文件流则调用 下载方法
    const isFile = resConentType && FileContentType.has(resConentType)

    let configStr = `{ url ${bodyStr} ${headersStr}, method: '${method}' }`
    let urlStr = `\nconst url = ${urlSemicolon}${apiPath.replace(/\{/g, '${')}${query}${urlSemicolon}`
    if (configStr.length + urlStr.length < 60) {
      urlStr = ''
      const url = apiPath.replace(/\{/g, '${')
      configStr = `{ url: ${urlSemicolon}${url}${query}${urlSemicolon}  ${bodyStr} ${headersStr}, method: '${method}' }`
    }

    const arrowFuncStr = arrowFunc ? '=>' : ''
    const paramStr = ` (${paramName}${paramTypeStr}) `
    content += `\n ${desc} ${firstToLower(name)} ${arrowFunc ? '=' : ''}${paramStr}${arrowFuncStr}{
      ${deconstruct}
      ${paramsContents.map(({ type, content }) => `const ${type} = ${content}`).join('\r\n')}${urlStr}    
      const config: DocReqConfig = ${configStr}
      return this.${isFile ? 'download' : 'request'}${returnType}(config)
    }\n`
  }
  content += '}'
  const typesStr = _.uniq(typesList)
    .sort((a, b) => a.length - b.length)
    .join('\n')
  return { content, typesStr }
}

export function buildApiFile(doc: DocListItem, config: Config) {
  const { docApi, moduleName = '' } = doc
  const { outDir, render, declaration, languageType } = config
  const outDirDir = resolveOutPath(outDir)
  const outputDir = getOutputDir(moduleName, config)
  const { funcGroupList } = docApi

  const baseName = getBaseFileName(config)

  for (const moduleInfo of funcGroupList) {
    const { moduleName: fileName } = moduleInfo
    const className = firstToUpper(fileName)
    const filePath = path.join(outputDir, `${firstToLower(fileName)}.ts`)
    const _fileName = firstToLower(fileName)

    let { content, typesStr } = createClass(moduleInfo, className, docApi, config)
    content = `import type * as types from './types'\n${content}`
    content = `import ${baseName} from '${getClientPath(config, filePath)}'\n${content}`
    content = `import type { DocReqConfig } from "doc2ts";\n${content}`
    content = `${content}\nexport const ${_fileName} = new ${className}()`

    // 不保留 .d.ts 文件，在 .js 文件添引入 types.d.ts 类型
    const isJs = checkJsLang(languageType)
    if (declaration === false && isJs && !!typesStr) {
      const descriptionStr = '* @description 以下是js模式下的类型引入，有助于类型提示'
      content += `\n/**\r\n${descriptionStr}\r\n${typesStr}\n */`
    }

    if (typeof render === 'function') {
      content = render(content, filePath)
    }

    fileList.push({ filePath, content })

    const fileExPath = findDiffPath(outDirDir, filePath).replace(/\.ts$/, '')
    importList.push(`import { ${_fileName} } from '${fileExPath}'`)
    exportList.push(_fileName)
  }
}
