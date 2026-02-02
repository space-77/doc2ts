import _ from 'lodash'
import { PathItem } from './index'
import Schemas, { SchemasOp } from './components/schemas'
import Responses from './components/responses'
import Parameters, { ParametersOp } from './components/parameters'
import RequestBodies, { RequestBodiesOp } from './components/requestBodies'
import { checkName, mergeTypeOf } from '../common/utils'
import TypeInfoBase from './components/base'
import Custom, { CustomObject, CustomOp } from './components/custom'
import type { Document, ResponseObject } from '../types/openapi'

export type ModuleName = 'schemas' | 'responses' | 'parameters' | 'requestBodies' | 'custom'
// export type TypeInfoItem = {
//   // key?: string
//   fileName: string
//   typeName: string
//   typeInfo: TypeInfoBase
//   moduleName: ModuleName
// }

export type EnumType = {
  name: string
  values: string[]
}

export class TypeInfoItem {
  constructor(
    public fileName: string,
    public typeName: string,
    public typeInfo: TypeInfoBase,
    public moduleName: ModuleName
  ) {}

  public get name() {
    const { typeName, fileName } = this
    return `${fileName}.${typeName}`
  }

  // getTypeName() {
  //   const { fileName, typeName } = this
  //   return ``
  // }
}

export default class Components {
  enumList: EnumType[] = []
  typeInfoList: { spaceName: string; list: TypeInfoBase[] }[] = []

  constructor(private baseDate: Document, private pathItems: PathItem[]) {
    // 先创建对象再处理数据， 方便打通类型之间的互相引用。
    this.createsObj()
    this.createsPathType()
    this.formatCode()
  }

  checkName(name: string, spaceName: string): string {
    const list = this.typeInfoList.find(i => i.spaceName === spaceName)?.list ?? []
    return checkName(name, checkName => list.some(i => i.typeName === checkName))
  }

  pushEnum(name: string, enums: string[]) {
    const item = this.enumList.find(i => i.name === name)
    if (item && _.isEqual(enums, item.values)) return name
    if (item) name = checkName(name, checkName => this.enumList.some(i => i.name === checkName))
    this.enumList.push({ name, values: enums })
    return name
  }

  pushTypeItem(typeInfo: TypeInfoBase, spaceName?: string) {
    const name = (spaceName = spaceName || typeInfo.spaceName)

    const spaceItem = this.typeInfoList.find(i => i.spaceName === name)
    if (spaceItem) {
      spaceItem.list.push(typeInfo)
    } else {
      this.typeInfoList.push({ spaceName: name, list: [typeInfo] })
    }
  }

  private createsObj() {
    const { schemas = {}, parameters = {}, requestBodies = {}, responses = {} } = this.baseDate.components ?? {}

    Object.entries(schemas).forEach(([name, data]) => {
      const option: SchemasOp = { parent: this, name, data, moduleName: 'schemas' }
      const typeItem = new Schemas(option)
      this.pushTypeItem(typeItem)
    })

    Object.entries(parameters).forEach(([name, data]) => {
      const option: ParametersOp = { parent: this, name, datas: [data], moduleName: 'parameters' }
      const typeItem = new Parameters(option)
      this.pushTypeItem(typeItem)
    })

    Object.entries(requestBodies).forEach(([name, data]) => {
      const option: RequestBodiesOp = { parent: this, name, data, moduleName: 'requestBodies' }
      const typeItem = new RequestBodies(option)
      this.pushTypeItem(typeItem)
    })

    Object.entries(responses).forEach(([name, data]) => {
      const option: RequestBodiesOp = { parent: this, name, data, moduleName: 'responses' }
      const typeItem = new Responses(option)
      this.pushTypeItem(typeItem)
    })
  }

  private createsPathType() {
    for (const pathItem of this.pathItems) {
      const { item, apiPath, method, name, bodyName, paramsName, responseName, moduleName: spaceName } = pathItem

      const { parameters, responses, requestBody, operationId } = item
      const { description, content = {} } = (responses['200'] as ResponseObject) ?? {}

      // FIXME 目前只取第一个， 当一个响应匹配多个键时，只有最明确的键才适用。比如：text/plain 会覆盖 text/*
      const [responseInfo] = Object.entries(content).sort(([a], [b]) => b.length - a.length)
      if (responseInfo) {
        const [media, { schema, example, examples, encoding }] = responseInfo

        if (schema) {
          const option: SchemasOp = {
            parent: this,
            data: schema,
            name: responseName,
            spaceName,
            moduleName: 'schemas',
            resConentType: media
          }
          const response = new Schemas(option)
          this.pushTypeItem(response)
          pathItem.responseType = response
        }
      }
      if (parameters) {
        // typeItems
        const option: ParametersOp = {
          parent: this,
          name: paramsName,
          datas: parameters,
          spaceName,
          moduleName: 'parameters'
        }
        const parameter = new Parameters(option, pathItem)
        this.pushTypeItem(parameter)
        pathItem.parameterType = parameter
      }

      if (requestBody) {
        const option: RequestBodiesOp = {
          parent: this,
          name: bodyName,
          data: requestBody,
          spaceName,
          moduleName: 'requestBodies'
        }
        const requestBodies = new RequestBodies(option)
        this.pushTypeItem(requestBodies)
        pathItem.requestBodyType = requestBodies
      }
    }
  }

  forEachTypeInfo(cb: (item: TypeInfoBase, index: number) => void) {
    this.typeInfoList.forEach(i => {
      i.list.forEach(cb)
    })
  }

  findTypeInfo(cb: (item: TypeInfoBase, index: number) => boolean) {
    let index = 0
    for (let i = 0; i < this.typeInfoList.length; i++) {
      const typeInfo = this.typeInfoList[i]

      for (let j = 0; j < typeInfo.list.length; j++) {
        const info = typeInfo.list[j]
        const res = cb(info, index)
        if (res) return info
        index++
      }
    }
  }

  private formatCode() {
    this.forEachTypeInfo(i => {
      i.init()
    })

    // 类型初始化完后处理 allOf, anyOf, oneOf 相关逻辑
    this.forEachTypeInfo(typeInfo => {
      const { typeItems } = typeInfo

      mergeTypeOf(typeInfo, typeItems, 1)

      typeInfo.typeItems = typeItems
    })
  }

  createEnum(name: string, types: CustomObject[] | string) {
    const option: CustomOp = { parent: this, name, datas: types, moduleName: 'custom' }
    const typeInfo = new Custom(option)
    this.pushTypeItem(typeInfo)
    return typeInfo
  }

  addCustomType(name: string, types: CustomObject[] | string, spaceName?: string) {
    const option: CustomOp = { parent: this, name, datas: types, moduleName: 'custom', spaceName }
    const typeInfo = new Custom(option)
    this.pushTypeItem(typeInfo)
    return typeInfo
  }
}

