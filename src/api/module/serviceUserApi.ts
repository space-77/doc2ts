
import { ApiClient } from '../services/client'
import * as mT from './type/serviceUserApi'

const basePath = '/tianyin-service-user'

/**
 * @description serviceUserApi
 */
class ServiceUserApi extends ApiClient {
  /**
   * @description 创建版权方用户
  */
  addCopyrightUserUsing: mT.AddCopyrightUserUsing = params => {
    return this.request({ url: `${basePath}/admin/copyright/user`, params })
  }

  /**
   * @description 审批版权方用户
  */
  postApproveCopyrightUserUsing: mT.PostApproveCopyrightUserUsing = params => {
    return this.request({ url: `${basePath}/admin/copyright/user/approve`, params })
  }

  /**
   * @description 版权方用户分页查询
  */
  getUserPageUsing: mT.GetUserPageUsing = params => {
    return this.request({ url: `${basePath}/admin/copyright/user/page?${this.serialize(params)}` })
  }

  /**
   * @description 启用/禁用版权方用户
  */
  postValidateCopyrightUserUsing: mT.PostValidateCopyrightUserUsing = params => {
    return this.request({ url: `${basePath}/admin/copyright/user/validate`, params })
  }

  /**
   * @description 版权方用户详情
  */
  getUserDetailUsing: mT.GetUserDetailUsing = ({ userId }) => {
    return this.request({ url: `${basePath}/admin/copyright/user/${userId}` })
  }

  /**
   * @description 品牌方工作台-获取验证码
  */
  getBrandSmsCodeUsing: mT.GetBrandSmsCodeUsing = params => {
    return this.request({ url: `${basePath}/brand/user/code`, params })
  }

  /**
   * @description 当前登录用户信息
  */
  getCurrentBrandUserUsing: mT.GetCurrentBrandUserUsing = () => {
    return this.request({ url: `${basePath}/brand/user/current` })
  }

  /**
   * @description 品牌方工作台用户-短信登录获取token
  */
  postBrandUserLoginUsing: mT.PostBrandUserLoginUsing = params => {
    return this.request({ url: `${basePath}/brand/user/login`, params })
  }

  /**
   * @description 品牌方用户账号密码登录验证
  */
  postLoginByAccountAndPasswordUsing: mT.PostLoginByAccountAndPasswordUsing = params => {
    return this.request({ url: `${basePath}/brand/user/loginByAccountAndPassword`, params })
  }

  /**
   * @description 品牌方用户修改密码
  */
  postBrandUserModifyCipherUsing: mT.PostBrandUserModifyCipherUsing = params => {
    return this.request({ url: `${basePath}/brand/user/modify/cipher`, params })
  }

  /**
   * @description 当前登录用户信息
  */
  getCurrentUserUsing: mT.GetCurrentUserUsing = () => {
    return this.request({ url: `${basePath}/copyright/currentUser` })
  }

  /**
   * @description 短信登录获取token
  */
  postSmsLoginUsing: mT.PostSmsLoginUsing = params => {
    return this.request({ url: `${basePath}/copyright/sms/login`, params })
  }

  /**
   * @description 创建个人用户
  */
  addCopyrightUserUsing_1: mT.AddCopyrightUserUsing_1 = params => {
    return this.request({ url: `${basePath}/copyright/user`, params })
  }

  /**
   * @description 版权方登录获取token
  */
  postLoginUsing: mT.PostLoginUsing = params => {
    return this.request({ url: `${basePath}/copyright/user/login`, params })
  }

  /**
   * @description 发送登录短信验证码
  */
  sendLoginSmsUsing: mT.SendLoginSmsUsing = params => {
    return this.request({ url: `${basePath}/copyright/user/login/sendSms`, params })
  }

  /**
   * @description 修改个人登录密码
  */
  updatePasswordUsing: mT.UpdatePasswordUsing = params => {
    return this.request({ url: `${basePath}/copyright/user/password`, params, method: 'put' })
  }

  /**
   * @description 发送修改密码短信验证码
  */
  sendPasswordSmsUsing: mT.SendPasswordSmsUsing = params => {
    return this.request({ url: `${basePath}/copyright/user/password/sendSms`, params })
  }

  /**
   * @description 发送注册短信验证码
  */
  sendRegisterSmsUsing: mT.SendRegisterSmsUsing = params => {
    return this.request({ url: `${basePath}/copyright/user/register/sendSms`, params })
  }

  /**
   * @description 当前登录用户信息
  */
  postCurrentUserUsing: mT.PostCurrentUserUsing = () => {
    return this.request({ url: `${basePath}/manager/currentUser`, method: 'post' })
  }

  /**
   * @description 管理后台登录获取token
  */
  postLoginUsing_1: mT.PostLoginUsing_1 = params => {
    return this.request({ url: `${basePath}/manager/login`, params })
  }

  /**
   * @description 菜单树
  */
  getMenuTreeUsing: mT.GetMenuTreeUsing = () => {
    return this.request({ url: `${basePath}/manager/system/menu` })
  }

  /**
   * @description 用户菜单
  */
  getUserMenusUsing: mT.GetUserMenusUsing = () => {
    return this.request({ url: `${basePath}/manager/system/menu/user` })
  }

  /**
   * @description 删除菜单或按钮
  */
  deleteMenusUsing: mT.DeleteMenusUsing = ({ menuIds }) => {
    return this.request({ url: `${basePath}/manager/system/menu/${menuIds}`, method: 'delete' })
  }

  /**
   * @description 新增角色
  */
  addRoleUsing: mT.AddRoleUsing = params => {
    return this.request({ url: `${basePath}/manager/system/role`, params })
  }

  /**
   * @description 角色名检查
  */
  getCheckRoleNameUsing: mT.GetCheckRoleNameUsing = ({ roleName }) => {
    return this.request({ url: `${basePath}/manager/system/role/check/${roleName}` })
  }

  /**
   * @description 可选角色列表
  */
  getRolesUsing: mT.GetRolesUsing = () => {
    return this.request({ url: `${basePath}/manager/system/role/options` })
  }

  /**
   * @description 角色列表
  */
  getRolePageListUsing: mT.GetRolePageListUsing = params => {
    return this.request({ url: `${basePath}/manager/system/role/page?${this.serialize(params)}` })
  }

  /**
   * @description 删除角色
  */
  deleteRolesUsing: mT.DeleteRolesUsing = ({ roleIds }) => {
    return this.request({ url: `${basePath}/manager/system/role/${roleIds}`, method: 'delete' })
  }

  /**
   * @description 新增用户
  */
  addUserUsing: mT.AddUserUsing = params => {
    return this.request({ url: `${basePath}/manager/system/user/add`, params })
  }

  /**
   * @description 检查用户
  */
  getCheckUserNameUsing: mT.GetCheckUserNameUsing = ({ username }) => {
    return this.request({ url: `${basePath}/manager/system/user/check/${username}` })
  }

  /**
   * @description 用户详情查询
  */
  getUserDetailUsing_1: mT.GetUserDetailUsing_1 = params => {
    return this.request({ url: `${basePath}/manager/system/user/detail?${this.serialize(params)}` })
  }

  /**
   * @description 用户列表
  */
  getUserListUsing: mT.GetUserListUsing = params => {
    return this.request({ url: `${basePath}/manager/system/user/list?${this.serialize(params)}` })
  }

  /**
   * @description 修改密码
  */
  updatePasswordUsing_1: mT.UpdatePasswordUsing_1 = params => {
    return this.request({ url: `${basePath}/manager/system/user/password`, params, method: 'put' })
  }

  /**
   * @description 修改用户
  */
  updateUserUsing: mT.UpdateUserUsing = params => {
    return this.request({ url: `${basePath}/manager/system/user/update`, params, method: 'put' })
  }

  /**
   * @description 删除用户
  */
  deleteUsersUsing: mT.DeleteUsersUsing = ({ userIds }) => {
    return this.request({ url: `${basePath}/manager/system/user/${userIds}`, method: 'delete' })
  }

  /**
   * @description 当前登录用户信息
  */
  postCurrentUserUsing_1: mT.PostCurrentUserUsing_1 = () => {
    return this.request({ url: `${basePath}/website/currentUser`, method: 'post' })
  }

  /**
   * @description 官网门户-短信登录获取token
  */
  postSmsLoginUserUsing: mT.PostSmsLoginUserUsing = params => {
    return this.request({ url: `${basePath}/website/sms/login`, params })
  }

  /**
   * @description 官网门户-获取短信验证码
  */
  getSmsVerifyCodeUsing: mT.GetSmsVerifyCodeUsing = params => {
    return this.request({ url: `${basePath}/website/sms/verify/code?${this.serialize(params)}` })
  }

  /**
   * @description 测试-解码token
  */
  getTokenUserUsing: mT.GetTokenUserUsing = params => {
    return this.request({ url: `${basePath}/website/token/get?${this.serialize(params)}` })
  }

  /**
   * @description 官网门户-H5授权-微信登录
  */
  postWxH5LoginUsing: mT.PostWxH5LoginUsing = params => {
    return this.request({ url: `${basePath}/website/wx/h5/login`, params })
  }

  /**
   * @description 官网门户-微信登录
  */
  postWxLoginUsing: mT.PostWxLoginUsing = params => {
    return this.request({ url: `${basePath}/website/wx/login`, params })
  }
}

export default new ServiceUserApi()
