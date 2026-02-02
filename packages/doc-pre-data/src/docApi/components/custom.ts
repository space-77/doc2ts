import TypeInfoBase from './base'
import Components, { ModuleName } from '../components'
import type { ParameterObject } from '../../types/openapi'

export type CustomObject = Omit<ParameterObject, 'in'>

export type CustomOp = {
  parent: Components
  name: string
  datas: CustomObject[] | string
  isTsType?: boolean
  spaceName?: string
  moduleName: ModuleName
}
export default class Custom extends TypeInfoBase {
  datas: CustomObject[] = []
  typeValue?: string

  constructor(op: CustomOp) {
    const { parent, name, datas, moduleName, isTsType, spaceName } = op
    super(parent, name, moduleName, spaceName, isTsType)
    if (Array.isArray(datas)) {
      this.datas = datas
    } else {
      this.typeValue = datas
    }
  }

  init = () => {
    for (const keyItem of this.datas) {
      this.typeItems.push(this.formatParameters(keyItem as ParameterObject))
    }
  }
}
