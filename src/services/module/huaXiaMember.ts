import BaseClass from './baseClass'
import type * as mT from '../types/huaXiaMember'

/**
 * @description 查询会员接口
 */
export default class HuaXiaMember extends BaseClass {
  /**
   * @name sendSmsUsingPOST
   * @description 发送验证码
   */
  sendSms: mT.SendSms = smsRequestDTO => {
    const url = '/member/sendSms'
    const config = { url, body: smsRequestDTO, method: 'post' }
    return this.request(config)
  }
}

export const huaXiaMember = new HuaXiaMember()
