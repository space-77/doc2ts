import { AIConfig } from './translate'
import type { Dict } from '../types'

interface FuncNameInfo {
  apiPath: string
  method: string
  operationId?: string
  summary?: string
  description?: string
  cacheKey: string
}

interface FuncNameResult {
  cacheKey: string
  name: string
}

/**
 * AI 方法名优化器
 * 使用 AI 大模型优化 OpenAPI 方法名，使其见名知意且简洁
 */
export default class AIFunctionNamer {
  private cache: Map<string, string> = new Map()
  private moduleName: string = ''

  constructor(
    private aiConfig: AIConfig,
    private dict?: Dict
  ) {
    this.loadCache()
  }

  /**
   * 从 dict 缓存加载方法名
   */
  private loadCache() {
    if (!this.dict?.cache?.funcNameCache) return

    const moduleCache = this.dict.cache.funcNameCache.find(
      m => m.moduleName === this.moduleName
    )

    if (moduleCache?.funcName) {
      Object.entries(moduleCache.funcName).forEach(([key, value]) => {
        this.cache.set(key, value)
      })
    }
  }

  /**
   * 保存缓存到 dict
   */
  private saveCache() {
    if (!this.dict) return

    if (!this.dict.cache) {
      this.dict.cache = {
        idNames: {},
        returnTypeNames: {},
        requestTypeNames: {},
        funcNameCache: []
      }
    }

    if (!this.dict.cache.funcNameCache) {
      this.dict.cache.funcNameCache = []
    }

    const moduleCache = this.dict.cache.funcNameCache.find(
      m => m.moduleName === this.moduleName
    )

    const funcNameMap: Record<string, string> = {}
    this.cache.forEach((value, key) => {
      funcNameMap[key] = value
    })

    if (moduleCache) {
      moduleCache.funcName = { ...moduleCache.funcName, ...funcNameMap }
    } else {
      this.dict.cache.funcNameCache.push({
        moduleName: this.moduleName,
        funcName: funcNameMap
      })
    }
  }

  /**
   * 设置当前模块名
   */
  setModuleName(moduleName: string) {
    if (this.moduleName !== moduleName) {
      // 保存上一个模块的缓存
      if (this.moduleName) {
        this.saveCache()
      }
      // 切换到新模块
      this.moduleName = moduleName
      this.cache.clear()
      this.loadCache()
    }
  }

  /**
   * 批量优化方法名
   * @param funcs 方法信息列表
   * @returns 优化后的方法名映射
   */
  async optimizeFuncNames(funcs: FuncNameInfo[]): Promise<Map<string, string>> {
    // 分离已缓存和未缓存的方法
    const cachedResults: FuncNameResult[] = []
    const uncachedFuncs: FuncNameInfo[] = []

    funcs.forEach(func => {
      const cached = this.cache.get(func.cacheKey)
      if (cached) {
        cachedResults.push({ cacheKey: func.cacheKey, name: cached })
      } else {
        uncachedFuncs.push(func)
      }
    })

    // 如果有未缓存的方法，调用 AI 批量处理
    if (uncachedFuncs.length > 0) {
      console.log(`AI 优化方法名: ${this.moduleName} 模块共 ${funcs.length} 个方法，${uncachedFuncs.length} 个需要 AI 处理`)

      try {
        const aiResults = await this.callAIForFuncNames(uncachedFuncs)

        // 处理 AI 返回结果，检查重复并添加后缀
        const usedNames = new Set<string>()
        const finalResults: FuncNameResult[] = []

        // 首先处理已有缓存的结果
        cachedResults.forEach(result => {
          let name = result.name
          // 检查重复
          if (usedNames.has(name)) {
            const baseName = name
            let suffix = 1
            while (usedNames.has(name)) {
              name = `${baseName}${suffix}`
              suffix++
            }
          }
          usedNames.add(name)
          finalResults.push({ cacheKey: result.cacheKey, name })
          this.cache.set(result.cacheKey, name)
        })

        // 处理 AI 返回的结果
        aiResults.forEach(result => {
          let name = result.name
          // 检查重复
          if (usedNames.has(name)) {
            const func = uncachedFuncs.find(f => f.cacheKey === result.cacheKey)
            const method = func?.method || ''
            name = `${name}${method.charAt(0).toUpperCase()}${method.slice(1).toLowerCase()}`

            // 如果还是重复，加数字后缀
            if (usedNames.has(name)) {
              const baseName = name
              let suffix = 1
              while (usedNames.has(name)) {
                name = `${baseName}${suffix}`
                suffix++
              }
            }
          }
          usedNames.add(name)
          finalResults.push({ cacheKey: result.cacheKey, name })
          this.cache.set(result.cacheKey, name)
        })

        console.log(`AI 优化方法名完成: ${this.moduleName} 模块`)
      } catch (error) {
        console.error('AI 优化方法名失败:', error)
        // 如果 AI 调用失败，返回原始名称
        uncachedFuncs.forEach(func => {
          if (!this.cache.has(func.cacheKey)) {
            const originalName = this.generateOriginalName(func)
            this.cache.set(func.cacheKey, originalName)
          }
        })
      }
    }

    // 保存缓存
    this.saveCache()

    // 返回所有方法名
    const result = new Map<string, string>()
    funcs.forEach(func => {
      const name = this.cache.get(func.cacheKey)
      if (name) {
        result.set(func.cacheKey, name)
      }
    })

    return result
  }

  /**
   * 调用 AI 大模型优化方法名
   */
  private async callAIForFuncNames(funcs: FuncNameInfo[]): Promise<FuncNameResult[]> {
    const { apiKey, baseURL, model, maxTokens = 3000, temperature = 0.3, enableThinking } = this.aiConfig

    const systemPrompt = `你是一个专业的 API 方法命名专家。

任务：为 OpenAPI/Swagger 接口生成简洁、见名知意的 JavaScript/TypeScript 方法名。

命名要求：
1. 使用 camelCase 格式（小驼峰命名）
2. 名字长度控制在 3-5 个单词以内
3. 过长名字需要合理缩减，保留核心语义
4. 优先使用标准动词（get, post, create, update, delete, query, list等）
5. 结合 apiPath、summary、description 理解接口含义
6. 确保生成的名字能准确反映接口功能

优化原则：
- 查询类接口：getXxx, queryXxx, listXxx
- 创建类接口：createXxx, addXxx, postXxx
- 更新类接口：updateXxx, modifyXxx, putXxx
- 删除类接口：deleteXxx, removeXxx
- 其他操作：根据语义选择合适动词

输出格式：
必须返回纯 JSON 格式，key 为 "序号_方法标识"，value 为优化后的方法名：
{"1_getUser": "getUser", "2_postUsers": "createUser"}`

    const userPrompt = `请为以下接口生成优化的方法名：

${funcs.map((f, i) => `
${i + 1}. 方法标识: ${f.cacheKey}
   HTTP方法: ${f.method}
   接口路径: ${f.apiPath}
   OperationId: ${f.operationId || '无'}
   Summary: ${f.summary || '无'}
   Description: ${f.description || '无'}
`).join('\n')}

请严格按照 JSON 格式返回，key 使用 "序号_方法标识" 格式。`

    try {
      const axios = (await import('axios')).default

      const requestBody: any = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature,
        response_format: { type: 'json_object' }
      }

      // 如果启用 thinking 模式
      if (enableThinking) {
        requestBody.thinking = { type: 'enabled' }
      }

      const response = await axios.post(
        `${baseURL}/chat/completions`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      )

      const content = response.data.choices[0]?.message?.content

      if (!content) {
        throw new Error('OpenAI 返回内容为空')
      }

      const parsed = JSON.parse(content)

      // 解析返回结果
      const results: FuncNameResult[] = []
      funcs.forEach((func, index) => {
        const key = `${index + 1}_${func.cacheKey}`
        const name = parsed[key] || parsed[func.cacheKey]

        if (name && typeof name === 'string') {
          // 清理方法名，确保是有效的 camelCase
          const cleanName = this.cleanFuncName(name)
          results.push({ cacheKey: func.cacheKey, name: cleanName })
        } else {
          // AI 没有返回这个名字，使用原始名称
          results.push({ cacheKey: func.cacheKey, name: this.generateOriginalName(func) })
        }
      })

      return results
    } catch (error) {
      console.error('AI API 调用失败:', error)
      throw error
    }
  }

  /**
   * 清理方法名，确保是有效的 camelCase
   */
  private cleanFuncName(name: string): string {
    // 移除非法字符
    let cleaned = name.replace(/[^a-zA-Z0-9]/g, '')

    // 确保不以数字开头
    if (/^\d/.test(cleaned)) {
      cleaned = 'func' + cleaned
    }

    // 转换为 camelCase
    cleaned = cleaned.charAt(0).toLowerCase() + cleaned.slice(1)

    return cleaned
  }

  /**
   * 生成原始方法名（当 AI 失败时使用）
   */
  private generateOriginalName(func: FuncNameInfo): string {
    // 从 apiPath 生成简单的方法名
    const pathParts = func.apiPath.split('/').filter(p => p && !p.startsWith('{'))
    const lastPart = pathParts[pathParts.length - 1] || 'func'
    const method = func.method.toLowerCase()

    return `${method}${lastPart.charAt(0).toUpperCase()}${lastPart.slice(1)}`
  }

  /**
   * 获取单个方法的缓存名称
   */
  getCachedName(cacheKey: string): string | undefined {
    return this.cache.get(cacheKey)
  }
}

export { FuncNameInfo }
