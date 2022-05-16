import fs from 'fs'
import path from 'path'
import { Method } from './type'
import { Property } from 'pont-engine'
import { PARAMS_NAME } from './config'
import { GetParamsStr, ModelInfo } from './pont_type'
import { firstToUpper, findDiffPath, createFile, firstToLower } from './utils'

export class CreateApiFile {
  modelInfo!: ModelInfo
  fileContent = '' // 文件内容
  constructor(params: ModelInfo) {
    this.modelInfo = params

    this.formatFileData()
    this.createFile()
  }
  formatFileData() {
    const { fileName, filePath, description, typeFilePaht } = this.modelInfo

    const className = firstToUpper(fileName)
    const typeFilePath = findDiffPath(filePath, path.join(typeFilePaht, fileName))

    const classMethodStr = this.generateApiClassMethod()
    let content = this.getTempData('./temp/apiFile')
    content = content.replace(/\{className\}/g, className)
    content = content.replace(/\{description\}/g, description)
    content = content.replace(/\{typeFilePath\}/g, typeFilePath)
    content = content.replace(/\{classMethodStr\}/g, classMethodStr)

    this.fileContent = content
  }

  generateApiClassMethod() {
    const { config, hideMethod, interfaces } = this.modelInfo
    const methodsList = interfaces.map(i => {
      const { name: funName, method: met, path: _path, description, response, parameters } = i
      const { isDownload, config: metConfig, description: configDes } = config.methodConfig?.[funName] || {}

      this.fixParamsType(parameters, met as Method)
      const paramsInfo = this.getParamsStr(parameters)
      const { methodBody, onlyType, hsaBody, bodyName, body, header, formData } = paramsInfo

      const paramsName = parameters.length === 0 ? '()' : onlyType && hsaBody ? bodyName : 'params'

      const requestMethod = isDownload ? 'downloadFile' : 'request'
      const url = `url:${this.formatUrl(_path, paramsInfo)}`
      const otherConfig = header + formData
      const requestConfig = metConfig ? `, config: ${JSON.stringify(metConfig)}` : ''
      const hideMet = hideMethod ? /^get$/i.test(met) || (/^post$/i.test(met) && body) : false
      const method = hideMet ? '' : `, method: '${met}'`
      const des = configDes ? configDes : description.replace(/\n\r?/, '，') || ''
      const funConfig = `${url}${body}${otherConfig}${method}${requestConfig}`

      let content = this.getTempData('./temp/apiFileMethod')
      content = content.replace(/\{funName\}/g, firstToLower(funName))
      content = content.replace(/\{funConfig\}/g, funConfig)
      content = content.replace(/\{methodBody\}/g, methodBody)
      content = content.replace(/\{paramsName\}/g, paramsName)
      content = content.replace(/\{funTypeName\}/g, firstToUpper(funName))
      content = content.replace(/\{description\}/g, des)
      return content.replace(/\{requestMethod\}/g, requestMethod)
    })

    return methodsList.join('\n')
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
    const { hasPath, hsaQuery, queryName } = paramsInfo
    if (hasPath || hsaQuery) {
      if (hasPath) url = url.replace(/\{(\w+)\}/g, v => `$${v}`)
      return `\`${url}${hsaQuery ? `?\${${queryName}}` : ''}\``
    }
    return `'${url}'`
  }

  getParamsStr(parameters: Property[]): GetParamsStr {
    // TODO 不同类型的参数重名存在 【bug】

    let methodBody = ''
    const bodyName = PARAMS_NAME.BODY
    const queryName = PARAMS_NAME.QUERY
    const headerName = PARAMS_NAME.HEADER
    const formDataName = PARAMS_NAME.FORMDATA

    let body = ''
    let header = ''
    let formData = ''

    // 是否需要解构请求参数
    const pathParams = parameters.filter(i => i.in === 'path')
    const hasPath = pathParams.length > 0

    // query
    const queryParams = this.filterParams(parameters, 'query') // .map(name => `${name}=\${${name}}`) // ['aaa=${aaa}']
    const hsaQuery = queryParams.length > 0

    // body
    const bodyParams = this.filterParams(parameters, 'body')
    const hsaBody = bodyParams.length > 0
    if (hsaBody) body = `, ${bodyName}`

    // formData
    const formDataParams = this.filterParams(parameters, 'formData')
    const hasformData = formDataParams.length > 0
    if (hasformData) formData = `, ${formDataName}`

    // header
    const headerParams = this.filterParams(parameters, 'header') // .map(i => `'${i}': ${i}`) // [ "'aaa': aaa" ]
    const hasHeader = headerParams.length > 0
    if (hasHeader) header = `, ${headerName}`
    const parametersList = new Set(parameters.map(i => i.in)) // .size === 1
    // 判断是否存在 path 参数
    // 存在 path 参数 或者 存在两种及以上参数类型的需要 解构
    if (hasPath || parametersList.size > 1) {
      // 需要需要解构
      methodBody = `\nconst { ${parameters.map(i => i.name).join(', ')} } = params`

      // 组建各种请求类型参数
      // query
      if (hsaQuery) methodBody += `\nconst ${queryName} = this.serialize({${queryParams.join(', ')}})`

      // body
      if (hsaBody) methodBody += `\nconst ${bodyName} = {${bodyParams.join(', ')}}`

      // formData
      if (hasformData) methodBody += `\nconst ${formDataName} = this.formData({${formDataParams.join(', ')}})`

      // header
      if (hasHeader) methodBody += `\nconst ${headerName} = {${headerParams.join(', ')}}`
    } else {
      // 只有一个类型的请求参数
      // 不需要解构

      // 组建各种请求类型参数
      // query
      if (hsaQuery) methodBody = `\nconst ${queryName} = this.serialize(params)`

      // body
      // 直接把 params 传给 request方法即可

      // formData
      if (hasformData) {
        formData = `, ${formDataName}`
        methodBody = `\nconst ${formDataName} = this.formData(params)`
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
      hsaBody,
      hsaQuery,
      hasHeader,
      bodyName,
      queryName,
      headerName,
      hasformData,
      formDataName,
      onlyType: parametersList.size === 1
    }
  }

  createFile() {
    const { fileContent, modelInfo } = this
    const { filePath, fileName, render, name, config } = modelInfo

    const modelName = config.moduleName || name
    const content = render ? render(fileContent, modelName, config) : fileContent
    createFile(path.join(filePath, `${fileName}.ts`), content)
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
}

/**
 *
 * @param tempClassPath
 * @param targetPath
 * @param importBaseCalssName '{xxx}' or 'xxx'
 */
export function createBaseClassFile(tempClassPath: string, targetPath: string, importBaseCalssName: string) {
  const tempClassDirList = tempClassPath.split(path.sep)
  const tempClassDir = path.join(...tempClassDirList.slice(0, tempClassDirList.length - 1))
  const importPath = findDiffPath(tempClassDir, targetPath)
  const baseClassName = importBaseCalssName.replace(/^\{(.+)\}$/, (_, $1) => $1)

  let content = fs.readFileSync(path.join(__dirname, './temp/baseClass')).toString()
  content = content.replace(/\{BaseCalssName\}/g, baseClassName)
  content = content.replace(/\{BaseClassPath\}/g, importPath)
  content = content.replace(/\{ImportBaseCalssName\}/g, importBaseCalssName)
  createFile(tempClassPath, content)
}
