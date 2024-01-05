// TODO 方法缺少 title
import _ from 'lodash'
import path from 'path'
import Base from './base'
import { Config } from '../common/config'
import { fileList } from '../generators/fileList'
import { DocListItem } from '../types/newType'
import { customInfoList } from './buildType'
import { DocApi, PathInfo, RequestBodies, Custom, dotsUtils, PathItem } from 'doc-pre-data'
import { createParams, createReturnType, getOutputDir, TypeBase } from './common'
import { checkJsLang, findDiffPath, firstToLower, firstToUpper, getDesc, resolveOutPath } from '../utils'
const keyword = require('is-es2016-keyword')

export const FileContentType = new Set(['application/octet-stream'])
export const FormDataKey = new Set(['multipart/form-data', 'application/x-www-form-urlencoded'])
export const indexFileContent: string[] = []

export const importList: string[] = []
export const exportList: string[] = []

export default class TsFileBuilder extends Base {
  private get isJs(): Boolean {
    return checkJsLang(this.config.languageType)
  }

  /**
   * @description 获取 接口请求信息
   */
  private getParamsInfo(funcItem: PathItem) {
    const { docApi } = this.doc
    const { disableParams } = this.config
    const { parameterType, requestBodyType, name } = funcItem

    let paramsTypeInfo = [parameterType, requestBodyType].map(i => i?.getRealBody()).filter(Boolean) as TypeBase[]

    let typeItems = _.flatten(paramsTypeInfo.map(i => i.getTypeItems()))

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
    return { paramsInfo, typeItems, typeInfo }
  }

  private generatorApiMethod(funcItem: PathItem, typesList: string[]) {
    const { doc, config } = this
    const { docApi } = doc

    let content = ''

    const { arrowFunc, declaration } = config
    const { item, name, method, apiPath } = funcItem
    const { responseType, requestBodyType } = funcItem
    const { deprecated, description, externalDocs, summary } = item

    const { paramsInfo, typeItems, typeInfo } = this.getParamsInfo(funcItem)
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
        } else query = '?${this.serialize(query)}'
      }
    }

    const hasPath = typeItems.some(i => i.paramType === 'path')
    const urlSemicolon = hasPath || hasQuery ? '`' : "'"

    const hasHeader = typeItems.some(i => i.paramType === 'header')
    let headersStr = hasHeader ? 'headers' : ''

    const paramList: string[] = []
    const hasBody = typeItems.some(i => i.paramType === 'body')
    let bodyName = hasBody ? 'body' : ''
    let formDataStr = ''
    if (hasBody && requestBodyType) {
      const { contentType } = requestBodyType.getRealBody() as RequestBodies
      if (contentType && FormDataKey.has(contentType)) {
        // body 是 formdata
        bodyName = 'formData'
        // const formType = contentType === 'multipart/form-data' ? 'formData' : 'form'

        formDataStr = `;const contentType = '${contentType}'`
        const bodyItem = paramsContents.find(i => i.type === 'body')
        if (bodyItem) {
          bodyItem.type = 'formData' as any
          bodyItem.content = `this.formData(${bodyItem.content}, contentType)`
        } else formDataStr += `;const formData = this.formData(body, contentType)`

        const headersItem = paramsContents.find(i => i.type === 'headers')
        if (headersItem) headersItem.content.replace(/\}/, `, 'Content-Type': contentType}`)
        else headersStr = `headers: {'Content-Type': contentType}`
      }
    }

    const returnType = createReturnType(config, docApi, name, responseType?.getRealBody())

    // 生成 js文件，并且 不保留 .d.ts 类型文件时，生成方法类型注释
    let returnTypeStrName: string | undefined
    if (declaration === false && this.isJs) {
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

    let configParams = [bodyName, headersStr].filter(Boolean).join(',')
    configParams = configParams ? `,${configParams},` : ','
    let configStr = `{ url ${configParams} method: '${method}' }`
    let urlStr = `\nconst url = ${urlSemicolon}${apiPath.replace(/\{/g, '${')}${query}${urlSemicolon}`
    if (configStr.length + urlStr.length < 60) {
      urlStr = ''
      const url = apiPath.replace(/\{/g, '${')
      configStr = `{ url: ${urlSemicolon}${url}${query}${urlSemicolon}  ${configParams} method: '${method}' }`
    }

    // 生成接口请求方法
    const arrowFuncStr = arrowFunc ? '=>' : ''
    const paramStr = ` (${paramName}${paramTypeStr}) `
    content += `\n ${desc} ${firstToLower(name)} ${arrowFunc ? '=' : ''}${paramStr}${arrowFuncStr}{
      ${deconstruct}${paramsContents
      .map(({ type, content }) => `const ${type} = ${content}`)
      .join('\r\n')}${urlStr}${formDataStr}
        const config: DocReqConfig = ${configStr}
        return this.${isFile ? 'download' : 'request'}${returnType}(config)
      }\n`
    return content
  }

  private createClass(moduleInfo: PathInfo, className: string) {
    const { tagInfo, pathItems } = moduleInfo
    const { description, name } = tagInfo ?? {}

    pathItems.sort((a, b) => a.name.length - b.name.length)

    const baseClassName = this.getBaseFileName

    const desc = getDesc({ description, name })
    let typesList: string[] = []
    let content = `${desc} export default class ${className} extends ${baseClassName} {`

    // 生成类里的请求方法
    for (const funcItem of pathItems) content += this.generatorApiMethod(funcItem, typesList)

    content += '}'

    const typesStr = _.uniq(typesList)
      .sort((a, b) => a.length - b.length)
      .join('\n')

    return { content, typesStr }
  }

  public build() {
    const { doc, config } = this
    const { docApi, moduleName = '' } = doc
    const { outDir, render, declaration } = config
    const outDirDir = resolveOutPath(outDir)
    const outputDir = this.getOutputDir(moduleName)
    const { funcGroupList } = docApi

    const baseName = this.getBaseFileName

    for (const moduleInfo of funcGroupList) {
      const { moduleName: fileName } = moduleInfo

      let _fileName = dotsUtils.checkTsTypeKeyword(firstToLower(fileName))
      _fileName = keyword(_fileName) ? `module${firstToUpper(_fileName)}` : _fileName

      const className = firstToUpper(_fileName)
      const filePath = path.join(outputDir, `${firstToLower(_fileName)}.ts`)

      let { content, typesStr } = this.createClass(moduleInfo, className)
      content = `import type * as types from './types'\n${content}`
      content = `import ${baseName} from '${this.getClientPath(filePath)}'\n${content}`
      content = `import type { DocReqConfig } from "doc2ts";\n${content}`
      content = `${content}\nexport const ${_fileName} = new ${className}()`

      // 不保留 .d.ts 文件，在 .js 文件添引入 types.d.ts 类型
      if (declaration === false && this.isJs && !!typesStr) {
        const descriptionStr = '* @description 以下是js模式下的类型引入，有助于类型提示'
        content += `\n/**\r\n${descriptionStr}\r\n${typesStr}\n */`
      }

      if (typeof render === 'function') content = render(content, filePath)

      fileList.push({ filePath, content })

      const fileExPath = findDiffPath(outDirDir, filePath).replace(/\.ts$/, '')
      importList.push(`export { ${_fileName} } from '${fileExPath}'`)
      exportList.push(_fileName)
    }
  }
}
