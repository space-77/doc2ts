import path from 'path'
import { Mod, Property } from 'pont-engine'
import { PARAMS_NAME } from './config'
import { GetParamsStr, ModelInfo } from './pont_type'
import { ModuleConfigInfo } from './type'
import { firstToUpper, getDirPaht, findDiffPath, createFile, firstToLower } from './utils'

/**
 * @description 创建请求接口文件
 */
export function createApiFile(modelInfo: ModelInfo) {
  const { name, classMethodStr } = modelInfo
  const { baseClassName, baseClassPath, render, config, outDir, basePath } = modelInfo

  // const config = moduleConfig?.[name] ?? {}
  const modelName = config.moduleName || name

  const className = firstToUpper(modelName)
  const savePath = getDirPaht(outDir, 'module')
  const targetPath = path.join(process.cwd(), baseClassPath)
  const _baseClassPath = findDiffPath(savePath, targetPath)

  // const basePath = '${basePath}'
  let content = `
import { ${baseClassName} } from '${_baseClassPath}'
import * as mT from './type/${modelName}'
${basePath ? `\nconst basePath = '${basePath}'` : ''}

/**
 * @description ${name}
 */
class ${className} extends ApiClient {${classMethodStr}}\n
export default new ${className}()\n`
  content = render ? render(content, modelName, config) : content
  return createFile(savePath, firstToLower(`${className}.ts`), content)
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

  // formData
  const formDataParams = filterParams(parameters, 'formData')
  const hasformData = formDataParams.length > 0

  // header
  const headerParams = filterParams(parameters, 'header') // .map(i => `'${i}': ${i}`) // [ "'aaa': aaa" ]
  const hasHeader = headerParams.length > 0

  const onlyType = new Set(parameters.map(i => i.in)).size === 1
  // 判断是否存在 path 参数
  // 存在 path 参数 或者 存在两种及以上参数类型的需要 解构
  if (hasPath || onlyType) {
    // 需要需要解构
    codeStr = `\nconst { ${parameters.map(i => i.name).join(', ')} } = params`

    // 组建各种请求类型参数
    // query
    if (hsaQuery) codeStr += `const ${queryName} = this.serialize({${queryParams.join(', ')}})\n`

    // body
    if (hsaBody) {
      body = `, ${bodyName}`
      codeStr += `const ${bodyName} = {${bodyParams.join(', ')}}\n`
    }

    // formData
    if (hasformData) {
      formData = `, ${formDataName}`
      codeStr += `const ${formDataName} = this.formData({${formDataParams.join(', ')}})\n`
    }

    // header
    if (hasHeader) {
      header = `, ${headerName}`
      codeStr += `const ${headerName} = {${headerParams.join(', ')}}\n`
    }
  } else {
    // 只有一个类型的请求参数
    // 不需要解构

    // 组建各种请求类型参数
    // query
    if (hsaQuery) codeStr = `\nconst ${queryName} = this.serialize(params)\n`

    // body
    // 直接把 params 传给 request方法即可

    // formData
    if (hasformData) {
      formData = `, ${formDataName}`
      codeStr = `\nconst ${formDataName} = this.formData(params)\n`
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
    onlyType,
    hsaQuery,
    hasHeader,
    bodyName,
    queryName,
    headerName,
    hasformData,
    formDataName
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
 * @description 生成请求接口class 里的请求方法
 */
export function generateApiClassMethodStr(mods: Mod[], config: ModuleConfigInfo) {
  const methods = mods.reduce((arr, item) => arr.concat(item.interfaces), [] as Mod['interfaces'])

  const methodsList = methods.map(i => {
    const { name: funName, method, path: _path, description, response, parameters } = i
    const { isDownload, config: metConfig } = config.methodConfig?.[funName] || {}

    const paramsInfo = getParamsStr(parameters)
    const { codeStr, onlyType, hsaBody, bodyName, body, header, formData } = paramsInfo

    // const { typeName } = response
    const paramsName = parameters.length === 0 ? '()' : onlyType && hsaBody ? bodyName : 'params'

    const requestMethod = isDownload ? 'downloadFile' : 'request'
    const url = `url:${formatUrl(_path, paramsInfo)}`
    const otherConfig = body + header + formData
    const requestConfig = metConfig ? `, config: ${JSON.stringify(metConfig)}` : ''

    return `
  /**
   * @description ${description}
  */
  ${funName}: mT.${firstToUpper(funName)} = ${paramsName} => {${codeStr}
    return this.${requestMethod}({ ${url}${body}, method: '${method}'${otherConfig}${requestConfig} })
  }\n`
  })

  return methodsList.join('\n')
}
