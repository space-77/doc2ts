import fs from 'fs'
import ts from 'typescript'
import escodegen from 'escodegen'
import puppeteer, { Page, Browser, HTTPResponse } from 'puppeteer-core'
import { CONFIG_PATH } from '../common/config'
import { getRootFilePath } from '../utils'
import { ModelList, Origin } from '../types/type'
const chromePaths = require('chrome-paths')
const { getEdgePath } = require('edge-paths')

export interface SwaggerResources {
  url: string
  name: string
  location: string
  swaggerVersion: ModelList['version']
}

export default class Puppeteer {
  private page!: Page
  private browser!: Browser
  private eventList: Map<string | RegExp, [Function, Function]> = new Map([])

  constructor(private url: string) {
    // this.init()
  }

  private async initBrowser() {
    const chromePath = this.getChromePath()

    this.browser = await puppeteer.launch({ executablePath: chromePath, headless: true, ignoreHTTPSErrors: true })
    this.page = await this.browser.newPage()
    this.listenPageChange()
  }

  private listenPageChange() {
    this.page.on('response', async response => {
      const url = response.url()
      const values = this.eventList.entries()

      for (const [key, [resolve]] of values) {
        if (typeof key === 'string') {
          if (key === url) resolve(response)
        } else {
          // console.log(key.test(url), url)
          if (key.test(url)) {
            resolve(response)
          }
        }
      }
    })
  }

  private addListen(url: string | RegExp) {
    return new Promise<HTTPResponse>((resolve, reject) => {
      this.eventList.set(url, [resolve, reject])
    })
  }

  private getChromePath() {
    return chromePaths.chrome || getEdgePath()
  }

  async init() {
    await this.initBrowser()
  }

  async listenSwaggerResources(): Promise<ModelList[]> {
    const j = await this.addListen(/swagger-resources$/)
    const data = (await j.json()) as SwaggerResources[]

    const { origin } = await this.page.evaluate(() => location)

    return data.map(({ name, url, swaggerVersion }) => ({ url: `${origin}${url}`, name, version: swaggerVersion }))
  }

  async listenSwaggerApi() {
    const j = await this.addListen(/\/v(\d)\//)
    const url = j.url()
    const { swagger, paths, definitions } = await j.json()

    if ((swagger as string).startsWith(RegExp.$1) && typeof paths === 'object' && typeof definitions === 'object') {
      return url
    }
  }

  async listenUrl() {
    try {
      const [url, origins] = await Promise.all([this.listenSwaggerApi(), this.listenSwaggerResources()])
      const has = origins.some(i => i.url === url)
      if (!has && url) origins.push({ url })
      await this.browser.close()

      return origins
    } catch (error) {
      console.error(error)
    }
  }

  getConfigFileAst() {
    // const tsCode = fs.readFileSync(getRootFilePath(CONFIG_PATH)).toString()

    const filePath = getRootFilePath(CONFIG_PATH)

    let program = ts.createProgram([filePath], { allowJs: true })
    const sourceFile = program.getSourceFile(filePath)
    if (!sourceFile) return
    // let result = ts.transpileModule(tsCode, { compilerOptions: { module: ts.ModuleKind.CommonJS }});
    // const node = ts.createSourceFile(CONFIG_PATH, tsCode, ts.ScriptTarget.Latest)
    // console.log(node);
    // const x = escodegen.generate(node)
    ts.forEachChild(sourceFile, node => {
      console.log(node)
    })
    // console.log(sourceFile)
  }

  async start() {
    this.listenUrl()

    this.page.goto(this.url)
    await this.addListen(this.url)
  }
}
