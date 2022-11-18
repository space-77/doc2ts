import path from 'path'
import { fileList } from './fileList'
import { tempNameList, tsObjType } from '../common/config'
import { firstToUpper, getFuncType } from '../utils'
import { Doc2TsConfig, RenderVlaue } from '../types/type'
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
  generateTypeRender?: Doc2TsConfig['generateTypeRender']
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
  typeList: TypeList = []
  fileInfo!: TypeFileInfo
  // tempMap: { tempName: string; value: string }[] = []
  importType: Set<string> = new Set([])
  typeItemList: { paramTypeName: string; typeItems: RenderVlaue[] }[] = []

  constructor(params: TypeFileInfo) {
    this.fileInfo = params
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
    const { content, importType } = this
    const importTypeStr = Array.from(importType)
      .sort((a, b) => a.length - b.length)
      .join(', ')

    this.content = `import type {${importTypeStr}} from './type' \r\n${content}`
  }

  private generateApiClassType() {
    const { fileInfo, typeList } = this
    const { interfaces, baseClasses } = fileInfo
    const methodList = interfaces.map(i => {
      const { response, parameters, id } = i
      const onlyParam = parameters.length === 1

      const funName = firstToUpper(i.name)
      const resTypeName = `${funName}Body`
      const paramTypeName = `${funName}Param`

      let paramsStr = `(params: ${paramTypeName})`
      if (onlyParam) {
        const [firstParam] = parameters
        const { dataType } = firstParam
        const { isDefsType } = dataType
        const classItem = baseClasses.find(i => i.name === dataType.typeName)
        const { properties = [] } = classItem ?? {}

        if (!isDefsType || properties.length > 0) {
          const { typeArgs, typeName, isDefsType } = firstParam.dataType
          paramsStr = `(params :${this.generateResTypeValue(typeArgs, typeName, isDefsType)})`
        } else if (parameters.length > 0) {
          // 文档未定义参数类型
          paramsStr = `(params: any)`
        } else {
          // 不需要传参
          paramsStr = `()`
        }
      } else if (parameters.length === 0) {
        // 不需要传参
        paramsStr = '()'
      }

      const resTypes: TypeList[0] = { id, resTypeName, response, paramTypeName, parameters }
      typeList.push(resTypes)
      const returnType = this.getReturnType(resTypeName, i, fileInfo, resTypes)
      return `export type ${getFuncType(funName)} = ${paramsStr} => ${returnType}\r\n`
    })
    this.content = methodList.join('\r\n')
  }

  private getReturnType(resTypeName: string, item: Interface, fileInfo: TypeFileInfo, resTypes: TypeList[0]) {
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
          // if (resTypeName === 'GetAuthUserListBody') {
          //   const { typeArgs } = resTypes.response

          //   // console.log(JSON.stringify(typeArgs))

          //   // const propertie = typeArgs.find(i => i.typeName === 'data')
          //   const { typeArgs: args = [], typeName, isDefsType } = typeArgs[0]
          //   // const { typeArgs, typeName, isDefsType } = resTypes.response
          //   const res = this.generateResTypeValue(args, typeName as string, isDefsType as boolean)
          //   console.log(res)

          //   // const { templateIndex = 0 } = dataType ?? {}

          //   // // typeList.find(i => i.)

          //   // const { typeArgs: types, typeName } = typeArgs[templateIndex]

          //   // console.log(JSON.stringify(resTypes.response))
          //   // // console.log(JSON.stringify(typeInfo))
          //   // console.log(`${typeName}${this.getGenericsValue(types)}`)
          //   process.exit(0)
          // }

          let tempStr = render
          const [_, dataKey, keyValue] = render.match(resTypeDataKey) || []
          const hasDataItem = typeInfo.properties.find(i => i.name === keyValue)
          if (dataKey && hasDataItem) {
            const { typeArgs } = resTypes.response

            const { dataType, required = false } = hasDataItem ?? {}

            const index = dataType?.templateIndex || 0

            const { typeArgs: types = [], typeName, isDefsType } = typeArgs[index] ?? {}

            const res = this.generateResTypeValue(types, typeName, isDefsType)

            const newType = types && typeName ? `${res}${!required ? '| undefined' : ''}` : 'any'

            tempStr = tempStr.replace(resTypeDataKey, newType)
            tempStr = tempStr.replace(/\{typeName\}/g, resTypeName)
            promType = tempStr
          }
        }
      }
    }
    return promType
  }

  private generateTypes() {
    const { typeList, content } = this
    const resTypeList = typeList.map((i, index) => {
      // console.log(i)
      const { resTypeName, response } = i
      const { typeArgs, typeName, isDefsType } = response
      return `export type ${resTypeName} = ${this.generateResTypeValue(typeArgs, typeName, isDefsType)}`
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

  /**
   * @description 获取泛型的值
   */
  getGenericsValue(types: StandardDataType[]): string {
    if (types.length > 0) {
      return `<${types
        .map(({ typeArgs, typeName }) =>
          typeArgs.length > 0 ? `${typeName}${this.getGenericsValue(typeArgs)}` : typeName
        )
        .join(', ')}>`
    }
    return ''
  }

  private generateResTypeValue(typeArgs: StandardDataType[], typeName: string, isDefsType: boolean) {
    const { baseClasses } = this.fileInfo
    // const { typeArgs, typeName, isDefsType } = responseType
    let content = typeName
    if (isDefsType || typeName === 'ObjectMap') this.importType.add(content)
    // if (!isUse) {
    //   const tempItem = this.tempMap.find(i => i.tempName === typeName)
    //   content = tempItem?.value ?? content
    // }

    if (typeArgs.length > 0) {
      content += `<${typeArgs
        .map(i => {
          // if (isDefsType || typeName === 'ObjectMap') this.importType.add(content)
          return this.generateResTypeValue(i.typeArgs, i.typeName, i.isDefsType)
        })
        .join(', ')}>`
    } else if (content) {
      // 添加未知类型的泛型
      const templateArgs = baseClasses.find(i => i.name === typeName)?.templateArgs || []
      if (templateArgs.length > 0) {
        content += `<${templateArgs
          .map(i => {
            // this.importType.add(i.typeName)
            return this.generateResTypeValue(i.typeArgs, i.typeName, i.isDefsType)
          })
          .join(', ')}>`
      }
    }
    return content || 'any'
  }

  private generateParamType() {
    const { typeList, content, fileInfo } = this
    const { generateTypeRender, fileName } = fileInfo

    const resTypeList = typeList
      .filter(i => i.parameters.length > 1)
      .map(i => {
        const { paramTypeName, parameters } = i
        let typeItems = this.createTypeItems(parameters)

        if (typeof generateTypeRender === 'function') {
          typeItems = generateTypeRender({ fileName, typeName: paramTypeName, values: typeItems })
        }

        this.typeItemList.push({ paramTypeName, typeItems })

        return `export interface ${paramTypeName} {\r\n${this.createTypeContent(typeItems).join('\n')}}`
      })

    this.content = `${resTypeList.join('\r\n')}\r\n${content}`
  }

  private createTypeItems(parameters: Property[]): RenderVlaue[] {
    return parameters.map(i => {
      const { description: des, dataType, example } = i

      const { typeArgs, typeName, isDefsType, templateIndex } = dataType
      // const { value } = this.tempMap.find(i => i.tempName === typeName) ?? {}
      const valueType = this.generateResTypeValue(typeArgs, typeName, isDefsType)
      const description = this.getDescription(des, example)
      return Object.assign(i, { valueType, description })
    })
  }

  private createTypeContent(typeItems: RenderVlaue[]) {
    return typeItems.map(
      ({ name, required, valueType, description }) => `${description}${name}${required ? '' : '?'}: ${valueType}`
    )
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
    const fileName = 'type.d.ts'
    // const { fileInfo } = this
    const { typeDirPaht, baseClasses, generateTypeRender } = this.fileInfo
    const content = baseClasses.map(i => {
      const { name, properties, templateArgs, description } = i as typeof i & { example?: string }

      const tempIndexs = templateArgs.map(i => i.typeName)
      const temStr = tempIndexs.length > 0 ? `<${tempIndexs.join(', ')}>` : ''
      let typeItems = this.createTypeItems(properties)

      if (typeof generateTypeRender === 'function') {
        typeItems = generateTypeRender({ fileName, typeName: name, values: typeItems })
      }

      return `${this.getDescription(description)}export interface ${name}${temStr} {\r\n${this.createTypeContent(
        typeItems
      ).join('\r\n')}}`
    })

    const filePath = path.join(typeDirPaht, fileName)
    fileList.push({ filePath, content: objMapType + content.join('\r\n') })
  }
}
