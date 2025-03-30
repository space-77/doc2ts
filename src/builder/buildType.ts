import _ from 'lodash'
import path from 'path'
import Base from './base'
import { getDesc } from '../utils'
import { fileList } from '../generators/fileList'
import { authorStr, enumName } from '../common/config'
import { TypeBase } from './common'

// 数据整合产生的类型，使用 type 定义类型
export const customInfoList: TypeBase[] = []
export const typeStringList: { typeName: string; typeValue: string; groupName?: string }[] = []

export default class BuildTypeFile extends Base {
  private createEnum() {
    const { enumList } = this.doc.docApi.typeGroup
    const enumStrs = enumList.map(({ name, values }) => {
      return `export enum ${name} {
          ${values.map(value => {
            const key = `${value}`.replace(/^\d+/, $1 => `n${$1}`)
            return `${key} = ${typeof value === 'number' ? value : `'${value}'`}`
          }).join(',\n')}
        }`
    })

    return `export namespace ${enumName} {
      ${enumStrs.join('\n')}
    }\n\n`
  }

  private createTypes() {
    const { config, doc } = this
    const { typeInfoList } = doc.docApi.typeGroup
    const { generateTypeRender } = config

    let content = ''
    typeInfoList.forEach(({ spaceName, list }) => {
      content += `export namespace ${spaceName} {`
      for (let typeInfo of list) {
        const { typeName } = typeInfo
        if (typeof generateTypeRender === 'function') typeInfo = generateTypeRender(typeName, typeInfo)

        const { typeItems, description, refs, isEmpty, deprecated, attrs, externalDocs, title } = typeInfo
        const { hide, compose, typeValue, defineType = false } = attrs

        if (hide) continue

        if (compose) {
          // 组合类型
          content += this.buildCustomType(typeInfo)
        } else if (defineType) {
          // 自定类型，只做类型定义
          content += `export type ${typeName} = ${typeValue}\n`
        } else {
          const desc = getDesc({ description, deprecated, externalDocs, title })

          let extendsStr = ''

          if (refs.length > 0) {
            extendsStr = ' extends '
            const ff = refs.map(({ typeInfo, genericsItem }) => {
              let t = ''

              if (typeof genericsItem === 'string') t = genericsItem
              else if (genericsItem) t = genericsItem.getSpaceName(spaceName)

              return typeInfo.getSpaceName(spaceName) + (t ? `<${t}>` : '')
            })
            extendsStr += ff.join(',')
          }

          content += `${desc}export interface ${typeName} ${extendsStr} {\n`
          for (const typeItem of _.uniqBy(typeItems, 'name')) {
            if (typeItem.disable) continue
            content += typeItem.getTypeValue(`${enumName}.`)
          }
          content += '}\n\n'
        }
      }
      content += '}\n\n'
    })

    return content
  }

  private buildCustomType(typeInfo: TypeBase) {
    const { generateTypeRender } = this.config
    if (typeof generateTypeRender === 'function') typeInfo = generateTypeRender(typeInfo.typeName, typeInfo)
    const { typeName, typeItems, deprecated, description, refs, externalDocs, title } = typeInfo

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
      .map(i => i.typeInfo.getSpaceName(typeInfo.spaceName))
      .join('&')

    if (extendList || typeStr) {
      const desc = getDesc({ description, deprecated, externalDocs, title })
      const extendStr = extendList ? `${typeStr ? '&' : ''}${extendList}` : ''
      return `${desc}export type ${typeName} = ${typeStr} ${extendStr}\n\n`
    }
    return ''
  }

  private createStringType() {
    typeStringList.sort((a, b) => a.typeName.length - b.typeName.length)
    return typeStringList.map(i => `export type ${i.typeName} = ${i.typeValue}`).join('\r\n')
  }

  build() {
    const { doc, config } = this
    const { moduleName = '' } = doc

    const { typeFileRender } = config
    const outputDir = this.getOutputDir(moduleName)

    let content = this.createEnum() // 枚举数据
    content += this.createTypes() // 类型
    content += this.createStringType() // 接口返回类型

    const filePath = path.join(outputDir, 'types.ts')

    if (typeof typeFileRender === 'function') content = typeFileRender(content, filePath)

    const disableLints = ['/* eslint-disable */', '/* tslint:disable */']
    content = `${disableLints.join('\n')}\n${authorStr}\n\n${content}`

    fileList.push({ filePath, content })
  }
}
