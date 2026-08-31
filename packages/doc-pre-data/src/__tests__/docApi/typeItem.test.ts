// 先加载 components（其内部先加载 schemas 再加载 base，与生产构建的模块加载顺序一致），避免 base/schemas 循环依赖初始化崩溃
import '../../docApi/components'
import TypeItem from '../../docApi/typeItem'

function createField(name: string, type = 'number') {
  return new TypeItem({ name, type })
}

/**
 * 模拟 $ref 共享场景：字段自身无 properties（children 为空数组），
 * allOf 引用一组共享的 typeItems 实例（与 getTypeItem4List 的 $ref 分支行为一致）
 */
function createSummaryLikeItem() {
  const refItems = [
    'request_count',
    'total_completion_tokens',
    'total_credit',
    'total_prompt_tokens',
    'total_tokens'
  ].map(name => createField(name))

  const item = new TypeItem({ name: 'summary', type: 'any', children: [] })
  item.allOf.push(refItems)
  return item
}

describe('TypeItem 合并幂等性', () => {
  it('连续调用两次 getTypeValue 输出完全一致且无重复字段', () => {
    const item = createSummaryLikeItem()

    const first = item.getTypeValue()
    const second = item.getTypeValue()

    expect(second).toBe(first)
    expect(first.match(/request_count/g)).toHaveLength(1)
    expect(first.match(/total_credit/g)).toHaveLength(1)
  })

  it('连续调用多次 getKeyValue 输出一致', () => {
    const item = createSummaryLikeItem()

    const first = item.getKeyValue()
    const second = item.getKeyValue()
    const third = item.getKeyValue()

    expect(second).toBe(first)
    expect(third).toBe(first)
  })

  it('共享实例被两个父级分别渲染时输出一致（复现 summary 重复场景）', () => {
    const shared = createSummaryLikeItem()

    // 模拟 envelope 包装类型与独立类型共享同一 summary 字段实例
    const envelopeData = new TypeItem({ name: 'data', type: 'any', children: [shared] })
    const statsCredits = new TypeItem({ name: 'summary', type: 'any', children: [shared] })

    const first = envelopeData.getTypeValue()
    const second = statsCredits.getTypeValue()

    const inner = (str: string) => str.slice(str.indexOf('{'))
    expect(inner(second)).toBe(inner(first))
    expect(second.match(/request_count/g)).toHaveLength(1)
    expect(second.match(/total_tokens/g)).toHaveLength(1)
  })

  it('children 中存在同名条目时按名去重，后出现者覆盖先出现者', () => {
    const item = new TypeItem({
      name: 'obj',
      type: 'any',
      children: [createField('same_name'), new TypeItem({ name: 'same_name', type: 'string' }), createField('other')]
    })

    const value = item.getKeyValue()

    expect(value.match(/same_name/g)).toHaveLength(1)
    expect(value).toContain('same_name?:string')
  })

  it('allOf 多组合并保持后组覆盖前组语义', () => {
    const item = new TypeItem({ name: 'obj', type: 'any', children: [] })
    item.allOf.push(
      [createField('a'), createField('b')],
      [new TypeItem({ name: 'b', type: 'string' }), createField('c')]
    )

    const value = item.getKeyValue()

    expect(value).toContain('b?:string')
    expect(value.match(/b\?:/g)).toHaveLength(1)
    expect(value).toContain('a?:number')
    expect(value).toContain('c?:number')
  })

  it('自身 children 与 allOf 同名时去重为单个声明', () => {
    const item = new TypeItem({ name: 'obj', type: 'any', children: [createField('a'), createField('own')] })
    item.allOf.push([createField('a'), new TypeItem({ name: 'a', type: 'string' })])

    const value = item.getKeyValue()

    expect(value.match(/a\?:/g)).toHaveLength(1)
    expect(value).toContain('a?:string')
    expect(value).toContain('own?:number')
  })
})
