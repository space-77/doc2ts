## 1. 类型扩展（packages/doc2ts/src/types/types.ts）

- [x] 1.1 新增 `OriginOverride` 接口，声明 `disableParams?: DisableParams[]`、`baseClassName?: string`、`baseClassPath?: string`、`resultTypeRender?: Doc2TsConfig['resultTypeRender']` 四个可选字段（字段类型通过 `Doc2TsConfig['xxx']` 引用，保证与全局类型一致）
- [x] 1.2 让 `ModelList extends DefaultFun, OriginOverride`
- [x] 1.3 让 `ApifoxConfig extends DefaultFun, OriginOverride`
- [x] 1.4 将 `Doc2TsConfig.baseClassPath` 从必填 `baseClassPath: string` 改为可选 `baseClassPath?: string`，并更新其 JSDoc 说明「全局默认值，可被 origin 覆盖」
- [x] 1.5 同步更新 `Doc2TsConfig` 上 `disableParams`、`baseClassName`、`resultTypeRender` 的 JSDoc，标注其「全局默认值，origin 同名字段优先」语义

## 2. Config 类调整（packages/doc2ts/src/common/config.ts）

- [x] 2.1 将 `readonly baseClassPath!: string` 改为 `readonly baseClassPath?: string`
- [x] 2.2 移除构造函数中 `if (!this.baseClassPath || ...) throw new Error('必要参数异常')` 对 `baseClassPath` 的强校验，改为：仅当 `origins` 为空或异常时抛错
- [x] 2.3 在构造函数中新增 origin 级 `baseClassPath` 解析校验：遍历 `this.origins`，若某 origin 的 `baseClassPath` 与全局 `baseClassPath` 均为空，抛出明确错误（错误信息包含该 origin 的 `name`，提示在 origin 或全局配置补充）
- [x] 2.4 保留 `this.baseClassPath = this.baseClassPath.replace(/.ts/, '')` 的全局值清洗逻辑（仅在全量非空时执行）

## 3. Base 类新增「origin 优先」访问器（packages/doc2ts/src/builder/base.ts）

- [x] 3.1 新增 `protected get effDisableParams(): DisableParams[]`，返回 `this.origin.disableParams ?? this.config.disableParams`
- [x] 3.2 新增 `protected get effBaseClassName(): string`，返回 `this.origin.baseClassName ?? this.config.baseClassName`
- [x] 3.3 新增 `protected get effBaseClassPath(): string`，返回 `this.origin.baseClassPath ?? this.config.baseClassPath`，若两者均空则抛出明确错误（含 origin name）
- [x] 3.4 新增 `protected get effResultTypeRender(): Config['resultTypeRender']`，返回 `this.origin.resultTypeRender ?? this.config.resultTypeRender`
- [x] 3.5 修改 `getBaseFileName` getter，将 `const { baseClassName } = this.config` 改为读取 `this.effBaseClassName`
- [x] 3.6 修改 `getClientPath` 方法，将 `const { baseClassPath } = this.config` 改为读取 `this.effBaseClassPath`，并保留 `.ts` 后缀清洗（在访问器或调用处统一处理，避免重复清洗导致路径错误）
- [x] 3.7 补充 `DisableParams`、`Doc2TsConfig` 类型 import（如尚无）

## 4. TsFileBuilder 消费 origin 级 disableParams（packages/doc2ts/src/builder/tsFileBuilder.ts）

- [x] 4.1 修改 `getParamsInfo` 方法，将 `const { disableParams } = this.config` 改为 `const disableParams = this.effDisableParams`
- [x] 4.2 确认 `disableParams.find(...)` 过滤逻辑无需改动，仅数据来源切换

## 5. createReturnType 改造（packages/doc2ts/src/builder/common.ts）

- [x] 5.1 修改 `createReturnType` 签名：将首个参数从 `config: Config` 改为 `resultTypeRender: Config['resultTypeRender']` 与 `languageType: Config['languageType']` 两个参数
- [x] 5.2 函数体内将 `const { resultTypeRender: render, languageType } = config` 改为直接使用入参 `resultTypeRender`（别名 `render`）与 `languageType`
- [x] 5.3 修改 `TsFileBuilder.generatorApiMethod` 中对 `createReturnType` 的调用（tsFileBuilder.ts:148），传入 `this.effResultTypeRender` 与 `this.config.languageType`
- [x] 5.4 全局搜索确认无其它调用方（若有则同步更新）

## 6. 验证与编译

- [x] 6.1 在 `packages/doc2ts` 执行 `npm run build`（含 CJS + ESM），确认无类型错误
- [x] 6.2 执行 `npm run test:unit`，确认现有单元测试全部通过
- [x] 6.3 手动构造多 origin 配置：origin A 配置 `baseClassName`/`baseClassPath` 覆盖，origin B 仅用全局，执行 `npm run test`（CLI 主流程），确认生成结果分别使用各自基类名与路径
- [x] 6.4 手动构造「全部 origin 覆盖 baseClassPath、全局省略」配置，确认正常生成
- [x] 6.5 手动构造「某 origin 与全局均缺 baseClassPath」配置，确认抛出包含 origin name 的明确错误
- [x] 6.6 手动构造 origin 级 `disableParams` 与 `resultTypeRender` 覆盖场景，确认入参过滤与返回类型渲染按 origin 生效
- [x] 6.7 用升级前的现有 `doc2ts-config.ts`（仅全局配置）跑一次生成，diff 输出确认与升级前完全一致

## 7. 文档与发布

- [x] 7.1 在 `packages/doc2ts/CHANGELOG.md` 记录本次能力增强：origins 支持 `disableParams`/`baseClassName`/`baseClassPath`/`resultTypeRender` 覆盖；`Doc2TsConfig.baseClassPath` 改为可选；说明 origin 优先级
- [x] 7.2 通过 `pnpm changeset` 在 `.changeset/` 新增 changeset 记录 `doc2ts` 的 minor 版本变更
- [x] 7.3 视情况更新 `packages/doc2ts/README.md`（如「配置项」章节列出了 origins 字段，补充四个新覆盖字段说明）
