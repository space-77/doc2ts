<div align="center">

# doc2ts - 构建接口请求工具

</div>

😉 根据 swagger 文档生成请求工具（typeScript or javaScript）  
😉 只需一条命令即可实现 接口定义、入参说明、参数整理、返回数据类型定义等工作，解放双手，提高摸鱼时间  
😉 灵活配置，不干涉请求过程  
😉 使用 git 管理生成代码，无惧修改

## 快速开始

### 安装

```shell
npm i -D doc2ts
npm i qs
```

### 配置项目命令

在 package.json 添加以下脚本命令

```json
{
  "scripts": {
    // ...
    "api": "doc2ts start",
    "api-git": "doc2ts start --git"
  }
}
```

### 初始化配置

```shell
# 根据提示选择你的配置
npx doc2ts init
```

- 输入命令后全按回车键，会生成一份示例配置。
- 如果选项 `生成基类文件` 后会在对应的位置生成一个 `.ts`文件，该文件必须导出一个 基类，该基类必须实现 `IApiClient` 接口。
- 执行完该命令后，会在项目根目录上生成一个  `doc2ts-config.ts` 文件，该文件必须导出一个 `Doc2TsConfig` 类型的对象， 详细配置信息请查看 [Doc2TsConfig 配置说明](#Doc2TsConfig 配置说明)。

### 生成文件

```shell
npm run api
```

### 使用 git 管理生成的代码

> 版本 v0.9.1 及以上有效

每次生成的代码都会覆盖上一次的代码，而很多时候需要手动修改生成后的代码（接口文档不能百分百准确），这时候可以使用 git 分支去管理。  
自动流程：
复制当前分支的配置文件（doc2ts-config.ts） -> 切换到 doc2ts 分支 -> 更新 doc2ts 分支代码 -> 生成代码 -> commit -> 提交 doc2ts 分支代码 -> 切回到原分支 -> merge doc2ts 分支。

```shell
npm run api-git
```

## 基类文件说明

> 基类文件 必须导出一个 `数据请求类`， 该 `类` 必须实现 `IApiClient` 接口，即添加 `request`方法，每个接口把参数整理后都会传给 `request`方法，所以需要您自行在 `request`方法实现请求过程（axios、fetch、ajax ...）

### request 方法参数说明

request 方法接收一个 [DocReqConfig ](./src/types/client.d.ts#L39)类型的对象，详细说明如下：

| 键值     | 类型                                  | 必传 | 说明                                                                                                                                        |
| -------- | ------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| url      | String                                | 是   | 接口请求地址（不带 BaseURL）                                                                                                                |
| method   | [Method](./src/types/client.d.ts#L16) | 是   | 请求方法                                                                                                                                    |
| body     | Object                                | 否   | 请求体， 根据文档接口入参定义                                                                                                               |
| formData | FormData                              | 否   | 封装好的 FormData 请求参数，根据文档接口入参定义                                                                                            |
| headers  | Object                                | 否   | headers 请求参数，根据文档接口入参定义                                                                                                      |
| config   | Object                                | 否   | 自定义某个接口参数，详细配置请查看 [自定义接口配置参数](#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8E%A5%E5%8F%A3%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0) |

## Doc2TsConfig 配置说明

通过修改 `doc2ts-config.ts` 里的配置信息，可以控制最终生成文件的内容。该配置文件必须导出一个 `Doc2TsConfig` 类型的对象。

> 使用建议：不要修改生成文件里的内容，应尽量通过修改配置信息方式控制生成新的文件内容，每次生成文件都会覆盖旧文件的内容。

### 接口文档地址 (origins)

- 参数：`origins`
- 必传：`是`
- 类型：`(Origin | ApifoxConfig)[]`
- 默认：`-`
- 说明：配置 swagger/apifox 的接口信息地址

**Origin 类型说明：**

| 键值         | 类型   | 必传 | 说明                                                                                                                 |
| ------------ | ------ | ---- | -------------------------------------------------------------------------------------------------------------------- |
| url          | String | 是   | swagger 的接口信息地址，返回数据与[示例地址](https://petstore.swagger.io/v2/swagger.json) 一致，也可以是 js 文件地址 |
| version      | String | 否   | swagger 版本                                                                                                         |
| name         | String | 否   | 模块名                                                                                                               |
| requestName  | String | 否   | 接口请求方法（默认：request）                                                                                        |
| downloadName | String | 否   | 文件下载方法（默认：download）                                                                                       |

**ApifoxConfig 类型说明：**

| 键值         | 类型   | 必传 | 说明                           |
| ------------ | ------ | ---- | ------------------------------ |
| sharedId     | String | 是   | Apifox 共享 ID                 |
| name         | String | 否   | 模块名                         |
| requestName  | String | 否   | 接口请求方法（默认：request）  |
| downloadName | String | 否   | 文件下载方法（默认：download） |

```typescript
export default {
  origins: [
    { name: 'swagger-api', url: 'https://petstore.swagger.io/v2/swagger.json' },
    { name: 'apifox-api', sharedId: 'shared-xxxxx', requestName: 'fetch' }
  ]
} as Doc2TsConfig
```

### Swagger 鉴权 Headers (swaggerHeaders)

- 参数：`swaggerHeaders`
- 必传：`否`
- 类型：`Record<string, any>`
- 默认：`-`
- 说明：如果 swagger 文档有权限校验，可以通过该项配置在请求文档数据时添加 headers 信息

```typescript
export default {
  swaggerHeaders: {
    Authorization: 'Bearer token',
    cookie: 'session=xxx'
  }
} as Doc2TsConfig
```

### 自定义请求 Swagger 数据方法 (fetchSwaggerDataMethod)

- 参数：`fetchSwaggerDataMethod`
- 必传：`否`
- 类型：`(url: string) => Promise<string>`
- 默认：`-`
- 说明：自定义获取 swagger 数据的方法，适用于需要特殊认证的场景

```typescript
export default {
  async fetchSwaggerDataMethod(url) {
    const response = await fetch(url, {
      headers: { Authorization: 'Bearer token' }
    })
    return response.text()
  }
} as Doc2TsConfig
```

### 模块过滤器 (filterModule)

- 参数：`filterModule`
- 必传：`否`
- 类型：`(i: PathInfo) => boolean`
- 默认：`-`
- 说明：过滤不需要生成的模块

```typescript
export default {
  filterModule(item) {
    // 只生成 user 和 order 模块
    return ['user', 'order'].includes(item.moduleName)
  }
} as Doc2TsConfig
```

### Git 配置 (gitConfig)

- 参数：`gitConfig`
- 必传：`否`
- 类型：`GitConfig`
- 默认：`-`
- 说明：自动 git 管理配置

```typescript
export default {
  gitConfig: {
    remote: 'origin',
    branchname: 'doc2ts'
  }
} as Doc2TsConfig
```

### 使用 operationId 作为方法名 (useOperationId)

- 参数：`useOperationId`
- 必传：`否`
- 类型：`boolean`
- 默认：`true`
- 说明：是否使用 operationId 作为方法名，false 时使用请求路径作为方法名

```typescript
export default {
  useOperationId: false // 使用请求路径作为方法名
} as Doc2TsConfig
```

### 文件输出目录 (outDir)

- 参数：`outDir`
- 必传：`是`
- 类型：`string`
- 默认：`-`
- 说明：生成文件的输出目录

```typescript
export default {
  outDir: './src/services'
} as Doc2TsConfig
```

### 基类名称 (baseClassName)

- 参数：`baseClassName`
- 必传：`否`
- 类型：`string`
- 默认：`ApiClient`
- 说明：每个模块继承的基类名称，基类必须实现 `IApiClient` 接口

```typescript
export default {
  baseClassName: 'MyApiClient' // 或 {MyApiClient} 如果使用 export 导出
} as Doc2TsConfig
```

### 语言类型 (languageType)

- 参数：`languageType`
- 必传：`否`
- 类型：`'typeScript' | 'javaScript' | 'typescript' | 'javascript' | 'ts' | 'js'`
- 默认：`'typeScript'`
- 说明：生成 TypeScript 还是 JavaScript 文件

```typescript
export default {
  languageType: 'typeScript' // 或 'js', 'javascript' 等
} as Doc2TsConfig
```

### 翻译类型 (translateType)

- 参数：`translateType`
- 必传：`否`
- 类型：`TranslateType`
- 默认：`TranslateType.none`
- 说明：翻译类型配置，用于控制代码生成时的翻译行为

```typescript
export default {
  translateType: TranslateType.none // TranslateType.pinyin, TranslateType.english
} as Doc2TsConfig
```

### AI 配置 (aiConfig)

- 参数：`aiConfig`
- 必传：`否`
- 类型：`AIConfig`
- 默认：`-`
- 说明：AI 翻译配置，用于 AI 翻译（当 translateType 为 TranslateType.ai 时）和 AI 优化方法名

```typescript
export default {
  aiConfig: {
    apiKey: 'your-api-key',
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.3,
    enableThinking: true,
    enableFuncNameOptimize: true
  }
} as Doc2TsConfig
```

### 箭头函数模式 (arrowFunc)

- 参数：`arrowFunc`
- 必传：`否`
- 类型：`boolean`
- 默认：`false`
- 说明：是否使用箭头函数方式生成接口方法

```typescript
export default {
  arrowFunc: true // 使用箭头函数：method = () => {}
} as Doc2TsConfig
```

### 保留 TS 文件 (emitTs)

- 参数：`emitTs`
- 必传：`否`
- 类型：`boolean`
- 默认：`false`
- 说明：JavaScript 模式下是否保留 TypeScript 源文件

```typescript
export default {
  emitTs: true // 只在 languageType 为 'js' 时有效
} as Doc2TsConfig
```

### 生成声明文件 (declaration)

- 参数：`declaration`
- 必传：`否`
- 类型：`boolean`
- 默认：`true`
- 说明：JavaScript 模式下是否生成 `.d.ts` 声明文件

```typescript
export default {
  declaration: true // 生成对应的 .d.ts 文件
} as Doc2TsConfig
```

### 基类路径 (baseClassPath)

- 参数：`baseClassPath`
- 必传：`是`
- 类型：`string`
- 默认：`-`
- 说明：基类文件的路径

```typescript
export default {
  baseClassPath: './src/services/client.ts'
} as Doc2TsConfig
```

### Prettier 配置路径 (prettierPath)

- 参数：`prettierPath`
- 必传：`否`
- 类型：`string`
- 默认：`-`
- 说明：Prettier 配置文件路径（已废弃）

```typescript
export default {
  prettierPath: './.prettierrc.js'
} as Doc2TsConfig
```

### 禁用参数 (disableParams)

- 参数：`disableParams`
- 必传：`否`
- 类型：`DisableParams[]`
- 默认：`-`
- 说明：移除某些全局配置的入参提示

```typescript
export default {
  disableParams: [{ paramType: 'header', keys: ['token', 'Authorization'] }]
} as Doc2TsConfig
```

### 返回类型渲染 (resultTypeRender)

- 参数：`resultTypeRender`
- 必传：`否`
- 类型：`string | ((funcName: string, typeInfo?: TypeInfoBase) => string)`
- 默认：`-`
- 说明：自定义接口返回数据类型

```typescript
// 函数方式
export default {
  resultTypeRender(funcName, typeInfo) {
    if (typeInfo) return `Promise<[any, ${typeInfo.typeName}['data'], ${typeInfo.typeName}]>`
    return 'Promise<any>'
  }
} as Doc2TsConfig

// 字符串模板方式
export default {
  resultTypeRender: '[any, {typeName}["data"], {typeName}]'
} as Doc2TsConfig
```

### 生成接口文件前的钩子 (render)

- 参数：`render`
- 必传：`否`
- 类型：`(content: string, moduleName?: string) => string`
- 默认：`-`
- 说明：生成接口文件前的钩子，用于修改生成的内容

```typescript
export default {
  render(content, moduleName) {
    // 自定义处理生成的文件内容
    return content.replace(/somePattern/g, 'replacement')
  }
} as Doc2TsConfig
```

### 生成接口类型文件前的钩子 (typeFileRender)

- 参数：`typeFileRender`
- 必传：`否`
- 类型：`(content: string, modelName: string) => string`
- 默认：`-`
- 说明：生成接口类型文件前的钩子，用于修改生成内容

```typescript
export default {
  typeFileRender(content, modelName) {
    // 自定义处理生成的类型文件内容
    return content + '\n// Custom comment'
  }
} as Doc2TsConfig
```

### 生成类型前的回调函数 (generateTypeRender)

- 参数：`generateTypeRender`
- 必传：`否`
- 类型：`(typeName: string, typeInfo: TypeInfoBase) => TypeInfoBase`
- 默认：`-`
- 说明：生成类型前的回调函数，用于修改类型定义

```typescript
export default {
  generateTypeRender(typeName, typeInfo) {
    // 把某个类型的所有字段改为必选
    if (typeName === 'User') {
      typeInfo.typeItems.forEach(item => {
        item.required = true
      })
    }
    return typeInfo
  }
} as Doc2TsConfig
```

### 生成代码后执行脚本 (postRender)

- 参数：`postRender`
- 必传：`否`
- 类型：`string`
- 默认：`-`
- 说明：生成代码后执行脚本，用于格式化代码等后处理任务

```typescript
export default {
  postRender: 'npm run format && npm run lint'
} as Doc2TsConfig
```

### 使用 operationId 作为方法名

- 参数：`useOperationId`
- 必传：`否`
- 类型：`Boolean`
- 默认：`true`
- 说明：默认使用 operationId 作为方法名，如果设置为 `false` 则使用请求路径作为方法名。注意：修改该参数会导致所有的方法名都会有变化，建议在初始化时确定好。

```typescript
export default {
  useOperationId: false // 使用请求路径作为方法名
} as Doc2TsConfig
```

### 翻译类型配置

- 参数：`translateType`
- 必传：`否`
- 类型：`TranslateType`
- 默认：`false`
- 说明：翻译类型配置，用于控制代码生成时的翻译行为

```typescript
export default {
  translateType: 'yourTranslateType'
} as Doc2TsConfig
```

### 生成接口文件前的钩子

- 参数：`render`
- 必传：`否`
- 类型：`(content: string, moduleName?: string) => string`
- 默认：``
- 说明：生成接口文件前的钩子，用于修改生成的内容

```typescript
export default {
  render(content, moduleName) {
    // 自定义处理生成的文件内容
    return content.replace(/somePattern/g, 'replacement')
  }
} as Doc2TsConfig
```

### 生成接口类型文件前的钩子

- 参数：`typeFileRender`
- 必传：`否`
- 类型：`(content: string, modelName: string) => string`
- 默认：``
- 说明：生成接口类型文件前的钩子，用于修改生成内容

```typescript
export default {
  typeFileRender(content, modelName) {
    // 自定义处理生成的类型文件内容
    return content + '\n// Custom comment'
  }
} as Doc2TsConfig
```
