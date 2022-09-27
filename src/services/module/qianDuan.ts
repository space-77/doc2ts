import BaseClass from './baseClass'
import type * as mT from '../types/qianDuan'

/**
 * @description 前端查询接口
 */
export default class QianDuan extends BaseClass {
  /**
   * @name getOpenIdByUnionIdUsingPOST
   * @description 获取公众号TheUser信息根据unionID
   */
  getOpenIdByUnionId: mT.GetOpenIdByUnionId = vxPublicUserRequestDTO => {
    const url = '/qianDuan/user/getOpenIdByUnionId'
    const config = { url, body: vxPublicUserRequestDTO, method: 'post' }
    return this.request(config)
  }
}

export const qianDuan = new QianDuan()
