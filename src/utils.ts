import log from './log'
import path from 'path'
import { DeepTypes, Doc2TsConfig, GetTypeList, TypeList } from './type'

/**
 * @param str
 * @description 烤串转驼峰
 */
export function camel2Kebab(str: string) {
  return str.replace(/-(\w)/g, (_, $1) => $1.toUpperCase())
}

/**
 * @param str
 * @description 首字母大写
 */
export function firstToUpper(str: string) {
  return str.replace(/^(\S)/g, val => val.toUpperCase())
}

/**
 * @param str
 * @description 首字母小写
 */
export function firstToLower(str: string) {
  return str.replace(/^(\S)/g, val => val.toLocaleLowerCase())
}

/**
 *
 * @param name
 * @param nameList
 * @description 就解决重名问题
 */
export function updateName(name: string, nameList: Set<string>) {
  const reg = /(.*_)(\d+)/
  while (nameList.has(name)) {
    const [_, _name, _version] = name.match(reg) ?? []
    name = _version ? `${_name || name}${Number(_version) + 1}` : `${name}_1`
  }
  return name
}

/**
 *
 * @param str
 * @description 类型装换
 */
export function findType(str: string) {
  switch (str) {
    case 'number':
    case 'integer':
      return 'number'
    case 'string':
      return 'string'
    case 'boolean':
      return 'boolean'
    case 'array':
      return '[]'
    case 'object':
      return 'object'
  }
}

/**
 * @description 根据JSON生成数据类型
 */
export const getTypeList: GetTypeList = ({ json, deep = 1, parentName, deepTypes }) => {
  return json
    .map(i => {
      const { children, type, keyName, required, description, loop, hsaLoop } = i
      if (keyName === 'budget') {
        console.log(i)
      }
      const space = Array.from(Array(deep * 2 + 1)).join(' ')
      const des = description ? `${space}/** @description ${description} */\n` : ''
      const keyStr = `${des}${space}${keyName}${required ? '' : '?'}`
      const isArrayStr = type === 'array' ? '[]' : ''
      let valeuStr = ''

      if (Array.isArray(children)) {
        valeuStr = `{\n${getTypeList({ json: children, deep: deep + 1, parentName: keyName, deepTypes })}\n${space}}`
      } else {
        valeuStr = findType(type as string) || ''
      }
      // const valeuStr = Array.isArray(children)
      //   ? `{\n${getTypeList({ json: children, deep: deep + 1, parentName: keyName, deepTypes })}\n${space}}`
      //   : findType(type as string)

      if (hsaLoop) {
        // 子类型存在，引用该类型，需要在外部重新定义类型
        let typeName = `${firstToUpper(`${parentName || keyName}`)}LooSp`
        typeName = deepTypes[typeName] ? updateName(typeName, new Set(Object.keys(deepTypes))) : typeName
        deepTypes[typeName] = [i]

        return `${keyStr}: ${typeName}${isArrayStr}`
      }

      // 该属性是引用父级的类型。
      if (loop) return `${keyStr}: ${parentName}${isArrayStr}`

      return `${keyStr}: ${valeuStr}${isArrayStr}`
    })
    .join('\n')
}

export function createDeepType(deepTypes: DeepTypes) {
  const newDeepTypes: DeepTypes = {}

  return Object.entries(deepTypes)
    .map(([typeName, value]) => {
      let resStr = `export interface ${typeName} {\n`
      resStr += `${getTypeList({ json: value, parentName: typeName, deepTypes: newDeepTypes })}\n}`
    })
    .join('\n')
}

export function createType(typesList: TypeList) {
  const { description, typeName, value, parentTypeName, refs } = typesList
  let contentStr = ''
  value.forEach(i => {
    const { description, required, keyName, type, hsaChild, childTypeName, childType = '', example } = i
    if (!type && !hsaChild) return
    let childTypeStr = findType(childType) || ''

    const exampleStr = example ? `\n   * @example ${example}\n   *` : ''
    childTypeStr = childTypeStr === 'object' ? 'any' : childTypeStr
    const des = description ? `  /**${exampleStr} @description ${description}${exampleStr ? '\n  ' : ''} */\n` : ''
    const valeuStr = hsaChild
      ? `${childTypeName || 'any'}${type === 'array' ? '[]' : ''}`
      : `${childTypeStr}${findType(type)}` || 'any'
    const itemStr = `  ${keyName}${required ? '' : '?'}: ${valeuStr}\n`
    contentStr += `${des}${itemStr}`
  })
  return `/** @description ${description} */
export interface ${typeName}${parentTypeName ? ` extends ${parentTypeName}` : ''} {\n${contentStr}}\n`
}

/**
 * @param originPath 起始位置
 * @param targetPath 目标位置
 * @description 计算某个路径和另一个路径之间的差值
 */
export function findDiffPath(originPath: string, targetPath: string) {
  const maxLen = Math.max(...[originPath.length, targetPath.length]) - 1
  let index = -1
  for (let i = 0; i < maxLen; i++) {
    if (originPath[i] !== targetPath[i]) {
      index = i
      break
    }
  }
  if (index === -1) throw new Error('两个路径不在同一个盘符')
  const _originPath = originPath
    .slice(index)
    .split('\\')
    .map(() => '..')
    .join('/')
  const _targetPath = targetPath.slice(index)

  return path.join(_originPath, _targetPath).replace(/\\/g, '/')
}

export async function getConfig(configPath: string) {
  try {
    log.info('正在读取配置文件')
    const filePath = findDiffPath(__dirname, `${process.cwd()}\\`)
    const res = await import(path.join(filePath, configPath))
    log.ok()
    return res.default
  } catch (error) {
    log.error('读取配置文件失败')
    throw new Error('加载配置文件失败')
  }
}

export function rename(name: string, method: Doc2TsConfig['rename']) {
  if (typeof method === 'function') {
    return method(name)
  } else if (typeof method === 'string' || method instanceof RegExp) {
    return name.replace(method, '')
  }
  return name
}
