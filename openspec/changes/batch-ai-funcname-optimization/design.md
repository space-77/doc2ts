## Context

在 `packages/doc-pre-data/src/docApi/index.ts` 的 `formatFunsV2` 方法（第 210 行）中，当启用了 AI 方法名优化时（`this.aiFunctionNamer` 存在），当前流程为：

```
for (const moduleItem of moduleList) {
  // 1. 收集当前模块的方法信息
  const funcNameInfos = funs.map(...)

  // 2. 调用 AI 优化——这就是问题：每个模块一次 AI API 调用
  const optimizedNames = await this.aiFunctionNamer.optimizeFuncNames(funcNameInfos)

  // 3. 用优化结果生成该模块的 pathItems
  ...
}
```

并发起 AI API 调用的数量 = 模块数量。典型项目可能有 20-50+ 个模块，导致大量串行网络开销。

## Goals / Non-Goals

**Goals:**
- 将 N 次 AI API 调用降低为 `ceil(totalFuncs / batchSize)` 次
- 保持 AI 优化结果的跨模块去重能力（同一批次内自动去重）
- 不改变 `aiFunctionNamer` 对外的 `optimizeFuncNames` 接口签名
- 保证缓存机制正常工作（已缓存的 func 不再重复调用 AI）

**Non-Goals:**
- 不修改 AI 模型的 systemPrompt 或命名策略
- 不修改 `AIConfig` 配置结构
- 不涉及 CLI 级别的改动

## Decisions

### 决定 1：全局收集 + 一次调用分发架构

将 `formatFunsV2` 拆为两段式：

**第一阶段（全局收集）：**
```
// Phase 1: 收集全部模块的方法信息
const allFuncNameInfos: FuncNameInfo[] = []
const moduleFuncMap = new Map<string, FuncNameInfo[]>() // moduleName → funcNameInfos

for (const moduleItem of moduleList) {
  const { funs, moduleName } = moduleItem
  this.aiFunctionNamer.setModuleName(moduleName)

  const funcNameInfos = funs.map(funInfo => {
    const { item, method, apiPath } = funInfo
    const { operationId, summary, description } = item
    const cacheKey = operationId || `${method}_${apiPath}`
    return { apiPath, method, operationId, summary, description, cacheKey }
  })

  allFuncNameInfos.push(...funcNameInfos)
  moduleFuncMap.set(moduleName, funcNameInfos)
}
```

**第二阶段（统一调用 + 分发）：**
```
// Phase 2: 统一调用 AI 优化
const optimizedNames = await this.aiFunctionNamer.optimizeFuncNames(allFuncNameInfos)

// Phase 3: 各模块使用优化结果生成 pathItems
for (const moduleItem of moduleList) {
  // 与现有代码相同，但 optimizedNames 已是全局结果
  ...
}
```

**理由：**
- 数据已在 `aiFunctionNamer` 内部完成缓存过滤、批量拆分和去重
- 对外接口不变，仅改变调用时机
- 实现简单，改动量小

### 决定 2：在 `aiFunctionNamer.optimizeFuncNames` 内部添加自动分批

当前 `callAIForFuncNames` 是一次性将所有 func 发给 AI。需增加自动分批逻辑。

在 `optimizeFuncNames` 方法中，对 `uncachedFuncs` 按 `BATCH_SIZE` 分组：

```
const BATCH_SIZE = 20  // 可根据 token 估算动态调整

const batches = []
for (let i = 0; i < uncachedFuncs.length; i += BATCH_SIZE) {
  batches.push(uncachedFuncs.slice(i, i + BATCH_SIZE))
}

// 串行执行各批次
for (const batch of batches) {
  const aiResults = await this.callAIForFuncNames(batch)
  // 处理结果...
}
```

**理由：**
- 避免单次请求 token 超限
- 每批 20 个左右，AI 模型容易保持命名一致性
- 失败隔离——单批次失败不影响其他批次

### 决定 3：`callAIForFuncNames` 返回结果时只使用 `cacheKey` 作为 key

当前调用方使用 `"序号_方法标识"` 格式来解析 AI 返回。但由于现在是分批调用，序号必然是每批从 1 开始。为了兼容分批场景，需要修改为 AI 直接返回 `cacheKey` 作为 JSON key。

修改 systemPrompt 和 userPrompt 中的 JSON key 格式，从 `"1_getUser"` 改为直接使用 `cacheKey`，例如 `"getUser_api/user/list"`。

**理由：** 避免分批时序号错乱的问题。

## Risks / Trade-offs

- **[Risk]** 一批中某个 func 的 AI 结果失败，需要 fallback 到原始名称生成逻辑。
  - **[Mitigation]** 现有代码已在 `callAIForFuncNames` 中有 fallback 逻辑（第 297 行），分批后对每批分别处理即可。

- **[Risk]** 跨模块依赖 `setModuleName` 切换缓存上下文——当前代码为每个模块设置了 `setModuleName` 来加载对应缓存。但在两段式架构中，收集阶段切换模块是为了加载缓存，而第二阶段不再需要切换。
  - **[Mitigation]** 在 Phase 1 中遍历模块时仍调用 `setModuleName` 来加载缓存。Phase 2 的 `optimizeFuncNames` 内部已经持有了所有模块的缓存（通过 Phase 1 的切换加载），不需要额外处理。

- **[Risk]** 分批后每批的 AI 响应需要正确映射回原始 func。
  - **[Mitigation]** 使用 `cacheKey`（`operationId || `${method}_${apiPath}``）作为唯一标识，无论在收集时还是返回结果时都以此为准。
