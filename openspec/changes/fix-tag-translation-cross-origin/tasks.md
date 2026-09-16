## 1. 翻译状态隔离（doc-pre-data）

- [x] 1.1 移除 `packages/doc-pre-data/src/format.ts` 中模块级的 `tagsTranslateList`，改为在 `translateV3` 函数体内声明调用级 `const tagsTranslateList: TagsList[] = []`，验证 `translateV3` 两次连续调用互不共享状态（在测试中以空 dict 连续调用两次，断言第二次不依赖第一次的 `tItem`）
- [x] 1.2 扩展 `TagNamesOp` 类型（format.ts:26）与 `translateTagNames` 的入参解构，新增 `tagsTranslateList` 字段，并更新两处 `translateTagNames({...})` 调用点（`TranslateType.none` 分支与常规分支）传入该局部变量，验证 TypeScript 编译通过（`tsc --noEmit`）

## 2. 命中条目的回写补齐（doc-pre-data）

- [x] 2.1 修改 `translateTagNames` 的 `else` 分支：在 `await tItem.translateProm` 之后按当前调用的 `index` 回写 `subject.tags[index] = tagTextEn`，验证同 origin 内 `tags: [审计, 用户]` 与 `tags: [其他, 审计]` 两个 operation 的 tags 均被替换且索引位置正确（无中文残留）
- [x] 2.2 移除 `else` 分支的 `tItem.subjects.push(subject)`（实施中发现保留它会因 `if` 分支 `forEach` 延迟执行而导致索引错位，实测 `/b: [用户, 审计]` 被写成 `["User","User"]`），保留 `if` 分支 `forEach` 回写逻辑不变，验证首注册者回写未回归且多 operation 混合索引场景正确

## 3. 单元测试（doc-pre-data）

- [x] 3.1 在 `packages/doc-pre-data/src/__tests__/` 新增并发多 origin 测试：构造两个含同名中文 tag 的文档，`Promise.all` 并发调用 `format()`，断言两者 `moduleName` 均为英文且 `dictList` 均含该 tag 映射；已用 `git stash` 回退源码验证该用例在修复前失败（6/6 全红）、修复后通过
- [x] 3.2 新增同 origin 多 operation 共享 tag（索引不同）测试，断言两处 `item.tags` 均被替换且位置正确，覆盖 D2 缺陷（含 `/b: [用户, 审计]` 索引错位回归用例）
- [x] 3.3 新增首次运行端到端语义测试：空 dict 调用一次 `format()`，断言 `funcGroupList` 的 `moduleName` 无中文、`dictList` 非空
- [x] 3.4 在测试文件顶部 `jest.mock('node-translates')`，注入 `iflyrecTranslator`/`bingTranslator`/`baiduTranslator` 三个可控译名引擎，验证测试全程离线且重复运行结果一致
- [x] 3.5 运行 `cd packages/doc-pre-data && npm test`：新增 6 个用例全部通过；`common/utils.test.ts` 中 2 个 `getMaxSamePath` 用例失败，经 `git stash` 回退验证为 HEAD 上既有失败，与本次改动无关

## 4. 生成物验证（doc2ts）

- [x] 4.1 在 workspace 根执行 `pnpm --filter doc-pre-data build` 重建依赖包，验证 `packages/doc-pre-data/lib/format.js` 已更新（`tagsTranslateList` 已出现在 `translateV3` 函数体内，行 117）
- [x] 4.2 删除 `packages/doc2ts/src/services` 后在 `packages/doc2ts` 执行 `bun dev`，验证首次运行即产出英文文件名：`buddyV2/` 下为 `accountSelection.ts`、`apiKeys.ts`、`audit.ts`、`signIn.ts`、`statistics.ts`、`userManagement.ts`，`find . -name "*[一-龥]*"` 无任何中文文件名
- [x] 4.3 检查 `packages/doc2ts/src/services/dicts/buddyV2.json`，验证 `dict` 数组含 5 条 `zh → en` 映射（账号选择→AccountSelection、审计→Audit、签到→SignIn、统计→Statistics、用户管理→UserManagement），不再为空

## 5. 跨 origin 导出名消歧（doc2ts）

- [x] 5.1 将 `packages/doc2ts/src/builder/tsFileBuilder.ts` 的 `importList: string[]` 改为结构化导出条目数组（含 `exportName`、`originName`、`fileExPath`），`TsFileBuilder.build()` 内按新结构 push；验证 `tsc --noEmit` 通过（exit 0）且 `grep -rn "importList" src/` 确认改动范围仅 `tsFileBuilder.ts` 与 `builder/index.ts`
- [x] 5.2 在 `packages/doc2ts/src/builder/index.ts` 的 `createFiles()` 中实现消歧（逻辑抽取到新文件 `src/builder/barrelExport.ts` 的 `buildBarrelContent`）：统计各 `exportName` 出现次数，仅对出现次数 > 1 的名字拼接 origin 前缀，非冲突名保持原名；验证当前配置下 8 个冲突名全部被加前缀，非冲突名（`integralTrend`、`clientProfile`、`system` 等）保持不变
- [x] 5.2.1 **修正 re-export 语法（实施中发现并修复的缺陷）**：生成语句由 `export { <finalName> } from '<path>'` 改为 `export { <exportName> as <finalName> } from '<path>'`，仅未冲突时省略 `as`。原因：消歧只改对外导出名，模块文件内部成员名未变（`buddy/audit.ts` 仍是 `export const audit`），原写法导致 19 个 `TS2614`/`TS2724`（re-export 了不存在的成员）。验证：对生成物逐条解析 `as` 左侧成员名并确认在目标模块中存在，19 个错误降为 0
- [x] 5.2.2 **修正行序确定性**：`buildBarrelContent` 的排序由仅按长度改为 `长度 → localeCompare` 二级排序。原因：等长行（`export { signIn as traeSignIn } from './trae/signIn'` 与 `export { integralTrend } from './trae/integralTrend'` 均 52 字符）会退化为输入顺序，破坏幂等。该缺陷由单元测试"相同输入多次调用结果一致"捕获；验证：反转输入顺序后输出仍逐字节一致
- [x] 5.3 处理 origin 名前缀的合法性：`normalizeOriginPrefix` 用 `_.camelCase` 清洗含连字符等非标识符字符的 `origin.name`（`swagger-api` → `swaggerApi`），匿名 origin（`name` 为空）回退为 `module`；验证含连字符与匿名 origin 的用例不产生非法标识符
- [x] 5.4 消歧后做最终名唯一性兜底校验（`uniqueName`，语义同 `checkName` 的数字后缀），若仍碰撞则追加数字后缀；验证"`buddy`+`signIn` 与 `buddySign`+`in` 均得 `buddySignIn`"的用例输出 `buddySignIn` 与 `buddySignIn1`
- [x] 5.5 在 `packages/doc2ts/tests/barrelExport.test.ts` 新增消歧单元测试（`node:test`）：覆盖两 origin 同名、三 origin 同名、非冲突名保持不变、含连字符 origin 名、匿名 origin、数字后缀兜底、确定性、导出路径正确、**re-export 使用 `as` 别名且保留原成员名**、**非冲突名不使用 `as`**、**消歧名可由原模块成员取得** 共 15 个用例；已加入 `package.json` 的 `test:unit`/`test:unit:watch` 脚本，验证 `npm run test:unit` 28/28 全部通过

## 6. 消歧端到端验证（doc2ts）

- [x] 6.1 删除 `packages/doc2ts/src/services` 后执行 `bun dev`，验证生成的 `src/services/index.ts` 中 `grep -oE "export \{ [A-Za-z0-9_$]+ \}" | sort | uniq -d` 输出为空（无重复导出标识符）
- [x] 6.2 对生成的 `src/services/index.ts` 执行类型检查（临时 `tsconfig.barrel-check.json`，`include` 仅 `src/services/index.ts`，验证后已删除）：`index.ts` 自身错误数为 **0**（既无 `TS2300` 重复标识符，也无 `TS2305`/`TS2614`/`TS2724` re-export 不存在成员）。其余 127 个 `TS2339` / 56 个 `TS2307` 均位于各 origin 的模块文件内，源于使用者需自备的 `clientBuddy*.ts` 基类文件缺失与 `doc2ts` 包未构建，属既有状况、与消歧无关
- [x] 6.2.1 逐条校验导出可解析到真实成员：解析生成物每条 `export { <orig> as <alias> } from '<path>'`，确认 `<orig>` 在目标模块文件中存在 `export const <orig>` 声明，结果"所有导出成员均存在于对应模块 ✓"
- [x] 6.3 验证消歧未影响模块文件名与来源路径：`buddy/audit.ts`、`buddyV2/audit.ts`、`buddy/signIn.ts`、`buddyV2/signIn.ts`、`trae/signIn.ts` 文件名均保持原样；`index.ts` 中 `audit as buddyAudit`→`./buddy/audit`、`audit as buddyV2Audit`→`./buddyV2/audit`、`signIn as traeSignIn`→`./trae/signIn` 等导出指向正确 origin 目录
- [x] 6.4 再次执行 `bun dev`，验证第二次运行与首次逐字节一致（`index.ts` 与 `dicts/` 均 IDENTICAL），且仍无重复导出标识符

## 7. 代码审查修复（P1/P2/P3）

- [x] 7.1 **P1-1 数字开头 origin 前缀**：`normalizeOriginPrefix` 对前导数字加下划线（`_.camelCase` 不去前导数字，`'123'` → `'_123'`）；验证 `'123'`/`'2fa'`/`'9x'` 均产出合法标识符，生成物不再触发 `TS1003`
- [x] 7.2 **P1-2 重复引用去重**：`buildBarrelContent` 入口按 `${exportName}\u0000${fileExPath}` 值语义去重，`resolveExportNames` 返回值由 `Map<ExportEntry, string>` 改为与入参下标一一对应的 `string[]`（消除 `nameMap.get(entry)!` 非空断言）；验证同一 `ExportEntry` 引用重复时只生成一条导出
- [x] 7.3 **P2-3 非冲突名优先占位**：改为两轮分配——第一轮为未冲突名占位原名，第二轮才分配冲突名；验证未冲突的 `zA` 在 `z`+`a` 消歧为 `zA` 的场景下仍保持 `zA`（原实现会将其改为 `zA1`）
- [x] 7.4 **P2-4 累加器生命周期**：新增 `resetFileList`（`generators/fileList.ts`）与 `resetImportList`（`tsFileBuilder.ts`），在 `Doc2Ts.build()` 入口调用 `resetAccumulators()` 统一重置 `fileList`/`importList`/`customInfoList`/`typeStringList`；验证同一进程内连续两次 build 产出逐字节一致，不再出现 `buddyAudit1` 累积后缀
- [x] 7.5 **P2-5 模块路径转义**：新增 `escapeModulePath` 转义反斜杠与单引号；验证 `./a'b/signIn` 生成 `from './a\'b/signIn'`
- [x] 7.6 **P3-7 `TagsList.subjects` 简化**：`else` 分支不再 `push` 后 `subjects` 恒为单元素，简化为 `subject: { tags: string[] }` 单值，`if` 分支的 `forEach` 改为直接赋值；验证 doc-pre-data `tsc` 通过且 6 个 tag 翻译用例全绿
- [x] 7.7 **P3-9 常量共享**：`Base.getOutputDir` 复用 `barrelExport.anonymousOriginName` 替代硬编码 `'module'`；验证 `tsc` 通过（注：两个调用方实际传 `''` 而非 nullish，`??` 回退当前不可达，属预防性去重）
- [x] 7.8 **死代码清理**：移除全仓库无读取方的 `indexFileContent` 与 `exportList`（`grep` 确认仅声明/写入、从无读取）；验证 `tsc` 通过、生成物不变
- [x] 7.9 **D9 生成物自检脚本**：新增 `scripts/checkBarrel.ts` 与 `check-barrel` npm script，校验 barrel 无重复导出 + 每条导出成员可解析；注入 4 类缺陷（重复名、`as` 左侧成员不存在、模块文件缺失、无法解析行）验证可全部捕获并以非零退出码失败，正常生成物输出"28 条导出，无重复、成员均可解析"
- [x] 7.10 **补充回归测试**：`tests/barrelExport.test.ts` 增至 17 个用例（新增数字开头 origin、重复引用、重复引用不影响消歧判定、非冲突名不被抢占、路径转义）；新增 `tests/accumulators.test.ts` 3 个用例；`npm run test:unit` 37/37 通过

## 8. 审查修复后的端到端复验

- [x] 8.1 删除 `src/services` 后 `bun dev`，`npm run check-barrel` 通过（28 条导出无重复、成员均可解析）
- [x] 8.2 逐条校验导出成员存在性，结果"所有导出成员均存在 ✓"
- [x] 8.3 再次 `bun dev` 验证幂等：`index.ts` 与首次逐字节一致
- [x] 8.4 全量校验：`packages/doc2ts` `npx tsc --noEmit` exit 0、`npm run test:unit` 37/37；`packages/doc-pre-data` `npx tsc --noEmit` exit 0、`npm test` 36/38（2 个 `getMaxSamePath` 失败为 HEAD 既有）
