import fs from 'fs'
import path from 'path'
import Api from './api'
import { Doc2TsConfig, Doc2TsConfigKey, DocModelInfoList, ModelInfos, ModelList, ModuleConfig } from './type'
import { camel2Kebab, createFile, createType, findDiffPath, firstToLower, firstToUpper, getConfig, resolveOutPath, rename } from './utils'

import TypesList from './typesList'
import log from './log'
export default class Doc2Ts {
  configPath = './doc2ts.config.ts'
  api!: Api // 请求 swagger 工具
  outDir = './services' // 文件输出地址
  originUrl!: string // swagger 接口地址
  dataKey?: string
  modelList: ModelList[] = [] // 模块数据
  baseModelInfoList: DocModelInfoList[] = [] // 原始数据
  modelInfoList: TypesList[] = [] // 整理后的数据

  //  doc2ts.config.ts 配置相关
  rename?: Doc2TsConfig['rename']
  baseClassName = 'ApiClient'
  baseClassPath!: string
  resultGenerics = 'T'
  hideMethod?: boolean
  moduleConfig?: ModuleConfig // doc2ts.config 配置信息
  render: Doc2TsConfig['render']
  typeFileRender: Doc2TsConfig['typeFileRender']

  async build() {
    try {
      log.clear()
      await this.getConfig()
      this.createAxios()
      await this.getDocData()
      log.success('------- 任务成功 ------')
      log.success('------- 任务成功 ------')
      log.success('------- 任务成功 ------')
    } catch (error) {
      console.error(error)
      log.error('----任务终止----')
      log.error('----任务终止----')
      log.error('----任务终止----')
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

  createAxios() {
    this.api = new Api(this.originUrl)
  }

  async getDocData() {
    try {
      await this.getModelList()
      const reqList = this.modelList.map(i => this.getModelInfoList(i.name, i.url))
      await Promise.all(reqList)
      this.formatData()
      // fs.writeFileSync(path.join(__dirname, '../dist/baseModelInfoList.json'), JSON.stringify(this.baseModelInfoList))
      // fs.writeFileSync(path.join(__dirname, '../dist/modelInfoList.json'), JSON.stringify(this.modelInfoList))
      await this.createFileContent()
    } catch (error) {
      return Promise.reject(error)
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

  async getModelInfoList(name: string, modelPath: string) {
    try {
      const { data } = await this.api.getModelInfoList(modelPath)
      const modelName = rename(camel2Kebab(name), this.rename)
      if (!modelName) throw Error('模块名称不存在')
      this.baseModelInfoList.push({ data, modelName: firstToLower(modelName) })
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  /**
   * @description 整理数据结构
   */
  formatData() {
    log.info('正在整理数据')
    const { baseModelInfoList, moduleConfig = {}, resultGenerics, dataKey } = this
    this.modelInfoList = baseModelInfoList.map(item => new TypesList(item, moduleConfig, resultGenerics, dataKey))
    log.ok()
  }

  createApiMethod(apiInfos: ModelInfos['apiInfos']) {
    let { hideMethod: _hideMethod } = this
    return apiInfos
      .map(i => {
        const { requestInfo, funcInfo, methodConfig } = i
        const { funcName, funcTypeName } = funcInfo
        const { description, isDownload, config } = methodConfig
        const { url, params, restParameters } = requestInfo
        const noParams = restParameters.length === 0
        const bodyParams = restParameters.filter(i => i.inType === 'body')
        const queryParams = restParameters.filter(i => i.inType === 'query')

        const filterBody = bodyParams.length !== restParameters.length
        const filterQuery = queryParams.length !== restParameters.length
        let filterCode = ''
        if (filterBody && bodyParams.length > 0) {
          filterCode += `const bodyParams = ${JSON.stringify(bodyParams.map(i => i.keyName)).replace(/"/g, "'")}\n`
          filterCode += `    const body = this.extractParams(params, bodyParams)`
        }
        if (filterQuery && queryParams.length > 0) {
          const codeArray = JSON.stringify(queryParams.map(i => i.keyName)).replace(/"/g, "'")
          filterCode += `${filterCode ? '\n' : ''}    const queryParams = ${codeArray}\n`
          filterCode += `    const query = this.extractParams(params, queryParams)`
        }
        filterCode = filterCode ? `\n    ${filterCode}` : ''

        const query = queryParams.length > 0 ? `?\${this.serialize(${filterQuery ? 'query' : 'params'})}` : ''
        const body = bodyParams.length > 0 ? `, ${filterBody ? `params: body` : 'params'}` : ''
        const hideMethod = _hideMethod
          ? (!body && /get/i.test(i.method)) || (!noParams && /post/i.test(i.method))
          : false
        const method = hideMethod ? '' : `, method: '${i.method}'`

        const requestMethod = isDownload ? 'downloadFile' : 'request'
        const requestConfig = config ? `, config: ${JSON.stringify(config)}` : ''

        return `
  /**
   * @description ${description || i.summary}
  */
  ${funcName}: mT.${funcTypeName} = ${/^params$/.test(params) ? 'params' : `(${params})`} => {${filterCode}
    return this.${requestMethod}({ url: \`\${basePath}${url}${query}\`${body}${method}${requestConfig} })
  }\n`
      })
      .join('')
  }

  /**
   *
   * @description 创建 接口方法文件
   */
  createApiFile({ modelName, apiInfos, basePath, beforeName }: ModelInfos) {
    const className = `${firstToUpper(modelName)}`
    const apiMethodList = this.createApiMethod(apiInfos)
    const { baseClassName, baseClassPath, moduleConfig, render } = this
    // const {baseClassPath = './src/api/services/client', render } = this.config
    const savePath = resolveOutPath(this.outDir, 'module')
    const targetPath = path.join(process.cwd(), baseClassPath)
    const _baseClassPath = findDiffPath(savePath, targetPath)

    let content = `
import { ${baseClassName} } from '${_baseClassPath}'
import * as mT from './type/${modelName}'\n
const basePath = '${basePath}'

/**
 * @description ${beforeName}
 */
class ${className} extends ApiClient {${apiMethodList}}\n
export default new ${className}()\n`
    content = render ? render(content, modelName, moduleConfig?.[modelName] || {}) : content
    return createFile(savePath, firstToLower(`${className}.ts`), content)
  }

  /**
   * @id 创建 接口方法类型文件
   */
  createApiTypeFile({ modelName, apiInfos, typesList }: ModelInfos) {
    const { moduleConfig, typeFileRender } = this

    let methodTypes: string = ''
    let typesListStr: string = ''

    try {
      apiInfos.forEach(i => {
        const { funcInfo } = i
        const { funcType } = funcInfo

        methodTypes += `${funcType}\n`
      })

      typesList.forEach(i => {
        if (i.refs.length > 0) {
          typesListStr += `${createType(i)}\n`
        }
      })

      let content = `${typesListStr}${methodTypes}`
      content = typeFileRender ? typeFileRender(content, modelName, moduleConfig?.[modelName] || {}) : content

      const savePath = resolveOutPath(this.outDir, 'module/type')

      return createFile(savePath, `${modelName}.d.ts`, content)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @description 创建入口文件
   */
  createIndexFile() {
    const modelInfoList = this.modelInfoList.sort((a, b) => a.modelName.length - b.modelName.length)
    let content = modelInfoList.map(i => `import ${i.modelName} from './module/${i.modelName}'`).join('\n')
    content += `\n\nexport default {\n${modelInfoList.map(i => `  ${i.modelName}`).join(',\n')}\n}\n`
    return createFile(resolveOutPath(this.outDir, ''), `index.ts`, content)
  }

  /**
   * @description 创建 文件内容
   */
  async createFileContent() {
    const process = this.modelInfoList.map(async i => {
      // api 接口文件相关
      await this.createApiFile(i.modelInfo)

      // api 接口类型相关
      await this.createApiTypeFile(i.modelInfo)
    })
    process.push(this.createIndexFile())
    try {
      await Promise.all(process)
      log.success(log.done(' ALL DONE '))
    } catch (error) {}
  }

  // /**
  //  * @param preDirPath
  //  * @description 获取文件夹路径
  //  */
  // resolveOutPath(preDirPath: string) {
  //   return path.join(process.cwd(), this.outDir, preDirPath)
  // }

  // /**
  //  *
  //  * @description 创建文件
  //  */
  // async createFile(dirPath: string, fileName: string, content: string) {
  //   try {
  //     if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
  //     log.info(`正在创建：${fileName} 文件`)
  //     const filePath = path.join(dirPath, fileName)
  //     fs.writeFileSync(filePath, content)
  //   } catch (error) {
  //     log.error('创建失败')
  //     console.error(error)
  //     return Promise.reject(error)
  //   }
  // }
}
