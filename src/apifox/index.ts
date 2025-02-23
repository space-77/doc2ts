import qs from 'qs'
import axios from 'axios'
import iBrowser from '../utils/IBrowser'
import { EvaluateFn, Protocol } from 'puppeteer-core'

export type ApifoxConfig = {
  name?: string
  cookie?: string
  sharedId: string
}

const headers = {
  // [':authority:']: 'apifox.com',
  // [':method:']: 'GET',
  // [':path:']: '/api/v1/shared-doc-summaries/fc1c8c66-86d6-44e2-8899-e3e74464c5be',
  // [':scheme:']: 'https',
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  ['accept-encoding']: 'gzip, deflate, br, zstd',
  ['accept-language']: 'zh-CN,zh;q=0.9',
  'cache-control': 'max-age=0',
  priority: 'u=0, i',
  'sec-ch-ua': `"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"`,
  ['sec-ch-ua-mobile']: '?0',
  ['sec-ch-ua-platform']: 'macOS',
  ['sec-fetch-dest']: 'document',
  ['sec-fetch-mode']: 'navigate',
  ['sec-fetch-site']: 'none',
  ['sec-fetch-user']: ['?1'],
  ['upgrade-insecure-requests']: '1',
  ['user-agent']: [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
  ]
}

export default class Apifox {
  baseUel = 'https://apifox.com/api/v1'
  sharedId: string
  projectId?: string

  constructor(sharedId: string, public cookie?: string) {
    this.sharedId = sharedId.replace(/^shared-/, '')
  }

  public async getApifox() {
    return new Promise<object>(async (resolve, reject) => {
      const page = await iBrowser.newPage()

      if (this.cookie) {
        const cookies: Protocol.Network.CookieParam[] = []
        this.cookie.split(';').forEach(item => {
          const [key, value] = item.split('=')
          cookies.push({ name: key.trim(), value: value.trim(), domain: '.apifox.com', path: '/' })
        })
        await page.setCookie(...cookies)
      }

      const timer = setTimeout(() => {
        // 超时处理
        reject(new Error('get apifox failed'))
      }, 1000 * 60 * 2)

      const done = async () => {
        clearTimeout(timer)
        try {
          await page.close()
          await iBrowser.close()
        } catch (error) {
          console.error(error)
        }
      }

      page.on('response', async response => {
        const status = response.status()
        const url = response.url()
        if (status === 200 && url.includes('/shared-doc-summaries/')) {
          try {
            const { success, data } = await response.json()
            if (success) {
              this.projectId = data.projectId

              await page.evaluate<EvaluateFn<{ projectId: string; sharedId: string }>>(
                ({ projectId, sharedId }) => {
                  fetch(`https://apifox.com/api/v1/projects/${projectId}/shared-docs/${sharedId}/export-data`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      id: sharedId,
                      type: 'openapi',
                      version: '3.0',
                      projectId,
                      excludeExtension: true,
                      excludeTagsWithFolder: false
                    })
                  })
                },
                { projectId: this.projectId!, sharedId: this.sharedId }
              )
            } else {
              await done()
              reject(new Error('get project id failed'))
            }
          } catch (error) {
            await done()
            reject(error)
          }
        }

        if (status === 200 && /\/export-data$/.test(url)) {
          try {
            const data = await response.json()
            await done()
            resolve(data)
          } catch (error) {
            await done()
            reject(error)
          }
        }
      })

      // page.goto(`https://apifox.com/apidoc/shared-${this.sharedId}`)
      page.goto(`https://apifox.com/api/v1/shared-doc-summaries/${this.sharedId}`)
    })
  }

  async init() {
    try {
      await iBrowser.init()
    } catch (error) {
      console.error(error)
    }
    new Error('get apifox failed')
  }
}

