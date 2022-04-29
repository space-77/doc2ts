
import { ApiClient } from '../services/client'
import * as mT from './type/bffCopyrightWorkbenchApi'

const basePath = '/tianyin-bff-copyright-workbench'

/**
 * @description bffCopyrightWorkbenchApi
 */
class BffCopyrightWorkbenchApi extends ApiClient {
  /**
   * @description B1版权方-交易管理-交易管理查询列表
  */
  getPageTransactionManagementListUsing: mT.GetPageTransactionManagementListUsing = params => {
    const bodyParams = ['brandName','companyName','copyrightName','endTime','intentionIpName','startTime']
    const body = this.extractParams(params, bodyParams)
    const queryParams = ['c','p']
    const query = this.extractParams(params, queryParams)
    return this.request({ url: `${basePath}/business/record/pageTransactionManagementList?${this.serialize(query)}`, params: body, method: 'get' })
  }

  /**
   * @description B2版权方-交易管理-新增/修改交易
  */
  saveTransactionManagementUsing: mT.SaveTransactionManagementUsing = params => {
    return this.request({ url: `${basePath}/business/record/saveTransactionManagement`, params })
  }

  /**
   * @description B3版权方-合同管理-获取合作方式
  */
  getCooperationTypeUsing: mT.GetCooperationTypeUsing = () => {
    return this.request({ url: `${basePath}/copyright/contract/getCooperationType` })
  }

  /**
   * @description B4版权方-合同管理-获取版权方下拉框
  */
  getCopyrightListUsing: mT.GetCopyrightListUsing = () => {
    return this.request({ url: `${basePath}/copyright/contract/getCopyrightList` })
  }

  /**
   * @description B1版权方-合同管理-合同分页查询列表
  */
  getPageCopyrightContractListUsing: mT.GetPageCopyrightContractListUsing = params => {
    return this.request({ url: `${basePath}/copyright/contract/pageCopyrightContractList?${this.serialize(params)}` })
  }

  /**
   * @description B2版权方-合同管理-新增/修改合同
  */
  saveContractUsing: mT.SaveContractUsing = params => {
    return this.request({ url: `${basePath}/copyright/contract/saveContract`, params })
  }

  /**
   * @description B2版权方-合同管理-停止合同
  */
  getStopContractUsing: mT.GetStopContractUsing = params => {
    return this.request({ url: `${basePath}/copyright/contract/stopContract?${this.serialize(params)}` })
  }

  /**
   * @description 版权方-选择列表
  */
  selectListUsing: mT.SelectListUsing = () => {
    return this.request({ url: `${basePath}/copyright/user/select/list` })
  }

  /**
   * @description 版权方-简要信息
  */
  getSingleDetailUsing: mT.GetSingleDetailUsing = ({ cid }) => {
    return this.request({ url: `${basePath}/copyright/user/single/detail/${cid}` })
  }

  /**
   * @description IP申请审核执行操作
  */
  postIpApproveUsing: mT.PostIpApproveUsing = params => {
    return this.request({ url: `${basePath}/ipbase/approve`, params })
  }

  /**
   * @description IP删除申请操作
  */
  postIpDeleteUsing: mT.PostIpDeleteUsing = ({ ipId }) => {
    return this.request({ url: `${basePath}/ipbase/delete/${ipId}`, method: 'post' })
  }

  /**
   * @description IP信息详情API
  */
  getIpBaseDetailUsing: mT.GetIpBaseDetailUsing = ({ ipId }) => {
    return this.request({ url: `${basePath}/ipbase/detail/${ipId}` })
  }

  /**
   * @description IP列表筛选API
  */
  getIpListUsing: mT.GetIpListUsing = params => {
    return this.request({ url: `${basePath}/ipbase/list?${this.serialize(params)}` })
  }

  /**
   * @description IP申请撤销操作
  */
  postIpRevokeUsing: mT.PostIpRevokeUsing = ({ ipId }) => {
    return this.request({ url: `${basePath}/ipbase/revoke/${ipId}`, method: 'post' })
  }

  /**
   * @description IP信息保存API
  */
  postIpBaseSaveUsing: mT.PostIpBaseSaveUsing = params => {
    return this.request({ url: `${basePath}/ipbase/save`, params })
  }

  /**
   * @description IP资源选择列表
  */
  getIpSelectListUsing: mT.GetIpSelectListUsing = params => {
    return this.request({ url: `${basePath}/ipbase/select/list?${this.serialize(params)}` })
  }

  /**
   * @description IP资源明细请求接口，不包含图片资源
  */
  getIpSingleBaseInfoUsing: mT.GetIpSingleBaseInfoUsing = ({ ipId }) => {
    return this.request({ url: `${basePath}/ipbase/single/detail/${ipId}` })
  }

  /**
   * @description 登录版权方/品牌方加载我的消息列表
  */
  getMyMessageListUsing: mT.GetMyMessageListUsing = params => {
    return this.request({ url: `${basePath}/message/my/list?${this.serialize(params)}` })
  }

  /**
   * @description 登录版权方/品牌方我的未读消息数量
  */
  getMyNewMessageCountUsing: mT.GetMyNewMessageCountUsing = params => {
    return this.request({ url: `${basePath}/message/my/new/count?${this.serialize(params)}` })
  }

  /**
   * @description 登录版权方/品牌方已读/批量已读我的消息
  */
  postReadMyMessageUsing: mT.PostReadMyMessageUsing = params => {
    return this.request({ url: `${basePath}/message/my/read`, params })
  }

  /**
   * @description 业务输出推送消息
  */
  sendMessageUsing: mT.SendMessageUsing = params => {
    return this.request({ url: `${basePath}/message/send`, params })
  }
}

export default new BffCopyrightWorkbenchApi()
