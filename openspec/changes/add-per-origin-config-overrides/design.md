## Context

当前 `Doc2TsConfig`（`packages/doc2ts/src/types/types.ts:121`）中 `disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender` 四个字段为**全局级**配置，由 `Config` 类（`packages/doc2ts/src/common/config.ts`）在构造时一次性吸收，随后在 `Base.getBaseFileName` / `Base.getClientPath`、`TsFileBuilder.getParamsInfo`、`common.createReturnType` 中通过 `this.config.xxx` 直接读取。这些消费方虽然已经持有 `this.origin`（`Base` 构造函数第二参数），但从未从 origin 上读取这四个参数。

数据流现状：
- `Doc2Ts.initRemoteDataSource`（`builder/index.ts:98`）遍历 `origins`，为每个 origin 构建 `TsFileBuilder(i, this.config, i.origin)` 与 `BuildTypeFile(i, this.config, i.origin)`。
- `Base`（`builder/base.ts:8`）已经保存了 `origin: ModelList | ApifoxConfig`，因此读取 origin 级覆盖值的基础设施已具备，只需补类型与解析逻辑。

约束：
- `Doc2TsConfig.baseClassPath` 当前是**必填**（`baseClassPath: string`），且 `Config` 构造函数用它做必要性校验。改为可被 origin 覆盖后需重新设计校验。
- `ModelList` 与 `ApifoxConfig` 当前都 `extends DefaultFun`，已有共享基类的先例，可在此基础上继续扩展。
- `common.ts` 中的 `createReturnType` 是**自由函数**（非类方法），签名是 `(config, docApi, funcName, groupName, responseType)`，没有 origin 入参，需要调整签名。

## Goals / Non-Goals

**Goals:**
- 在 `origins` 数组的每个数据源上支持 `disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender` 四个可选字段，类型与 `Doc2TsConfig` 对应字段一致。
- 实现「origin 优先、全局回退」的解析规则：origin 显式配置则覆盖全局，未配置则回退 `Doc2TsConfig` 的全局值。
- 让四个消费方（`getBaseFileName`、`getClientPath`、`getParamsInfo` 的 `disableParams`、`createReturnType` 的 `resultTypeRender`）读取解析后的当前 origin 值。
- 保持向后兼容：仅配置全局参数的现有 `doc2ts-config.ts` 行为完全不变。

**Non-Goals:**
- 不为 `Doc2TsConfig` 的其他参数（如 `render`、`typeFileRender`、`generateTypeRender`、`aiConfig` 等）增加 origin 级覆盖——本次仅覆盖用户指定的这四个。
- 不修改 `initConfig` 脚本的交互式问答流程（init 仍只生成全局配置；用户可手动在 origin 上添加覆盖字段）。
- 不调整 `doc-pre-data` 包。
- 不引入运行时配置 schema 校验库（如 zod），仅做必要的显式校验。

## Decisions

### 决定 1：提炼共享接口 `OriginOverride`，让 `ModelList` 与 `ApifoxConfig` 共同继承

在 `types.ts` 中新增接口，集中声明四个覆盖字段，避免在 `ModelList` 和 `ApifoxConfig` 上重复定义：

```ts
export interface OriginOverride {
  /** @description 移除该 origin 下某些入参提示，覆盖全局 disableParams */
  disableParams?: DisableParams[]
  /** @description 该 origin 模块继承的基类名称，覆盖全局 baseClassName */
  baseClassName?: string
  /** @description 该 origin 的基类路径，覆盖全局 baseClassPath */
  baseClassPath?: string
  /** @description 该 origin 的接口返回数据类型钩子，覆盖全局 resultTypeRender */
  resultTypeRender?: Doc2TsConfig['resultTypeRender']
}

export interface ModelList extends DefaultFun, OriginOverride { ... }
export interface ApifoxConfig extends DefaultFun, OriginOverride { ... }
```

**理由：**
- 复用既有 `extends DefaultFun` 的多继承写法，风格一致。
- 字段类型直接引用 `Doc2TsConfig['xxx']`，从类型层面保证「与 Doc2TsConfig 对应参数类型一致」，未来全局类型变更时 origin 字段自动同步。
- `Origin` 别名保持 `= ModelList` 不变；`origins: (Origin | ApifoxConfig)[]` 两个分支都具备覆盖能力。

**备选方案（已否决）：** 把四个字段直接写在 `ModelList` 和 `ApifoxConfig` 各自定义里。否决原因：重复定义、类型易漂移、违反 DRY。

### 决定 2：将 `Doc2TsConfig.baseClassPath` 由必填改为可选，全局参数整体降级为「默认值」

```ts
// 修改前
baseClassPath: string

// 修改后
baseClassPath?: string
```

四个全局参数（`disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender`）统一语义为「默认值」。`Config` 类对应字段的默认值/校验逻辑随之调整：
- `disableParams` 默认 `[]`（已有）。
- `baseClassName` 默认 `'ApiClient'`（已有）。
- `baseClassPath` 默认 `undefined`，不再在构造期强制非空。
- `resultTypeRender` 默认 `undefined`（已有）。

新增 origin 级解析校验（见决定 3）：每个 origin 在使用前必须能解析出一个有效的 `baseClassPath`（origin 自身或全局任一非空），否则抛错。

**理由：**
- 用户需求明确要求「修改 Doc2TsConfig 下这四个参数的功能以适配 origins」。`baseClassPath` 若仍强制全局必填，则「全部 origin 各自配置 baseClassPath」的场景无法成立，违背初衷。
- 其余三个参数本来就是可选，语义从「唯一值」松绑为「默认值」不引入破坏性变更。

**备选方案（已否决）：** 保持 `baseClassPath` 全局必填，仅允许 origin 覆盖但不可省略全局。否决原因：无法满足「每个 origin 用不同基类路径且不写全局」的真实诉求。

### 决定 3：在 `Base` 上提供统一的「origin 优先」解析访问器

在 `Base`（`builder/base.ts`）上新增受保护访问器，集中封装「origin 优先、全局回退」逻辑，供 `TsFileBuilder` / `BuildTypeFile` 复用：

```ts
protected get effDisableParams(): DisableParams[] {
  return this.origin.disableParams ?? this.config.disableParams
}
protected get effBaseClassName(): string {
  return this.origin.baseClassName ?? this.config.baseClassName
}
protected get effBaseClassPath(): string {
  const p = this.origin.baseClassPath ?? this.config.baseClassPath
  if (!p) throw new Error(`无法解析 baseClassPath：origin "${this.origin.name ?? ''}" 未配置且全局未提供`)
  return p
}
protected get effResultTypeRender(): Doc2TsConfig['resultTypeRender'] {
  return this.origin.resultTypeRender ?? this.config.resultTypeRender
}
```

消费方改造：
- `getBaseFileName`（`base.ts:10`）读取 `this.effBaseClassName`。
- `getClientPath`（`base.ts:21`）读取 `this.effBaseClassPath`。
- `TsFileBuilder.getParamsInfo`（`tsFileBuilder.ts:30`）读取 `this.effDisableParams`。
- `common.createReturnType`（`common.ts:167`）改为接收 `render` 值而非整个 `config`，由调用方 `TsFileBuilder.generatorApiMethod` 传入 `this.effResultTypeRender`。

**理由：**
- 集中解析逻辑，避免在多处散落 `origin.xxx ?? config.xxx` 三元表达式，便于测试与维护。
- 复用 `Base` 已有的 `this.origin` 字段，无需改动 `Doc2Ts.initRemoteDataSource` 的调用结构。
- `createReturnType` 改为接收已解析的标量值，使其保持纯函数特性，不再需要感知 origin 概念。

**备选方案（已否决）：** 在 `Config` 类上维护「当前 origin」状态字段，每次切换 origin 时刷新内部缓存。否决原因：引入隐式可变状态，并发处理多 origin 时易出错，且 `Config` 职责膨胀。

### 决定 4：`createReturnType` 签名调整

```ts
// 修改前
export function createReturnType(
  config: Config,
  docApi: DocApi,
  funcName: string,
  groupName?: string,
  responseType?: TypeInfoBase
)

// 修改后：用 resultTypeRender 与 languageType 两个已解析值替代 config
export function createReturnType(
  resultTypeRender: Config['resultTypeRender'],
  languageType: Config['languageType'],
  docApi: DocApi,
  funcName: string,
  groupName?: string,
  responseType?: TypeInfoBase
)
```

调用方 `TsFileBuilder.generatorApiMethod`（`tsFileBuilder.ts:148`）改为：
```ts
const returnType = createReturnType(
  this.effResultTypeRender,
  this.config.languageType,
  docApi,
  name,
  groupName,
  responseType?.getRealBody()
)
```

**理由：** `createReturnType` 只用到 `config.resultTypeRender` 与 `config.languageType` 两个字段。把 `resultTypeRender` 改为显式入参后，函数不再依赖 `Config` 的具体形状，origin 覆盖值由调用方负责解析，职责清晰。

## Risks / Trade-offs

- **[Risk]** `Doc2TsConfig.baseClassPath` 从必填改为可选，可能让既有用户误以为「不填也能跑」。
  - **[Mitigation]** `Config` 构造期对每个 origin 执行 `effBaseClassPath` 解析校验，任一 origin 无法解析出非空 `baseClassPath` 时抛出明确错误。错误信息同时提示「为该 origin 配置 baseClassPath 或在全局配置 baseClassPath」。

- **[Risk]** `ModelList` / `ApifoxConfig` 多继承 `OriginOverride` 后，既有用户若在 origin 上误写了同名字段（例如历史遗留的 `baseClassPath` 字符串），行为会从「被忽略」变为「生效」，可能改变生成结果。
  - **[Mitigation]** 该字段此前在 origin 类型上不存在，TS 会报错拦截；运行时层面这种「误写」本就不可能生效，因此无实际风险。在 CHANGELOG 中说明语义增强即可。

- **[Risk]** `createReturnType` 签名变更属于内部 API 调整，若有外部代码直接调用该导出函数会破坏。
  - **[Mitigation]** 该函数虽 `export`，但属于 `builder/common.ts` 内部工具，未在 `packages/doc2ts/src/index.ts` 公共入口导出，外部不应依赖。仍会在 CHANGELOG 注明。

- **[Trade-off]** 未引入配置 schema 校验库，校验逻辑用显式 `if` 实现。
  - **[Acceptance]** 当前只需校验 `baseClassPath` 非空一项，引入 zod 等库属于过度工程。

## Migration Plan

1. 升级 `doc2ts` 到含本次变更的版本。
2. 现有 `doc2ts-config.ts` 无需任何修改——全局 `baseClassPath` 仍可填写，行为不变。
3. 需要按数据源差异化的用户，在 `origins` 数组对应条目下新增 `disableParams` / `baseClassName` / `baseClassPath` / `resultTypeRender` 字段即可。
4. 若希望完全移除全局 `baseClassPath`，需确保**每个 origin** 都各自配置了 `baseClassPath`，否则启动会报清晰错误。
5. 回滚策略：还原 `packages/doc2ts/src` 下五个文件（`types/types.ts`、`common/config.ts`、`builder/base.ts`、`builder/tsFileBuilder.ts`、`builder/common.ts`）即可，类型扩展是纯增量、向下兼容。

## Open Questions

无——四字段类型、优先级规则、向后兼容策略均已明确。
