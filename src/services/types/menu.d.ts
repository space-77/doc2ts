import type * as defs from './type'
export interface MenuListParam {}
export interface RoleListParam {}
export type MenuListBody = defs.GeneralResponseBody<Array<defs.PermissionsList>>
export type RoleListBody = defs.GeneralResponseBody<Array<defs.TheRoleList>>
export type MenuList = () => Promise<[any, MenuListBody['data'], MenuListBody]>

export type RoleList = () => Promise<[any, RoleListBody['data'], RoleListBody]>
