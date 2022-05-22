export interface IApiClient {
  /**
   * @param config
   * @description 接口请求方法
   */
  request<T = any>(config: DocReqConfig): Promise<T>
}

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

export type TData = Record<string, any>

export interface DocReqConfig {
  /**
   * @description 接口请求路径
   */
  url: string

  /**
   * @description 请求体， 根据文档接口入参定义
   */
  body?: TData

  /**
   * @description 自定义配置信息
   */
  config?: object

  /**
   * @description 请求方法
   */
  method?: Method

  /***
   * @description header 请求参数，根据文档接口入参定义
   */
  header?: TData

  /**
   * @description FormData 参数，根据文档接口入参定义
   */
  formData?: FormData
}
