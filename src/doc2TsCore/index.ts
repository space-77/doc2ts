import fs from 'fs'
import log from '../utils/log'
import Api from '../utils/api'
import path from 'path'
import { fileList } from '../generators/fileList'
import CreateTypeFile from '../generators/createTypeFile'
import { DataSourceConfig } from '../pont-engine/utils'
import { Config, CONFIG_PATH, Surrounding } from '../common/config'
import { readRemoteDataSource, OriginType } from '../pont-engine/scripts'
import { CreateApiFile, createBaseClassFile, createIndexFilePath } from '../generators/createApiFile'
import { FilePathList, ModelInfo, ModelList, StandardDataSourceLister } from '../types/type'
import {
  ts2Js,
  rename,
  getConfig,
  getTsFiles,
  camel2Kebab,
  checkJsLang,
  findDiffPath,
  resolveOutPath,
  loadPrettierConfig,
  createFile
} from '../utils'

export default class Doc2Ts {
  api = new Api()
  // modelList: ModelList[] = []
  StandardDataSourceList: StandardDataSourceLister[] = []

  config!: Config

  constructor() {
    this.init()
  }

  async init() {
    try {
      await this.getConfig()
      // await this.getModelList()
      await this.initRemoteDataSource()
      await this.generateFileData()
      this.createFiles()
      await this.transform2js()
      log.clear()
      log.success(log.done(' ALL DONE '))
    } catch (error) {
      console.error(error)
    }
  }

  async getConfig() {
    const config = await getConfig(CONFIG_PATH)
    this.config = new Config(config)
  }

  // async getModelList() {
  //   try {
  //     this.modelList = await getModelUrl(this.config.origins)
  //   } catch (error) {
  //     log.error('获取API接口数据失败')
  //     console.error(error)
  //   }
  // }

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

    const reqs = this.config.origins.map(async ({ url, name, version }) => {
      name = name ? camel2Kebab(name) : ''
      if (this.config.rename) name = rename(name, this.config.rename)
      let originType: OriginType
      switch (version) {
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
    // fs.writeFileSync(path.join(__dirname, `../../mock/modelInfoList.json`), JSON.stringify(this.StandardDataSourceList))
  }

  async generateFileData() {
    // try {
    //   const dataList = fs.readFileSync(path.join(__dirname, '../../mock/modelInfoList.json')).toString()
    //   this.StandardDataSourceList = JSON.parse(dataList) as StandardDataSourceLister[]
    // } catch (error) {
    //   console.error(error)
    //   return
    // }

    const { StandardDataSourceList } = this
    if (!Array.isArray(StandardDataSourceList) || StandardDataSourceList.length === 0) throw new Error('没有数据源')

    const {
      render,
      outDir,
      hideMethod,
      prettierPath,
      baseClassName,
      baseClassPath,
      typeFileRender,
      methodConfig,
      resultTypeRender,
      moduleConfig = {}
    } = this.config

    await loadPrettierConfig(prettierPath)

    const outputDir = resolveOutPath(outDir)
    const targetPath = resolveOutPath(baseClassPath)
    const tempClassPath = path.join(outputDir, 'module/baseClass.ts')
    createBaseClassFile({ tempClassPath, targetPath, importBaseCalssName: baseClassName })
    const filePathList: FilePathList[] = []

    StandardDataSourceList.forEach(async i => {
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
          diffClassPath,
          methodConfig
        }
        const createApiFile = new CreateApiFile(params)
        createApiFile.createFile()

        const createTypeFile = new CreateTypeFile({
          fileName,
          interfaces,
          baseClasses,
          typeDirPaht,
          typeFileRender,
          resultTypeRender
        })

        createTypeFile.generateFile()
        createTypeFile.createBaseClasses()
      })
      filePathList.push({ moduleName, data: filePathItems })
      // await Promise.all(pros)
    })

    const indexFilePath = path.join(outDir, 'index.ts')
    createIndexFilePath({ outDir: outputDir, filePathList, indexFilePath })
  }

  createFiles() {
    if (fileList.length === 0) return
    const { outDir, baseClassPath } = this.config
    const outDirPath = path.join(resolveOutPath(outDir), 'index')
    const targetPath = resolveOutPath(baseClassPath)
    const typesDir = path.join(outDirPath, 'types')
    const modulesDir = path.join(outDirPath, 'module')

    // 删除清空文件夹
    if (fs.existsSync(typesDir)) fs.rmdirSync(typesDir, { recursive: true })
    if (fs.existsSync(modulesDir)) fs.rmdirSync(modulesDir, { recursive: true })

    const removeFiles = [
      `${outDirPath}.d.ts`,
      `${outDirPath}.ts`,
      `${outDirPath}.js`,
      `${targetPath}.js`,
      `${targetPath}.d.ts`
    ]

    removeFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    })

    fileList.forEach(({ filePath, content }) => {
      createFile(filePath, content)
    })
  }

  async transform2js() {
    const { outDir, languageType, declaration = true, emitTs = false } = this.config
    const isJs = checkJsLang(languageType)
    if (!isJs) return
    try {
      const outDirPath = resolveOutPath(outDir)
      const modeleDir = path.join(outDirPath, 'module')
      log.clear()
      log.info('正在转换 ts 文件为 js')

      const indexFilePath = path.join(outDirPath, 'index.ts')
      ts2Js([indexFilePath], declaration)

      if (!emitTs) {
        // 不保留 ts 源文件，删除源ts文件
        const filesInfo: string[] = getTsFiles(modeleDir)
        filesInfo.push(indexFilePath)
        filesInfo.map(filePath => fs.existsSync(filePath) && fs.unlinkSync(filePath))
      }

      if (!declaration) {
        // 删除 types 里的 .d.ts 文件
        fs.rmdirSync(path.join(outDirPath, 'types'), { recursive: true })
      }

      log.success('转换成功')
    } catch (error: any) {
      log.error('转换失败')
      return Promise.reject(error)
    }
  }
}
