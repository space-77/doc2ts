import type { DictList } from '../common/translate'

export type Dict = {
  dict: DictList[]
  desc: string[]
  cache: {
    /**
     * @description  operationId 缓存信息
     */
    idNames: Record<string, string>

    /**
     * @description  接口请求参数类型名
     */
    returnTypeNames: Record<string, string>

    /**
     * @description  接口返回数据类型名
     */
    requestTypeNames: Record<string, string>

    /**
     * @description  接口方法名缓存
     */
    funcNameCache: {
      funcName: Record<string, string>
      moduleName: string
    }[]
  }
}

