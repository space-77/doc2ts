import type prettier from 'prettier'
import { Doc2TsConfig, Doc2TsConfigKey, ModuleConfig } from '../types/type'

export const CONFIG_PATH = 'doc2ts-config.ts'

export enum Surrounding {
  typeScript = 'typeScript',
  javaScript = 'javaScript'
}

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
  readonly origins!: Doc2TsConfig['origins'] // swagger 接口地址
  // readonly swaggerBootstrapUiUrl!: Doc2TsConfig['swaggerBootstrapUiUrl']  // swagger-bootstrap-ui 接口地址
  readonly swaggerHeaders?: Doc2TsConfig['swaggerHeaders']
  readonly fetchSwaggerDataMethod?: Doc2TsConfig['fetchSwaggerDataMethod']
  readonly baseClassName: string = 'ApiClient'
  readonly rename?: Doc2TsConfig['rename']
  readonly moduleConfig?: ModuleConfig // doc2ts-config 配置信息
  readonly emitTs?: boolean
  readonly declaration?: boolean
  readonly prettierPath?: string
  readonly baseClassPath!: string
  readonly languageType?: Doc2TsConfig['languageType']
  readonly hideMethod: boolean = false
  readonly methodConfig?: Doc2TsConfig['methodConfig']
  readonly render: Doc2TsConfig['render']
  readonly typeFileRender: Doc2TsConfig['typeFileRender']
  readonly resultTypeRender: Doc2TsConfig['resultTypeRender']

  // baseClassPath

  constructor(config: Doc2TsConfig) {
    Object.entries(config).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || Number.isNaN(value)) {
        // 如果用户传参的不符合规范则需要删除它，使用默认值
        delete config[key as Doc2TsConfigKey]
      }
    })
    Object.assign(this, { ...config })

    if (!this.baseClassPath || !Array.isArray(this.origins) || this.origins.length === 0)
      throw new Error('必要参数异常')

    this.baseClassPath = this.baseClassPath.replace(/.ts/, '')
  }
}

const keyWordsList =
  'Array,Date,eval,function,hasOwnProperty,Infinity,isFinite,isNaN,isPrototypeOf,length,Math,NaN,Number,Object,prototype,String,toString,undefined,valueOf,abstract,arguments,boolean,break,byte,case,catch,char,class,const,continue,debugger,default,delete,do,double,else,enum,export,extends,false,final,finally,float,for,goto,if,implements,import,in,instanceof,int,interface,let,long,native,new,null,package,private,protected,public,return,short,static,super,switch,synchronized,this,throw,throws,transient,true,try,typeof,var,void,volatile,while,with,yield'.split(
    ','
  )
// js  关键字组合可用于判断声明的变量是否包含关键字
export const keyWordsListSet = new Set(keyWordsList)

keyWordsList.push(...Object.values(PARAMS_NAME))

// js  关键字组合 外加 请求方法里用上的几个变量名字 可用于判断声明的变量是否包含关键字
export const keyWords = new Set(keyWordsList)

export const tsObjType = new Set(['Array', '[]', 'object', '{}', 'Date', 'number', 'string', 'boolean', 'ObjectMap'])