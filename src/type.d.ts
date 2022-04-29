import { MethodConfig } from '../doc2ts.config'

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
    inType?: string
    keyName: string
    example?: string
    required?: boolean
    description?: string
    childTypeName?: string
    hsaChild?: boolean
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
