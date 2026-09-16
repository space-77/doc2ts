## Context

见 `proposal.md` - Why。本设计聚焦修复方式的技术选型。

当前实现（`packages/doc-pre-data/src/format.ts`）的关键约束：

1. `translateTagNames`（format.ts:27）与 `translateV3`（format.ts:99）共用一个**模块级** `const tagsTranslateList: TagsList[] = []`（format.ts:25），该数组在进程内跨 `format()` 调用持久存在。
2. `Translate` 实例（`const t = new Translate(...)`）是每次 `translateV3` 调用新建的，**不共享**；但 `t.translate()` 在 `waitTranslateList` 为空时立即 resolve。
3. tag 翻译采用"先注册、后回写"两段式：`if (!tItem)` 分支负责 `addTranslate`、`push` 到 `tagsTranslateList`、`await` 后在 `subjects.forEach` 中回写；`else` 分支仅 `subjects.push` 并 `await` 已有 Promise，**不回写当前 subject 的 `tags[index]`**。
4. `translateTagNames` 的入口是 `itemTags.forEach(async (tagText, index) => ...)`——fire-and-forget，无返回值，`translateV3` 无法 await 它。

已复现的失败链路（首次运行，buddy / buddyV2 / trae 并发）：

```
buddyV2 的 tag "账号选择" 命中 buddy 留下的 tItem
  → 走 else 分支：不 addTranslate、不回写 item.tags
  → buddyV2 的 t.translate() 因 waitTranslateList 为空而立即 resolve
  → docApi.init() → funcGroup() 在 root tag 仍是中文时读取 tagInfo.name
  → moduleName = "账号选择"（中文文件名）
  → buddyV2.json 的 dict = []（无任何 addTranslate 落库）
```

关键证据：并发失败时，buddyV2 的 `root tags` 与 `item.tags` 事后检查均为英文，但 `moduleName` 已是中文——说明失败发生在 `funcGroup()` 读取中文 tag 的**时序窗口**内，而非译名本身缺失。

barrel 汇总链路（`packages/doc2ts`）的关键约束：

1. `tsFileBuilder.ts:17` 用 `export const importList: string[] = []` 收集导出语句，每个模块 push 一条**裸字符串**（tsFileBuilder.ts:291）：`export { ${_fileName} } from '${fileExPath}'`——导出名只有模块名，**不含 origin**。
2. `builder/index.ts:194` 直接 `importList.sort((a, b) => a.length - b.length).join('\r\n')` 作为 `index.ts` 内容，**无任何去重或消歧**。
3. `checkName` 去重只发生在**单个 origin 内**（`docApi/index.ts:153`、`docApi/index.ts:280`），跨 origin 从未检查。
4. `TsFileBuilder` 已通过 `public origin`（`base.ts:8`）持有 origin 信息，但未用于导出名。
5. origin 的 `name` 是可选的（`ApifoxConfig`/`ModelList` 的 `name?`），且 README 示例中存在 `swagger-api`、`local-api` 这类**含连字符**的名字；匿名 origin 至多一个（`builder/index.ts:89-96` 会抛错），其输出目录回退为 `module`（`base.ts:53`）。

已实测：重复 re-export 触发 `TS2300: Duplicate identifier`（`index.ts` 中两条 `export { signIn }` 报同一标识符重复）。当前配置下冲突名共 8 个：`signIn`/`statistics`/`userManagement`（各 ×3）、`apiKeys`/`audit`/`accountSelection`/`openAICompatible`/`integralFreeModel`（各 ×2）。

## Goals / Non-Goals

**Goals:**

- 消除 `tagsTranslateList` 的跨 origin 共享，使每个 origin 的翻译过程自洽（自注册、自回写、自落库）。
- 修正 `else` 分支不回写 `item.tags[index]` 的缺陷，覆盖"同一 origin 内多 operation 共享同一 tag"的场景。
- 让汇总后的 `index.ts` 不含重复导出标识符、可通过类型检查；仅对跨 origin 冲突的导出名追加 origin 前缀，未冲突导出保持原名。
- 以单元测试锁定并发多 origin、同 origin 共享 tag、barrel 消歧三类回归。

**Non-Goals:**

- 不改动 `revertChinese` / `formatOpenapi3Name` 中其他模块级状态（`refs` 已是局部变量，经排查无同类问题）。
- 不引入 origin 级串行化、互斥锁或 `AsyncLocalStorage`。
- 不改变 `funcGroup()` 的 `flip` 兼容逻辑、模块名公共前缀裁剪（`getCommonPrefix`）与单 origin 内的 `checkName` 重名机制。
- 不改动 `Translate` 类的翻译引擎、缓存查询与 `TranslateType.ai` 分支。
- 不改变各 origin 目录下的模块文件名（仍为 `buddy/signIn.ts`），只改 `index.ts` 的导出标识符。
- 不采用 `export * as buddy` 命名空间形式（会整体改变 barrel 使用方式）。
- 不处理单 origin 内的方法重名（`base.ts:52` FIXME 的另一半）。

## Decisions

### D1：`tagsTranslateList` 由模块级改为 `translateV3` 调用级局部变量

将 format.ts:25 的模块级常量移除，改为在 `translateV3` 函数体内声明 `const tagsTranslateList: TagsList[] = []`，并通过已有的 options 对象透传给 `translateTagNames`（新增 `tagsTranslateList` 字段，format.ts:26 的 `TagNamesOp` 类型同步扩展）。

- 理由：`translateTagNames` 是 `translateV3` 内部闭包使用的辅助函数，作用域天然属于单次调用；共享状态是"意外产物"而非设计意图。改为调用级局部后，每个 origin 的 `tItem` 只包含自身的 subject，`else` 分支不再可能命中其他 origin 的条目，`t.translate()` 也必然等到自身的翻译完成。
- 备选方案（否决）：
  - **给 `format()` 加全局互斥锁 / 串行化 origins**：治标不治本，且牺牲多 origin 并发性能；同 origin 内的 `else` 回写缺陷依然存在。
  - **在每次 `format()` 调用前后手动清空模块级数组**：依赖调用方纪律，遗漏一次即回归；并发场景下"清空"本身就会互相破坏。
  - **`AsyncLocalStorage` 承载上下文**：为单进程内的简单隔离引入 Node 版本约束与隐式依赖，复杂度不成比例。

### D2：`else` 分支在 await 后按当前索引直接回写 `subject.tags[index]`

```ts
} else {
  await tItem.translateProm
  tagTextEn = tItem.textEn as string
  subject.tags[index] = tagTextEn   // 索引取自当前调用闭包，而非首个注册者
}
```

- 理由：`index` 是 `onTranslate(tagText, index)` 的形参，是**当前调用**中该 tag 在 subject 数组里的真实位置。原实现只在 `if` 分支用首个调用者的 `index` 统一回写所有 subjects，导致后续调用者（及其不同索引）永远不被回写——已用同 origin 用例复现（`/c` 的 `[其他, 审计]` 中 `审计` 未被替换）。
- **实施中修正**：原方案拟保留 `else` 分支的 `tItem.subjects.push(subject)`，实测发现这会引入新的索引错位——`if` 分支的 `forEach` 在其 `await` 完成后才执行，此时 `subjects` 已包含后续 operation，于是首注册者的 `index` 被错误地套用到后续 subject 上。复现：`/a: [审计, 用户]`、`/b: [用户, 审计]` 处理后台，`/b` 变成 `["User","User"]`（审计在索引 1，却被按索引 0 写成 User）。因此 `else` 分支 MUST NOT 再 `push` 到 `subjects`，直接按当前 `index` 回写即可；`subjects` 仅承载"首个注册者"，与 `if` 分支 `forEach` 的语义一致。
- 备选方案（否决）：
  - **保留 `subjects.push` 并把 `subjects` 改为 `{ subject, index }[]`**：能同时表达"多 subject + 各自索引"，但需同步改动 `TagsList` 类型与 `if` 分支 `forEach`，改动面更大；而 `else` 分支已能即时回写，无需延迟批量处理。
  - **在 `else` 分支重复走 `addTranslate`**：会破坏"同 tag 只翻译一次"的去重语义，产生冗余翻译与字典重复条目。

### D3：D1 与 D2 必须同时实施（即"方案 C"）

单独实施 D1：跨 origin 时序与字典问题解决，但同 origin 内共享 tag 的 `item.tags` 回写仍不完整。
单独实施 D2：`item.tags` 回写完整，但跨 origin 时 `t.translate()` 仍会提前 resolve、字典仍为空，`funcGroup()` 仍可能读到中文 tag。

已用实验验证：

| 配置 | 首次运行 buddyV2 结果 |
|------|----------------------|
| 现状 | dict=0，中文模块名 5 个 |
| 仅 D1（临时补丁验证） | dict=5，无中文模块名 |
| 人工注入 50ms 延迟放大竞争 | 三个 origin 全部中文模块名、dict 全为 0 |
| 仅 D2（推演） | 跨 origin 时序不变，仍失败 |

结论：D1 消除跨 origin 状态泄漏，D2 补齐调用内回写语义，二者正交，缺一不可。

### D4：测试策略——doc-pre-data Jest 单测，按"并发"与"同源多 operation"两个维度

新增测试放置于 `packages/doc-pre-data/src/__tests__/`，直接调用 `format()`（默认导出），断言 `docApi.funcGroupList` 的 `moduleName`、`docApi.json.tags` 与返回的 `dictList`：

- **并发多 origin 同名 tag**：构造两个 origin 的文档，含同名中文 tag，`Promise.all` 并发调用 `format()`，断言两者 `moduleName` 均为英文、`dictList` 均含该 tag 映射（复现本次缺陷，修复前必失败）。
- **同 origin 多 operation 共享 tag（索引不同）**：构造 `tags: [审计, 用户]` 与 `tags: [其他, 审计]` 两个 operation，断言两处 `tags` 均被替换且位置正确（锁定 D2，修复前 `/c` 残留中文）。
- **首次运行即正确（端到端语义）**：空 dict 调一次 `format()`，断言模块名无中文、`dictList` 非空，模拟"删除输出目录后首次运行"。

`TranslateType.none` 分支（`translateTagNames` 唯一入口）使用真实翻译引擎会触网，测试需 mock `node-translates` 的引擎函数（或注入可控译名），保证离线稳定。

### D5：导出条目携带 origin 信息，消歧在汇总阶段统一执行

将 `tsFileBuilder.ts:17` 的 `importList: string[]` 改为携带结构化信息的数组，每项至少包含 `{ origin, exportName, fileExPath }`；`builder/index.ts:194` 汇总时先统计每个 `exportName` 的出现次数，仅对出现次数 > 1 的名字追加 origin 前缀。

- **关键修正（实施中发现的缺陷）**：生成语句 MUST 使用 re-export 别名语法 `export { <exportName> as <finalName> } from '<path>'`，而非 `export { <finalName> } from '<path>'`。原因是消歧只改变**对外导出名**，模块文件内部实际导出的成员名并未改变（`buddy/audit.ts` 里仍是 `export const audit = new Audit()`）。直接写 `export { buddyAudit }` 会被 TS 判定为 re-export 一个不存在的成员，产生 `TS2305`/`TS2614`/`TS2724`（实测 19 个）。仅当 `finalName === exportName`（未冲突）时省略 `as`，保持 `export { integralTrend } from '...'` 原样形式。
- 理由：消歧需要"全量视角"——单个 `TsFileBuilder` 只知道自己 origin 的模块，无法判断某个名字是否与其他 origin 冲突。把判断放在汇总阶段（`createFiles`）是唯一能看到全部导出的位置。因此 `TsFileBuilder` 只负责**如实记录**（导出名 + origin + 路径），决策集中在 `createFiles`。
- 前缀规则：`${originName}${PascalCase(exportName)}`，其中 `originName` 取自 `origin.name`；匿名 origin（`name` 为空）回退为 `module`，与 `base.ts:53` 的输出目录回退保持一致。导出名首字母大写以符合标识符惯例（如 `buddy` + `signIn` → `buddySignIn`）。
- 行序确定性：按 `长度 → localeCompare` 二级排序。仅按长度排序会在**等长行**（如 `export { signIn as traeSignIn } from './trae/signIn'` 与 `export { integralTrend } from './trae/integralTrend'` 均为 52 字符）退化为输入顺序，导致两次运行结果不一致；该缺陷由单元测试捕获。
- 确定性：`exportName` 出现次数只依赖输入集合，与 origin 的处理顺序无关；`importList.sort` 只影响行序、不影响前缀分配。因此多次生成结果一致。
- 备选方案（否决）：
  - **在 `TsFileBuilder` 内直接改名**：单 origin 视角无法判断跨 origin 冲突，会误伤非冲突名或漏掉冲突。
  - **用 `checkName` 加数字后缀**：`signIn`、`signIn1`、`signIn2` 无法表达归属，且顺序变化会导致后缀漂移，破坏确定性；origin 前缀可读且稳定。
  - **仅保留首个、其余丢弃并告警**：被丢弃的模块无法通过 barrel 访问，能力缺失。
  - **`export * as buddy from './buddy'`**：无冲突且不依赖名字，但整体改变 barrel 使用方式（`import { buddy }` 后再取 `buddy.signIn`），破坏既有调用，超出本次修复范围。

### D6：仅在冲突时加前缀，保持非冲突导出名的向后兼容

消歧只作用于**跨 origin 出现次数 > 1** 的导出名；出现次数为 1 的名字 MUST 保持原名输出。

- 理由：本次修复的目标是"消除重复导出"，而非统一改名。非冲突名（如 `trae` 的 `integralTrend`）保持原名可避免无谓的调用方改动；只有本就无法通过类型检查的冲突名发生变化，属净收益。
- 冲突判定只看导出名，不看文件路径：`buddy/audit.ts` 与 `buddyV2/audit.ts` 路径不同但导出名相同，仍属冲突。
- 单 origin 内的重名由既有机制（`docApi/index.ts` 的 `checkName`）在更早阶段处理，届时导出名已互不相同，不会触发跨 origin 消歧。

### D7：消歧输入加固（代码审查驱动）

代码审查发现 D5/D6 的原始实现对输入假设过强，补充四项加固：

1. **数字开头的 origin 前缀**：`_.camelCase('123')` 返回 `'123'`（不去前导数字），原实现会生成 `export { audit as 123SignIn }`，触发 `TS1003: Identifier expected`。修正为 `normalizeOriginPrefix` 中对前导数字加下划线（`'123'` → `'_123'`）。
2. **同一模块重复登记去重**：原 `resolveExportNames` 返回 `Map<ExportEntry, string>`，以**对象身份**为 key；同一引用出现两次时后者覆盖前者，生成两行同名导出（`TS2300`）。修正为在 `buildBarrelContent` 入口按 `${exportName}\u0000${fileExPath}` 值语义去重，并把返回值改为与入参下标一一对应的 `string[]`，从类型上消除 `nameMap.get(entry)!` 的非空断言。
3. **非冲突名优先占位**：原实现按 `${exportName}|${fileExPath}` 字母序统一分配，非冲突名可能被冲突消歧名抢占（如未冲突的 `zA` 与 `z`+`a` 消歧后的 `zA` 撞车，导致非冲突的 `zA` 被改为 `zA1`），违反"未冲突导出名保持不变"。修正为**两轮分配**：第一轮为非冲突名占位原名，第二轮才分配冲突名。
4. **模块路径转义**：`fileExPath` 含单引号时（如 `./a'b/signIn`）生成非法字面量。修正为 `escapeModulePath` 转义反斜杠与单引号。

- 理由：`ExportEntry[]` 是内部契约，类型上未禁止上述输入形态；作为纯函数应保证对任意合法类型输入都产出合法 TS，而非依赖调用方恰好不触发。
- 备选方案（否决）：**仅在调用方保证输入合法**——当前调用链恰好不触发，但契约未表达该约束，未来改动会静默回归。

### D8：模块级累加器在每次生成前重置

`fileList`、`importList`、`customInfoList`、`typeStringList` 均为模块级数组，原实现消费后不清空，同一进程内第二次 `build()` 会产出 `buddyAudit1`、`traeIntegralTrend1` 等累积后缀。修正为在 `Doc2Ts.build()` 入口调用 `resetAccumulators()`，统一重置四者。

- 理由：这是 HEAD 上既有缺陷（`fileList` 等原本就是模块级），但本次把 `importList` 改为结构化对象后，"重复引用"会直接放大成重复导出，修复它的成本低于绕过。
- 备选方案（否决）：**改为 `build()` 局部状态**——需要把累加器贯穿 `TsFileBuilder`/`BuildTypeFile` 的构造链，改动面远大于收益；重置方案等价且增量最小。

### D9：生成物自检脚本替代"仅 grep 错误码"的验证

新增 `scripts/checkBarrel.ts`（`npm run check-barrel`），对生成的 `index.ts` 做两项校验：导出名无重复（对应 `TS2300`）、每条导出的 `as` 左侧成员在目标模块中真实存在（对应 `TS2305`/`TS2614`/`TS2724`）。

- 理由：审查过程中曾出现"仅 grep `TS2300` 即宣布通过"而漏掉 19 个 `TS2614`/`TS2724` 的验证盲区。该脚本不依赖使用者自备的基类文件，比 `tsc` 更适合作为生成后的固定自检，且失败时以非零退出码阻断。
- 备选方案（否决）：**直接用 `tsc` 校验**——生成物引用了使用者需自备的 `clientBuddy*.ts` 基类，`tsc` 会产生大量与 barrel 无关的噪声错误（实测 127 个 `TS2339` / 56 个 `TS2307`），无法作为清晰的通过/失败信号。

## Risks / Trade-offs

- [D1 移除跨 origin 去重后，同一中文 tag 在不同 origin 会被重复翻译] → 语义上各 origin 本就有独立字典文件，重复翻译是正确的；且字典缓存使仅首次运行付出代价。可接受。
- [D2 的 `else` 分支直接回写，可能与 `if` 分支的 `forEach` 重复写同一 subject] → 二者写的是同一译名 `tItem.textEn`，幂等，无副作用。
- [`index` 在异步窗口内失效（同一 operation 的 tags 数组被并发改写）] → `translateV3` 的 traverse 阶段同步完成 tag 收集，`onTranslate` 的 `index` 在调用时确定；同 origin 内不存在并发改写同一数组的路径。
- [测试依赖真实翻译引擎导致 CI 触网/不稳定] → D4 明确 mock 翻译引擎，测试全程离线。
- [doc-pre-data 为 workspace 依赖，需重建后 doc2ts 才生效] → tasks 中包含 `pnpm --filter doc-pre-data build` 与 doc2ts 端重新生成验证步骤。
- [既有 Jest 用例可能依赖 `tagsTranslateList` 的跨调用持久行为] → 实施后先跑 `packages/doc-pre-data` 全量 `npm test`，如有依赖则评估该依赖是否为隐性 bug。
- [冲突导出名变化属破坏性变更，调用方需改 import] → 仅 8 个冲突名受影响，且这些名字在修复前因 `TS2300` 本就不可用；非冲突导出名不变，改动面可控。README 无需改（未记录具体导出名清单）。
- [origin 名含连字符（如 `swagger-api`）拼接后产生非法标识符] → 前缀拼接前对 `origin.name` 做标识符清洗（`_.camelCase`），并补充含连字符 origin 名的测试用例。
- [origin 名为空（匿名 origin）导致前缀缺失或非法] → 匿名 origin 回退为 `anonymousOriginName`（与 `Base.getOutputDir` 共用同一常量）；`builder/index.ts` 已保证匿名 origin 至多一个，不会自冲突。
- [前缀后仍可能碰撞（如 origin `buddy` 的 `signIn` 与 origin `buddySignIn` 的 `in`）] → 消歧后再次校验最终名集合的唯一性，若仍冲突则追加数字后缀兜底（沿用 `checkName` 语义）。
- [D7 的两轮分配改变了名字分配顺序] → 仅影响"非冲突名与消歧名撞车"的极端场景；正常场景下非冲突名本就独占原名，结果与单轮一致。已有单测锁定。
- [D8 重置累加器改变了公开导出面] → 移除 `indexFileContent`、`exportList` 两个死代码符号（全仓库无读取方，已 grep 确认），属净清理。
- [`importList` 从 `string[]` 改为结构化数组属内部契约变更] → 该变量仅被 `tsFileBuilder.ts` 与 `builder/index.ts` 使用（已 grep 确认），改动范围封闭。

## Migration Plan

1. 修改 `packages/doc-pre-data/src/format.ts`（D1 + D2 + P3-7 的 `TagsList.subject` 简化），新增单测（D4）。
2. `cd packages/doc-pre-data && npm test`（新增用例全绿；`common/utils.test.ts` 的 2 个 `getMaxSamePath` 失败为 HEAD 既有，与本 change 无关）。
3. `pnpm --filter doc-pre-data build` 重建。
4. 新增 `packages/doc2ts/src/builder/barrelExport.ts`（D5/D6/D7），修改 `tsFileBuilder.ts`（D5、D8）、`builder/index.ts`（D5/D8）、`base.ts`（D7 常量共享）、`generators/fileList.ts`（D8）。
5. 新增 doc2ts 单测（`tests/barrelExport.test.ts`、`tests/accumulators.test.ts`）与自检脚本（D9），更新 `test:unit`/`check-barrel` 脚本；`npx tsc --noEmit` 与 `npm run test:unit` 全绿。
6. 在 `packages/doc2ts` 删除 `src/services` 后执行 `bun dev`，确认首次运行即产出英文文件名、`dicts/buddyV2.json` 的 `dict` 非空；运行 `npm run check-barrel` 确认 barrel 无重复、成员均可解析；再次执行确认幂等。
7. 回滚策略：改动集中在 doc-pre-data 单个源文件、doc2ts 的 builder 相关文件与测试/脚本文件，`git revert` 即可完全回退；重新生成一次即可恢复原产出。
