// TODO 集体导出
// TODO 模块内方法名重复
import Doc2Ts from './builder/index'

async function main() {
  try {
    const doc2ts = new Doc2Ts()
    await doc2ts.build()

    doc2ts.buildLog()
  } catch (error) {
    console.error(error)
  }
}

main()
