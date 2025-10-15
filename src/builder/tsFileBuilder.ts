// TODO 方法缺少 title
import _ from 'lodash'
import path from 'path'
import Base from './base'
import keyword from 'is-ecma-keyword'
import { fileList } from '../generators/fileList'
import { authorStr } from '../common/config'
import { customInfoList } from './buildType'
import { createParams, createReturnType, formatType, ParamsContents, TypeBase } from './common'
import { PathInfo, RequestBodies, Custom, dotsUtils, PathItem, commonTypeKey } from 'doc-pre-data'
import { checkJsLang, findDiffPath, firstToLower, firstToUpper, getDesc, resolveOutPath } from '../utils'

export const FileContentType = new Set(['application/octet-stream'])
export const FormDataKey = new Set(['multipart/form-data', 'application/x-www-form-urlencoded'])
export const indexFileContent: string[] = []

export const importList: string[] = []
export const exportList: string[] = []

export default class TsFileBuilder extends Base {
  private get isJs(): boolean {
    return checkJsLang(this.config.languageType)
  }

  /**
   * @description 获取 接口请求信息
   */
  private getParamsInfo(funcItem: PathItem) {
    const { docApi } = this.doc
    const { disableParams } = this.config
    const { parameterType, requestBodyType, moduleName, name } = funcItem

    let paramsTypeInfo = [parameterType, requestBodyType].map(i => i?.getRealBody()).filter(Boolean) as TypeBase[]

    let typeItems = _.flatten(paramsTypeInfo.map(i => i.getTypeItems()))

    // TODO 文档： 过滤 cookie 类型参数
    // TODO 文档： 过滤 header 类型参数，header 参数一般是用于设置token，token信息一般都是在拦截器为所有接口配置，不需要每个参数都显式传入

    // Report
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
      typeInfo = docApi.typeGroup.addCustomType(firstToUpper(`${name}Params`), [], moduleName)
      typeInfo.init()
      typeInfo.refs.push(...paramsTypeInfo.map(i => ({ typeInfo: i })))
      typeInfo.attrs.compose = true // 只占名字不生成类型，在 customInfoList 里生成对应类型
      typeInfo.attrs.fileName = moduleName
      customInfoList.push(typeInfo)
    }

    const paramsInfo = createParams(paramsTypeInfo, typeItems)
    return { paramsInfo, typeItems, typeInfo }
  }

  private formatParamsContents(paramsContents: ParamsContents[]) {
    return paramsContents.map(({ type, content }) => `const ${type} = ${content}`)
  }

  private getFuncHead(funcInfo: PathItem, param: string) {
    const { arrowFunc } = this.config
    const { name } = funcInfo
    const funcName = firstToLower(name)
    const arrowFuncStr = arrowFunc ? '=>' : ''
    return `${funcName} ${arrowFunc ? '=' : ''}${param}${arrowFuncStr}`
  }

  private generatorApiMethod(funcItem: PathItem, typesList: string[], className: string) {
    const { doc, config } = this
    const { docApi } = doc

    let content = ''

    let hasCommonType = false
    const { arrowFunc, declaration } = config
    const { item, name, method, apiPath } = funcItem
    const { responseType, requestBodyType } = funcItem
    const { deprecated, description, externalDocs, summary } = item

    const { paramsInfo, typeItems, typeInfo } = this.getParamsInfo(funcItem)
    const { paramName = '', paramsContents, deconstruct, paramType, typeGroupList, paramTypeDesc } = paramsInfo
    let paramTypeStr = ''
    if (typeItems.length > 0) {
      let spaceName = typeInfo?.getSpaceName()
      spaceName = spaceName ? `:types.${spaceName}` : undefined

      paramTypeStr = spaceName || paramType
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
      const { contentType } = requestBodyType as RequestBodies // .getRealBody() as RequestBodies
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

    const groupName = funcItem.responseType?.getSpaceName()
    const returnType = createReturnType(config, docApi, name, groupName, responseType?.getRealBody())

    if (returnType.indexOf(commonTypeKey) > -1) hasCommonType = true

    // 生成 js文件，并且 不保留 .d.ts 类型文件时，生成方法类型注释
    let returnTypeStrName: string | undefined
    if (!declaration && this.isJs) {
      const [, returnTypeStr] = returnType.match(/\<types\.(.*)\>/) ?? []
      const [, _paramTypeStr] = paramTypeStr.match(/:types\.(.*)/) ?? []

      if (_paramTypeStr) {
        const type = _.last(_paramTypeStr.split('.'))
        paramList.push(`* @param { ${type} } ${paramName}`)
        typesList.push(` * @typedef { import("./types").${_paramTypeStr} } ${type}`)
      }
      if (returnTypeStr) {
        const type = _.last(returnTypeStr.split('.'))
        returnTypeStrName = `* @return { ${type} }`
        typesList.push(` * @typedef { import("./types").${returnTypeStr} } ${type}`)
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
    let urlStr = `const url = ${urlSemicolon}${apiPath.replace(/\{/g, '${')}${query}${urlSemicolon}`
    if (configStr.length + urlStr.length < 60) {
      urlStr = ''
      const url = apiPath.replace(/\{/g, '${')
      configStr = `{ url: ${urlSemicolon}${url}${query}${urlSemicolon}  ${configParams} method: '${method}' }`
    }

    // 生成接口请求方法
    // const arrowFuncStr = arrowFunc ? '=>' : ''
    const paramsType = formatType(paramTypeStr, this.isJs)
    if (paramsType.indexOf(commonTypeKey) > -1) hasCommonType = true
    const paramStr = ` (${paramName}${paramsType}) `

    // 方法头信息
    const funcHead = this.getFuncHead(funcItem, paramStr)

    // 方法体内容
    const funcBody = []
    funcBody.push(deconstruct) // 结构信息
    funcBody.push(formDataStr) // formData 信息
    funcBody.push(...this.formatParamsContents(paramsContents)) // 参数信息
    funcBody.push(urlStr) // url 信息
    funcBody.push(`const config: DocReqConfig = ${configStr}`) // 请求的 config

    const { downloadName = 'download', requestName = 'request' } = this.origin
    funcBody.push(`return this.${isFile ? downloadName : requestName}${returnType}(config)`) // return 方法

    content += `${desc} ${funcHead} {${funcBody.filter(Boolean).join('\n')}}\n\n`
    return { content, hasCommonType }
  }

  private createClass(moduleInfo: PathInfo, className: string) {
    const { tagInfo, pathItems } = moduleInfo
    const { description, name } = tagInfo ?? {}

    pathItems.sort((a, b) => a.name.length - b.name.length)

    const baseClassName = this.getBaseFileName
    let hasCommonType = false

    const desc = getDesc({ description, name })
    let typesList: string[] = []
    let content = `${desc} export default class ${className} extends ${baseClassName} {`

    // 生成类里的请求方法
    for (const funcItem of pathItems) {
      const { content: _content, hasCommonType: hasType } = this.generatorApiMethod(funcItem, typesList, className)
      content += _content
      if (hasType) hasCommonType = true
    }

    content += '}'

    const typesStr = _.uniq(typesList)
      .sort((a, b) => a.length - b.length)
      .join('\n')

    return { content, typesStr, hasCommonType }
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

      let { content, typesStr, hasCommonType } = this.createClass(moduleInfo, className)
      content = `import type {${className} as types ${hasCommonType ? `, ${commonTypeKey}` : '' }} from './types'\n${content}`
      content = `import ${baseName} from '${this.getClientPath(filePath)}'\n${content}`
      content = `import type { DocReqConfig } from "doc2ts";\n${content}`
      content = `${content}\nexport const ${_fileName} = new ${className}()`

      // 不保留 .d.ts 文件，在 .js 文件添引入 types.d.ts 类型
      if (!declaration && this.isJs && !!typesStr) {
        const descriptionStr = '* @description 以下是js模式下的类型引入，有助于类型提示'
        content += `\n/**\r\n${descriptionStr}\r\n${typesStr}\n */`
      }

      if (typeof render === 'function') content = render(content, filePath)
      content = `${authorStr}\n\n${content}`

      fileList.push({ filePath, content })

      const fileExPath = findDiffPath(outDirDir, filePath).replace(/\.ts$/, '')
      importList.push(`export { ${_fileName} } from '${fileExPath}'`)
      exportList.push(_fileName)
    }
  }
}
