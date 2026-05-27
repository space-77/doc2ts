## ADDED Requirements

### Requirement: `getConfig` 临时文件安全管理与生命周期控制
`getConfig` 在处理 TypeScript 配置文件时，不能再将编译出来的 JS 临时文件残留在 `src/utils/` 下。任何因编译、加载或 require 报错导致的异常，都必须被妥善拦截以执行临时文件清理动作。

#### Scenario: 配置文件成功加载与自动清理
- **WHEN** 提供一个合法的 TS 配置文件路径并调用 `getConfig`。
- **THEN** 系统在项目根目录下的 `temp/` 目录下创建一个唯一命名的 JS 临时文件，通过 require 成功加载后返回其 default 导出的配置，并在返回前确保该 JS 临时文件已被完全清理（即不存在于磁盘）。

#### Scenario: 配置文件包含错误或不存在
- **WHEN** 加载一个包含 TypeScript 语法错误的配置文件，或者文件根本不存在。
- **THEN** 该方法抛出 Error 以告知上层，并在抛出前物理删除任何在 `temp/` 下生成的 `.js` 临时文件，确保零文件污染。

---

### Requirement: 保留并抛出原始网络请求与解析异常堆栈
在 `getApiJson` 发生 HTTP 连接错误、404、或 JSON 损坏时，程序应向外透传或保留原始底层的 Error 信息，而不是被 `catch` 吞噬后抛出 `new Error('')`。

#### Scenario: 网络请求 404 或代理超时
- **WHEN** 拉取 Swagger JSON 的 Axios 请求遭遇网络异常或 HTTP 404 响应。
- **THEN** 工具依然把错误抛出，但抛出的 Error 必须包含底层的 Axios 异常信息（如 `Request failed with status code 404` 等），并且将原本无意义的空 Error 改为具名有意义的 Error。

---

### Requirement: 移除非 CLI 入口层的 `process.exit(0)` 强行退程
作为一个能被作为 npm 包复用的接口生成库，`Doc2Ts` 及相关辅助方法在验证失败（如 origins 含有多个匿名模块）或翻译失败时，禁止在内部直接通过 `process.exit(0)` 杀掉宿主进程。

#### Scenario: origins 含有多个匿名模块
- **WHEN** 检测到 `origins` 属性中存在超过 1 个匿名 origin 元素。
- **THEN** `Doc2Ts` 不直接调用 `process.exit(0)`，而是抛出带有明确提示的 `Error`；由顶层主 CLI（如 `bin/doc2api.js`）捕获该 `Error` 并决定优雅退出。
