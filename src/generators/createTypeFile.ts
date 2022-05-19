import path from 'path'
import { Doc2TsConfig } from '../type'
import { createFile, firstToUpper } from '../utils'
import { BaseClass, Interface, Property, StandardDataType } from 'pont-engine'

type TypeFileInfo = {
  fileName: string
  interfaces: Interface[]
  baseClasses: BaseClass[]
  typeDirPaht: string
  typeFileRender?: Doc2TsConfig['typeFileRender']
  resultTypeRender?: Doc2TsConfig['resultTypeRender']
}
type TypeList = {
  response: StandardDataType
  parameters: Property[]
  resTypeName: string
  paramTypeName: string
  metReturnTypeName: string
}[]

const objMapType = `type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value;
}
`
export default class CreateTypeFile {
  content = ''
  typeList: TypeList = []
  importType: Set<string> = new Set([])
  fileInfo!: TypeFileInfo

  constructor(params: TypeFileInfo) {
    this.fileInfo = params
    // this.generateFile()
  }

  public async generateFile() {
    const { typeDirPaht, fileName, typeFileRender } = this.fileInfo
    this.generateApiClassType() // 创建 接口请求方法的类型
    this.generateTypeValue() // 创建 返回类型
    this.generateTypes() // 创建 返回数据的类型
    this.generateParamType() // 创建 参数的类型
    this.generateImportType() // 创建 返回数据类型和参数类型 需要引入的类型
    this.content = typeof typeFileRender === 'function' ? typeFileRender(this.content, fileName) : this.content
    await createFile(path.join(typeDirPaht, `${fileName}.d.ts`), this.content)
  }

  private generateApiClassType() {
    const { fileInfo, typeList } = this
    const { interfaces } = fileInfo
    const methodList = interfaces.map(i => {
      const { response, parameters } = i
      const name = firstToUpper(i.name)
      const resTypeName = `${name}Body`
      const metReturnTypeName = `${name}Response`
      const paramTypeName = `${name}Param`
      typeList.push({ resTypeName, response, paramTypeName, parameters, metReturnTypeName })
      return `export type ${name} = (params: ${paramTypeName}) => ${metReturnTypeName}\n`
    })
    this.content = methodList.join('\n')
  }

  private generateTypeValue() {
    const { typeList, fileInfo } = this
    const { baseClasses, resultTypeRender: render } = fileInfo
    const typeValueList = typeList.map(i => {
      const { resTypeName, response, metReturnTypeName } = i
      let promType = `Promise<${resTypeName}>`
      if (typeof render === 'function') {
        const { typeName } = response
        const typeInfo = baseClasses.find(i => i.name === typeName)
        if (typeInfo) promType = render(resTypeName, typeInfo.properties)
      }
      return `type ${metReturnTypeName} = ${promType}`
    })
    this.content = `${typeValueList.join('\n')}\n${this.content}`
  }

  private generateTypes() {
    const { typeList, content } = this
    const resTypeList = typeList.map(i => {
      const { resTypeName, response } = i
      return `export type ${resTypeName} = ${this.generateResTypeValue(response)}`
    })

    this.content = `${resTypeList.join('\n')}\n${content}`
  }

  private generateResTypeValue(responseType: StandardDataType) {
    const { typeArgs, typeName, templateIndex, isDefsType } = responseType

    if (isDefsType || typeName === 'ObjectMap') this.importType.add(typeName)
    let content = typeName
    if (typeArgs.length > 0) {
      const [firstType] = typeArgs
      content += `<${this.generateResTypeValue(firstType)}>`
    }
    //  if (!/\>$/.test(content) && isDefsType) {
    //   console.log(content)
    // }
    return content || 'any'
  }

  private generateParamType() {
    const { typeList, content } = this
    const resTypeList = typeList.map(i => {
      const { paramTypeName, parameters } = i
      return `export type ${paramTypeName} = {\n${this.generateParamTypeValue(parameters).join('\n')}}`
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
    const hasObjectMap = importType.delete('ObjectMap')
    const importTypeList = Array.from(importType).sort((a, b) => a.length - b.length)
    const objectMapTypeStr = hasObjectMap ? `\n${objMapType}` : ''

    this.content = `import { ${importTypeList.join(', ')} } from './type' ${objectMapTypeStr} \n${content}`
  }

  getDescription(des?: string) {
    return des ? `/** @description ${des}*/\n` : ''
  }

  async createBaseClasses() {
    const { typeDirPaht, baseClasses } = this.fileInfo
    const content = baseClasses.map(i => {
      const { name, properties, templateArgs, description } = i

      if (properties.length === 0) return ''

      const temList = templateArgs.map(i => `${i.typeName} = any`)
      const temStr = temList.length > 0 ? `<${temList.join(', ')}>` : ''
      const itemsValue = this.generateParamTypeValue(properties).join('\n')

      return `${this.getDescription(description)}export type ${name}${temStr} = {\n${itemsValue}}`
    })

    await createFile(path.join(typeDirPaht, `type.d.ts`), content.join('\n'))
  }
}
