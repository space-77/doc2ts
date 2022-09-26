import BaseClass from '../baseClass'
import type * as mT from '../../types/test/store'

/**
 * @description Access to Petstore orders
 */
export default class Store extends BaseClass {
  /**
   * @name testPlaceOrder
   * @description Place an order for a pet
   */
  placeOrder: mT.PlaceOrder = body => {
    const url = '/store/order'
    const config = { url, body: body, method: 'post' }
    return this.request(config)
  }

  /**
   * @name testGetInventory
   * @description Returns pet inventories by status，Returns a map of status codes to quantities
   */
  getInventory: mT.GetInventory = () => {
    const url = '/store/inventory'
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name testGetOrderById
   * @description Find purchase order by ID，For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
   */
  getOrderById: mT.GetOrderById = orderId => {
    const url = `/store/order/${orderId}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name testDeleteOrder
   * @description Delete purchase order by ID，For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
   */
  deleteOrder: mT.DeleteOrder = orderId => {
    const url = `/store/order/${orderId}`
    const config = { url, method: 'delete' }
    return this.request(config)
  }
}

export const store = new Store()
