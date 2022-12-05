// TODO 方法缺少 title
import _ from 'lodash'
import path from 'path'
import { Config } from '../common/config'
import { fileList } from '../generators/fileList'
import { DocListItem } from '../types/newType'
import { customInfoList } from './buildType'
import { DocApi, PathInfo, RequestBodies, Custom } from 'doc-pre-data'
import { createParams, createReturnType, getOutputDir, TypeBase } from './common'
import { findDiffPath, firstToLower, firstToUpper, getDesc, resolveOutPath } from '../utils'

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

  const { disableParams = [] } = config
  const baseClassName = getBaseFileName(config)

  const desc = getDesc({ description, name })
  let content = `${desc} export default class ${className} extends ${baseClassName} {`
  for (const funcItem of pathItems) {
    const { item, name, method, apiPath } = funcItem
    const { responseType, parameterType, requestBodyType } = funcItem
    const { deprecated, description, externalDocs, summary } = item

    // FIXME 这里不能拿真身，真身的 paramType 不一样
    let paramsTypeInfo = [parameterType, requestBodyType].filter(Boolean) as TypeBase[]

    let typeItems = _.uniqBy(_.flatten(paramsTypeInfo.map(i => i.getTypeItems())), 'name')

    // TODO 文档： 过滤 cookie 类型参数
    // TODO 文档： 过滤 header 类型参数，header 参数一般是用于设置token，token信息一般都是在拦截器为所有接口配置，不需要每个参数都显式传入

    typeItems = typeItems
      .filter(i => {
        i.disable =
          i.paramType === 'cookie' ||
          // paramType === 'header' ||
          !!disableParams.find(j => j.name === i.name && j.type === i.paramType)
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
    const { paramName = '', paramsContents, deconstruct, paramType, typeGroupList } = paramsInfo
    let paramTypeStr = ''
    if (typeItems.length > 0) {
      paramTypeStr = typeInfo?.typeName || paramType
      paramTypeStr = paramTypeStr ? `:types.${paramTypeStr}` : ''
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
        }
      }
    }

    const hasPath = typeItems.some(i => i.paramType === 'path')
    const urlSemicolon = hasPath || hasQuery ? '`' : "'"

    const hasHeader = typeItems.some(i => i.paramType === 'header')
    let headersStr = hasHeader ? ',headers' : ''

    const hasBody = typeItems.some(i => i.paramType === 'body')
    const bodyStr = hasBody ? ',body' : ''
    if (hasBody) {
      const { contentType } = requestBodyType as RequestBodies
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

    const desc = getDesc({ description, deprecated, externalDocs, summary })
    const returnType = createReturnType(config, docApi, name, responseType) // responseType ? `<types.${responseType.getRealBody().typeName}>` : 'any'

    //TODO 根据返回类型 调用下载方法
    // Blob ArrayBuffer
    // application/octet-stream
    const { resConentType } = responseType ?? {}

    // 接口数据返回的是不是 文件流，如果是文件流则调用 下载方法
    const isFile = resConentType && FileContentType.has(resConentType)

    let configStr = `{ url ${bodyStr} ${headersStr}, method: '${method}' }`
    let urlStr = `\nconst url = ${urlSemicolon}${apiPath.replace(/\{/g, '${')}${query}${urlSemicolon}`
    if (configStr.length + urlStr.length < 60) {
      urlStr = ''
      const url = apiPath.replace(/\{/g, '${')
      configStr = `{ url: ${urlSemicolon}${url}${query}${urlSemicolon}  ${bodyStr} ${headersStr}, method: '${method}' }`
    }

    content += `\n ${desc} ${name}(${paramName}${paramTypeStr}){
      ${deconstruct}
      ${paramsContents.map(({ type, content }) => `const ${type} = ${content}`).join('\r\n')}${urlStr}    
      const config: DocReqConfig = ${configStr}
      return this.${isFile ? 'download' : 'request'}${returnType}(config)
    }\n`
  }
  content += '}'
  return content
}

export function buildApiFile(doc: DocListItem, config: Config) {
  const { docApi, moduleName = '' } = doc
  const { outDir, render } = config
  const outDirDir = resolveOutPath(outDir)
  // const indexPath = path.join(resolveOutPath(outDir), 'index.ts')
  const outputDir = getOutputDir(moduleName, config)
  const { funcGroupList } = docApi

  const baseName = getBaseFileName(config)

  for (const moduleInfo of funcGroupList) {
    const { moduleName: fileName } = moduleInfo
    const className = firstToUpper(fileName)
    const filePath = path.join(outputDir, `${firstToLower(fileName)}.ts`)
    const _fileName = firstToLower(fileName)

    let content = createClass(moduleInfo, className, docApi, config)
    content = `import type { DocReqConfig } from "doc2ts";\n${content}`
    content = `import type * as types from './types'\n${content}`
    content = `import ${baseName} from '${getClientPath(config, filePath)}'\n${content}`
    content = `${content}\nexport const ${_fileName} = new ${className}()`

    if (typeof render === 'function') {
      content = render(content, filePath)
    }

    fileList.push({ filePath, content })

    // console.log(outDirDir)
    // console.log(filePath)
    const fileExPath = findDiffPath(outDirDir, filePath).replace(/\.ts$/, '')
    importList.push(`import { ${_fileName} } from '${fileExPath}'`)
    exportList.push(_fileName)
    // indexContnt += `import ${_fileName} from '${fileExPath}'`

    // indexFileContent
  }

  // createApiBaseClass(config)
}
