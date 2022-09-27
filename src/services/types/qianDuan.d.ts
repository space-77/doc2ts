import type * as defs from './type'
export interface GetOpenIdByUnionIdParam {
  /** @description vxPublicUserRequestDTO */
  vxPublicUserRequestDTO: defs.VxPublicUserRequestDTO
}
export type GetOpenIdByUnionIdBody = defs.GeneralResponseBody<defs.WeChatPublicUsers>
export type GetOpenIdByUnionId = (
  vxPublicUserRequestDTO: GetOpenIdByUnionIdParam['vxPublicUserRequestDTO']
) => Promise<[any, GetOpenIdByUnionIdBody['data'], GetOpenIdByUnionIdBody]>
