import BaseClass from './baseClass'
import * as mT from '../types/store'

/**
 * @description Access to Petstore orders
 */
export default class Store extends BaseClass {
  /**
   * @description Place an order for a pet
   */
  placeOrder: mT.PlaceOrder = body => {
    return this.request({ url: '/store/order', body, method: 'post' })
  }
  /**
   * @description Returns pet inventories by status，Returns a map of status codes to quantities
   */
  getInventory: mT.GetInventory = () => {
    return this.request({ url: '/store/inventory', method: 'get' })
  }
  /**
   * @description Find purchase order by ID，For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
   */
  getOrderById: mT.GetOrderById = params => {
    const { orderId } = params
    return this.request({ url: `/store/order/${orderId}`, method: 'get' })
  }
  /**
   * @description Delete purchase order by ID，For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
   */
  deleteOrder: mT.DeleteOrder = params => {
    const { orderId } = params
    return this.request({ url: `/store/order/${orderId}`, method: 'delete' })
  }
}

export const store = new Store()
