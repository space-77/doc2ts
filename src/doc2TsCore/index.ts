import log from '../utils/log'
import Api from '../utils/api'
import path from 'path'
import { Config, CONFIG_PATH } from '../common/config'
import CreateTypeFile from '../generators/createTypeFile'
import { Surrounding, DataSourceConfig } from 'pont-engine/lib/utils'
import { readRemoteDataSource, OriginType } from 'pont-engine/lib/scripts'
import { CreateApiFile, createBaseClassFile, createIndexFilePath } from '../generators/createApiFile'
import { FilePathList, ModelInfo, ModelList, StandardDataSourceLister } from '../type'
import { getConfig, resolveOutPath, loadPrettierConfig, rename, camel2Kebab, getModelUrl, findDiffPath } from '../utils'

export default class Doc2Ts {
  api = new Api()
  modelList: ModelList[] = []
  StandardDataSourceList: StandardDataSourceLister[] = []

  config!: Config

  constructor() {
    this.init()
  }

  async init() {
    try {
      await this.getConfig()
      await this.getModelList()
      await this.initRemoteDataSource()
      this.generateFile()
    } catch (error) {
      console.error(error)
    }
  }

  async getConfig() {
    try {
      const config = await getConfig(CONFIG_PATH)
      this.config = new Config(config)
    } catch (error) {
      console.error(error)
    }
  }

  async getModelList() {
    try {
      this.modelList = await getModelUrl(this.config.origins)
    } catch (error) {
      log.error('获取API接口数据失败')
      console.error(error)
    }
    // try {
    //   log.info('正在拉取 swagger 文档信息')
    //   let data: ModelList[] = []
    //   const { originUrl } = this.config
    //   if (Array.isArray(originUrl) && originUrl.length > 0) {
    //     // data = await this.api.getModelList()
    //   } else {
    //   }
    //   if (data.length === 0 && count <= 4) {
    //     await this.getModelList(count + 1)
    //     return
    //   }

    //   if (!data || !Array.isArray(data) || data.length === 0) {
    //     log.error('数据加载失败')
    //     throw new Error('数据加载异常')
    //   }
    //   log.ok()
    // } catch (error) {
    //   log.error('数据加载失败')
    //   return Promise.reject(error)
    // }
  }

  async initRemoteDataSource() {
    const config: DataSourceConfig = {
      originType: OriginType.SwaggerV2,
      originUrl: '',
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
      const reqs = this.modelList.map(async ({ url, name, swaggerVersion }) => {
        name = name ? camel2Kebab(name) : ''
        if (this.config.rename) name = rename(name, this.config.rename)
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
        config.originUrl = url
        config.originType = originType

        const data = await readRemoteDataSource(config, (text: string) => {
          log.info(`${name}-${text}`)
        })
        this.StandardDataSourceList.push({ data, name })
      })

      await Promise.all(reqs)

      // const data = await readRemoteDataSource(config, (text: string) => {
      //   log.info(text)
      // })
      // fs.writeFileSync(path.join(__dirname, `../../dist/modelInfoList.json`), JSON.stringify(this.StandardDataSourceList))
    } catch (error) {
      console.error(error)
    }
  }

  async generateFile() {
    // try {
    //   const dataList = fs.readFileSync(path.join(__dirname, '../../dist/modelInfoList.json')).toString()
    //   this.StandardDataSourceList = JSON.parse(dataList) as StandardDataSourceLister[]
    // } catch (error) {
    //   console.error(error)
    //   return
    // }

    const {
      render,
      outDir,
      hideMethod,
      prettierPath,
      baseClassName,
      baseClassPath,
      typeFileRender,
      resultTypeRender,
      moduleConfig = {}
    } = this.config

    await loadPrettierConfig(prettierPath)

    const outputDir = resolveOutPath(outDir)
    const targetPath = resolveOutPath(baseClassPath)
    const tempClassPath = path.join(outputDir, 'module/baseClass.ts')
    createBaseClassFile(tempClassPath, targetPath, baseClassName)
    const filePathList: FilePathList[] = []

    this.StandardDataSourceList.forEach(i => {
      const { data, name } = i
      const { mods, baseClasses } = data
      const config = name ? moduleConfig[name] || {} : {}

      const moduleName = config.moduleName || name
      const modulePath = moduleName ? `/${moduleName}` : ''
      const dirPath = path.join(outputDir, `module${modulePath}`)
      const typeDirPaht = path.join(outputDir, `types${modulePath}`)

      const filePathItems: FilePathList['data'] = []
      mods.forEach(({ interfaces, name: fileName, description }) => {
        const filePath = path.join(dirPath, `${fileName}.ts`)
        filePathItems.push({ filePath, fileName })

        const diffClassPath = findDiffPath(dirPath, tempClassPath).replace(/\.[t|j]s$/, '')
        const params: ModelInfo = {
          name,
          render,
          config,
          dirPath,
          filePath,
          fileName,
          hideMethod,
          interfaces,
          description,
          typeDirPaht,
          diffClassPath
        }
        new CreateApiFile(params)

        const createTypeFile = new CreateTypeFile({
          fileName,
          interfaces,
          baseClasses,
          typeDirPaht,
          typeFileRender,
          resultTypeRender
        })
        createTypeFile.createBaseClasses()
      })
      filePathList.push({ moduleName, data: filePathItems })
    })

    createIndexFilePath(outputDir, filePathList)
  }
}
