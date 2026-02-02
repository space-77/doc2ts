import Translate, { TranslateType } from '../common/translate'
import Components from './components'
import TypeInfoBase from './components/base'
import type { OpenAPIV3 } from 'openapi-types'
import { OperationObject } from '../types/openapi'
import { HttpMethods, httpMethods } from '../common'
import {
  checkName,
  firstToUpper,
  fixStartNum,
  getCommonPrefix,
  getIdentifierFromUrl,
  getMaxSamePath,
  getSameName,
  isChinese,
  transformCamelCase
} from '../common/utils'
import _ from 'lodash'
import type { Dict } from '../types'
import AIFunctionNamer, { FuncNameInfo } from '../common/aiFunctionNamer'
import { AIConfig } from '../common/translate'

// 数据模板： https://github.com/openapi/openapi/tree/master/src/mocks

export interface PathItem {
  name: string
  item: OpenAPIV3.OperationObject
  method: HttpMethods
  apiPath: string
  bodyName: string
  moduleName: string
  paramsName: string
  responseName: string
  responseType?: TypeInfoBase
  parameterType?: TypeInfoBase
  requestBodyType?: TypeInfoBase
}

export type FuncGroupList = {
  moduleName: string
  description?: string
  funcInfoList: PathItem[]
}

export type FuncGroupItem = { item: OperationObject; apiPath: string; method: HttpMethods; tags: string[] }
export type FuncGroup = {
  tag: string
  funs: FuncGroupItem[]
  moduleName: string
  tagInfo?: OpenAPIV3.TagObject
}

export type PathInfo = { moduleName: string; tagInfo?: OpenAPIV3.TagObject; pathItems: PathItem[] }

export default class DocApi {
  funcGroupList: PathInfo[] = []

  private pathItems: PathItem[] = []
  typeGroup!: Components
  private aiFunctionNamer?: AIFunctionNamer

  constructor(
    public json: OpenAPIV3.Document,
    private useOperationId = true,
    private dict?: Dict,
    private aiConfig?: AIConfig
  ) {
    // 如果启用了 AI 方法名优化，创建 AIFunctionNamer 实例
    if (aiConfig?.enableFuncNameOptimize) {
      this.aiFunctionNamer = new AIFunctionNamer(aiConfig, dict)
    }
  }

  async init() {
    // 1、翻译
    // 2、先收集数据
    // 3、再整理数据
    const moduleList = this.funcGroup()
    await this.formatFunsV2(moduleList)
    this.formatTypes()
  }

  private formatTypes() {
    // 1、梳理 收集 类型以及类型索引
    // 2、整理 类型数据
    this.typeGroup = new Components(this.json, this.pathItems)
  }

  private funcGroup() {
    const { json } = this
    const { tags: _tagList = [], paths } = json

    const funData = Object.entries(paths)

    let tagList: OpenAPIV3.TagObject[] = []
    if (Array.isArray(_tagList) && _tagList.length > 0) {
      tagList = _tagList
    } else {
      funData.forEach(([_, pathsObject]) => {
        if (!pathsObject) return
        for (const method of httpMethods) {
          const item = pathsObject[method] as OperationObject | undefined
          if (!item) continue
          const { tags = [] } = item
          tags.forEach(tag => {
            if (!tagList.find(i => i.name === tag)) {
              tagList.push({ name: tag, description: 'Method without tag' })
            }
          })
        }
      })
    }
    // const tagList = !Array.isArray(_tagList) || _tagList.length === 0 ? _tagList : []

    const moduleList: FuncGroup[] = []

    const notTagDes = 'Method without tag'

    for (const [apiPath, pathsObject] of funData) {
      if (!pathsObject) break

      for (const method of httpMethods) {
        const item = pathsObject[method] as OperationObject | undefined
        if (!item) continue

        const { tags = ['index'] } = item
        const funItem: FuncGroupItem = { item, apiPath, method, tags }
        tags.forEach(tag => {
          const moduleItem = moduleList.find(i => i.tag === tag)
          if (!moduleItem) {
            // const flip = tagList.map(i => i.name).some(i => i.split('').some(isChinese))

            const tagInfo = tagList.find(i => [i.name, i.description].filter(Boolean).includes(tag)) ?? {
              name: 'index',
              description: notTagDes
            }

            // 兼容某些项目把swagger tag的name和description弄反的情况
            // 当检测到name包含中文的时候，采用description
            const flip = tagInfo.name.split('').some(isChinese)

            if (flip) {
              if (tagInfo.description) {
                const { description } = tagInfo
                tagInfo.description = tagInfo.name
                tagInfo.name = description
              } else {
                tagInfo.description = tagInfo.name
              }
            }

            let moduleName = Translate.startCaseClassName(transformCamelCase(tagInfo.name), TranslateType.english)
            moduleName = checkName(moduleName, n => !!moduleList.find(i => i.moduleName === n))

            moduleList.push({ moduleName, tag, funs: [funItem], tagInfo })
          } else {
            moduleItem.funs.push(funItem)
          }
        })
      }
    }

    // const rootSamePath = getMaxSamePath(Object.keys(json.paths).map(path => path.slice(1)))

    // // 优化模块名字
    // moduleList.forEach(mod => {
    //   const { funs } = mod
    //   const [samePath] = _.startCase(getSamePath(funs.map(i => i.apiPath.replace(rootSamePath, '')))).split(' ')
    //   let moduleName = Translate.startCaseClassName(samePath, 3) || mod.moduleName

    //   // 保证模块名字唯一性
    //   const names = moduleList.map(i => i.moduleName)
    //   moduleName = checkName(moduleName, n => names.includes(n))
    //   mod.moduleName = moduleName
    // })

    const moduleSamePath = getCommonPrefix(moduleList.map(m => m.moduleName))
    moduleList.forEach(mod => {
      const { moduleName } = mod
      if (moduleName === moduleSamePath) return
      const newName = moduleName.replace(new RegExp(`^${moduleSamePath}`), '')
      if (this.dict) {
        const cache = this.dict.dict?.find(i => i.en === moduleName)
        if (cache) cache.en = newName
      }
      mod.moduleName = newName
    })

    return moduleList
  }

  private creatFunItem(funInfo: FuncGroupItem, name: string, moduleName: string) {
    const { apiPath, method, item } = funInfo
    const funcName = firstToUpper(name)
    const bodyName = `${funcName}Body`
    const paramsName = `${funcName}Params`
    const responseName = `${funcName}Res`
    return {
      item,
      name,
      method,
      apiPath,
      bodyName,
      moduleName,
      paramsName,
      responseName
    }
  }

  private async formatFunsV2(moduleList: FuncGroup[]) {
    const pathInfoList: PathInfo[] = []
    const funKeys = new Set<FuncGroupItem>([])

    // 如果启用了 AI 方法名优化，先处理所有模块
    if (this.aiFunctionNamer) {
      for (const moduleItem of moduleList) {
        const { funs, moduleName } = moduleItem

        // 设置当前模块
        this.aiFunctionNamer.setModuleName(moduleName)

        // 收集方法信息
        const funcNameInfos: FuncNameInfo[] = funs.map(funInfo => {
          const { item, method, apiPath } = funInfo
          const { operationId, summary, description } = item

          // 生成缓存 key
          const cacheKey = operationId || `${method}_${apiPath}`

          return {
            apiPath,
            method,
            operationId,
            summary,
            description,
            cacheKey
          }
        })

        // 调用 AI 批量优化方法名
        const optimizedNames = await this.aiFunctionNamer.optimizeFuncNames(funcNameInfos)

        // 使用优化后的名称生成 pathItems
        const names = new Set<string>()
        const samePath = getMaxSamePath(funs.map(i => i.apiPath.slice(1)))

        const operationIds = funs.map(fun => fun.item.operationId).filter(Boolean) as string[]
        const sameName = operationIds.length > 1 ? getSameName(operationIds) : ''

        const pathItems = funs.map(funInfo => {
          const { item, method, apiPath } = funInfo
          const { operationId } = item

          // 获取缓存 key
          const cacheKey = operationId || `${method}_${apiPath}`

          // 优先使用 AI 优化后的名称
          let name = optimizedNames.get(cacheKey)

          // 如果没有 AI 优化结果，使用原有逻辑生成
          if (!name) {
            name = this.createFunName(apiPath, samePath, method, operationId)
          }

          // 处理公共前缀
          if (name !== sameName) name = name.replace(new RegExp(`^${sameName}`), '')

          // 检查重复
          if (names.has(name)) name += _.upperFirst(method)
          name = checkName(name, checkName => names.has(checkName))
          name = fixStartNum(name)
          names.add(name)

          const funItem = this.creatFunItem(funInfo, name, moduleName)
          this.pathItems.push(funItem)
          funKeys.add(funInfo)

          return funItem
        })

        const pathInfo = { moduleName, tagInfo: moduleItem.tagInfo, pathItems }
        pathInfoList.push(pathInfo)
      }
    } else {
      // 原有逻辑（未启用 AI 优化）
      moduleList.forEach(moduleItem => {
        const { funs, moduleName, tagInfo } = moduleItem
        const names = new Set<string>([])
        const samePath = getMaxSamePath(funs.map(i => i.apiPath.slice(1)))

        const operationIds = funs.map(fun => fun.item.operationId).filter(Boolean) as string[]
        const sameName = operationIds.length > 1 ? getSameName(operationIds) : ''

        const pathItems = funs.map(funInfo => {
          const { item, method, apiPath } = funInfo
          const { operationId } = item
          let name = this.createFunName(apiPath, samePath, method, operationId)
          if (name !== sameName) name = name.replace(new RegExp(`^${sameName}`), '')
          if (names.has(name)) name += _.upperFirst(method)
          name = checkName(name, checkName => names.has(checkName))
          name = fixStartNum(name)
          names.add(name)

          const funItem = this.creatFunItem(funInfo, name, moduleName)

          this.pathItems.push(funItem)
          funKeys.add(funInfo)

          return funItem
        })

        const pathInfo = { moduleName, tagInfo, pathItems }

        pathInfoList.push(pathInfo)

        return
      })
    }

    this.funcGroupList = pathInfoList
  }

  private createFunName(apiPath: string, samePath: string, method: string, operationId?: string) {
    const { useOperationId } = this
    // SyncUsingGET
    if (operationId && useOperationId) {
      //  整理 operationId 作为方法名
      const str = operationId.replace(/(.+)(Using.+)/, '$1')
      let strs = _.lowerCase(str).split(' ').filter(Boolean)
      strs = _.uniq(strs)
      if (strs.length > 5) strs = strs.slice(0, 5)
      return _.camelCase(strs.join(' '))
    } else {
      // 整理 url 作为方法名
      return getIdentifierFromUrl(apiPath, method, samePath)
    }
  }
}

