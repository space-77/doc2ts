// TODO 集体导出
// TODO 模块内方法名重复
// TODO enum 类型没有实现
// TODO typeName lock
// TODO { type: unknown // ref }
// TODO 过滤 指定模块
// TODO hooks
// ✨ ⭐ ✅

import Doc2Ts from './builder/index'
// import keyword from 'is-ecma-keyword'
// import Manage from  './scripts/manage'

async function main() {
  try {
    // console.log(keyword);
    // console.log(keyword('new'));
    // new Manage()
    const doc2ts = new Doc2Ts()
    await doc2ts.build()

    doc2ts.buildLog()
  } catch (error) {
    console.error(error)
  }
}

main()
