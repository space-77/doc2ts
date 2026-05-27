## 1. 核心异常与临时文件重构 (cli-refactoring)

- [x] 1.1 **重构 `getConfig` 临时文件安全管理**：
  - 修改 `src/utils/index.ts` 中的 `getConfig`。将临时文件 `jsName` 从 `__dirname` 下创建，迁移到项目根目录下的 `temp/` 目录中。
  - 使用更不易冲突的唯一文件名（时间戳 + 随机数）。
  - 用 `try-finally` 结构，无论在 require 时发生何种致命异常，都必定在 `finally` 块中坚决调用 `fs.unlinkSync` 进行彻底清理。
- [x] 1.2 **优化 `getApiJson` 异常堆栈保留**：
  - 修改 `src/utils/index.ts` 中的 `getApiJson`。
  - 在 `catch` 异常中，不再丢弃真实的 Axios / HTTP / JSON 解析错误堆栈；将其包裹在抛出的 Error 信息中传达出去（例如 `throw new Error(\`获取文档数据异常: \${error.message}\`)`）。
- [x] 1.3 **移除多处不合理的 `process.exit(0)` 并重构异常退出控制流**：
  - 检查 `src/builder/index.ts`（例如 `initRemoteDataSource` 中对匿名的 origins 重复校验及翻译失败退出等）。
  - 将 `process.exit(0)` 全部替换为抛出具名异常。
  - 优化 CLI 的主入口层，确保在顶层有未捕获异常的全局捕获逻辑，避免未处理的 Promise reject，友好打印错误后再正常执行退程。
- [x] 1.4 **消除文件创建时无意义的 `sleep(60)` 硬编码延时**：
  - 在 `src/builder/index.ts` 的 `createFiles` 循环中，移除硬编码的 `await sleep(60)` 等无谓卡顿逻辑，提升文件量庞大时的 IO 构建吞吐效能。

## 2. 单元测试集成与核心函数覆盖 (unit-testing)

- [x] 2.1 **集成原生 `node:test` 与配置 package.json 单测脚本**：
  - 在 `package.json` 中配置原生测试运行命令（使用 `ts-node --test`），免去安装第三方测试依赖并规避沙箱安全壁垒。
  - 在 `package.json` 中添加 `"test:unit": "ts-node --test tests/**/*.test.ts"` 以开启高性能原生单测之旅。
- [x] 2.2 **编写 `src/utils/index.ts` 纯工具函数单元测试**：
  - 在 `tests/` 下新增 `utils.test.ts` 测试文件。
  - 针对 `camel2Kebab`、`firstToUpper`、`firstToLower`、`isKeyword` 等纯工具函数设计精准的边界输入并验证输出结果。
- [x] 2.3 **编写 `getConfig` 配置加载器与文件清理测试**：
  - 在 `tests/` 下新建 `getConfig.test.ts` 测试文件。
  - 在单测中动态写入一个临时的 `.ts` 配置文件，调用 `getConfig` 读取它并验证返回值正确性。
  - 同时，验证在读取报错或读取成功后，系统是否真正彻底地将 `temp/` 下生成的中间临时 `.js` 物理清除。
