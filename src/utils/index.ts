import fs from 'fs'
import ts, { ModuleKind, ScriptTarget } from 'typescript'
import Api from './api'
import log from './log'
import path from 'path'
import crypto from 'crypto'
import prettier from 'prettier'
import { PrettierConfig } from '../common/config'
import { Doc2TsConfig, ModelList } from '../types/type'

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
  const noCacheFix = (Math.random() + '').slice(2, 5)
  const jsName = path.join(__dirname, `__${noCacheFix}__.js`)

  try {
    log.info('正在读取配置文件')
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
    // 编译到js
    fs.writeFileSync(jsName, jsResult.outputText, 'utf8')

    // 删除该文件
    const res = require(jsName).default
    fs.unlinkSync(jsName)
    return res
  } catch (error) {
    log.error('读取配置文件失败')
    if (fs.existsSync(jsName)) fs.unlinkSync(jsName)
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
export function createFile(filePath: string, content: string, nolog = false) {
  try {
    const dirList = filePath.split(path.sep)
    const fileName = dirList[dirList.length - 1]
    const dirPath = path.join(...dirList.slice(0, dirList.length - 1))

    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
    !nolog && log.info(`正在创建：${fileName} 文件`)
    const isTsFile = /\.ts/.test(filePath)
    fs.writeFileSync(filePath, format(content, PrettierConfig.config, isTsFile))
  } catch (error) {
    log.error('创建失败')
    console.error(error)
    return Promise.reject(error)
  }
}

/**
 * @description 格式化代码
 */
export function format(fileContent: string, prettierOpts = {}, isTsFile: boolean) {
  try {
    return prettier.format(fileContent, {
      parser: isTsFile ? 'typescript' : 'babel',
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

// export async function getModelUrl(origins: Doc2TsConfig['origins']) {
//   const urlBaseUrl = origins.filter(i => i.isSwaggerBootstrapUi).map(({ url }) => url)
//   const urlList = origins.filter(i => !i.isSwaggerBootstrapUi) // .map(i => ({ name: i.modelName, url: i.url }))
//   const apiUrls: ModelList[] = urlList.map(i => {
//     const [_, version = 2] = i.url.match(/\/v(\d)\//) || []
//     const swaggerVersion = `${version}.0` as ModelList['swaggerVersion']
//     return { ...i, swaggerVersion }
//   })

//   const reqs = urlBaseUrl.map(async url => {
//     const modelList = await getModelList(url)
//     apiUrls.push(...modelList)
//   })
//   await Promise.all(reqs)
//   return apiUrls
// }

/** 检测是否是合法url */
export function judgeIsVaildUrl(url: string) {
  return /^(http|https):.*?$/.test(url)
}

export function checkJsLang(lang: Doc2TsConfig['languageType'] = 'ts') {
  return /js|javascript/i.test(lang)
}

type TraverseDirFileInfo = { filePath: string; name: string; stat: fs.Stats; prePath: string }
type TraverseDir = (config: {
  dirPath: string
  prePath?: string
  callback?: (fileInfo: TraverseDirFileInfo) => void
}) => void
/**
 * @description 遍历文件夹下的文件
 */
export const traverseDir: TraverseDir = ({ dirPath, prePath = '', callback }) => {
  fs.readdirSync(dirPath).forEach(name => {
    const filePath = path.join(dirPath, name)
    const stat = fs.statSync(filePath)
    if (stat.isFile()) {
      callback?.({ filePath, name, stat, prePath })
    } else if (stat.isDirectory()) {
      traverseDir({ dirPath: filePath, prePath: `${prePath}/${name}`, callback })
    }
  })
}

export function getTsFiles(dirPath: string) {
  const tsFileReg = /.+(?<!\.d)\.ts$/
  const filesInfo: string[] = []
  traverseDir({
    dirPath,
    callback(info) {
      const { filePath, name } = info
      if (tsFileReg.test(name)) {
        const md5 = crypto.createHash('md5')
        const fileName = md5.update(filePath).digest('hex')
        filesInfo.push(filePath)
      }
    }
  })
  return filesInfo
}

export function ts2Js(filesNames: string[], declaration: boolean) {
  const options = {
    target: ScriptTarget.ESNext,
    module: ModuleKind.ES2015,
    declaration,
    skipLibCheck: true
  }

  const host = ts.createCompilerHost(options)
  host.writeFile = (fileName, content) => {
    createFile(fileName, content, true)
    // ts.sys.writeFile(fileName, content)
  }
  // host.readFile = fileName => {
  //   return ts.sys.readFile(fileName)
  // }

  // host.fileExists = fileName => {
  //   return ts.sys.fileExists(fileName)
  // }

  const program = ts.createProgram(filesNames, options, host)
  program.emit()
}
