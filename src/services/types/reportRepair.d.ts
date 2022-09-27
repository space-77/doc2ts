import type * as defs from './type'
export interface AddTurnoverParam {
  /** @description reportRepairAddBDRequestDTO */
  reportRepairAddBDRequestDTO: defs.TheDTORepairServiceBusiness
}
export interface TurnoverListParam {
  /** @description reportRepairListRequestDTO */
  reportRepairListRequestDTO: defs.ToTheRepairListQuery
}
export type AddTurnoverBody = defs.GeneralResponseBody<defs.JSONObject>
export type TurnoverListBody = defs.GeneralResponseBody<defs.TheListAboutTheRepairList>
export type AddTurnover = (
  reportRepairAddBDRequestDTO: AddTurnoverParam['reportRepairAddBDRequestDTO']
) => Promise<[any, AddTurnoverBody['data'], AddTurnoverBody]>

export type TurnoverList = (
  reportRepairListRequestDTO: TurnoverListParam['reportRepairListRequestDTO']
) => Promise<[any, TurnoverListBody['data'], TurnoverListBody]>
