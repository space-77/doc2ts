import type * as defs from './type'
export interface CreateUserParam {
  /** @description Created user object */
  body: defs.User
}
export interface LoginUserParam {
  /** @description The user name for login */
  username: string
  /** @description The password for login in clear text */
  password: string
}
export interface LogoutUserParam {}
export interface GetUserByNameParam {
  /** @description The name that needs to be fetched. Use user1 for testing.  */
  username: string
}
export interface UpdateUserParam {
  /** @description name that need to be updated */
  username: string
  /** @description Updated user object */
  body: defs.User
}
export interface DeleteUserParam {
  /** @description The name that needs to be deleted */
  username: string
}
export interface CreateUsersWithListInputParam {
  /** @description List of user object */
  body: Array<defs.User>
}
export interface CreateUsersWithArrayInputParam {
  /** @description List of user object */
  body: Array<defs.User>
}
export type CreateUserBody = any
export type LoginUserBody = string
export type LogoutUserBody = any
export type GetUserByNameBody = defs.User
export type UpdateUserBody = any
export type DeleteUserBody = any
export type CreateUsersWithListInputBody = any
export type CreateUsersWithArrayInputBody = any
export type CreateUser = (body: CreateUserParam['body']) => Promise<CreateUserBody>

export type LoginUser = (params: LoginUserParam) => Promise<LoginUserBody>

export type LogoutUser = () => Promise<LogoutUserBody>

export type GetUserByName = (username: GetUserByNameParam['username']) => Promise<GetUserByNameBody>

export type UpdateUser = (params: UpdateUserParam) => Promise<UpdateUserBody>

export type DeleteUser = (username: DeleteUserParam['username']) => Promise<DeleteUserBody>

export type CreateUsersWithListInput = (
  body: CreateUsersWithListInputParam['body']
) => Promise<CreateUsersWithListInputBody>

export type CreateUsersWithArrayInput = (
  body: CreateUsersWithArrayInputParam['body']
) => Promise<CreateUsersWithArrayInputBody>
