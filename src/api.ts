import http from 'http'
import https from 'https'
import { ModelInfoList, ModelList } from './type'

export default class Api {
  fetch!: typeof https | typeof http
  static baseURL: string

  constructor(baseURL: string) {
    if (!baseURL) throw new Error('接口地址不存在')
    if (!/^https?:\/\/.+/.test(baseURL)) throw new Error('请配置正确的接口地址')
    Api.baseURL = /\/$/.test(baseURL) ? baseURL : `${baseURL}/`
    this.fetch = /^http:\/\//.test(baseURL) ? http : https
  }

  get<T = any>(url: string) {
    url = url.replace(/^\//, '')
    return new Promise<T>((resolve, reject) => {
      let rawData = ''
      this.fetch
        .get(`${Api.baseURL}${url}`, res => {
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

  getModelList() {
    return this.get<ModelList[]>('/swagger-resources')
  }

  getModelInfoList(modelPath: string) {
    return this.get<ModelInfoList>(modelPath)
  }
}
