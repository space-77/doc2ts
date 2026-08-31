## Purpose

保证 doc2ts 生成的类型声明文件中所有类型名均为合法 TypeScript 标识符：来自 OpenAPI/Apifox 文档的 schema 组件名（可能含点号、连字符、空格等非法字符）在生成 `interface`/`type` 名之前 MUST 被清洗为合法标识符，使产出文件能通过 TypeScript 编译并被代码格式化工具正常处理。

## ADDED Requirements

### Requirement: 类型名标识符清洗

当文档中的 schema 组件名包含非标识符字符时，生成器 SHALL 将其清洗为合法 TypeScript 标识符后再作为类型名输出。清洗规则：非 `[A-Za-z0-9_$]` 字符（含 `.`、`-`、空格）统一替换为 `_`，且不改变原名的字母大小写与既有合法字符；清洗后的名称若与既有类型名冲突，SHALL 沿用现有重名加数字后缀机制。

#### Scenario: 含点号的 schema 名

- **WHEN** 文档中存在名为 `Internal_server.Envelope` 的 schema 组件
- **THEN** 生成的类型名为 `Internal_server_Envelope`，且文件内所有对该类型的引用（含命名空间限定引用）均使用清洗后的名称

#### Scenario: 含连字符的 schema 名

- **WHEN** 文档中存在名为 `Internal_server-Envelope` 的 schema 组件
- **THEN** 生成的类型名为 `Internal_server_Envelope`

#### Scenario: 合法名称不受影响

- **WHEN** schema 组件名为 `WorkbuddyAccount`（全部为合法标识符字符）
- **THEN** 生成的类型名保持 `WorkbuddyAccount` 不变

### Requirement: 生成文件可编译且可格式化

清洗后的类型声明文件 SHALL 为合法 TypeScript 语法，能通过 `tsc` 编译检查，并能被 prettier 以 `typescript` parser 成功格式化（即生成流程不会因语法错误回退到未格式化原文）。

#### Scenario: 生成文件通过类型检查

- **WHEN** 使用包含非法字符 schema 名的文档源生成代码
- **THEN** 产出的 `types.ts` 不含非法标识符声明，`tsc --noEmit` 检查通过，文件具有标准缩进与分号格式
