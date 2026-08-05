---
'doc2ts': minor
---

支持在 origins 数据源上覆盖 disableParams / baseClassName / baseClassPath / resultTypeRender

- `origins` 数组的每个数据源（`ModelList` 与 `ApifoxConfig`）新增 `disableParams`、`baseClassName`、`baseClassPath`、`resultTypeRender` 四个可选字段，类型与 `Doc2TsConfig` 对应字段一致
- 这四个全局参数语义从「全局唯一生效」降级为「默认值」：origin 上显式配置时优先于全局，未配置时回退全局值
- `Doc2TsConfig.baseClassPath` 由必填改为可选；任一 origin 与全局均缺失 `baseClassPath` 时抛出含 origin 名称的明确错误
- 向后兼容：仅配置全局参数的现有 `doc2ts-config.ts` 行为完全不变
- 内部 API：`createReturnType`（`packages/doc2ts/src/builder/common.ts`）签名变更，首个参数从 `config: Config` 改为 `resultTypeRender` 与 `languageType` 两个已解析值（未在公共入口导出）
