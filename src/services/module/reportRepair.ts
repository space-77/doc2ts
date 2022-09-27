import BaseClass from './baseClass'
import type * as mT from '../types/reportRepair'

/**
 * @description 报事报修
 */
export default class ReportRepair extends BaseClass {
  /**
   * @name addTurnoverUsingPOST
   * @description 添加报事报修
   */
  addTurnover: mT.AddTurnover = reportRepairAddBDRequestDTO => {
    const url = '/reportRepair/addReportRepair'
    const config = { url, body: reportRepairAddBDRequestDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name turnoverListUsingPOST
   * @description 报事报修列表
   */
  turnoverList: mT.TurnoverList = reportRepairListRequestDTO => {
    const url = '/reportRepair/reportRepairrList'
    const config = { url, body: reportRepairListRequestDTO, method: 'post' }
    return this.request(config)
  }
}

export const reportRepair = new ReportRepair()
