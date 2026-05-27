## ADDED Requirements

### Requirement: 引入 Vitest 自动化单元测试框架并支持脚本化运行
本项目应集成现代化 TypeScript 单元测试框架 `vitest`，支持单测的开箱即用、监听热更新、并行执行及 Mocking。

#### Scenario: 单元测试套件发现并完整执行
- **WHEN** 运行 `npx vitest run` 或者 `npm run test:unit` 命令。
- **THEN** 系统能扫描 `tests/` 目录下所有以 `.test.ts` 命名规范结尾的测试文件并全部通过。

---

### Requirement: 对核心 Utils 辅助工具函数族实施覆盖率测试
针对 `src/utils/index.ts` 暴露的核心数据转换与格式验证函数编写针对性的单元测试。

#### Scenario: `camel2Kebab` 字符串转换
- **WHEN** 传入一个以中划线连接的字符串（如 `api-user-info`）。
- **THEN** 方法应正确返回其小驼峰形式 `apiUserInfo`。

#### Scenario: `firstToUpper` 与 `firstToLower` 大小写转换
- **WHEN** 传入任意字符串（如 `test` 或 `Demo`）。
- **THEN** `firstToUpper` 确保首字母转为大写（如 `Test`），`firstToLower` 确保首字母转为小写（如 `demo`）。

#### Scenario: `isKeyword` 校验是否属于 JavaScript 或系统保留关键字
- **WHEN** 传入 `body`、`url`、`headers`、`class` 等系统或 JavaScript 语言级别的保留关键字。
- **THEN** 返回 `true`，防止其作为非法变量或函数名导致编译崩溃。

---

### Requirement: 配置加载器 `getConfig` 功能与异常测试
通过 mock 或创建临时测试文件的方式，验证 TS 配置文件在动态编译和加载时的稳定表现。

#### Scenario: 成功加载有效的 TS 配置文件
- **WHEN** 动态生成一份临时 TS 格式的配置文件并调用 `getConfig`。
- **THEN** 正确跨译编译并返回预期的 JS 配置对象值，随后无污染删除临时产物。
