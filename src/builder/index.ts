import fs from 'fs-extra'
import log from '../utils/log'
import path from 'path'
import { fileList } from '../generators/fileList'
import { Config, CONFIG_PATH } from '../common/config'
import {
  ts2Js,
  getConfig,
  checkJsLang,
  resolveOutPath,
  loadPrettierConfig,
  createFile,
  getApiJson,
  logProgress,
  sleep,
  getRootFilePath
} from '../utils'

// ------------------------------------
import docInit, { Dict, LogInfo } from 'doc-pre-data'
import { checkName } from 'doc-pre-data/lib/common/utils'
import { DictList, TranslateCode } from 'doc-pre-data/lib/common/translate'
import BuildTypeFile from './buildType'
import type { DocListItem } from '../types/newType'
import TsFileBuilder, { importList } from './tsFileBuilder'
import _ from 'lodash'
import ora from 'ora'

export default class Doc2Ts {
  config!: Config
  warnList: LogInfo[] = []
  errorList: LogInfo[] = []

  docList: DocListItem[] = []

  async build() {
    await this.getConfig()
    await this.initRemoteDataSource()
    await this.createFiles()
    await this.transform2js()

    const { warnList, errorList } = this
    return { warnList, errorList }
  }

  buildLog(logFunc?: Function) {
    const { warnList, errorList } = this
    log.clear()
    warnList.forEach(warn => {
      log.warning(warn.msg)
    })
    errorList.forEach(warn => {
      log.error(warn.msg)
    })
    log.success(log.done(' ALL DONE '))
  }

  async getConfig() {
    log.info('正在读取配置文件')
    const config = await getConfig(CONFIG_PATH)
    this.config = new Config(config)
  }

  saveDict(dictList: DictList[], dictPath: string, cache?: Dict['cache']) {
    const desc = [
      '----- 这是一个翻译缓存文件 -----',
      '----- 这是一个翻译缓存文件 -----',
      '----- 这是一个翻译缓存文件 -----',
      '如果您对翻译不满意可以在这里修改，在下次生成新的代码有效',
      '注意：修改翻译后生成的代码或文件名，都随之变化，引用的地方也需要做对应的修改'
    ]
    fs.createFileSync(dictPath)
    fs.writeFileSync(dictPath, JSON.stringify({ desc, dict: dictList, cache }, null, 2))
  }

  async initRemoteDataSource() {
    const { fetchSwaggerDataMethod, filterModule } = this.config
    const { prettierPath, origins, outDir, translateType, swaggerHeaders, useOperationId } = this.config
    const outputDir = resolveOutPath(outDir)

    await loadPrettierConfig(prettierPath)

    const noNameOrigin = origins.filter(i => !i.name)
    if (noNameOrigin.length > 1) {
      const filePath = getRootFilePath(CONFIG_PATH)
      log.error(
        `${log.errTag(' error ')} ${log.errColor('origins 不能同时存在多个匿名模块')} ${log.link(`${filePath}`)}`
      )
      process.exit(0)
    }

    const reqs = origins.map(async origin => {
      const dictPath = path.join(outputDir, `dicts/${origin.name ?? 'dict'}.json`)
      let cache: Dict = { dict: [], cache: { idNames: {}, returnTypeNames: {}, requestTypeNames: {} }, desc: [] }

      try {
        cache = fs.existsSync(dictPath) ? require(dictPath) : {}
        // if (!cache.cache) cache.cache = {}
        if (!Array.isArray(cache.dict)) cache.dict = []
      } catch (error) {}

      cache.dict = cache.dict.filter(i => {
        i.en = i.en?.trim() ?? null
        return !!i.en
      })

      let json: string | object = origin.url
      if (typeof fetchSwaggerDataMethod === 'function') {
        const swagger = await fetchSwaggerDataMethod(origin.url)
        json = JSON.parse(swagger)
      } else {
        json = await getApiJson(origin.url, swaggerHeaders)
      }

      try {
        const docInfo = await docInit(json, cache, { translateType, useOperationId })
        const { docApi, dictList, warnList, errorList, cache: newCache } = docInfo
        this.warnList = [...warnList]
        this.errorList = [...errorList]
        this.saveDict(dictList, dictPath, newCache)
        // fs.createFileSync(dictPath)
        // fs.writeFileSync(dictPath, JSON.stringify({ desc, dict: this.docList }, null, 2))

        if (typeof filterModule === 'function') {
          docApi.funcGroupList = docApi.funcGroupList.filter(filterModule)
        }

        docApi.funcGroupList.forEach(mod => {
          const names = docApi.funcGroupList.filter(i => mod !== i).map(i => i.moduleName)
          // types 是保留文件，防止和模块文件重名
          mod.moduleName = checkName(mod.moduleName, n => names.includes(n) || /^types$/i.test(n))
        })
        return { docApi, moduleName: origin.name, origin }
      } catch (error) {
        if ((error as any)?.code === TranslateCode.TRANSLATE_ERR) {
          const dictList = (error as any).dictList as DictList[]
          log.clear()
          this.saveDict(dictList, dictPath)
          log.error(`${log.errTag(' error ')} ${log.errColor('翻译失败.')}`)
          log.info(`您可以在 ${log.link(`${dictPath}`)} 文件里，把翻译失败（en为null）的信息翻译后重试。`)
          process.exit(0)
        } else {
          return Promise.reject(error)
        }
      }
    })

    try {
      this.docList = await Promise.all(reqs)

      this.docList.forEach(i => {
        const tsBuilder = new TsFileBuilder(i, this.config, i.origin)
        tsBuilder.build()
        const typeFile = new BuildTypeFile(i, this.config, i.origin)
        typeFile.build()
      })
    } catch (error) {
      // throw new Error(error?.toString());
      return Promise.reject(error)
    }
  }

  async createFiles() {
    if (fileList.length === 0) return

    // 创建 index.ts 文件
    const content = importList.sort((a, b) => a.length - b.length).join('\r\n')
    const { outDir } = this.config
    const filePath = path.join(resolveOutPath(outDir), 'index.ts')
    fileList.push({ filePath, content })

    log.clear()
    log.info(`正在创建文件`)

    const bar = logProgress()
    bar.start(fileList.length, 0)
    let index = 1
    for await (const { filePath, content } of fileList) {
      const dirList = filePath.split(path.sep)
      bar.update(index, { filename: _.last(dirList) })
      await sleep(60)
      await createFile(filePath, content, true)
      index++
    }

    await sleep(200)

    bar.stop()
  }

  async transform2js() {
    const { outDir, languageType, declaration = false, emitTs = false } = this.config
    const isJs = checkJsLang(languageType)
    if (!isJs) return
    try {
      const outDirPath = resolveOutPath(outDir)
      log.clear()
      const spinner = ora('正在转换 ts 文件为 js').start()

      const indexFilePath = path.join(outDirPath, 'index.ts')
      const indexFileJsPath = indexFilePath.replace(/\.ts$/, '.js')

      ts2Js([indexFilePath], declaration, (fileName, content) => {
        spinner.text = `正在转换 ${fileName} 文件`
        content = content.replace(/(\/\*\*)/g, '\n$1')
        content = content.replace(/(export\s+const)/g, '\n$1')
        content = content.replace(/(export\s+declare)/g, '\n$1')
        if (path.resolve(fileName) === indexFileJsPath) content = content.replace(/(export)/, '\n$1')
        return content
      })

      if (!emitTs) {
        // 不保留 ts 源文件，删除源ts文件 declaration
        let filesInfo: string[] = fileList.map(i => i.filePath)
        if (!declaration) {
          const reg = /types\.ts$/
          filesInfo = filesInfo.filter(i => {
            if (reg.test(i)) {
              const jsFilePath = i.replace(/\.ts$/, '.js')
              const tsDFilePath = i.replace(/\.ts$/, '.d.ts')
              if (fs.existsSync(jsFilePath)) fs.unlinkSync(jsFilePath)
              if (fs.existsSync(i)) fs.renameSync(i, tsDFilePath)
              return false
            }
            return true
          })
        }
        filesInfo.forEach(filePath => fs.existsSync(filePath) && fs.unlinkSync(filePath))
      }

      spinner.succeed('转换成功')
      await sleep(200)
      // log.success('转换成功')
    } catch (error: any) {
      log.error('转换失败')
      return Promise.reject(error)
    }
  }
}
