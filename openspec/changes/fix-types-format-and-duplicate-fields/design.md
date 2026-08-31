## Context

`bun dev`（doc2ts CLI）基于 Apifox sharedId 拉取 buddy 服务文档并生成 `src/services/buddy/types.ts`。当前产出有两类缺陷（详见 proposal.md）：

1. **非法标识符**：`packages/doc-pre-data/src/docApi/components/base.ts:69` 用 `parent.checkName(firstToUpper(name), spaceName)` 生成 `typeName`，但 `firstToUpper`/`checkName`（`common/utils.ts:147`）只处理关键字与重名冲突，不清洗 `.` 等非法字符。schema 名 `Internal_server.Envelope` 原样进入 `export interface` 声明，成为非法 TS 语法；`packages/doc2ts/src/utils/index.ts` 的 `format()` 因此 prettier 解析失败并回退输出未格式化原文——这就是"格式异常"的直接来源（格式异常是非法标识符的连锁反应，而非独立的格式化 bug）。

2. **重复字段**：`packages/doc-pre-data/src/docApi/typeItem.ts:96` 的 `getKeyValue()` 每次调用都执行 `mergeTypeOf(this, children)`，而 `mergeTypeOf`（`common/utils.ts:259`）会向传入的 `children` 数组**重复 push** `allOf` 首组条目（`startNum` 参数存在但调用方从未传入）。TypeItem 实例经 `getTypeItem4List()` 的 `$ref` 分支（base.ts:206，直接共享被引用类型的 typeItems 数组）被多个 TypeInfo 共享：`Internal_serverEnvelopeinternal_server_StatsCreditsData`（envelope 包装，先渲染）与 `Internal_serverStatsCreditsData`（后渲染）共享 `summary` 字段，第二次 `getKeyValue()` 时 children 被二次污染 → 5 个字段翻倍。

参考基准：`docs/types.ts`（正确格式与去重后的内容），修复总结：`docs/doc2ts-types修复总结.md`。

## Goals / Non-Goals

**Goals:**

- 生成的 `types.ts` 全部类型名为合法 TS 标识符，prettier 格式化成功，文件格式与 `docs/types.ts` 基准一致。
- `mergeTypeOf` 合并幂等：同一 TypeItem 多次渲染输出一致，嵌套对象无重复字段。
- 修复点集中在 `doc-pre-data`，`doc2ts` 包仅在必要时联动（无需改动生成链路结构）。
- 以单元测试锁定两个缺陷的回归。

**Non-Goals:**

- `openAICompatible.ts` 中 `X-Account-UID` 等 header 参数解构非法标识符问题（api 方法生成链路，另立 change 处理）。
- `createTypes()` 空 `spaceName` 归一化与括号配平校验（当前产出 brace 配平为 0，未复现）。
- 不调整 prettier 回退策略本身（`format()` 失败回退原文是合理的兜底，根因是语法非法）。

## Decisions

### D1：标识符清洗放在 typeName 构造入口，而非 checkName 内部

在 `base.ts` 构造函数生成 `typeName` 前（即 `firstToUpper(name)` 之后、`checkName` 之前）对 name 做一次统一清洗：`name.replace(/[^A-Za-z0-9_$]/g, '_')`。

- 理由：`checkName` 是通用的重名冲突工具（doc2ts 包也调用同名逻辑），把字符清洗塞进去会改变其契约；清洗属于"OpenAPI schema 名 → TS 标识符"的边界转换，放在 `TypeInfoBase` 构造入口语义最清晰。
- 备选方案（否决）：
  - 在 `checkName` 内清洗——影响面不可控，`checkName` 还被 `moduleName`、`funcName` 等场景复用，那些场景已有各自的清洗逻辑（`checkTsTypeKeyword` 等）。
  - 在 doc2ts 生成侧（buildType.ts）兜底替换——治标不治本，`typeName` 已被用于 `getSpaceName()` 等引用拼接，两侧名称会不一致。

**注意点**：`firstToUpper` 的实现是 `str.replace(/^(\S)/g, ...)`，首字符若是 `.`，清洗必须发生在 `firstToUpper` 之前或兼容处理，否则 `.` 开头的名首字母大写逻辑作用于非法字符。实现顺序定为：先清洗、再 `firstToUpper`、再 `checkName`。

### D2：mergeTypeOf 幂等化采用"局部合并数组"方案

`getKeyValue()` 中不再把 `this.children`（可能已被上次调用污染）直接传给 `mergeTypeOf`，改为：

```ts
const children = this.children ?? []
const merged = [...children]           // 局部副本，不污染 this.children
mergeTypeOf(this, merged)
// 后续 children.length 判断与渲染均使用 merged
```

- 理由：`mergeTypeOf` 语义是"把组合类型展开进目标数组"，保持其自身签名与行为不变（TypeInfo 侧 `components.ts:188` 也在用它），只修正 `getKeyValue` 的调用方式，改动面最小且可测。
- 备选方案（否决）：
  - 给 `TypeItem` 加 `merged` 标记位缓存结果——引入可变状态与缓存失效问题（`generateTypeRender` 允许外部改写 typeInfo）。
  - 修改 `mergeTypeOf` 内部做去重——`TypeInfo` 场景下其调用方依赖"重复 push"以外并无去重语义，改动会波及 components.ts 的既有流程。

### D3：嵌套字段按名去重作为第二道防线

`getKeyValue()` 渲染 children 时（typeItem.ts:135）将 `children.map(...)` 改为按 `name` 去重后渲染（`_.uniqBy(children, 'name')` 或等价逻辑），与 `buildType.ts:72` 顶层 `_.uniqBy(typeItems, 'name')` 行为对齐。

- 理由：D2 消除已知污染路径，但 `getTypeItem4List` 共享实例的设计意味着未来可能有其他多次写入口；去重兜底成本为 O(n)，且语义与顶层一致。
- 去重策略：保留**后出现**的条目（`mergeTypeOf` 的 rest 替换语义是"后者覆盖前者"，与 `_.uniqBy` 保留首项相反，实现时需用"后覆盖前"的归并方式或反转数组，以与 allOf 覆盖语义一致）。

### D4：测试策略——doc-pre-data Jest 单测 + 生成物快照比对

- 单测（`packages/doc-pre-data/src/__tests__/`）：
  - 标识符清洗：`.`/`-`/空格/合法名/首字符非字母 等用例，断言 `typeName` 输出。
  - 幂等性：构造带 `allOf` 的 TypeItem，连续调用两次 `getTypeValue()`/`getKeyValue()`，断言两次输出字符串完全相等且字段各出现一次。
  - 共享实例场景：两个 TypeInfo 共享同一 TypeItem（模拟 `$ref` 共享），分别渲染，断言输出一致。
- 人工验证：在 `packages/doc2ts` 下 `bun dev` 重新生成，`tsc --noEmit` 检查 `src/services/buddy/types.ts`，并与 `docs/types.ts` diff（预期仅剩点号名 → 下划线名的差异，如 `Internal_server_Envelope`）。

## Risks / Trade-offs

- [清洗改变类型名，下游引用需同步] → 同一函数内生成 `typeName`，`getSpaceName()` 等引用拼接均基于 `this.typeName`，天然同步；唯一外部影响是使用方已按旧非法名手写的代码——旧名本就无法编译，不构成兼容性损失。
- [`_` 替换可能引入新的重名冲突（`A.B` 与 `A_B` 同时存在）] → `checkName` 的既有重名后缀机制在清洗**之后**执行，可自然兜住此类冲突。
- [去重"后覆盖前"若与既有快照期望不符] → 以 `docs/types.ts` 基准与新增单测双锚点校验；doc-pre-data 既有测试（`npm test`）全量跑通后再提交。
- [doc2ts 与 doc-pre-data 为 workspace 联动，需重建 doc-pre-data 后 doc2ts dev 才生效] → 在 tasks 中显式包含 `pnpm --filter doc-pre-data build`（或 workspace 根 `pnpm build`）验证步骤。

## Migration Plan

1. 先修 doc-pre-data（D1/D2/D3）+ 单测，`npm test` 通过后构建。
2. 在 packages/doc2ts 重新生成 `src/services/buddy/types.ts`，tsc 校验 + 与基准 diff。
3. 回滚策略：全部改动集中在两个包的 4 个文件内，git revert 即可完全回退；重新生成一次即可恢复原产出（原产出本就不可用，回滚风险低）。
