import { IResponse } from '../../services/type'

/** @description 通用返回使用响应体 */
export interface AddCopyrightUserUsingResponse {
}

/** @description 创建版权方用户 请求参数 */
export interface AddCopyrightUserUsingParams {
  /** @description 联系人名称 */
  contactName: string
  /** @description 法人身份证号 */
  legalPersonIdCode: string
  /** @description 法人姓名 */
  legalPersonName: string
  /** @description 法人手机号 */
  legalPersonPhone: string
  /** @description 注册手机号 */
  loginPhone: string
  /** @description 企业名称 */
  merchantName: string
  /** @description 密码 */
  password: string
  /** @description 短信验证码 */
  smsCode: string
  /** @description 统一社会信用代码/营业执照号 */
  uniteCreditCode: string
}

/** @description 审批版权方用户 请求参数 */
export interface PostApproveCopyrightUserUsingParams {
  /** @description 审批备注 */
  approveContent: string
  /** @description 版权方用户ID */
  cid: number
  /** @description 审批版权方用户 0待审核 1审核通过 2审核不通过 */
  type: number
}

/** @description 通用返回使用响应体 */
export interface GetUserPageUsingResponse {
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
  /** @description 审核状态：0-待审核（默认），1-审核通过，2-审核不通过 */
  approveStatus: number
  /** @description 版权方用户ID */
  cid: number
  /** @description 联系人名称 */
  contactName: string
  createBy: string
  createTime: string
  /** @description 法人身份证号 */
  legalPersonIdCode: string
  /** @description 法人姓名 */
  legalPersonName: string
  /** @description 法人手机号 */
  legalPersonPhone: string
  /** @description 注册手机号 */
  loginPhone: string
  /** @description 企业名称 */
  merchantName: string
  /** @description 统一社会信用代码/营业执照号 */
  uniteCreditCode: string
  updateBy: string
  updateTime: string
  /** @description 商户状态：0-禁用（默认），1-启用 */
  validStatus: number
}

/** @description 版权方用户分页查询 请求参数 */
export interface GetUserPageUsingParams {
  field?: string
  /** @description 企业名称 */
  merchantName?: string
  order?: string
  pageNum?: number
  pageSize?: number
  /** @description 审批版权方用户 0待审核 1审核通过 2审核不通过 */
  type?: number
  /** @description 统一社会信用代码/营业执照号 */
  uniteCreditCode?: string
}

/** @description 启用/禁用版权方用户 请求参数 */
export interface PostValidateCopyrightUserUsingParams {
  /** @description 版权方用户ID */
  cid: number
  /** @description 启用/禁用版权方用户 0禁用 1启用 */
  type: string
}

/** @description 通用返回使用响应体 */
export interface GetUserDetailUsingResponse {
}

/** @description 版权方用户详情 请求参数 */
export interface GetUserDetailUsingParams {
  /** @description userId */
  userId: string
}

/** @description 通用返回使用响应体 */
export interface GetBrandSmsCodeUsingResponse {
}

/** @description 品牌方工作台-获取验证码 请求参数 */
export interface GetBrandSmsCodeUsingParams {
  /** @description 验证码类别 0 登录验证码 1 修改密码验证码 */
  codeType: number
  /** @description 手机号码 */
  phone: string
}

/** @description 通用返回使用响应体 */
export interface GetCurrentBrandUserUsingResponse {
}

/** @description 通用返回使用响应体 */
export interface PostBrandUserLoginUsingResponse {
}

/** @description 品牌方工作台用户-短信登录获取token 请求参数 */
export interface PostBrandUserLoginUsingParams {
  /** @description 验证码类别 0 登录验证码 1 修改密码验证码 */
  codeType: number
  /** @description 手机号码 */
  phone: string
  /** @description 验证码 */
  verifyCode: string
}

/** @description 通用返回使用响应体 */
export interface PostLoginByAccountAndPasswordUsingResponse extends PostBrandUserLoginUsingResponse {
}

/** @description 品牌方用户账号密码登录验证 请求参数 */
export interface PostLoginByAccountAndPasswordUsingParams {
  /** @description 用户账号 */
  account: string
  /** @description 登录密码 */
  password: string
}

/** @description 品牌方用户修改密码 请求参数 */
export interface PostBrandUserModifyCipherUsingParams {
  /** @description 验证码类别 0 登录验证码 1 修改密码验证码 */
  codeType: number
  /** @description 记录id */
  id: number
  /** @description 新密码 */
  newCipher: string
  /** @description 手机号码 */
  phone: string
  /** @description 验证码 */
  verifyCode: string
}

/** @description 通用返回使用响应体 */
export interface GetCurrentUserUsingResponse extends GetUserDetailUsingResponse {
}

/** @description 短信登录获取token 请求参数 */
export interface PostSmsLoginUsingParams {
  /** @description 手机号码 */
  phone: string
  /** @description 验证码 */
  verifyCode: string
}

/** @description 创建个人用户 请求参数 */
export interface AddCopyrightUserUsing_1Params {
  /** @description 联系人名称 */
  contactName: string
  /** @description 法人身份证号 */
  legalPersonIdCode: string
  /** @description 法人姓名 */
  legalPersonName: string
  /** @description 法人手机号 */
  legalPersonPhone: string
  /** @description 注册手机号 */
  loginPhone: string
  /** @description 企业名称 */
  merchantName: string
  /** @description 密码 */
  password: string
  /** @description 短信验证码 */
  smsCode: string
  /** @description 统一社会信用代码/营业执照号 */
  uniteCreditCode: string
}

/** @description 版权方登录获取token 请求参数 */
export interface PostLoginUsingParams {
  /** @description 密码 */
  password: string
  /** @description 用户名 */
  username: string
}

/** @description 发送登录短信验证码 请求参数 */
export interface SendLoginSmsUsingParams {
  /** @description 手机号 */
  phone: string
}

/** @description 修改个人登录密码 请求参数 */
export interface UpdatePasswordUsingParams {
  /** @description 注册手机号 */
  loginPhone: string
  /** @description 密码 */
  password: string
  /** @description 短信验证码 */
  smsCode: string
}

/** @description 发送修改密码短信验证码 请求参数 */
export interface SendPasswordSmsUsingParams {
  /** @description 手机号 */
  phone: string
}

/** @description 发送注册短信验证码 请求参数 */
export interface SendRegisterSmsUsingParams {
  /** @description 手机号 */
  phone: string
}

/** @description 通用返回使用响应体 */
export interface PostCurrentUserUsingResponse {
}

/** @description 权限菜单-子类型 */
export interface Menus {
  /** @description 路由组件 */
  component: string
  createBy: string
  createTime: string
  /** @description 图标 */
  icon: string
  /** @description 菜单ID */
  id: number
  /**
   * @example 菜单管理
   * @description 菜单/按钮名称
   */
  name: string
  /** @description 排序 */
  orderNum: number
  /** @description 路由path */
  path: string
  /** @description 权限标识 */
  perms: string
  /** @description 父级ID */
  pid: number
  /** @description 类型 0菜单 1按钮 */
  type: number
  updateBy: string
  updateTime: string
}

/** @description 管理后台登录获取token 请求参数 */
export interface PostLoginUsing_1Params {
  /** @description 密码 */
  password: string
  /** @description 用户名 */
  username: string
}

/** @description 删除菜单或按钮 请求参数 */
export interface DeleteMenusUsingParams {
  /** @description menuIds */
  menuIds: string
}

/** @description 新增角色 请求参数 */
export interface AddRoleUsingParams {
  /** @description 菜单权限 */
  menuIds: string
  /**
   * @example 管理员
   * @description 角色名称
   */
  name: string
  /**
   * @example 管理员
   * @description 备注
   */
  remark: string
}

/** @description 角色名检查 请求参数 */
export interface GetCheckRoleNameUsingParams {
  /** @description roleName */
  roleName: string
}

/** @description 通用返回使用响应体 */
export interface GetRolesUsingResponse {
  createBy: string
  createTime: string
  /** @description 角色ID */
  id: number
  /** @description 权限菜单 */
  menuIds: string
  /** @description 角色名称 */
  name: string
  /** @description 备注 */
  remark: string
  updateBy: string
  updateTime: string
}

/** @description 通用返回使用响应体 */
export interface GetRolePageListUsingResponse {
  /**
   * @example 1000
   * @description 总数量
   */
  count: number
  /** @description 分页数据 */
  list: any[]
  /**
   * @example 1
   * @description 当前页
   */
  page: number
}

/** @description 角色列表 请求参数 */
export interface GetRolePageListUsingParams {
  field?: string
  /**
   * @example 管理员
   * @description 名称
   */
  name?: string
  order?: string
  pageNum?: number
  pageSize?: number
}

/** @description 删除角色 请求参数 */
export interface DeleteRolesUsingParams {
  /** @description roleIds */
  roleIds: string
}

/** @description 新增用户 请求参数 */
export interface AddUserUsingParams {
  /** @description 头像 */
  avatar: string
  /** @description 邮箱 */
  email: string
  /** @description 手机号 */
  mobile: string
  /** @description 用户名 */
  name: string
  /** @description 角色 */
  roleIds: string
  /** @description 性别 1男 2女 0未知 */
  sex: number
}

/** @description 检查用户 请求参数 */
export interface GetCheckUserNameUsingParams {
  /** @description username */
  username: string
}

/** @description 通用返回使用响应体 */
export interface GetUserDetailUsing_1Response extends PostCurrentUserUsingResponse {
}

/** @description 用户详情查询 请求参数 */
export interface GetUserDetailUsing_1Params {
  /** @description 手机号 */
  mobile?: string
  /** @description 名称 */
  name?: string
}

/** @description 通用返回使用响应体 */
export interface GetUserListUsingResponse {
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
  /** @description 头像 */
  avatar: string
  createBy: string
  createTime: string
  /** @description 邮箱 */
  email: string
  /** @description 用户ID */
  id: number
  /** @description 权限菜单 */
  menus: Menus[]
  /** @description 手机号 */
  mobile: string
  /** @description 用户名 */
  name: string
  /** @description 密码 */
  password: string
  roleId: string
  roleName: string
  /** @description 性别 1男 2女 0未知 */
  sex: number
  updateBy: string
  updateTime: string
}

/** @description 用户列表 请求参数 */
export interface GetUserListUsingParams {
  field?: string
  /** @description 手机号 */
  mobile?: string
  /** @description 名称 */
  name?: string
  order?: string
  pageNum?: number
  pageSize?: number
}

/** @description 修改密码 请求参数 */
export interface UpdatePasswordUsing_1Params {
}

/** @description 修改用户 请求参数 */
export interface UpdateUserUsingParams {
  /** @description 头像 */
  avatar: string
  /** @description 邮箱 */
  email: string
  /**
   * @example 1
   * @description 用户ID
   */
  id: number
  /** @description 手机号 */
  mobile: string
  /** @description 菜单权限 */
  roleIds: string
  /** @description 性别 1男 2女 0未知 */
  sex: number
}

/** @description 删除用户 请求参数 */
export interface DeleteUsersUsingParams {
  /** @description userIds */
  userIds: string
}

/** @description 通用返回使用响应体 */
export interface PostCurrentUserUsing_1Response extends GetCurrentBrandUserUsingResponse {
}

/** @description 官网门户-短信登录获取token 请求参数 */
export interface PostSmsLoginUserUsingParams {
  /** @description 手机号码 */
  phone: string
  /** @description 验证码 */
  verifyCode: string
}

/** @description 官网门户-获取短信验证码 请求参数 */
export interface GetSmsVerifyCodeUsingParams {
  /** @description phone */
  phone?: string
}

/** @description 测试-解码token 请求参数 */
export interface GetTokenUserUsingParams {
  /** @description token */
  token?: string
}

/** @description 官网门户-H5授权-微信登录 请求参数 */
export interface PostWxH5LoginUsingParams {
  /** @description 微信返回code码 */
  code: string
}

/** @description 官网门户-微信登录 请求参数 */
export interface PostWxLoginUsingParams {
  /** @description 微信返回code码 */
  code: string
}

/** @id addCopyrightUserUsingPOST */
export type AddCopyrightUserUsing = <T = any>(params: AddCopyrightUserUsingParams) => Promise<T>
/** @id approveCopyrightUserUsingPOST */
export type PostApproveCopyrightUserUsing = <T = any>(params: PostApproveCopyrightUserUsingParams) => Promise<T>
/** @id userPageUsingGET */
export type GetUserPageUsing = <T = GetUserPageUsingResponse>(params: GetUserPageUsingParams) => Promise<T>
/** @id validateCopyrightUserUsingPOST */
export type PostValidateCopyrightUserUsing = <T = any>(params: PostValidateCopyrightUserUsingParams) => Promise<T>
/** @id userDetailUsingGET */
export type GetUserDetailUsing = <T = GetUserDetailUsingResponse>(params: GetUserDetailUsingParams) => Promise<T>
/** @id getBrandSmsCodeUsingPOST */
export type GetBrandSmsCodeUsing = <T = any>(params: GetBrandSmsCodeUsingParams) => Promise<T>
/** @id currentBrandUserUsingGET */
export type GetCurrentBrandUserUsing = <T = GetCurrentBrandUserUsingResponse>() => Promise<T>
/** @id brandUserLoginUsingPOST */
export type PostBrandUserLoginUsing = <T = PostBrandUserLoginUsingResponse>(params: PostBrandUserLoginUsingParams) => Promise<T>
/** @id loginByAccountAndPasswordUsingPOST */
export type PostLoginByAccountAndPasswordUsing = <T = any>(params: PostLoginByAccountAndPasswordUsingParams) => Promise<T>
/** @id brandUserModifyCipherUsingPOST */
export type PostBrandUserModifyCipherUsing = <T = any>(params: PostBrandUserModifyCipherUsingParams) => Promise<T>
/** @id currentUserUsingGET */
export type GetCurrentUserUsing = <T = any>() => Promise<T>
/** @id smsLoginUsingPOST */
export type PostSmsLoginUsing = <T = any>(params: PostSmsLoginUsingParams) => Promise<T>
/** @id addCopyrightUserUsingPOST_1 */
export type AddCopyrightUserUsing_1 = <T = any>(params: AddCopyrightUserUsing_1Params) => Promise<T>
/** @id loginUsingPOST */
export type PostLoginUsing = <T = any>(params: PostLoginUsingParams) => Promise<T>
/** @id sendLoginSmsUsingPOST */
export type SendLoginSmsUsing = <T = any>(params: SendLoginSmsUsingParams) => Promise<T>
/** @id updatePasswordUsingPUT */
export type UpdatePasswordUsing = <T = any>(params: UpdatePasswordUsingParams) => Promise<T>
/** @id sendPasswordSmsUsingPOST */
export type SendPasswordSmsUsing = <T = any>(params: SendPasswordSmsUsingParams) => Promise<T>
/** @id sendRegisterSmsUsingPOST */
export type SendRegisterSmsUsing = <T = any>(params: SendRegisterSmsUsingParams) => Promise<T>
/** @id currentUserUsingPOST */
export type PostCurrentUserUsing = <T = PostCurrentUserUsingResponse>() => Promise<T>
/** @id loginUsingPOST_1 */
export type PostLoginUsing_1 = <T = any>(params: PostLoginUsing_1Params) => Promise<T>
/** @id menuTreeUsingGET */
export type GetMenuTreeUsing = <T = any>() => Promise<T>
/** @id userMenusUsingGET */
export type GetUserMenusUsing = <T = any>() => Promise<T>
/** @id deleteMenusUsingDELETE */
export type DeleteMenusUsing = <T = any>(params: DeleteMenusUsingParams) => Promise<T>
/** @id addRoleUsingPOST */
export type AddRoleUsing = <T = any>(params: AddRoleUsingParams) => Promise<T>
/** @id checkRoleNameUsingGET */
export type GetCheckRoleNameUsing = <T = any>(params: GetCheckRoleNameUsingParams) => Promise<T>
/** @id rolesUsingGET */
export type GetRolesUsing = <T = GetRolesUsingResponse>() => Promise<T>
/** @id rolePageListUsingGET */
export type GetRolePageListUsing = <T = GetRolePageListUsingResponse>(params: GetRolePageListUsingParams) => Promise<T>
/** @id deleteRolesUsingDELETE */
export type DeleteRolesUsing = <T = any>(params: DeleteRolesUsingParams) => Promise<T>
/** @id addUserUsingPOST */
export type AddUserUsing = <T = any>(params: AddUserUsingParams) => Promise<T>
/** @id checkUserNameUsingGET */
export type GetCheckUserNameUsing = <T = any>(params: GetCheckUserNameUsingParams) => Promise<T>
/** @id userDetailUsingGET_1 */
export type GetUserDetailUsing_1 = <T = any>(params: GetUserDetailUsing_1Params) => Promise<T>
/** @id userListUsingGET */
export type GetUserListUsing = <T = GetUserListUsingResponse>(params: GetUserListUsingParams) => Promise<T>
/** @id updatePasswordUsingPUT_1 */
export type UpdatePasswordUsing_1 = <T = any>(params: UpdatePasswordUsing_1Params) => Promise<T>
/** @id updateUserUsingPUT */
export type UpdateUserUsing = <T = any>(params: UpdateUserUsingParams) => Promise<T>
/** @id deleteUsersUsingDELETE */
export type DeleteUsersUsing = <T = any>(params: DeleteUsersUsingParams) => Promise<T>
/** @id currentUserUsingPOST_1 */
export type PostCurrentUserUsing_1 = <T = any>() => Promise<T>
/** @id smsLoginUserUsingPOST */
export type PostSmsLoginUserUsing = <T = any>(params: PostSmsLoginUserUsingParams) => Promise<T>
/** @id getSmsVerifyCodeUsingGET */
export type GetSmsVerifyCodeUsing = <T = any>(params: GetSmsVerifyCodeUsingParams) => Promise<T>
/** @id getTokenUserUsingGET */
export type GetTokenUserUsing = <T = any>(params: GetTokenUserUsingParams) => Promise<T>
/** @id wxH5LoginUsingPOST */
export type PostWxH5LoginUsing = <T = any>(params: PostWxH5LoginUsingParams) => Promise<T>
/** @id wxLoginUsingPOST */
export type PostWxLoginUsing = <T = any>(params: PostWxLoginUsingParams) => Promise<T>
