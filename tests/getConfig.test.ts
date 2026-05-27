import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'fs-extra'
import path from 'path'
import { getConfig } from '../src/utils/index'

describe('getConfig 配置加载器与临时文件生命周期单元测试', () => {
  const tempTestDir = path.join(process.cwd(), 'temp')

  it('成功加载有效的 TS 配置文件，并能自动 100% 清理临时 JS 文件', async () => {
    const testConfigPath = path.join(tempTestDir, `test_config_${Date.now()}.ts`)
    fs.ensureDirSync(tempTestDir)
    fs.writeFileSync(
      testConfigPath,
      `export default {
        outDir: './src/api',
        languageType: 'ts',
        origins: [{ name: 'testOrigin', url: 'http://test.url' }]
      }`,
      'utf8'
    )

    try {
      const relativePath = path.relative(process.cwd(), testConfigPath)
      const config = await getConfig(relativePath)

      assert.strictEqual(config.outDir, './src/api')
      assert.strictEqual(config.languageType, 'ts')
      assert.ok(Array.isArray(config.origins))
      assert.strictEqual(config.origins[0].name, 'testOrigin')

      const files = fs.readdirSync(tempTestDir)
      const tempJsFiles = files.filter(f => f.startsWith('__config_') && f.endsWith('.js'))
      assert.strictEqual(tempJsFiles.length, 0, '应该不存在任何残留的临时 JS 编译产物')

    } finally {
      if (fs.existsSync(testConfigPath)) {
        fs.unlinkSync(testConfigPath)
      }
    }
  })

  it('在配置文件加载/转换报错时，依然能触发 finally 机制物理清理临时 JS 文件', async () => {
    const errorConfigPath = path.join(tempTestDir, `error_config_${Date.now()}.ts`)
    fs.ensureDirSync(tempTestDir)
    fs.writeFileSync(
      errorConfigPath,
      `export default {
        outDir: './src/api',
        languageType
      }`,
      'utf8'
    )

    try {
      const relativePath = path.relative(process.cwd(), errorConfigPath)
      await assert.rejects(getConfig(relativePath))

      const files = fs.readdirSync(tempTestDir)
      const tempJsFiles = files.filter(f => f.startsWith('__config_') && f.endsWith('.js'))
      assert.strictEqual(tempJsFiles.length, 0, '即使在编译评估出错时，finally 块也应该物理删除任何生成的 JS 临时中间文件')

    } finally {
      if (fs.existsSync(errorConfigPath)) {
        fs.unlinkSync(errorConfigPath)
      }
    }
  })
})
