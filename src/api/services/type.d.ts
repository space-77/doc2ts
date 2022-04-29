import type { AxiosRequestConfig } from 'axios'
export type TData = Record<string, any>
export interface IRequestParams {
  url: string
  params?: TData
  config?: object
  method?: AxiosRequestConfig['method']
}
export interface IApiClient {

  /**
   * @param params
   * @description 
   接口请求方法  
   意义：在请求某个接口时，可以不需要使用 `try catch` 或者 `then`，只需要结构出返回值数组的第一个位置是否有值，有值则报错  
   实现 request 方法要求  
   1. 返回值必须是 `Promise` 的 `resolve`方法，即永远返回成功的Promise
   2. 在接口无错误的情况下，`Promise` 的 `resolve` 方法 传入数组，值为 `[undefined, data.data, data]`
   3. 在接口有报错的情况下，`Promise` 的 `resolve` 方法 传入数组，值为 `[error, data.data, data]`
   */
  request<T = any>(params: IRequestParams): Promise<any>

  /**
   * 
   * @description 下载文件
   */
  downloadFile(params: IRequestParams): Promise<any>

  serialize(params: TData): string

  /**
   * @param params 数据源
   * @param keyList 数据键
   * @description 提取参数
   */
  extractParams(params: object, keyList: string[]): { [key: string]: any }
}

export interface IApiClient {
  request<T = any>(params: any): Promise<[any, T, IResponse<T>]>
}

export interface IClient {
  /**
   * 是否可以开启多次重复请求，默认： true
   * 说明：
   * 默认情况下，当某个请求发出，在该请求没完成的情况下，再发起同样的请求，后发的请求会被取消
   * 如果 noRepeat 配置为 false 则关闭防重复请求功能
   * 该配置用于 分包上传文件 等接口
   */
  noRepeat?: boolean

  /**
   * 是否携带 token，默认： true
   */
  hasToken?: boolean
}

export interface IResponse<T> {
  data: T
  code: string
  msg?: string
}
