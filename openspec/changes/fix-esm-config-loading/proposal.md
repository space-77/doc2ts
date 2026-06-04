## Why

doc2ts 工具在加载用户配置文件时,将 TypeScript 配置编译为 CommonJS 格式并使用 `require()` 加载。当用户项目的 package.json 设置 `"type": "module"` 时,生成的临时 .js 文件会被 Node.js 识别为 ES Module,导致 CommonJS 代码(如 `exports.__esModule`)在 ESM 作用域中执行失败,报错 `ReferenceError: exports is not defined`。这使得 doc2ts 无法在 ESM 项目中正常工作,严重影响了工具的兼容性。

## What Changes

- 修改配置加载逻辑,支持检测用户项目的模块类型(CommonJS 或 ESM)
- 根据项目类型生成对应格式的临时配置文件(.cjs 或 .mjs)
- 使用动态 import 替代 require 加载 ESM 配置文件
- 保持向后兼容,对 CommonJS 项目继续使用原有逻辑
- 增加单元测试覆盖 ESM 和 CommonJS 两种场景

## Capabilities

### New Capabilities
- `esm-config-detection`: 检测用户项目的模块类型(通过 package.json 的 type 字段)
- `esm-config-loading`: 使用动态 import 加载 ES Module 格式的配置文件

### Modified Capabilities
<!-- 无需修改现有 specs 的需求层面,仅实现层面优化 -->

## Impact

**受影响的代码:**
- `packages/doc2ts/src/utils/index.ts` 中的 `getConfig()` 函数
- `packages/doc2ts/tests/getConfig.test.ts` 单元测试文件

**受影响的用户:**
- 所有设置了 `"type": "module"` 的 ESM 项目用户将能够正常使用 doc2ts
- CommonJS 项目用户不受影响,保持原有行为

**依赖变化:**
- 无新增外部依赖
- 利用 Node.js 原生的动态 import 支持(Node.js 12+)
