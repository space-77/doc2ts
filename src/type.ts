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
  params?: TData
  config?: object
  method?: Method
}

export interface IApiClient {
  /**
   * @param params
   * @description 接口请求方法
   */
  request<T = any>(params: IRequestParams): Promise<any>

  /**
   *
   * @description 下载文件
   */
  downloadFile(params: IRequestParams): Promise<any>

  /**
   *
   * @param params
   * @description 序列化参数
   */
  serialize(params: TData): string

  /**
   * @param params 数据源
   * @param keyList 数据键
   * @description 提取参数
   */
  extractParams(params: object, keyList: string[]): { [key: string]: any }
}
export interface ModelList {
  name: string
  url: string
  swaggerVersion: string
  location: string
}

export interface Parameters {
  in: string
  name: string
  type: string
  format?: string
  description: string
  required: boolean
  'x-example': string
  schema?: { type: string; originalRef: string; $ref: string }
}

export interface PropertiesItem {
  type: string
  $ref?: string
  example?: string
  description: string
  originalRef?: string
  items?: {
    $ref: string
    type?: string
    originalRef: string
  }
}

export interface MethodInfo {
  tags: string[]
  summary: string
  description: string
  operationId: string
  parameters: Parameters[]
  produces: string[]
  responses: {
    200: {
      schema: PropertiesItem
      description: string
    }
  }
  deprecated: boolean
}

export interface ModelInfoList {
  swagger: string
  info: {
    title: string
    version: string
    description: string
  }
  host: string
  basePath: string
  tags: {
    name: string
    description: string
  }[]
  paths: {
    [key: string]: {
      put: MethodInfo
      get: MethodInfo
      post: MethodInfo
      delete: MethodInfo
      // [key: 'get' | 'post' | 'delete' | 'put']: {}
    }
  }
  definitions: {
    [key: string]: {
      type: string
      title: string
      required?: string[]
      description?: string
      properties: {
        [key: string]: PropertiesItem
      }
    }
  }
}

export interface DocModelInfoList {
  data: ModelInfoList
  modelName: string
}

export interface ResponsesType {
  loop?: boolean
  type?: string
  keyName?: string
  hsaLoop?: boolean
  example?: string
  required?: boolean
  parentType?: string
  description?: string
  children?: ResponsesType | ResponsesType[] | null
}

export interface RequestType {
  loop?: boolean
  type?: string
  format?: string
  inType?: string
  keyName?: string
  hsaLoop?: boolean
  required?: boolean
  description?: string
  children: RequestType[] | null
}

export interface ModelInfos {
  basePath: string
  modelName: string
  beforeName: string
  typesList: TypeList[]
  funcTypeNameList: string[]
  // typeListMap: Map<string, string>
  apiInfos: {
    requestInfo: {
      url: string
      qurey: string[] | null
      params: string
      // nonEmpty: boolean
      restParameters: TypeList['value']
    }
    method: string
    summary: string
    // typeName?: string
    funcInfo: {
      // RequestType
      funcName: string
      funcType: string
      requestType: string
      funcTypeName: string
      responseType: string
    }
    operationId: string
    paramsTypes: TypeList['value']
    // parentTypeName?: string
    // responsesType: ResponsesType[]
    methodConfig: MethodConfig
  }[]
}

export type DeepTypes = { [key: string]: (ResponsesType | RequestType)[] }

export type GetTypeList = (params: {
  deep?: number
  json: (ResponsesType | RequestType)[]
  parentName?: string
  deepTypes: DeepTypes
}) => string

export type TypeList = {
  refs: string[] // 引用类型集合
  preRef: string
  typeName: string
  description?: string
  parentTypeName?: string // 用于继承
  value: {
    type: string
    loop?: boolean
    inType?: string
    keyName: string
    example?: string
    required?: boolean
    hsaChild?: boolean
    description?: string
    childTypeName?: string
    childType?: string
  }[]
}

export type GetResponsesType = (params: {
  preRef: string
  topmost?: boolean
  definitions: ModelInfoList['definitions']
  typesList: TypeList[]
  inType?: string
  typeName: string
  description?: string
  // typeListMap: Map<string, string>
}) => string | undefined

export type FormatParamsType = (params: {
  parameters: Parameters[]
  description: string
  paramsTypeName: string
  // typeListMap: Map<string, string>
  definitions: ModelInfoList['definitions']
  typesList: TypeList[]
}) => TypeList['value']

export type MethodConfig = {
  /**
   * @description 修改方法名称
   */
  name?: string

  /**
   * @description 修改描述
   */
  description?: string

  /**
   * @description 该接口是否是下载文件接口
   */
  isDownload?: boolean

  /**
   * @description 接口的自定义配置，会传递到调用对应基类的方法里
   */
  config?: object
}

export type ModuleConfig = {
  /**
   * @description 每个模块自己的配置
   */
  [key: string]: {
    /**
     * @description 模块重命名， 优先级高于 config.rename
     */
    moduleName?: string

    methodConfig?: {
      [key: string]: MethodConfig
    }
  }
}

export type Doc2TsConfig = {
  // 文件输出位置
  outDir: string
  // swagger 文档请求地址 eg: http://localhost:7001
  originUrl: string

  /**
   * @default T
   * @description 接口请求返回Promise的泛型
   */
  resultGenerics?: string

  /**
   * @description 整理 resultGenerics 的 默认类型, 根据返回数据的某个key的值做为新的返回类型
   * @example 
  在使用接口返回数据的时候不需要外面的一层数据，只需要 data 里的数据，即可使用 dataKey 把 外层丢弃
  注意： 在 实现 IApiClient 接口的 request 方法，也需要做响应的处理
  ``` ts
  //  默认类型
  {
    code: '0',
    msg: 'success',
    data: { count: 100, list: [...], page: 1 }
  }

  //  新的类型
  {
    page: 1，
    count: 100,
    list: [...]
  }
   * ```
   */
  dataKey?: string

  /**
   * @description 模块改名
   * @description 传入 正则类型或字符串类型则对模块名称进行 `name.replace` 操作
   */
  rename?: RegExp | string | ((modelName: string) => string)

  /**
   * @default ApiClient
   * @description 每个模块继承的基类名称， 注意：基类必须 实现 IApiClient 接口
   */
  baseClassName?: string

  /**
   * @description 基类路径
   */
  baseClassPath: string

  /**
   * @description 隐藏请求方法，达到简化代码
   */
  hideMethod?: boolean

  /**
   * @param content 即将生成文件的内容
   * @param modelName 文件对应的模块名称
   * @param config  配置文件
   * @description 生成接口文件前的钩子，用于修改生成的内容
   */
  render?(content: string, modelName: string, config: ModuleConfig['']): string

  /**
   * @param content 即将生成文件的内容
   * @param modelName 文件对应的模块名称
   * @param config  配置文件
   * @description 生成接口类型文件前的钩子，用于修改生产内容
   */
  typeFileRender?(content: string, modelName: string, config: ModuleConfig['']): string

  moduleConfig?: ModuleConfig
}

export type Doc2TsConfigKey = keyof Doc2TsConfig
