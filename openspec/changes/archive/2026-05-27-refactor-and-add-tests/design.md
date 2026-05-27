## Context

本项目 `doc2ts` 是一个从 Swagger / OpenAPI 文档生成 TypeScript / JavaScript 接口文件的 CLI 工具。但在核心逻辑和异常控制上存在若干处影响稳定性与可维护性的不合理实现：
1. `getConfig` 在加载配置文件时，为了运行 TypeScript 配置文件，使用 `ts.transpileModule` 编译出的临时 `js` 文件保存在 `src/utils/` 下。一旦在 require 或转换期间报错，该临时文件无法被 100% 清理而污染源码。
2. 内部网络拉取 `getApiJson` 忽略了真实的 Axios 网络或数据错误堆栈，给用户排障带来了灾难性体验。
3. `initRemoteDataSource` 和匿名 origin 验证部分大量使用了强行终止主进程的 `process.exit(0)`。这极大降低了模块的可复用性。
4. 项目当前在执行创建文件时，存在无意义的硬编码 `sleep(60)`，大项目生成数百个接口文件时会浪费数十秒甚至数分钟的等待时间。
5. 缺乏单元测试框架与规范。

## Goals / Non-Goals

**Goals:**
- **临时文件安全性**：将临时文件移到根目录的 `temp/` 下，并且利用 `try-finally` 机制 100% 保证在出错时清理。
- **完整异常回溯**：网络异常和解析异常需要附加详细的 Error 错误详情（如 HTTP 状态码、请求路径等），而不是抛出空信息的 `new Error('')`。
- **去除强退逻辑**：去除库内部直接调用 `process.exit` 的破坏性做法，改由 CLI 顶层（即 `bin/` 主入口文件或外部模块调用者）捕获异常并打印日志后再安全退出。
- **性能优化**：移除文件生成中硬编码的 `sleep(60)`，或允许动态调整。
- **单元测试保障**：引入 `vitest`，对主要功能函数及配置加载核心逻辑提供 100% 可通过的单元测试。

**Non-Goals:**
- 不对代码生成的类型构造算法（如 `BuildTypeFile` 内的具体生成策略）做大面积更改，仅仅只对其承载的外部 CLI 逻辑和异常捕获进行重构。
- 不更改 CLI 工具向后兼容的对外核心 API。

## Decisions

### 决定 1：将临时编译文件存放在安全的项目根目录 `temp/` 下，并利用 `finally` 可靠清理
- **描述**：我们将在编译 TS 配置文件为 JS 配置文件时，把生成的中间文件写入当前项目根目录的 `temp/` 目录下（若不存在则自动创建），并在 `try-catch-finally` 的 `finally` 块中不论成功或失败都坚决执行清理动作。
- **理由**：
  1. 避免对 `src/utils/` 的源码目录产生脏文件污染。
  2. 符合 `user_global` 规定的所有临时文件均应放置于项目根目录下的 `temp/` 文件夹。
  3. `finally` 保障即使 `require` 出错，临时文件也能被彻底删除。

### 决定 2：引入 `vitest` 作为项目测试框架并为核心工具库编写单元测试
- **描述**：我们在 `devDependencies` 引入 `vitest`。
- **理由**：
  1. `vitest` 对 TypeScript 具有极佳的开箱即用支持，无需复杂的 `ts-jest` 或 `babel` 桥接配置。
  2. 它的执行速度极其迅捷，并且可以使用 `vi.mock` 非常方便地 mock 掉文件系统与网络 Axios 请求，有利于进行纯粹的单元测试。

### 决定 3：捕获 Axios 异常时不丢失底层 Error Stack 详情
- **描述**：重构 `getApiJson`。在 `catch(error)` 时，使用更高级的错误处理，保留 Axios 报错的 detail，甚至将底层错误传入新抛出的 `Error`。
- **理由**：
  在拉取异常时显示类似 `getaddrinfo ENOTFOUND` 或者 `status 404` 这样的核心故障原因，方便用户迅速定位代理或 URL 配置的失误。

## Risks / Trade-offs

- **[Risk]** 移除了 `process.exit(0)` 后，若顶层没有做全局 `try-catch` 处理，异常会直接打印很长一串栈追踪，使得对普通用户来说不够友好。
  - **[Mitigation]** 检查 CLI 入口文件，确保所有的顶层调用有对 Promise reject 以及 Error 的全局捕获与美化输出。
- **[Risk]** 临时 JS 文件在 `require` 时，如果发生内存泄露或者在极其罕见的多模块并行并发读取时发生重名。
  - **[Mitigation]** 使用毫秒级时间戳 + 4位强随机数，进一步规避极端重名可能，且 `finally` 对此进行 100% 清理。
