import BaseClass from './baseClass'
import type * as mT from '../types/theUser'

/**
 * @description User Controller
 */
export default class TheUser extends BaseClass {
  /**
   * @name addShopUserUsingPOST
   * @description 添加店员
   */
  addShopUser: mT.AddShopUser = shopUserRequestBDDTO => {
    const url = '/shopUser/addShopUser'
    const config = { url, body: shopUserRequestBDDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name getOpenUserUsingGET
   * @description 返回openid
   */
  getOpenUser: mT.GetOpenUser = () => {
    const url = '/shopUser/getOpenUser'
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name shopUserListUsingGET
   * @description 获取店员列表
   */
  shopUserList: mT.ShopUserList = () => {
    const url = '/shopUser/shopUserList'
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name modifyShopUserUsingPOST
   * @description 修改店员
   */
  modifyShopUser: mT.ModifyShopUser = shopUserRequestModifyBDDTO => {
    const url = '/shopUser/modifyShopUser'
    const config = { url, body: shopUserRequestModifyBDDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name shopDetailsUsingGET
   * @description 获取TheUserDetails
   */
  shopDetails: mT.ShopDetails = id => {
    const url = `/shopUser/shopDetails/${id}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name modifyShopUserTypeUsingPOST
   * @description 修改店员类型
   */
  modifyShopUserType: mT.ModifyShopUserType = shopUserRequestModifyTypeBDDTO => {
    const url = '/shopUser/modifyShopUserType'
    const config = { url, body: shopUserRequestModifyTypeBDDTO, method: 'post' }
    return this.request(config)
  }

  /**
   * @name modifyShopUserPasswordUsingPOST
   * @description 修改密码
   */
  modifyShopUserPassword: mT.ModifyShopUserPassword = userModifyPasswordRequestBDDTO => {
    const url = '/shopUser/modifyShopUserPassword'
    const config = { url, body: userModifyPasswordRequestBDDTO, method: 'post' }
    return this.request(config)
  }
}

export const theUser = new TheUser()
