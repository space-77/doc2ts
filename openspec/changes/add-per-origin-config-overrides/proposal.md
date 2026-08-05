## Why

当前 `Doc2TsConfig` 中 `disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender` 这四个参数是**全局级**配置，作用在 `origins` 数组里的所有数据源上。但实际项目中不同的 origin（接口文档）往往来自不同团队、不同网关，有不同的鉴权 token 字段（需要 disable 的入参不同）、不同的基类实现与路径、不同的返回数据包装结构。当前只能为所有 origin 共用一套配置，无法按数据源差异化定制，导致多数据源场景下必须妥协或写多个 doc2ts 配置文件分别执行。

## What Changes

- 在 `Origin`（即 `ModelList`）与 `ApifoxConfig` 类型上**新增** `disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender` 四个可选字段，类型与 `Doc2TsConfig` 中对应字段保持一致。
- **修改** `Doc2TsConfig` 下这四个参数的功能语义：从「全局唯一生效」改为「全局默认值」——当某个 origin 自身配置了对应字段时，**以 origin 中的值为准（origins 优先级更高）**；origin 未配置时回退到 `Doc2TsConfig` 中的全局值。
- 修改 `Config` 类与 `Base` / `TsFileBuilder` / `common.ts` 等消费方，使其在生成每个 origin 的代码时读取**当前 origin 的覆盖值**而非全局静态值。
- 保持向后兼容：现有只配置全局参数、不在 origins 中覆盖的用户行为完全不变。

## Capabilities

### New Capabilities
- `per-origin-config-overrides`: 支持在 `origins` 数组的每个数据源上单独配置 `disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender`，并按 origin 优先、全局回退的规则生效。

### Modified Capabilities
<!-- 现有 openspec/specs 下无与这四个配置参数相关的 capability，本次为新增能力，无需修改既有 spec。 -->

## Impact

**受影响的代码:**
- `packages/doc2ts/src/types/types.ts` — `ModelList`、`ApifoxConfig` 类型扩展，提炼共享配置字段
- `packages/doc2ts/src/common/config.ts` — `Config` 类需暴露按 origin 解析后的覆盖值（或提供查询方法）
- `packages/doc2ts/src/builder/base.ts` — `getBaseFileName`、`getClientPath` 改为读取当前 origin 的 `baseClassName` / `baseClassPath`
- `packages/doc2ts/src/builder/tsFileBuilder.ts` — `getParamsInfo` 中 `disableParams` 改为读取当前 origin
- `packages/doc2ts/src/builder/common.ts` — `createReturnType` 中 `resultTypeRender` 改为读取当前 origin
- `packages/doc2ts/src/builder/index.ts` — `Doc2Ts` 在创建每个 `TsFileBuilder` / `BuildTypeFile` 时已传入 `origin`，无需结构调整，仅依赖上述读取逻辑变更

**受影响的用户:**
- 单数据源用户：行为完全不变（origin 未配置时回退全局值）
- 多数据源用户：可在每个 origin 上独立定制这四个参数，不再需要拆分多个配置文件

**依赖变化:**
- 无新增外部依赖
- 类型扩展向下兼容，不破坏现有 `doc2ts-config.ts` 配置文件
