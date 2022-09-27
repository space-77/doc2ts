import type * as defs from './type'
export interface GetBillParam {
  /** @description id */
  id: string
}
export type GetBillBody = defs.GeneralResponseBody<defs.Bill>
export type GetBill = (id: GetBillParam['id']) => Promise<[any, GetBillBody['data'], GetBillBody]>
