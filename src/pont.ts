import fs from 'fs'
import log from './log'
import Api from './api'
import path from 'path'
import { Doc2TsConfig, Doc2TsConfigKey, ModelList, ModuleConfig } from './type'
import { Surrounding, DataSourceConfig } from 'pont-engine/lib/utils'
import { readRemoteDataSource, OriginType } from 'pont-engine/lib/scripts'
import { camel2Kebab, createType, findDiffPath, firstToLower, firstToUpper, getConfig, rename } from './utils'
import { StandardDataSource } from 'pont-engine/lib/standard'

export default class Doc2Ts {
  api!: Api
  outDir = './services' // 文件输出地址
  modelList: ModelList[] = []
  originUrl!: string // swagger 接口地址
  configPath = './doc2ts.config.ts'
  baseClassName = 'ApiClient'
  // StandardDataSource
  StandardDataSourceList: { name: string; data: StandardDataSource }[] = []

  // 未使用
  rename?: Doc2TsConfig['rename']
  baseClassPath!: string
  resultGenerics = 'T'
  hideMethod?: boolean
  moduleConfig?: ModuleConfig // doc2ts.config 配置信息
  render: Doc2TsConfig['render']
  typeFileRender: Doc2TsConfig['typeFileRender']

  constructor() {
    this.init()
  }

  async init() {
    try {
      await this.getConfig()
      this.api = new Api(this.originUrl)
      await this.getModelList()
      await this.initRemoteDataSource()
    } catch (error) {
      console.error(error)
    }
  }

  async getConfig() {
    try {
      const config = await getConfig(this.configPath)
      Object.entries(config).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || Number.isNaN(value)) {
          // 如果用户传参的不符合规范则需要删除它，使用默认值
          delete config[key as Doc2TsConfigKey]
        }
      })
      Object.assign(this, { ...config })
      if (!this.baseClassPath || !this.originUrl) throw new Error('必要参数异常')
    } catch (error) {
      console.error(error)
    }
  }

  async getModelList(count = 0) {
    try {
      log.info('正在拉取 swagger 文档信息')
      const { data } = await this.api.getModelList()
      if (data.length === 0 && count <= 4) {
        await this.getModelList(count + 1)
        return
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        log.error('数据加载失败')
        throw new Error('数据加载异常')
      }
      this.modelList = data
      log.ok()
    } catch (error) {
      log.error('数据加载失败')
      return Promise.reject(error)
    }
  }

  async initRemoteDataSource() {
    const config: DataSourceConfig = {
      originType: OriginType.SwaggerV2,
      originUrl: 'https://mock.mengxuegu.com/mock/61134195d43427056756821a/jiukang/pont-test',
      // 使用operationId作为方法名
      usingOperationId: true,
      // pont 支持一个项目中配置多个 Swagger 来源。此处配置是否启用多数据源
      usingMultipleOrigins: false,
      // 是否拆分api-lock.json到具体数据源
      spiltApiLock: false,
      outDir: './src/services',
      templatePath: './pontTemplate',
      taggedByName: true,
      // 可选项。用于生成 pont 内置模板。配置该项时，一旦检测到本地模板文件不存在将自动使用配置的模板类型生成模板文件。内置模板功能强大
      templateType: '',

      // 生成文件类型
      surrounding: Surrounding.typeScript,

      // 废弃接口扫描
      scannedRange: [],

      // 数据源之后会尝试调用由transformPath
      transformPath: '',
      // 可选项, 相对项目根目录路径。用于 Swagger 数据源需要登录才能请求成功的场景，可指定获取 Swagger 源数据的方法。默认为 node-fetch 的 fetch 方法
      fetchMethodPath: '',
      // 生成的代码会用 prettier 来美化。此处配置 prettier 的配置项即可，具体可以参考
      prettierConfig: {},
      // pont定时拉取数据，单位为秒，默认 20 分钟
      pollingTime: 1200,
      mocks: {
        enable: false,
        basePath: '',
        port: 8080,
        wrapper: ''
      }
    }

    try {
      this.modelList.map(async ({ url, name, swaggerVersion }) => {
        let originType: OriginType
        switch (swaggerVersion) {
          case '3.0':
            originType = OriginType.SwaggerV3
            break
          case '2.0':
            originType = OriginType.SwaggerV2
            break
          case '1.0':
            originType = OriginType.SwaggerV1
            break
          default:
            originType = OriginType.SwaggerV2
        }
        config.originType = originType
        config.originUrl = `${this.originUrl}${url}`

        const data = await readRemoteDataSource(config, (text: string) => {
          log.info(`${name}-${text}`)
        })
        this.StandardDataSourceList.push({ data, name })
      })
    } catch (error) {
      console.error(error)
    }
  }
}
