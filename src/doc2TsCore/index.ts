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
  createFile,
  getName
} from '../utils'

// ------------------------------------
import DocApi from '../doc/docApi'
import docInit from '../doc/index'
import type { DocListItem } from '../types/newType'
import { buidTsTypeFile } from '../buildFiles/buildType'

export default class Doc2Ts {
  api = new Api()
  // modelList: ModelList[] = []
  StandardDataSourceList: StandardDataSourceLister[] = []

  config!: Config

  docList: DocListItem[] = []
  // constructor() {
  //   this.init()
  // }

  async init() {
    try {
      await this.getConfig()
      // await this.getModelList()
      await this.initRemoteDataSource()
      // await this.generateFileData()
      // this.createFiles()
      // await this.transform2js()
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
    // const { outDir } = this.config
    // const outputDir = resolveOutPath(outDir)
    // const typeDirPaht = path.join(outputDir, `types${modulePath}`)

    const reqs = this.config.origins.map(async i => {
      const docApi = await docInit(i.url)
      return { docApi, moduleName: i.name }
    })
    this.docList = await Promise.all(reqs)

    this.docList.forEach(i => {
      buidTsTypeFile(i, this.config)
    })

    // console.log(this.docList)
    // const doc = await docInit(this.config.origins)
    // fs.writeFileSync(path.join(__dirname, `../../mock/openapi.json`), JSON.stringify(this.docList[0]))
  }

  async generateFileData() {
    // try {
    //   const dataList = fs.readFileSync(path.join(__dirname, '../../mock/modelInfoList.json')).toString()
    //   this.StandardDataSourceList = JSON.parse(dataList) as StandardDataSourceLister[]
    // } catch (error) {
    //   console.error(error)
    //   return
    // }

    // 关闭全局配置参数的入参
    const disableParams = this.config.disableParams.map(({ type, name }) => `${type}__${name}`)
    const paramsSet = new Set(disableParams)
    this.StandardDataSourceList.forEach(({ data }) => {
      data.mods.forEach(({ interfaces }) => {
        interfaces.forEach(item => {
          item.parameters = item.parameters.filter(({ name, in: _in }) => !paramsSet.has(`${_in}__${name}`))
        })
      })
    })

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
      generateTypeRender,
      methodConfig,
      resultTypeRender
      // moduleConfig = {}
    } = this.config

    await loadPrettierConfig(prettierPath)

    const outputDir = resolveOutPath(outDir)
    const targetPath = resolveOutPath(baseClassPath)
    const tempClassPath = path.join(outputDir, 'module/baseClass.ts')
    createBaseClassFile({ tempClassPath, targetPath, importBaseCalssName: baseClassName })
    const filePathList: FilePathList[] = []

    StandardDataSourceList.forEach(async i => {
      const { data, name: moduleName } = i
      const { mods, baseClasses } = data
      const modulePath = moduleName ? `/${moduleName}` : ''
      const dirPath = path.join(outputDir, `module${modulePath}`)
      const typeDirPaht = path.join(outputDir, `types${modulePath}`)

      const filePathItems: FilePathList['data'] = []
      const fileTypeList: CreateTypeFile[] = []

      mods.forEach(({ interfaces, name: fileName, description }, index) => {
        const filePath = path.join(dirPath, `${fileName}.ts`)
        filePathItems.push({ filePath, fileName })

        const diffClassPath = findDiffPath(dirPath, tempClassPath).replace(/\.[t|j]s$/, '')
        const params: ModelInfo = {
          render,
          dirPath,
          filePath,
          fileName,
          moduleName,
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
          resultTypeRender,
          generateTypeRender
        })

        if (index === 0) createTypeFile.createBaseClasses()
        createTypeFile.generateFile()
      })
      filePathList.push({ moduleName, data: filePathItems })
    })

    const indexFilePath = path.join(outDir, 'index.ts')
    createIndexFilePath({ outDir: outputDir, filePathList, indexFilePath })
  }

  createFiles() {
    if (fileList.length === 0) return
    const { outDir, clearOutDir = true } = this.config
    if (clearOutDir) {
      const outDirPath = path.join(resolveOutPath(outDir))
      const typesDir = path.join(outDirPath, 'types')
      const modulesDir = path.join(outDirPath, 'module')

      // 删除清空文件夹
      if (fs.existsSync(typesDir)) fs.rmdirSync(typesDir, { recursive: true })
      if (fs.existsSync(modulesDir)) fs.rmdirSync(modulesDir, { recursive: true })

      const removeFiles = [
        path.join(outDirPath, 'index.d.ts'),
        path.join(outDirPath, 'index.ts'),
        path.join(outDirPath, 'index.js')
      ]

      removeFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      })
    }

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
      const indexFileJsPath = indexFilePath.replace(/\.ts$/, '.js')
      ts2Js([indexFilePath], declaration, (fileName, content) => {
        content = content.replace(/(\/\*\*)/g, '\n$1')
        content = content.replace(/(export\s+const)/g, '\n$1')
        content = content.replace(/(export\s+declare)/g, '\n$1')
        if (path.resolve(fileName) === indexFileJsPath) content = content.replace(/(export)/, '\n$1')
        return content
      })

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
