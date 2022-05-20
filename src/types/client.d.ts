export interface IApiClient {
  /**
   * @param config
   * @description 接口请求方法
   */
  request<T = any>(config: IRequestParams): Promise<T>

  /**
   *
   * @description 下载文件
   */
  downloadFile(config: IRequestParams): Promise<any>
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

export interface IRequestParams {
  url: string
  body?: TData
  config?: object
  method?: Method
  header?: TData
  formData?: FormData
}
