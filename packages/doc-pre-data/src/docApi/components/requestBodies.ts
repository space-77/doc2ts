import _ from 'lodash'
import TypeInfoBase from './base'
import Components, { ModuleName } from '../components'
import type {
  BodyObject,
  ResponseData,
  SchemaObject,
  ResponseObject,
  MediaTypeObject,
  ReferenceObject,
  RequestBodyObject
} from '../../types/openapi'

export type RequestBodiesOp = {
  parent: Components
  name: string
  data: BodyObject | ResponseData
  isTsType?: boolean
  spaceName?: string
  moduleName: ModuleName
}
export default class RequestBodies extends TypeInfoBase {
  data: RequestBodiesOp['data']
  required?: boolean
  contentType?: string
  additionalProperties?: boolean | ReferenceObject | SchemaObject

  // TODO BodyObject  的 required 是控制 body 的集合是否必传，但是 body 和 params 合并，应该没什么意义了。
  constructor(op: RequestBodiesOp) {
    const { parent, name, data, moduleName, isTsType, spaceName } = op
    super(parent, name, moduleName, spaceName, isTsType)
    this.data = data
  }

  init() {
    const { $ref } = this.data as ReferenceObject
    if ($ref) {
      // 引用其它类型
      this.pushRef($ref)
    } else {
      const { required } = this.data as RequestBodyObject
      const { content = {}, description } = this.data as RequestBodyObject | ResponseObject
      this.required = required
      this.description = description

      // FIXME 目前只取字数最多的那个，
      // FIXME 当一个请求体类型匹配多个键时，只有最明确的键才适用。比如：text/plain 会覆盖 text/*
      const [[media, mediaTypeObject]] = Object.entries(content).sort(([a], [b]) => b.length - a.length)
      this.contentType = media
      this.format(mediaTypeObject)
    }
  }

  format(mediaTypeObject: MediaTypeObject) {
    const { schema, example, encoding } = mediaTypeObject
    const { $ref } = schema as ReferenceObject
    if ($ref) {
      // 引用其它类型
      this.pushRef($ref)
    } else if (schema) {
      const typeItemList = this.createSchemaTypeItem(schema as SchemaObject, this.name)
      if (this.moduleName === 'requestBodies') {
        typeItemList.forEach(i => {
          i.paramType = 'body'
        })
      }
      this.typeItems.push(...typeItemList)
    }
  }

  getRealBody(): TypeInfoBase {
    const typeInfo = _.clone(super.getRealBody())
    typeInfo.moduleName = 'requestBodies'
    return typeInfo
  }
}
