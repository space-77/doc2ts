## 1. 收集阶段 — 在 `formatFunsV2` 中实现两段式架构

- [x] 1.1 **添加全局收集逻辑**：在 `formatFunsV2` 的 `if (this.aiFunctionNamer)` 分支中，在遍历模块之前先建立一个 `allFuncNameInfos: FuncNameInfo[]` 数组和一个 `moduleFuncMap: Map<string, FuncNameInfo[]>`。
  - 遍历 `moduleList` 时，将每个模块的 `funcNameInfos` 推入 `allFuncNameInfos`，并在 `moduleFuncMap` 中记录映射。
  - 保留每个模块中调用 `setModuleName` 的逻辑以加载缓存。
- [x] 1.2 **统一调用 AI 优化**：在遍历完所有模块后，调用一次 `this.aiFunctionNamer.optimizeFuncNames(allFuncNameInfos)` 获取全局优化结果。
- [x] 1.3 **分发优化结果**：再次遍历 `moduleList`，每模块从全局 `optimizedNames` 中取出对应的优化结果，沿用现有的 `createFunName` fallback、去重、`creatFunItem` 等逻辑。

## 2. AI 分批 — 在 `aiFunctionNamer.optimizeFuncNames` 中添加分批逻辑

- [x] 2.1 **添加 BATCH_SIZE 常量**：在 `aiFunctionNamer.ts` 中定义 `BATCH_SIZE = 20`。
- [x] 2.2 **分批处理 uncachedFuncs**：在 `optimizeFuncNames` 方法中，对 `uncachedFuncs` 数组按 `BATCH_SIZE` 分组，串行调用 `callAIForFuncNames(batch)`。
  - 每批结果的去重逻辑与现有代码一致（使用 `usedNames` + 方法名后缀）。
  - 如果某批次失败（`callAIForFuncNames` 抛异常），catch 后对该批执行原始名称生成 fallback，不影响已成功的批次。

## 3. 兼容分批的 AI 响应解析

- [x] 3.1 **修改 systemPrompt 和 userPrompt 中的 JSON key 格式**：将 AI 返回的 JSON key 格式从 `"序号_方法标识"` 改为直接使用 `cacheKey`（例如 `"getUser"` → `"post_/api/user/list"`）。
  - 修改 `callAIForFuncNames` 中的 systemPrompt 输出格式说明。
  - 修改 userPrompt，将 `"方法标识: ${func.cacheKey}"` 作为唯一标识。
  - 修改解析逻辑，直接以 `cacheKey` 为 key 从 AI 返回的 JSON 中取值。

## 4. 验证与编译

- [x] 4.1 **编译验证**：在 `packages/doc-pre-data` 目录执行 `npm run build`，确认无类型错误。
- [x] 4.2 **生成测试**：在根目录执行 `node ./bin/doc2api.js start`，确认生成结果与优化前一致（方法名、模块结构不变）。
- [x] 4.3 **性能验证**：对比优化前后启用 AI 优化时的总生成耗时，确认多模块场景下 AI API 调用次数显著减少。
