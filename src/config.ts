import prettier from 'prettier'
import { Doc2TsConfig, Doc2TsConfigKey, ModuleConfig } from './type'

export enum PARAMS_NAME {
  BODY = 'body',
  QUERY = 'query',
  HEADER = 'header',
  FORMDATA = 'formData'
}

export class PrettierConfig {
  static config: prettier.Options
}

export class Config {
  readonly outDir: string = './services' // 文件输出地址
  readonly originUrl!: string // swagger 接口地址
  readonly baseClassName: string = 'ApiClient'
  readonly rename?: Doc2TsConfig['rename']
  readonly moduleConfig?: ModuleConfig // doc2ts.config 配置信息
  readonly prettierPath?: string
  readonly baseClassPath!: string
  readonly resultGenerics = 'T'
  readonly hideMethod: boolean = false
  readonly render: Doc2TsConfig['render']
  readonly typeFileRender: Doc2TsConfig['typeFileRender']
  readonly resultTypeRender: Doc2TsConfig['resultTypeRender']

  constructor(config: Doc2TsConfig) {
    Object.entries(config).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || Number.isNaN(value)) {
        // 如果用户传参的不符合规范则需要删除它，使用默认值
        delete config[key as Doc2TsConfigKey]
      }
    })
    Object.assign(this, { ...config })
    if (!this.baseClassPath || !this.originUrl) throw new Error('必要参数异常')
  }
}
