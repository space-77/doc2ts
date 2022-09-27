import BaseClass from './baseClass'
import type * as mT from '../types/bill'

/**
 * @description Bill Controller
 */
export default class Bill extends BaseClass {
  /**
   * @name getBillUsingGET
   * @description Bill
   */
  getBill: mT.GetBill = id => {
    const url = `/bill/getBill/${id}`
    const config = { url, method: 'get' }
    return this.request(config)
  }
}

export const bill = new Bill()
