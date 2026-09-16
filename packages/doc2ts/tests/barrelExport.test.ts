import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  buildBarrelContent,
  resolveExportNames,
  normalizeOriginPrefix,
  anonymousOriginName,
  type ExportEntry
} from '../src/builder/barrelExport'

const entry = (originName: string | undefined, exportName: string, fileExPath: string): ExportEntry => ({
  originName,
  exportName,
  fileExPath
})

describe('normalizeOriginPrefix', () => {
  it('保持合法 origin 名不变', () => {
    assert.strictEqual(normalizeOriginPrefix('buddy'), 'buddy')
    assert.strictEqual(normalizeOriginPrefix('buddyV2'), 'buddyV2')
    assert.strictEqual(normalizeOriginPrefix('trae'), 'trae')
  })

  it('清洗含连字符的 origin 名', () => {
    assert.strictEqual(normalizeOriginPrefix('swagger-api'), 'swaggerApi')
    assert.strictEqual(normalizeOriginPrefix('local-api'), 'localApi')
    assert.strictEqual(normalizeOriginPrefix('my.api'), 'myApi')
  })

  it('匿名 origin 回退为 module', () => {
    assert.strictEqual(normalizeOriginPrefix(undefined), anonymousOriginName)
    assert.strictEqual(normalizeOriginPrefix(''), anonymousOriginName)
  })

  it('数字开头的 origin 名产生合法前缀', () => {
    // camelCase 不会去掉前导数字，必须补下划线前缀，否则生成 123SignIn 这类非法标识符
    assert.strictEqual(normalizeOriginPrefix('123'), '_123')
    assert.strictEqual(normalizeOriginPrefix('2fa'), '_2Fa')
    assert.strictEqual(normalizeOriginPrefix('9x'), '_9X')
  })
})

describe('resolveExportNames 跨 origin 消歧', () => {
  it('两个 origin 同名时各自追加 origin 前缀', () => {
    const entries = [entry('buddy', 'audit', './buddy/audit'), entry('buddyV2', 'audit', './buddyV2/audit')]

    assert.deepStrictEqual(resolveExportNames(entries), ['buddyAudit', 'buddyV2Audit'])
  })

  it('三个 origin 同名时三者互不重复', () => {
    const entries = [
      entry('buddy', 'signIn', './buddy/signIn'),
      entry('buddyV2', 'signIn', './buddyV2/signIn'),
      entry('trae', 'signIn', './trae/signIn')
    ]
    const names = resolveExportNames(entries)

    assert.deepStrictEqual(names, ['buddySignIn', 'buddyV2SignIn', 'traeSignIn'])
    assert.strictEqual(new Set(names).size, 3)
  })

  it('非冲突导出名保持原名', () => {
    const entries = [
      entry('buddy', 'audit', './buddy/audit'),
      entry('buddyV2', 'audit', './buddyV2/audit'),
      entry('trae', 'integralTrend', './trae/integralTrend')
    ]
    const names = resolveExportNames(entries)

    assert.strictEqual(names[2], 'integralTrend')
  })

  it('含连字符 origin 名产生合法标识符', () => {
    const entries = [entry('swagger-api', 'signIn', './swagger-api/signIn'), entry('local-api', 'signIn', './local-api/signIn')]
    const names = resolveExportNames(entries)

    names.forEach(name => assert.match(name, /^[A-Za-z_$][A-Za-z0-9_$]*$/))
    assert.deepStrictEqual(names, ['swaggerApiSignIn', 'localApiSignIn'])
  })

  it('匿名 origin 回退为 module 前缀', () => {
    const entries = [entry(undefined, 'signIn', './module/signIn'), entry('trae', 'signIn', './trae/signIn')]

    assert.deepStrictEqual(resolveExportNames(entries), ['moduleSignIn', 'traeSignIn'])
  })

  it('前缀后仍同名时追加数字后缀兜底', () => {
    const entries = [
      entry('buddy', 'signIn', './buddy/signIn'),
      entry('buddyV2', 'signIn', './buddyV2/signIn'),
      entry('buddySign', 'in', './buddySign/in'),
      entry('other', 'in', './other/in')
    ]
    const names = resolveExportNames(entries)

    // buddy + signIn 与 buddySign + in 都得到 buddySignIn，需兜底为 buddySignIn1
    assert.strictEqual(new Set(names).size, entries.length)
    assert.ok(names.includes('buddySignIn'))
    assert.ok(names.includes('buddySignIn1'))
  })

  it('非冲突名不被冲突消歧名抢占而改名', () => {
    const entries = [
      entry('z', 'a', './z/a'),
      entry('z2', 'a', './z2/a'),
      entry('x', 'zA', './x/zA') // 非冲突名，恰好等于 z + A
    ]
    const names = resolveExportNames(entries)

    assert.strictEqual(names[2], 'zA', '非冲突的 zA 应保持原名')
    assert.strictEqual(new Set(names).size, entries.length)
  })

  it('相同输入多次调用结果一致（确定性）', () => {
    const entries = [
      entry('buddy', 'signIn', './buddy/signIn'),
      entry('buddyV2', 'signIn', './buddyV2/signIn'),
      entry('trae', 'signIn', './trae/signIn'),
      entry('trae', 'integralTrend', './trae/integralTrend')
    ]

    assert.strictEqual(buildBarrelContent(entries), buildBarrelContent([...entries].reverse()))
  })
})

describe('buildBarrelContent', () => {
  it('生成无重复导出标识符的 barrel', () => {
    const entries = [
      entry('buddy', 'signIn', './buddy/signIn'),
      entry('buddyV2', 'signIn', './buddyV2/signIn'),
      entry('trae', 'signIn', './trae/signIn'),
      entry('buddy', 'audit', './buddy/audit'),
      entry('buddyV2', 'audit', './buddyV2/audit')
    ]
    const content = buildBarrelContent(entries)
    const names = [...content.matchAll(/export \{ (?:\S+ as )?([A-Za-z0-9_$]+) \}/g)].map(m => m[1])

    assert.strictEqual(names.length, entries.length)
    assert.strictEqual(new Set(names).size, entries.length)
  })

  it('导出指向正确的模块路径', () => {
    const entries = [entry('buddy', 'audit', './buddy/audit'), entry('buddyV2', 'audit', './buddyV2/audit')]
    const content = buildBarrelContent(entries)

    assert.ok(content.includes("export { audit as buddyAudit } from './buddy/audit'"))
    assert.ok(content.includes("export { audit as buddyV2Audit } from './buddyV2/audit'"))
  })

  it('非冲突导出名不使用 as 别名', () => {
    const entries = [entry('trae', 'integralTrend', './trae/integralTrend')]

    assert.strictEqual(buildBarrelContent(entries), "export { integralTrend } from './trae/integralTrend'")
  })

  it('消歧后的导出名可通过 as 别名从原模块取得', () => {
    const entries = [
      entry('buddy', 'signIn', './buddy/signIn'),
      entry('buddyV2', 'signIn', './buddyV2/signIn'),
      entry('trae', 'signIn', './trae/signIn')
    ]
    const content = buildBarrelContent(entries)

    // 每个冲突导出都必须保留原导出名（as 左侧），否则 re-export 的目标成员不存在
    assert.ok(content.includes("export { signIn as buddySignIn } from './buddy/signIn'"))
    assert.ok(content.includes("export { signIn as buddyV2SignIn } from './buddyV2/signIn'"))
    assert.ok(content.includes("export { signIn as traeSignIn } from './trae/signIn'"))
  })

  it('同一模块重复引用不产生重复导出', () => {
    const dup = entry('buddy', 'audit', './buddy/audit')
    const content = buildBarrelContent([dup, dup])
    const names = [...content.matchAll(/export \{ (?:\S+ as )?([A-Za-z0-9_$]+) \}/g)].map(m => m[1])

    assert.strictEqual(names.length, 1)
    assert.strictEqual(content, "export { audit } from './buddy/audit'")
  })

  it('重复引用不影响其他条目的消歧判定', () => {
    const entries = [
      entry('buddy', 'audit', './buddy/audit'),
      entry('buddyV2', 'audit', './buddyV2/audit'),
      entry('buddy', 'audit', './buddy/audit') // 重复引用，去重后 audit 仍是跨 origin 冲突
    ]
    const names = [...buildBarrelContent(entries).matchAll(/export \{ (?:\S+ as )?([A-Za-z0-9_$]+) \}/g)].map(m => m[1])

    assert.deepStrictEqual(names.sort(), ['buddyAudit', 'buddyV2Audit'])
  })

  it('数字开头 origin 名生成合法标识符', () => {
    const entries = [entry('123', 'signIn', './123/signIn'), entry('456', 'signIn', './456/signIn')]
    const content = buildBarrelContent(entries)
    const names = [...content.matchAll(/export \{ (?:\S+ as )?([A-Za-z0-9_$]+) \}/g)].map(m => m[1])

    names.forEach(name => assert.match(name, /^[A-Za-z_$][A-Za-z0-9_$]*$/))
    assert.deepStrictEqual(names, ['_123SignIn', '_456SignIn'])
  })

  it('模块路径中的单引号被转义', () => {
    const entries = [entry('a', 'signIn', "./a'b/signIn"), entry('b', 'signIn', './b/signIn')]
    const content = buildBarrelContent(entries)

    assert.ok(content.includes("from './a\\'b/signIn'"))
  })
})
