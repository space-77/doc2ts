import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import { Config } from '../common/config'
import { DocListItem } from '../types/newType'
import { createParams, getOutputDir } from './common'
import { createFile, findDiffPath, firstToLower, firstToUpper, getDesc, resolveOutPath } from '../utils'
import RequestBodies from '../doc/docApi/components/requestBodies'
import { FuncGroupList } from '../doc/docApi'

const FormDataKey = new Set(['multipart/form-data', 'application/x-www-form-urlencoded'])

/***
 * @desc 创建内部 api calss 继承的基类
 */
function createApiBaseClass(config: Config) {
  const { outDir, baseClassName: importBaseCalssName, baseClassPath } = config

  let content = fs.readFileSync(path.join(__dirname, '../temp/baseClass')).toString()
  const baseFilePath = path.join(process.cwd(), outDir, 'base.ts')

  const baseClassName = importBaseCalssName.replace(/^\{(.+)\}$/, (_, $1) => $1)
  const tempClassDirList = baseFilePath.split(path.sep)
  const tempClassDir = path.join(...tempClassDirList.slice(0, tempClassDirList.length - 1))
  const importPath = findDiffPath(tempClassDir, resolveOutPath(baseClassPath))

  content = content.replace(/\{BaseClassPath\}/g, importPath)
  content = content.replace(/\{BaseCalssName\}/g, baseClassName)
  content = content.replace(/\{ImportBaseCalssName\}/g, importBaseCalssName)
  createFile(baseFilePath, content)
}

function createClass(moduleInfo: FuncGroupList, className: string) {
  const { description, funcInfoList } = moduleInfo
  const desc = getDesc(description)
  let content = `${desc}class ${className} extends Base {`
  for (const funcItem of funcInfoList) {
    const { item, name, method, apiPath, bodyName, paramsName, responseName } = funcItem
    const { responseType, parameterType, requestBodyType } = funcItem
    const { deprecated, description } = item

    const paramsInfo = createParams(parameterType, requestBodyType)
    const { paramName, paramsContents, deconstruct, typeItems, paramType } = paramsInfo

    const hasQuery = typeItems.some(i => i.paramType === 'query')
    const query = hasQuery ? '${this.serialize(query)}' : ''

    const hasPath = typeItems.some(i => i.paramType === 'path')
    const urlSemicolon = hasPath || hasQuery ? '`' : "'"

    const hasHeader = typeItems.some(i => i.paramType === 'header')
    let headersStr = hasHeader ? ',headers' : ''

    // let contentType = ''
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

    const desc = getDesc(description, deprecated)
    const returnType = responseType && !responseType.isEmpty ? `<types.${responseType.typeName}>` : ''

    content += `\n ${desc} ${name}(${paramName}${paramType ? `:${paramType}` : ''}){
      ${deconstruct}
      ${paramsContents.map(({ type, content }) => `const ${type} = ${content}`).join('\r\n')}
      const url = ${urlSemicolon}${apiPath.replace(/\{/g, '${')}${query}${urlSemicolon}
      const config = { url ${bodyStr} ${headersStr}, method: '${method}' }
      return this.request${returnType}(config)
    }\n`
  }
  content += '}'
  return content
}

export function buildApiFile(doc: DocListItem, config: Config) {
  const { docApi, moduleName = '' } = doc
  const outputDir = getOutputDir(moduleName, config)
  const { funcGroupList } = docApi

  for (const moduleInfo of funcGroupList) {
    const { moduleName: fileName } = moduleInfo
    const className = firstToUpper(fileName)
    let content = createClass(moduleInfo, className)
    content = `import Base from '../base'\n${content}`
    content = `import type * as types from './types'\n${content}`
    content = `${content}\nexport default new ${className}()`

    const filePaht = path.join(outputDir, `${fileName}.ts`)
    createFile(filePaht, content)
  }

  createApiBaseClass(config)
}
