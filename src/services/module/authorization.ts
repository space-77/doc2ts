import BaseClass from './baseClass'
import type * as mT from '../types/authorization'

/**
 * @description 校验
 */
export default class Authorization extends BaseClass {
  /**
   * @name loginAuthorUsingGET
   * @description 登录
   */
  loginAuthor: mT.LoginAuthor = code => {
    const url = `/authorization/login/${code}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @name healthUsingGET
   * @description 健康检查接口
   */
  health: mT.Health = code => {
    const url = `/authorization/health/${code}`
    const config = { url, method: 'get' }
    return this.request(config)
  }
}

export const authorization = new Authorization()
