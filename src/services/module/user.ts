import BaseClass from './baseClass'
import * as mT from '../types/user'

/**
 * @description Operations about user
 */
export default class User extends BaseClass {
  /**
   * @description Create user，This can only be done by the logged in user.
   */
  createUser: mT.CreateUser = body => {
    return this.request({ url: '/user', body, method: 'post' })
  }
  /**
   * @description Logs user into the system
   */
  loginUser: mT.LoginUser = params => {
    const query = this.serialize(params)
    return this.request({ url: `/user/login?${query}`, method: 'get' })
  }
  /**
   * @description Logs out current logged in user session
   */
  logoutUser: mT.LogoutUser = () => {
    return this.request({ url: '/user/logout', method: 'get' })
  }
  /**
   * @description Get user by user name
   */
  getUserByName: mT.GetUserByName = params => {
    const { username } = params
    return this.request({ url: `/user/${username}`, method: 'get' })
  }
  /**
   * @description Updated user，This can only be done by the logged in user.
   */
  updateUser: mT.UpdateUser = params => {
    const { username, body: _body } = params
    const body = { body: _body }
    return this.request({ url: `/user/${username}`, body, method: 'put' })
  }
  /**
   * @description Delete user，This can only be done by the logged in user.
   */
  deleteUser: mT.DeleteUser = params => {
    const { username } = params
    return this.request({ url: `/user/${username}`, method: 'delete' })
  }
  /**
   * @description Creates list of users with given input array
   */
  createUsersWithListInput: mT.CreateUsersWithListInput = body => {
    return this.request({ url: '/user/createWithList', body, method: 'post' })
  }
  /**
   * @description Creates list of users with given input array
   */
  createUsersWithArrayInput: mT.CreateUsersWithArrayInput = body => {
    return this.request({ url: '/user/createWithArray', body, method: 'post' })
  }
}

export const user = new User()
