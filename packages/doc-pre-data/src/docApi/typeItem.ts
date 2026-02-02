import _ from 'lodash'
import { isWord, mergeTypeOf } from '../common/utils'
import { OpenAPIV3 } from 'openapi-types'
import TypeInfoBase from './components/base'

export interface TypeItemOption {
  name: string
  /**
   * @description
   */
  type?: string | TypeInfoBase
  typeRef?: TypeInfoBase
  default?: string
  example?: string
  children?: TypeItem[]
  nullable?: boolean
  required?: boolean
  enumTypes?: any[]
  paramType?: 'query' | 'header' | 'path' | 'body' | 'cookie' // 参数的位置
  deprecated?: boolean
  description?: string
  minLength?: number
  maxLength?: number
  format?: string
  externalDocs?: OpenAPIV3.ExternalDocumentationObject /** 外部链接描叙 */
  ref?: { typeInfo: TypeInfoBase; genericsItem?: TypeInfoBase | string }
}
export default class TypeItem {
  name!: string
  type?: TypeItemOption['type']
  typeRef?: TypeInfoBase
  example?: string
  default?: string
  required?: boolean
  nullable?: boolean /** 可以为空 */
  children?: TypeItem[]
  enumTypes?: (string | number)[]
  paramType?: TypeItemOption['paramType']
  deprecated?: boolean /** 是否弃用 */
  description?: string
  minLength?: number
  maxLength?: number
  format?: string
  disable: boolean
  allOf: TypeItem[][] = [] // 所有类型组合在一起
  anyOf: TypeItem[][] = [] // TODO，任意一个
  oneOf: TypeItem[][] = [] // TODO，其中一个
  /** 泛型入参 */
  ref?: TypeItemOption['ref']
  // genericsItem?: string | TypeInfoBase | TypeItem /** 泛型入参 */ // 可能是 字符串， 可能是 引用类型， 可能是 引用类型也是需要入参的
  externalDocs?: TypeItemOption['externalDocs']

  constructor(option: TypeItemOption) {
    const { name, type, typeRef, example, default: def, required } = option
    const {
      ref,
      format,
      nullable,
      children,
      enumTypes,
      paramType,
      deprecated,
      description,
      externalDocs,
      maxLength,
      minLength
    } = option
    this.ref = ref
    this.name = name
    this.type = type
    this.typeRef = typeRef
    this.format = format
    this.default = def
    this.example = example
    this.required = required
    this.nullable = nullable
    this.children = children
    this.enumTypes = enumTypes
    this.paramType = paramType
    this.deprecated = deprecated
    this.description = description
    this.externalDocs = externalDocs
    this.minLength = minLength
    this.maxLength = maxLength
    this.disable = false
  }

  /**
   * @description 获取键值的类型
   */
  getKeyValue() {
    // TODO 处理 allOf, anyOf, oneOf 引用类型
    const { type, nullable, children = [], ref, format } = this
    const { typeInfo, genericsItem } = ref ?? {} // 泛型

    mergeTypeOf(this, children)

    let content = ''
    if (typeof type === 'string') {
      if (format === 'binary') {
        // 使用文件 类型
        content = 'File'
      } else {
        content = type
      }
    } else if (type instanceof TypeInfoBase) {
      // FIXME 返回 应该是 string 不是 Date
      /**
       *           
       * {
          "name": "date",
          "in": "query",
          "description": "2023-09-20",
          "required": false,
          "type": "string",
          "format": "date"
        },
       */
      content = type.getRealBody().getSpaceName()
    } else if (!nullable) {
      content = 'any'
    }

    if (typeInfo) {
      // 生成泛型
      content = typeInfo.getSpaceName()
      let typeNameT = typeof genericsItem === 'string' ? genericsItem : genericsItem?.getSpaceName()
      if (typeNameT === 'Array') typeNameT = 'Array<any>'
      content += `<${typeNameT ?? 'any'}>`
    } else if (content === 'Array') content = 'Array<any>'

    // FIXME 如果泛型存在，而且也有子类型，该怎么处理？
    if (children.length > 0) {
      // 存在子类型，覆盖上面类型
      content = `{${children.map(i => i.getTypeValue()).join('')}}`
    }
    return `${content}${nullable ? `${content ? '|' : ''}null` : ''}`
  }

  getTypeValue(enumPre = ''): string {
    const { name, required, enumTypes = [] } = this

    let key = name
      .split('')
      .map(i => (isWord(i) ? i : '_'))
      .join('')
    if (/\./.test(key) || /^\d/.test(key)) key = `'${key}'`

    const desc = this.getDesc()
    let typeValue = this.getKeyValue()
    if (enumTypes.length > 0) typeValue = enumPre + typeValue

    return `${desc}${key}${required ? '' : '?'}:${typeValue}\n`
  }

  getDesc() {
    const { description, deprecated, example, default: def, externalDocs } = this
    if (!description && !example && !deprecated && !def && !externalDocs) return ''
    const { url, description: linkDescription } = externalDocs ?? {}
    const defaultStr = def ? `\r\n* @default ${def}` : ''
    const exampleStr = example ? `\r\n* @example ${example}` : ''
    const deprecatedStr = deprecated ? '\r\n* @deprecated' : ''
    const descriptionStr = description ? `\r\n* @description ${description}` : ''
    const link = url ? `\r\n* @link ${url} ${linkDescription}` : ''
    return `/**${exampleStr}${defaultStr}${descriptionStr}${deprecatedStr}${link}\r\n*/\r\n`
  }
}

