import http from 'http'
import https from 'https'
import { ModelList } from '../types/type'
import { judgeIsVaildUrl } from './index'

export default class Api {
  static baseURL: string
  static httpsReg = /^https:\/\//

  static get<T = any>(url: string) {
    if (judgeIsVaildUrl(url)) throw new Error(`${url} 请求路径不合法`)
    const fetch = Api.httpsReg.test(url) ? https : http
    return new Promise<T>((resolve, reject) => {
      let rawData = ''
      fetch
        .get(url, res => {
          if (res.statusCode == 200) {
            res.on('data', chunk => {
              //接收流数据
              rawData += chunk
            })
            res.on('end', () => {
              //数据接收完毕
              try {
                resolve(JSON.parse(rawData))
              } catch (error) {
                reject(error)
              }
            })
          }
        })
        .on('error', err => {
          reject(err)
        })
    })
  }

  getModelList(url?: string) {
    if (url) {
      return Api.get<ModelList>(url)
    } else {
      const url = `${Api.baseURL}/swagger-resources`
      return Api.get<ModelList[]>(url)
    }
  }
}
