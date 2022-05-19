import http from 'http'
import https from 'https'
import { judgeIsVaildUrl } from './index'
import { Doc2TsConfig, ModelInfoList, ModelList } from '../type'

export default class Api {
  // static fetch: typeof https | typeof http
  // static urlReg = /^https?:\/\//
  static httpsReg = /^https:\/\//
  static baseURL: string

  constructor() {
    // if (!Array.isArray(originUrl) || originUrl.length === 0) throw new Error('接口地址不存在')
    // const uiUrl = originUrl.filter
    // if (!/^https?:\/\/.+/.test(baseURL)) throw new Error('请配置正确的接口地址')
    // Api.baseURL = /\/$/.test(baseURL) ? baseURL : `${baseURL}/`
    // this.fetch = /^http:\/\//.test(baseURL) ? http : https
  }

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

  getModelInfoList(modelPath: string) {
    return Api.get<ModelInfoList>(modelPath)
  }
}
