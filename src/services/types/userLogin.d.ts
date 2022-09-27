import type * as defs from './type'
export interface LoginParam {
  /** @description shopUserRequestDTO */
  shopUserRequestDTO: defs.UserLoginRequestBody
}
export interface ForgetShopUserPasswordParam {
  /** @description userForgetPasswordRequestBDDTO */
  userForgetPasswordRequestBDDTO: defs.TheUserToChangePasswordBody
}
export interface ModifyStatusToOneParam {
  /** @description bid */
  bid: string
}
export interface ShopUserByPhoneParam {
  /** @description phone */
  phone: string
}
export type LoginBody = defs.GeneralResponseBody<defs.StoreTheUser>
export type ForgetShopUserPasswordBody = defs.GeneralResponseBody<defs.TheShopAssistantToAdd>
export type ModifyStatusToOneBody = defs.GeneralResponseBody<defs.StoreTheUser>
export type ShopUserByPhoneBody = defs.GeneralResponseBody<defs.JSONObject>
export type Login = (
  shopUserRequestDTO: LoginParam['shopUserRequestDTO']
) => Promise<[any, LoginBody['data'], LoginBody]>

export type ForgetShopUserPassword = (
  userForgetPasswordRequestBDDTO: ForgetShopUserPasswordParam['userForgetPasswordRequestBDDTO']
) => Promise<[any, ForgetShopUserPasswordBody['data'], ForgetShopUserPasswordBody]>

export type ModifyStatusToOne = (
  bid: ModifyStatusToOneParam['bid']
) => Promise<[any, ModifyStatusToOneBody['data'], ModifyStatusToOneBody]>

export type ShopUserByPhone = (
  phone: ShopUserByPhoneParam['phone']
) => Promise<[any, ShopUserByPhoneBody['data'], ShopUserByPhoneBody]>
