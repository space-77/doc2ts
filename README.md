<div align="center">

# doc2ts - 构建接口请求工具

</div>

😉 根据 swagger 文档生成请求工具（typeScript or javaScript）  
😉 只需一条命令即可实现 接口定义、入参说明、参数整理、返回数据类型定义等工作，解放双手，提高摸鱼时间  
😉 灵活配置，不干涉请求过程
😉 使用gitg管理生成代码，无惧修改

## 快速开始

### 安装

#### 项目上安装

```shell
npm i -D doc2ts
# or
yarn add -D doc2ts

# or
pnpm add -D doc2ts
```

同时需要安装 qs 处理请求参数。  
安装后需要在 package.json 添加以下脚本命令

```json
{
  "scripts": {
    "api-init": "doc2ts init",
    "api-build": "doc2ts build"
  }
}
```

### 初始化配置

```shell
# 根据提示选择你的配置
npm run api-init
```

- 输入命令后全按回车键，会生成一份示例配置。
- 如果选项 `生成基类文件` 后会在对应的位置生成一个 `.ts`文件，该文件必须导出一个 基类，该基类必须实现 `IApiClient` 接口。
- 执行完该命令后，会在项目根目录上生成一个  `doc2ts-config.ts` 文件，该文件必须导出一个 `Doc2TsConfig` 类型的对象， 详细配置信息请查看 [Doc2TsConfig 配置说明](#Doc2TsConfig 配置说明)。

### 生成文件

```shell
npm run api-build
```

### 使用 git 管理生成的代码

> 版本 v0.9.1 及以上有效

```shell
npm run api-build --git
```

流程：
复制当前分支的配置文件（doc2ts-config.ts） -> 切换到 doc2ts 分支 -> 生成代码 -> commit -> 切回到原分支 -> merge doc2ts 分支。

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

### 配置 swagger 文档地址

- 参数：`origins`
- 必传：`是`
- 类型：List<[Origin](./src/types/client.d.ts#L39)>
- 默认：`-`
- 说明：配置 swagger 的接口信息地址

Origin 类型说明如下表：

| 键值    | 类型   | 必传 | 说明                                                                                           |
| ------- | ------ | ---- | ---------------------------------------------------------------------------------------------- |
| url     | String | 是   | swagger 的接口信息地址，返回数据与[示例地址](https://petstore.swagger.io/v2/swagger.json) 一致，也可以是 js 文件地址【有些swagger是通过js方式写入文档数据】 |
| version | String | 否   | swagger 版本                                                                                   |
| name    | String | 否   | 模块名                                                                                         |

```typescript
export default {
  origins: [
    { name: 'xxx1', url: 'https://xxx/xxx1' },
    { name: 'xxx2', url: 'https://xxx/xxx2' }
  ]
} as Doc2TsConfig
```

### 设置请求 swagger 数据的 headers

- 参数：`swaggerHeaders`
- 必传：`否`
- 类型：`Object`
- 默认：`-`
- 说明：如果 `swagger` 文档有权限校验，可以通过该项配置在请求文档数据时添加`headers`信息，如 `token`、`cookie`、`Authorization`等信息（具体的认证信息需要手动在浏览器控制台复制过来）。

```typescript
export default {
  swaggerHeaders: {
    token: 'xxxx',
    cookie: 'xxxx',
    Authorization: 'xxxx'
    ... // 或者其它类型的header信息
  }
} as Doc2TsConfig
```

### 自定义请求 swagger 数据信息方法

- 参数：`fetchSwaggerDataMethod`
- 必传：`否`
- 类型：`function(url: string): Promise<string>`
- 默认：`-`
- 说明：如果你觉得 `swaggerHeaders` 配置每次都获取一个 `swagger` 认证信息比较麻烦，同时你能拿到`swagger`登录接口，就可以使用该配置方法去获取接口信息，这个是个一劳永逸的方法。

以`swagger`使用`alert`方式输入账号密码认证为例子

> 使用 alert 方式登录是通过 [www-authenticate](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication) 方式认证，这是 HTTP 提供的一个鉴权方案，其内部会把信息进行编码，所有不能用过普通的方式进行登录。

```typescript
import axios from 'axios'
import type { Doc2TsConfig } from 'doc2ts'

// 获取 swagger 认证信息
class SwaggerToken {
  static token: string
  async getToken() {
    if (SwaggerToken.token) {
      return SwaggerToken.token
    } else {
      try {
        const username = 'username'
        const password = 'password'
        const auth = `${username}:${password}@`
        // 假如 文档地址为  https://xxxxxx/swagger-ui.html
        const url = `https://${auth}xxxxxx/swagger-ui.html`
        const { headers } = await axios.get(url)

        // 获取token,具体内容根据实际情况处理
        const [token] = String(headers['set-cookie']).match(/SESSION=\w+/) || []
        SwaggerToken.token = token
        return SwaggerToken.token
      } catch (error) {
        console.error(error)
      }
    }
  }
}

export default {
  async fetchSwaggerDataMethod(url) {
    const res = await axios.get(url, {
      headers: {
        cookie: await new SwaggerToken().getToken()
      }
    })
    return JSON.stringify({ tags: [], paths: {}, definitions: {} })
  }
} as Doc2TsConfig
```

### 配置 文件输出的位置

- 参数：`outDir`
- 必传：`是`
- 类型：`String`
- 默认：``
- 说明：文件输出位置

```typescript
export default {
  outDir: 'xxx'
} as Doc2TsConfig
```

### 基类位置

- 参数：`baseClassPath`
- 必传：`是`
- 类型：`String`
- 默认：``
- 说明：基类路径

```typescript
export default {
  baseClassPath: 'xxx'
} as Doc2TsConfig
```

### 基类名称

- 参数：`baseClassName`
- 必传：`否`
- 类型：`String`
- 默认：`ApiClient`
- 说明：
  1.  每个模块继承的基类名称，用于给每个模块的请求类继承
  1.  基类文件导出基类的名字，基类使用`baseClassName`导出可以忽略这项配置，使用`export`导出需用`{}`包裹；eg:`{ClassName}`

```typescript
export default {
  baseClassName: '{ApiClient}' // 基类使用 export 导出
} as Doc2TsConfig
```

### 输出文件格式（生成 ts 或 js）

- 参数：`languageType`

- 必传：`否`
- 类型： `String`
- 默认：`typeScript`
- 说明： 生成 `.ts` 还是生成 `.js` 文件

```typescript
export default {
  languageType: 'typeScript' // 可选 ts typeScript typescript js javaScript javascript
} as Doc2TsConfig
```

### Js 模式下是否生成 .d.ts 类型文件（建议默认）

- 参数：`declaration`
- 必传：`否`
- 类型： `Boolean`
- 默认：`true`
- 说明：
  1.  该配置在 `languageType`   为 js 模式下生效
  1.  是否输出 `.d.ts`类型文件，与 `tsconfig.json`的 `declaration`配置一致

```typescript
export default {
  declaration: true
} as Doc2TsConfig
```

### Js 模式下是否保留 ts 文件（建议默认）

- 参数：`emitTs`
- 必传：`否`
- 类型： `Boolean`
- 默认：`false`
- 说明：
  1.  该配置在 `languageType`   为 js 模式下生效
  1.  是否保留转换为 js 的 ts 源文件

```typescript
export default {
  emitTs: false
} as Doc2TsConfig
```

### 代码格式化 prettier 配置文件位置

- 参数：`prettierPath`
- 必传：`否`
- 类型：`String`
- 默认：``
- 说明：使用 prettier 格式化生成的文件，prettier 配置文件路径，默认会读取项目上的 .prettierrc.js、 prettier.config.js、prettier.config.cjs、.prettierrc、.prettierrc.json、.prettierrc.json5 以及 package.json 里的 prettier 配置， 都获取不到则使用默认配置。

```typescript
export default {
  prettierPath: './.prettierrc.js'
} as Doc2TsConfig
```

### 移除全局入参配置

- 参数：`disableParams`
- 必传：`否`
- 类型：`Array<DisableParams>`
- 默认：``
- 说明：移除某些全局配置的入参，如：token 信息是全配置的，不需要调用接口时再填 token 信息，即可通过该配置取消

```typescript
export default {
  disableParams: [{ { type: 'header', name: 'accessToken' } }]
} as Doc2TsConfig
```

### 自定义请求方法返回类型

- 参数：`resultTypeRender`
- 必传：`否`
- 类型：`(funcName: string, typeInfo?: TypeInfoBase) => string`
- 默认：``
- 说明：
  1.  可以根据自己的需求去自定义返回类型
  1.  在基类实现 `IApiClient`接口的 `request` 方式时，如果不是返回默认的接口类型（默认是`Promise<XXX>`），而是自定义的类型如 `Promise<[err, data, res]>`这种格式，就可以用该项进行自定义返回数据类型

回到函数方式

```typescript
// 默认
export default {
  resultTypeRender(funcName, typeInfo) {
    return `${typeInfo.ypeName}` // default
  }
} as Doc2TsConfig

// 例子
// 返回数据格式
/*
{
  "code": "0",
  "data": ["test"],
  "msg": ""
}
*/

// 回调函数方式
export default {
  resultTypeRender(funcName, typeInfo) {
    if (typeInfo) return `any[]`
    // 查找 'data' 字段类型
    const typeItem = typeInfo.typeItems.find(i => i.name === 'data')
    const resTypeName = typeInfo.typeName
    if (typeItem) {
      return `[any, ${resTypeName}['${typeItem}'], ${resTypeName}]`
    }
    return `any[]`
  }
} as Doc2TsConfig

// 调用接口
// 此时 response 的类型为 Promise<[any, Xxx['data'], Xxx]>
const response = await api.xx.xxx()
// 把错误信息和返回数据整理到一个数据里，可以省去 try-catch，但同时需要您在 request 做相应的处理
// 此时的 data 类型为 array<string> , res 为完整的返回类型
const [err, data, res] = response
```

字符串方式

- `{typeName}`会被替换成返回数据类型名字
- `{typeName}["xxx"]` 这个结构会取出类名名字里的一个值

```typescript
// 字符串方式, 以下方式结果是 [any, Xxx["data"], Xxx]
export default {
  resultTypeRender: '[any, {typeName}["data"], {typeName}]'
} as Doc2TsConfig
```

### 生成模块文件前的回调钩子

- 参数：`render`
- 必传：`否`
- 类型：`(content: string, modelName: string) => string`
- 默认：``
- 说明：生成接口文件前的钩子，用于修改生成的内容

```typescript
export default {
  render(content, modelName) {
    // TODO
    return 'xxx'
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
    // TODO
    return 'xxx'
  }
} as Doc2TsConfig
```

### 生成类型前的回调函数

- 参数：`generateTypeRender`
- 必传：`否`
- 类型：`(typeName: string, typeInfo: TypeInfoBase) => TypeInfoBase`
- 默认：``
- 说明：生成类型前的回调函数，用于修改生成内容

```typescript
export default {
  generateTypeRender(typeName, typeInfo) {
    // TODO
    // eg: 把 某个文件下的 某个类型的某个值，由 可选 改为 必选
    if (typeName === 'xxx' ) {
      typeInfo.typeItems.forEach(i => {
        i.required = true
      })
    }
    return typeInfo
  }
} as Doc2TsConfig
```
