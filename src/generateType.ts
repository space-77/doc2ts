import path from 'path'
import { Doc2TsConfig } from './type'
import { createFile, firstToUpper } from './utils'
import { BaseClass, Interface, Property, StandardDataType } from 'pont-engine'

type CreateTypeFileParams = {
  fileName: string
  interfaces: Interface[]
  typeFilePaht: string
  resultGenerics: string
  typeFileRender?: Doc2TsConfig['typeFileRender']
}
type TypeList = { resTpeName: string; response: StandardDataType; paramTypeName: string; parameters: Property[] }[]

const objMapType = `export type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value;
}
`

export default class CreateTypeFile {
  content = ''
  fileName: string
  interfaces: Interface[]
  typeFilePaht: string
  resultGenerics: string
  typeList: TypeList = []
  importType: Set<string> = new Set([])

  constructor(params: CreateTypeFileParams) {
    const { interfaces, fileName, typeFilePaht, resultGenerics, typeFileRender } = params
    this.fileName = fileName
    this.interfaces = interfaces
    this.typeFilePaht = typeFilePaht
    this.resultGenerics = resultGenerics
    this.generateFile(typeFileRender)
  }

  private generateFile(typeFileRender?: Doc2TsConfig['typeFileRender']) {
    const { typeFilePaht, fileName } = this
    this.generateApiClassType() // 创建 接口请求方法的类型
    this.generateTypes() // 创建 返回数据的类型
    this.generateParamType() // 创建 参数的类型
    this.generateImportType() // 创建 返回数据类型和参数类型 需要引入的类型
    this.content = typeof typeFileRender === 'function' ? typeFileRender(this.content, fileName) : this.content
    createFile(path.join(typeFilePaht, `${fileName}.d.ts`), this.content)
  }

  private generateApiClassType() {
    const { resultGenerics, interfaces, typeList } = this
    const methodList = interfaces.map(i => {
      const { response, parameters } = i
      const name = firstToUpper(i.name)
      const resTpeName = `${name}Res`
      const paramTypeName = `${name}Param`
      typeList.push({ resTpeName, response, paramTypeName, parameters })
      return `export type ${name} = <T = ${resTpeName}>(params: ${paramTypeName}) => Promise<${resultGenerics}>\n`
    })
    this.content = methodList.join('\n')
  }

  private generateTypes() {
    const { typeList, content } = this
    const resTypeList = typeList.map(i => {
      const { resTpeName, response } = i
      return `export type ${resTpeName} = ${this.generateResTypeValue(response)}`
    })

    this.content = `${resTypeList.join('\n')}\n${content}`
  }

  private generateResTypeValue(responseType: StandardDataType) {
    const { typeArgs, typeName, templateIndex, isDefsType } = responseType

    // if (typeName === 'ObjectMap') {
    //   console.log(isDefsType)
    // }

    if (isDefsType || typeName === 'ObjectMap') this.importType.add(typeName)
    let content = typeName
    if (typeArgs.length > 0) {
      const [firstType] = typeArgs
      content += `<${this.generateResTypeValue(firstType)}>`
    }
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
    const importTypeList = Array.from(importType).sort((a, b) => a.length - b.length)
    this.content = `import { ${importTypeList.join(', ')} } from './type' \n${content}`
  }

  getDescription(des?: string) {
    return des ? `/** @description ${des}*/\n` : ''
  }

  createBaseClasses(baseClasses: BaseClass[]) {
    const { typeFilePaht } = this
    const content = baseClasses.map(i => {
      const { name, properties, templateArgs, description } = i

      if (properties.length === 0) return ''

      const temList = templateArgs.map(i => i.typeName)
      const temStr = temList.length > 0 ? `<${temList.join(', ')}>` : ''
      const itemsValue = this.generateParamTypeValue(properties).join('\n')

      return `${this.getDescription(description)}export type ${name}${temStr} = {\n${itemsValue}}`
    })

    createFile(path.join(typeFilePaht, `type.d.ts`), `${objMapType}${content.join('\n')}`)
  }
}
