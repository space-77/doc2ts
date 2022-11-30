import qs from 'qs'
export type { Doc2TsConfig, ModelList } from './types/types'
export type { IApiClient, DocReqConfig, Method, TData } from './types/client'
export type { Surrounding } from './common/config'
import Doc2Ts from './doc2TsCore'

export { qs }

const doc2ts = new Doc2Ts()
doc2ts.init()
