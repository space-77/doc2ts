import fs from 'fs-extra'
import log from '../utils/log'
import path from 'path'
import { fileList } from '../generators/fileList'
import { Config, CONFIG_PATH } from '../common/config'
import { ts2Js, getConfig, checkJsLang, resolveOutPath, loadPrettierConfig, createFile, getApiJson } from '../utils'

// ------------------------------------
import docInit from 'doc-pre-data'
import { checkName } from 'doc-pre-data/lib/common/utils'
import { DictList } from 'doc-pre-data/lib/common/translate'
import { buidTsTypeFile } from '../buildFiles/buildType'
import type { DocListItem } from '../types/newType'
import { buildApiFile, exportList, importList } from '../buildFiles/buildTsFile'

export default class Doc2Ts {
  config!: Config

  docList: DocListItem[] = []

  async init() {
    try {
      await this.getConfig()
      await this.initRemoteDataSource()
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

  async initRemoteDataSource() {
    const { prettierPath, origins, outDir, fetchSwaggerDataMethod } = this.config
    const outputDir = resolveOutPath(outDir)
    await loadPrettierConfig(prettierPath)

    const reqs = origins.map(async i => {
      const dictPath = path.join(outputDir, `dicts/${i.name ?? 'dict'}.json`)
      const dictListJson: DictList[] = fs.existsSync(dictPath) ? require(dictPath) : []

      let dataOrUrl: string | object = i.url
      if (typeof fetchSwaggerDataMethod === 'function') {
        const swagger = await fetchSwaggerDataMethod(i.url)
        dataOrUrl = JSON.parse(swagger)
      }

      const json = await getApiJson(i.url)

      const { docApi, dictList } = await docInit(json, dictListJson)
      fs.createFileSync(dictPath)
      fs.writeFileSync(dictPath, JSON.stringify(dictList, null, 2))

      docApi.funcGroupList.forEach(mod => {
        const names = docApi.funcGroupList.filter(i => mod !== i).map(i => i.moduleName)
        // types 是保留文件，防止和模块文件重名
        mod.moduleName = checkName(mod.moduleName, n => names.includes(n) || /^types$/i.test(n))
      })

      return { docApi, moduleName: i.name }
    })
    this.docList = await Promise.all(reqs)

    this.docList.forEach(i => {
      buildApiFile(i, this.config)
      buidTsTypeFile(i, this.config)
    })
  }

  createFiles() {
    if (fileList.length === 0) return

    // 创建 index.ts 文件
    let content = importList.sort((a, b) => a.length - b.length).join('\r\n')
    content += '\r\n\r\n'
    content += 'export default {'
    content += exportList.sort((a, b) => a.length - b.length).join(',\r\n')
    content += '}\n'
    const { outDir } = this.config
    const filePath = path.join(resolveOutPath(outDir), 'index.ts')
    fileList.push({ filePath, content })

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
        const filesInfo: string[] = fileList.map(i => i.filePath)
        // filesInfo.push(indexFilePath)
        filesInfo.forEach(filePath => fs.existsSync(filePath) && fs.unlinkSync(filePath))
      }

      log.success('转换成功')
    } catch (error: any) {
      log.error('转换失败')
      return Promise.reject(error)
    }
  }
}
