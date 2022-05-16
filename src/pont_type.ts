import { PARAMS_NAME } from './config'
import { Doc2TsConfig, ModuleConfigInfo } from './type'
import { Interface, StandardDataSource } from 'pont-engine'

export type StandardDataSourceLister = { name: string; data: StandardDataSource }

export type ModelInfo = {
  // data: StandardDataSource
  name: string
  config: ModuleConfigInfo
  filePath: string
  fileName: string
  // basePath?: string
  hideMethod: boolean
  interfaces: Interface[]
  typeFilePaht: string
  description: string
  render: Doc2TsConfig['render']
  resultTypeRender: Doc2TsConfig['resultTypeRender']
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
