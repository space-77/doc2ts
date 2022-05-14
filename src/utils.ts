import fs from 'fs'
import ts from 'typescript'
import log from './log'
import path from 'path'
import prettier from 'prettier'
import { DeepTypes, Doc2TsConfig, GetTypeList, TypeList } from './type'
import { StandardDataSource } from 'pont-engine'

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
    case 'Number':
    case 'integer':
      return 'number'
    case 'string':
    case 'String':
      return 'string'
    case 'boolean':
      return 'boolean'
    case 'array':
    case 'Array':
      return 'array'
    case 'object':
    case 'Object':
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
    const { description, required, keyName, type, hsaChild, childTypeName, childType = '', example, loop } = i
    if (!type && !hsaChild) return
    let valeuStr = ''
    let childTypeStr = findType(childType) || ''
    const typeStr = type === 'array' ? '[]' : ''

    const exampleStr = example ? `\n   * @example ${example}\n   *` : ''
    childTypeStr = childTypeStr === 'object' ? 'any' : childTypeStr
    const des = description ? `  /**${exampleStr} @description ${description}${exampleStr ? '\n  ' : ''} */\n` : ''
    if (loop) {
      valeuStr = `${typeName}${typeStr}`
    } else {
      valeuStr = hsaChild ? `${childTypeName || 'any'}${typeStr}` : `${childTypeStr}${findType(type)}` || 'any'
    }
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

function getRootFilePath(filePath: string) {
  const prePath = findDiffPath(__dirname, `${process.cwd()}\\`)
  return path.join(__dirname, prePath, filePath)
}

export async function loadPrettierConfig(prettierPath?: string): Promise<prettier.Options | undefined> {
  let filePath!: string
  if (!prettierPath) {
    filePath = getRootFilePath('./.prettierrc.js')
    if (!fs.existsSync(filePath)) {
      filePath = getRootFilePath('./.prettierrc')
      if (!fs.existsSync(filePath)) return //  prettier 配置文件不存在
    }
  } else {
    filePath = getRootFilePath(prettierPath)
  }
  try {
    if (/\.prettierrc\.js$/.test(filePath)) {
      // js
      return require(filePath)
    } else if (/\.prettierrc$/.test(filePath)) {
      // json
      return JSON.parse(fs.readFileSync(filePath, 'utf8').toString())
    }
  } catch (error) {
    console.error(error)
  }
}

export async function getConfig(configPath: string): Promise<Doc2TsConfig> {
  try {
    log.info('正在读取配置文件')
    // const prePath = findDiffPath(__dirname, `${process.cwd()}\\`)
    // const filePath = path.join(__dirname, prePath, configPath)
    const filePath = getRootFilePath(configPath)
    const stat = fs.statSync(filePath)
    if (!stat.isFile()) throw new Error('配置文件不存在')
    const tsResult = fs.readFileSync(filePath, 'utf8')
    const jsResult = ts.transpileModule(tsResult, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.CommonJS
      }
    })
    const noCacheFix = (Math.random() + '').slice(2, 5)
    const jsName = path.join(__dirname, `__${noCacheFix}__.js`)
    // 编译到js
    fs.writeFileSync(jsName, jsResult.outputText, 'utf8')

    // 删除该文件
    const res = require(jsName).default
    fs.unlinkSync(jsName)
    return res
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

/**
 * @param preDirPath
 * @description 获取文件夹路径
 */
export function resolveOutPath(outDir: string, preDirPath: string) {
  return path.join(process.cwd(), outDir, preDirPath)
}

/**
 * @description 创建文件
 */
export async function createFile(dirPath: string, fileName: string, content: string, prettier?: prettier.Options) {
  try {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
    log.info(`正在创建：${fileName} 文件`)
    const filePath = path.join(dirPath, fileName)
    fs.writeFileSync(filePath, format(content, prettier))
  } catch (error) {
    log.error('创建失败')
    console.error(error)
    return Promise.reject(error)
  }
}

/**
 * @description 格式化代码
 */
export function format(fileContent: string, prettierOpts = {}) {
  try {
    return prettier.format(fileContent, {
      parser: 'typescript',
      // semi: false,
      // tabWidth: 2,
      // arrowParens: 'avoid',
      // singleQuote: true,
      // printWidth: 120,
      // trailingComma: 'none',
      ...prettierOpts
    })
  } catch (e: any) {
    log.error(`代码格式化报错！${e.toString()}\n代码为：${fileContent}`)
    return fileContent
  }
}
