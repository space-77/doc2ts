## 1. 标识符合法化（doc-pre-data）

* [x] 1.1 在 `packages/doc-pre-data/src/common/utils.ts` 新增标识符清洗工具函数（`[^A-Za-z0-9_$]` → `_`，首字符为数字时加 `_` 前缀），并导出

* [x] 1.2 在 `packages/doc-pre-data/src/docApi/components/base.ts` 的 `TypeInfoBase` 构造函数中，按"先清洗 → 再 firstToUpper → 再 checkName"的顺序生成 `typeName`，确认首字符为 `.` 等非法字符时清洗正确（注意 `firstToUpper` 的 `/^(\S)/` 对非法首字符的行为）

* [x] 1.3 检查 `base.ts` 中其它基于 schema 名构造名称的路径（如 `createGenericsTypeinfo` 的 `${name}T`、`pushEnum` 的 `firstToUpper(keyName)`），对会进入类型声明的名称统一走清洗函数

## 2. 类型合并幂等化（doc-pre-data）

* [x] 2.1 修改 `packages/doc-pre-data/src/docApi/typeItem.ts` 的 `getKeyValue()`：用局部副本数组承接 `mergeTypeOf` 的合并结果，不再污染 `this.children`

* [x] 2.2 在 `getKeyValue()` 渲染 children 处（typeItem.ts:135 附近）增加按 `name` 去重，语义为"后出现者覆盖先出现者"（与 `mergeTypeOf` rest 替换语义一致），作为幂等兜底

* [x] 2.3 确认 `mergeTypeOf` 本身签名与行为不变（`components.ts:188` 处 TypeInfo 侧调用不受影响）

## 3. 单元测试（doc-pre-data）

* [x] 3.1 新增标识符清洗测试：`.`/`-`/空格/合法名/首字符数字等用例，断言 typeName 输出（含 `Internal_server.Envelope` → `Internal_server_Envelope`）

* [x] 3.2 新增幂等性测试：带 `allOf` 的 TypeItem 连续调用两次 `getTypeValue()`，断言两次输出完全一致且无重复字段

* [x] 3.3 新增共享实例测试：模拟 `$ref` 共享（两个 TypeInfo 共享同一 TypeItem），分别渲染断言输出一致（复现 `summary` 重复场景）

* [x] 3.4 运行 `packages/doc-pre-data` 全量测试 `npm test`，确保既有用例不回归

## 4. 生成物验证（doc2ts）

* [x] 4.1 在 workspace 根执行 `pnpm build` 重建 doc-pre-data，然后在 `packages/doc2ts` 执行 `bun dev` 重新生成

* [x] 4.2 对 `src/services/buddy/types.ts` 执行 `tsc --noEmit` 校验，确认无语法/类型错误且文件已被 prettier 正常格式化（有缩进与分号）

* [x] 4.3 与 `docs/types.ts` 基准 diff：确认仅剩预期差异（点号名 → 下划线名，如 `Internal_server_Envelope`），无重复字段（重点核对 `summary` 相关接口）

