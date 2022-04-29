import axios, { AxiosInstance } from 'axios'
import { ModelInfoList, ModelList } from './type'

export default class Api {
  static axios: AxiosInstance

  constructor(baseURL: string) {
    if (!baseURL) throw new Error('接口地址不存在')
    Api.axios = axios.create({ baseURL })
  }

  getModelList() {
    return Api.axios.get<ModelList[]>('/api/swagger-resources')
  }

  getModelInfoList(modelPath: string) {
    return Api.axios.get<ModelInfoList>(`/api${modelPath}`)
  }
}
