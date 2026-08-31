// 先加载 components（其内部先加载 schemas 再加载 base，与生产构建的模块加载顺序一致），避免 base/schemas 循环依赖初始化崩溃
import '../../../docApi/components'
import TypeInfoBase from '../../../docApi/components/base'
import { checkName } from '../../../common/utils'
import type Components from '../../../docApi/components'

class TestTypeInfo extends TypeInfoBase {
  init() {}
}

function createParent() {
  const list: { typeName: string }[] = []
  const parent = {
    checkName: (name: string) => checkName(name, n => list.some(i => i.typeName === n))
  }
  return { parent: parent as unknown as Components, list }
}

describe('TypeInfoBase typeName 标识符清洗', () => {
  it('含点号的 schema 名应清洗为下划线', () => {
    const { parent } = createParent()
    const info = new TestTypeInfo(parent, 'Internal_server.Envelope', 'schemas')
    expect(info.typeName).toBe('Internal_server_Envelope')
  })

  it('含点号的长 schema 名应清洗为下划线', () => {
    const { parent } = createParent()
    const info = new TestTypeInfo(parent, 'Workbuddy2api_internal_store.CreditBucket', 'schemas')
    expect(info.typeName).toBe('Workbuddy2api_internal_store_CreditBucket')
  })

  it('含连字符的 schema 名应清洗为下划线', () => {
    const { parent } = createParent()
    const info = new TestTypeInfo(parent, 'Internal_server-Envelope', 'schemas')
    expect(info.typeName).toBe('Internal_server_Envelope')
  })

  it('合法名称保持不变', () => {
    const { parent } = createParent()
    const info = new TestTypeInfo(parent, 'WorkbuddyAccount', 'schemas')
    expect(info.typeName).toBe('WorkbuddyAccount')
  })

  it('首字符为数字的名称应加下划线前缀', () => {
    const { parent } = createParent()
    const info = new TestTypeInfo(parent, '123abc', 'schemas')
    expect(info.typeName).toBe('_123abc')
  })

  it('清洗后同名冲突时沿用重名后缀机制', () => {
    const { parent, list } = createParent()
    const first = new TestTypeInfo(parent, 'A.B', 'schemas')
    list.push({ typeName: first.typeName })

    const second = new TestTypeInfo(parent, 'A_B', 'schemas')
    expect(first.typeName).toBe('A_B')
    expect(second.typeName).toBe('A_B1')
  })

  it('onlyName 为 true 时不做清洗', () => {
    const { parent } = createParent()
    const info = new TestTypeInfo(parent, 'Array', 'schemas', '__common__', true)
    expect(info.typeName).toBe('Array')
  })
})
