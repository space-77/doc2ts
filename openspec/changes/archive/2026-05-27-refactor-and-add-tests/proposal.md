## Why

为了提升项目的健壮性、可维护性与可复用性，我们需要解决 doc2ts 中几处不合理的代码实现与逻辑漏洞：
1. **临时 JS 文件残留与硬编码路径风险**：`getConfig` 中将编译出的临时配置文件保存在 `src/utils/` 目录下，如果不正常退出，该文件将残留并污染源码目录，且在高并发时存在冲突风险。应该存放在符合项目规定的 `temp/` 目录下。
2. **隐藏原始异常信息**：`getApiJson` 抛出 `Error('')`，掩盖了真实的 Axios 请求错误或 JSON 解析异常，导致开发者极难定位网络问题。
3. **强行终止进程**：在 `initRemoteDataSource` 等方法中直接调用了 `process.exit(0)`，使得该核心逻辑无法被其他库安全复用。
4. **硬编码的 sleep 延时**：在文件创建循环中硬编码了每个文件 `sleep(60)` 毫秒，对于文件量大的项目会导致无意义的数十秒卡顿。
5. **单元测试缺失**：目前项目没有任何测试运行器和单元测试，无法保证代码重构的正确性。

## What Changes

本变更主要包含以下两大部分：
1. **核心逻辑重构**：
   - 优化 `getConfig`：临时编译的 JS 文件改写至项目根目录下的 `temp/` 临时文件夹，并确保在各种异常路径下均能被 100% 妥善清理。
   - 优化 `getApiJson`：保留并抛出真实的网络请求错误信息和堆栈。
   - 重构 `initRemoteDataSource`：移除非必要的 `process.exit(0)`，改由外部调用者捕获异常并决定是否终止进程。
   - 移除 `createFiles` 中无意义的硬编码 `sleep` 延时，或者允许通过参数配置。
2. **引入与完善单元测试**：
   - 引入轻量级测试框架 `vitest`。
   - 编写 `src/utils/index.ts` 中各工具函数的单元测试（如驼峰转换、首字母转换、关键词判断等）。
   - 编写配置加载 `getConfig` 的单元测试。

## Capabilities

### New Capabilities
- `cli-refactoring`: 重构 CLI 的临时文件创建、进程管理与异常提示逻辑，提高健壮性。
- `unit-testing`: 引入 `vitest`，为工具函数及主要流程添加全面的单元测试。

### Modified Capabilities
无

## Impact

- `src/utils/index.ts` (修改)
- `src/builder/index.ts` (修改)
- `package.json` (修改，添加依赖 `vitest` 与测试脚本)
- `tests/` (新增多份测试文件)
