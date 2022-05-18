import fs from 'fs'
import ts from 'typescript'
import log from './log'
import path from 'path'
import prettier from 'prettier'
import { PrettierConfig } from '../common/config'
import { DeepTypes, Doc2TsConfig, GetTypeList, ModelList, TypeList } from '../type'
import Api from './api'
import { OriginType } from 'pont-engine/lib/scripts'

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
      // if (keyName === 'budget') {
      //   console.log(i)
      // }
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
  const diffPath = path.relative(originPath, targetPath).replace(/\\\\?/g, '/')
  return /^\.\.?\//.test(diffPath) ? diffPath : `./${diffPath}` // 处理同级目录应用异常问题
}

function getRootFilePath(filePath: string) {
  const prePath = findDiffPath(__dirname, `${process.cwd()}\\`)
  return path.join(__dirname, prePath, filePath)
}

export async function loadPrettierConfig(prettierPath?: string) {
  let filePath: string | undefined
  if (!prettierPath) {
    const fileType = [
      getRootFilePath('./.prettierrc.js'),
      getRootFilePath('./prettier.config.js'),
      getRootFilePath('./prettier.config.cjs'),
      getRootFilePath('./.prettierrc'),
      getRootFilePath('./.prettierrc.json'),
      getRootFilePath('./.prettierrc.json5')
    ]
    filePath = fileType.find(i => fs.existsSync(i))
  } else {
    filePath = getRootFilePath(prettierPath)
  }
  if (!filePath) {
    PrettierConfig.config = require(getRootFilePath('./package.json')).prettier
  } else {
    try {
      // .js .cjs  .json
      if (/\.(c?js|json)$/.test(filePath)) {
        // js
        PrettierConfig.config = require(filePath)
      } else {
        // json
        PrettierConfig.config = JSON.parse(fs.readFileSync(filePath, 'utf8').toString())
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export async function getConfig(configPath: string): Promise<Doc2TsConfig> {
  try {
    log.info('正在读取配置文件')
    const filePath = getRootFilePath(configPath)
    // console.log({ filePath })
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
export function resolveOutPath(...paths: string[]) {
  return path.join(process.cwd(), ...paths)
}

/**
 * @description 创建文件
 */
export async function createFile(filePath: string, content: string) {
  try {
    const dirList = filePath.split(path.sep)
    const fileName = dirList[dirList.length - 1]
    const dirPath = path.join(...dirList.slice(0, dirList.length - 1))

    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
    log.info(`正在创建：${fileName} 文件`)
    fs.writeFileSync(filePath, format(content, PrettierConfig.config))
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

async function getModelList(url: string, count = 0): Promise<ModelList[]> {
  const baseUrl = url.replace(/\/$/, '')
  try {
    log.info('正在拉取 swagger-bootstrap-ui 文档信息')
    const data = await Api.get<ModelList[]>(`${baseUrl}/swagger-resources`)
    if (data.length === 0 && count <= 4) {
      return await getModelList(url, count + 1)
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      log.error('数据加载失败')
      throw new Error('数据加载异常')
    }
    log.ok()
    return data.map(i => ({ ...i, url: `${baseUrl}${i.url}` }))
  } catch (error) {
    log.error('数据加载失败')
    return Promise.reject(error)
  }
}

export async function getModelUrl(origins: Doc2TsConfig['origins']) {
  const urlBaseUrl = origins.filter(i => i.isSwaggerBootstrapUi).map(({ url }) => url)
  const urlList = origins.filter(i => !i.isSwaggerBootstrapUi) // .map(i => ({ name: i.modelName, url: i.url }))
  const apiUrls: ModelList[] = urlList.map(i => {
    const [_, version = 2] = i.url.match(/\/v(\d)\//) || []
    const swaggerVersion = `${version}.0` as ModelList['swaggerVersion']
    return { ...i, swaggerVersion }
  })

  const reqs = urlBaseUrl.map(async url => {
    const modelList = await getModelList(url)
    apiUrls.push(...modelList)
  })
  await Promise.all(reqs)
  return apiUrls
}
