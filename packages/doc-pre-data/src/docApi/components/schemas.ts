import TypeInfoBase from './base'
import Components, { ModuleName } from '../components'
import type { SchemasData, SchemaObject, ReferenceObject } from '../../types/openapi'

export type SchemasOp = {
  name: string
  data: SchemasData
  parent: Components
  isTsType?: boolean
  spaceName?: string
  moduleName: ModuleName
  resConentType?: string
}
export default class Schemas extends TypeInfoBase {
  data: SchemasOp['data']
  resConentType?: string

  constructor(op: SchemasOp) {
    const { parent, name, data, resConentType, moduleName, isTsType, spaceName } = op
    super(parent, name, moduleName, spaceName, isTsType)
    this.data = data
    this.resConentType = resConentType
  }

  init = () => {
    const { data, name } = this
    const { $ref } = data as ReferenceObject

    if ($ref) {
      // 引用其它类型
      this.pushRef($ref)
    } else {
      this.typeItems.push(...this.createSchemaTypeItem(data as SchemaObject, name))
    }
  }
}
