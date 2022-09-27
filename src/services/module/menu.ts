import BaseClass from './baseClass'
import type * as mT from '../types/menu'

/**
 * @description 角色权限
 */
export default class Menu extends BaseClass {
  /**
   * @name menuListUsingGET
   * @description PermissionsList
   */
  menuList: mT.MenuList = () => {
    const url = '/menu/menuList'
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name roleListUsingGET
   * @description TheRoleList
   */
  roleList: mT.RoleList = () => {
    const url = '/menu/roleList'
    const config = { url, method: 'get' }
    return this.request(config)
  }
}

export const menu = new Menu()
