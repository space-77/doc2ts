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

const objMapType = `type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value;
}
`
const ExportValue = `\ntype ExportValue<T, U> = U extends keyof T ? T[U] : T;\n`

export default class CreateTypeFile {
  content = ''
  typeList: TypeList = []
  importType: Set<string> = new Set([])
  fileInfo!: TypeFileInfo

  constructor(params: TypeFileInfo) {
    this.fileInfo = params
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

  private generateApiClassType() {
    const { fileInfo, typeList } = this
    const { interfaces } = fileInfo
    const methodList = interfaces.map(i => {
      const { response, parameters, id } = i
      const onlyParam = parameters.length === 1

      const name = firstToUpper(i.name)
      const resTypeName = `${name}Body`
      const paramTypeName = `${name}Param`

      let paramsStr = `(params: ${paramTypeName})`
      if (onlyParam) {
        const { name } = parameters[0]
        paramsStr = `(${name} :${paramTypeName}['${name}'])`
      }

      typeList.push({ id, resTypeName, response, paramTypeName, parameters })
      const returnType = this.getReturnType(resTypeName, i, fileInfo)
      return `export type ${name} = ${paramsStr} => ${returnType}\n`
    })
    this.content = methodList.join('\n')
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
            tempStr = tempStr.replace(resTypeDataKey, `ExportValue<${resTypeName}, "${keyValue}">`)
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
      return `export type ${resTypeName} = ${this.generateResTypeValue(response)}`
    })

    this.content = `${resTypeList.join('\n')}\n${content}`
  }

  /**
   *
   * @param typeName
   * @description 判断是不是ts的基本类型，如果如果不是的 则是改为any类型【处理不规范的类型】
   */
  getDefType(typeName: string) {
    return tsObjType.has(typeName) ? typeName : 'any'
  }

  private generateResTypeValue(responseType: StandardDataType) {
    const { baseClasses } = this.fileInfo
    const { typeArgs, typeName, isDefsType } = responseType
    if (isDefsType || typeName === 'ObjectMap') this.importType.add(typeName)
    let content = typeName
    if (typeArgs.length > 0) {
      content += `<${typeArgs.map(i => this.generateResTypeValue(i)).join(', ')}>`
    } else if (content) {
      // 添加未知类型的泛型
      const templateArgs = baseClasses.find(i => i.name === typeName)?.templateArgs || []
      if (templateArgs.length > 0) {
        content += `<${templateArgs.map(i => this.generateResTypeValue(i)).join(', ')}>`
      }
    }
    return content || 'any'
  }

  private generateParamType() {
    const { typeList, content } = this
    const resTypeList = typeList.map(i => {
      const { paramTypeName, parameters } = i
      return `export interface ${paramTypeName} {\n${this.generateParamTypeValue(parameters).join('\n')}}`
    })

    this.content = `${resTypeList.join('\n')}\n${content}`
  }

  private generateParamTypeValue(parameters: Property[]) {
    return parameters.map(i => {
      const { required, name, description, dataType } = i
      const valueType = this.generateResTypeValue(dataType)
      return `${this.getDescription(description)}${name}${required ? '' : '?'}: ${valueType}`
    })
  }

  private generateImportType() {
    const { importType, content } = this
    // const hasObjectMap = importType.delete('ObjectMap')
    const importTypeList = Array.from(importType)
      .sort((a, b) => a.length - b.length)
      .join(', ')
    // const objectMapTypeStr = hasObjectMap ? `\n${objMapType}` : ''

    this.content = `import type { ${importTypeList} } from './type' ${ExportValue} \n${content}`
  }

  getDescription(des?: string, example?: string) {
    if (!example && !des) return ''
    if (des) {
      return example ? `/** \n* @example ${example}\n* @description ${des}\n */\n` : `/** @description ${des} */\n`
    }
    return `/** @example ${example} */\n`
  }

  createBaseClasses() {
    const { typeDirPaht, baseClasses } = this.fileInfo
    const content = baseClasses.map(i => {
      const { name, properties, templateArgs, description } = i

      const temList = templateArgs.map(i => i.typeName)
      const temStr = temList.length > 0 ? `<${temList.join(', ')}>` : ''
      const itemsValue = this.generateParamTypeValue(properties).join('\n')

      return `${this.getDescription(description)}export interface ${name}${temStr} {\n${itemsValue}}`
    })

    const filePath = path.join(typeDirPaht, `type.d.ts`)
    fileList.push({ filePath, content: objMapType + content.join('\n') })
  }
}
