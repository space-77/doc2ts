jest.mock('node-translates', () => {
  const dict: Record<string, string> = {
    账号选择: 'AccountSelection',
    审计: 'Audit',
    签到: 'SignIn',
    统计: 'Statistics',
    用户管理: 'UserManagement',
    用户: 'User',
    其他: 'Other',
    系统: 'System'
  }

  const translator = () => jest.fn(async ({ text }: { text: string }) => ({ dst: dict[text] ?? text }))

  return {
    iflyrecTranslator: translator(),
    bingTranslator: translator(),
    baiduTranslator: translator(),
    Languages: { ZH: 'zh', EN: 'en' }
  }
})

import format from '../../format'
import { TranslateType } from '../../common/translate'
import type { Dict } from '../../types'

const chineseReg = /[\u4e00-\u9fa5]/

function makeDoc(title: string, tags: string[], paths?: Record<string, string[]>) {
  const pathEntries = paths
    ? Object.entries(paths)
    : tags.map((tag, index) => [`/p${index}`, [tag]] as [string, string[]])

  return {
    openapi: '3.0.1',
    info: { title, version: '1.0.0' },
    tags: tags.map(name => ({ name })),
    paths: Object.fromEntries(
      pathEntries.map(([apiPath, opTags], index) => [
        apiPath,
        {
          get: {
            tags: [...opTags],
            operationId: `op${index}`,
            responses: { '200': { description: 'ok' } }
          }
        }
      ])
    )
  }
}

function makeDict(): Dict {
  return { dict: [], cache: { idNames: {}, returnTypeNames: {}, requestTypeNames: {}, funcNameCache: [] }, desc: [] }
}

describe('tag 翻译状态隔离', () => {
  it('并发处理多个 origin 且含同名中文 tag 时，各自的模块名与字典均正确', async () => {
    const tags = ['账号选择', '审计', '签到', '统计', '用户管理']
    const [a, b] = await Promise.all([
      format(makeDoc('originA', tags), makeDict(), { translateType: TranslateType.none }),
      format(makeDoc('originB', tags), makeDict(), { translateType: TranslateType.none })
    ])

    for (const res of [a, b]) {
      const moduleNames = res.docApi.funcGroupList.map(m => m.moduleName)
      expect(moduleNames).toEqual(['AccountSelection', 'Audit', 'SignIn', 'Statistics', 'UserManagement'])
      expect(moduleNames.some(n => chineseReg.test(n))).toBe(false)
      expect(res.dictList.length).toBeGreaterThan(0)
      expect(res.dictList.map(i => i.zh)).toEqual(expect.arrayContaining(tags))
    }
  })

  it('并发时后完成的 origin 不依赖先完成 origin 的翻译条目', async () => {
    const tags = ['审计', '统计']
    const [first, second] = await Promise.all([
      format(makeDoc('first', tags), makeDict(), { translateType: TranslateType.none }),
      format(makeDoc('second', tags), makeDict(), { translateType: TranslateType.none })
    ])

    expect(first.dictList.map(i => `${i.zh}=>${i.en}`)).toEqual(['审计=>Audit', '统计=>Statistics'])
    expect(second.dictList.map(i => `${i.zh}=>${i.en}`)).toEqual(['审计=>Audit', '统计=>Statistics'])
  })

  it('连续两次空字典调用互不共享状态，结果一致', async () => {
    const doc = () => makeDoc('repeat', ['审计', '用户'])

    const first = await format(doc(), makeDict(), { translateType: TranslateType.none })
    const second = await format(doc(), makeDict(), { translateType: TranslateType.none })

    const pick = (res: typeof first) => ({
      modules: res.docApi.funcGroupList.map(m => m.moduleName),
      dict: res.dictList.map(i => `${i.zh}=>${i.en}`)
    })

    expect(pick(second)).toEqual(pick(first))
    expect(pick(first).modules).toEqual(['Audit', 'User'])
  })
})

describe('同一 origin 内共享 tag 的回写', () => {
  it('同一 tag 位于不同索引时均按各自索引回写', async () => {
    const doc = makeDoc('shared', ['审计', '用户', '其他'], {
      '/a': ['审计', '用户'],
      '/b': ['用户', '审计'],
      '/c': ['其他', '审计']
    })

    const { docApi } = await format(doc, makeDict(), { translateType: TranslateType.none })
    const tagsOf = (path: string) => (docApi.json.paths as any)[path].get.tags

    expect(tagsOf('/a')).toEqual(['Audit', 'User'])
    expect(tagsOf('/b')).toEqual(['User', 'Audit'])
    expect(tagsOf('/c')).toEqual(['Other', 'Audit'])
  })

  it('多个 operation 共享同一 tag 时全部被翻译且模块名唯一', async () => {
    const doc = makeDoc('multi', ['审计', '用户'], {
      '/a': ['审计'],
      '/b': ['审计', '用户'],
      '/c': ['审计']
    })

    const { docApi } = await format(doc, makeDict(), { translateType: TranslateType.none })
    const moduleNames = docApi.funcGroupList.map(m => m.moduleName)

    expect(moduleNames).toEqual(['Audit', 'User'])
    expect(moduleNames.some(n => chineseReg.test(n))).toBe(false)
    Object.values(docApi.json.paths as any).forEach((method: any) => {
      expect(method.get.tags.some((t: string) => chineseReg.test(t))).toBe(false)
    })
  })
})

describe('首次运行即产出正确结果', () => {
  it('空字典单次调用即产出英文模块名与非空字典', async () => {
    const tags = ['账号选择', '审计', '签到', '统计', '用户管理']
    const res = await format(makeDoc('firstRun', tags), makeDict(), { translateType: TranslateType.none })

    const moduleNames = res.docApi.funcGroupList.map(m => m.moduleName)
    expect(moduleNames.some(n => chineseReg.test(n))).toBe(false)
    expect(res.dictList).toHaveLength(tags.length)
    tags.forEach(tag => {
      expect(res.dictList.find(i => i.zh === tag)?.en).toBeTruthy()
    })
  })
})
