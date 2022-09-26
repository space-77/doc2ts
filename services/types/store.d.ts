import type * as defs from './type'
export interface PlaceOrderParam {
  /** @description order placed for purchasing the pet */
  body: defs.Order
}
export interface GetInventoryParam {}
export interface GetOrderByIdParam {
  /** @description ID of pet that needs to be fetched */
  orderId: number
}
export interface DeleteOrderParam {
  /** @description ID of the order that needs to be deleted */
  orderId: number
}
export type PlaceOrderBody = defs.Order
export type GetInventoryBody = defs.ObjectMap<any, number>
export type GetOrderByIdBody = defs.Order
export type DeleteOrderBody = any
export type PlaceOrder = (body: PlaceOrderParam['body']) => Promise<PlaceOrderBody>

export type GetInventory = () => Promise<GetInventoryBody>

export type GetOrderById = (orderId: GetOrderByIdParam['orderId']) => Promise<GetOrderByIdBody>

export type DeleteOrder = (orderId: DeleteOrderParam['orderId']) => Promise<DeleteOrderBody>
