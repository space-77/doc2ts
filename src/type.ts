import { Interface, Property, StandardDataSource } from 'pont-engine/lib/standard'
import { PARAMS_NAME } from './common/config'

export interface IApiClient {
  /**
   * @param params
   * @description 接口请求方法
   */
  request<T = any>(params: IRequestParams): Promise<T>

  /**
   *
   * @description 下载文件
   */
  downloadFile(params: IRequestParams): Promise<any>
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

export interface ModelList {
  url: string
  name: string
  location: string
  swaggerVersion: string
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

export type ModuleConfigInfo = {
  /**
   * @description 模块重命名， 优先级高于 config.rename
   */
  moduleName?: string

  methodConfig?: {
    [key: string]: MethodConfig
  }
}

export type ModuleConfig = {
  /**
   * @description 每个模块自己的配置
   */
  [key: string]: ModuleConfigInfo
}

export type Doc2TsConfig = {
  /**
   * @description 文件输出位置
   */
  outDir: string
  /**
   * @description swagger 文档请求地址 eg: http://localhost:7001
   */
  originUrl: string

  /**
   * @deprecated prettier 格式化代码的配置位置，默认会读取项目上的 .prettierrc.js  prettier.config.js prettier.config.cjs .prettierrc .prettierrc.json .prettierrc.json5 以及 package.json 里的  prettier配置， 没有则使用默认配置
   */
  prettierPath?: string

  /**
   * @description 接口返回数据类型钩子
   */
  resultTypeRender?(typeName: string, typeInfo: Property[]): string

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
   * @description 生成接口类型文件前的钩子，用于修改生产内容
   */
  typeFileRender?(content: string, modelName: string): string

  moduleConfig?: ModuleConfig
}

export type Doc2TsConfigKey = keyof Doc2TsConfig

export type StandardDataSourceLister = { name: string; data: StandardDataSource }

export type ModelInfo = {
  name: string
  config: ModuleConfigInfo
  dirPath: string
  filePath: string
  fileName: string
  hideMethod: boolean
  interfaces: Interface[]
  typeDirPaht: string
  description: string
  render: Doc2TsConfig['render']
  // resultTypeRender: Doc2TsConfig['resultTypeRender']
}

export type GetParamsStr = {
  methodBody: string
  onlyType: boolean
  hasPath: boolean
  hsaQuery: boolean
  hsaBody: boolean
  hasHeader: boolean
  hasformData: boolean
  bodyName: PARAMS_NAME.BODY
  queryName: PARAMS_NAME.QUERY
  headerName: PARAMS_NAME.HEADER
  formDataName: PARAMS_NAME.FORMDATA
  body: string
  header: string
  formData: string
}

export type FilePathList = { fileName: string; filePath: string }
