import { describe, it } from 'node:test'
import assert from 'node:assert'
import { fileList, resetFileList } from '../src/generators/fileList'
import { importList, resetImportList } from '../src/builder/tsFileBuilder'
import { customInfoList, typeStringList } from '../src/builder/buildType'

describe('模块级累加器重置', () => {
  it('resetFileList 清空 fileList', () => {
    fileList.push({ filePath: '/a.ts', content: 'a' })
    resetFileList()
    assert.strictEqual(fileList.length, 0)
  })

  it('resetImportList 清空 importList', () => {
    importList.push({ originName: 'buddy', exportName: 'audit', fileExPath: './buddy/audit' })
    resetImportList()
    assert.strictEqual(importList.length, 0)
  })

  it('重置后再次累积不会残留上一次的内容', () => {
    // 模拟第一次 build
    importList.push({ originName: 'buddy', exportName: 'audit', fileExPath: './buddy/audit' })
    fileList.push({ filePath: '/a.ts', content: 'a' })
    customInfoList.push({} as any)
    typeStringList.push({ typeName: 'T', typeValue: 'string' })

    // 模拟第二次 build 开始前重置
    resetFileList()
    resetImportList()
    customInfoList.length = 0
    typeStringList.length = 0

    assert.strictEqual(fileList.length, 0)
    assert.strictEqual(importList.length, 0)
    assert.strictEqual(customInfoList.length, 0)
    assert.strictEqual(typeStringList.length, 0)
  })
})
