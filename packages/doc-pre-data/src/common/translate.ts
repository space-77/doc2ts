import _ from 'lodash'
import { iflyrecTranslator, baiduTranslator, bingTranslator, Languages } from 'node-translates'
import { pinyin } from 'pinyin-pro'
import { fixStartNum, isChinese, isWord } from './utils'

export type DictList = { zh: string; en: string | null; form?: '讯飞' | '百度' | '微软' | 'AI' }
export type WaitTranslate = {
  text: string
  type?: string
  reject: (reason?: any) => void
  resolve: (value: string) => void
}
export type FixText = (textEn: string, type?: string) => string
export enum TranslateType {
  none,
  pinyin,
  english,
  ai
}

export interface AIConfig {
  apiKey: string
  baseURL: string
  model: string
  maxTokens?: number
  temperature?: number
  enableThinking?: boolean
  /**
   * @description 是否启用 AI 优化方法名
   */
  enableFuncNameOptimize?: boolean
}

export enum TranslateCode {
  TRANSLATE_ERR
}
export default class Translate {
  private waitTranslateList: WaitTranslate[] = []
  private engines = [
    { t: iflyrecTranslator, name: '讯飞' },
    { t: bingTranslator, name: '微软' },
    { t: baiduTranslator, name: '百度' } // 百度保底
  ]

  constructor(
  public dictList: DictList[] = [],
  public type = TranslateType.english,
  public aiConfig?: AIConfig
) {}
  // constructor(public dictList: DictList[] = [], public type?: TranslateType) {}

  // private dictHasKey(key: string) {
  //   return this.dictList.some(i => i.zh === key)
  // }

  static startCaseClassName(text: string, type: TranslateType, maxWordLen = 5) {
    let wordArray = _.startCase(text).split(' ').filter(Boolean)

    if (wordArray.join('').length > 24) {
      if (wordArray.length > maxWordLen) {
        if (type === TranslateType.english) {
          wordArray = [...wordArray.slice(0, maxWordLen - 1), ...wordArray.slice(-1)]
        } else {
          wordArray = wordArray.slice(0, maxWordLen)
        }
      }
    }

    // 处理以数字开头的异常
    return fixStartNum(wordArray.join(''))
  }

  protected translateFail(text: WaitTranslate) {
    this.dictList.push({ en: null, zh: text.text })
    const errStr = 'translate error, all translate engine can not access'
    text.reject(errStr)
    throw new Error(errStr)
  }

  protected toPinyin(text: string, type: TranslateType) {
    const texts = text.split('')
    let newTexts: string[] = []
    for (let i = 0; i < texts.length; i++) {
      const t = texts[i]
      if (isChinese(t)) {
        newTexts.push(`--${pinyin(t, { toneType: 'none' })}`)
      } else {
        newTexts.push(t)
      }
    }
    return Translate.startCaseClassName(newTexts.join(''), type)
  }

  protected async _translate(text: WaitTranslate, fixText?: FixText, engineIndex = 0) {
    // AI 翻译类型在批量方法中处理，单个调用时跳过
    if (this.type === TranslateType.ai) {
      return
    }

    if (this.type === TranslateType.pinyin || this.type === TranslateType.none) {
      // 转拼音
      try {
        const textEn = this.toPinyin(text.text, this.type)
        this.dictList.push({ en: textEn, zh: text.text })
        text.resolve(textEn)
      } catch (error) {
        return this.translateFail(text)
      }
    } else {
      // 翻译
      if (engineIndex >= this.engines.length) {
        return this.translateFail(text)
      }
      try {
        const { dst } = await this.engines[engineIndex].t({ text: text.text, from: Languages.ZH, to: Languages.EN })
        let textEn = typeof fixText === 'function' ? fixText(dst, text.type) : dst
        textEn = Translate.startCaseClassName(textEn, this.type)
        this.dictList.push({ en: textEn, zh: text.text })
        text.resolve(textEn)
      } catch (error) {
        // console.error('翻译失败，正在换一个平台重试')
        this._translate(text, fixText, engineIndex + 1)
      }
    }
  }

  /**
   * AI 批量翻译
   * @param texts 待翻译文本列表
   * @param fixText 文本修复函数
   * @description 调用 OpenAI API 批量翻译多个内容
   */
  private async aiBatchTranslate(texts: WaitTranslate[], fixText?: FixText): Promise<void> {
    if (!this.aiConfig) {
      throw new Error('AI 翻译需要配置 aiConfig')
    }

    const uniqueTexts = [...new Set(texts.map(t => t.text))]

    try {
      const translations = await this.callOpenAI(uniqueTexts)

      texts.forEach(item => {
        const translated = translations[item.text]
        if (translated) {
          let textEn = typeof fixText === 'function' ? fixText(translated, item.type) : translated
          textEn = Translate.startCaseClassName(textEn, this.type)
          this.dictList.push({ en: textEn, zh: item.text, form: 'AI' })
          item.resolve(textEn)
        } else {
          item.reject(new Error(`AI 翻译失败: ${item.text}`))
        }
      })
    } catch (error) {
      console.error('AI 翻译失败:', error)
      return this.translateFail(texts[0])
    }
  }

  /**
   * 调用 OpenAI API
   * @param texts 待翻译文本数组
   * @description 构建提示词并调用 OpenAI 接口
   */
  private async callOpenAI(texts: string[]): Promise<Record<string, string>> {
    const { apiKey, baseURL, model, maxTokens = 2000, temperature = 0.3, enableThinking = true } = this.aiConfig!

    // 校验必填参数
    if (!apiKey) {
      throw new Error('AI 翻译需要配置 apiKey')
    }
    if (!baseURL) {
      throw new Error('AI 翻译需要配置 baseURL')
    }
    if (!model) {
      throw new Error('AI 翻译需要配置 model')
    }

    const systemPrompt = `你是一个专业的 OpenAPI 文档翻译助手。

任务：将中文内容翻译成适合作为 TypeScript/JavaScript 代码标识符的英文。

上下文说明：
- 这些是 OpenAPI/Swagger 接口文档中的内容
- 翻译结果将用于生成 TypeScript 代码（函数名、类型名、接口名、变量名等）
- 生成的代码将通过这些标识符调用 API 接口

翻译要求：
1. 返回简洁的英文标识符（camelCase 或 PascalCase 格式）
2. 优先使用常见的技术术语和编程习惯命名
3. 如果单个内容过长（超过 3-4 个单词），提取核心含义进行合理缩减
4. 保持技术术语的准确性（如"用户"翻译为 user 而不是 customer）
5. 确保翻译结果合法（不以数字开头，不使用特殊字符）

输出格式：
必须返回纯 JSON 格式，不要包含 markdown 代码块标记或其他说明文字：
{"原文1": "译文1", "原文2": "译文2"}`

    const userPrompt = `请翻译以下内容：
${texts.map((t, i) => `${i + 1}. ${t}`).join('\n')}

请严格按照 JSON 格式返回翻译结果。`

    try {
      const axios = (await import('axios')).default
      const response = await axios.post(
        `${baseURL}/chat/completions`,
        {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: maxTokens,
          temperature,
          enable_thinking: enableThinking,
          response_format: { type: 'json_object' }
        },
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

      return JSON.parse(content)
    } catch (error) {
      console.error('OpenAI API 调用失败:', error)
      throw error
    }
  }

  private async onTranslate(texts: WaitTranslate[], fixText?: FixText): Promise<void> {
    try {
      if (this.type === TranslateType.ai) {
        // AI 翻译使用批量处理
        await this.aiBatchTranslate(texts, fixText)
      } else {
        // 传统翻译逐个处理
        const proms = texts.map(async i => this._translate(i, fixText))
        await Promise.all(proms)
      }
    } catch (error) {
      return Promise.reject({ code: TranslateCode.TRANSLATE_ERR, error, dictList: this.dictList })
    }
  }

  find(text: string) {
    return this.dictList.find(i => i.zh === text)
  }

  addTranslate(text: string, type?: string) {
    return new Promise<string>((resolve, reject) => {
      this.waitTranslateList.push({ text, resolve, reject, type })
    })
  }

  cutArray<T>(array: T[], subLength: number): T[][] {
    let index = 0
    let newArr = []
    while (index < array.length) {
      newArr.push(array.slice(index, (index += subLength)))
    }
    return newArr
  }

  async translate(fixText?: FixText) {
    // 过滤出没有缓存的中文数据
    const texts = this.waitTranslateList.filter(i => {
      const item = this.dictList.find(j => j.zh === i.text)
      if (item && item.en) i.resolve(item.en)
      return !item?.en
    })
    this.waitTranslateList = []

    if (texts.length > 0) {
      console.log(`正在${this.type === TranslateType.ai ? '使用AI' : ''}翻译共翻译 ${texts.length} 条数据`)
      try {
        await this.onTranslate(texts, fixText)
      } catch (error) {
        return Promise.reject(error)
      }
      console.log('翻译完成')
    }
  }
}
