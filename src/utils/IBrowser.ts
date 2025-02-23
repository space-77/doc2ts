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

  async init() {
    if (this.chrome) return this.chrome
    const chromePath = getChromePath()
    this.chrome = await puppeteer.launch({ executablePath: chromePath })
    return this.chrome
  }

  async newPage() {
    let chrome = this.chrome
    if (!chrome) chrome = await this.init()
    if (!chrome) throw new Error('chrome is not defined')
    return chrome.newPage()
  }

  async close() {
    if (this.chrome) await this.chrome.close()
  }
}

export default new IBrowser()

