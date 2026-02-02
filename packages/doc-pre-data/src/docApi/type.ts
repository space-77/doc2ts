import TypeItem from './typeItem'
import TypeInfoBase from './components/base'

export type StaticImplements<I extends new (...args: any[]) => any, C extends I> = InstanceType<I>
export interface GenericsItems {
  type?: string
  $ref?: string
}

export interface ComponentsChildBase {
  name: string
  title?: string

  // 自定义属性
  attrs: Record<string, any>

  // // ref 引用值
  refs: TypeInfoBase[]

  // TODO 翻译处理名字，添加回调函处理名字
  typeName: string

  isEmpty: boolean
  typeItems: TypeItem[]

  init: () => void
}
