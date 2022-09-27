import type * as defs from './type'
export interface CheckShopUserParam {
  /** @description shopRequestBDDTO */
  shopRequestBDDTO: defs.SwitchTheUserRequestBody
}
export interface ShopListByUserParam {}
export interface MarketListByUserParam {}
export interface ShopListByMarketUserParam {
  /** @description shopListRequestBDDTO */
  shopListRequestBDDTO: defs.StoreListQuery
}
export type CheckShopUserBody = defs.GeneralResponseBody<Array<defs.JSONObject>>
export type ShopListByUserBody = defs.GeneralResponseBody<Array<defs.TheStoreList>>
export type MarketListByUserBody = defs.GeneralResponseBody<Array<defs.ShoppingList>>
export type ShopListByMarketUserBody = defs.GeneralResponseBody<Array<defs.TheStoreList>>
export type CheckShopUser = (
  shopRequestBDDTO: CheckShopUserParam['shopRequestBDDTO']
) => Promise<[any, CheckShopUserBody['data'], CheckShopUserBody]>

export type ShopListByUser = () => Promise<[any, ShopListByUserBody['data'], ShopListByUserBody]>

export type MarketListByUser = () => Promise<[any, MarketListByUserBody['data'], MarketListByUserBody]>

export type ShopListByMarketUser = (
  shopListRequestBDDTO: ShopListByMarketUserParam['shopListRequestBDDTO']
) => Promise<[any, ShopListByMarketUserBody['data'], ShopListByMarketUserBody]>
