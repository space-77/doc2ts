import { StandardDataSource } from 'pont-engine'
import { PARAMS_NAME } from './config'
import { Doc2TsConfig, ModuleConfigInfo } from './type'

export type StandardDataSourceLister = { name: string; data: StandardDataSource }

export type ModelInfo = {
  data: StandardDataSource
  name: string
  outDir: string
  basePath?: string
  // moduleConfig: Doc2TsConfig['moduleConfig']
  config: ModuleConfigInfo
  baseClassName: string
  baseClassPath: string
  classMethodStr: string
  render: Doc2TsConfig['render']
}

export type GetParamsStr = {
  codeStr: string
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
