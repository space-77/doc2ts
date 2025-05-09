import type { TypeInfoBase, TypeItem, TranslateType, PathInfo } from 'doc-pre-data'

type DefaultFun = {
  /**
   * @default request
   * @description 请求方法名
   */
  requestName?: string

  /**
   * @default download
   * @description 下载方法名
   */
  downloadName?: string
}

export interface ApifoxConfig extends DefaultFun {
  name?: string
  cookie?: string
  sharedId: string
}

export interface ModelList extends DefaultFun {
  url: string
  name?: string
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
   * @desc 远程仓库
   * @default "origin"
   */
  remote?: string

  /**
   * @desc 管理 自动拉取代码的分支
   * @default "doc2ts"
   */
  branchname?: string

  /**
   * @desc 上次 commit 记录
   */
  initCommitId?: string

  /**
   * @default true
   * @decs 跳过 pre-commit 检查（git hook），因为在使用git的管理生成的代码是切换到 {branchname} 分支的，
整个过程都是自动处理，但是生成的代码难免会存在不符合 pre-commit 的代码，所以默认是跳过 pre-commit 检测，
已保证整个流程能自动完成的进行。
   */
  noVerify?: boolean
}

export type Origin = ModelList

export type DisableParams = { paramType: Required<TypeItem>['paramType']; keys: string[] }

export type Doc2TsConfig = {
  /**
   * @description swagger 文档请求地址 eg: http://localhost:7001
   */
  origins: (Origin | ApifoxConfig)[]

  /**
   * @description 定义鉴权信息
   */
  swaggerHeaders?: Record<string, any>

  /**
   * @description 自定义请求 swagger 数据信息接口
   */
  fetchSwaggerDataMethod?(url: string): Promise<string>

  /**
   * @description 过滤模块钩子
   */
  filterModule?(i: PathInfo): boolean

  gitConfig?: GitConfig

  /**
   * @description 默认使用 operationId 作为方法名，如果设置为`false`则使用请求路径作为方法名，【注意：修改该参数会导致所有的方法名都会有变化，建议在初始化时确定好】
   * @default true
   */
  useOperationId?: boolean

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
   * @description 是否生成箭头函数
   */
  translateType?: TranslateType

  /**
   * @default false
   * @description 是否生成箭头函数
   */
  arrowFunc?: boolean

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
   * @description 移除某些全局配置的入参提示，如：token信息是全配置的，不需要在调用接口是再填token信息，即可通过该配置取消
   */
  disableParams?: DisableParams[]

  /**
   * @description 接口返回数据类型钩子
   */
  resultTypeRender?: string | ((funcName: string, typeInfo?: TypeInfoBase) => string)

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

  generateTypeRender?(typeName: string, typeInfo: TypeInfoBase): TypeInfoBase
}

export type Doc2TsConfigKey = keyof Doc2TsConfig

export type FileListItem = { filePath: string; content: string }
