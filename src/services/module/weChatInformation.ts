import BaseClass from './baseClass'
import type * as mT from '../types/weChatInformation'

/**
 * @description VX Controller
 */
export default class WeChatInformation extends BaseClass {
  /**
   * @name loginVxUsingPOST
   * @description 授权手机号
   */
  loginVx: mT.LoginVx = mobileRequestDTO => {
    const url = '/vx/login'
    const config = { url, body: mobileRequestDTO, method: 'post' }
    return this.request(config)
  }
}

export const weChatInformation = new WeChatInformation()
