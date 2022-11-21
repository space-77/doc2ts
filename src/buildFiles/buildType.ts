import _ from 'lodash'
import path from 'path'
import { Config } from '../common/config'
import { DocListItem } from '../types/newType'
import { createParams, getOutputDir, TypeBase } from './common'
import { FuncGroupList } from '../doc/docApi'
import { getGenericsType } from '../doc/common/utils'
import { createFile, getDesc } from '../utils'
import { TypeInfoItem } from '../doc/docApi/components'
import TypeItem from '../doc/docApi/typeItem'

// 数据整合产生的类型，使用 type 定义类型
export const customInfoList: TypeBase[] = []

function getTypeKeyValue(typeItem: TypeItem) {
  const { name, type, description, deprecated, example, enumTypes, required, genericsItem } = typeItem
  const typeValue = typeof type === 'string' ? type : type?.typeName

  const genericsType = getGenericsType(genericsItem, enumTypes)
  const desc = getDesc(description, deprecated, example)
  return `${desc}${name.replace(/-/g, '_')}${required ? '' : '?'}:${typeValue}${genericsType}\n`
}

function createTypes(typeInfoList: TypeInfoItem[]) {
  let content = ''
  for (const { typeName, typeInfo } of typeInfoList) {
    const { typeItems, description, refValues, isEmpty, deprecated, attrs } = typeInfo

    if (isEmpty || attrs.hide) continue
    const desc = getDesc(description, deprecated)

    const extendsStr = refValues.length > 0 ? ` extends ${refValues.map(i => i.typeName).join(',')}` : ''
    content += `${desc}export interface ${typeName} ${extendsStr} {\n`
    typeItems.sort((a, b) => a.name.length - b.name.length)
    for (const typeItem of typeItems) {
      content += getTypeKeyValue(typeItem)
    }
    content += '}\r\n\r\n'
  }
  return content
}

function createFuncType(funcGroupList: FuncGroupList[]): string {
  let content = ''
  const funcInfoList = _.flatten(funcGroupList.map(i => i.funcInfoList))

  for (const funcItem of funcInfoList) {
    const { item, name, method, apiPath, bodyName, paramsName, responseName } = funcItem
    const { responseType, parameterType, requestBodyType } = funcItem
    const { deprecated, description } = item
    // const { paramTypeName } = createParams(parameterType, requestBodyType)
  }

  return content
}

function createCustomType() {
  let content = ''
  customInfoList.sort((a, b) => a.typeName.length - b.typeName.length)
  customInfoList.forEach(i => {
    const { typeName, typeItems, deprecated, description, refValues } = i

    let typeStr = ''
    if (typeItems.length > 0) {
      typeStr += '{'
      for (const typeItem of typeItems) {
        typeStr += getTypeKeyValue(typeItem)
      }
      typeStr += '}'
    }
    const extendList = refValues
      .filter(i => i && !i.isEmpty)
      .map(i => i.typeName)
      .join('&')

    if (extendList || typeStr) {
      const desc = getDesc(description, deprecated)
      content += `${desc}export type ${typeName} = ${typeStr} ${extendList ? `&${extendList}` : ''}\n\n`
    }
  })

  return content
}

export function buidTsTypeFile(doc: DocListItem, config: Config) {
  const { docApi, moduleName = '' } = doc
  const outputDir = getOutputDir(moduleName, config)

  let content = createTypes(docApi.components.typeInfoList)
  content += createCustomType()
  // content += createFuncType(docApi.funcGroupList)

  const filePath = path.join(outputDir, 'types.d.ts')
  createFile(filePath, content)
}
