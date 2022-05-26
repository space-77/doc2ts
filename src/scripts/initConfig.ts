import fs from 'fs'
import log from '../utils//log'
import path from 'path'
import { CONFIG_PATH, Surrounding } from '../common/config'
import { createFile, judgeIsVaildUrl } from '../utils'
import inquirer, { QuestionCollection } from 'inquirer'

type InitConfig = {
  outDir: string
  originUrl: string
  baseClassPath: string
  baseClassName: string
  languageType: Surrounding
  createBaseClass: boolean
}

const defaultOriginUrl = 'https://petstore.swagger.io/v2/swagger.json'

const CONFIG_FILE_PATH = path.join(process.cwd(), CONFIG_PATH)

const promptList: QuestionCollection = [
  {
    type: 'input',
    message: '请设置数据源地址',
    name: 'originUrl',
    default: defaultOriginUrl,
    validate: originUrl => {
      if (!judgeIsVaildUrl(originUrl)) {
        return '请输入正确的数据源地址'
      }
      return true
    }
  },
  {
    type: 'confirm',
    message: '是否生成基类文件(请求方法需您自行实现)',
    name: 'createBaseClass',
    default: true
  },
  {
    type: 'input',
    message: '请设置基类存放相对路径',
    name: 'baseClassPath',
    default: './src/services/client.ts'
  },
  {
    type: 'input',
    message: '请设置基类名称',
    name: 'baseClassName',
    default: 'ApiClient'
  },
  {
    type: 'input',
    message: '请设置生成代码存放的相对路径',
    name: 'outDir',
    default: './src/services'
  },
  {
    type: 'list',
    message: '请选择语言类型:',
    name: 'languageType',
    choices: [Surrounding.typeScript, Surrounding.javaScript]
  }
]

function loadTempFile(filePath: string) {
  return fs.readFileSync(path.join(__dirname, filePath)).toString()
}

export default async function init() {
  const exists = fs.existsSync(CONFIG_FILE_PATH)
  if (exists) {
    const { confirm } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      default: true,
      message: `检测到已存在doc2ts-config文件，继续生成将覆盖配置项，是否继续？`
    })
    if (!confirm) return
  }

  log.info('配置文件生成中...')
  const answers = await inquirer.prompt<InitConfig>(promptList)
  generateConfig(answers)
}

async function generateConfig(answers: InitConfig) {
  const { originUrl, baseClassPath, baseClassName, outDir, languageType, createBaseClass } = answers
  const tips = defaultOriginUrl === originUrl ? '/* 请把这个地址更换为您的地址 */' : ''
  const origins = `[{ url: ${tips} '${originUrl}' }]`
  try {
    let content = loadTempFile('../temp/doc2ts-comfig')
    content = content.replace(/\{outDir\}/, outDir)
    content = content.replace(/\{origins\}/, origins)
    content = content.replace(/\{languageType\}/, languageType)
    content = content.replace(/\{baseClassPath\}/, baseClassPath)
    content = content.replace(/\{baseClassName\}/, baseClassName)

    await createFile(CONFIG_FILE_PATH, content)
    log.success('配置文件已生成')
    if (createBaseClass) generateBacsClass(baseClassPath, baseClassName)
  } catch (error) {
    console.error(error)
  }
}

async function generateBacsClass(baseClassPath: string, baseClassName: string) {
  log.info('基类文件生成中...')
  try {
    let content = loadTempFile('../temp/baseClassFile')
    content = content.replace(/\{baseClassName\}/, baseClassName)
    await createFile(path.join(process.cwd(), baseClassPath), content)
    log.success('基类文件已生成')
  } catch (error) {
    console.error(error)
  }
}
