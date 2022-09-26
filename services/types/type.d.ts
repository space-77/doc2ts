export type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value
}
export interface ApiResponse {
  code?: number
  message?: string
  type?: string
}
export interface Category {
  id?: number
  name?: string
}
export interface Order {
  complete?: boolean
  id?: number
  petId?: number
  quantity?: number
  shipDate?: string
  /** @description Order Status */
  status?: any
}
export interface Pet {
  category?: Category
  id?: number
  name: string
  photoUrls: Array<string>
  /** @description pet status in the store */
  status?: any
  tags?: Array<Tag>
}
export interface Tag {
  id?: number
  name?: string
}
export interface User {
  email?: string
  firstName?: string
  id?: number
  lastName?: string
  password?: string
  phone?: string
  /** @description User Status */
  userStatus?: number
  username?: string
}
