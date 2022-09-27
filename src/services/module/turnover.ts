import BaseClass from './baseClass'
import type * as mT from '../types/turnover'

/**
 * @description 上缴营业额
 */
export default class Turnover extends BaseClass {
  /**
   * @name addTurnoverUsingPOST_1
   * @description 添加营业额
   */
  addTurnover: mT.AddTurnover = turnoverRequestDTO => {
    const url = '/turnover/addTurnover'
    const config = { url, body: turnoverRequestDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name turnoverListUsingPOST_1
   * @description TurnoverList
   */
  turnoverList: mT.TurnoverList = turnoverDaysRequestBDDTO => {
    const url = '/turnover/turnoverList'
    const config = { url, body: turnoverDaysRequestBDDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name getAdjustInfoUsingPOST
   * @description 营业额修改记录列表
   */
  getAdjustInfo: mT.GetAdjustInfo = turnoverAdjustInfoRequestDTO => {
    const url = '/turnover/getAdjustInfo'
    const config = { url, body: turnoverAdjustInfoRequestDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name getTurnoverCalendarUsingPOST
   * @description TurnoverCalendar
   */
  getTurnoverCalendar: mT.GetTurnoverCalendar = turnoverCalendarRequestBDDTO => {
    const url = '/turnover/getTurnoverCalendar'
    const config = { url, body: turnoverCalendarRequestBDDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name getTurnoverCompareoUsingPOST
   * @description TurnoverContrast
   */
  getTurnoverCompareo: mT.GetTurnoverCompareo = turnoverCompareoInfoRequestBDDTO => {
    const url = '/turnover/getTurnoverCompareo'
    const config = { url, body: turnoverCompareoInfoRequestBDDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name getTurnoverCountListUsingPOST
   * @description 营业额时间和类型对比
   */
  getTurnoverCountList: mT.GetTurnoverCountList = turnoverCountRequestBDDTO => {
    const url = '/turnover/getTurnoverCountList'
    const config = { url, body: turnoverCountRequestBDDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name getTurnoverCountList1UsingPOST
   * @description TurnoverList2
   */
  getTurnoverCountList1: mT.GetTurnoverCountList1 = turnoverMothListDTO => {
    const url = '/turnover/getTurnoverCountList2'
    const config = { url, body: turnoverMothListDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name getCouponDetailUsingGET_1
   * @description TurnoverCalendar查询未上传的TurnoverList
   */
  getCouponDetail: mT.GetCouponDetail = date => {
    const url = `/turnover/getNotDayTurnover/${date}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name getTurnoverCountListByTopUsingPOST
   * @description 营业额时间和类型对比TOP
   */
  getTurnoverCountListByTop: mT.GetTurnoverCountListByTop = turnoverCountRequestBDDTO => {
    const url = '/turnover/getTurnoverCountListByTop'
    const config = { url, body: turnoverCountRequestBDDTO, method: 'post' }
    return this.request(config)
  }
}

export const turnover = new Turnover()
