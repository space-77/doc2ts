export interface IApiClient {
  /**
   * @param config
   * @description 接口请求方法
   */
  request(config: DocReqConfig): Promise<any>
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
  body?: Record<string, any>

  /**
   * @description 自定义配置信息
   */
  config?: Record<string, any>

  /**
   * @description 请求方法
   */
  method?: Method

  /***
   * @description headers 请求参数，根据文档接口入参定义
   */
  headers?: Record<string, any>

  /**
   * @description FormData 参数，根据文档接口入参定义
   */
  formData?: URLSearchParams | FormData
}
