import fs from 'fs'
import path from 'path'
import { fileList } from './fileList'
import type { Property } from '../pont-engine'
import type { Method } from '../types/client'
import { firstToUpper, findDiffPath, firstToLower } from '../utils'
import type { FilePathList, GetParamsStr, ModelInfo } from '../types/type'
import { keyWords, keyWordsListSet, PARAMS_NAME } from '../common/config'

export class CreateApiFile {
  modelInfo!: ModelInfo
  fileContent = '' // 文件内容
  constructor(params: ModelInfo) {
    this.modelInfo = params

    this.formatFileData()
  }
  formatFileData() {
    const { fileName, dirPath, description, typeDirPaht, diffClassPath, isJs } = this.modelInfo

    const className = firstToUpper(fileName)
    const classNameLower = firstToLower(fileName)
    let typeFilePath = ''

    if (!isJs) {
      typeFilePath = findDiffPath(dirPath, path.join(typeDirPaht, fileName))
      typeFilePath = `\nimport type * as mT from '${typeFilePath}'`
    }

    const classMethodStr = this.generateApiClassMethod()
    let content = this.getTempData('../temp/apiFile')
    content = content.replace(/\{className\}/g, className)
    content = content.replace(/\{description\}/g, description)
    content = content.replace(/\{typeFilePath\}/g, typeFilePath)
    content = content.replace(/\{baseClassPath\}/g, diffClassPath)
    content = content.replace(/\{classMethodStr\}/g, classMethodStr)
    content = content.replace(/\{classNameLower\}/g, classNameLower)

    this.fileContent = content
  }

  generateApiClassMethod() {
    const { config = {}, hideMethod, interfaces, isJs, methodConfig } = this.modelInfo
    interfaces.sort((a, b) => a.path.length - b.path.length)
    const methodsList = interfaces.map(i => {
      const { name: funName, method: met, path: _path, description, response, parameters, id = '' } = i
      const funcConfig = config.methodConfig || methodConfig
      // console.log(funcConfig)
      const { isDownload, config: metConfig, description: configDes } = funcConfig?.[id] || {}

      this.fixParamsType(parameters, met as Method)
      const paramsInfo = this.getParamsStr(parameters)
      const { methodBody, body, header, formData, paramsName } = paramsInfo

      // const paramsName = parameters.length === 0 ? '()' : onlyType && hasBody ? bodyName : 'params'

      const requestMethod = isDownload ? 'downloadFile' : 'request'
      const url = this.formatUrl(_path, paramsInfo)
      const otherConfig = header + formData
      const funTypeName = isJs ? '' : `: mT.${firstToUpper(funName)}`
      const requestConfig = metConfig ? `, config: ${JSON.stringify(metConfig)}` : ''
      const hideMet = hideMethod ? /^get$/i.test(met) || (/^post$/i.test(met) && body) : false
      const method = hideMet ? '' : `, method: '${met}'`
      const des = configDes ? configDes : description.replace(/\n\r?/, '，') || ''
      const funConfig = `url${body}${otherConfig}${method}${requestConfig}`

      let content = this.getTempData('../temp/apiFileMethod')
      content = content.replace(/\{id\}/g, id)
      content = content.replace(/\{url\}/g, url)
      content = content.replace(/\{funName\}/g, firstToLower(funName))
      content = content.replace(/\{funConfig\}/g, funConfig)
      content = content.replace(/\{methodBody\}/g, methodBody)
      content = content.replace(/\{paramsName\}/g, paramsName)
      content = content.replace(/\{funTypeName\}/g, funTypeName)
      content = content.replace(/\{description\}/g, des)
      return content.replace(/\{requestMethod\}/g, requestMethod)
    })

    return methodsList.join('\n\n')
  }

  /**
   * @description  把get请求的 body 类型的参数，改为 query 类型
   */
  fixParamsType(parameters: Property[], method: Method) {
    if (/get/i.test(method)) {
      parameters.forEach(i => {
        if (i.in === 'body') i.in = 'query'
      })
    }
  }

  formatUrl(url: string, paramsInfo: GetParamsStr) {
    const { hasPath, hasQuery, queryValue, onlyType } = paramsInfo
    if (hasPath || hasQuery) {
      if (hasPath)
        url = url.replace(/\{(\w+)\}/g, v => {
          let val = v
          if (onlyType) {
            // 只有一个参数的时候 形参是否包含 关键字用的是  keyWordsListSet
            val = keyWordsListSet.has(v) ? `_${v}` : v
          } else {
            // 多个参数的时候 形参是否包含 关键字用的是  keyWords
            val = this.joinParams([v])
          }
          return `$${val}`
        })
      return `\`${url}${hasQuery ? `?\${${queryValue}}` : ''}\``
    }
    return `'${url}'`
  }

  getParamsStr(parameters: Property[]): GetParamsStr {
    // TODO 不同类型的参数重名存在 【bug】
    const { joinParams } = this

    let methodBody = ''
    const bodyName = PARAMS_NAME.BODY
    // const queryName = PARAMS_NAME.QUERY
    const headerName = PARAMS_NAME.HEADER
    const formDataName = PARAMS_NAME.FORMDATA
    let queryValue: string | undefined

    let body = ''
    let header = ''
    let formData = ''

    // 是否需要解构请求参数
    const pathParams = parameters.filter(i => i.in === 'path')
    const hasPath = pathParams.length > 0

    // query
    const queryParams = this.filterParams(parameters, 'query') // .map(name => `${name}=\${${name}}`) // ['aaa=${aaa}']
    const hasQuery = queryParams.length > 0

    // body
    const bodyParams = this.filterParams(parameters, 'body')
    const hasBody = bodyParams.length > 0
    if (hasBody) body = `, ${bodyName}`

    // formData
    const formDataParams = this.filterParams(parameters, 'formData')
    const hasformData = formDataParams.length > 0
    if (hasformData) formData = `, ${formDataName}`

    // header
    const headerParams = this.filterParams(parameters, 'header') // .map(i => `'${i}': ${i}`) // [ "'aaa': aaa" ]
    const hasHeader = headerParams.length > 0
    if (hasHeader) header = `, ${headerName}`
    const parametersList = new Set(parameters.map(i => i.in))
    const onlyType = parametersList.size === 1
    const onlyParam = parameters.length === 1
    const paramsList = parameters.map(({ name }) => name)
    let paramsStr = 'params'
    let onlyParamName: string | undefined

    // 请求方法的形参
    let paramsName = '()'
    if (parameters.length > 0) {
      if (onlyParam) {
        const { name } = parameters[0]
        onlyParamName = keyWordsListSet.has(name) ? `_${name}` : name
        paramsName = onlyParamName
        paramsStr = name !== onlyParamName ? `{${name}: ${onlyParamName}}` : onlyParamName
      } else {
        paramsName = onlyType && hasBody ? bodyName : paramsStr
      }
    }

    // const parametersSet = new Set(paramsList)
    // 判断是否存在 path 参数
    // 存在 path 参数 或者 存在两种及以上参数类型的需要 解构
    if (hasPath || parametersList.size > 1) {
      // 需要需要解构
      if (!onlyParam) methodBody = `\nconst { ${joinParams(paramsList)} } = ${paramsStr}`

      // 组建各种请求类型参数
      // query
      if (hasQuery) queryValue += `this.serialize({${joinParams(queryParams)}})`

      // body
      if (hasBody) methodBody += `\nconst ${bodyName} = {${joinParams(bodyParams)}}`

      // formData
      if (hasformData) methodBody += `\nconst ${formDataName} = this.formData({${joinParams(formDataParams)}})`

      // header
      if (hasHeader) methodBody += `\nconst ${headerName} = {${joinParams(headerParams)}}`
    } else {
      // 只有一个类型的请求参数
      // 不需要解构

      // 组建各种请求类型参数
      // query
      if (hasQuery) queryValue = `this.serialize(${paramsStr})`

      // body
      // 直接把 params 传给 request方法即可
      if (hasBody && onlyParam) {
        // methodBody = `\nconst ${bodyName} = ${paramsStr}`
        body = `,body: ${paramsStr}`
      }

      // formData
      if (hasformData) {
        formData = `, ${formDataName}`
        methodBody = `\nconst ${formDataName} = this.formData(${paramsStr})`
      }

      // header
      // 直接把 params 传给 request方法即可
    }

    return {
      body,
      header,
      formData,
      methodBody,
      hasPath,
      hasBody,
      hasQuery,
      hasHeader,
      bodyName,
      onlyType,
      queryValue,
      headerName,
      paramsName,
      hasformData,
      formDataName
    }
  }

  createFile() {
    const { fileContent, modelInfo } = this
    const { filePath, render, name, config } = modelInfo

    const modelName = config.moduleName || name || ''
    const content = render ? render(fileContent, modelName, config) : fileContent
    fileList.push({ filePath, content })
  }

  getTempData(filePath: string) {
    filePath = path.join(__dirname, filePath)

    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath).toString()
    } else {
      throw new Error(`读取模板文件失败，模板文件不存在 => ${filePath}`)
    }
  }

  filterParams(parameters: Property[], type: Property['in']) {
    return parameters.filter(i => i.in === type).map(({ name }) => name)
  }

  joinParams(keyList: string[]) {
    return keyList.map(i => (keyWords.has(i) ? `${i}:_${i}` : i)).join(',')
  }
}

type BaseClassConfig = { tempClassPath: string; targetPath: string; importBaseCalssName: string }

export function createBaseClassFile(config: BaseClassConfig) {
  const { tempClassPath, targetPath, importBaseCalssName } = config
  const tempClassDirList = tempClassPath.split(path.sep)
  const tempClassDir = path.join(...tempClassDirList.slice(0, tempClassDirList.length - 1))
  const importPath = findDiffPath(tempClassDir, targetPath) // .replace(/\.ts/, '')
  const baseClassName = importBaseCalssName.replace(/^\{(.+)\}$/, (_, $1) => $1)

  let content = fs.readFileSync(path.join(__dirname, '../temp/baseClass')).toString()
  content = content.replace(/\{BaseCalssName\}/g, baseClassName)
  content = content.replace(/\{BaseClassPath\}/g, importPath)
  content = content.replace(/\{ImportBaseCalssName\}/g, importBaseCalssName)
  fileList.push({ filePath: tempClassPath, content })
}

type IndexFileConfig = { outDir: string; filePathList: FilePathList[]; indexFilePath: string }

export async function createIndexFilePath(config: IndexFileConfig) {
  const { outDir, filePathList, indexFilePath } = config
  const fileNameList: string[] = []
  const importPathCode: string[] = []

  const filePathItems = filePathList.reduce((arr, item) => arr.concat(item.data), [] as FilePathList['data'])

  filePathItems.sort((a, b) => a.fileName.length - b.fileName.length)

  filePathItems.forEach(i => {
    const { fileName, filePath } = i
    const apiFilePath = findDiffPath(outDir, filePath).replace(/\.ts$/, '')
    importPathCode.push(`import {${fileName}} from '${apiFilePath}'`)
    fileNameList.push(fileName)
  })

  // 无模块，直接导出
  const noModelItems = filePathList
    .filter(i => !i.moduleName)
    .reduce((arr, i) => arr.concat(i.data), [] as FilePathList['data'])
    .sort((a, b) => a.fileName.length - b.fileName.length)
    .map(i => i.fileName)
    .join(',\n')

  // console.log(noModelItems)

  // 有模块，再分模块导出
  const hasModelItems = filePathList
    .filter(i => i.moduleName)
    .sort((a, b) => a.moduleName!.length - b.moduleName!.length)
    .map(({ moduleName, data }) => {
      data.sort((a, b) => a.fileName.length - b.fileName.length)
      return `${moduleName}: {
        ${data.map(i => i.fileName).join(',\n')}
      }`
    })
    .join(',\n')
  // let exportContent = `
  // ${hasModelItems.map(i => {})}
  // `

  const content = `
  ${importPathCode.join('\n')}

  export default {
    ${noModelItems}
    ${noModelItems ? ',' : ''}
    ${hasModelItems}
  }
  `
  fileList.push({ filePath: indexFilePath, content })
  // await createFile(indexFilePath, content)
}
