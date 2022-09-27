import BaseClass from './baseClass'
import type * as mT from '../types/userLogin'

/**
 * @description TheUser端登录验证
 */
export default class UserLogin extends BaseClass {
  /**
   * @name loginUsingPOST
   * @description 登录
   */
  login: mT.Login = shopUserRequestDTO => {
    const url = '/mUser/login'
    const config = { url, body: shopUserRequestDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name forgetShopUserPasswordUsingPOST
   * @description 忘记密码
   */
  forgetShopUserPassword: mT.ForgetShopUserPassword = userForgetPasswordRequestBDDTO => {
    const url = '/mUser/forgetShopUserPassword'
    const config = { url, body: userForgetPasswordRequestBDDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name modifyStatusToOneUsingGET
   * @description 删除历史TheUser信息
   */
  modifyStatusToOne: mT.ModifyStatusToOne = bid => {
    const url = `/mUser/modifyUserStatus/${bid}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name shopUserByPhoneUsingGET
   * @description 根据手机号获取TheUser是否存在
   */
  shopUserByPhone: mT.ShopUserByPhone = phone => {
    const url = `/mUser/shopUserByPhone/${phone}`
    const config = { url, method: 'get' }
    return this.request(config)
  }
}

export const userLogin = new UserLogin()
