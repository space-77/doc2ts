import type { PARAMS_NAME } from '../common/config'
import type { Interface, Property, StandardDataSource } from '../pont-engine/standard'

export interface ModelList {
  url: string
  name?: string
  version?: '3.0' | '2.0' | '1.0'
}

export type MethodConfig = {
  // /**
  //  * @deprecated 弃用
  //  * @description 修改方法名称
  //  */
  // name?: string

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

export type GitConfig = {
  /**
   * @desc 管理 自动拉取代码的分支
   */
  branchname: string
}


export type Origin = ModelList

export type Doc2TsConfig = {
  /**
   * @description swagger 文档请求地址 eg: http://localhost:7001
   */
  origins: Origin[]

  /**
   * @description 定义鉴权信息
   */
  swaggerHeaders?: Record<string, any>

  /**
   * @description 自定义请求 swagger 数据信息接口
   */
  fetchSwaggerDataMethod?(url: string): Promise<string>

  gitConfig?: GitConfig,

  /**
   * @description 文件输出位置
   */
  outDir: string

  /**
   * @default ApiClient
   * @description 每个模块继承的基类名称， 注意：基类必须 实现 IApiClient 接口
   */
  baseClassName?: string

  /**
   * @description 生成的文件类型
   */
  languageType?: 'typeScript' | 'javaScript' | 'typescript' | 'javascript' | 'ts' | 'js'

  /**
   * @default false
   * @description 是否输出 ts 文件【languageType 为 js 模式下有效】
   */
  emitTs?: boolean

  /**
   * @default true
   * @description 是否输出 js 的生成声明文件 d.ts 文件【languageType 为 js 模式下有效】
   */
  declaration?: boolean

  /**
   * @description 基类路径
   */
  baseClassPath: string
  // /**
  //  * @description swagger bootstrap ui 文档请求地址 eg: http://localhost:7001
  //  */
  // swaggerBootstrapUiUrl?: string

  /**
   * @deprecated prettier 格式化代码的配置位置，默认会读取项目上的 .prettierrc.js  prettier.config.js prettier.config.cjs .prettierrc .prettierrc.json .prettierrc.json5 以及 package.json 里的  prettier配置， 没有则使用默认配置
   */
  prettierPath?: string

  /**
   * @description 接口返回数据类型钩子
   */
  resultTypeRender?: string | ((typeName: string, typeInfo: Property[], info: { modelName?: string, funId?: string }) => string)

  /**
   * @description 模块改名
   * @description 传入 正则类型或字符串类型则对模块名称进行 `name.replace` 操作
   */
  rename?: RegExp | string | ((modelName: string) => string)

  /**
   * @description 隐藏请求方法，达到简化代码
   */
  hideMethod?: boolean

  /**
   * @param content 即将生成文件的内容
   * @param moduleName 文件对应的模块名称
   * @param config  配置文件
   * @description 生成接口文件前的钩子，用于修改生成的内容
   */
  render?(content: string, moduleName?: string): string

  /**
   * @param content 即将生成文件的内容
   * @param modelName 文件对应的模块名称
   * @description 生成接口类型文件前的钩子，用于修改生产内容
   */
  typeFileRender?(content: string, modelName: string): string

  // moduleConfig?: ModuleConfig

  methodConfig?: {
    [key: string]: MethodConfig
  }
}

export type Doc2TsConfigKey = keyof Doc2TsConfig

export type StandardDataSourceLister = { name?: string; data: StandardDataSource }

export type ModelInfo = {
  isJs?: boolean
  // config: ModuleConfigInfo
  dirPath: string
  filePath: string
  fileName: string
  hideMethod: boolean
  moduleName?: string
  interfaces: Interface[]
  typeDirPaht: string
  description: string
  diffClassPath: string
  render: Doc2TsConfig['render']
  methodConfig?: {
    [key: string]: MethodConfig
  }
  // resultTypeRender: Doc2TsConfig['resultTypeRender']
}

export type GetParamsStr = {
  methodBody: string
  onlyType: boolean
  hasPath: boolean
  hasQuery: boolean
  hasBody: boolean
  hasHeader: boolean
  hasformData: boolean
  bodyName: PARAMS_NAME.BODY
  // queryName: PARAMS_NAME.QUERY
  headerName: PARAMS_NAME.HEADER
  formDataName: PARAMS_NAME.FORMDATA
  body: string
  header: string
  formData: string
  paramsName: string
  queryValue?: string
}

export type FilePathList = { moduleName?: string; data: { fileName: string; filePath: string }[] }

export type FileListItem = { filePath: string; content: string }
