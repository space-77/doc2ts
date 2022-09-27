import type * as defs from './type'
export interface GetAllCouponParam {
  /** @description memberInfoListBDRequestDTO */
  memberInfoListBDRequestDTO: defs.ListOfCoupons
}
export interface GetUrlCodeParam {
  /** @description couponId */
  couponId: string
}
export interface GetCouponDetailParam {
  /** @description couponId */
  couponId: string
}
export interface GetCodeParam {
  /** @description couponId */
  couponId: string
}
export type GetAllCouponBody = defs.GeneralResponseBody<defs.MemberAllCoupon>
export type GetUrlCodeBody = defs.GeneralResponseBody<defs.JSONObject>
export type GetCouponDetailBody = defs.GeneralResponseBody<defs.MemberInfoCouponResponseDTO>
export type GetCodeBody = any
export type GetAllCoupon = (
  memberInfoListBDRequestDTO: GetAllCouponParam['memberInfoListBDRequestDTO']
) => Promise<[any, GetAllCouponBody['data'], GetAllCouponBody]>

export type GetUrlCode = (
  couponId: GetUrlCodeParam['couponId']
) => Promise<[any, GetUrlCodeBody['data'], GetUrlCodeBody]>

export type GetCouponDetail = (
  couponId: GetCouponDetailParam['couponId']
) => Promise<[any, GetCouponDetailBody['data'], GetCouponDetailBody]>

export type GetCode = (couponId: GetCodeParam['couponId']) => Promise<GetCodeBody>
