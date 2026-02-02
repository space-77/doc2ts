import { PathItem } from '../index'
import TypeInfoBase from './base'
import Components, { ModuleName } from '../components'
import type { SchemaObject, ParameterObject, ReferenceObject } from '../../types/openapi'

export type Schema = ReferenceObject & SchemaObject
export type ParametersData = ReferenceObject | ParameterObject

export type ParametersOp = {
  parent: Components
  name: string
  datas: ParametersData[]
  isTsType?: boolean
  spaceName?: string
  moduleName: ModuleName
}
export default class Parameters extends TypeInfoBase {
  datas: ParametersOp['datas']
  additionalProperties: any

  constructor(op: ParametersOp, public apiInfo?: PathItem) {
    const { moduleName, parent, name, datas, spaceName, isTsType } = op
    super(parent, name, moduleName, spaceName, isTsType)
    this.datas = datas
  }

  init = () => {
    for (const keyItem of this.datas) {
      const { $ref } = keyItem as any
      if ($ref) {
        this.pushRef($ref)
      } else if (keyItem) {
        this.typeItems.push(this.formatParameters(keyItem as ParameterObject, this.apiInfo))
      }
    }
  }
}
