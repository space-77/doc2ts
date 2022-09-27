import type * as defs from './type'
export interface LoginVxParam {
  /** @description mobileRequestDTO */
  mobileRequestDTO: defs.WeChatInformation
}
export type LoginVxBody = defs.GeneralResponseBody<defs.WeChatInformation>
export type LoginVx = (
  mobileRequestDTO: LoginVxParam['mobileRequestDTO']
) => Promise<[any, LoginVxBody['data'], LoginVxBody]>
