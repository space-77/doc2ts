export type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value
}
export type ExportValue<T, U> = U extends keyof T ? T[U] : T

/** @description AdjustTheRecordTurnover请求体 */
export interface AdjustTheRecordTurnover {
  /** @description 营业额id */
  turnoverId: string
}
/** @description AdjustTheRecordTurnover返回体 */
export interface AdjustTheRecordsOfLocalTurnover {
  /** @description 调整后的笔数 */
  count?: number
  /** @description 审核状态 */
  examineStatus?: string
  /** @description 附件列表 */
  fileEntityList?: Array<File>
  /** @description id */
  id?: string
  /** @description 原来的photo */
  lastPhoto?: string
  /** @description 调整后的金额 */
  money?: number
  /** @description 调整后的photo */
  newPhoto?: string
  /** @description 调整原因 */
  reason?: string
  /** @description 上报日期 */
  reportDate?: string
  /** @description 所属营业额id */
  turnoverId?: string
  /** @description 修改时间 */
  updateTime?: string
  /** @description 修改人ID */
  updateUserId?: string
  /** @description 修改人 */
  updateUserName?: string
}
/** @description Bill返回体 */
export interface Bill {
  /** @description 商铺id */
  id?: string
  /** @description Bill下载地址 */
  receiveFileUrl?: string
}
/** @description CalendarDayTurnoverReport返回体 */
export interface CalendarDayTurnoverReport {
  /** @description 调整数目 */
  adjustCount?: number
  /** @description 调整金额 */
  adjustMoney?: number
  /** @description 上报笔数 */
  count?: number
  /** @description 上报时间 */
  createTime?: string
  /** @description 上报人ID */
  createUserId?: string
  /** @description 上报人名称 */
  createUserName?: string
  /** @description 修改记录条数 */
  editSize?: number
  /** @description 最终数目 */
  finalCount?: number
  /** @description 最终金额 */
  finalMoney?: number
  /** @description 最终的照片链接 */
  finalPhoto?: string
  /** @description ID */
  id?: string
  /** @description 照片链接(分号隔开) */
  photo?: string
  /** @description 备注 */
  remark?: string
  /** @description 上报日期 */
  reportDate?: string
  /** @description 商铺id */
  shopId?: string
  /** @description 营业额 */
  sumMoney?: number
}
/** @description CalendarMonthTurnoverReport返回体 */
export interface CalendarMonthTurnoverReport {
  /** @description 调整数目 */
  adjustCount?: number
  /** @description 调整金额 */
  adjustMoney?: number
  /** @description 上报笔数 */
  count?: number
  /** @description 上报时间 */
  createTime?: string
  /** @description 上报人ID */
  createUserId?: string
  /** @description 上报人名称 */
  createUserName?: string
  /** @description 每天营业 */
  dayBDList?: Array<CalendarDayTurnoverReport>
  /** @description 计算-日累计笔数 */
  dayTotalCount?: number
  /** @description 计算-日累计金额 */
  dayTotalMoney?: number
  /** @description 修改记录条数 */
  editSize?: number
  /** @description 最终数目 */
  finalCount?: number
  /** @description 最终金额 */
  finalMoney?: number
  /** @description 最终的照片链接 */
  finalPhoto?: string
  /** @description ID */
  id?: string
  /** @description 照片链接(分号隔开) */
  photo?: string
  /** @description 备注 */
  remark?: string
  /** @description 上报月份 */
  reportDate?: string
  /** @description 商铺id */
  shopId?: string
  /** @description 营业额 */
  sumMoney?: number
}
/** @description CouponHistory */
export interface CouponHistory {
  /** @description 有效期开始日期 */
  begin_date?: string
  /** @description 有效期开始日期:1=固定日期；2=领取日X天后 */
  begin_date_type?: number
  /** @description 天数 */
  begin_day?: number
  /** @description 已核销人数 */
  check_person?: number
  /** @description 已核销数量 */
  check_total?: number
  /** @description 优惠券图片 */
  coupon_img?: string
  /** @description 优惠券状态 0可发放   1停用 */
  coupon_status?: number
  /** @description 有效期结束 */
  end_date?: string
  /** @description 有效期结束日期1=固定日期；2=领取日X天后;3=同会员有效期 */
  end_date_type?: number
  /** @description 天数 */
  end_day?: number
  /** @description 标识ID */
  id?: string
  /** @description 是否可积分兑换  0 否 1 是 */
  is_point?: number
  /** @description 是否在B端显示  0 否 1是 */
  is_showB?: number
  /** @description 适用范围（后端拼接） */
  limit?: string
  /** @description 限制领取数量 */
  limit_have_total?: number
  /** @description 限制领取数量:1=不限制；2=限制 */
  limit_have_type?: number
  /** @description 券名称 */
  name?: string
  /** @description 所需积分 */
  point?: number
  /** @description 已领取人数 */
  receive_person?: number
  /** @description 已领取数量 */
  receive_total?: number
  /** @description 当前库存 */
  remain_total?: number
  /** @description 店铺 */
  store?: Array<StoreInformation>
  /** @description 店铺已核销人数 */
  storecheck_person?: number
  /** @description 店铺已核销数量 */
  storecheck_total?: number
  /** @description 店铺当天核销人数 */
  storetoday_check_person?: number
  /** @description 店铺当天核销数量 */
  storetoday_check_total?: number
  /** @description 劵标识（常规劵、会员特权、高管特权） */
  tag?: string
  /** @description 券标题 */
  title?: string
  /** @description 当天核销人数 */
  today_check_person?: number
  /** @description 当天核销数量 */
  today_check_total?: number
  /** @description 总库存 */
  total?: number
  /** @description 券类型：1=代金券；2=折扣券；3=满减券；4=服务券；5=礼品券 6=停车券 */
  type?: number
  /** @description 使用说明 */
  use_desc?: string
}
/** @description DayTurnover */
export interface DayTurnover {
  /** @description 调整营业额钱数 */
  adjustMoney?: number
  /** @description 日期 */
  date?: string
  /** @description 最终金额 */
  finalMoney?: number
  /** @description 店铺id */
  shopId?: string
  /** @description 营业额 */
  sumMoney?: number
}
/** @description File返回体 */
export interface File {
  /** @description File名称 */
  fileName?: string
  /** @description File路径 */
  filePath?: string
  /** @description id */
  id?: string
  /** @description File新名称 */
  newFileName?: string
}
/** @description 通用返回使用响应体 */
export interface GeneralResponseBody<JSONObject> {
  /** @description code编码 */
  code?: string
  /** @description 对应类 */
  data?: ObjectMap<any, object>
  /** @description 对应类 */
  id?: string
  /** @description msg */
  msg?: string
}
export interface JSONObject {}
/** @description ListOfCoupons请求体 */
export interface ListOfCoupons {
  /** @description 优惠类型[0=所有1=代金2=折扣3=满减券4=服务券5=礼品券6=停车券] */
  couponType?: number
  /** @description 卷类型[0=所有1=全场2=店铺券] */
  limitType?: number
  /** @description 当前页 */
  pageNumber: number
  /** @description 每页显示条数 */
  pageSize: number
  /** @description 领取类型[0=所有；1=未领完；2=已抢光] */
  stockType?: number
  /** @description 过期类型[0=所有；1=未过期；3=已过期] */
  validType?: number
}
/** @description ListToTurnover请求体 */
export interface ListToTurnover {
  /** @description 结束时间 */
  endTime: string
  /** @description 开始时间(查询开始-结束时间的营业额) */
  startTime: string
}
/** @description TurnoverCalendar请求体 */
export interface LocalSalesCalendar {
  /** @description 日起始日期 */
  date: string
  /** @description date/按日期，money/按零售额 */
  orderBy: string
}
export interface MemberAllCoupon {
  /** @description 手机号 */
  coupons?: Array<CouponHistory>
  /** @description 手机号 */
  sum?: string
  /** @description 已核销 */
  writeOff?: string
}
export interface MemberInfoCouponResponseDTO {
  /** @description 有效期开始时间（仅valid_date_type=1时必填） */
  begin_date?: string
  /** @description 有效期开始时间类型：1=固定时间；2=领取日； */
  begin_date_type?: number
  /** @description 有效期开始日（仅valid_date_type=2时必填）注：为0时认为即时生效；单位：天 */
  begin_day?: number
  /** @description 小程序码 */
  codePath?: string
  /** @description 封面 */
  coupon_img?: string
  /** @description 标识ID */
  couponid?: string
  /** @description 创建时间 */
  create_time?: string
  /** @description 折扣（仅type=2时必填） */
  discount?: number
  /** @description 有效期结束时间（仅valid_date_type=1时必填） */
  end_date?: string
  /** @description 失效时间限制类型：0.固定日期 1.自领取日期天数后失效 2.其他[俊思，根据会员会籍时间设置过期时间] */
  end_date_type?: number
  /** @description 有效期结束日（仅valid_date_type=2时必填）注：单位：天 */
  end_day?: number
  /** @description 劵标识（常规劵、会员特权、高管特权） */
  id?: string
  /** @description 是否可积分兑换  0 否 1 是 */
  is_point?: number
  /** @description 适用范围（后羰拼接） */
  limit?: string
  /** @description 限制拥有总数 */
  limit_have_total?: number
  /** @description 限制拥有类型：1=不限制；2=限制 */
  limit_have_type?: number
  /** @description 订单金额限制（举例：满100才可用） */
  limit_order_amount?: number
  /** @description 订单金额限制类型：1=不限制；2=限制 */
  limit_order_amount_type?: number
  /** @description 满足多少金额（仅type=3时必填） */
  meet_amount?: number
  /** @description 券名称 */
  name?: string
  /** @description 停车时长(仅type=6时必填)，单位小时 */
  parking_hour?: number
  /** @description 所需积分 */
  point?: number
  /** @description 减免金额（仅type=1/3时必填） */
  reduce_amount?: number
  /** @description 关联值（非type=1/2/3时必填）注：描述优惠作用 */
  rel_value?: string
  /** @description 剩余库存数 */
  remain_total?: number
  /** @description 适用店铺名单 */
  store?: Array<StoreInformation>
  /** @description 标题 */
  title?: string
  /** @description 总库存数 */
  total?: number
  /** @description 券类型：1=代金券；2=折扣券；3=满减券；4=服务券；5=礼品券 6=停车券 */
  type?: number
  /** @description 使用说明 */
  use_desc?: string
}
/** @description MessageAuthentication码请求体 */
export interface MessageAuthentication {
  /** @description 手机号 */
  phone: string
  /** @description 短信类型[1.创建B端TheUser,2.修改手机号,3.忘记密码] */
  type?: string
}
/** @description ModifyTheUserRequest体 */
export interface ModifyTheUserRequest {
  /** @description TheUser状态 0未启用，1已启用 */
  accountStatus?: string
  /** @description 验证码 */
  code: string
  /** @description id */
  id: string
  /** @description 配置的菜单id */
  menuId?: Array<string>
}
/** @description ModifyTheUserTypes请求体 */
export interface ModifyTheUserTypes {
  /** @description TheUser状态 0未启用，1已启用 */
  accountStatus?: string
  /** @description id */
  id: string
}
/** @description 分页通用使用响应体 */
export interface PagingResponseBody<WeChat2BResponseActivities> {
  /** @description 总数量 */
  count?: number
  /** @description 分页数据 */
  list?: Array<WeChat2BResponseActivities>
  /** @description 当前页 */
  page?: number
}
/** @description PermissionsList */
export interface PermissionsList {
  /** @description 权限id */
  id?: string
  /** @description 权限名称 */
  name?: string
}
/** @description ShoppingList */
export interface ShoppingList {
  /** @description 商场ID */
  marketId?: string
  /** @description 商场名称 */
  marketName?: string
}
/** @description 上报营业额 */
export interface SmallProgram2BSideEntity {
  /** @description 调整数目 */
  adjustCount?: number
  /** @description 调整金额 */
  adjustMoney?: number
  /** @description 上报笔数 */
  count: number
  /** @description 创建时间 */
  createTime?: string
  /** @description 创建人ID */
  createUserId: string
  /** @description 创建人 */
  createUserName: string
  /** @description 数据来源，app/手机端上报，pc/管理端上传 */
  dataSource: string
  /** @description ID */
  id?: string
  /** @description 照片链接 */
  photo?: string
  /** @description 备注 */
  remark?: string
  /** @description 上报日期 */
  reportDate: string
  /** @description 上报类型  month/月，day/日 */
  reportType: string
  /** @description 商铺id */
  shopId: string
  /** @description 商铺名称 */
  shopName: string
  /** @description 铺位号 */
  shopNo?: string
  /** @description 上报营业额钱数 */
  sumMoney: number
  /** @description 修改时间 */
  updateTime?: string
  /** @description 修改人ID */
  updateUserId?: string
  /** @description 修改人 */
  updateUserName?: string
}
/** @description SmallProgramEndBusinessQueryReturns */
export interface SmallProgramEndBusinessQueryReturns {
  /** @description 商管姓名 */
  name?: string
  /** @description 商管电话号 */
  phone?: string
}
/** @description SmallProgramEndReportQueryBody */
export interface SmallProgramEndReportQueryBody {
  /** @description 每页容量(默认10) */
  c?: number
  /** @description 上报人id */
  createUserId?: string
  /** @description 上报人电话号 */
  createUserPhone?: string
  /** @description 活动结束时间 */
  endTime?: string
  /** @description 当前页 */
  p?: number
  /** @description 店铺id */
  shopId?: string
  /** @description 活动起始时间 */
  startTime?: string
}
/** @description 上报活动请求类 */
export interface SmallProgramEndReportRequestActivities {
  /** @description 创建时间 */
  createTime?: string
  /** @description 上报人id */
  createUserId?: string
  /** @description 上报人 */
  createUserName?: string
  /** @description 上报人电话号 */
  createUserPhone?: string
  /** @description 活动结束时间 */
  endTime: string
  /** @description 上传的活动照片链接 */
  fileUrl: string
  /** @description id */
  id?: string
  /** @description 活动简介 */
  introduce: string
  /** @description 店铺id */
  shopId?: string
  /** @description 店铺名称 */
  shopName?: string
  /** @description 活动起始时间 */
  startTime: string
}
/** @description StoreInformation */
export interface StoreInformation {
  /** @description 店铺编号 */
  storeCode?: string
  /** @description 店铺名称 */
  storeName?: string
}
/** @description StoreListQuery请求体 */
export interface StoreListQuery {
  /** @description TheUserid */
  market: string
  /** @description 店铺名称 */
  shopName?: string
}
/** @description StorePersonnel */
export interface StorePersonnel {
  bid?: string
  cid?: string
  /** @description StorePersonnelID */
  id?: string
  /** @description 名称 */
  name?: string
  /** @description 手机号 */
  phone?: string
  /** @description 状态[0是正常，1是停用] */
  status?: string
  /** @description 是否启用 */
  type?: string
}
/** @description StoreTheUser */
export interface StoreTheUser {
  /** @description TheUser状态【1、可用 0禁用】 */
  accountStatus?: string
  /** @description ID */
  id?: string
  /** @description 手机号 */
  phone?: string
  /** @description TheUser名 */
  userName?: string
}
/** @description SwitchTheUserRequestBody */
export interface SwitchTheUserRequestBody {
  /** @description 商铺id */
  shopId: string
  /** @description TheUserid */
  userId: string
}
/** @description 报事报修业务AddDTO */
export interface TheDTORepairServiceBusiness {
  /** @description 描述 */
  describe: string
  /** @description 图片url地址 */
  imageUrlsList: Array<string>
  /** @description 手机号 */
  phone: string
  /** @description 区域 店内:instore 公区:publicDistrict */
  region: string
  /** @description 类型 1.申请事项：applicationItems 2.维修:repair */
  type: string
}
/** @description TheListAboutTheRepairList */
export interface TheListAboutTheRepairList {
  /** @description 数据条数 */
  dataCount?: number
  /** @description 报事报修数据集 */
  pageResult?: PagingResponseBody<WeChat2BResponseActivities>
  /** @description 待处理数量 */
  stateCount?: number
  /** @description 店铺数量 */
  stopCount?: number
}
/** @description TheRoleList */
export interface TheRoleList {
  /** @description 角色id */
  id?: string
  /** @description 角色名称 */
  name?: string
  /** @description 角色描述 */
  remark?: string
}
/** @description TheShopAssistantToAdd */
export interface TheShopAssistantToAdd {
  /** @description 消息 */
  msg?: string
  /** @description 是否成功[200成功，500未成功] */
  success?: string
}
/** @description TheStoreList */
export interface TheStoreList {
  /** @description 楼层 */
  floor?: string
  /** @description 商场ID */
  marketId?: string
  /** @description 商场名称 */
  marketName?: string
  /** @description 商场ID */
  projectId?: string
  /** @description 商场名称 */
  projectName?: string
  /** @description 店铺ID */
  shopId?: string
  /** @description 店铺名称 */
  shopName?: string
  /** @description 铺位号 */
  shopNo?: string
  /** @description TheUserid */
  userId?: string
}
/** @description TheTurnoverHasNotUploadDate返回体 */
export interface TheTurnoverHasNotUploadDate {
  /** @description 日TheTurnoverHasNotUploadDate */
  dayList?: Array<string>
}
/** @description TheUser请求体 */
export interface TheUser {
  /** @description 验证码 */
  code: string
  /** @description 配置的菜单id */
  menuId: Array<string>
  /** @description 手机号 */
  phone: string
  /** @description TheUser名 */
  userName: string
}
/** @description TheUserDetails */
export interface TheUserDetails {
  /** @description 角色名称 */
  accountRole?: string
  /** @description 账号状态 */
  accountStatus?: string
  /** @description id */
  id?: string
  /** @description 商场id */
  marketId?: string
  /** @description 商场名称 */
  marketName?: string
  /** @description 配置菜单的id */
  menu?: Array<UserPermissions>
  /** @description 手机号 */
  phone?: string
  /** @description 角色id */
  roleId?: string
  /** @description 商铺id */
  shopId?: string
  /** @description 商铺名称 */
  shopName?: string
  /** @description 商铺编码 */
  storeCode?: string
  /** @description TheUser名称 */
  userName?: string
}
/** @description TheUserToChangePasswordBody */
export interface TheUserToChangePasswordBody {
  /** @description 验证码 */
  code: string
  /** @description 新密码 */
  newPassword: string
  /** @description TheUser名 */
  userName: string
}
/** @description ToTheRepairListQuery请求体 */
export interface ToTheRepairListQuery {
  /** @description 每页容量(默认10) */
  c?: number
  /** @description 结束时间 */
  endTime?: string
  /** @description 当前页 */
  p?: number
  /** @description 开始时间 */
  startTime?: string
  /** @description 状态 已解决:resolved 处理中:processing 待处理:pending */
  state?: string
}
/** @description TurnoverCalendar返回体 */
export interface TurnoverCalendar {
  /** @description 日营业额 */
  dayList?: Array<CalendarDayTurnoverReport>
  /** @description 月份 */
  month?: string
  /** @description 月营业额 */
  monthList?: Array<CalendarMonthTurnoverReport>
  /** @description 日总笔数 */
  sumCountDay?: number
  /** @description 日总金额 */
  sumMoneyDay?: number
}
/** @description TurnoverContrast请求体 */
export interface TurnoverComparedToLocal {
  /** @description 第一组结束日期 */
  firstEndTime: string
  /** @description 第一组起始日期 */
  firstStartTime: string
  /** @description month/按月，day/按天 */
  queryType: string
  /** @description 第二组结束日期 */
  secondEndTime: string
  /** @description 第二组起始日期 */
  secondStartTime: string
}
/** @description TurnoverContrast返回体 */
export interface TurnoverContrast {
  /** @description 第一统计 */
  firstList?: Array<TurnoverContrastStatistics>
  /** @description 第二统计 */
  secondList?: Array<TurnoverContrastStatistics>
}
/** @description TurnoverContrastStatistics返回体 */
export interface TurnoverContrastStatistics {
  /** @description 调整数目 */
  adjustCount?: number
  /** @description 调整金额 */
  adjustMoney?: number
  /** @description 平均值 */
  avgMoney?: number
  /** @description 业种 */
  businessType?: string
  /** @description 上报笔数 */
  count?: number
  /** @description ID */
  id?: string
  /** @description 日期 */
  reportDate?: string
  /** @description 排名 */
  rowNum?: number
  /** @description 商铺id */
  shopId?: string
  /** @description 商铺名称 */
  shopName?: string
  /** @description 铺位号 */
  shopNo?: string
  /** @description 营业额 */
  sumMoney?: number
}
/** @description TurnoverList请求体 */
export interface TurnoverList {
  /** @description 查询一个月，为空查页数 */
  date?: string
  /** @description 第几页 */
  page?: number
  /** @description 每页条数 */
  pageSize?: number
}
/** @description TurnoverTimeStatistics返回体 */
export interface TurnoverTimeStatistics {
  /** @description 调整数目 */
  adjustCount?: number
  /** @description 调整金额 */
  adjustMoney?: number
  /** @description 平均值 */
  avgMoney?: number
  /** @description 业种 */
  businessType?: string
  /** @description 上报笔数 */
  count?: number
  /** @description 结束日期 */
  endTime: string
  /** @description ID */
  id?: string
  /** @description 排序类型:count/按笔数,money/按总金额,avg/按笔单价 */
  orderType: string
  /** @description 查询类型(month/按月，day/按天) */
  queryType: string
  /** @description 上报日期 */
  reportDate?: string
  /** @description 排名 */
  rowNum?: string
  /** @description 商铺id */
  shopId?: string
  /** @description 商铺名称 */
  shopName?: string
  /** @description 铺位号 */
  shopNo?: string
  /** @description 起始日期 */
  startTime: string
  /** @description 营业额 */
  sumMoney?: number
}
/** @description UserLoginRequestBody */
export interface UserLoginRequestBody {
  /** @description TheUser名 */
  loginName: string
  /** @description 密码 */
  password: string
}
/** @description UserPermissions */
export interface UserPermissions {
  /** @description ID */
  id?: string
  /** @description 权限名称 */
  name?: string
}
export interface VxPublicUserRequestDTO {
  appId?: string
  unionId?: string
}
/** @description 2B端上报活动回复响应体 */
export interface WeChat2BReplyActivities {
  /** @description 关联生成的活动id */
  activityId?: string
  /** @description 关联的上报活动id */
  activityReportId?: string
  /** @description 关联生成的活动url */
  activityUrl?: string
  /** @description 创建时间 */
  createTime?: string
  /** @description 上报人id */
  createUserId?: string
  /** @description 上报人 */
  createUserName?: string
  /** @description id */
  id?: string
  /** @description 回复内容 */
  remark?: string
  /** @description 自关联的评论id，对回复的评论 */
  replyId?: string
  /** @description 回复时间 */
  replyTime?: string
  /** @description 回复人id */
  replyUserId?: string
  /** @description 回复人姓名 */
  replyUserName?: string
}
/** @description 2B端上报活动响应体 */
export interface WeChat2BResponseActivities {
  /** @description 活动id */
  activityId?: string
  /** @description 关联生成的活动url */
  activityUrl?: string
  /** @description 创建时间 */
  createTime?: string
  /** @description 上报人id */
  createUserId?: string
  /** @description 上报人 */
  createUserName?: string
  /** @description 上报人电话号 */
  createUserPhone?: string
  /** @description 活动结束时间 */
  endTime?: string
  /** @description 上传的活动照片链接 */
  fileUrl?: string
  /** @description id */
  id?: string
  /** @description 活动简介 */
  introduce?: string
  /** @description 回复列表 */
  replyList?: Array<WeChat2BReplyActivities>
  /** @description 回复状态：已回复/replied;未回复/noReply */
  replyStatus?: string
  /** @description 店铺id */
  shopId?: string
  /** @description 店铺名称 */
  shopName?: string
  /** @description 活动起始时间 */
  startTime?: string
}
/** @description WeChatAuthorizationVerification */
export interface WeChatAuthorizationVerification {
  /** @description 全局token */
  token?: string
  /** @description 历史TheUser */
  userList?: Array<StorePersonnel>
}
/** @description WeChatInformation响应体 */
export interface WeChatInformation {
  /** @description encryptedData */
  encryptedData: string
  /** @description iv */
  iv: string
  /** @description 手机号 */
  phone?: string
}
/** @description WeChatPublicAccessToList返回体 */
export interface WeChatPublicAccessToList {
  /** @description 拉取的OPENID个数，最大值为10000 */
  count?: number
  /** @description 列表数据，OPENID的列表 */
  data?: Array<WeChatPublicUserListData>
  /** @description 拉取列表的最后一个TheUser的OPENID
   */
  next_openid?: string
  /** @description 关注该公众账号的总TheUser数 */
  total?: number
}
/** @description 微WeChatPublicUserListData返回体 */
export interface WeChatPublicUserListData {
  /** @description openId */
  openId?: Array<string>
}
/** @description WeChatPublicUsers返回体 */
export interface WeChatPublicUsers {
  /** @description TheUser的公众号openId */
  openId?: string
  /** @description subscribe(订阅)、unsubscribe(取消订阅) */
  type?: string
  /** @description TheUser的公众号unionId */
  unionId?: string
}
