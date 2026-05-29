import puppeteer, { Browser } from 'puppeteer-core'

const { getEdgePath } = require('edge-paths')
const chromePaths = require('chrome-paths')

export function getChromePath() {
  const { chrome, chromium, chromeCanary } = chromePaths
  const chromePath = chrome || getEdgePath() || chromium || chromeCanary
  if (!chromePath) {
    throw new Error('没找到 chrome 或 chromium内核 的浏览器，请安装 chrome 或 chromium内核 的浏览器后重试')
  }

  return chromePath
}

 class IBrowser {
  chrome!: Browser | null
  private initPromise: Promise<Browser> | null = null

  async init() {
    if (this.chrome) return this.chrome
    if (this.initPromise) return this.initPromise

    this.initPromise = (async () => {
      try {
        const chromePath = getChromePath()
        this.chrome = await puppeteer.launch({ executablePath: chromePath })
        return this.chrome
      } finally {
        this.initPromise = null
      }
    })()

    return this.initPromise
  }

  async newPage() {
    let chrome = this.chrome
    if (!chrome) chrome = await this.init()
    if (!chrome) throw new Error('chrome is not defined')
    return chrome.newPage()
  }

  async close() {
    if (this.chrome) {
      try {
        await this.chrome.close?.()
        this.chrome = null
        console.log('关闭浏览器成功')
      } catch (error) {
        console.error('关闭浏览器失败:', error)
      } finally {
        this.chrome = null
      }
    }
  }
}

export default new IBrowser()

