import BaseClass from './baseClass'
import type * as mT from '../types/activityReport'

/**
 * @description 上报活动
 */
export default class ActivityReport extends BaseClass {
  /**
   * @name addActivityReportUsingPOST
   * @description 添加上报活动
   */
  addActivityReport: mT.AddActivityReport = reportRequest => {
    const url = '/activityReport/addActivityReport'
    const config = { url, body: reportRequest, method: 'post' }
    return this.request(config)
  }

  /**
   * @name getActivityReportListUsingPOST
   * @description 查询上报活动列表
   */
  getActivityReportList: mT.GetActivityReportList = queryRequest => {
    const url = '/activityReport/getTurnoverCalendar'
    const config = { url, body: queryRequest, method: 'post' }
    return this.request(config)
  }

  /**
   * @name tbFindMarketManagerUsingGET
   * @description 2B端查询商管接口，2B端查询商管接口
   */
  tbFindMarketManager: mT.TbFindMarketManager = () => {
    const url = '/activityReport/tbFindMarketManager'
    const config = { url, method: 'get' }
    return this.request(config)
  }
}

export const activityReport = new ActivityReport()
