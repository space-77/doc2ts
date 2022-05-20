export type ApiResponse = {
  code?: number
  message?: string
  type?: string
}
export type Category = {
  id?: number
  name?: string
}
export type Order = {
  complete?: boolean
  id?: number
  petId?: number
  quantity?: number
  shipDate?: string
  /** @description Order Status*/
  status?: any
}
export type Pet = {
  category?: Category
  id?: number
  name: string
  photoUrls: Array<string>
  /** @description pet status in the store*/
  status?: any
  tags?: Array<Tag>
}
export type Tag = {
  id?: number
  name?: string
}
export type User = {
  email?: string
  firstName?: string
  id?: number
  lastName?: string
  password?: string
  phone?: string
  /** @description User Status*/
  userStatus?: number
  username?: string
}
