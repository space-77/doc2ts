import ApiClient from '../client'

/**
 * @description 基础工具类
 */
export default class BaseClass extends ApiClient {
  /**
   * @description 拼接参数
   */
  protected serialize(query: Record<string, any>) {
    if (!(query instanceof Object) || Array.isArray(query)) return ''
    return Object.entries(query)
      .map(([k, v]) => (v !== undefined && v != null ? `${k}=${v}` : undefined))
      .filter(Boolean)
      .join('&')
  }

  /**
   * @description 创建 formdata
   */
  protected formData(formData: Record<string, any>) {
    if (!(formData instanceof Object) || Array.isArray(formData)) return ''
    const fd = new URLSearchParams()
    Object.entries(formData).forEach(([k, v]) => {
      fd.set(k, v)
    })
    return fd
  }
}
