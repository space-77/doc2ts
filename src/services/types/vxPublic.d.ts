import type * as defs from './type'
export interface GetTokenParam {}
export interface ToCMessage1Param {}
export type GetTokenBody = defs.GeneralResponseBody<defs.WeChatPublicAccessToList>
export type ToCMessage1Body = string
export type GetToken = () => Promise<[any, GetTokenBody['data'], GetTokenBody]>

export type ToCMessage1 = () => Promise<ToCMessage1Body>
