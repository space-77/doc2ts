import { findType, firstToUpper, updateName } from './utils'
// import { ModuleConfig } from '../doc2ts.config'
import type { DocModelInfoList, FormatParamsType, GetResponsesType, ModelInfos, ModuleConfig, TypeList } from './type'

const preReg = /^(get|post|add|delete|save|put|update|select|create|destroy|edit|find|send|download|handle)/i

export default class TypesList {
  modelName: string
  modelItem: DocModelInfoList
  resultGenerics: string
  moduleConfig: ModuleConfig

  modelInfo!: ModelInfos
  typesList: TypeList[] = []
  funcNames = new Set<string>([])
  funcTypeNameList: string[] = []
  emptyKey = '-1'
  dataKey: string | undefined

  constructor(modelItem: DocModelInfoList, moduleConfig: ModuleConfig, resultGenerics: string, dataKey?: string) {
    this.modelItem = modelItem
    this.dataKey = dataKey
    this.resultGenerics = resultGenerics
    this.moduleConfig = moduleConfig
    this.modelName = modelItem.modelName
    this.formarModelData()
  }

  formarModelData() {
    const { modelName, data } = this.modelItem
    const { basePath, paths, definitions } = data
    const moduleConfig = this.moduleConfig?.[modelName] || {}
    const { typesList, funcNames, funcTypeNameList } = this

    const apiInfos: ModelInfos['apiInfos'] = Object.entries(paths).map(([url, value]) => {
      const [method, info] = Object.entries(value)[0]
      const { summary, parameters, responses, operationId } = info

      // 方法相关信息
      // 对应该方法的配置信息
      const methodConfig = moduleConfig.methodConfig?.[operationId] || {}
      let funcName = operationId.replace(new RegExp(`${method}(_\\d+)?$`, 'i'), '')
      // 修复方法名可能动词叠加问题
      if (!preReg.test(funcName)) funcName = `${method}${firstToUpper(funcName)}`
      if (methodConfig.name) funcName = methodConfig.name
      if (funcNames.has(funcName)) funcName = updateName(funcName, funcNames)
      funcNames.add(funcName)
      const funcTypeName = firstToUpper(funcName)

      // 返回体相关
      const { originalRef } = responses[200].schema ?? {}
      const resTypeName = `${funcTypeName}Response`

      if (originalRef) {
        // 引用类型
        const params = {
          typesList,
          definitions,
          topmost: true,
          preRef: originalRef,
          typeName: resTypeName
        }
        this.formatTypeList(params)
      }

      const itemTypeInfo = typesList.find(i => i.preRef === originalRef)
      if (itemTypeInfo && this.dataKey) this.advanceType(itemTypeInfo)

      const hsaParam = parameters?.length > 0
      const requestType = `${funcTypeName}Params`
      const paramsStr = hsaParam ? `params: ${requestType}` : ''

      let paramsTypes: TypeList['value'] = []
      if (Array.isArray(parameters)) {
        paramsTypes = this.formatParamsType({
          typesList,
          parameters,
          definitions,
          paramsTypeName: requestType,
          description: `${summary} 请求参数`
        })
      }

      // 泛型
      const hsaResType = !!itemTypeInfo && itemTypeInfo.value.length > 0
      const T = `T = ${hsaResType ? resTypeName : 'any'}`
      // const R = hsaParam ? `, R = ${requestType}` : ''

      const funcType = `/** @id ${operationId} */\nexport type ${funcTypeName} = <${T}>(${paramsStr}) => Promise<${this.resultGenerics}>`
      const funcInfo = { funcName, funcTypeName, requestType, responseType: resTypeName, funcType }
      funcTypeNameList.push(funcTypeName)

      // 请求信息相关信息
      let params = ''
      const qurey = url.match(/\{\w+\}/g)?.map(i => i.match(/\w+/)?.[0] || '') || []
      const nonEmpty = qurey.length > 0
      const restParameters = paramsTypes.filter(i => !qurey.includes(i.keyName as string)) // 剩余参数
      if (nonEmpty) {
        url = url.replace(/\{(\w+)\}/g, val => `$${val}`)
        params = `{ ${qurey.join(', ')}${restParameters.length > 0 ? ', ...params' : ''} }`
      } else {
        params = hsaParam ? 'params' : ''
      }
      const requestInfo = { url, params, qurey, restParameters }

      return {
        method,
        summary,
        funcInfo,
        resTypeName,
        paramsTypes,
        operationId,
        requestInfo,
        methodConfig
      }
    })

    this.modelInfo = {
      apiInfos,
      basePath,
      typesList,
      funcTypeNameList,
      beforeName: modelName,
      modelName: moduleConfig.moduleName || modelName
    }
  }

  /**
   * @description 整理 整理数据类型
   */
  formatTypeList: GetResponsesType = params => {
    let { preRef, definitions, typesList, inType, typeName, topmost, description: pDes } = params
    if (typeof preRef !== 'string' || !preRef) throw new Error('数据中的 originalRef 异常')

    const typeInfo = definitions[preRef]
    if (typeof typeInfo === 'string') console.log({ typeInfo })
    const { properties, type: pType, required: _required, description = pDes } = typeInfo ?? {}

    const parentTypeItem = typesList.find(i => i.preRef === preRef)
    if (parentTypeItem) {
      const { typeName: parentTypeName, value } = parentTypeItem
      if (value.length > 0) {
        if (topmost) {
          // 顶级类型，暂时不用考虑重名问题
          const typeItem = { typeName, preRef, value: [], description, parentTypeName, refs: [typeName] }
          typesList.push(typeItem)
        }
        parentTypeItem.refs.push(typeName)
        return parentTypeName
      }
      // 空类型不要继承
      return this.emptyKey
    }

    const nameSet = new Set(typesList.map(i => i.typeName))
    typeName = nameSet.has(typeName) ? updateName(typeName, nameSet) : typeName

    if (pType && typeof properties === 'object') {
      const requiredSet = new Set(_required || [])
      const value: TypeList['value'] = []
      const typeItem = { typeName, preRef, value, description, refs: [typeName] }
      typesList.push(typeItem)

      const _value: TypeList['value'] = Object.entries(properties).map(([keyName, info]) => {
        const required = Array.isArray(_required) ? requiredSet.has(keyName) : true
        const { description, type, example, items } = info
        const originalRef = info.originalRef || items?.originalRef
        const childType = items?.type
        let childTypeName: string | undefined

        if (originalRef === preRef) {
          typeItem.refs.push(`${typeName}-${keyName}`)
          return {
            type,
            inType,
            example,
            keyName,
            required,
            description,
            hsaChild: !!originalRef,
            childTypeName: typeName
          }
        }

        if (originalRef) {
          const params = {
            inType,
            typesList,
            definitions,
            description: `${description}-子类型`,
            preRef: originalRef,
            typeName: firstToUpper(keyName)
          }
          childTypeName = this.formatTypeList(params) || findType(originalRef)
          childTypeName = childTypeName === this.emptyKey ? undefined : childTypeName
        }

        return {
          type,
          inType,
          keyName,
          example,
          required,
          childType,
          description,
          childTypeName,
          hsaChild: !!originalRef
        }
      })
      typeItem.value.push(..._value)
      return _value.length > 0 ? typeName : this.emptyKey
    }
  }

  formatParamsType: FormatParamsType = params => {
    const value: TypeList['value'] = []
    const { parameters, paramsTypeName, definitions, typesList, description } = params

    parameters.forEach(i => {
      const { in: inType, required, name, description, schema, type } = i
      const { originalRef } = schema ?? {}
      const keyName = name
      let parentTypeName: string | undefined
      if (originalRef) {
        const params = {
          inType,
          typesList,
          definitions,
          preRef: originalRef,
          typeName: firstToUpper(name)
        }
        parentTypeName = this.formatTypeList(params)
        parentTypeName = parentTypeName === this.emptyKey ? undefined : parentTypeName
        const index = typesList.findIndex(i => i.preRef === originalRef)
        if (index > -1) {
          const { value: _value = [], typeName } = typesList[index] ?? {}
          value.push(..._value)
          this.deleteType(typeName)
        }
        return
      }
      const item = {
        type,
        inType,
        keyName,
        required,
        description,
        parentTypeName,
        example: i['x-example'],
        hsaChild: !!originalRef
      }
      value.push(item)
    })
    const typeItem = { typeName: paramsTypeName, preRef: paramsTypeName, value, description, refs: [paramsTypeName] }
    typesList.push(typeItem)
    return value
  }

  advanceType(itemTypeInfo: TypeList) {
    if (!this.dataKey) return
    const { typesList } = this
    const { childTypeName } = itemTypeInfo.value.find(i => i.keyName === this.dataKey) || {}
    if (childTypeName) {
      const childItem = typesList.find(i => i.typeName === childTypeName)
      if (childItem) {
        itemTypeInfo.value = childItem.value
        this.deleteType(childItem.typeName)
      } else {
        itemTypeInfo.value = []
      }
    } else {
      itemTypeInfo.value = []
    }
  }

  deleteType(typeName: string) {
    if (!typeName) return -1
    const index = this.typesList.findIndex(i => i.typeName === typeName)
    if (index > -1) {
      const item = this.typesList[index]
      const newRefs = item.refs.filter(i => i !== item.typeName)
      if (newRefs.length === 0) {
        // 没有引用，可以删除
        this.typesList.splice(index, 1)
      } else {
        // 还有其地方引用该类型，不能删除
        item.refs = newRefs
      }
    }
    return index
  }
}
