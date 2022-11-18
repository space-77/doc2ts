import path from 'path'
import DocApi from '../doc/docApi/index'
import { Config } from '../common/config'
import { DocListItem } from '../types/newType'
import { createFile, firstToUpper, resolveOutPath } from '../utils'
import { getGenericsType } from '../doc/common/utils'

export function buidTsTypeFile(doc: DocListItem, config: Config) {
  const { outDir } = config
  const { docApi, moduleName = '' } = doc
  // FIXME 存在 模块重名，方法重名 问题。
  const outputDir = path.join(resolveOutPath(outDir), `${moduleName}${moduleName ? 'M' : 'm'}odule`)

  // docApi.components.typeList
  let content = ''
  for (const typeInfo of docApi.components.typeList) {
    const [typeName, { typeItems, description, refValue }] = typeInfo
    // console.log(typeInfo)
    content += `interface ${typeName} ${refValue ? ` extends ${refValue.typeName}` : ''} {\n`
    // const {  } = typeItems
    typeItems.sort((a, b) => a.name.length - b.name.length)
    for (const typeItem of typeItems) {
      const { name, type, example, enumTypes, required, genericsItem } = typeItem
      const typeValue = typeof type === 'string' ? type : type?.typeName

      const genericsType = getGenericsType(genericsItem, enumTypes)

      content += `${name.replace(/-/g, '_')}${required ? '' : '?'}:${typeValue}${genericsType}\n`
    }
    content += '}\n'
  }

  const filePath = path.join(outputDir, 'type.d.ts')
  console.log(filePath)
  createFile(filePath, content)
}
