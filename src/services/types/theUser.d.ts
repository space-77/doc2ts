import type * as defs from './type'
export interface AddShopUserParam {
  /** @description shopUserRequestBDDTO */
  shopUserRequestBDDTO: defs.TheUser
}
export interface GetOpenUserParam {}
export interface ShopUserListParam {}
export interface ModifyShopUserParam {
  /** @description shopUserRequestModifyBDDTO */
  shopUserRequestModifyBDDTO: defs.ModifyTheUserRequest
}
export interface ShopDetailsParam {
  /** @description id */
  id: string
}
export interface ModifyShopUserTypeParam {
  /** @description shopUserRequestModifyTypeBDDTO */
  shopUserRequestModifyTypeBDDTO: defs.ModifyTheUserTypes
}
export interface ModifyShopUserPasswordParam {
  /** @description userModifyPasswordRequestBDDTO */
  userModifyPasswordRequestBDDTO: defs.TheUserToChangePasswordBody
}
export type AddShopUserBody = defs.GeneralResponseBody<defs.TheShopAssistantToAdd>
export type GetOpenUserBody = defs.GeneralResponseBody<defs.JSONObject>
export type ShopUserListBody = defs.GeneralResponseBody<Array<defs.StoreTheUser>>
export type ModifyShopUserBody = defs.GeneralResponseBody<defs.TheShopAssistantToAdd>
export type ShopDetailsBody = defs.GeneralResponseBody<defs.TheUserDetails>
export type ModifyShopUserTypeBody = defs.GeneralResponseBody<defs.TheShopAssistantToAdd>
export type ModifyShopUserPasswordBody = defs.GeneralResponseBody<defs.TheShopAssistantToAdd>
export type AddShopUser = (
  shopUserRequestBDDTO: AddShopUserParam['shopUserRequestBDDTO']
) => Promise<[any, AddShopUserBody['data'], AddShopUserBody]>

export type GetOpenUser = () => Promise<[any, GetOpenUserBody['data'], GetOpenUserBody]>

export type ShopUserList = () => Promise<[any, ShopUserListBody['data'], ShopUserListBody]>

export type ModifyShopUser = (
  shopUserRequestModifyBDDTO: ModifyShopUserParam['shopUserRequestModifyBDDTO']
) => Promise<[any, ModifyShopUserBody['data'], ModifyShopUserBody]>

export type ShopDetails = (id: ShopDetailsParam['id']) => Promise<[any, ShopDetailsBody['data'], ShopDetailsBody]>

export type ModifyShopUserType = (
  shopUserRequestModifyTypeBDDTO: ModifyShopUserTypeParam['shopUserRequestModifyTypeBDDTO']
) => Promise<[any, ModifyShopUserTypeBody['data'], ModifyShopUserTypeBody]>

export type ModifyShopUserPassword = (
  userModifyPasswordRequestBDDTO: ModifyShopUserPasswordParam['userModifyPasswordRequestBDDTO']
) => Promise<[any, ModifyShopUserPasswordBody['data'], ModifyShopUserPasswordBody]>
