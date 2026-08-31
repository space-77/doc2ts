## Why

使用 `doc2ts-config.ts` 中 buddy 服务源生成代码时，产出的 `src/services/buddy/types.ts` 存在两类缺陷：

1. **文件格式异常**：schema 组件名含点号（如 `Internal_server.Envelope`、`Workbuddy2api_internal_store.CreditBucket`），生成 `export interface Internal_server.Envelope` 非法 TS 语法，导致 prettier 格式化整体失败（`format()` 捕获异常后回退输出未格式化原文），整个文件失去缩进、分号等格式，无法通过 `tsc` 类型检查。
2. **重复类型字段**：共享的 TypeItem 实例被多个 TypeInfo 重复渲染时（如 `Internal_serverEnvelopeinternal_server_StatsCreditsData` 与 `Internal_serverStatsCreditsData` 共享 `summary` 字段），第二次及以后的 `getKeyValue()` 调用会通过 `mergeTypeOf()` 向 `children` 再次 push `allOf` 内容，产生重复字段（types.ts:991-1009 与 1010-1029 完全重复）。

## What Changes

* **标识符合法化**（`doc-pre-data`）：在 `checkName` / `firstToUpper` / `createSchemaType` 构造 `typeName` 时，将非标识符字符（`.`、`-`、空格等）清洗为合法 TS 标识符（如 `Internal_server.Envelope` → `Internal_server_Envelope`），保证生成的接口名合法，prettier 能正常格式化。

* **类型合并幂等化**（`doc-pre-data`）：修复 `TypeItem.getKeyValue()` 中 `mergeTypeOf(this, children)` 对 `children` 的重复污染——改为在局部作用域内合并（或按名称去重），确保同一 TypeItem 被多次渲染时输出一致、无重复字段。

* **嵌套字段去重兜底**：对嵌套对象字面量生成（`children.map(i => i.getTypeValue())`）增加按 `name` 去重保护，与顶层 `_.uniqBy(typeItems, 'name')` 行为对齐。

* **回归测试**：为标识符清洗与合并幂等性补充单元测试（doc-pre-data Jest），并以 `docs/types.ts` 作为生成结果格式基准。

非目标（本次不做）：

* `openAICompatible.ts` 中 `X-Account-UID` 解构非法标识符问题（属于 api 文件生成链路，另行处理）。

* `createTypes()` 空 `spaceName` 归一化（当前 brace 配平为 0，未复现该问题，暂不改动）。

## Capabilities

### New Capabilities

* `type-identifier-sanitization`: 生成 TS 类型时对 schema 名、字段名进行标识符合法化清洗，保证产出为合法 TS 语法、可被 prettier 正常格式化。

* `type-merge-idempotency`: 类型合并（allOf/anyOf/oneOf → children）具备幂等性，同一 TypeItem 多次渲染输出一致，不产生重复字段。

### Modified Capabilities

（无——现有 `cli-refactoring`、`unit-testing` 规格的行为不变。）

## Impact

* **代码**：

  * `packages/doc-pre-data/src/common/utils.ts`（`checkName`、标识符清洗工具）

  * `packages/doc-pre-data/src/docApi/components/base.ts`（typeName 构造、字段名处理）

  * `packages/doc-pre-data/src/docApi/typeItem.ts`（`getKeyValue` 合并幂等化、嵌套去重）

* **产出物**：`packages/doc2ts/src/services/buddy/types.ts` 重新生成后应为合法 TS 且格式与 `docs/types.ts` 基准一致（点号接口名清洗为下划线形式）。

* **依赖/API**：无公开 API 变更；类型命名规则变化仅影响含非法字符的 schema 名（原本就无法编译）。

* **测试**：`packages/doc-pre-data` 新增/更新 Jest 单测。

