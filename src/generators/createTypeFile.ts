import path from 'path'
import { fileList } from './fileList'
import { tsObjType } from '../common/config'
import { firstToUpper } from '../utils'
import { Doc2TsConfig } from '../types/type'
import { resTypeDataKey, resTypeNameKey } from '../common/reg'
import { BaseClass, Interface, Property, StandardDataType } from '../pont-engine'

type TypeFileInfo = {
  fileName: string
  modelName?: string
  interfaces: Interface[]
  baseClasses: BaseClass[]
  typeDirPaht: string
  typeFileRender?: Doc2TsConfig['typeFileRender']
  resultTypeRender?: Doc2TsConfig['resultTypeRender']
}
type TypeList = {
  id?: string
  response: StandardDataType
  parameters: Property[]
  resTypeName: string
  paramTypeName: string
  // metReturnTypeName: string
}[]

const objMapType = `export type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value;
}
`

export default class CreateTypeFile {
  content = ''
  exportValue = ''
  typeList: TypeList = []
  importType: Set<string> = new Set([])
  fileInfo!: TypeFileInfo

  constructor(params: TypeFileInfo) {
    this.fileInfo = params
    const showEx = typeof params.resultTypeRender === 'string'
    this.exportValue = showEx ? `export type ExportValue<T, U> = U extends keyof T ? T[U] : T;\r\n` : ''
    // `\ntype ExportValue<T, U> = U extends keyof T ? T[U] : T;\n`
    // this.generateFile()
  }

  public generateFile() {
    const { typeDirPaht, fileName, typeFileRender } = this.fileInfo
    this.generateApiClassType() // 创建 接口请求方法的类型
    // this.generateTypeValue() // 创建 返回类型
    this.generateTypes() // 创建 返回数据的类型
    this.generateParamType() // 创建 参数的类型
    this.generateImportType() // 创建 返回数据类型和参数类型 需要引入的类型
    this.content = typeof typeFileRender === 'function' ? typeFileRender(this.content, fileName) : this.content
    const filePath = path.join(typeDirPaht, `${fileName}.d.ts`)
    fileList.push({ filePath, content: this.content })
  }

  private generateImportType() {
    const { content } = this
    // const hasObjectMap = importType.delete('ObjectMap')
    // const importTypeList = Array.from(importType)
    //   .sort((a, b) => a.length - b.length)
    //   .join(', ')
    // const objectMapTypeStr = hasObjectMap ? `\n${objMapType}` : ''

    this.content = `import type * as Types from './type' \r\n${content}`
  }

  private generateApiClassType() {
    const { fileInfo, typeList } = this
    const { interfaces, baseClasses } = fileInfo
    const methodList = interfaces.map(i => {
      const { response, parameters, id } = i
      const onlyParam = parameters.length === 1

      const name = firstToUpper(i.name)
      const resTypeName = `${name}Body`
      const paramTypeName = `${name}Param`

      let paramsStr = `(params: ${paramTypeName})`
      if (onlyParam) {
        const [firstParam] = parameters
        const { name, dataType } = firstParam
        const { isDefsType } = dataType
        const { properties = [] } = baseClasses.find(i => i.name === dataType.typeName) ?? {}

        if (!isDefsType || properties.length > 0) {
          paramsStr = `(${name} :${paramTypeName}['${name}'])`
        } else if (parameters.length > 0) {
          // 文档未定义参数类型
          paramsStr = `(${name}: any)`
        } else {
          // 不需要穿传参
          paramsStr = `()`
        }
      } else if (parameters.length === 0) {
        // 不需要穿传参
        paramsStr = '()'
      }

      typeList.push({ id, resTypeName, response, paramTypeName, parameters })
      const returnType = this.getReturnType(resTypeName, i, fileInfo)
      return `export type ${name} = ${paramsStr} => ${returnType}\r\n`
    })
    this.content = methodList.join('\r\n')
  }

  private getReturnType(resTypeName: string, item: Interface, fileInfo: TypeFileInfo) {
    const { response, id } = item
    const { baseClasses, resultTypeRender: render, modelName } = fileInfo

    let promType = `Promise<${resTypeName}>`

    const { typeName } = response
    const typeInfo = baseClasses.find(i => i.name === typeName)
    if (render && typeInfo) {
      const { properties } = typeInfo
      const isFile = properties.length === 1 && properties[0].dataType.typeName === 'Flie'
      if (!isFile) {
        if (typeof render === 'function') {
          const info = { modelName, funId: id }
          promType = render(resTypeName, typeInfo.properties, info)
        } else if (typeof render === 'string') {
          let tempStr = render
          const [_, dataKey, keyValue] = render.match(resTypeDataKey) || []
          if (dataKey) {
            tempStr = tempStr.replace(resTypeDataKey, `${resTypeName}['${keyValue}']`)
          }
          tempStr = tempStr.replace(/\{typeName\}/g, resTypeName)
          promType = tempStr
        }
      }
    }
    return promType
  }

  private generateTypes() {
    const { typeList, content } = this
    const resTypeList = typeList.map(i => {
      const { resTypeName, response } = i
      return `export type ${resTypeName} = ${this.generateResTypeValue(response, true)}`
    })

    this.content = `${resTypeList.join('\r\n')}\r\n${content}`
  }

  /**
   * @param typeName
   * @description 判断是不是ts的基本类型，如果如果不是的 则是改为any类型【处理不规范的类型】
   */
  getDefType(typeName: string) {
    return tsObjType.has(typeName) ? typeName : 'any'
  }

  private generateResTypeValue(responseType: StandardDataType, hasDefs = false) {
    const { baseClasses } = this.fileInfo
    const { typeArgs, typeName, isDefsType } = responseType
    let content = typeName
    if ((isDefsType || typeName === 'ObjectMap') && hasDefs) content = `Types.${content}`
    if (typeArgs.length > 0) {
      content += `<${typeArgs.map(i => this.generateResTypeValue(i, hasDefs)).join(', ')}>`
    } else if (content) {
      // 添加未知类型的泛型
      const templateArgs = baseClasses.find(i => i.name === typeName)?.templateArgs || []
      if (templateArgs.length > 0) {
        content += `<${templateArgs.map(i => this.generateResTypeValue(i, hasDefs)).join(', ')}>`
      }
    }
    return content || 'any'
  }

  private generateParamType() {
    const { typeList, content } = this
    const resTypeList = typeList.map(i => {
      const { paramTypeName, parameters } = i
      return `export interface ${paramTypeName} {\r\n${this.generateParamTypeValue(parameters, true).join('\n')}}`
    })

    this.content = `${resTypeList.join('\r\n')}\r\n${content}`
  }

  private generateParamTypeValue(parameters: Property[], hasDefs = false) {
    return parameters.map(i => {
      const { required, name, description, dataType } = i
      const valueType = this.generateResTypeValue(dataType, hasDefs)
      return `${this.getDescription(description)}${name}${required ? '' : '?'}: ${valueType}`
    })
  }

  getDescription(des?: string, example?: string) {
    if (!example && !des) return ''
    if (des) {
      return example
        ? `/** \r\n* @example ${example}\r\n* @description ${des}\r\n */\r\n`
        : `/** @description ${des} */\r\n`
    }
    return `/** @example ${example} */\r\n`
  }

  createBaseClasses() {
    const { fileInfo, exportValue } = this
    const { typeDirPaht, baseClasses } = fileInfo
    const content = baseClasses.map(i => {
      const { name, properties, templateArgs, description } = i

      const temList = templateArgs.map(i => i.typeName)
      const temStr = temList.length > 0 ? `<${temList.join(', ')}>` : ''
      const itemsValue = this.generateParamTypeValue(properties).join('\r\n')

      return `${this.getDescription(description)}export interface ${name}${temStr} {\r\n${itemsValue}}`
    })

    if (exportValue) content.unshift(exportValue)

    const filePath = path.join(typeDirPaht, `type.d.ts`)
    fileList.push({ filePath, content: objMapType + content.join('\r\n') })
  }
}
