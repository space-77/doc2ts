
import { ApiClient } from '../services/client'
import * as mT from './type/bffBrandWorkbenchApi'

const basePath = '/tianyin-bff-brand-workbench'

/**
 * @description bffBrandWorkbenchApi
 */
class BffBrandWorkbenchApi extends ApiClient {
  /**
   * @description 获取品牌方后台授权品类下拉框信息
  */
  getAuthCategoryUsing: mT.GetAuthCategoryUsing = params => {
    return this.request({ url: `${basePath}/brand/contract/authCategory`, params })
  }

  /**
   * @description 获取品牌方公司下拉列表
  */
  getBrandCompanyListUsing: mT.GetBrandCompanyListUsing = params => {
    return this.request({ url: `${basePath}/brand/contract/brandCompanyList`, params })
  }

  /**
   * @description 合同编号查询合同信息
  */
  getContractByNumUsing: mT.GetContractByNumUsing = ({ contractNum }) => {
    return this.request({ url: `${basePath}/brand/contract/contractnum/${contractNum}`, method: 'post' })
  }

  /**
   * @description 品牌方后台新增/更新品牌方合同信息
  */
  createOrUpdateBrandContractInfoUsing: mT.CreateOrUpdateBrandContractInfoUsing = params => {
    return this.request({ url: `${basePath}/brand/contract/createOrUpdate`, params })
  }

  /**
   * @description 品牌方合同详情
  */
  getBrandDetailInfoUsing: mT.GetBrandDetailInfoUsing = ({ id }) => {
    return this.request({ url: `${basePath}/brand/contract/detail/${id}` })
  }

  /**
   * @description 品牌方工作台各类型文件下载
  */
  downloadAllTypeFileUsing: mT.DownloadAllTypeFileUsing = params => {
    return this.request({ url: `${basePath}/brand/contract/download`, params })
  }

  /**
   * @description 品牌方后台资质审核
  */
  handleQualificationReviewUsing: mT.HandleQualificationReviewUsing = params => {
    return this.request({ url: `${basePath}/brand/contract/examine`, params })
  }

  /**
   * @description 获取品牌方后台/工作台合同列表信息
  */
  getBrandContractListUsing: mT.GetBrandContractListUsing = params => {
    return this.request({ url: `${basePath}/brand/contract/list`, params })
  }

  /**
   * @description 合同中止
  */
  handleSuspendContractUsing: mT.HandleSuspendContractUsing = ({ id }) => {
    return this.request({ url: `${basePath}/brand/contract/suspendContract/${id}` })
  }

  /**
   * @description 上传品牌方授权书信息
  */
  postUploadingBrandAuthorizationUsing: mT.PostUploadingBrandAuthorizationUsing = params => {
    return this.request({ url: `${basePath}/brand/contract/uploadAuthBook`, params })
  }

  /**
   * @description 品牌方工作台资质文件上传
  */
  postUploadQualificationUsing: mT.PostUploadQualificationUsing = params => {
    return this.request({ url: `${basePath}/brand/contract/uploadQualification`, params })
  }

  /**
   * @description 获取品牌方所属地区级联信息
  */
  getBrandBelongToAreaUsing: mT.GetBrandBelongToAreaUsing = params => {
    return this.request({ url: `${basePath}/brand/customer/area`, params })
  }

  /**
   * @description 更改品牌方客户账号状态
  */
  postChangeAccountStatusUsing: mT.PostChangeAccountStatusUsing = params => {
    return this.request({ url: `${basePath}/brand/customer/changeAccountStatus`, params })
  }

  /**
   * @description 查看客户详情信息
  */
  getCustomerDetailInfoUsing: mT.GetCustomerDetailInfoUsing = ({ id }) => {
    return this.request({ url: `${basePath}/brand/customer/detail/${id}` })
  }

  /**
   * @description 获取品牌方所属行业下拉框信息
  */
  getBrandBelongToIndustryUsing: mT.GetBrandBelongToIndustryUsing = () => {
    return this.request({ url: `${basePath}/brand/customer/industry` })
  }

  /**
   * @description 获取品牌方客户列表信息
  */
  getBrandCustomerListUsing: mT.GetBrandCustomerListUsing = params => {
    return this.request({ url: `${basePath}/brand/customer/list`, params })
  }

  /**
   * @description 新增/更新品牌方客户管理主数据
  */
  postNewOrUpdateCopyrightPhotosRecordUsing: mT.PostNewOrUpdateCopyrightPhotosRecordUsing = params => {
    return this.request({ url: `${basePath}/brand/customer/newOrUpdateBrandCustomerRecord`, params })
  }

  /**
   * @description B1工作台素材库下发接口
  */
  addBrandAuthorizerSourceRecordUsing: mT.AddBrandAuthorizerSourceRecordUsing = params => {
    return this.request({ url: `${basePath}/brandPlat/Record/addBrandAuthorizerSourceRecord`, params })
  }

  /**
   * @description B3工作台素材库申请接口
  */
  postApplyBrandAuthorizerSourceRecordUsing: mT.PostApplyBrandAuthorizerSourceRecordUsing = params => {
    return this.request({ url: `${basePath}/brandPlat/Record/applyBrandAuthorizerSourceRecord`, params })
  }

  /**
   * @description C2下载接口
  */
  getRecordDownloadUsing: mT.GetRecordDownloadUsing = params => {
    return this.request({ url: `${basePath}/brandPlat/Record/getRecordDownload?${this.serialize(params)}` })
  }

  /**
   * @description C1下发时间接口
  */
  getRecordTimeUsing: mT.GetRecordTimeUsing = () => {
    return this.request({ url: `${basePath}/brandPlat/Record/getRecordTime` })
  }

  /**
   * @description B2工作台-素材库-分页查询接口
  */
  getPageRecordRequestUsing: mT.GetPageRecordRequestUsing = params => {
    return this.request({ url: `${basePath}/brandPlat/Record/pageRecordRequest?${this.serialize(params)}` })
  }

  /**
   * @description B1管理台-素材库-新增接口
  */
  addPrandPlatSourceUsing: mT.AddPrandPlatSourceUsing = params => {
    return this.request({ url: `${basePath}/brandPlat/source/addPrandPlatSource`, params })
  }

  /**
   * @description C2管理台-素材管理-审核接口
  */
  getExamineBrandAuthorizerSourceRecordUsing: mT.GetExamineBrandAuthorizerSourceRecordUsing = params => {
    return this.request({ url: `${basePath}/brandPlat/source/examineBrandAuthorizerSourceRecord?${this.serialize(params)}` })
  }

  /**
   * @description B4管理台-素材库-单个查询接口
  */
  getBrandAuthorizerSourceRecordUsing: mT.GetBrandAuthorizerSourceRecordUsing = params => {
    return this.request({ url: `${basePath}/brandPlat/source/getBrandAuthorizerSourceRecord?${this.serialize(params)}` })
  }

  /**
   * @description B2管理台-素材库-列表查询接口
  */
  getPrandPlatSourceListUsing: mT.GetPrandPlatSourceListUsing = params => {
    return this.request({ url: `${basePath}/brandPlat/source/getPrandPlatSourceList?${this.serialize(params)}` })
  }

  /**
   * @description C1管理台-素材管理-分页查询接口
  */
  getPageBrandAuthorizerSourceRecordUsing: mT.GetPageBrandAuthorizerSourceRecordUsing = params => {
    return this.request({ url: `${basePath}/brandPlat/source/pageBrandAuthorizerSourceRecord?${this.serialize(params)}` })
  }

  /**
   * @description B5管理台-素材库-下发记录接口
  */
  getPageBrandRecordUsing: mT.GetPageBrandRecordUsing = params => {
    return this.request({ url: `${basePath}/brandPlat/source/pageBrandRecord?${this.serialize(params)}` })
  }

  /**
   * @description B3管理台-素材库-编辑接口
  */
  updatePrandPlatSourceUsing: mT.UpdatePrandPlatSourceUsing = params => {
    return this.request({ url: `${basePath}/brandPlat/source/updatePrandPlatSource`, params })
  }

  /**
   * @description A4-执行工单审批执行操作
  */
  postApproveWorkInfoUsing: mT.PostApproveWorkInfoUsing = params => {
    return this.request({ url: `${basePath}/delivery/approve`, params })
  }

  /**
   * @description A1-创建执行工单
  */
  createWorkOrderUsing: mT.CreateWorkOrderUsing = params => {
    return this.request({ url: `${basePath}/delivery/create`, params })
  }

  /**
   * @description A2-交互管理筛选列表
  */
  getBrandOrderInfoListUsing: mT.GetBrandOrderInfoListUsing = params => {
    return this.request({ url: `${basePath}/delivery/list?${this.serialize(params)}` })
  }

  /**
   * @description A5-上传审核文件
  */
  postUploadApproveFilesUsing: mT.PostUploadApproveFilesUsing = params => {
    return this.request({ url: `${basePath}/delivery/upload`, params })
  }

  /**
   * @description A3-执行工单详情
  */
  getWorkOrderInfoDetailUsing: mT.GetWorkOrderInfoDetailUsing = ({ bwid }) => {
    return this.request({ url: `${basePath}/delivery/view/detail/${bwid}` })
  }

  /**
   * @description A7-执行工单取消
  */
  getCancelWorkOrderUsing: mT.GetCancelWorkOrderUsing = ({ bwid }) => {
    return this.request({ url: `${basePath}/delivery/work/cancel/${bwid}` })
  }

  /**
   * @description A6-合同ID拉取工单列表
  */
  getWorkOrderInfoListByBcidUsing: mT.GetWorkOrderInfoListByBcidUsing = ({ bcid }) => {
    return this.request({ url: `${basePath}/delivery/work/list/${bcid}` })
  }

  /**
   * @description A10-下载操作记录资源文件-日志记录ID
  */
  getPackDownLogLoadUsing: mT.GetPackDownLogLoadUsing = ({ logId }) => {
    return this.request({ url: `${basePath}/delivery/work/log/down/${logId}` })
  }

  /**
   * @description A8-下载资源文件-流程节点ID
  */
  getPackDownLoadUsing: mT.GetPackDownLoadUsing = ({ processId }) => {
    return this.request({ url: `${basePath}/delivery/work/pack/down/${processId}` })
  }

  /**
   * @description A9-撤销审批请求
  */
  getRevokeProcessUsing: mT.GetRevokeProcessUsing = ({ processId }) => {
    return this.request({ url: `${basePath}/delivery/work/revoke/${processId}` })
  }
}

export default new BffBrandWorkbenchApi()
