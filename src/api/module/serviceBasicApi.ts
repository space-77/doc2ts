
import { ApiClient } from '../services/client'
import * as mT from './type/serviceBasicApi'

const basePath = '/tianyin-service-basic'

/**
 * @description serviceBasicApi
 */
class ServiceBasicApi extends ApiClient {
  /**
   * @description IP类型选择
  */
  getLabelSelectUsing: mT.GetLabelSelectUsing = () => {
    return this.request({ url: `${basePath}/common/ip/class/select` })
  }

  /**
   * @description 合作管理管理-删除
  */
  deleteUsing: mT.DeleteUsing = params => {
    return this.request({ url: `${basePath}/cooperative/delete?${this.serialize(params)}` })
  }

  /**
   * @description 合作管理-详情
  */
  getDetailsUsing: mT.GetDetailsUsing = params => {
    return this.request({ url: `${basePath}/cooperative/details?${this.serialize(params)}` })
  }

  /**
   * @description 合作管理-合作意向枚举下拉框
  */
  getCooperationIntentionsUsing: mT.GetCooperationIntentionsUsing = () => {
    return this.request({ url: `${basePath}/cooperative/getCooperationIntentions` })
  }

  /**
   * @description 合作管理-合作类型枚举下拉框
  */
  getCooperationTypeUsing: mT.GetCooperationTypeUsing = () => {
    return this.request({ url: `${basePath}/cooperative/getCooperationType` })
  }

  /**
   * @description 合作管理-跟进状态枚举下拉框
  */
  getFollowTypeUsing: mT.GetFollowTypeUsing = () => {
    return this.request({ url: `${basePath}/cooperative/getFollowType` })
  }

  /**
   * @description 合作管理管理-IP认领
  */
  postIpSaveUsing: mT.PostIpSaveUsing = params => {
    return this.request({ url: `${basePath}/cooperative/ipSave`, params })
  }

  /**
   * @description 合作管理-列表
  */
  getPageCooperationListUsing: mT.GetPageCooperationListUsing = params => {
    return this.request({ url: `${basePath}/cooperative/pageCooperationList?${this.serialize(params)}` })
  }

  /**
   * @description 合作管理-添加修改
  */
  saveUsing: mT.SaveUsing = params => {
    return this.request({ url: `${basePath}/cooperative/save`, params })
  }

  /**
   * @description 获取版权方实际热度/粉丝/收藏数
  */
  getActualIndexNumUsing: mT.GetActualIndexNumUsing = params => {
    return this.request({ url: `${basePath}/copyright/actualIndexNum?${this.serialize(params)}` })
  }

  /**
   * @description 官网主页取消收藏图片功能
  */
  postCancelCollectPhotoUsing: mT.PostCancelCollectPhotoUsing = params => {
    return this.request({ url: `${basePath}/copyright/cancelCollectPhoto`, params })
  }

  /**
   * @description 官网主页收藏图片功能
  */
  handleCollectPhotoUsing: mT.HandleCollectPhotoUsing = params => {
    return this.request({ url: `${basePath}/copyright/collectPhoto`, params })
  }

  /**
   * @description 版权方主数据信息删除
  */
  deleteCopyrightMajorInfoUsing: mT.DeleteCopyrightMajorInfoUsing = params => {
    return this.request({ url: `${basePath}/copyright/delete?${this.serialize(params)}` })
  }

  /**
   * @description 删除版权方图库信息主数据
  */
  deleteCopyrightPhotosRecordUsing: mT.DeleteCopyrightPhotosRecordUsing = ({ id }) => {
    return this.request({ url: `${basePath}/copyright/deleteCopyrightPhotosRecord/${id}`, method: 'post' })
  }

  /**
   * @description 版权方主数据详情信息
  */
  postCopyrightModuleDetailUsing: mT.PostCopyrightModuleDetailUsing = params => {
    return this.request({ url: `${basePath}/copyright/detail`, params })
  }

  /**
   * @description 获取领域标签信息
  */
  getDomainLabelListUsing: mT.GetDomainLabelListUsing = () => {
    return this.request({ url: `${basePath}/copyright/domainLabel` })
  }

  /**
   * @description 获取版权方所有上传的图片集
  */
  getAllCopyrightOwnerPhototsUsing: mT.GetAllCopyrightOwnerPhototsUsing = params => {
    return this.request({ url: `${basePath}/copyright/getAllCopyrightOwnerPhotots`, params })
  }

  /**
   * @description 获取版权方名称
  */
  getCopyrightOwnerNamesUsing: mT.GetCopyrightOwnerNamesUsing = () => {
    return this.request({ url: `${basePath}/copyright/getCopyrightNames` })
  }

  /**
   * @description 根据版权方id获取各对象的seo信息
  */
  getSeoDetailInfoUsing: mT.GetSeoDetailInfoUsing = params => {
    return this.request({ url: `${basePath}/copyright/getSeoDetailInfo?${this.serialize(params)}` })
  }

  /**
   * @description 版权方信息进行新增/更新
  */
  handleCopyrightInfoUsing: mT.HandleCopyrightInfoUsing = params => {
    return this.request({ url: `${basePath}/copyright/info`, params })
  }

  /**
   * @description 版权方主信息管理列表
  */
  selectCopyrightInfoListUsing: mT.SelectCopyrightInfoListUsing = params => {
    return this.request({ url: `${basePath}/copyright/infoList`, params })
  }

  /**
   * @description ip列表信息查询
  */
  getIpListUsing: mT.GetIpListUsing = params => {
    return this.request({ url: `${basePath}/copyright/ipList`, params })
  }

  /**
   * @description 版权方标签信息进行新增/更新
  */
  handleCopyrightLabelInfoUsing: mT.HandleCopyrightLabelInfoUsing = params => {
    return this.request({ url: `${basePath}/copyright/label`, params })
  }

  /**
   * @description 新增/更新版权方图库信息主数据
  */
  postNewOrUpdateCopyrightPhotosRecordUsing: mT.PostNewOrUpdateCopyrightPhotosRecordUsing = params => {
    return this.request({ url: `${basePath}/copyright/newOrUpdateCopyrightPhotosRecord`, params })
  }

  /**
   * @description 获取版权方官网主页基本信息
  */
  getOfficialWebsiteBaseInfoUsing: mT.GetOfficialWebsiteBaseInfoUsing = params => {
    return this.request({ url: `${basePath}/copyright/officialWebsiteBaseInfo?${this.serialize(params)}` })
  }

  /**
   * @description 官网主页进入图片详情获取图片收藏状态
  */
  getPhotoCollectStatusUsing: mT.GetPhotoCollectStatusUsing = params => {
    return this.request({ url: `${basePath}/copyright/photoCollectStatus`, params })
  }

  /**
   * @description 官网主页获取图库中某图片详情信息
  */
  getPhotoDetailUsing: mT.GetPhotoDetailUsing = ({ id }) => {
    return this.request({ url: `${basePath}/copyright/photoDetail/${id}` })
  }

  /**
   * @description 获取版权方后台管理界面图库信息详情
  */
  getPhotosRecordDetailUsing: mT.GetPhotosRecordDetailUsing = ({ id }) => {
    return this.request({ url: `${basePath}/copyright/photosDetail/${id}` })
  }

  /**
   * @description 查看版权方图库信息主数据列表
  */
  selectCopyrightPhotosRecordsUsing: mT.SelectCopyrightPhotosRecordsUsing = params => {
    return this.request({ url: `${basePath}/copyright/selectCopyrightPhotosRecords`, params })
  }

  /**
   * @description 版权方seo配置信息进行新增/更新
  */
  handleCopyrightSeoInfoUsing: mT.HandleCopyrightSeoInfoUsing = params => {
    return this.request({ url: `${basePath}/copyright/seo`, params })
  }

  /**
   * @description 版权方-取消收藏接口
  */
  getCancelCollectCopyrightUsing: mT.GetCancelCollectCopyrightUsing = params => {
    return this.request({ url: `${basePath}/copyrightCollect/cancelCollectCopyright?${this.serialize(params)}` })
  }

  /**
   * @description 版权方-收藏接口
  */
  getCollectCopyrightUsing: mT.GetCollectCopyrightUsing = params => {
    return this.request({ url: `${basePath}/copyrightCollect/collectCopyright?${this.serialize(params)}` })
  }

  /**
   * @description 版权方-关注接口
  */
  getFollowCopyrightUsing: mT.GetFollowCopyrightUsing = params => {
    return this.request({ url: `${basePath}/copyrightCollect/followCopyright?${this.serialize(params)}` })
  }

  /**
   * @description 版权方-用户是否收藏接口
  */
  getCopyrightCollectStatusUsing: mT.GetCopyrightCollectStatusUsing = params => {
    return this.request({ url: `${basePath}/copyrightCollect/getCopyrightCollectStatus?${this.serialize(params)}` })
  }

  /**
   * @description 我的收藏数量接口
  */
  getCountByUserIdUsing: mT.GetCountByUserIdUsing = () => {
    return this.request({ url: `${basePath}/copyrightCollect/getCountByUserId` })
  }

  /**
   * @description 版权方-浏览接口
  */
  getViewCopyrightUsing: mT.GetViewCopyrightUsing = params => {
    return this.request({ url: `${basePath}/copyrightCollect/viewCopyright`, params, method: 'get' })
  }

  /**
   * @description 版权方资讯-删除
  */
  deleteUsing_1: mT.DeleteUsing_1 = params => {
    return this.request({ url: `${basePath}/copyrightInfo/delete?${this.serialize(params)}` })
  }

  /**
   * @description 版权方资讯-详情
  */
  getDetailsUsing_1: mT.GetDetailsUsing_1 = params => {
    return this.request({ url: `${basePath}/copyrightInfo/details?${this.serialize(params)}` })
  }

  /**
   * @description 后台-版权方-IP作品列表页
  */
  getBackstageIpListByCopyrightUsing: mT.GetBackstageIpListByCopyrightUsing = params => {
    return this.request({ url: `${basePath}/copyrightInfo/getBackstageIpListByCopyright?${this.serialize(params)}` })
  }

  /**
   * @description 后台-版权方-案例集列表接口
  */
  getBackstageProductListUsing: mT.GetBackstageProductListUsing = params => {
    return this.request({ url: `${basePath}/copyrightInfo/getBackstageProductList?${this.serialize(params)}` })
  }

  /**
   * @description 版权方-版权方自身列表
  */
  getCopyrightListUsing: mT.GetCopyrightListUsing = () => {
    return this.request({ url: `${basePath}/copyrightInfo/getCopyrightList` })
  }

  /**
   * @description 版权方资讯-列表
  */
  getPageBackstageCopyrightInfoListUsing: mT.GetPageBackstageCopyrightInfoListUsing = params => {
    const bodyParams = ['copyrightName','order']
    const body = this.extractParams(params, bodyParams)
    const queryParams = ['c','p']
    const query = this.extractParams(params, queryParams)
    return this.request({ url: `${basePath}/copyrightInfo/pageBackstageCopyrightInfoList?${this.serialize(query)}`, params: body, method: 'get' })
  }

  /**
   * @description 后台-版权方IP资讯-列表
  */
  getPageBackstageIpInfoListUsing: mT.GetPageBackstageIpInfoListUsing = params => {
    return this.request({ url: `${basePath}/copyrightInfo/pageBackstageIpInfoList?${this.serialize(params)}` })
  }

  /**
   * @description 版权方资讯-添加修改
  */
  saveUsing_1: mT.SaveUsing_1 = params => {
    return this.request({ url: `${basePath}/copyrightInfo/save` })
  }

  /**
   * @description 版权方资讯-浏览接口
  */
  postViewCopyrightInfoUsing: mT.PostViewCopyrightInfoUsing = params => {
    return this.request({ url: `${basePath}/copyrightInfo/viewCopyrightInfo?${this.serialize(params)}` })
  }

  /**
   * @description 官网-版权方资讯-详情
  */
  getDetailsUsing_2: mT.GetDetailsUsing_2 = params => {
    return this.request({ url: `${basePath}/copyrightInfomation/details?${this.serialize(params)}` })
  }

  /**
   * @description 官网-版权方资讯-热门IP
  */
  getHotIpListByCopyrightUsing: mT.GetHotIpListByCopyrightUsing = params => {
    return this.request({ url: `${basePath}/copyrightInfomation/getHotIpListByCopyright?${this.serialize(params)}` })
  }

  /**
   * @description 官网-版权方-IP作品列表页
  */
  getIpListByCopyrightUsing: mT.GetIpListByCopyrightUsing = params => {
    return this.request({ url: `${basePath}/copyrightInfomation/getIpListByCopyright?${this.serialize(params)}` })
  }

  /**
   * @description 官网-版权方-案例集列表接口
  */
  getProductListUsing: mT.GetProductListUsing = params => {
    return this.request({ url: `${basePath}/copyrightInfomation/getProductList?${this.serialize(params)}` })
  }

  /**
   * @description 官网-版权方资讯-推荐阅读
  */
  getRecommendedReadingUsing: mT.GetRecommendedReadingUsing = params => {
    return this.request({ url: `${basePath}/copyrightInfomation/getRecommendedReading?${this.serialize(params)}` })
  }

  /**
   * @description 官网-版权方资讯-上一篇/下一篇
  */
  getNextCopyrightInfoUsing: mT.GetNextCopyrightInfoUsing = params => {
    return this.request({ url: `${basePath}/copyrightInfomation/nextCopyrightInfo?${this.serialize(params)}` })
  }

  /**
   * @description 版权方资讯-列表
  */
  getPageCopyrightInfoListUsing: mT.GetPageCopyrightInfoListUsing = params => {
    return this.request({ url: `${basePath}/copyrightInfomation/pageCopyrightInfoList?${this.serialize(params)}` })
  }

  /**
   * @description 官网-版权方IP资讯-列表
  */
  getPageIpInfoListUsing: mT.GetPageIpInfoListUsing = params => {
    return this.request({ url: `${basePath}/copyrightInfomation/pageIpInfoList?${this.serialize(params)}` })
  }

  /**
   * @description 官网-版权方-浏览接口
  */
  getViewCopyrightUsing_1: mT.GetViewCopyrightUsing_1 = params => {
    return this.request({ url: `${basePath}/copyrightInfomation/viewCopyright?${this.serialize(params)}` })
  }

  /**
   * @description 版权方资讯-浏览接口
  */
  postViewCopyrightInfoUsing_1: mT.PostViewCopyrightInfoUsing_1 = params => {
    return this.request({ url: `${basePath}/copyrightInfomation/viewCopyrightInfo?${this.serialize(params)}` })
  }

  /**
   * @description 指定文件删除
  */
  deleteFilesFromCosUsing: mT.DeleteFilesFromCosUsing = params => {
    return this.request({ url: `${basePath}/file/delete`, params })
  }

  /**
   * @description 打包下载文件
  */
  postPackDownLoadUsing: mT.PostPackDownLoadUsing = params => {
    return this.request({ url: `${basePath}/file/pack/download`, params })
  }

  /**
   * @description 文件上传
  */
  postUploadFilesUsing: mT.PostUploadFilesUsing = params => {
    return this.request({ url: `${basePath}/file/upload?${this.serialize(params)}` })
  }

  /**
   * @description 图库-取消收藏接口
  */
  getCancelCollectGalleryUsing: mT.GetCancelCollectGalleryUsing = params => {
    return this.request({ url: `${basePath}/galleryCollect/cancelCollectGallery?${this.serialize(params)}` })
  }

  /**
   * @description 图库-收藏接口
  */
  getCollectCopyrightUsing_1: mT.GetCollectCopyrightUsing_1 = params => {
    return this.request({ url: `${basePath}/galleryCollect/collectGallery?${this.serialize(params)}` })
  }

  /**
   * @description 图库-浏览接口
  */
  getViewGalleryUsing: mT.GetViewGalleryUsing = params => {
    return this.request({ url: `${basePath}/galleryCollect/viewGallery?${this.serialize(params)}` })
  }

  /**
   * @description 消息发送列表
  */
  getPageMessageRecordListUsing: mT.GetPageMessageRecordListUsing = params => {
    return this.request({ url: `${basePath}/message/record/list?${this.serialize(params)}` })
  }

  /**
   * @description 测试-触发消息
  */
  getTestSendUsing: mT.GetTestSendUsing = params => {
    return this.request({ url: `${basePath}/message/test/send?${this.serialize(params)}` })
  }

  /**
   * @description 按端/类型查询配置二维码
  */
  sendUsing: mT.SendUsing = params => {
    return this.request({ url: `${basePath}/qr/query?${this.serialize(params)}` })
  }

  /**
   * @description 底部配置快捷栏加载列表
  */
  getBottomBarV1ListUsing: mT.GetBottomBarV1ListUsing = () => {
    return this.request({ url: `${basePath}/routine/bottom/bar/list` })
  }

  /**
   * @description 联系我们二维码图片地址
  */
  getContactUsPlusQrImgUrlUsing: mT.GetContactUsPlusQrImgUrlUsing = () => {
    return this.request({ url: `${basePath}/routine/contact/qr/img` })
  }

  /**
   * @description 顶部菜单列表
  */
  getIndexMenuListUsing: mT.GetIndexMenuListUsing = params => {
    return this.request({ url: `${basePath}/routine/menus/list?${this.serialize(params)}` })
  }

  /**
   * @description 分组管理-删除
  */
  deleteUsing_2: mT.DeleteUsing_2 = ({ gid }) => {
    return this.request({ url: `${basePath}/sales/group/delete/${gid}`, method: 'post' })
  }

  /**
   * @description 分组管理-详情
  */
  getDetailUsing: mT.GetDetailUsing = ({ gid }) => {
    return this.request({ url: `${basePath}/sales/group/detail/${gid}` })
  }

  /**
   * @description 分组管理-列表
  */
  getPageSalesmanListUsing: mT.GetPageSalesmanListUsing = params => {
    return this.request({ url: `${basePath}/sales/group/list?${this.serialize(params)}` })
  }

  /**
   * @description 分组管理-新增编辑保存
  */
  saveUsing_2: mT.SaveUsing_2 = params => {
    return this.request({ url: `${basePath}/sales/group/save`, params })
  }

  /**
   * @description 销售人员管理-删除
  */
  deleteUsing_3: mT.DeleteUsing_3 = ({ sid }) => {
    return this.request({ url: `${basePath}/salesman/delete/${sid}`, method: 'post' })
  }

  /**
   * @description 销售人员管理-详情
  */
  getDetailUsing_1: mT.GetDetailUsing_1 = ({ sid }) => {
    return this.request({ url: `${basePath}/salesman/detail/${sid}` })
  }

  /**
   * @description 销售人员管理-列表
  */
  getPageSalesmanListUsing_1: mT.GetPageSalesmanListUsing_1 = params => {
    return this.request({ url: `${basePath}/salesman/list?${this.serialize(params)}` })
  }

  /**
   * @description 销售人员选择列表
  */
  selectListUsing: mT.SelectListUsing = () => {
    return this.request({ url: `${basePath}/salesman/list/select` })
  }

  /**
   * @description 销售人员管理-新增编辑保存
  */
  saveUsing_3: mT.SaveUsing_3 = params => {
    return this.request({ url: `${basePath}/salesman/save` })
  }

  /**
   * @description 短信-发送
  */
  sendUsing_1: mT.SendUsing_1 = params => {
    return this.request({ url: `${basePath}/sms/send`, params })
  }

  /**
   * @description 短信-发送
  */
  sendUsing_2: mT.SendUsing_2 = ({ phone, ...params }) => {
    const bodyParams = ['phoneNumberSet','templateId','templateParamSet']
    const body = this.extractParams(params, bodyParams)
    const queryParams = ['type']
    const query = this.extractParams(params, queryParams)
    return this.request({ url: `${basePath}/sms/send/${phone}?${this.serialize(query)}`, params: body })
  }
}

export default new ServiceBasicApi()
