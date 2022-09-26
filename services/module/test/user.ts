import BaseClass from '../baseClass'
import type * as mT from '../../types/test/user'

/**
 * @description Operations about user
 */
export default class User extends BaseClass {
  /**
   * @name testCreateUser
   * @description Create user，This can only be done by the logged in user.
   */
  createUser: mT.CreateUser = body => {
    const url = '/user'
    const config = { url, body: body, method: 'post' }
    return this.request(config)
  }

  /**
   * @name testLoginUser
   * @description Logs user into the system
   */
  loginUser: mT.LoginUser = params => {
    const url = `/user/login?${this.serialize({ params })}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name testLogoutUser
   * @description Logs out current logged in user session
   */
  logoutUser: mT.LogoutUser = () => {
    const url = '/user/logout'
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name testGetUserByName
   * @description Get user by user name
   */
  getUserByName: mT.GetUserByName = username => {
    const url = `/user/${username}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name testUpdateUser
   * @description Updated user，This can only be done by the logged in user.
   */
  updateUser: mT.UpdateUser = params => {
    const { username, body: _body } = params
    const body = { body: _body }
    const url = `/user/${username}`
    const config = { url, body, method: 'put' }
    return this.request(config)
  }

  /**
   * @name testDeleteUser
   * @description Delete user，This can only be done by the logged in user.
   */
  deleteUser: mT.DeleteUser = username => {
    const url = `/user/${username}`
    const config = { url, method: 'delete' }
    return this.request(config)
  }

  /**
   * @name testCreateUsersWithListInput
   * @description Creates list of users with given input array
   */
  createUsersWithListInput: mT.CreateUsersWithListInput = body => {
    const url = '/user/createWithList'
    const config = { url, body: body, method: 'post' }
    return this.request(config)
  }

  /**
   * @name testCreateUsersWithArrayInput
   * @description Creates list of users with given input array
   */
  createUsersWithArrayInput: mT.CreateUsersWithArrayInput = body => {
    const url = '/user/createWithArray'
    const config = { url, body: body, method: 'post' }
    return this.request(config)
  }
}

export const user = new User()
