import BaseClass from './baseClass'
import type * as mT from '../types/memberInfo'

/**
 * @description 查询卷接口
 */
export default class MemberInfo extends BaseClass {
  /**
   * @name getAllCouponUsingPOST
   * @description 发卷列表及历史记录接口
   */
  getAllCoupon: mT.GetAllCoupon = memberInfoListBDRequestDTO => {
    const url = '/memberinfo/getAllCoupon'
    const config = { url, body: memberInfoListBDRequestDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name getUrlCodeUsingGET
   * @description 生成卷二维码
   */
  getUrlCode: mT.GetUrlCode = couponId => {
    const url = `/memberinfo/getCouponCode/${couponId}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name getCouponDetailUsingGET
   * @description 获取卷详情
   */
  getCouponDetail: mT.GetCouponDetail = couponId => {
    const url = `/memberinfo/getCouponDetail/${couponId}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name getCodeUsingGET
   * @description 生成劵二维码
   */
  getCode: mT.GetCode = couponId => {
    const url = `/memberinfo/getCouponDetailCode/${couponId}`
    const config = { url, method: 'get' }
    return this.request(config)
  }
}

export const memberInfo = new MemberInfo()
