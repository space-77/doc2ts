import type * as defs from './type'
export interface AddTurnoverParam {
  /** @description turnoverRequestDTO */
  turnoverRequestDTO: defs.SmallProgram2BSideEntity
}
export interface TurnoverListParam {
  /** @description turnoverDaysRequestBDDTO */
  turnoverDaysRequestBDDTO: defs.ListToTurnover
}
export interface GetAdjustInfoParam {
  /** @description turnoverAdjustInfoRequestDTO */
  turnoverAdjustInfoRequestDTO: defs.AdjustTheRecordTurnover
}
export interface GetTurnoverCalendarParam {
  /** @description turnoverCalendarRequestBDDTO */
  turnoverCalendarRequestBDDTO: defs.LocalSalesCalendar
}
export interface GetTurnoverCompareoParam {
  /** @description turnoverCompareoInfoRequestBDDTO */
  turnoverCompareoInfoRequestBDDTO: defs.TurnoverComparedToLocal
}
export interface GetTurnoverCountListParam {
  /** @description turnoverCountRequestBDDTO */
  turnoverCountRequestBDDTO: defs.TurnoverTimeStatistics
}
export interface GetTurnoverCountList1Param {
  /** @description turnoverMothListDTO */
  turnoverMothListDTO: defs.TurnoverList
}
export interface GetCouponDetailParam {
  /** @description date */
  date: string
}
export interface GetTurnoverCountListByTopParam {
  /** @description turnoverCountRequestBDDTO */
  turnoverCountRequestBDDTO: defs.TurnoverTimeStatistics
}
export type AddTurnoverBody = defs.GeneralResponseBody<defs.JSONObject>
export type TurnoverListBody = defs.GeneralResponseBody<Array<defs.DayTurnover>>
export type GetAdjustInfoBody = defs.GeneralResponseBody<Array<defs.AdjustTheRecordsOfLocalTurnover>>
export type GetTurnoverCalendarBody = defs.GeneralResponseBody<defs.TurnoverCalendar>
export type GetTurnoverCompareoBody = defs.GeneralResponseBody<defs.TurnoverContrast>
export type GetTurnoverCountListBody = defs.GeneralResponseBody<Array<defs.TurnoverTimeStatistics>>
export type GetTurnoverCountList1Body = defs.GeneralResponseBody<Array<defs.TurnoverCalendar>>
export type GetCouponDetailBody = defs.GeneralResponseBody<defs.TheTurnoverHasNotUploadDate>
export type GetTurnoverCountListByTopBody = defs.GeneralResponseBody<Array<defs.TurnoverTimeStatistics>>
export type AddTurnover = (
  turnoverRequestDTO: AddTurnoverParam['turnoverRequestDTO']
) => Promise<[any, AddTurnoverBody['data'], AddTurnoverBody]>

export type TurnoverList = (
  turnoverDaysRequestBDDTO: TurnoverListParam['turnoverDaysRequestBDDTO']
) => Promise<[any, TurnoverListBody['data'], TurnoverListBody]>

export type GetAdjustInfo = (
  turnoverAdjustInfoRequestDTO: GetAdjustInfoParam['turnoverAdjustInfoRequestDTO']
) => Promise<[any, GetAdjustInfoBody['data'], GetAdjustInfoBody]>

export type GetTurnoverCalendar = (
  turnoverCalendarRequestBDDTO: GetTurnoverCalendarParam['turnoverCalendarRequestBDDTO']
) => Promise<[any, GetTurnoverCalendarBody['data'], GetTurnoverCalendarBody]>

export type GetTurnoverCompareo = (
  turnoverCompareoInfoRequestBDDTO: GetTurnoverCompareoParam['turnoverCompareoInfoRequestBDDTO']
) => Promise<[any, GetTurnoverCompareoBody['data'], GetTurnoverCompareoBody]>

export type GetTurnoverCountList = (
  turnoverCountRequestBDDTO: GetTurnoverCountListParam['turnoverCountRequestBDDTO']
) => Promise<[any, GetTurnoverCountListBody['data'], GetTurnoverCountListBody]>

export type GetTurnoverCountList1 = (
  turnoverMothListDTO: GetTurnoverCountList1Param['turnoverMothListDTO']
) => Promise<[any, GetTurnoverCountList1Body['data'], GetTurnoverCountList1Body]>

export type GetCouponDetail = (
  date: GetCouponDetailParam['date']
) => Promise<[any, GetCouponDetailBody['data'], GetCouponDetailBody]>

export type GetTurnoverCountListByTop = (
  turnoverCountRequestBDDTO: GetTurnoverCountListByTopParam['turnoverCountRequestBDDTO']
) => Promise<[any, GetTurnoverCountListByTopBody['data'], GetTurnoverCountListByTopBody]>
