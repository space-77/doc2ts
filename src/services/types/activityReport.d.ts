import type * as defs from './type'
export interface AddActivityReportParam {
  /** @description reportRequest */
  reportRequest: defs.SmallProgramEndReportRequestActivities
}
export interface GetActivityReportListParam {
  /** @description queryRequest */
  queryRequest: defs.SmallProgramEndReportQueryBody
}
export interface TbFindMarketManagerParam {}
export type AddActivityReportBody = defs.GeneralResponseBody<defs.JSONObject>
export type GetActivityReportListBody = defs.GeneralResponseBody<
  defs.PagingResponseBody<defs.WeChat2BResponseActivities>
>
export type TbFindMarketManagerBody = defs.GeneralResponseBody<Array<defs.SmallProgramEndBusinessQueryReturns>>
export type AddActivityReport = (
  reportRequest: AddActivityReportParam['reportRequest']
) => Promise<[any, AddActivityReportBody['data'], AddActivityReportBody]>

export type GetActivityReportList = (
  queryRequest: GetActivityReportListParam['queryRequest']
) => Promise<[any, GetActivityReportListBody['data'], GetActivityReportListBody]>

export type TbFindMarketManager = () => Promise<[any, TbFindMarketManagerBody['data'], TbFindMarketManagerBody]>
