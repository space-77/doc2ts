## Why

使用 `packages/doc2ts/doc2ts-config.ts` 配置（buddy / buddyV2 / trae 三个 Apifox 数据源）首次执行 `bun dev` 时，`src/services/buddyV2` 会产出中文文件名（`审计.ts`、`签到.ts`、`统计.ts`、`账号选择.ts`、`用户管理.ts`），且 `src/services/dicts/buddyV2.json` 的 `dict` 为空数组；再次运行才恢复正常英文名。

根因是 `packages/doc-pre-data/src/format.ts` 中模块级的 `tagsTranslateList` 被跨 origin 复用：三个 origin 通过 `Promise.all` 并发调用 `format()`，后到的 origin 命中前一个 origin 留下的翻译条目，走 `else` 分支——既不注册自己的字典条目，也不回写自己的 `item.tags`，并在前一个 origin 的翻译 Promise 完成前就返回。于是该 origin 的 tag 仍是中文，模块名生成阶段读到中文 tag 产出中文文件名，字典文件则完全丢失该 origin 的翻译记录。

修复该缺陷后暴露出第二个相关问题：buddyV2 的模块名由中文恢复为正确英文后，与 buddy 的同名模块发生碰撞。`index.ts` 汇总多个 origin 的模块时，导出名只取模块名、不含 origin，且从未跨 origin 去重，导致重复导出标识符（`TS2300: Duplicate identifier`）。修复前已有 6 个重复（`apiKeys`、`integralFreeModel`、`openAICompatible`、`signIn`、`statistics`、`userManagement`），修复后变为 8 个（新增 `accountSelection`、`audit`）——这一增长恰是第一个缺陷被修好的副作用。`packages/doc2ts/src/builder/base.ts:52` 早已标注 FIXME「存在 模块重名，方法重名 问题」。

## What Changes

- **翻译状态隔离**（doc-pre-data）：将 tag 翻译的去重列表从模块级共享改为每次 `translateV3` 调用独立持有，消除跨 origin 的状态泄漏与时序竞争。
- **命中缓存的回写补齐**（doc-pre-data）：当某个 tag 已在当前调用的翻译列表中存在时，按当前 operation 的索引回写该 tag，保证同一 origin 内多 operation 共享 tag 时全部被翻译且位置正确。
- **字典记录完整性**：无论 tag 是首次翻译还是命中已有条目，所属 origin 的字典文件 MUST 记录 `zh → en` 映射，不再出现 `dict: []`。
- **跨 origin 导出名消歧**（doc2ts）：`index.ts` 汇总各 origin 模块时，仅对**跨 origin 重名**的导出标识符追加 origin 前缀，通过 re-export 别名语法实现：`export { signIn as buddySignIn } from './buddy/signIn'`（`as` 左侧保留模块文件内的真实成员名，右侧为对外消歧名）。非重名导出保持 `export { integralTrend } from '...'` 原样、不加别名。消除 `TS2300` 重复导出与 `TS2614`/`TS2724` 不存在成员两类错误，同时不改动未冲突模块的调用方式。
- **消歧输入加固**（doc2ts）：origin 前缀清洗时处理数字开头（`_.camelCase` 不去前导数字，`123` → `_123`）；同一模块重复登记时去重；未冲突名优先占位，避免被冲突消歧名抢占而被迫改名；模块路径中的引号与反斜杠转义。
- **生成器状态生命周期**（doc2ts）：生成入口每次执行前重置模块级累加器（文件列表、导出条目、自定义类型、类型字符串），消除同一进程内多次生成互相污染（此前第二次生成会产出 `buddyAudit1` 这类累积后缀）。
- **生成物自检脚本**（doc2ts）：新增 `check-barrel` 脚本，校验 barrel 无重复导出、每条导出都能解析到真实成员，弥补"仅 grep `TS2300`"的验证盲区。
- **回归测试**：doc-pre-data 补充并发多 origin 与同 origin 多 operation 共享 tag 的单元测试；doc2ts 补充导出名消歧的单元测试。

非目标（本次不做）：

- 不改动 `revertChinese` / `formatOpenapi3Name` 中的其他模块级或跨调用状态（如经排查确有关联，另行开 change）。
- 不调整模块名公共前缀裁剪（`getCommonPrefix`）与单 origin 内的 `checkName` 重名后缀机制。
- 不引入 origin 级串行化或全局互斥锁（隔离应通过消除共享状态达成，而非限制并发）。
- 不改变模块文件名（仍为 `buddy/signIn.ts` 等），仅调整 `index.ts` 的导出标识符。
- 不改为按 origin 命名空间导出（不引入 `export * as buddy` 形式），避免破坏既有 barrel 使用方式。

## Capabilities

### New Capabilities

- `tag-translation-isolation`: 多数据源（origin）并发生成代码时，tag 名称翻译的状态、译名回写与字典缓存按 origin 相互隔离，且同一 origin 内共享同一 tag 的所有 operation 均被正确翻译。
- `barrel-export-disambiguation`: 多个 origin 的模块汇总到同一 `index.ts` 时，跨 origin 重名的导出标识符被确定性地消歧，生成的 barrel 不含重复导出、可通过类型检查，且未冲突的导出名保持不变。
- `generator-state-lifecycle`: 生成入口每次执行前重置模块级累加器，使同一进程内多次生成互不污染、结果与调用次数无关。

### Modified Capabilities

（无——现有 `cli-refactoring`、`unit-testing` 规格的行为不变。）

## Impact

- **代码**：
  - `packages/doc-pre-data/src/format.ts`（`translateTagNames` 与 `translateV3` 的翻译列表作用域、命中分支回写、`TagsList.subjects` 简化为单值）
  - `packages/doc2ts/src/builder/barrelExport.ts`（新增：导出条目类型、前缀清洗、去重、两轮分配、路径转义、barrel 生成）
  - `packages/doc2ts/src/builder/tsFileBuilder.ts`（导出条目携带 origin 信息；移除死代码 `indexFileContent` / `exportList`；新增 `resetImportList`）
  - `packages/doc2ts/src/builder/index.ts`（`createFiles` 中汇总导出时执行跨 origin 消歧；`build()` 开始前调用 `resetAccumulators`）
  - `packages/doc2ts/src/builder/base.ts`（`getOutputDir` 复用 `anonymousOriginName` 常量）
  - `packages/doc2ts/src/generators/fileList.ts`（新增 `resetFileList`）
  - `packages/doc2ts/scripts/checkBarrel.ts`（新增生成物自检脚本，配套 `check-barrel` npm script）
- **产出物**：
  - `packages/doc2ts/src/services/buddyV2/` 首次生成即为英文文件名（`audit.ts`、`signIn.ts`、`statistics.ts`、`accountSelection.ts`、`userManagement.ts`）；`packages/doc2ts/src/services/dicts/buddyV2.json` 首次生成即包含该 origin 的 `zh → en` 字典条目。
  - `packages/doc2ts/src/services/index.ts` 不含重复导出标识符；当前配置下 8 个冲突名被加 origin 前缀，其余导出保持原名。
- **依赖/API**：`format()` 入参出参契约不变；`resolveExportNames` 返回类型由 `Map<ExportEntry, string>` 改为 `string[]`（与入参下标一一对应，内部 API）；生成代码的 barrel 中，冲突导出名发生变化（属破坏性变更，但原状态无法通过类型检查，实际不可用）。
- **测试**：`packages/doc-pre-data` 新增 Jest 单测；`packages/doc2ts` 新增 `barrelExport.test.ts`、`accumulators.test.ts` 并更新 `test:unit` 脚本。
