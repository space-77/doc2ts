import { IResponse } from '../../services/type'

/** @description 通用返回使用响应体 */
export interface GetAuthCategoryUsingResponse {
  /** @description 下拉数据key值 */
  code: object
  /** @description 下拉数据key值 */
  name: string
}

/** @description 获取品牌方后台授权品类下拉框信息 请求参数 */
export interface GetAuthCategoryUsingParams {
  /**
   * @example 获取一级品类下拉列表时传空
   * @description 不同级授权品类编码
   */
  code: string
}

/** @description 通用返回使用响应体 */
export interface GetBrandCompanyListUsingResponse {
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
  /** @description 品牌方公司名称 */
  brandCompanyName: string
  /** @description 创建时间 */
  createTime: string
  /** @description id */
  id: number
  /** @description 更新时间 */
  updateTime: string
}

/** @description 获取品牌方公司下拉列表 请求参数 */
export interface GetBrandCompanyListUsingParams {
  /** @description 品牌方公司名称 */
  brandCompanyName: string
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c: number
  /**
   * @example 1
   * @description 当前页
   */
  p: number
}

/** @description 通用返回使用响应体 */
export interface GetContractByNumUsingResponse {
  /** @description 合同ID */
  bcid: string
  /** @description 品牌方名称 */
  brandName: string
  /** @description 品牌方ID */
  buid: string
  /** @description 合同编号 */
  contractNum: string
  /** @description IPID */
  ipId: string
}

/** @description 合同编号查询合同信息 请求参数 */
export interface GetContractByNumUsingParams {
  /** @description contractNum */
  contractNum: string
}

/** @description 通用返回使用响应体 */
export interface CreateOrUpdateBrandContractInfoUsingResponse {
}

/** @description 品牌方后台新增/更新品牌方合同信息 请求参数 */
export interface CreateOrUpdateBrandContractInfoUsingParams {
  /** @description 代理商联系方式(有代理商时必填) */
  agentContact: string
  /** @description 代理商名称(有代理商时必填) */
  agentName: string
  /** @description 审批意见 */
  approveContent?: string
  /** @description 授权书状态 */
  authBookStatus?: number
  /** @description 授权书状态名称 */
  authBookStatusName?: string
  /** @description 授权书文件路径 */
  authBookUrl?: string
  /** @description 授权分类编码 */
  authCode?: string
  /** @description 授权结束时间 */
  authEndDate: string
  /** @description 授权开始时间 */
  authStartDate: string
  /** @description 品牌名称 */
  brandName: string
  /** @description 品牌方公司名称 */
  companyBrandName: string
  /** @description 品牌方公司编码 */
  companyBrandNameCode: string
  /** @description 合同编号 */
  contractNum?: string
  /** @description 合同状态 */
  contractStatus?: number
  /** @description 合同状态名 */
  contractStatusName?: string
  /** @description 数据创建人 */
  createBy?: string
  /** @description 数据创建时间 */
  createTime?: string
  /**
   * @example 0 无 1有
   * @description 是否有代理商
   */
  haveAgent: number
  /** @description 品牌方合同信息主数据id(新增时不需要 更新时带上) */
  id: number
  /** @description 主合同文件路径 */
  mainContractUrl: string
  /**
   * @example 0 不需要 1需要
   * @description 是否需要资质
   */
  needQualifications: number
  /** @description 资质说明 */
  qualificationExplain: string
  /** @description 资质审核状态 */
  qualificationsStatus?: number
  /** @description 资质审核状态名称 */
  qualificationsStatusName?: string
  /** @description 资质文件路径 */
  qualificationsUrl?: string
  /** @description 关联ip编码 */
  relationIpCode: string
  /** @description 关联ip名称 */
  relationIpName: string
  /**
   * @example 0 ip 1 其他
   * @description 服务类型编号
   */
  serviceCode: number
  /** @description 服务类型名称 */
  serviceName: string
  /** @description 合同签订日期 */
  signDate: string
  /** @description 补充合同路径 */
  supplementContractUrl: string
  /** @description 数据更新人 */
  updateBy?: string
  /** @description 数据更新时间 */
  updateTime?: string
  /** @description 工单创建状态 */
  workOrderStatus?: number
}

/** @description 通用返回使用响应体 */
export interface GetBrandDetailInfoUsingResponse {
  /** @description 代理商联系方式(有代理商时必填) */
  agentContact: string
  /** @description 代理商名称(有代理商时必填) */
  agentName: string
  /** @description 审批意见 */
  approveContent: string
  /** @description 授权书状态 */
  authBookStatus: number
  /** @description 授权书状态名称 */
  authBookStatusName: string
  /** @description 授权书文件路径 */
  authBookUrl: string
  /** @description 授权分类编码 */
  authCode: string
  /** @description 授权结束时间 */
  authEndDate: string
  /** @description 授权开始时间 */
  authStartDate: string
  /** @description 品牌名称 */
  brandName: string
  /** @description 品牌方公司名称 */
  companyBrandName: string
  /** @description 品牌方公司编码 */
  companyBrandNameCode: string
  /** @description 合同编号 */
  contractNum: string
  /** @description 合同状态 */
  contractStatus: number
  /** @description 合同状态名 */
  contractStatusName: string
  /** @description 数据创建人 */
  createBy: string
  /** @description 数据创建时间 */
  createTime: string
  /**
   * @example 0 无 1有
   * @description 是否有代理商
   */
  haveAgent: number
  /** @description 品牌方合同信息主数据id(新增时不需要 更新时带上) */
  id: number
  /** @description 主合同文件路径 */
  mainContractUrl: string
  /**
   * @example 0 不需要 1需要
   * @description 是否需要资质
   */
  needQualifications: number
  /** @description 资质说明 */
  qualificationExplain: string
  /** @description 资质审核状态 */
  qualificationsStatus: number
  /** @description 资质审核状态名称 */
  qualificationsStatusName: string
  /** @description 资质文件路径 */
  qualificationsUrl: string
  /** @description 关联ip编码 */
  relationIpCode: string
  /** @description 关联ip名称 */
  relationIpName: string
  /**
   * @example 0 ip 1 其他
   * @description 服务类型编号
   */
  serviceCode: number
  /** @description 服务类型名称 */
  serviceName: string
  /** @description 合同签订日期 */
  signDate: string
  /** @description 补充合同路径 */
  supplementContractUrl: string
  /** @description 数据更新人 */
  updateBy: string
  /** @description 数据更新时间 */
  updateTime: string
  /**
   * @example 0 未创建过工单 1 已创建过工单
   * @description 工单创建状态
   */
  workOrderStatus: number
}

/** @description 品牌方合同详情 请求参数 */
export interface GetBrandDetailInfoUsingParams {
  /** @description id */
  id: string
}

/** @description 品牌方工作台各类型文件下载 请求参数 */
export interface DownloadAllTypeFileUsingParams {
  /**
   * @example 0授权书下载 1补充合同下载 2主合同下载 3资质文件下载
   * @description 下载文件类型
   */
  downLoadType: number
  /** @description 记录编号 */
  id: number
}

/** @description 品牌方后台资质审核 请求参数 */
export interface HandleQualificationReviewUsingParams {
  /** @description 审批说明 */
  approveContent: string
  /** @description 记录编号 */
  id: number
  /**
   * @example 3审核驳回 4审核通过
   * @description 资质审核状态
   */
  qualificationsStatus: number
}

/** @description 通用返回使用响应体 */
export interface GetBrandContractListUsingResponse {
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
  /** @description 代理商联系方式(有代理商时必填) */
  agentContact: string
  /** @description 代理商名称(有代理商时必填) */
  agentName: string
  /** @description 审批意见 */
  approveContent: string
  /** @description 授权书状态 */
  authBookStatus: number
  /** @description 授权书状态名称 */
  authBookStatusName: string
  /** @description 授权书文件路径 */
  authBookUrl: string
  /** @description 授权分类编码 */
  authCode: string
  /** @description 授权结束时间 */
  authEndDate: string
  /** @description 授权开始时间 */
  authStartDate: string
  /** @description 品牌名称 */
  brandName: string
  /** @description 品牌方公司名称 */
  companyBrandName: string
  /** @description 品牌方公司编码 */
  companyBrandNameCode: string
  /** @description 合同编号 */
  contractNum: string
  /** @description 合同状态 */
  contractStatus: number
  /** @description 合同状态名 */
  contractStatusName: string
  /** @description 数据创建人 */
  createBy: string
  /** @description 数据创建时间 */
  createTime: string
  /**
   * @example 0 无 1有
   * @description 是否有代理商
   */
  haveAgent: number
  /** @description 品牌方合同信息主数据id(新增时不需要 更新时带上) */
  id: number
  /** @description 主合同文件路径 */
  mainContractUrl: string
  /**
   * @example 0 不需要 1需要
   * @description 是否需要资质
   */
  needQualifications: number
  /** @description 资质说明 */
  qualificationExplain: string
  /** @description 资质审核状态 */
  qualificationsStatus: number
  /** @description 资质审核状态名称 */
  qualificationsStatusName: string
  /** @description 资质文件路径 */
  qualificationsUrl: string
  /** @description 关联ip编码 */
  relationIpCode: string
  /** @description 关联ip名称 */
  relationIpName: string
  /**
   * @example 0 ip 1 其他
   * @description 服务类型编号
   */
  serviceCode: number
  /** @description 服务类型名称 */
  serviceName: string
  /** @description 合同签订日期 */
  signDate: string
  /** @description 补充合同路径 */
  supplementContractUrl: string
  /** @description 数据更新人 */
  updateBy: string
  /** @description 数据更新时间 */
  updateTime: string
  /**
   * @example 0 未创建过工单 1 已创建过工单
   * @description 工单创建状态
   */
  workOrderStatus: number
}

/** @description 获取品牌方后台/工作台合同列表信息 请求参数 */
export interface GetBrandContractListUsingParams {
  /**
   * @example 0待上传 1已下发
   * @description 授权书状态
   */
  authBookStatus: number
  /** @description 授权有效期结束时间 */
  authEndDate: string
  /** @description 授权有效期开始时间 */
  authStartDate: string
  /** @description 品牌方公司名称 */
  brandCompanyName: string
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c: number
  /** @description 合同编号 */
  contractNum: string
  /**
   * @example 1已签订 2已过期 3 已中止
   * @description 合同状态
   */
  contractStatus: number
  /** @description id */
  id: number
  /**
   * @example 1
   * @description 当前页
   */
  p: number
  /**
   * @example 1待上传 2待审核 3审核驳回 4审核通过
   * @description 资质审核状态
   */
  qualificationsStatus: number
  /** @description 品牌方列表查询标识 1 工作台 */
  type: number
}

/** @description 合同中止 请求参数 */
export interface HandleSuspendContractUsingParams {
  /** @description id */
  id: string
}

/** @description 上传品牌方授权书信息 请求参数 */
export interface PostUploadingBrandAuthorizationUsingParams {
  /** @description 授权书文件路径 */
  authBookUrl: string
  /** @description 授权品类集 */
  authCategoryList: any[]
  /** @description 记录编号 */
  id: number
}

/** @description 品牌方工作台资质文件上传 请求参数 */
export interface PostUploadQualificationUsingParams {
  /** @description 记录编号 */
  id: number
  /** @description 资质文件路径 */
  qualificationsUrl: string
}

/** @description 通用返回使用响应体 */
export interface GetBrandBelongToAreaUsingResponse {
  code: object
  name: string
}

/** @description 获取品牌方所属地区级联信息 请求参数 */
export interface GetBrandBelongToAreaUsingParams {
  /**
   * @example 获取省市的时候传空
   * @description 区域对应的编码信息
   */
  code: string
}

/** @description 更改品牌方客户账号状态 请求参数 */
export interface PostChangeAccountStatusUsingParams {
  /** @description 账号更改状态 */
  accountStatus: number
  /** @description 品牌方客户信息记录id */
  id: number
}

/** @description 通用返回使用响应体 */
export interface GetCustomerDetailInfoUsingResponse {
  /** @description 开户行名称 */
  bankName: string
  /** @description 开户银行账号 */
  bankNum: string
  /** @description 公司所属地区编码 */
  belongToAreaCode: string
  /** @description 公司所属地区名称 */
  belongToAreaName: string
  /** @description 公司所属行业编码 */
  belongToIndustryCode: number
  /** @description 公司所属行业名称 */
  belongToIndustryName: string
  /** @description 品牌方公司名称 */
  brandCompanyName: string
  /** @description 营业执照路径 为空则为未上传 不为空则是已上传 */
  businessLicenseUrl: string
  /** @description 单位地址 */
  companyAddress: string
  /** @description 公司电话 */
  companyPhone: string
  /** @description 联系人姓名 */
  contactUser: string
  /** @description 合作内容 */
  cooperationType: string
  /** @description 数据创建人(登录用户名) */
  createBy: string
  /** @description 数据创建时间 */
  createTime: string
  /** @description 数据删除状态标识 0 未删除 1删除 */
  deleteStatus: number
  /** @description 品牌方客户信息记录id */
  id: number
  /** @description 开票名称 */
  invoiceName: string
  /** @description 法人身份证号 */
  legalPersonIdCode: string
  /** @description 法人名称 */
  legalPersonName: string
  /** @description 法人手机号 */
  legalPersonPhone: string
  /** @description 联系人电话 */
  loginPhone: string
  /** @description 对接人名称 */
  oppositePersonName: string
  /** @description 资质文件路径 为空则为未上传 不为空则是已上传 */
  qualificationsUrl: string
  /** @description 税号 */
  raxNum: string
  /** @description 统一社会信用代码 */
  uniteCreditCode: string
  /** @description 数据更新人(登录用户名) */
  updateBy: string
  /** @description 数据更新时间 */
  updateTime: string
  /** @description 账户启用状态标识 0 禁用 1 启用 */
  validStatus: number
}

/** @description 查看客户详情信息 请求参数 */
export interface GetCustomerDetailInfoUsingParams {
  /** @description id */
  id: string
}

/** @description 通用返回使用响应体 */
export interface GetBrandBelongToIndustryUsingResponse extends GetBrandBelongToAreaUsingResponse {
}

/** @description 通用返回使用响应体 */
export interface GetBrandCustomerListUsingResponse {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: List_2[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 分页数据-子类型 */
export interface List_2 {
  /** @description 开户行名称 */
  bankName: string
  /** @description 开户银行账号 */
  bankNum: string
  /** @description 公司所属地区编码 */
  belongToAreaCode: string
  /** @description 公司所属地区名称 */
  belongToAreaName: string
  /** @description 公司所属行业编码 */
  belongToIndustryCode: number
  /** @description 公司所属行业名称 */
  belongToIndustryName: string
  /** @description 品牌方公司名称 */
  brandCompanyName: string
  /** @description 营业执照路径 为空则为未上传 不为空则是已上传 */
  businessLicenseUrl: string
  /** @description 单位地址 */
  companyAddress: string
  /** @description 公司电话 */
  companyPhone: string
  /** @description 联系人姓名 */
  contactUser: string
  /** @description 合作内容 */
  cooperationType: string
  /** @description 数据创建人(登录用户名) */
  createBy: string
  /** @description 数据创建时间 */
  createTime: string
  /** @description 数据删除状态标识 0 未删除 1删除 */
  deleteStatus: number
  /** @description 品牌方客户信息记录id */
  id: number
  /** @description 开票名称 */
  invoiceName: string
  /** @description 法人身份证号 */
  legalPersonIdCode: string
  /** @description 法人名称 */
  legalPersonName: string
  /** @description 法人手机号 */
  legalPersonPhone: string
  /** @description 联系人电话 */
  loginPhone: string
  /** @description 对接人名称 */
  oppositePersonName: string
  /** @description 资质文件路径 为空则为未上传 不为空则是已上传 */
  qualificationsUrl: string
  /** @description 税号 */
  raxNum: string
  /** @description 统一社会信用代码 */
  uniteCreditCode: string
  /** @description 数据更新人(登录用户名) */
  updateBy: string
  /** @description 数据更新时间 */
  updateTime: string
  /** @description 账户启用状态标识 0 禁用 1 启用 */
  validStatus: number
}

/** @description 获取品牌方客户列表信息 请求参数 */
export interface GetBrandCustomerListUsingParams {
  /** @description 品牌方名称(默认空值) */
  brandCompanyName: string
  /**
   * @example 0 未上传 1已上传
   * @description 营业执照上传状态(默认空值)
   */
  businessLicenseUploadStatus: number
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c: number
  /**
   * @example 2022-03-31
   * @description 结束时间(默认空值)
   */
  endTime: string
  /**
   * @example 1
   * @description 当前页
   */
  p: number
  /**
   * @example 0 未上传 1已上传
   * @description 资质管理上传状态 (默认空值)
   */
  qualificationsUploadStatus: number
  /**
   * @example 2022-03-28
   * @description 开始时间(默认空值)
   */
  startTime: string
  /** @description 统一社会信用代码(默认空值) */
  uniteCreditCode: string
}

/** @description 新增/更新品牌方客户管理主数据 请求参数 */
export interface PostNewOrUpdateCopyrightPhotosRecordUsingParams {
  /** @description 开户行名称 */
  bankName?: string
  /** @description 开户银行账号 */
  bankNum?: string
  /** @description 公司所属地区编码 */
  belongToAreaCode: string
  /** @description 公司所属地区名称 */
  belongToAreaName: string
  /** @description 公司所属行业编码 */
  belongToIndustryCode: number
  /** @description 公司所属行业名称 */
  belongToIndustryName: string
  /** @description 品牌方公司名称 */
  brandCompanyName: string
  /** @description 营业执照路径 */
  businessLicenseUrl: string
  /** @description 单位地址 */
  companyAddress?: string
  /** @description 公司电话 */
  companyPhone?: string
  /** @description 联系人姓名 */
  contactUser: string
  /** @description 合作内容 */
  cooperationType: number[]
  /** @description 数据创建人(登录用户名) */
  createBy?: string
  /** @description 数据创建时间 */
  createTime?: string
  /** @description 数据删除状态标识 */
  deleteStatus?: number
  /** @description 品牌方客户主数据id(新增时不需要 更新时带上) */
  id: number
  /** @description 开票名称 */
  invoiceName?: string
  /** @description 法人身份证号 */
  legalPersonIdCode: string
  /** @description 法人名称 */
  legalPersonName: string
  /** @description 法人手机号 */
  legalPersonPhone: string
  /** @description 联系人电话 */
  loginPhone: string
  /** @description 对接人名称 */
  oppositePersonName: string
  /** @description 用户登录密码 */
  password?: string
  /** @description 资质文件路径 */
  qualificationsUrl: string
  /** @description 税号 */
  raxNum?: string
  /** @description 统一社会信用代码 */
  uniteCreditCode: string
  /** @description 数据更新人(登录用户名) */
  updateBy?: string
  /** @description 数据更新时间 */
  updateTime?: string
  /** @description 账户启用状态标识 */
  validStatus?: number
}

/** @description B1工作台素材库下发接口 请求参数 */
export interface AddBrandAuthorizerSourceRecordUsingParams {
  /** @description 授权天数 */
  authDays: number
  /** @description 品牌方公司ID */
  buid: number
  /** @description 关联IPID */
  ipId: number
  /** @description 请求方式：0：申请，1：下发 */
  requestMode: number
  /** @description 素材库ID */
  storeId: number
}

/** @description B3工作台素材库申请接口 请求参数 */
export interface PostApplyBrandAuthorizerSourceRecordUsingParams {
  authRid: number
  /** @description 品牌方公司ID */
  buid: number
  /** @description 关联IPID */
  ipId: number
  /** @description 素材库ID */
  storeId: number
}

/** @description C2下载接口 请求参数 */
export interface GetRecordDownloadUsingParams {
  /** @description 素材Id */
  storeId?: number
}

/** @description 通用返回使用响应体 */
export interface GetRecordTimeUsingResponse {
}

/** @description 通用返回使用响应体 */
export interface GetPageRecordRequestUsingResponse {
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
  /** @description 审批说明 */
  approveDesc: string
  /** @description 审批结果：0-待审核，1-审核通过，2-审核驳回 */
  approveStatus: number
  /** @description 有效期 */
  authEndTime: string
  /** @description 授权记录自增ID */
  authRid: number
  /** @description 素材描述 */
  description: string
  /** @description 关联IPID */
  ipId: number
  /** @description 关联IP名称 */
  ipName: string
  /** @description 素材库ID */
  storeId: number
  /** @description 状态：0-过期，1-可用 */
  validStatus: number
}

/** @description B2工作台-素材库-分页查询接口 请求参数 */
export interface GetPageRecordRequestUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 结束时间 */
  endTime?: string
  /** @description 关联IP名称 */
  ipName?: string
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
  /** @description 开始时间 */
  startTime?: string
  /** @description 素材状态 */
  validStatus?: number
}

/** @description 文件信息-子类型 */
export interface FileMessages {
  /** @description 文件ID */
  fileId: string
  /** @description 文件名称 */
  fileName: string
  /** @description 文件地址 */
  url: string
}

/** @description B1管理台-素材库-新增接口 请求参数 */
export interface AddPrandPlatSourceUsingParams {
  /** @description 授权品类编码 */
  authClassCode: string
  /** @description 素材描述 */
  description: string
  /** @description 文件信息 */
  fileMessages: FileMessages[]
  /** @description IP关联ID */
  ipId: number
}

/** @description C2管理台-素材管理-审核接口 请求参数 */
export interface GetExamineBrandAuthorizerSourceRecordUsingParams {
  /** @description 审批说明 */
  approveDesc?: string
  /** @description 申请状态：0-待审核，1-审核通过，2-审核驳回 */
  approveStatus?: number
  /** @description 授权天数 */
  authDays?: number
  authRid?: number
}

/** @description 通用返回使用响应体 */
export interface GetBrandAuthorizerSourceRecordUsingResponse {
  /** @description 素材描述 */
  description: string
  /** @description 文件信息 */
  fileMessages: FileMessages[]
  /** @description 关联IPID */
  ipId: number
  /** @description 关联IP名称 */
  ipName: string
  /** @description 素材库ID */
  storeId: number
}

/** @description B4管理台-素材库-单个查询接口 请求参数 */
export interface GetBrandAuthorizerSourceRecordUsingParams {
  /** @description 素材Id */
  storeId?: number
}

/** @description 通用返回使用响应体 */
export interface GetPrandPlatSourceListUsingResponse {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: List_4[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 分页数据-子类型 */
export interface List_4 {
  authClassCode: string
  createBy: string
  createTime: string
  description: string
  ipId: number
  storeId: number
  updateBy: string
  updateTime: string
}

/** @description B2管理台-素材库-列表查询接口 请求参数 */
export interface GetPrandPlatSourceListUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 结束时间 */
  endTime?: string
  ipId?: number
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
export interface GetPageBrandAuthorizerSourceRecordUsingResponse {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: List_5[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 分页数据-子类型 */
export interface List_5 {
  /** @description 申请次数 */
  applyNum: number
  /** @description 申请时间 */
  applyTime: string
  /** @description 审批说明 */
  approveDesc: string
  /** @description 申请状态：0-待审核，1-审核通过，2-审核驳回 */
  approveStatus: number
  /** @description 授权天数 */
  authDays: number
  /** @description 授权记录自增ID */
  authRid: number
  /** @description 品牌方公司ID */
  buid: number
  /** @description 品牌方 */
  buidName: string
  /** @description 素材描述 */
  description: string
  /** @description 关联IPID */
  ipId: number
  /** @description 关联Ip */
  ipName: string
  /** @description 素材库ID */
  storeId: number
  /** @description 时间 */
  time: string
  /** @description 修改时间 */
  updateTime: string
}

/** @description C1管理台-素材管理-分页查询接口 请求参数 */
export interface GetPageBrandAuthorizerSourceRecordUsingParams {
  /** @description 是否首次 */
  applyNum?: number
  /** @description 审批状态 */
  approveStatus?: number
  /** @description 品牌方名称 */
  buidName?: string
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 结束时间 */
  endTime?: string
  /** @description 关联IP名称 */
  ipName?: string
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
  /** @description 开始时间 */
  startTime?: string
  /** @description 素材状态 */
  validStatus?: number
}

/** @description 通用返回使用响应体 */
export interface GetPageBrandRecordUsingResponse {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: List_6[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 分页数据-子类型 */
export interface List_6 {
  /** @description 品牌方公司名称 */
  brandCompanyName: string
  /** @description 品牌方公司ID */
  buid: number
  /** @description 创建时间 */
  createTime: string
}

/** @description B5管理台-素材库-下发记录接口 请求参数 */
export interface GetPageBrandRecordUsingParams {
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
  /** @description 素材Id */
  storeId?: number
}

/** @description B3管理台-素材库-编辑接口 请求参数 */
export interface UpdatePrandPlatSourceUsingParams {
  /** @description 素材描述 */
  description: string
  /** @description 文件信息 */
  fileMessages: FileMessages[]
  /** @description 关联IPID */
  ipId: number
  /** @description 素材自增ID */
  storeId: number
}

/** @description A4-执行工单审批执行操作 请求参数 */
export interface PostApproveWorkInfoUsingParams {
  /** @description 审核内容 */
  approvDesc: string
  /** @description 执行工单ID */
  bwid: string
  /** @description 任务ID */
  processId: string
  /** @description 流程状态：3-审核通过,4-审核驳回 */
  processStatus: string
}

/** @description A1-创建执行工单 请求参数 */
export interface CreateWorkOrderUsingParams {
  /** @description 合同ID */
  bcid: string
  /** @description 品牌方公司名称 */
  brandCompanyName: string
  /** @description 品牌方ID */
  buid: string
  /** @description 执行工单ID */
  bwid: string
  /** @description 合同编号 */
  contractNum: string
  /** @description 合同状态 */
  contractStatus: string
  /** @description 关联ip编码 */
  ipId: string
  /** @description 关联ip名称 */
  ipName: string
  /** @description 最新流程节点 */
  lastProcessId: string
  /** @description 最新节点类型:design-产品设计|demo-产品打样|material-物料宣传|upload-上传源文件 */
  lastWorkType: string
  /** @description 上线时间 */
  onlineDate: string
  /** @description 上线平台 */
  onlinePlat: string
  /** @description 流程状态：1-待上传,2-待审核,3-审核通过,4-审核驳回 */
  processStatus: string
  /** @description 执行选择流程:design:产品设计，publicity-design:宣传设计，fent-repair:打样监修，upload-上传源文件，bulk-sample:大货样品 */
  selectWorkType: string[]
  /** @description 执行选择流程:design-产品设计|demo-产品打样|material-物料宣传|upload-上传源文件 */
  selectWorkTypeArr: string[]
  /** @description 更新时间 */
  updateTime: string
  /** @description 工单内容 */
  workContent: string
  /** @description 工单名称 */
  workName: string
  /** @description 执行工单编号：GD20220406001 */
  workNum: string
  /** @description 执行工单状态:0-已取消，1-进行中，2-已完成 */
  workStatus: string
}

/** @description 通用返回使用响应体 */
export interface GetBrandOrderInfoListUsingResponse {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: List_7[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 分页数据-子类型 */
export interface List_7 {
  /** @description 合同ID */
  bcid: string
  /** @description 品牌方公司名称 */
  brandCompanyName: string
  /** @description 品牌方ID */
  buid: string
  /** @description 执行工单ID */
  bwid: string
  /** @description 合同编号 */
  contractNum: string
  /** @description 合同状态 */
  contractStatus: string
  /** @description 关联ip编码 */
  ipId: string
  /** @description 关联ip名称 */
  ipName: string
  /** @description 最新流程节点 */
  lastProcessId: string
  /** @description 最新节点类型:design-产品设计|demo-产品打样|material-物料宣传|upload-上传源文件 */
  lastWorkType: string
  /** @description 上线时间 */
  onlineDate: string
  /** @description 上线平台 */
  onlinePlat: string
  /** @description 流程状态：1-待上传,2-待审核,3-审核通过,4-审核驳回 */
  processStatus: string
  /** @description 执行选择流程:design:产品设计，publicity-design:宣传设计，fent-repair:打样监修，upload-上传源文件，bulk-sample:大货样品 */
  selectWorkType: string[]
  /** @description 执行选择流程:design-产品设计|demo-产品打样|material-物料宣传|upload-上传源文件 */
  selectWorkTypeArr: string[]
  /** @description 更新时间 */
  updateTime: string
  /** @description 工单内容 */
  workContent: string
  /** @description 工单名称 */
  workName: string
  /** @description 执行工单编号：GD20220406001 */
  workNum: string
  /** @description 执行工单状态:0-已取消，1-进行中，2-已完成 */
  workStatus: string
}

/** @description A2-交互管理筛选列表 请求参数 */
export interface GetBrandOrderInfoListUsingParams {
  /** @description 品牌方公司名称 */
  brandName?: string
  buid?: string
  buids?: []
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 合同编号 */
  contractNum?: string
  /** @description 查询结束时间 */
  endTime?: string
  /** @description 关联IP名称 */
  ipName?: string
  /** @description 最新节点类型 :design-产品设计|demo-产品打样|material-物料宣传|upload-上传源文件 */
  lastWorkType?: string
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
  platType?: string
  /** @description 流程状态：1-待上传,2-待审核,3-审核通过,4-审核驳回 */
  processStatus?: string
  /** @description 查询开始时间 */
  startTime?: string
  /** @description 工单名称 */
  workName?: string
  /** @description 工单编号 */
  workNum?: string
}

/** @description 文件列表-子类型 */
export interface Files {
  /** @description 文件名称 */
  fileName: string
  /** @description 文件地址 */
  url: string
}

/** @description A5-上传审核文件 请求参数 */
export interface PostUploadApproveFilesUsingParams {
  /** @description 文件列表 */
  files: Files[]
  /** @description 物流单号 */
  logisticsNo: string
  /** @description 素材描述 */
  materialDesc: string
  /** @description 任务ID */
  processId: string
}

/** @description 通用返回使用响应体 */
export interface GetWorkOrderInfoDetailUsingResponse {
  /** @description 执行工单基本信息 */
  infoResponse: List_7
  /** @description 待处理任务 */
  lastTask: LastTask
  /** @description 操作任务列表 */
  taskList: LastTask[]
}

/** @description 待处理任务-子类型 */
export interface LastTask {
  /** @description 审核时间 */
  approvDate: string
  /** @description 审核内容 */
  approvDesc: string
  /** @description 审核人 */
  approvUser: string
  /** @description 审核人名称 */
  approvUserName: string
  /** @description 执行工单ID */
  bwid: string
  /** @description 操作时间 */
  createTime: string
  /** @description 是否存在可下载文件：0-没有，1-可下载 */
  existFile: number
  /** @description 操作日志ID */
  logId: string
  /** @description 物流单号 */
  logisticsNo: string
  /** @description 素材描述 */
  materialDesc: string
  /** @description 流程节点ID */
  processId: string
  /** @description 流程状态：1-待上传,2-待审核,3-审核通过,4-审核驳回 */
  processStatus: string
  /** @description 执行工单流程类型:design:产品设计，publicity-design:宣传设计，fent-repair:打样监修，upload-上传源文件，bulk-sample:大货样品 */
  workType: string
}

/** @description A3-执行工单详情 请求参数 */
export interface GetWorkOrderInfoDetailUsingParams {
  /** @description bwid */
  bwid: string
}

/** @description A7-执行工单取消 请求参数 */
export interface GetCancelWorkOrderUsingParams {
  /** @description bwid */
  bwid: string
}

/** @description 通用返回使用响应体 */
export interface GetWorkOrderInfoListByBcidUsingResponse {
  /** @description 合同ID */
  bcid: string
  /** @description 品牌方公司名称 */
  brandCompanyName: string
  /** @description 品牌方ID */
  buid: string
  /** @description 执行工单ID */
  bwid: string
  /** @description 合同编号 */
  contractNum: string
  /** @description 合同状态 */
  contractStatus: string
  /** @description 关联ip编码 */
  ipId: string
  /** @description 关联ip名称 */
  ipName: string
  /** @description 最新流程节点 */
  lastProcessId: string
  /** @description 最新节点类型:design-产品设计|demo-产品打样|material-物料宣传|upload-上传源文件 */
  lastWorkType: string
  /** @description 上线时间 */
  onlineDate: string
  /** @description 上线平台 */
  onlinePlat: string
  /** @description 流程状态：1-待上传,2-待审核,3-审核通过,4-审核驳回 */
  processStatus: string
  /** @description 执行选择流程:design:产品设计，publicity-design:宣传设计，fent-repair:打样监修，upload-上传源文件，bulk-sample:大货样品 */
  selectWorkType: string[]
  /** @description 执行选择流程:design-产品设计|demo-产品打样|material-物料宣传|upload-上传源文件 */
  selectWorkTypeArr: string[]
  /** @description 更新时间 */
  updateTime: string
  /** @description 工单内容 */
  workContent: string
  /** @description 工单名称 */
  workName: string
  /** @description 执行工单编号：GD20220406001 */
  workNum: string
  /** @description 执行工单状态:0-已取消，1-进行中，2-已完成 */
  workStatus: string
}

/** @description A6-合同ID拉取工单列表 请求参数 */
export interface GetWorkOrderInfoListByBcidUsingParams {
  /** @description bcid */
  bcid: string
}

/** @description A10-下载操作记录资源文件-日志记录ID 请求参数 */
export interface GetPackDownLogLoadUsingParams {
  /** @description logId */
  logId: string
}

/** @description A8-下载资源文件-流程节点ID 请求参数 */
export interface GetPackDownLoadUsingParams {
  /** @description processId */
  processId: string
}

/** @description A9-撤销审批请求 请求参数 */
export interface GetRevokeProcessUsingParams {
  /** @description processId */
  processId: string
}

/** @id getAuthCategoryUsingPOST */
export type GetAuthCategoryUsing = <T = GetAuthCategoryUsingResponse>(params: GetAuthCategoryUsingParams) => Promise<T>
/** @id getBrandCompanyListUsingPOST */
export type GetBrandCompanyListUsing = <T = GetBrandCompanyListUsingResponse>(params: GetBrandCompanyListUsingParams) => Promise<T>
/** @id getContractByNumUsingPOST */
export type GetContractByNumUsing = <T = GetContractByNumUsingResponse>(params: GetContractByNumUsingParams) => Promise<T>
/** @id createOrUpdateBrandContractInfoUsingPOST */
export type CreateOrUpdateBrandContractInfoUsing = <T = any>(params: CreateOrUpdateBrandContractInfoUsingParams) => Promise<T>
/** @id getBrandDetailInfoUsingGET */
export type GetBrandDetailInfoUsing = <T = GetBrandDetailInfoUsingResponse>(params: GetBrandDetailInfoUsingParams) => Promise<T>
/** @id downloadAllTypeFileUsingPOST */
export type DownloadAllTypeFileUsing = <T = any>(params: DownloadAllTypeFileUsingParams) => Promise<T>
/** @id handleQualificationReviewUsingPOST */
export type HandleQualificationReviewUsing = <T = any>(params: HandleQualificationReviewUsingParams) => Promise<T>
/** @id getBrandContractListUsingPOST */
export type GetBrandContractListUsing = <T = GetBrandContractListUsingResponse>(params: GetBrandContractListUsingParams) => Promise<T>
/** @id handleSuspendContractUsingGET */
export type HandleSuspendContractUsing = <T = any>(params: HandleSuspendContractUsingParams) => Promise<T>
/** @id uploadingBrandAuthorizationUsingPOST */
export type PostUploadingBrandAuthorizationUsing = <T = any>(params: PostUploadingBrandAuthorizationUsingParams) => Promise<T>
/** @id uploadQualificationUsingPOST */
export type PostUploadQualificationUsing = <T = any>(params: PostUploadQualificationUsingParams) => Promise<T>
/** @id getBrandBelongToAreaUsingPOST */
export type GetBrandBelongToAreaUsing = <T = GetBrandBelongToAreaUsingResponse>(params: GetBrandBelongToAreaUsingParams) => Promise<T>
/** @id changeAccountStatusUsingPOST */
export type PostChangeAccountStatusUsing = <T = any>(params: PostChangeAccountStatusUsingParams) => Promise<T>
/** @id getCustomerDetailInfoUsingGET */
export type GetCustomerDetailInfoUsing = <T = GetCustomerDetailInfoUsingResponse>(params: GetCustomerDetailInfoUsingParams) => Promise<T>
/** @id getBrandBelongToIndustryUsingGET */
export type GetBrandBelongToIndustryUsing = <T = GetBrandBelongToIndustryUsingResponse>() => Promise<T>
/** @id getBrandCustomerListUsingPOST */
export type GetBrandCustomerListUsing = <T = GetBrandCustomerListUsingResponse>(params: GetBrandCustomerListUsingParams) => Promise<T>
/** @id newOrUpdateCopyrightPhotosRecordUsingPOST */
export type PostNewOrUpdateCopyrightPhotosRecordUsing = <T = any>(params: PostNewOrUpdateCopyrightPhotosRecordUsingParams) => Promise<T>
/** @id addBrandAuthorizerSourceRecordUsingPOST */
export type AddBrandAuthorizerSourceRecordUsing = <T = any>(params: AddBrandAuthorizerSourceRecordUsingParams) => Promise<T>
/** @id applyBrandAuthorizerSourceRecordUsingPOST */
export type PostApplyBrandAuthorizerSourceRecordUsing = <T = any>(params: PostApplyBrandAuthorizerSourceRecordUsingParams) => Promise<T>
/** @id getRecordDownloadUsingGET */
export type GetRecordDownloadUsing = <T = any>(params: GetRecordDownloadUsingParams) => Promise<T>
/** @id getRecordTimeUsingGET */
export type GetRecordTimeUsing = <T = any>() => Promise<T>
/** @id pageRecordRequestUsingGET */
export type GetPageRecordRequestUsing = <T = GetPageRecordRequestUsingResponse>(params: GetPageRecordRequestUsingParams) => Promise<T>
/** @id addPrandPlatSourceUsingPOST */
export type AddPrandPlatSourceUsing = <T = any>(params: AddPrandPlatSourceUsingParams) => Promise<T>
/** @id examineBrandAuthorizerSourceRecordUsingGET */
export type GetExamineBrandAuthorizerSourceRecordUsing = <T = any>(params: GetExamineBrandAuthorizerSourceRecordUsingParams) => Promise<T>
/** @id getBrandAuthorizerSourceRecordUsingGET */
export type GetBrandAuthorizerSourceRecordUsing = <T = GetBrandAuthorizerSourceRecordUsingResponse>(params: GetBrandAuthorizerSourceRecordUsingParams) => Promise<T>
/** @id getPrandPlatSourceListUsingGET */
export type GetPrandPlatSourceListUsing = <T = GetPrandPlatSourceListUsingResponse>(params: GetPrandPlatSourceListUsingParams) => Promise<T>
/** @id pageBrandAuthorizerSourceRecordUsingGET */
export type GetPageBrandAuthorizerSourceRecordUsing = <T = GetPageBrandAuthorizerSourceRecordUsingResponse>(params: GetPageBrandAuthorizerSourceRecordUsingParams) => Promise<T>
/** @id pageBrandRecordUsingGET */
export type GetPageBrandRecordUsing = <T = GetPageBrandRecordUsingResponse>(params: GetPageBrandRecordUsingParams) => Promise<T>
/** @id updatePrandPlatSourceUsingPOST */
export type UpdatePrandPlatSourceUsing = <T = any>(params: UpdatePrandPlatSourceUsingParams) => Promise<T>
/** @id approveWorkInfoUsingPOST */
export type PostApproveWorkInfoUsing = <T = any>(params: PostApproveWorkInfoUsingParams) => Promise<T>
/** @id createWorkOrderUsingPOST */
export type CreateWorkOrderUsing = <T = any>(params: CreateWorkOrderUsingParams) => Promise<T>
/** @id getBrandOrderInfoListUsingGET */
export type GetBrandOrderInfoListUsing = <T = GetBrandOrderInfoListUsingResponse>(params: GetBrandOrderInfoListUsingParams) => Promise<T>
/** @id uploadApproveFilesUsingPOST */
export type PostUploadApproveFilesUsing = <T = any>(params: PostUploadApproveFilesUsingParams) => Promise<T>
/** @id getWorkOrderInfoDetailUsingGET */
export type GetWorkOrderInfoDetailUsing = <T = GetWorkOrderInfoDetailUsingResponse>(params: GetWorkOrderInfoDetailUsingParams) => Promise<T>
/** @id cancelWorkOrderUsingGET */
export type GetCancelWorkOrderUsing = <T = any>(params: GetCancelWorkOrderUsingParams) => Promise<T>
/** @id getWorkOrderInfoListByBcidUsingGET */
export type GetWorkOrderInfoListByBcidUsing = <T = GetWorkOrderInfoListByBcidUsingResponse>(params: GetWorkOrderInfoListByBcidUsingParams) => Promise<T>
/** @id packDownLogLoadUsingGET */
export type GetPackDownLogLoadUsing = <T = any>(params: GetPackDownLogLoadUsingParams) => Promise<T>
/** @id packDownLoadUsingGET */
export type GetPackDownLoadUsing = <T = any>(params: GetPackDownLoadUsingParams) => Promise<T>
/** @id revokeProcessUsingGET */
export type GetRevokeProcessUsing = <T = any>(params: GetRevokeProcessUsingParams) => Promise<T>
