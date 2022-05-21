import { User } from './type'
export type CreateUserParam = {
  /** @description Created user object*/
  body: User
}
export type LoginUserParam = {
  /** @description The user name for login*/
  username: string
  /** @description The password for login in clear text*/
  password: string
}
export type LogoutUserParam = {}
export type GetUserByNameParam = {
  /** @description The name that needs to be fetched. Use user1 for testing. */
  username: string
}
export type UpdateUserParam = {
  /** @description name that need to be updated*/
  username: string
  /** @description Updated user object*/
  body: User
}
export type DeleteUserParam = {
  /** @description The name that needs to be deleted*/
  username: string
}
export type CreateUsersWithListInputParam = {
  /** @description List of user object*/
  body: Array<User>
}
export type CreateUsersWithArrayInputParam = {
  /** @description List of user object*/
  body: Array<User>
}
export type CreateUserBody = any
export type LoginUserBody = string
export type LogoutUserBody = any
export type GetUserByNameBody = User
export type UpdateUserBody = any
export type DeleteUserBody = any
export type CreateUsersWithListInputBody = any
export type CreateUsersWithArrayInputBody = any
type CreateUserResponse = Promise<CreateUserBody>
type LoginUserResponse = Promise<LoginUserBody>
type LogoutUserResponse = Promise<LogoutUserBody>
type GetUserByNameResponse = Promise<GetUserByNameBody>
type UpdateUserResponse = Promise<UpdateUserBody>
type DeleteUserResponse = Promise<DeleteUserBody>
type CreateUsersWithListInputResponse = Promise<CreateUsersWithListInputBody>
type CreateUsersWithArrayInputResponse = Promise<CreateUsersWithArrayInputBody>
export type CreateUser = (params: CreateUserParam) => CreateUserResponse

export type LoginUser = (params: LoginUserParam) => LoginUserResponse

export type LogoutUser = (params: LogoutUserParam) => LogoutUserResponse

export type GetUserByName = (params: GetUserByNameParam) => GetUserByNameResponse

export type UpdateUser = (params: UpdateUserParam) => UpdateUserResponse

export type DeleteUser = (params: DeleteUserParam) => DeleteUserResponse

export type CreateUsersWithListInput = (params: CreateUsersWithListInputParam) => CreateUsersWithListInputResponse

export type CreateUsersWithArrayInput = (params: CreateUsersWithArrayInputParam) => CreateUsersWithArrayInputResponse
