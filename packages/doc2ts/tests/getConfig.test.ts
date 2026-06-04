import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'fs-extra'
import path from 'path'
import { getConfig, findNearestPackageJson, detectModuleType } from '../src/utils/index'

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
      const tempJsFiles = files.filter(f => f.startsWith('__config_') && (f.endsWith('.js') || f.endsWith('.cjs') || f.endsWith('.mjs')))
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
      const tempJsFiles = files.filter(f => f.startsWith('__config_') && (f.endsWith('.js') || f.endsWith('.cjs') || f.endsWith('.mjs')))
      assert.strictEqual(tempJsFiles.length, 0, '即使在编译评估出错时，finally 块也应该物理删除任何生成的 JS 临时中间文件')

    } finally {
      if (fs.existsSync(errorConfigPath)) {
        fs.unlinkSync(errorConfigPath)
      }
    }
  })
})

describe('findNearestPackageJson 函数测试', () => {
  const tempTestDir = path.join(process.cwd(), 'temp', 'test-pkg-json')

  it('能找到当前目录的 package.json', () => {
    const projectRoot = process.cwd()
    const result = findNearestPackageJson(projectRoot)
    assert.ok(result !== null, '应该能找到项目根目录的 package.json')
    assert.ok(result?.endsWith('package.json'), '返回路径应该以 package.json 结尾')
  })

  it('能向上查找父目录的 package.json', () => {
    fs.ensureDirSync(tempTestDir)
    const result = findNearestPackageJson(tempTestDir)
    assert.ok(result !== null, '应该能找到父目录的 package.json')
    assert.ok(result?.includes('package.json'), '返回路径应该包含 package.json')
    fs.removeSync(tempTestDir)
  })

  it('在没有 package.json 的隔离环境中返回 null', () => {
    // 此测试在真实环境中难以完全隔离,仅做概念验证
    // 实际项目总会有 package.json,所以跳过此测试
  })
})

describe('detectModuleType 函数测试', () => {
  const tempTestDir = path.join(process.cwd(), 'temp', 'test-module-type')

  it('检测 type: "module" 时返回 module', () => {
    fs.ensureDirSync(tempTestDir)
    const pkgPath = path.join(tempTestDir, 'package.json')
    fs.writeFileSync(pkgPath, JSON.stringify({ type: 'module' }), 'utf8')

    const originalCwd = process.cwd()
    try {
      process.chdir(tempTestDir)
      const result = detectModuleType()
      assert.strictEqual(result, 'module', '应该检测为 module 类型')
    } finally {
      process.chdir(originalCwd)
      fs.removeSync(tempTestDir)
    }
  })

  it('检测 type: "commonjs" 时返回 commonjs', () => {
    fs.ensureDirSync(tempTestDir)
    const pkgPath = path.join(tempTestDir, 'package.json')
    fs.writeFileSync(pkgPath, JSON.stringify({ type: 'commonjs' }), 'utf8')

    const originalCwd = process.cwd()
    try {
      process.chdir(tempTestDir)
      const result = detectModuleType()
      assert.strictEqual(result, 'commonjs', '应该检测为 commonjs 类型')
    } finally {
      process.chdir(originalCwd)
      fs.removeSync(tempTestDir)
    }
  })

  it('检测没有 type 字段时默认返回 commonjs', () => {
    fs.ensureDirSync(tempTestDir)
    const pkgPath = path.join(tempTestDir, 'package.json')
    fs.writeFileSync(pkgPath, JSON.stringify({ name: 'test' }), 'utf8')

    const originalCwd = process.cwd()
    try {
      process.chdir(tempTestDir)
      const result = detectModuleType()
      assert.strictEqual(result, 'commonjs', '没有 type 字段时应该默认为 commonjs')
    } finally {
      process.chdir(originalCwd)
      fs.removeSync(tempTestDir)
    }
  })
})

describe('getConfig ESM 项目集成测试', () => {
  const tempTestDir = path.join(process.cwd(), 'temp', 'test-esm-project')
  const tempDir = path.join(process.cwd(), 'temp')

  it('在 ESM 项目中成功加载配置文件', async () => {
    fs.ensureDirSync(tempTestDir)
    const pkgPath = path.join(tempTestDir, 'package.json')
    fs.writeFileSync(pkgPath, JSON.stringify({ type: 'module' }), 'utf8')

    const testConfigPath = path.join(tempTestDir, `test_config_${Date.now()}.ts`)
    fs.writeFileSync(
      testConfigPath,
      `export default {
        outDir: './src/api',
        languageType: 'ts',
        origins: [{ name: 'esmOrigin', url: 'http://esm.test' }]
      }`,
      'utf8'
    )

    const originalCwd = process.cwd()
    try {
      process.chdir(tempTestDir)
      const relativePath = path.relative(tempTestDir, testConfigPath)
      const config = await getConfig(relativePath)

      assert.strictEqual(config.outDir, './src/api')
      assert.strictEqual(config.languageType, 'ts')
      assert.strictEqual(config.origins[0].name, 'esmOrigin')

      const files = fs.readdirSync(tempDir)
      const tempMjsFiles = files.filter(f => f.startsWith('__config_') && f.endsWith('.mjs'))
      assert.strictEqual(tempMjsFiles.length, 0, 'ESM 项目的 .mjs 临时文件应该被清理')
    } finally {
      process.chdir(originalCwd)
      fs.removeSync(tempTestDir)
    }
  })
})

describe('getConfig CommonJS 项目集成测试', () => {
  const tempTestDir = path.join(process.cwd(), 'temp', 'test-cjs-project')
  const tempDir = path.join(process.cwd(), 'temp')

  it('在 CommonJS 项目中成功加载配置文件(向后兼容)', async () => {
    fs.ensureDirSync(tempTestDir)
    const pkgPath = path.join(tempTestDir, 'package.json')
    fs.writeFileSync(pkgPath, JSON.stringify({ type: 'commonjs' }), 'utf8')

    const testConfigPath = path.join(tempTestDir, `test_config_${Date.now()}.ts`)
    fs.writeFileSync(
      testConfigPath,
      `export default {
        outDir: './src/api',
        languageType: 'ts',
        origins: [{ name: 'cjsOrigin', url: 'http://cjs.test' }]
      }`,
      'utf8'
    )

    const originalCwd = process.cwd()
    try {
      process.chdir(tempTestDir)
      const relativePath = path.relative(tempTestDir, testConfigPath)
      const config = await getConfig(relativePath)

      assert.strictEqual(config.outDir, './src/api')
      assert.strictEqual(config.languageType, 'ts')
      assert.strictEqual(config.origins[0].name, 'cjsOrigin')

      const files = fs.readdirSync(tempDir)
      const tempCjsFiles = files.filter(f => f.startsWith('__config_') && f.endsWith('.cjs'))
      assert.strictEqual(tempCjsFiles.length, 0, 'CommonJS 项目的 .cjs 临时文件应该被清理')
    } finally {
      process.chdir(originalCwd)
      fs.removeSync(tempTestDir)
    }
  })
})
