import type { IRequestParams, TData, IApiClient } from './type'

export class ApiClient implements IApiClient {
  /**
   * @param url
   * @param params
   * @param config axios 的 config
   * @param client 配置自定义请求参数
   */
  request<T = any>(params: IRequestParams): Promise<any> {
    return Promise.resolve([])
  }

  downloadFile(params: IRequestParams): Promise<any> {
    return Promise.resolve([])
  }
  /**
   * @param params
   * @description 拼接参数
   */
  serialize(params: TData): string {
    return Object.entries(params)
      .map(([key, value]) => (value !== undefined && value != null && value !== '' ? `${key}=${value}` : undefined))
      .filter(Boolean)
      .join('&')
  }

  /**
   * @param params 数据源
   * @param keyList 数据键
   * @description 提取参数
   */
   extractParams(params: object, keyList: string[]) {
    const newParams : {[key: string]: any} = {}
    keyList.forEach(key => {
      newParams[key] = params[key]
    })
    return newParams
  }


}
