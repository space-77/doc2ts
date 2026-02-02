import {
  BaseSchemaObject,
  ComponentsObject,
  SchemaObjectType,
  ParameterObject,
  SchemaObject,
  ReferenceObject,
  ArraySchemaObject,
  ExternalDocumentationObject,
  NonArraySchemaObject,
  SchemasData
} from '../../types/openapi'
import _ from 'lodash'
import TypeItem from '../typeItem'
import Schemas, { SchemasOp } from './schemas'
import Components, { ModuleName } from '../components'
import { firstToUpper, checkTsTypeKeyword, tsKeyword } from '../../common/utils'
import { warnList } from '../../store'
import { PathItem } from '../index'
import { commonTypeKey } from '../../common'

// FIXME 类型继承，可能会存在这种怪异类型
// interface TypeName extends Array<number> {
//   test: ''
// }
export type RefItem = { typeInfo: TypeInfoBase; genericsItem?: TypeInfoBase | string; isTsType?: boolean }

const baseRef = '#/components/'
export default abstract class TypeInfoBase {
  title?: string
  typeName: string
  typeItems: TypeItem[] = []
  allOf: TypeItem[][] = [] // 所有类型组合在一起
  anyOf: TypeItem[][] = [] // TODO，任意一个
  oneOf: TypeItem[][] = [] // TODO，其中一个
  deprecated?: boolean
  description?: string
  // moduleName: ModuleName
  // 继承类型的泛型入参 interface TypeName extends Array<number> {}
  refs: RefItem[] = []
  attrs: Record<string, any> = {} // 自定义属性
  realBody?: TypeInfoBase // 真实的引用
  // childrenRefs: TypeInfoBase[] = [] // 该类型被其它类型引用
  /** 外部链接描叙 */
  externalDocs?: ExternalDocumentationObject
  resConentType?: string

  public get isEmpty(): boolean {
    const { typeItems, refs } = this
    return (
      refs.every(i => i.typeInfo.isEmpty && i.typeInfo?.typeName !== 'Array') &&
      typeItems.filter(i => !i.disable).length === 0
    )
  }

  public get isTsType() {
    return tsKeyword.has(this.typeName)
  }

  constructor(
    protected parent: Components,
    public name: string,
    public moduleName: ModuleName,
    public spaceName = commonTypeKey,
    onlyName = false
  ) {
    // FIXME 考虑是否需要 排除原生类型
    // this.typeName = onlyName ? name : parent.checkName(checkTsTypeKeyword(firstToUpper(name)))
    this.typeName = onlyName ? name : parent.checkName(firstToUpper(name), spaceName)
  }

  /**
   * @description 所在命名空间的名称
   */
  getSpaceName(spaceName?: string) {
    const { typeName, isTsType } = this
    if (spaceName === this.spaceName) return typeName
    return isTsType ? typeName : `${this.spaceName}.${typeName}`
  }

  /**
   * @desc 获取真实类型，跳过空类型引用
   * 例如： C extends B, B extends A, 如果 B 和 C 都是空类型，那么调用 C 和 B 类型其实就是调用 A 类型
   */
  getRealBody(): TypeInfoBase {
    const typeItems = this.typeItems.filter(i => !i.disable)
    // 只有一个应用类型，并且没有子类型，并且有添加过真实类型的才可以往上去父类作为自己的类型
    if (this.refs.length === 1 && typeItems.length === 0 && this.realBody) {
      return this.realBody.getRealBody()
    }
    return this
  }

  getAllRefs(): RefItem[] {
    if (this.refs.length === 0) {
      return []
    } else {
      const refsList: RefItem[] = []
      this.refs.forEach(ref => {
        if (ref.typeInfo.refs.length > 0) {
          refsList.push(...ref.typeInfo.getAllRefs())
        } else {
        }
        refsList.push(ref)
      })
      return refsList
    }
  }

  getTypeItems(): TypeItem[] {
    const allTypesList: TypeItem[] = [...this.typeItems]
    const allRef = _.uniq(_.flattenDeep(this.getAllRefs()))
    allRef.forEach(i => {
      const { typeItems } = i.typeInfo
      if (typeItems.length > 0) allTypesList.push(...typeItems)
    })

    return _.uniq(allTypesList).map(i => {
      if (this.moduleName === 'requestBodies') {
        const ii = _.clone(i)
        ii.paramType = 'body'
        return ii
      } else {
        return i
      }
    })
  }

  abstract init(): void

  protected getType(type?: SchemaObjectType | 'file', ref?: string): TypeItem['type'] {
    if (ref) return this.findRefType(ref)
    if (!type) return 'any'
    if (type === 'file') return 'File'
    if (type === 'array') return 'Array'
    if (type === 'integer') return 'number'
    // if (type === 'object') return 'Record<string, any>'
    return type
  }

  protected findRefType(ref?: string) {
    if (!ref || !ref.startsWith(baseRef)) return
    const [moduleName, typeName] = ref.replace(baseRef, '').split('/') as [keyof ComponentsObject, string]
    return this.parent.findTypeInfo(i => i.moduleName === moduleName && i.name === typeName)
  }

  protected pushRef(ref?: string, genericsItem?: TypeInfoBase) {
    if (!ref) return
    const typeInfo = this.findRefType(ref)

    if (typeInfo) {
      this.realBody = typeInfo
      // typeInfo.childrenRefs.push(this)
      this.refs.push({ typeInfo, genericsItem })
    }
  }

  // 处理 allOf, anyOf, oneOf 引用类型 mock/openapi3-1.json:4956
  protected handleAllOfAnyOfOneOf(schema: BaseSchemaObject) {
    const { allOf = [], anyOf = [], oneOf = [] } = schema

    const allOfList = this.getTypeItem4List(allOf)
    const anyOfList = this.getTypeItem4List(anyOf)
    const oneOfList = this.getTypeItem4List(oneOf)

    return { allOf: allOfList, anyOf: anyOfList, oneOf: oneOfList }
  }

  protected createGenericsTypeinfo(items: ReferenceObject | SchemaObject, name: string): RefItem {
    // 继承泛型逻辑

    const { parent } = this
    const { type, properties } = items as SchemaObject
    const { $ref } = items as ReferenceObject
    const { items: cItems } = items as ArraySchemaObject
    const option: SchemasOp = { parent, name: 'Array', data: items, moduleName: 'schemas', isTsType: true }
    const typeInfo = new Schemas(option) // 创建 ts 原生 Array【用于类型继承，不会生成类型】
    let genericsItem: TypeInfoBase | string | undefined = 'any'
    if ($ref) {
      genericsItem = this.findRefType($ref)
    } else if (properties) {
      const option: SchemasOp = { parent, name: firstToUpper(`${name}T`), data: items, moduleName: 'schemas' }
      genericsItem = new Schemas(option)
      genericsItem.init()
      this.parent.pushTypeItem(genericsItem)
    } else if (cItems) {
      // 创建泛型类型
      const option: SchemasOp = { parent, name: firstToUpper(`${name}T`), data: cItems, moduleName: 'schemas' }
      genericsItem = new Schemas(option)
      genericsItem.init()
      this.parent.pushTypeItem(genericsItem)
    } else if (typeof type === 'string') {
      genericsItem = this.getType(type)
    }
    return { typeInfo, genericsItem }
  }

  // 生成 allOf, anyOf, oneOf 所需的引用类型
  getTypeItem4List(items: SchemasData[] = []) {
    const typeItemList: TypeItem[][] = []
    items.forEach(item => {
      const { $ref } = item as ReferenceObject
      if ($ref) {
        // 此时的 typeItems 可能还没构建，在 Components.formatCode() 方法执行初始化方法是，存在应用类型没初始化可能
        // 这时候拿到 typeItems 应用类型地址即可，使用的时候所有类型都已经初始化了，再打平
        const { typeItems = [] } = this.findRefType($ref) ?? {}
        typeItemList.push(typeItems)
      } else {
        const typeItems = this.createSchemaTypeItem(item as SchemaObject, 'no-name')
        typeItemList.push(typeItems)
      }
    })

    return typeItemList
  }

  protected createSchemaTypeItem(schema: SchemaObject, name: string): TypeItem[] {
    const { items } = schema as Partial<ArraySchemaObject>
    const { properties, additionalProperties, required = [], type } = schema

    const { allOf, anyOf, oneOf } = this.handleAllOfAnyOfOneOf(schema)
    this.allOf.push(...allOf)
    this.anyOf.push(...anyOf)
    this.oneOf.push(...oneOf)

    // 泛型逻辑
    if (items) {
      const ref = this.createGenericsTypeinfo(items, name)
      this.refs.push(ref)
    }

    if (!properties) return []
    const typeItemList = Object.entries(properties).map(([name, schema]) =>
      this.createSchemaType(name, schema, required.includes(name))
    )

    // TODO 处理 Record 类型
    if (additionalProperties) {
      if (typeof additionalProperties === 'boolean') {
      } else {
        // let typeItem =
        if ((additionalProperties as ReferenceObject).$ref) {
        }
        // console.log(additionalProperties)
      }
      // const { propertyName, mapping } = discriminator
      // typeItemList.push(
      //   new TypeItem({
      //     name: propertyName,
      //     type: !mapping ? 'Record<string, any>' : undefined,
      //     children: mapping
      //       ? Object.entries(mapping).map(
      //           ([name, value]) => new TypeItem({ name, type: this.getType(value as SchemaObjectType) })
      //         )
      //       : undefined
      //   })
      // )
    }
    return typeItemList
  }

  protected createSchemaType(keyName: string, schema: SchemasData, required?: boolean): TypeItem {
    const { type } = schema as NonArraySchemaObject
    const { $ref } = schema as ReferenceObject
    const { items } = schema as ArraySchemaObject // 数组需要泛型入参

    const { format, example, nullable, properties = {}, deprecated } = schema as BaseSchemaObject
    const { description, externalDocs, enum: _enum = [], required: childrenRequired = [] } = schema as BaseSchemaObject

    const { allOf, anyOf, oneOf } = this.handleAllOfAnyOfOneOf(schema as BaseSchemaObject)

    const children = Object.entries(properties).map(([name, schema]) =>
      this.createSchemaType(name, schema, childrenRequired.includes(name))
    )

    let enumName
    if (_enum.length > 0) enumName = this.parent.pushEnum(firstToUpper(keyName), _enum)

    const typeItem = new TypeItem({
      ref: items ? this.createGenericsTypeinfo(items, keyName) : undefined,
      format,
      typeRef: this.findRefType($ref),
      example,
      nullable,
      children,
      required,
      deprecated,
      description,
      externalDocs,
      name: keyName,
      enumTypes: _enum, // FIXME 需要实现枚举类型
      type: enumName ?? this.getType(type, $ref)
    })

    typeItem.allOf.push(...allOf)
    typeItem.anyOf.push(...anyOf)
    typeItem.oneOf.push(...oneOf)
    
    return typeItem
  }

  protected formatParameters(data: ParameterObject, apiInfo?: PathItem) {
    let { in: paramType } = data
    const { name, deprecated, schema = {}, required, description, example } = data
    const typeItem = this.createSchemaType(name, { ...schema, deprecated, description, example }, required)
    if (!paramType) {
      // TODO  在参数没有情况下需要纠正参数类型
      // paramType = apiInfo?.method === 'post' ? 'body' : 'query'
      paramType = 'query'
      warnList.push({
        msg: `接口：${apiInfo?.apiPath ?? '未知路径'} 的 "${name}" 请求参数类型未知，已归为到 ${paramType} 类型`
      })
    }
    typeItem.paramType = paramType as TypeItem['paramType']
    return typeItem
  }
}

