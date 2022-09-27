import type * as defs from './type'
export interface LoginAuthorParam {
  /** @description code */
  code: string
}
export interface HealthParam {
  /** @description code */
  code: string
}
export type LoginAuthorBody = defs.GeneralResponseBody<defs.WeChatAuthorizationVerification>
export type HealthBody = string
export type LoginAuthor = (code: LoginAuthorParam['code']) => Promise<[any, LoginAuthorBody['data'], LoginAuthorBody]>

export type Health = (code: HealthParam['code']) => Promise<HealthBody>
