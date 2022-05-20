import { Order } from './type'
type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value
}

export type PlaceOrderParam = {
  /** @description order placed for purchasing the pet*/
  body: Order
}
export type GetInventoryParam = {}
export type GetOrderByIdParam = {
  /** @description ID of pet that needs to be fetched*/
  orderId: number
}
export type DeleteOrderParam = {
  /** @description ID of the order that needs to be deleted*/
  orderId: number
}
export type PlaceOrderBody = Order
export type GetInventoryBody = ObjectMap<any>
export type GetOrderByIdBody = Order
export type DeleteOrderBody = any
type PlaceOrderResponse = Promise<PlaceOrderBody>
type GetInventoryResponse = Promise<GetInventoryBody>
type GetOrderByIdResponse = Promise<GetOrderByIdBody>
type DeleteOrderResponse = Promise<DeleteOrderBody>
export type PlaceOrder = (params: PlaceOrderParam) => PlaceOrderResponse

export type GetInventory = (params: GetInventoryParam) => GetInventoryResponse

export type GetOrderById = (params: GetOrderByIdParam) => GetOrderByIdResponse

export type DeleteOrder = (params: DeleteOrderParam) => DeleteOrderResponse
