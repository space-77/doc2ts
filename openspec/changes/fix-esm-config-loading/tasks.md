## 1. 实现模块类型检测工具函数

- [x] 1.1 在 src/utils/index.ts 中添加 `findNearestPackageJson()` 函数,向上遍历目录树查找 package.json
- [x] 1.2 在 src/utils/index.ts 中添加 `detectModuleType()` 函数,读取 package.json 的 type 字段并返回 'module' 或 'commonjs'
- [x] 1.3 添加类型定义: `type ModuleType = 'module' | 'commonjs'`

## 2. 修改 getConfig 函数以支持 ESM

- [x] 2.1 在 getConfig 函数开头调用 `detectModuleType()` 获取项目模块类型
- [x] 2.2 根据模块类型确定临时文件扩展名(.mjs 或 .cjs)
- [x] 2.3 根据模块类型选择 TypeScript 编译目标(ES2015 或 CommonJS)
- [x] 2.4 修改文件写入逻辑,使用对应扩展名生成临时文件
- [x] 2.5 添加条件分支:如果是 ESM,使用 `await import()` 加载;如果是 CJS,使用 `require()` 加载
- [x] 2.6 更新 finally 块中的清理逻辑,确保新扩展名的临时文件能被正确删除

## 3. 添加单元测试

- [x] 3.1 在 tests/getConfig.test.ts 中添加 `findNearestPackageJson()` 的测试用例
- [x] 3.2 在 tests/getConfig.test.ts 中添加 `detectModuleType()` 的测试用例(覆盖 module/commonjs/undefined 三种情况)
- [x] 3.3 添加 ESM 项目场景的集成测试:创建测试目录,包含 package.json("type": "module") 和测试配置文件
- [x] 3.4 添加 CommonJS 项目场景的集成测试:验证向后兼容性
- [x] 3.5 添加边界情况测试:无 package.json 时的默认行为

## 4. 验证和文档更新

- [x] 4.1 运行所有单元测试确保通过: `npm run test:unit`
- [x] 4.2 在本地 ESM 测试项目中手动验证配置加载功能
- [x] 4.3 在本地 CommonJS 测试项目中手动验证向后兼容性
- [x] 4.4 更新 README.md,添加 Node.js 版本要求说明(12+)
- [x] 4.5 更新 CHANGELOG.md,记录此次 bug 修复
