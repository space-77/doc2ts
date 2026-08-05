## ADDED Requirements

### Requirement: origins 数据源支持四个覆盖字段
系统 SHALL 在 `origins` 数组的每个数据源（`ModelList` 与 `ApifoxConfig`）上接受 `disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender` 四个可选字段，且字段类型 MUST 与 `Doc2TsConfig` 上对应字段类型完全一致。

#### Scenario: ModelList 上的覆盖字段类型与全局一致
- **WHEN** 检查 `ModelList` 类型上 `disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender` 四个字段的类型定义
- **THEN** 每个字段的类型 MUST 与 `Doc2TsConfig` 上同名字段类型一致（`disableParams?: DisableParams[]`、`baseClassName?: string`、`baseClassPath?: string`、`resultTypeRender?: string | ((funcName: string, typeInfo?: TypeInfoBase) => string)`）

#### Scenario: ApifoxConfig 上的覆盖字段类型与全局一致
- **WHEN** 检查 `ApifoxConfig` 类型上同样四个字段的类型定义
- **THEN** 每个字段的类型 MUST 与 `Doc2TsConfig` 上同名字段类型一致

#### Scenario: 两个字段共享同一份类型声明
- **WHEN** `Doc2TsConfig` 上某个全局字段类型发生变更
- **THEN** `ModelList` 与 `ApifoxConfig` 上对应覆盖字段类型 MUST 自动同步（通过共享接口 `OriginOverride` 引用 `Doc2TsConfig['xxx']` 实现），无需重复维护

---

### Requirement: origin 级配置优先于全局配置
系统 SHALL 在为某个 origin 生成代码时，对 `disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender` 四个参数遵循「origin 优先、全局回退」规则：当 origin 自身显式配置了该字段时 MUST 使用 origin 的值；origin 未配置时 MUST 回退到 `Doc2TsConfig` 的全局值。

#### Scenario: origin 配置了 baseClassName 覆盖全局
- **WHEN** 某个 origin 配置了 `baseClassName: 'CustomClient'`，且全局 `Doc2TsConfig.baseClassName` 为 `'ApiClient'`
- **THEN** 该 origin 生成的模块类 MUST `extends CustomClient`

#### Scenario: origin 未配置 baseClassName 回退全局
- **WHEN** 某个 origin 未配置 `baseClassName`，且全局 `Doc2TsConfig.baseClassName` 为 `'ApiClient'`
- **THEN** 该 origin 生成的模块类 MUST `extends ApiClient`

#### Scenario: origin 配置了 baseClassPath 覆盖全局
- **WHEN** 某个 origin 配置了 `baseClassPath: './clients/CustomClient'`，且全局 `baseClassPath` 为 `'./clients/ApiClient'`
- **THEN** 该 origin 生成的 API 文件中 import 基类的相对路径 MUST 基于 `'./clients/CustomClient'` 计算

#### Scenario: origin 配置了 disableParams 覆盖全局
- **WHEN** 某个 origin 配置了 `disableParams: [{ paramType: 'header', keys: ['X-Token'] }]`，且全局 `disableParams` 为空数组
- **THEN** 该 origin 的接口方法生成时 MUST 过滤掉名为 `X-Token` 的 header 入参；其它 origin 若未配置则不受此过滤影响

#### Scenario: origin 配置了 resultTypeRender 覆盖全局
- **WHEN** 某个 origin 配置了 `resultTypeRender` 为函数 `fn`，且全局 `resultTypeRender` 为字符串模板 `tpl`
- **THEN** 该 origin 的接口返回类型 MUST 由 `fn(funcName, typeInfo)` 的返回值生成；其它 origin 若未配置则继续使用全局 `tpl`

#### Scenario: 多 origin 混合配置互不干扰
- **WHEN** `origins` 含两个数据源 A 和 B，A 配置了 `baseClassName: 'ClientA'`，B 未配置且全局 `baseClassName` 为 `'ApiClient'`
- **THEN** A 生成的模块类 MUST `extends ClientA`，B 生成的模块类 MUST `extends ApiClient`，两者互不影响

---

### Requirement: 全局参数降级为默认值
系统 SHALL 将 `Doc2TsConfig` 上的 `disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender` 视为「默认值」，对未在 origin 上覆盖该字段的任一数据源生效。

#### Scenario: 全局 baseClassPath 改为可选
- **WHEN** `Doc2TsConfig` 类型定义被检查
- **THEN** `baseClassPath` MUST 标记为可选（`baseClassPath?: string`），与其它三个全局参数的可选性一致

#### Scenario: 全部 origin 都覆盖 baseClassPath 时全局可省略
- **WHEN** `origins` 中每个数据源都配置了自身的 `baseClassPath`，且全局 `Doc2TsConfig.baseClassPath` 未配置
- **THEN** 系统 MUST 正常完成代码生成，每个 origin 使用各自的 `baseClassPath`

#### Scenario: origin 与全局都未提供 baseClassPath 时报错
- **WHEN** 至少一个 origin 未配置 `baseClassPath`，且全局 `Doc2TsConfig.baseClassPath` 也未配置
- **THEN** 系统 MUST 抛出明确的错误，错误信息 MUST 指出是哪个 origin 缺少 `baseClassPath` 并提示在 origin 或全局配置中补充

#### Scenario: 全局 disableParams 作为默认值
- **WHEN** 全局配置了 `disableParams: [{ paramType: 'cookie', keys: ['*'] }]`，某 origin 未配置 `disableParams`
- **THEN** 该 origin 生成时 MUST 应用全局 `disableParams` 进行入参过滤

---

### Requirement: 向后兼容
系统 SHALL 保证仅使用全局配置（不在 origins 上设置这四个覆盖字段）的现有 `doc2ts-config.ts` 配置生成的代码与升级前完全一致。

#### Scenario: 现有配置无 origin 覆盖时行为不变
- **WHEN** 一个配置仅在全局设置了 `disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender`，且 `origins` 中无任何覆盖字段
- **THEN** 生成的代码 MUST 与升级前版本生成的代码完全一致

#### Scenario: 全局 baseClassPath 仍填写的现有配置正常工作
- **WHEN** 现有配置填写了全局 `baseClassPath: './ApiClient'` 且 origin 未覆盖
- **THEN** 系统 MUST 正常生成代码，基类路径解析为 `'./ApiClient'`，不因 `baseClassPath` 改为可选而报错
