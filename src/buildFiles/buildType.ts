import _ from 'lodash'
import path from 'path'
import { Config } from '../common/config'
import { getDesc } from '../utils'
import { fileList } from '../generators/fileList'
import { DocListItem } from '../types/newType'
import { TypeInfoItem } from 'doc-pre-data'
import { getOutputDir, TypeBase } from './common'

// 数据整合产生的类型，使用 type 定义类型
export const customInfoList: TypeBase[] = []
export const typeStringList: { typeName: string; typeValue: string }[] = []

function createTypes(typeInfoList: TypeInfoItem[], config: Config) {
  let content = ''
  const { generateTypeRender } = config
  for (let { typeName, typeInfo } of typeInfoList) {
    // if (typeInfo.d) {

    // }

    if (typeof generateTypeRender === 'function') {
      typeInfo = generateTypeRender(typeName, typeInfo)
    }

    const { typeItems, description, refs, isEmpty, deprecated, attrs, externalDocs, title } = typeInfo

    if (attrs.hide) continue
    const desc = getDesc({ description, deprecated, externalDocs, title })

    let extendsStr = ''

    if (refs.length > 0) {
      extendsStr = ' extends '
      const ff = refs.map(({ typeInfo, genericsItem }) => {
        let t = ''
        if (typeof genericsItem === 'string') {
          t = genericsItem
        } else if (genericsItem) {
          t = genericsItem.typeName
        }
        return typeInfo.typeName + (t ? `<${t}>` : '')
      })
      extendsStr += ff.join(',')
    }

    content += `${desc}export interface ${typeName} ${extendsStr} {\n`
    typeItems.sort((a, b) => a.name.length - b.name.length)
    for (const typeItem of typeItems) {
      if (typeItem.disable) continue
      content += typeItem.getTypeValue() // getTypeKeyValue(typeItem)
    }
    content += '}\r\n\r\n'
  }
  return content
}

function createCustomType(config: Config) {
  const { generateTypeRender } = config
  let content = ''
  customInfoList.sort((a, b) => a.typeName.length - b.typeName.length)
  customInfoList.forEach(i => {
    if (typeof generateTypeRender === 'function') {
      i = generateTypeRender(i.typeName, i)
    }
    const { typeName, typeItems, deprecated, description, refs, externalDocs, title } = i

    let typeStr = ''
    if (typeItems.length > 0) {
      typeStr += '{'
      for (const typeItem of typeItems) {
        if (typeItem.disable) continue
        typeStr += typeItem.getTypeValue() // getTypeKeyValue(typeItem)
      }
      typeStr += '}'
    }
    const extendList = refs
      .filter(i => i && !i.typeInfo.isEmpty)
      .map(i => i.typeInfo.typeName)
      .join('&')

    if (extendList || typeStr) {
      const desc = getDesc({ description, deprecated, externalDocs, title })
      const extendStr = extendList ? `${typeStr ? '&' : ''}${extendList}` : ''
      content += `${desc}export type ${typeName} = ${typeStr} ${extendStr}\n\n`
    }
  })

  return content
}

function createStringType() {
  typeStringList.sort((a, b) => a.typeName.length - b.typeName.length)
  return typeStringList.map(i => `export type ${i.typeName} = ${i.typeValue}`).join('\r\n')
}

export function buidTsTypeFile(doc: DocListItem, config: Config) {
  const { docApi, moduleName = '' } = doc
  const { typeFileRender } = config
  const outputDir = getOutputDir(moduleName, config)

  let content = createTypes(docApi.typeGroup.typeInfoList, config)
  content += createCustomType(config)
  content += createStringType()

  const filePath = path.join(outputDir, 'types.ts')

  if (typeof typeFileRender === 'function') {
    content = typeFileRender(content, filePath)
  }
  fileList.push({ filePath, content })
}
