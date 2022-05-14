import path from 'path'
import { Interface, Mod, Property } from 'pont-engine'
import { PARAMS_NAME } from './config'
import { GetParamsStr, ModelInfo } from './pont_type'
import { Method, ModuleConfigInfo } from './type'
import { firstToUpper, resolveOutPath, findDiffPath, createFile, firstToLower } from './utils'

/**
 * @description 创建请求接口文件
 */
export function createApiFile(modelInfo: ModelInfo) {
  const { name, interfaces, prettierConfig } = modelInfo
  const { baseClassName, targetPath, render, config, basePath, fileName, filePath, typeFilePaht } = modelInfo

  const className = firstToUpper(fileName)
  const modelName = config.moduleName || name

  const baseClassPath = findDiffPath(filePath, targetPath)
  const typeFilePath = findDiffPath(filePath, path.join(typeFilePaht, fileName))

  const classMethodStr = generateApiClassMethodStr(interfaces, config)
  // const basePath = '${basePath}'
  let content = `
import { ${baseClassName} } from '${baseClassPath}'
import * as mT from '${typeFilePath}'
${basePath ? `\nconst basePath = '${basePath}'` : ''}

/**
 * @description ${name}
 */
class ${className} extends ApiClient {${classMethodStr}}\n
export default new ${className}()\n`
  content = render ? render(content, modelName, config) : content
  return createFile(filePath, `${fileName}.ts`, content, prettierConfig)
}

function filterParams(parameters: Property[], type: Property['in']) {
  return parameters.filter(i => i.in === type).map(({ name }) => name)
}

/**
 * @description 整理参数
 */
export function getParamsStr(parameters: Property[]): GetParamsStr {
  // TODO 不同类型的参数重名存在 【bug】

  let codeStr = ''
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
  const queryParams = filterParams(parameters, 'query') // .map(name => `${name}=\${${name}}`) // ['aaa=${aaa}']
  const hsaQuery = queryParams.length > 0

  // body
  const bodyParams = filterParams(parameters, 'body')
  const hsaBody = bodyParams.length > 0
  if (hsaBody) body = `, ${bodyName}`

  // formData
  const formDataParams = filterParams(parameters, 'formData')
  const hasformData = formDataParams.length > 0
  if (hasformData) formData = `, ${formDataName}`

  // header
  const headerParams = filterParams(parameters, 'header') // .map(i => `'${i}': ${i}`) // [ "'aaa': aaa" ]
  const hasHeader = headerParams.length > 0
  if (hasHeader) header = `, ${headerName}`
  const parametersList = new Set(parameters.map(i => i.in)) // .size === 1
  // 判断是否存在 path 参数
  // 存在 path 参数 或者 存在两种及以上参数类型的需要 解构
  if (hasPath || parametersList.size > 1) {
    // 需要需要解构
    codeStr = `\nconst { ${parameters.map(i => i.name).join(', ')} } = params`

    // 组建各种请求类型参数
    // query
    if (hsaQuery) codeStr += `\nconst ${queryName} = this.serialize({${queryParams.join(', ')}})`

    // body
    if (hsaBody) codeStr += `\nconst ${bodyName} = {${bodyParams.join(', ')}}`

    // formData
    if (hasformData) codeStr += `\nconst ${formDataName} = this.formData({${formDataParams.join(', ')}})`

    // header
    if (hasHeader) codeStr += `\nconst ${headerName} = {${headerParams.join(', ')}}`
  } else {
    // 只有一个类型的请求参数
    // 不需要解构

    // 组建各种请求类型参数
    // query
    if (hsaQuery) codeStr = `\nconst ${queryName} = this.serialize(params)`

    // body
    // 直接把 params 传给 request方法即可

    // formData
    if (hasformData) {
      formData = `, ${formDataName}`
      codeStr = `\nconst ${formDataName} = this.formData(params)`
    }

    // header
    // 直接把 params 传给 request方法即可
  }
  return {
    body,
    header,
    formData,
    codeStr,
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

export function formatUrl(url: string, paramsInfo: GetParamsStr) {
  const { hasPath, hsaQuery, queryName } = paramsInfo
  if (hasPath || hsaQuery) {
    if (hasPath) url = url.replace(/\{(\w+)\}/g, v => `$${v}`)
    return `\`${url}${hsaQuery ? `?\${${queryName}}` : ''}\``
  }
  return `'${url}'`
}

/**
 * @description  把get请求的 body 类型的参数，改为 query 类型
 */
function fixParamsType(parameters: Property[], method: Method) {
  if (/get/i.test(method)) {
    parameters.forEach(i => {
      if (i.in === 'body') i.in = 'query'
    })
  }
}

/**
 * @description 生成请求接口class 里的请求方法
 */
export function generateApiClassMethodStr(interfaces: Interface[], config: ModuleConfigInfo) {
  const methodsList = interfaces.map(i => {
    const { name: funName, method: met, path: _path, description, response, parameters } = i
    const { isDownload, config: metConfig } = config.methodConfig?.[funName] || {}

    fixParamsType(parameters, met as Method)
    const paramsInfo = getParamsStr(parameters)
    const { codeStr, onlyType, hsaBody, bodyName, body, header, formData } = paramsInfo

    // const { typeName } = response
    const paramsName = parameters.length === 0 ? '()' : onlyType && hsaBody ? bodyName : 'params'

    const requestMethod = isDownload ? 'downloadFile' : 'request'
    const url = `url:${formatUrl(_path, paramsInfo)}`
    const otherConfig = header + formData
    const requestConfig = metConfig ? `, config: ${JSON.stringify(metConfig)}` : ''
    const hideMethod = /^get$/i.test(met) || (/^post$/i.test(met) && body)
    const method = hideMethod ? '' : `, method: '${met}'`
    return `
  /**
   * @description ${description.replace(/\n\r?/, '，')}
  */
  ${funName}: mT.${firstToUpper(funName)} = ${paramsName} => {${codeStr}
    return this.${requestMethod}({ ${url}${body}${otherConfig}${method}${requestConfig} })
  }\n`
  })

  return methodsList.join('\n')
}
