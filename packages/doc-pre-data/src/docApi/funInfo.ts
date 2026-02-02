import DocApi from './index'
import type { HttpMethods } from '../common/index'
import { getIdentifierFromUrl } from '../common/utils'
import type { OperationObject } from '../types/openapi'


export default class FunInfo {
  funName!: string
  parameters!: any

  get operationId() {
    return this.pathItem.operationId
  }

  get summary() {
    return this.pathItem.summary
  }

  constructor(
    private docApi: DocApi,
    private apiPath: string,
    private method: HttpMethods,
    private pathItem: OperationObject,
  ) {
    // 1、创建 方法名
    // 2、创建 入参数据
    // 3、整理 返回数据类型

    // this.createFunName()
    this.createParameters()
    this.createResultType()
  }

  // private createFunName() {
  //   let name = ''
  //   const { operationId } = this.pathItem

  //   if (operationId) {
  //     //  整理 operationId 作为方法名
  //     name = operationId.replace(/(.+)(Using.+)/, '$1')
  //     name = operationId.replace(/_/, '')
  //   } else {
  //     // 整理 url 作为方法名
  //     name = getIdentifierFromUrl(this.apiPath, this.method, this.samePath)
  //   }

  //   // TODO 如果转非 js 语言的代码，可能兼用该语言的关键字
  //   if (isKeyword(name)) name = `${name}Func`
  //   this.funName = name
  // }

  private createParameters() {
    const { parameters = [] } = this.pathItem

    // this.docApi.components.addParameters(`${this.funName}Params`, parameters)
  }

  private createResultType() {}
}
