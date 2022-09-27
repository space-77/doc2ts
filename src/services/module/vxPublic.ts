import BaseClass from './baseClass'
import type * as mT from '../types/vxPublic'

/**
 * @description Vx Public Controller
 */
export default class VxPublic extends BaseClass {
  /**
   * @name getTokenUsingGET
   * @description getToken
   */
  getToken: mT.GetToken = () => {
    const url = '/getToken'
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name toCMessage1UsingPOST
   * @description toCMessage1
   */
  toCMessage1: mT.ToCMessage1 = () => {
    const url = '/toCMessage'
    const config = { url, method: 'post' }
    return this.request(config)
  }
}

export const vxPublic = new VxPublic()
