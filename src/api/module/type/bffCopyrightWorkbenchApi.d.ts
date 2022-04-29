import { IResponse } from '../../services/type'

/** @description 通用返回使用响应体 */
export interface GetPageTransactionManagementListUsingResponse {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: List[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 分页数据-子类型 */
export interface List {
  /** @description id */
  bid: number
  /** @description 品牌方合同ID */
  brandContractId: number
  /** @description 品牌名称 */
  brandName: string
  /** @description 交易金额 */
  businessAmount: string
  /** @description 电子合同文件 */
  businessContractFile: string
  /** @description 交易状态：0-未开始，1-进行中，2-已过期，3-已终止 */
  businessStatus: number
  /** @description 版权方主键ID */
  cid: number
  /** @description 电子合同文件 */
  contractFile: string
  /** @description 合作类型：1-买断，2-保底授权金，3-授权金+流水分成 */
  cooperationType: string
  /** @description 版权方名称 */
  copyrightName: string
  /** @description IP关联ID */
  ipId: number
  /** @description 意向ip */
  ipName: string
  /** @description 合作（品牌）方公司ID（预留） */
  partyCompanyId: string
  /** @description 合作（品牌）方公司名称 */
  partyCompanyName: string
  /** @description 付款方式 */
  payMethod: string
  /** @description 合同有效期结束日期 */
  validEndDate: string
  /** @description 合同有效期开始日期 */
  validStartDate: string
}

/** @description B1版权方-交易管理-交易管理查询列表 请求参数 */
export interface GetPageTransactionManagementListUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
}

/** @description 通用返回使用响应体 */
export interface SaveTransactionManagementUsingResponse {
}

/** @description B2版权方-交易管理-新增/修改交易 请求参数 */
export interface SaveTransactionManagementUsingParams {
  /** @description 自增主键id */
  bid: number
  /** @description 品牌方合同ID */
  brandContractId: number
  /** @description 品牌名称 */
  brandName: string
  /** @description 交易金额 */
  businessAmount: string
  /** @description 电子合同文件 */
  businessContractFile: string
  /** @description 交易状态：0-未开始，1-进行中，2-已过期，3-已终止 */
  businessStatus: number
  /** @description 版权方主键ID */
  cid: number
  /** @description 电子合同文件 */
  contractFile: string
  /** @description 合作类型：1-买断，2-保底授权金，3-授权金+流水分成 */
  cooperationType: string
  /** @description IP关联ID */
  ipId: number
  /** @description 合作（品牌）方公司ID（预留） */
  partyCompanyId: string
  /** @description 合作（品牌）方公司名称 */
  partyCompanyName: string
  /** @description 付款方式 */
  payMethod: string
  /** @description 合同有效期结束日期 */
  validEndDate: string
  /** @description 合同有效期开始日期 */
  validStartDate: string
}

/** @description 通用返回使用响应体 */
export interface GetCooperationTypeUsingResponse {
}

/** @description 通用返回使用响应体 */
export interface GetCopyrightListUsingResponse extends GetCooperationTypeUsingResponse {
}

/** @description 通用返回使用响应体 */
export interface GetPageCopyrightContractListUsingResponse {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: List_1[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 分页数据-子类型 */
export interface List_1 {
  /** @description 版权方主键ID */
  cid: number
  /** @description 电子合同文件 */
  contractFile: string
  /** @description 合同名称 */
  contractName: string
  /** @description 合同编号 */
  contractNo: string
  /** @description 合同状态：0-未开始，1-进行中，2-已过期，3-已终止 */
  contractStatus: number
  /** @description 合作类型：1-买断，2-保底授权金，3-授权金+流水分成 */
  cooperationType: string
  /** @description 版权方名称 */
  copyrightName: string
  /** @description 创建人 */
  createBy: string
  /** @description 创建时间 */
  createTime: string
  /** @description IP关联ID */
  ipId: number
  /** @description IP名称 */
  ipName: string
  /** @description 合作乙方公司ID（预留） */
  partyCompanyId: string
  /** @description 合作乙方公司名称 */
  partyCompanyName: string
  /** @description id */
  tid: number
  /** @description 修改人 */
  updateBy: string
  /** @description 修改时间 */
  updateTime: string
  /** @description 合同有效期结束日期 */
  validEndDate: string
  /** @description 合同有效期开始日期 */
  validStartDate: string
}

/** @description B1版权方-合同管理-合同分页查询列表 请求参数 */
export interface GetPageCopyrightContractListUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 合同名称 */
  contractName?: string
  /** @description 版权方名称 */
  copyrightName?: string
  /** @description 结束时间 */
  endTime?: string
  ipName?: string
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
  /** @description 开始时间 */
  startTime?: string
}

/** @description 通用返回使用响应体 */
export interface SaveContractUsingResponse {
  /** @description 版权方主键ID */
  cid: number
  /** @description 电子合同文件 */
  contractFile: string
  /** @description 合同名称 */
  contractName: string
  /** @description 合同编号 */
  contractNo: string
  /** @description 合同状态：0-未开始，1-进行中，2-已过期，3-已终止 */
  contractStatus: number
  /** @description 合作类型：1-买断，2-保底授权金，3-授权金+流水分成 */
  cooperationType: string
  /** @description 创建人 */
  createBy: string
  /** @description 创建时间 */
  createTime: string
  /** @description IP关联ID */
  ipId: number
  /** @description 合作乙方公司ID（预留） */
  partyCompanyId: string
  /** @description 合作乙方公司名称 */
  partyCompanyName: string
  /** @description id */
  tid: number
  /** @description 修改人 */
  updateBy: string
  /** @description 修改时间 */
  updateTime: string
  /** @description 合同有效期结束日期 */
  validEndDate: string
  /** @description 合同有效期开始日期 */
  validStartDate: string
}

/** @description B2版权方-合同管理-新增/修改合同 请求参数 */
export interface SaveContractUsingParams {
  /** @description 版权方主键ID */
  cid: number
  /** @description 电子合同文件 */
  contractFile: string
  /** @description 合同名称 */
  contractName: string
  /** @description 合作类型：1-买断，2-保底授权金，3-授权金+流水分成 */
  cooperationType: string
  /** @description IP关联ID */
  ipId: number
  /** @description 合作乙方公司ID（预留） */
  partyCompanyId: string
  /** @description 合作乙方公司名称 */
  partyCompanyName: string
  /** @description 自增主键id */
  tid: number
  /** @description 合同有效期结束日期 */
  validEndDate: string
  /** @description 合同有效期开始日期 */
  validStartDate: string
}

/** @description B2版权方-合同管理-停止合同 请求参数 */
export interface GetStopContractUsingParams {
  /** @description 合同Id */
  id?: number
}

/** @description 通用返回使用响应体 */
export interface SelectListUsingResponse {
  /** @description 版权方主键ID */
  cid: string
  /** @description 商户名称 */
  merchantName: string
}

/** @description 通用返回使用响应体 */
export interface GetSingleDetailUsingResponse {
  /** @description 版权方主键ID */
  cid: string
  /** @description 商户名称 */
  merchantName: string
}

/** @description 版权方-简要信息 请求参数 */
export interface GetSingleDetailUsingParams {
  /** @description cid */
  cid: string
}

/** @description IP申请审核执行操作 请求参数 */
export interface PostIpApproveUsingParams {
  /** @description 处理内容 */
  dealContext: string
  /** @description 处理结果：pass-通过，failed-驳回 */
  dealResult: string
  /** @description IP的ID */
  ipId: string
  /** @description 任务ID */
  taskId: string
}

/** @description IP删除申请操作 请求参数 */
export interface PostIpDeleteUsingParams {
  /** @description ipId */
  ipId: number
}

/** @description 通用返回使用响应体 */
export interface GetIpBaseDetailUsingResponse {
  /** @description IP基础数据信息 */
  baseInfo: BaseInfo
  /** @description IP图片集合 */
  ipImgList: IpImgList[]
  /** @description 资质文件集合 */
  qualificationsFiles: QualificationsFiles[]
  /** @description 申请任务记录 */
  taskRecord: TaskRecord
}

/** @description IP基础数据信息-子类型 */
export interface BaseInfo {
  /** @description 审核说明 */
  approveDesc: string
  /** @description 审核状态：0-待审核（默认），1-审核中，2-审核通过，3-审核驳回 */
  approveStatus: string
  approveStatusLabel: string
  /** @description 授权结束日期 */
  authEndDate: string
  /** @description 授权书上传状态：0-未上传（默认），1-已上传 */
  authFileStatus: string
  authFileStatusLabel: string
  /** @description 授权地区 */
  authLocation: string
  /** @description 授权性质:0-非独家授权,1-可转授权 */
  authNature: string
  authNatureLabel: string
  /** @description 授权证明书文件地址 */
  authProveFile: string
  /** @description 授权范围:0-其它,1-衍生品授权,2-联名商品授权,3-线下空间授权 */
  authRange: string
  /** @description 授权范围输入值 */
  authRangeInput: string
  authRangeLabel: string
  /** @description 授权开始日期 */
  authStartDate: string
  /** @description 归属平台 */
  belongTo: string
  /** @description 版权方主键ID */
  cid: string
  /** @description 合作说明 */
  cooperationDesc: string
  /** @description 合作方向 */
  cooperationDirection: string
  /** @description IP分析 */
  cooperationIpAnalysis: string
  /** @description IP评估 */
  cooperationIpAssessment: string
  /** @description 备注 */
  cooperationRemark: string
  /** @description 版权方名称 */
  copyRightName: string
  /** @description 创建时间 */
  createTime: string
  deleteStatus: string
  /** @description IP别名 */
  ipAlias: string
  /** @description IP描述 */
  ipDesc: string
  /** @description 主键ID */
  ipId: string
  /** @description IP名称 */
  ipName: string
  /** @description IP类型：游戏,明星，动漫.... */
  ipType: string
  /** @description IP类型：游戏,明星，动漫.... */
  ipTypeLabel: string
  operateBatchNo: string
  /** @description 归属平台链接地址 */
  platUrl: string
  /** @description 资质类型:1-IP创造者,2-IP代运营者 */
  qualificationsType: string
  qualificationsTypeLabel: string
}

/** @description IP图片集合-子类型 */
export interface IpImgList {
  /** @description 图片关系表主键 */
  imgId: string
  /** @description IP图片地址 */
  imgUrl: string
  /** @description 版权方IP关联信息表 */
  ipId: string
}

/** @description 资质文件集合-子类型 */
export interface QualificationsFiles {
  /** @description 资质文件地址 */
  fileUrl: string
  /** @description IP关联ID */
  ipId: string
  /** @description 资质文件表主键ID */
  qid: string
}

/** @description 申请任务记录-子类型 */
export interface TaskRecord {
  /** @description 申请时间 */
  approveDate: string
  /** @description 申请类型：create-新增提交申请，edit-编辑提交申请，delete-删除申请 */
  approveType: string
  /** @description 业务ID */
  businessId: string
  /** @description 业务类型：[ip:申请,contract:合同申请...] */
  businessType: string
  /** @description 处理内容 */
  dealContext: string
  /** @description 处理时间 */
  dealDate: string
  /** @description 受理方：copyright:版权方，manager:平台方，brand-品牌方 */
  dealPlat: string
  /** @description 处理结果：pass-通过，faild-驳回，revoke-撤销 */
  dealResult: string
  /** @description 受理人 */
  dealUser: string
  /** @description 提交内容 */
  submitContext: string
  /** @description 申请平台：copyright:版权方，manager:平台方,brand-品牌方 */
  submitPlat: string
  /** @description 申请人 */
  submitUser: string
  /** @description 自增主键id */
  taskId: string
  /** @description 任务状态：0-未处理，1-已处理，2-撤销 */
  taskStatus: string
}

/** @description IP信息详情API 请求参数 */
export interface GetIpBaseDetailUsingParams {
  /** @description ipId */
  ipId: string
}

/** @description 通用返回使用响应体 */
export interface GetIpListUsingResponse {
}

/** @description 分页数据-子类型 */
export interface List_2 {
  /** @description IP资源基础数据 */
  base: BaseInfo
  /** @description IP图片列表 */
  imgList: IpImgList[]
}

/** @description IP列表筛选API 请求参数 */
export interface GetIpListUsingParams {
  /** @description 审核状态：0-待审核，1-审核中，2-审核通过，3-审核驳回 */
  approveStatus?: string
  /** @description 授权结束日期 */
  authEndDate?: string
  /** @description 授权性质:0-非独家授权,1-可转授权 */
  authNature?: string
  /** @description 授权范围:0-其它,1-衍生品授权,2-联名商品授权,3-线下空间授权 */
  authRange?: string
  /** @description 授权开始日期 */
  authStartDate?: string
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description IP别名 */
  ipAlias?: string
  /** @description IP名称 */
  ipName?: string
  /** @description 版权方名称/商户名称 */
  merchantName?: string
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
}

/** @description IP申请撤销操作 请求参数 */
export interface PostIpRevokeUsingParams {
  /** @description ipId */
  ipId: number
}

/** @description 修改记录数据  PS:新增IP时无需传参。修改编辑时,必须记录修改数据-子类型 */
export interface BatchRecord {
  /** @description 内容 例如:IP名称由“猫妖的诱惑”修改为“猫妖的诱惑2 
 IP类型由“动漫”改为“生活” */
  content: string
}

/** @description IP图片集合-子类型 */
export interface IpImgList_1 {
  /** @description 图片关系表主键ID */
  imgId: string
  /** @description IP图片地址 */
  imgUrl: string
  /** @description 版权方IP关联信息表 */
  ipId: string
}

/** @description IP信息保存API 请求参数 */
export interface PostIpBaseSaveUsingParams {
  /** @description 保存类型：save-暂存,create-初次审核提交，edit-修改审核提交 */
  approveType: string
  /** @description IP基础数据信息 */
  baseInfo: BaseInfo
  /** @description 修改记录数据  PS:新增IP时无需传参。修改编辑时,必须记录修改数据 */
  batchRecord: BatchRecord
  /** @description IP图片集合 */
  ipImgList: IpImgList_1[]
  /** @description 资质文件集合 */
  qualificationsFiles: QualificationsFiles[]
}

/** @description 通用返回使用响应体 */
export interface GetIpSelectListUsingResponse extends GetIpListUsingResponse {
}

/** @description IP资源选择列表 请求参数 */
export interface GetIpSelectListUsingParams {
  /** @description 授权结束日期 */
  authEndDate?: string
  /** @description 授权性质:0-非独家授权,1-可转授权 */
  authNature?: string
  /** @description 授权范围:0-其它,1-衍生品授权,2-联名商品授权,3-线下空间授权 */
  authRange?: string
  /** @description 授权开始日期 */
  authStartDate?: string
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description IP别名 */
  ipAlias?: string
  /** @description IP名称 */
  ipName?: string
  /** @description 版权方名称/商户名称 */
  merchantName?: string
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
}

/** @description 通用返回使用响应体 */
export interface GetIpSingleBaseInfoUsingResponse {
  /** @description IP资源基础数据 */
  base: BaseInfo
  /** @description IP图片列表 */
  imgList: IpImgList[]
}

/** @description IP资源明细请求接口，不包含图片资源 请求参数 */
export interface GetIpSingleBaseInfoUsingParams {
  /** @description ipId */
  ipId: string
}

/** @description 通用返回使用响应体 */
export interface GetMyMessageListUsingResponse {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: List_3[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 分页数据-子类型 */
export interface List_3 {
  /** @description 内容 */
  content: string
  /** @description 消息时间 */
  createTime: string
  /** @description 是否已读:0-未读，1-已读 */
  isRead: string
  /** @description ID */
  msgId: string
  /** @description 关联内容ID */
  sourceId: string
  /** @description 关联内容类型:1-IP管理,2-合同管理,3-交易管理,4-交互管理-审核管理,5-交互管理-素材库 */
  sourceType: number
  /** @description 目标对象：copyright-版权方，brand-品牌方 */
  targetType: string
  /** @description 标题 */
  title: string
}

/** @description 登录版权方/品牌方加载我的消息列表 请求参数 */
export interface GetMyMessageListUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 内容 */
  content?: string
  /** @description 是否已读:0-未读，1-已读 */
  isRead?: string
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
  /** @description 目标对象ID */
  targetId?: string
  /** @description 目标对象：copyright-版权方，brand-品牌方 */
  targetType?: string
  /** @description 标题 */
  title?: string
}

/** @description 通用返回使用响应体 */
export interface GetMyNewMessageCountUsingResponse {
}

/** @description 登录版权方/品牌方我的未读消息数量 请求参数 */
export interface GetMyNewMessageCountUsingParams {
  /** @description 目标对象：copyright-版权方，brand-品牌方 */
  targetType: string
}

/** @description 登录版权方/品牌方已读/批量已读我的消息 请求参数 */
export interface PostReadMyMessageUsingParams {
  /** @description 消息ID集合 */
  msgIds: string[]
  /** @description 目标对象：copyright-版权方，brand-品牌方 */
  targetType: string
}

/** @description 业务输出推送消息 请求参数 */
export interface SendMessageUsingParams {
  /** @description 内容 */
  content: string
  /** @description 消息输出人 */
  sendFrom?: string
  /** @description 关联内容ID */
  sourceId?: string
  /** @description 关联内容类型:1-IP管理,2-合同管理,3-交易管理,4-交互管理-审核管理,5-交互管理-素材库 */
  sourceType?: number
  /** @description 目标对象ID */
  targetId: string
  /** @description 目标对象：copyright-版权方，brand-品牌方 */
  targetType: string
  /** @description 标题 */
  title?: string
}

/** @id pageTransactionManagementListUsingGET */
export type GetPageTransactionManagementListUsing = <T = GetPageTransactionManagementListUsingResponse>(params: GetPageTransactionManagementListUsingParams) => Promise<T>
/** @id saveTransactionManagementUsingPOST */
export type SaveTransactionManagementUsing = <T = any>(params: SaveTransactionManagementUsingParams) => Promise<T>
/** @id getCooperationTypeUsingGET */
export type GetCooperationTypeUsing = <T = GetCooperationTypeUsingResponse>() => Promise<T>
/** @id getCopyrightListUsingGET */
export type GetCopyrightListUsing = <T = any>() => Promise<T>
/** @id pageCopyrightContractListUsingGET */
export type GetPageCopyrightContractListUsing = <T = GetPageCopyrightContractListUsingResponse>(params: GetPageCopyrightContractListUsingParams) => Promise<T>
/** @id saveContractUsingPOST */
export type SaveContractUsing = <T = SaveContractUsingResponse>(params: SaveContractUsingParams) => Promise<T>
/** @id stopContractUsingGET */
export type GetStopContractUsing = <T = any>(params: GetStopContractUsingParams) => Promise<T>
/** @id selectListUsingGET */
export type SelectListUsing = <T = SelectListUsingResponse>() => Promise<T>
/** @id singleDetailUsingGET */
export type GetSingleDetailUsing = <T = GetSingleDetailUsingResponse>(params: GetSingleDetailUsingParams) => Promise<T>
/** @id ipApproveUsingPOST */
export type PostIpApproveUsing = <T = any>(params: PostIpApproveUsingParams) => Promise<T>
/** @id ipDeleteUsingPOST */
export type PostIpDeleteUsing = <T = any>(params: PostIpDeleteUsingParams) => Promise<T>
/** @id ipBaseDetailUsingGET */
export type GetIpBaseDetailUsing = <T = GetIpBaseDetailUsingResponse>(params: GetIpBaseDetailUsingParams) => Promise<T>
/** @id getIpListUsingGET */
export type GetIpListUsing = <T = GetIpListUsingResponse>(params: GetIpListUsingParams) => Promise<T>
/** @id ipRevokeUsingPOST */
export type PostIpRevokeUsing = <T = any>(params: PostIpRevokeUsingParams) => Promise<T>
/** @id ipBaseSaveUsingPOST */
export type PostIpBaseSaveUsing = <T = any>(params: PostIpBaseSaveUsingParams) => Promise<T>
/** @id getIpSelectListUsingGET */
export type GetIpSelectListUsing = <T = any>(params: GetIpSelectListUsingParams) => Promise<T>
/** @id getIpSingleBaseInfoUsingGET */
export type GetIpSingleBaseInfoUsing = <T = GetIpSingleBaseInfoUsingResponse>(params: GetIpSingleBaseInfoUsingParams) => Promise<T>
/** @id myMessageListUsingGET */
export type GetMyMessageListUsing = <T = GetMyMessageListUsingResponse>(params: GetMyMessageListUsingParams) => Promise<T>
/** @id myNewMessageCountUsingGET */
export type GetMyNewMessageCountUsing = <T = any>(params: GetMyNewMessageCountUsingParams) => Promise<T>
/** @id readMyMessageUsingPOST */
export type PostReadMyMessageUsing = <T = any>(params: PostReadMyMessageUsingParams) => Promise<T>
/** @id sendMessageUsingPOST */
export type SendMessageUsing = <T = any>(params: SendMessageUsingParams) => Promise<T>
