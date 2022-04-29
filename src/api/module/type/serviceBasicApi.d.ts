import { IResponse } from '../../services/type'

/** @description 通用返回使用响应体 */
export interface GetLabelSelectUsingResponse {
  /** @description 类型名称 */
  classificationName: string
  /** @description 类型ID */
  id: string
}

/** @description 通用返回使用响应体 */
export interface DeleteUsingResponse {
}

/** @description 合作管理管理-删除 请求参数 */
export interface DeleteUsingParams {
  /** @description 合作意向管理ID */
  id?: number
}

/** @description 通用返回使用响应体 */
export interface GetDetailsUsingResponse {
}

/** @description 合作管理-详情 请求参数 */
export interface GetDetailsUsingParams {
  /** @description 合作意向管理ID */
  id?: number
}

/** @description 通用返回使用响应体 */
export interface GetCooperationIntentionsUsingResponse {
}

/** @description 通用返回使用响应体 */
export interface GetCooperationTypeUsingResponse extends GetCooperationIntentionsUsingResponse {
}

/** @description 通用返回使用响应体 */
export interface PostIpSaveUsingResponse extends GetDetailsUsingResponse {
}

/** @description 合作管理管理-IP认领 请求参数 */
export interface PostIpSaveUsingParams {
  /** @description 创建人 */
  createBy: string
  /** @description 自增主键 */
  id: number
  /** @description IP名称 */
  ipName: string
  ipProve: string
  /** @description 姓名 */
  name: string
  /** @description 手机号 */
  phoneNumber: string
  /** @description 修改人 */
  updateBy: string
}

/** @description 通用返回使用响应体 */
export interface GetPageCooperationListUsingResponse {
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
  /** @description 预算 */
  budget: number
  /** @description 公司名称 */
  company: string
  /** @description 合作类型 */
  cooperationType: number
  /** @description 创建人 */
  createBy: string
  /** @description 创建时间 */
  createTime: string
  /** @description 跟进人 */
  followPerson: string
  /** @description 跟进时间 */
  followTime: string
  /** @description 是否跟进 */
  followType: number
  /** @description 自增主键 */
  id: number
  /** @description IP名称 */
  ipName: string
  /** @description ip证明文件地址 */
  ipProve: string
  /** @description 姓名 */
  name: string
  /** @description 手机号 */
  phoneNumber: string
  /** @description 备注 */
  remark: string
  /** @description 修改人 */
  updateBy: string
  /** @description 修改时间 */
  updateTime: string
}

/** @description 合作管理-列表 请求参数 */
export interface GetPageCooperationListUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 合作类型 */
  cooperationType?: string
  /** @description 跟进人 */
  followPerson?: string
  /** @description 跟进类型 */
  followType?: string
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
}

/** @description 合作管理-添加修改 请求参数 */
export interface SaveUsingParams {
  /** @description 预算 */
  budget: number
  /** @description 公司名称 */
  company: string
  /** @description 合作类型 */
  cooperationType: number
  /** @description 创建人 */
  createBy: string
  /** @description 跟进人 */
  followPerson: string
  /** @description 跟进时间 */
  followTime: string
  /** @description 是否跟进 */
  followType: number
  /** @description 自增主键 */
  id: number
  /** @description IP名称 */
  ipName: string
  ipProve: string
  /** @description 姓名 */
  name: string
  /** @description 手机号 */
  phoneNumber: string
  remark: string
  /** @description 修改人 */
  updateBy: string
}

/** @description 通用返回使用响应体 */
export interface GetActualIndexNumUsingResponse {
  /** @description 版权方实际收藏数 */
  actualCollectNum: number
  /** @description 版权方实际粉丝数 */
  actualFansNum: number
  /** @description 版权方实际热度数 */
  actualHeatNum: number
}

/** @description 获取版权方实际热度/粉丝/收藏数 请求参数 */
export interface GetActualIndexNumUsingParams {
  /** @description id */
  id: string
}

/** @description 官网主页取消收藏图片功能 请求参数 */
export interface PostCancelCollectPhotoUsingParams {
  /** @description 图片存储路径 */
  photoUrl: string
  /** @description 登录用户id */
  userCode: string
}

/** @description 官网主页收藏图片功能 请求参数 */
export interface HandleCollectPhotoUsingParams {
  /** @description 用户编码 */
  collectUserCode?: string
  /** @description 用户名称 */
  collectUserName?: string
  /** @description 版权方编码 */
  copyrightOwnerCode: string
  /** @description 图片高度 */
  height?: number
  /** @description ip编码 */
  ipCode: string
  /** @description 图片路径 */
  photoUrl: string
  /** @description 图片宽度 */
  width?: number
}

/** @description 版权方主数据信息删除 请求参数 */
export interface DeleteCopyrightMajorInfoUsingParams {
  /** @description id */
  id: string
}

/** @description 删除版权方图库信息主数据 请求参数 */
export interface DeleteCopyrightPhotosRecordUsingParams {
  /** @description id */
  id: string
}

/** @description 通用返回使用响应体 */
export interface PostCopyrightModuleDetailUsingResponse {
}

/** @description 版权方主数据详情信息 请求参数 */
export interface PostCopyrightModuleDetailUsingParams {
  id: number
  /** @description 页签类别 1 标签 2 版权方信息 3 seo信息 */
  type: number
}

/** @description 通用返回使用响应体 */
export interface GetDomainLabelListUsingResponse {
  /** @description 领域信息编号 */
  id: number
  /** @description 领域信息名称 */
  name: string
}

/** @description 通用返回使用响应体 */
export interface GetAllCopyrightOwnerPhototsUsingResponse {
}

/** @description 获取版权方所有上传的图片集 请求参数 */
export interface GetAllCopyrightOwnerPhototsUsingParams {
  /** @description 版权方编码 */
  id: string
}

/** @description 通用返回使用响应体 */
export interface GetCopyrightOwnerNamesUsingResponse {
  id: number
  labelName: string
}

/** @description 通用返回使用响应体 */
export interface GetSeoDetailInfoUsingResponse {
  /** @description 案例集seo描述 */
  casesSeoDesc: string
  /** @description 案例集seo关键词 */
  casesSeoKeyword: string
  /** @description 案例集seo标题 */
  casesSeoTitle: string
  /** @description 版权方编码 */
  copyrightOwnerCode: string
  /** @description 版权方配置的seo描述 */
  copyrightOwnerDesc: string
  /** @description 版权方配置的seo关键词 */
  copyrightOwnerKeyword: string
  /** @description 版权方名称 */
  copyrightOwnerName: string
  /** @description 版权方配置的seo标题 */
  copyrightOwnerTitle: string
  /** @description 资讯seo描述 */
  informationSeoDesc: string
  /** @description 资讯seo关键词 */
  informationSeoKeyword: string
  /** @description 资讯seo标题 */
  informationSeoTitle: string
  /** @description ip作品集seo描述 */
  ipWorksSeoDesc: string
  /** @description ip作品集seo关键词 */
  ipWorksSeoKeyword: string
  /** @description ip作品集seo标题 */
  ipWorksSeoTitle: string
  /** @description 图库seo描述 */
  photosSeoDesc: string
  /** @description 图库seo关键词 */
  photosSeoKeyword: string
  /** @description 图库seo标题 */
  photosSeoTitle: string
}

/** @description 根据版权方id获取各对象的seo信息 请求参数 */
export interface GetSeoDetailInfoUsingParams {
  /** @description id */
  id: string
}

/** @description 版权方信息进行新增/更新 请求参数 */
export interface HandleCopyrightInfoUsingParams {
  /** @description 版权方实际粉丝数 */
  actualFansNum?: number
  /** @description 版权方随机填写收藏数 */
  collectNum: number
  /** @description 版权方主信息关联编码 */
  copyrightOwnerCode: string
  /** @description 版权方名称 */
  copyrightOwnerName?: string
  createTime?: string
  /** @description 创建人 */
  createUser: string
  /** @description 版权方描述 */
  describe: string
  /** @description 版权方随机填写粉丝数 */
  fansNum: number
  /** @description 版权方随机填写热度数 */
  heatNum: number
  id?: number
  lastUpdateUser?: string
  /** @description 版权方主页图片信息 */
  principalSheetPhotoInfo: string
  type?: number
  updateTime?: string
}

/** @description 通用返回使用响应体 */
export interface SelectCopyrightInfoListUsingResponse {
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
  createTime: string
  deletedAt: string
  /** @description 领域标签集合 */
  domainLabel: number[]
  id: number
  /** @description 版权方分组 */
  labelGroupId: number
  /** @description 图标存储路径 */
  labelIcon: string
  /** @description 版权方名称 */
  labelName: string
  /** @description 排序 */
  labelOrderly: number
  /** @description 版权方类别 */
  labelType: number
  /** @description seo描述 */
  seoDescription: string
  /** @description seo关键词 */
  seoKeyword: string
  /** @description seo标题 */
  seoTitle: string
  updateTime: string
}

/** @description 版权方主信息管理列表 请求参数 */
export interface SelectCopyrightInfoListUsingParams {
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
export interface GetIpListUsingResponse {
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
  /** @description 创建时间 */
  createTime: string
  /** @description id */
  id: number
  /** @description ip名称 */
  ipName: string
  updateTime: string
}

/** @description ip列表信息查询 请求参数 */
export interface GetIpListUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description ip名称(默认空 输入名称模糊查询) */
  ipName: string
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
}

/** @description 版权方标签信息进行新增/更新 请求参数 */
export interface HandleCopyrightLabelInfoUsingParams {
  createTime?: string
  deletedAt?: string
  /** @description 领域标签集 */
  domainLabel: number[]
  id?: number
  /** @description 标签分组 */
  labelGroupId: number
  /** @description 版权方主页图标图片路径 */
  labelIcon: string
  /** @description 标签名称 */
  labelName: string
  /** @description 排序 */
  labelOrderly: number
  /** @description 标签类型 */
  labelType?: number
  /** @description seo描述 */
  seoDescription: string
  /** @description seo关键词 */
  seoKeyword: string
  /** @description seo标题 */
  seoTitle: string
  updateTime?: string
}

/** @description 新增/更新版权方图库信息主数据 请求参数 */
export interface PostNewOrUpdateCopyrightPhotosRecordUsingParams {
  /** @description 版权方编码() */
  copyrightOwnerCode: string
  /** @description 版权方名称 */
  copyrightOwnerName: string
  /** @description 记录创建时间 */
  createTime?: string
  /** @description 记录创建人(能拿到用户信息就带过来) */
  createUser?: string
  /** @description 版权方主数据id(新增时不需要 更新时带上) */
  id: number
  /** @description ip编码 */
  ipCode: string
  /** @description ip名称 */
  ipName: string
  /** @description 最后修改人 */
  lastUpdateUser?: string
  /** @description 版权方图库seo标题 */
  photoTitle: string
  /** @description 版权方图库信息对象(用图片上传接口后返回信息对象，直接接收提交时返回) */
  photosInfo: any[]
  /** @description 版权方图库描述 */
  photosStorageDesc: string
  /** @description 排序 */
  sort: number
  /** @description 图库发布状态 0 未发布 1 已发布 */
  status: number
  /** @description 记录修改时间 */
  updateTime?: string
}

/** @description 通用返回使用响应体 */
export interface GetOfficialWebsiteBaseInfoUsingResponse {
  /** @description 版权方主页收藏数 */
  collectNum: number
  /** @description 版权方名称 */
  copyrightOwnerName: string
  /** @description 版权方信息描述 */
  describe: string
  /** @description 版权方主页粉丝数 */
  fansNum: number
  /** @description 版权方主页热度数 */
  heatNum: number
  id: number
  /** @description 版权方主页图标图片 */
  labelIcon: string
  /** @description 版权方主页背景图信息 */
  principalSheetPhotoInfo: string
  /** @description 版权方主页作品数 */
  worksNum: number
}

/** @description 获取版权方官网主页基本信息 请求参数 */
export interface GetOfficialWebsiteBaseInfoUsingParams {
  /** @description id */
  id: number
}

/** @description 官网主页进入图片详情获取图片收藏状态 请求参数 */
export interface GetPhotoCollectStatusUsingParams {
  /** @description 图片存储路径 */
  photoUrl: string
  /** @description 登录用户id */
  userCode: string
}

/** @description 通用返回使用响应体 */
export interface GetPhotoDetailUsingResponse {
  /** @description 当前图片路径 */
  currentPhotoUrl: string
  /** @description ip记录的关联id */
  ipId: number
  /** @description 图片关联ip名称 */
  ipName: string
  /** @description 关联ip封面图路径 */
  ipPhotoUrl: string
  /** @description 图片关联ip标签集名称 */
  ipRelationLabels: string[]
  /** @description 更多图片路径集 */
  morePhotoUrls: object
  /** @description 图片详细信息 */
  photoDescribe: string
  /** @description 版权方图库seo标题 */
  photoTitle: string
}

/** @description 官网主页获取图库中某图片详情信息 请求参数 */
export interface GetPhotoDetailUsingParams {
  /** @description id */
  id: string
}

/** @description 通用返回使用响应体 */
export interface GetPhotosRecordDetailUsingResponse {
  copyrightOwnerCode?: string
  copyrightOwnerName?: string
  createTime?: string
  createUser?: string
  id?: number
  ipCode?: string
  ipName?: string
  lastUpdateUser?: string
  /** @description 版权方图库seo标题 */
  photoTitle: string
  photosInfo?: string
  photosStorageDesc?: string
  sort?: number
  status?: number
  updateTime?: string
}

/** @description 获取版权方后台管理界面图库信息详情 请求参数 */
export interface GetPhotosRecordDetailUsingParams {
  /** @description id */
  id: string
}

/** @description 通用返回使用响应体 */
export interface SelectCopyrightPhotosRecordsUsingResponse {
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
  copyrightOwnerCode?: string
  copyrightOwnerName?: string
  createTime?: string
  createUser?: string
  id?: number
  ipCode?: string
  ipName?: string
  lastUpdateUser?: string
  /** @description 版权方图库seo标题 */
  photoTitle: string
  photosInfo?: string
  photosStorageDesc?: string
  sort?: number
  status?: number
  updateTime?: string
}

/** @description 查看版权方图库信息主数据列表 请求参数 */
export interface SelectCopyrightPhotosRecordsUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 版权方名称(默认空值) */
  copyrightOwnerName: string
  /** @description ip名称(默认空值) */
  ipName: string
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
  /**
   * @example 0 未发布 1 发布(默认空值)
   * @description 发布状态
   */
  status: number
}

/** @description 版权方seo配置信息进行新增/更新 请求参数 */
export interface HandleCopyrightSeoInfoUsingParams {
  /** @description 案例集seo描述 */
  casesSeoDesc: string
  /** @description 案例集seo关键词 */
  casesSeoKeyword: string
  /** @description 案例集seo标题 */
  casesSeoTitle: string
  /** @description 版权方编码 */
  copyrightOwnerCode: string
  /** @description 版权方名称 */
  copyrightOwnerName?: string
  createTime?: string
  /** @description 创建人 */
  createUser: string
  id?: number
  /** @description 资讯seo描述 */
  informationSeoDesc: string
  /** @description 资讯seo关键词 */
  informationSeoKeyword: string
  /** @description 资讯seo标题 */
  informationSeoTitle: string
  /** @description ip作品集seo描述 */
  ipWorksSeoDesc: string
  /** @description ip作品集seo关键词 */
  ipWorksSeoKeyword: string
  /** @description ip作品集seo标题 */
  ipWorksSeoTitle: string
  lastUpdateUser?: string
  /** @description 图库seo描述 */
  photosSeoDesc: string
  /** @description 图库seo关键词 */
  photosSeoKeyword: string
  /** @description 图库seo标题 */
  photosSeoTitle: string
  type?: number
  updateTime?: string
}

/** @description 版权方-取消收藏接口 请求参数 */
export interface GetCancelCollectCopyrightUsingParams {
  /** @description 版权方ID */
  copyrightId?: number
}

/** @description 版权方-收藏接口 请求参数 */
export interface GetCollectCopyrightUsingParams {
  /** @description 版权方ID */
  copyrightId?: number
}

/** @description 版权方-关注接口 请求参数 */
export interface GetFollowCopyrightUsingParams {
  /** @description 版权方ID */
  copyrightId?: string
}

/** @description 版权方-用户是否收藏接口 请求参数 */
export interface GetCopyrightCollectStatusUsingParams {
  /** @description 版权方ID */
  copyrightId?: number
}

/** @description 版权方-浏览接口 请求参数 */
export interface GetViewCopyrightUsingParams {
}

/** @description 版权方资讯-删除 请求参数 */
export interface DeleteUsing_1Params {
  /** @description 版权方资讯ID */
  id?: number
}

/** @description 通用返回使用响应体 */
export interface GetDetailsUsing_1Response {
}

/** @description 版权方资讯-详情 请求参数 */
export interface GetDetailsUsing_1Params {
  /** @description 版权方资讯ID */
  id?: number
}

/** @description 通用返回使用响应体 */
export interface GetBackstageIpListByCopyrightUsingResponse {
}

/** @description 分页数据-子类型 */
export interface List_4 {
  /** @description 收藏数 */
  collectNumber: number
  /** @description id */
  id: number
  /** @description 图片路径 */
  infoPicture: string
  /** @description ip名称 */
  ipName: string
  /** @description 标签id */
  labelId: number
  /** @description 标签名称 */
  labelName: string
  /** @description 浏览数 */
  viewNumber: number
}

/** @description 后台-版权方-IP作品列表页 请求参数 */
export interface GetBackstageIpListByCopyrightUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 版权方ID */
  copyrightId?: number
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
}

/** @description 通用返回使用响应体 */
export interface GetBackstageProductListUsingResponse {
}

/** @description 分页数据-子类型 */
export interface List_5 {
  /** @description 类型：1 天音学院 2 IP资讯 */
  articleType: number
  /** @description 收藏数 */
  collectNumber: number
  /** @description id */
  id: number
  /** @description ip标签id */
  ipId: number
  /** @description ip名称 */
  ipName: string
  /** @description 案例摘要 */
  productDescript: string
  /** @description 类型：1 天音学院 2：案列详情 */
  productDetailType: number
  /** @description product图片 */
  productListPic: string
  /** @description 案例标题主标语 */
  productTitle: string
  /** @description 浏览数 */
  viewNumber: number
}

/** @description 后台-版权方-案例集列表接口 请求参数 */
export interface GetBackstageProductListUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 版权方ID */
  copyrightId?: number
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
  /** @description 是否按照浏览数排名，1:是，0：否 */
  viewNumber?: number
}

/** @description 通用返回使用响应体 */
export interface GetCopyrightListUsingResponse {
}

/** @description 通用返回使用响应体 */
export interface GetPageBackstageCopyrightInfoListUsingResponse {
}

/** @description 分页数据-子类型 */
export interface List_6 {
  /** @description 版权方Id */
  copyrightId: number
  /** @description 版权方名称 */
  copyrightName: string
  /** @description 创建人 */
  createBy: string
  /** @description 创建时间 */
  createTime: string
  /** @description 自增主键 */
  id: number
  /** @description 资讯作者 */
  infoAuthor: string
  /** @description 资讯详情 */
  infoDetails: string
  /** @description 资讯名称 */
  infoName: string
  /** @description 资讯图片地址 */
  infoPicture: string
  /** @description 资讯排序 */
  infoSort: number
  /** @description 资讯状态 0 未发布 1 已发布 */
  infoStatus: number
  /** @description 资讯摘要 */
  infoSummary: string
  /** @description 修改人 */
  updateBy: string
  /** @description 修改时间 */
  updateTime: string
  /** @description 浏览数 */
  viewNumber: number
}

/** @description 版权方资讯-列表 请求参数 */
export interface GetPageBackstageCopyrightInfoListUsingParams {
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
export interface GetPageBackstageIpInfoListUsingResponse {
}

/** @description 分页数据-子类型 */
export interface List_7 {
  /** @description 资讯摘要 */
  articleDescript: string
  /** @description ip资讯主标语 */
  articleName: string
  /** @description 资讯图片地址 */
  articlePic: string
  /** @description 收藏数 */
  collectNumber: number
  /** @description 自增主键（ip资讯详情id） */
  id: number
  /** @description 浏览数 */
  viewNumber: number
}

/** @description 后台-版权方IP资讯-列表 请求参数 */
export interface GetPageBackstageIpInfoListUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 版权方ID */
  copyrightId?: number
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
}

/** @description 通用返回使用响应体 */
export interface SaveUsing_1Response extends GetDetailsUsing_1Response {
}

/** @description 版权方资讯-添加修改 请求参数 */
export interface SaveUsing_1Params {
  /** @description 版权方Id */
  copyrightId: number
  /** @description 版权方名称 */
  copyrightName: string
  /** @description 创建人 */
  createBy: string
  /** @description 创建时间 */
  createTime: string
  /** @description 自增主键 */
  id: number
  /** @description 资讯作者 */
  infoAuthor: string
  /** @description 资讯详情 */
  infoDetails: string
  /** @description 资讯名称 */
  infoName: string
  /** @description 资讯图片地址 */
  infoPicture: string
  /** @description 资讯排序 */
  infoSort: number
  /** @description 资讯状态 0 未发布 1 已发布 */
  infoStatus: number
  /** @description 资讯摘要 */
  infoSummary: string
  /** @description 修改人 */
  updateBy: string
  /** @description 修改时间 */
  updateTime: string
  /** @description 浏览数 */
  viewNumber: number
}

/** @description 版权方资讯-浏览接口 请求参数 */
export interface PostViewCopyrightInfoUsingParams {
  /** @description 版权方资讯ID */
  copyrightInfoId?: number
}

/** @description 官网-版权方资讯-详情 请求参数 */
export interface GetDetailsUsing_2Params {
  /** @description 版权方资讯ID */
  id?: number
}

/** @description 通用返回使用响应体 */
export interface GetHotIpListByCopyrightUsingResponse extends GetCopyrightListUsingResponse {
}

/** @description 官网-版权方资讯-热门IP 请求参数 */
export interface GetHotIpListByCopyrightUsingParams {
  /** @description 版权方ID */
  copyrightId?: number
}

/** @description 通用返回使用响应体 */
export interface GetIpListByCopyrightUsingResponse extends GetBackstageIpListByCopyrightUsingResponse {
}

/** @description 官网-版权方-IP作品列表页 请求参数 */
export interface GetIpListByCopyrightUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 版权方ID */
  copyrightId?: number
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
  /** @description 是否按照浏览数排名，1:是，0：否 */
  viewNumber?: number
}

/** @description 通用返回使用响应体 */
export interface GetProductListUsingResponse extends GetBackstageProductListUsingResponse {
}

/** @description 官网-版权方-案例集列表接口 请求参数 */
export interface GetProductListUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 版权方ID */
  copyrightId?: number
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
  /** @description 是否按照浏览数排名，1:是，0：否 */
  viewNumber?: number
}

/** @description 官网-版权方资讯-推荐阅读 请求参数 */
export interface GetRecommendedReadingUsingParams {
  /** @description 版权方资讯ID */
  id?: number
}

/** @description 通用返回使用响应体 */
export interface GetNextCopyrightInfoUsingResponse {
  /** @description 上一篇 */
  head: Head
  /** @description 下一篇 */
  next: Head
}

/** @description 上一篇-子类型 */
export interface Head {
  copyrightId: number
  copyrightName: string
  createBy: string
  createTime: string
  id: number
  infoAuthor: string
  infoDetails: string
  infoName: string
  infoPicture: string
  infoSort: number
  infoStatus: number
  infoSummary: string
  updateBy: string
  updateTime: string
  viewNumber: number
  viewNumberInit: number
}

/** @description 官网-版权方资讯-上一篇/下一篇 请求参数 */
export interface GetNextCopyrightInfoUsingParams {
  /** @description 版权方资讯ID */
  id?: number
}

/** @description 通用返回使用响应体 */
export interface GetPageCopyrightInfoListUsingResponse extends GetPageBackstageCopyrightInfoListUsingResponse {
}

/** @description 版权方资讯-列表 请求参数 */
export interface GetPageCopyrightInfoListUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 版权方ID */
  copyrightId?: number
  /** @description 排序，asc/desc */
  order?: string
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
}

/** @description 通用返回使用响应体 */
export interface GetPageIpInfoListUsingResponse extends GetPageBackstageIpInfoListUsingResponse {
}

/** @description 官网-版权方IP资讯-列表 请求参数 */
export interface GetPageIpInfoListUsingParams {
  /**
   * @example 10
   * @description 每页容量(默认10)
   */
  c?: number
  /** @description 版权方ID */
  copyrightId?: number
  /**
   * @example 1
   * @description 当前页
   */
  p?: number
  /** @description 是否按照浏览数排名，1:是，0：否 */
  viewNumber?: number
}

/** @description 官网-版权方-浏览接口 请求参数 */
export interface GetViewCopyrightUsing_1Params {
  /** @description copyrightInfoId */
  copyrightInfoId?: number
}

/** @description 版权方资讯-浏览接口 请求参数 */
export interface PostViewCopyrightInfoUsing_1Params {
  /** @description 版权方资讯ID */
  copyrightInfoId?: number
}

/** @description 指定文件删除 请求参数 */
export interface DeleteFilesFromCosUsingParams {
  urlList: string[]
}

/** @description 目标打包文件列表-子类型 */
export interface FileList {
  /** @description 文件名称 */
  fileName: string
  /** @description 文件地址 */
  url: string
}

/** @description 打包下载文件 请求参数 */
export interface PostPackDownLoadUsingParams {
  /** @description 目标打包文件列表 */
  fileList: FileList[]
  /** @description 打包文件名称定义 */
  packName: string
}

/** @description 文件上传 请求参数 */
export interface PostUploadFilesUsingParams {
  /** @description 自定义COS存储文件目录，按/开头，默认=/tiayin */
  dir?: string
  /** @description 文件体 */
  files?: []
}

/** @description 图库-取消收藏接口 请求参数 */
export interface GetCancelCollectGalleryUsingParams {
  /** @description 图库ID */
  galleryListId?: number
}

/** @description 图库-收藏接口 请求参数 */
export interface GetCollectCopyrightUsing_1Params {
  /** @description 图库ID */
  galleryListId?: number
}

/** @description 图库-浏览接口 请求参数 */
export interface GetViewGalleryUsingParams {
  /** @description 图库ID */
  galleryListId?: number
}

/** @description 通用返回使用响应体 */
export interface GetPageMessageRecordListUsingResponse {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: List_8[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 分页数据-子类型 */
export interface List_8 {
  /** @description 创建人 */
  createBy: string
  /** @description 创建时间 */
  createTime: string
  /** @description 消息msgId */
  msgId: string
  /** @description 成功人数 */
  sendSuccessNum: number
  /** @description 发送时间 */
  sendTime: string
  /** @description 发送人数 */
  sendToNum: number
  /** @description 发送状态：[0:未发送,1:发送中,2:已发送] */
  status: string
  /** @description 消息标题 */
  title: string
}

/** @description 消息发送列表 请求参数 */
export interface GetPageMessageRecordListUsingParams {
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

/** @description 测试-触发消息 请求参数 */
export interface GetTestSendUsingParams {
  /** @description phone */
  phone: string
  /** @description type */
  type: string
}

/** @description 通用返回使用响应体 */
export interface SendUsingResponse {
  /** @description ID */
  id: string
  /** @description 1：手机端 2：pc 3：全部 */
  mobileOrPc: string
  /** @description 二维码描述 */
  qrDescript: string
  /** @description 二维码分类 1：首页申请合作 2：首页客户服务 3：首页天音公众号 4：首页天音微博 5：IP获取详细资料 */
  qrType: string
  /** @description 二维码地址 */
  qrUrl: string
}

/** @description 按端/类型查询配置二维码 请求参数 */
export interface SendUsingParams {
  /** @description 1：手机端 2：pc 3：全部 */
  mobileOrPc?: string
  /** @description 配置类型：1：首页申请合作 2：首页客户服务 3：首页天音公众号 4：首页天音微博 5：IP获取详细资料 */
  qrType?: string
}

/** @description 通用返回使用响应体 */
export interface GetBottomBarV1ListUsingResponse {
  /** @description 子集标签 */
  children: Data[]
  /** @description 显示标签 */
  label: string
  /** @description 排序 */
  order: string
  /** @description 跳转连接地址 */
  url: string
}

/** @description 通用返回使用响应体 */
export interface GetIndexMenuListUsingResponse {
  /** @description 子菜单 */
  children: Data[]
  /** @description 主键ID */
  id: string
  /** @description 是否是首页 0 不是 1 是 */
  isIndex: string
  /** @description 1 展示 0 不展示 */
  isShow: string
  /** @description 菜单名称 */
  menuName: string
  /** @description 排序 */
  menuOrderly: string
  /** @description 菜单链接 */
  menuUrl: string
  /** @description 1 手机端 2 pc */
  mobileOrPc: string
  /** @description parent_id */
  parentId: string
  /** @description PC菜单链接 */
  pcMenuUrl: string
  /** @description seo描述 */
  seoDescription: string
  /** @description seo关键词 */
  seoKeyword: string
  /** @description seo标题 */
  seoTitle: string
  /** @description 网站简称 */
  webAbbreviation: string
}

/** @description 顶部菜单列表 请求参数 */
export interface GetIndexMenuListUsingParams {
  /** @description 1-手机端,3-pc */
  mobileOrPc?: string
}

/** @description 分组管理-删除 请求参数 */
export interface DeleteUsing_2Params {
  /** @description gid */
  gid: string
}

/** @description 通用返回使用响应体 */
export interface GetDetailUsingResponse {
  /** @description 销售分组基本信息 */
  group: Group
  /** @description 绑定选中的销售人员列表集合 */
  salesmanList: SalesList[]
}

/** @description 销售分组基本信息-子类型 */
export interface Group {
  /** @description 创建人 */
  createBy: string
  /** @description 创建时间 */
  createTime: string
  /** @description 自增分组主键ID */
  gid: string
  /** @description 分组名称 */
  groupAlias: string
  /** @description 业务类型-[IP认领,品牌服务,...] */
  groupType: string
  /** @description 业务类型中文描述-[IP认领,品牌服务,...] */
  groupTypeLabel: string
  /** @description 级联的销售用户列表信息 */
  salesList: SalesList[]
  /** @description 修改人 */
  updateBy: string
  /** @description 修改时间 */
  updateTime: string
}

/** @description 级联的销售用户列表信息-子类型 */
export interface SalesList {
  createBy: string
  /** @description 创建时间 */
  createTime: string
  /** @description 邮箱地址 */
  email: string
  /** @description 手机号 */
  phone: string
  /** @description 销售人员名称 */
  saleName: string
  /** @description 主键id */
  sid: string
  updateBy: string
  updateTime: string
}

/** @description 分组管理-详情 请求参数 */
export interface GetDetailUsingParams {
  /** @description gid */
  gid: string
}

/** @description 通用返回使用响应体 */
export interface GetPageSalesmanListUsingResponse {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: Group[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 分组管理-列表 请求参数 */
export interface GetPageSalesmanListUsingParams {
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

/** @description 分组管理-新增编辑保存 请求参数 */
export interface SaveUsing_2Params {
  /** @description 销售分组基本信息 */
  group: Group
  /** @description 绑定选中的销售人员sid集合 */
  sids: string[]
}

/** @description 销售人员管理-删除 请求参数 */
export interface DeleteUsing_3Params {
  /** @description sid */
  sid: string
}

/** @description 通用返回使用响应体 */
export interface GetDetailUsing_1Response {
  createBy: string
  /** @description 创建时间 */
  createTime: string
  /** @description 邮箱地址 */
  email: string
  /** @description 手机号 */
  phone: string
  /** @description 销售人员名称 */
  saleName: string
  /** @description 主键id */
  sid: string
  updateBy: string
  updateTime: string
}

/** @description 销售人员管理-详情 请求参数 */
export interface GetDetailUsing_1Params {
  /** @description sid */
  sid: string
}

/** @description 通用返回使用响应体 */
export interface GetPageSalesmanListUsing_1Response {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: SalesList[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 销售人员管理-列表 请求参数 */
export interface GetPageSalesmanListUsing_1Params {
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
export interface SelectListUsingResponse {
  createBy: string
  /** @description 创建时间 */
  createTime: string
  /** @description 邮箱地址 */
  email: string
  /** @description 手机号 */
  phone: string
  /** @description 销售人员名称 */
  saleName: string
  /** @description 主键id */
  sid: string
  updateBy: string
  updateTime: string
}

/** @description 销售人员管理-新增编辑保存 请求参数 */
export interface SaveUsing_3Params {
  createBy: string
  /** @description 创建时间 */
  createTime: string
  /** @description 邮箱地址 */
  email: string
  /** @description 手机号 */
  phone: string
  /** @description 销售人员名称 */
  saleName: string
  /** @description 主键id */
  sid: string
  updateBy: string
  updateTime: string
}

/** @description 短信-发送 请求参数 */
export interface SendUsing_1Params {
  /** @description 推送目标用户的手机号码 */
  phoneNumberSet: string[]
  /** @description 推送的模板ID #传入需要推送的短信模板ID */
  templateId: string
  /** @description 模板对应的参数数据，按顺序提供 */
  templateParamSet: string[]
}

/** @description 短信-发送 请求参数 */
export interface SendUsing_2Params {
  /** @description phone */
  phone: string
  /** @description 推送目标用户的手机号码 */
  phoneNumberSet: string[]
  /** @description 推送的模板ID #传入需要推送的短信模板ID */
  templateId: string
  /** @description 模板对应的参数数据，按顺序提供 */
  templateParamSet: string[]
  /** @description type */
  type: string
}

/** @id labelSelectUsingGET */
export type GetLabelSelectUsing = <T = GetLabelSelectUsingResponse>() => Promise<T>
/** @id deleteUsingGET */
export type DeleteUsing = <T = any>(params: DeleteUsingParams) => Promise<T>
/** @id detailsUsingGET */
export type GetDetailsUsing = <T = GetDetailsUsingResponse>(params: GetDetailsUsingParams) => Promise<T>
/** @id getCooperationIntentionsUsingGET */
export type GetCooperationIntentionsUsing = <T = GetCooperationIntentionsUsingResponse>() => Promise<T>
/** @id getCooperationTypeUsingGET */
export type GetCooperationTypeUsing = <T = any>() => Promise<T>
/** @id getFollowTypeUsingGET */
export type GetFollowTypeUsing = <T = any>() => Promise<T>
/** @id ipSaveUsingPOST */
export type PostIpSaveUsing = <T = any>(params: PostIpSaveUsingParams) => Promise<T>
/** @id pageCooperationListUsingGET */
export type GetPageCooperationListUsing = <T = GetPageCooperationListUsingResponse>(params: GetPageCooperationListUsingParams) => Promise<T>
/** @id saveUsingPOST_2 */
export type SaveUsing = <T = any>(params: SaveUsingParams) => Promise<T>
/** @id getActualIndexNumUsingGET */
export type GetActualIndexNumUsing = <T = GetActualIndexNumUsingResponse>(params: GetActualIndexNumUsingParams) => Promise<T>
/** @id cancelCollectPhotoUsingPOST */
export type PostCancelCollectPhotoUsing = <T = any>(params: PostCancelCollectPhotoUsingParams) => Promise<T>
/** @id handleCollectPhotoUsingPOST */
export type HandleCollectPhotoUsing = <T = any>(params: HandleCollectPhotoUsingParams) => Promise<T>
/** @id deleteCopyrightMajorInfoUsingGET */
export type DeleteCopyrightMajorInfoUsing = <T = any>(params: DeleteCopyrightMajorInfoUsingParams) => Promise<T>
/** @id deleteCopyrightPhotosRecordUsingPOST */
export type DeleteCopyrightPhotosRecordUsing = <T = any>(params: DeleteCopyrightPhotosRecordUsingParams) => Promise<T>
/** @id copyrightModuleDetailUsingPOST */
export type PostCopyrightModuleDetailUsing = <T = any>(params: PostCopyrightModuleDetailUsingParams) => Promise<T>
/** @id getDomainLabelListUsingGET */
export type GetDomainLabelListUsing = <T = GetDomainLabelListUsingResponse>() => Promise<T>
/** @id getAllCopyrightOwnerPhototsUsingPOST */
export type GetAllCopyrightOwnerPhototsUsing = <T = any>(params: GetAllCopyrightOwnerPhototsUsingParams) => Promise<T>
/** @id getCopyrightOwnerNamesUsingGET */
export type GetCopyrightOwnerNamesUsing = <T = GetCopyrightOwnerNamesUsingResponse>() => Promise<T>
/** @id getSeoDetailInfoUsingPOST */
export type GetSeoDetailInfoUsing = <T = GetSeoDetailInfoUsingResponse>(params: GetSeoDetailInfoUsingParams) => Promise<T>
/** @id handleCopyrightInfoUsingPOST */
export type HandleCopyrightInfoUsing = <T = any>(params: HandleCopyrightInfoUsingParams) => Promise<T>
/** @id selectCopyrightInfoListUsingPOST */
export type SelectCopyrightInfoListUsing = <T = SelectCopyrightInfoListUsingResponse>(params: SelectCopyrightInfoListUsingParams) => Promise<T>
/** @id getIpListUsingPOST */
export type GetIpListUsing = <T = GetIpListUsingResponse>(params: GetIpListUsingParams) => Promise<T>
/** @id handleCopyrightLabelInfoUsingPOST */
export type HandleCopyrightLabelInfoUsing = <T = any>(params: HandleCopyrightLabelInfoUsingParams) => Promise<T>
/** @id newOrUpdateCopyrightPhotosRecordUsingPOST */
export type PostNewOrUpdateCopyrightPhotosRecordUsing = <T = any>(params: PostNewOrUpdateCopyrightPhotosRecordUsingParams) => Promise<T>
/** @id getOfficialWebsiteBaseInfoUsingGET */
export type GetOfficialWebsiteBaseInfoUsing = <T = GetOfficialWebsiteBaseInfoUsingResponse>(params: GetOfficialWebsiteBaseInfoUsingParams) => Promise<T>
/** @id getPhotoCollectStatusUsingPOST */
export type GetPhotoCollectStatusUsing = <T = any>(params: GetPhotoCollectStatusUsingParams) => Promise<T>
/** @id getPhotoDetailUsingGET */
export type GetPhotoDetailUsing = <T = GetPhotoDetailUsingResponse>(params: GetPhotoDetailUsingParams) => Promise<T>
/** @id getPhotosRecordDetailUsingGET */
export type GetPhotosRecordDetailUsing = <T = GetPhotosRecordDetailUsingResponse>(params: GetPhotosRecordDetailUsingParams) => Promise<T>
/** @id selectCopyrightPhotosRecordsUsingPOST */
export type SelectCopyrightPhotosRecordsUsing = <T = SelectCopyrightPhotosRecordsUsingResponse>(params: SelectCopyrightPhotosRecordsUsingParams) => Promise<T>
/** @id handleCopyrightSeoInfoUsingPOST */
export type HandleCopyrightSeoInfoUsing = <T = any>(params: HandleCopyrightSeoInfoUsingParams) => Promise<T>
/** @id cancelCollectCopyrightUsingGET */
export type GetCancelCollectCopyrightUsing = <T = any>(params: GetCancelCollectCopyrightUsingParams) => Promise<T>
/** @id collectCopyrightUsingGET */
export type GetCollectCopyrightUsing = <T = any>(params: GetCollectCopyrightUsingParams) => Promise<T>
/** @id followCopyrightUsingGET */
export type GetFollowCopyrightUsing = <T = any>(params: GetFollowCopyrightUsingParams) => Promise<T>
/** @id getCopyrightCollectStatusUsingGET */
export type GetCopyrightCollectStatusUsing = <T = any>(params: GetCopyrightCollectStatusUsingParams) => Promise<T>
/** @id getCountByUserIdUsingGET */
export type GetCountByUserIdUsing = <T = any>() => Promise<T>
/** @id viewCopyrightUsingGET */
export type GetViewCopyrightUsing = <T = any>(params: GetViewCopyrightUsingParams) => Promise<T>
/** @id deleteUsingGET_1 */
export type DeleteUsing_1 = <T = any>(params: DeleteUsing_1Params) => Promise<T>
/** @id detailsUsingGET_1 */
export type GetDetailsUsing_1 = <T = GetDetailsUsing_1Response>(params: GetDetailsUsing_1Params) => Promise<T>
/** @id getBackstageIpListByCopyrightUsingGET */
export type GetBackstageIpListByCopyrightUsing = <T = GetBackstageIpListByCopyrightUsingResponse>(params: GetBackstageIpListByCopyrightUsingParams) => Promise<T>
/** @id getBackstageProductListUsingGET */
export type GetBackstageProductListUsing = <T = GetBackstageProductListUsingResponse>(params: GetBackstageProductListUsingParams) => Promise<T>
/** @id getCopyrightListUsingGET */
export type GetCopyrightListUsing = <T = GetCopyrightListUsingResponse>() => Promise<T>
/** @id pageBackstageCopyrightInfoListUsingGET */
export type GetPageBackstageCopyrightInfoListUsing = <T = GetPageBackstageCopyrightInfoListUsingResponse>(params: GetPageBackstageCopyrightInfoListUsingParams) => Promise<T>
/** @id pageBackstageIpInfoListUsingGET */
export type GetPageBackstageIpInfoListUsing = <T = GetPageBackstageIpInfoListUsingResponse>(params: GetPageBackstageIpInfoListUsingParams) => Promise<T>
/** @id saveUsingPOST_3 */
export type SaveUsing_1 = <T = any>(params: SaveUsing_1Params) => Promise<T>
/** @id viewCopyrightInfoUsingPOST */
export type PostViewCopyrightInfoUsing = <T = any>(params: PostViewCopyrightInfoUsingParams) => Promise<T>
/** @id detailsUsingGET_2 */
export type GetDetailsUsing_2 = <T = any>(params: GetDetailsUsing_2Params) => Promise<T>
/** @id getHotIpListByCopyrightUsingGET */
export type GetHotIpListByCopyrightUsing = <T = any>(params: GetHotIpListByCopyrightUsingParams) => Promise<T>
/** @id getIpListByCopyrightUsingGET */
export type GetIpListByCopyrightUsing = <T = any>(params: GetIpListByCopyrightUsingParams) => Promise<T>
/** @id getProductListUsingGET */
export type GetProductListUsing = <T = any>(params: GetProductListUsingParams) => Promise<T>
/** @id getRecommendedReadingUsingGET */
export type GetRecommendedReadingUsing = <T = any>(params: GetRecommendedReadingUsingParams) => Promise<T>
/** @id nextCopyrightInfoUsingGET */
export type GetNextCopyrightInfoUsing = <T = GetNextCopyrightInfoUsingResponse>(params: GetNextCopyrightInfoUsingParams) => Promise<T>
/** @id pageCopyrightInfoListUsingGET */
export type GetPageCopyrightInfoListUsing = <T = any>(params: GetPageCopyrightInfoListUsingParams) => Promise<T>
/** @id pageIpInfoListUsingGET */
export type GetPageIpInfoListUsing = <T = any>(params: GetPageIpInfoListUsingParams) => Promise<T>
/** @id viewCopyrightUsingGET_1 */
export type GetViewCopyrightUsing_1 = <T = any>(params: GetViewCopyrightUsing_1Params) => Promise<T>
/** @id viewCopyrightInfoUsingPOST_1 */
export type PostViewCopyrightInfoUsing_1 = <T = any>(params: PostViewCopyrightInfoUsing_1Params) => Promise<T>
/** @id deleteFilesFromCosUsingPOST */
export type DeleteFilesFromCosUsing = <T = any>(params: DeleteFilesFromCosUsingParams) => Promise<T>
/** @id packDownLoadUsingPOST */
export type PostPackDownLoadUsing = <T = any>(params: PostPackDownLoadUsingParams) => Promise<T>
/** @id uploadFilesUsingPOST */
export type PostUploadFilesUsing = <T = any>(params: PostUploadFilesUsingParams) => Promise<T>
/** @id cancelCollectGalleryUsingGET */
export type GetCancelCollectGalleryUsing = <T = any>(params: GetCancelCollectGalleryUsingParams) => Promise<T>
/** @id collectCopyrightUsingGET_1 */
export type GetCollectCopyrightUsing_1 = <T = any>(params: GetCollectCopyrightUsing_1Params) => Promise<T>
/** @id viewGalleryUsingGET */
export type GetViewGalleryUsing = <T = any>(params: GetViewGalleryUsingParams) => Promise<T>
/** @id pageMessageRecordListUsingGET */
export type GetPageMessageRecordListUsing = <T = GetPageMessageRecordListUsingResponse>(params: GetPageMessageRecordListUsingParams) => Promise<T>
/** @id testSendUsingGET */
export type GetTestSendUsing = <T = any>(params: GetTestSendUsingParams) => Promise<T>
/** @id sendUsingGET */
export type SendUsing = <T = SendUsingResponse>(params: SendUsingParams) => Promise<T>
/** @id getBottomBarV1ListUsingGET */
export type GetBottomBarV1ListUsing = <T = GetBottomBarV1ListUsingResponse>() => Promise<T>
/** @id getContactUsPlusQrImgUrlUsingGET */
export type GetContactUsPlusQrImgUrlUsing = <T = any>() => Promise<T>
/** @id getIndexMenuListUsingGET */
export type GetIndexMenuListUsing = <T = GetIndexMenuListUsingResponse>(params: GetIndexMenuListUsingParams) => Promise<T>
/** @id deleteUsingPOST */
export type DeleteUsing_2 = <T = any>(params: DeleteUsing_2Params) => Promise<T>
/** @id detailUsingGET */
export type GetDetailUsing = <T = GetDetailUsingResponse>(params: GetDetailUsingParams) => Promise<T>
/** @id pageSalesmanListUsingGET */
export type GetPageSalesmanListUsing = <T = GetPageSalesmanListUsingResponse>(params: GetPageSalesmanListUsingParams) => Promise<T>
/** @id saveUsingPOST */
export type SaveUsing_2 = <T = any>(params: SaveUsing_2Params) => Promise<T>
/** @id deleteUsingPOST_1 */
export type DeleteUsing_3 = <T = any>(params: DeleteUsing_3Params) => Promise<T>
/** @id detailUsingGET_1 */
export type GetDetailUsing_1 = <T = GetDetailUsing_1Response>(params: GetDetailUsing_1Params) => Promise<T>
/** @id pageSalesmanListUsingGET_1 */
export type GetPageSalesmanListUsing_1 = <T = GetPageSalesmanListUsing_1Response>(params: GetPageSalesmanListUsing_1Params) => Promise<T>
/** @id selectListUsingGET */
export type SelectListUsing = <T = SelectListUsingResponse>() => Promise<T>
/** @id saveUsingPOST_1 */
export type SaveUsing_3 = <T = any>(params: SaveUsing_3Params) => Promise<T>
/** @id sendUsingPOST_1 */
export type SendUsing_1 = <T = any>(params: SendUsing_1Params) => Promise<T>
/** @id sendUsingPOST */
export type SendUsing_2 = <T = any>(params: SendUsing_2Params) => Promise<T>
