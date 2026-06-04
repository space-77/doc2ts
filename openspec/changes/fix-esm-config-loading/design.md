## Context

doc2ts 当前使用 `getConfig()` 函数加载用户的 TypeScript 配置文件。该函数的工作流程是:
1. 将 TypeScript 配置文件编译为 CommonJS 格式的 JavaScript
2. 将编译结果写入临时 `.js` 文件(位于 `temp/` 目录)
3. 使用 `require()` 加载该临时文件
4. 在 finally 块中清理临时文件

这种方式在 CommonJS 项目中运行良好,但在 ESM 项目中会失败。Node.js 根据最近的 package.json 中的 `"type"` 字段来判断 `.js` 文件的模块类型:
- `"type": "module"` → 所有 `.js` 文件被视为 ES Module
- `"type": "commonjs"` 或未设置 → 所有 `.js` 文件被视为 CommonJS

当 doc2ts 在 ESM 项目中生成 CommonJS 代码的 `.js` 文件时,Node.js 会将其当作 ESM 解析,导致 `exports` 等 CommonJS 全局变量未定义而报错。

**约束:**
- 必须保持向后兼容,不影响现有 CommonJS 用户
- 函数签名和返回类型不能改变(已有代码依赖)
- Node.js 版本支持: 最低 Node.js 12+(支持动态 import)

## Goals / Non-Goals

**Goals:**
- 使 doc2ts 能够在 ESM 项目(`"type": "module"`)中正常加载配置文件
- 保持 CommonJS 项目的原有行为不变
- 无需用户修改配置文件或添加特殊配置
- 自动检测并适配项目的模块类型

**Non-Goals:**
- 不修改 doc2ts 本身的模块类型(保持为 CommonJS)
- 不处理混合模块场景(单个项目同时包含 CJS 和 ESM)
- 不支持 Node.js 12 以下版本(已不在 LTS 范围内)

## Decisions

### Decision 1: 使用文件扩展名而非 package.json type 覆盖

**选择:** 生成 `.cjs` 或 `.mjs` 扩展名的临时文件,而不是在 temp/ 目录创建单独的 package.json

**理由:**
- `.cjs` 和 `.mjs` 扩展名在 Node.js 中具有最高优先级,不受 package.json 的 type 字段影响
- 避免在 temp/ 目录创建额外的 package.json 文件,减少文件操作
- 更简洁,无需管理多个文件的生命周期

**备选方案:**
- ❌ 在 temp/ 创建 package.json: 需要额外的文件管理,且可能与用户项目的 package.json 冲突
- ❌ 修改用户项目的 package.json: 侵入性太强,可能导致 git 冲突

### Decision 2: 向上查找 package.json 而非仅检查当前目录

**选择:** 从当前工作目录开始向上遍历目录树,查找最近的 package.json

**理由:**
- 符合 Node.js 模块解析行为(模块类型由最近的 package.json 决定)
- 支持在子目录中运行 doc2ts 命令
- 与 npm/pnpm/yarn 的行为一致

**备选方案:**
- ❌ 仅检查当前目录: 在子目录运行时会误判模块类型
- ❌ 硬编码检查项目根目录: 需要额外逻辑确定根目录位置

### Decision 3: 根据模块类型选择编译目标和加载方式

**选择:** 
- ESM 项目: 编译为 ES2015 模块 → 生成 .mjs → 使用 `import()`
- CommonJS 项目: 编译为 CommonJS → 生成 .cjs → 使用 `require()`

**理由:**
- TypeScript 编译器支持输出不同的模块格式
- 动态 `import()` 返回 Promise,自然支持异步加载
- `require()` 同步加载,保持原有性能特性
- 两种方式都需要访问 `.default` 属性来获取 export default 的值

**备选方案:**
- ❌ 统一使用动态 import: 会破坏 CommonJS 项目的同步加载特性
- ❌ 统一编译为 ESM: 需要所有项目都支持 import,破坏兼容性

### Decision 4: 保持 getConfig 为 async 函数

**选择:** 维持现有的 `async function getConfig()` 签名

**理由:**
- 当前函数已经是 async,调用方已经在使用 await 或 .then()
- 动态 import() 返回 Promise,自然契合 async/await
- 不破坏现有 API 契约

**实现细节:**
- CommonJS 路径虽然使用同步 `require()`,但包装在 async 函数中返回
- ESM 路径使用 `await import()` 异步加载

## Risks / Trade-offs

### Risk: 动态 import() 在某些环境中的兼容性
**影响:** 某些打包工具或旧版 Node.js 可能不支持动态 import

**缓解措施:** 
- 在文档中明确 Node.js 12+ 的最低版本要求
- CommonJS 项目不受影响,继续使用 require()

### Risk: package.json 检测失败
**影响:** 无法找到 package.json 时可能误判模块类型

**缓解措施:**
- 默认回退到 CommonJS(Node.js 默认行为)
- 在日志中记录检测结果,便于调试

### Trade-off: 增加代码复杂度
**影响:** getConfig 函数从单一路径变为双路径(CJS + ESM)

**权衡:**
- 优点: 支持更广泛的项目类型,用户体验提升
- 缺点: 维护成本增加,需要测试两种路径
- 结论: 兼容性收益大于复杂度成本

### Risk: 临时文件扩展名冲突
**影响:** 极低概率下,同名的 .cjs 和 .mjs 文件可能被其他进程访问

**缓解措施:**
- 使用时间戳和随机数生成唯一文件名
- 在 finally 块中确保清理,即使加载失败

## Migration Plan

**部署步骤:**
1. 实现新的模块检测和加载逻辑
2. 添加单元测试覆盖 ESM 和 CommonJS 场景
3. 在本地 ESM 项目中手动测试
4. 发布新版本(建议 patch 版本,因为是 bug 修复)

**回滚策略:**
- 如果出现未预见的问题,可以快速回退到上一个版本
- CommonJS 项目不受影响,风险主要在 ESM 项目
- ESM 项目当前无法使用,新版本即使有问题也不会比现状更差

**验证方法:**
- 在 CommonJS 项目中运行 doc2ts,确认行为不变
- 在 ESM 项目中运行 doc2ts,确认配置文件正确加载
- 检查临时文件是否正确清理

## Open Questions

无待解决问题。设计方案已明确。
