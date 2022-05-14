import { createFile, firstToUpper } from './utils'
import { BaseClass, Interface, Property, StandardDataType } from 'pont-engine'
import { Options } from 'prettier'

type CreateTypeFileParams = {
  interfaces: Interface[]
  fileName: string
  typeFilePaht: string
  resultGenerics: string
  prettierConfig?: Options
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
  prettierConfig?: Options
  importType: Set<string> = new Set([])
  templateTypeKey = ['T', 'V', 'K', 'E', 'A', 'B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'L', 'N', 'M']

  constructor(params: CreateTypeFileParams) {
    const { interfaces, fileName, typeFilePaht, resultGenerics, prettierConfig } = params
    this.fileName = fileName
    this.interfaces = interfaces
    this.typeFilePaht = typeFilePaht
    this.resultGenerics = resultGenerics
    this.prettierConfig = prettierConfig
    this.generateFile()
  }

  private generateFile() {
    const { typeFilePaht, fileName, prettierConfig } = this
    this.generateApiClassType() // 创建 接口请求方法的类型
    this.generateTypes() // 创建 返回数据的类型
    this.generateParamType() // 创建 参数的类型
    this.generateImportType() // 创建 返回数据类型和参数类型 需要引入的类型
    createFile(typeFilePaht, `${fileName}.d.ts`, this.content, prettierConfig)
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

    if (isDefsType) this.importType.add(typeName)
    let content = typeName
    if (typeArgs.length > 0) {
      const [firstType] = typeArgs
      // const { typeName, templateIndex } = firstType
      // const tKey = this.templateTypeKey[templateIndex]
      // const temKey = `${this.generateResTypeValue(firstType, templateArgs)}${tKey ? `<${tKey}>` : ''}`
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
      // const temVal = templateArgs.has(name) ? `<${templateArgs.get(name)}>` : valueType

      return `${this.getDescription(description)}${name}${required ? '' : '?'}: ${valueType}`
    })
  }

  private generateImportType() {
    const { importType, content } = this
    this.content = `import { ${Array.from(importType).join(', ')} } from './type' \n${content}`
  }

  getDescription(des?: string) {
    return des ? `/** @description ${des}*/\n` : ''
  }

  getTemplate(templateArgs: StandardDataType[] = []) {
    const temMap = new Map<string, string>()
    if (templateArgs.length === 0) return temMap
    templateArgs.forEach((i, index) => {
      temMap.set(i.typeName, this.templateTypeKey[index])
    })
    return temMap
  }

  createBaseClasses(baseClasses: BaseClass[]) {
    const { typeFilePaht, prettierConfig } = this
    const content = baseClasses.map(i => {
      const { name, properties, templateArgs, description } = i

      if (properties.length === 0) return ''

      const temList = templateArgs.map(i => i.typeName)
      // const s = temList.values().
      const temStr = temList.length > 0 ? `<${temList.join(', ')}>` : ''
      const itemsValue = this.generateParamTypeValue(properties).join('\n')

      return `${this.getDescription(description)}export type ${name}${temStr} = {\n${itemsValue}}`
    })

    createFile(typeFilePaht, `type.d.ts`, `${objMapType}${content.join('\n')}`, prettierConfig)
  }
}

// export function createBaseClasses(baseClasses: BaseClass[], typeFilePaht: string) {

// }
