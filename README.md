# doc2ts

## 功能

- 根据 swagger 文档 生成 ts 接口请求工具

## TODO
- [] 返回 非必传 转 必传

## 启动

1. 在项目根目录新建 `doc2ts.config.ts` 文件，文件必须导出一个对象 ` export default = {}`， 对象必须是 `Doc2TsConfig` 类型。
2. 创建一个 `class` 实现 `IApiClient`接口，用于类请求模块里的 class 继承，参考[基类名称](#基类名称)配置项。

## Doc2TsConfig 配置说明

> 使用建议：不要修改自动生成文件里的内容，应该尽量通过修改配置文件方式重新生成新的文件内容，因为每生成一次文件，文件里的内容都是新的，不会保留旧文件内容。

### 配置 swagger 文档地址

- 参数：`originUrl`
- 必传：`是`
- 类型：`String`
- 默认：` `
- 说明：配置 swagger 文档的 eg: http://localhost:7001

```typescript
export default {
  originUrl: 'xxx'
} as Doc2TsConfig
```

### 配置 文件输出的位置

- 参数：`outDir`
- 必传：`否`
- 类型：`String`
- 默认：`./services`

```typescript
export default {
  outDir: 'xxx'
} as Doc2TsConfig
```

### 配置 请求接口 Promise 的泛型

- 参数：`resultGenerics`
- 必传：`否`
- 类型：`String`
- 默认：`T`
- 说明：控制 `IApiClient.request` 方法返回 Promise 的泛型，`注意`: 如果配置了`resultGenerics`相应的 `IApiClient.request` 方法也需要返回对应的类型，否则会出现类型和结果不匹配问题。

```typescript
// 默认的结果
export type methodName = <T = any>(params: methodNameParams) => Promise<T>

// eg
export default {
  resultGenerics: '[any, T]'
} as Doc2TsConfig
// 配置后的结果
export type methodName = <T = any>(params: methodNameParams) => Promise<[any, T]>
```

### 过滤接口返回值外层数据结构

- 参数：`dataKey`
- 必传：`否`
- 类型：`String`
- 默认：` `
- 说明：如果接口返回数据是包含有请求状态等信息，为了方便使用数据，可以配置 `dataKey`，过滤外层信息。 `注意`：该配置只是处理 ts 类型，需要在实现 `IApiClient.request`方法时做对应的处理

```typescript
// 接口返回数据结构
{
  "msg": "success",
  "code": "0",
  "data": { "list": [], "count": 100, "page": 1 }
}
// doc2ts.config.ts
export default {
  dataKey: 'data'
} as Doc2TsConfig
// 配置后结果
try {
  const result = await api.modelName.methodName()
  // 此时 result 的类型为 { "list": [], "count": 100, "page": 1 }
  // 注意是类型，结果是不是这样需要 IApiClient.request 里自行处理
} catch (error) {
  console.error(error)
}
```

### 修改模块名字

- 参数：`rename`
- 必传：`否`
- 类型：`RegExp | String | Function`
- 默认：` `
- 说明：传入正则或字符串类型则对模块名称进行 `name.replace` 操作，`Function` 类型则是自定义操作

```typescript
export default {
  rename: xxx
} as Doc2TsConfig
```

### 基类名称

- 参数：`baseClassName`
- 必传：`否`
- 类型：`String`
- 默认：`ApiClient`
- 说明：
  1. 每个模块继承的基类名称，用于给每个模块的请求类继承
  2. 基类必须 实现 IApiClient 接口
  3. 如果基类使用 `export` 导出的 那么 `baseClassName` 的值则是 `'{XXX}'`，如果是使用 `export default` 导出的则是 `'XXX'`

```typescript
export default {
  baseClassName: 'ApiClient'
} as Doc2TsConfig
```

### 基类位置

- 参数：`baseClassPath`
- 必传：`是`
- 类型：`String`
- 默认：` `
- 说明：基类路径

```typescript
export default {
  baseClassPath: 'xxx'
} as Doc2TsConfig
```

### prettier 配置文件位置

- 参数：`prettierPath`
- 必传：`否`
- 类型：`String`
- 默认：` `
- 说明：prettier 配置文件路径，默认会读取项目上的 .prettierrc.js、 prettier.config.js、prettier.config.cjs、.prettierrc、.prettierrc.json、.prettierrc.json5 以及 package.json 里的 prettier 配置， 都获取不到则使用默认配置。

```typescript
export default {
  prettierPath: './.prettierrc.js'
} as Doc2TsConfig
```

### 隐藏请求方法

- 参数：`hideMethod`
- 必传：`否`
- 类型：`Boolean`
- 默认：`false`
- 说明：隐藏请求方法，达到简化代码，如下两种类型的请求可以省略（注意：在 实现 `IApiClient` 的 `request` 和 `downloadFile`, 需要自行处理请求方法）。
  1. `get` 请求: 在 `request`方法没接收到 `method` 和 `params` 值，此时该接口为 `get` 请求可以省略。
  2. `post` 请求: 在 `request`方法没接收到 `method` 值，但接收到了 `params` 的值，此时该接口为 `post`, 可以省略。
  3. 除了以上两点，其它情况 `method` 均不会隐藏。

```typescript
// 配置前结果
class XXx extends ApiClient {
  foo() {
    return this.request({ url: 'path/xx', params, method: 'get' })
  }
}

// eg
export default {
  hideMethod: true
} as Doc2TsConfig
// 配置后结果，省略了 method 的配置
class XXx extends ApiClient {
  foo() {
    return this.request({ url: 'path/xx', params })
  }
}
```

### 生成模块文件前的回调钩子

- 参数：`render`
- 必传：`否`
- 类型：`(content: string, modelName: string, config: Doc2TsConfig['config']) => string`
- 默认：` `
- 说明：生成接口文件前的钩子，用于修改生成的内容

```typescript
export default {
  render(content, modelName, config) {
    // TODO
    return 'xxx'
  }
} as Doc2TsConfig
```

### 生成接口类型文件前的钩子

- 参数：`typeFileRender`
- 必传：`否`
- 类型：`(content: string, modelName: string, config: Doc2TsConfig['config']) => string`
- 默认：` `
- 说明：生成接口类型文件前的钩子，用于修改生成内容

```typescript
export default {
  typeFileRender(content, modelName, config) {
    // TODO
    return 'xxx'
  }
} as Doc2TsConfig
```

### 模块配置

- 参数：`moduleConfig`
- 必传：`否`
- 类型：`Object`
- 默认：` `
- 说明：每个模块对应的配置，`key`是模块名字，[rename](#修改模块名字) 处理后的名字优先模块默认名字

```typescript
export default {
  moduleConfig: {...}
} as Doc2TsConfig
```

### 修改某个模块文件的名字

- 参数：`moduleConfig.moduleName`
- 必传：`否`
- 类型：`String`
- 默认：` `
- 说明：针对某个模块重命名， 优先级高于 [rename](#修改模块名字)
  1. 和 [rename](#修改模块名字) 不同的是 [moduleName](#修改某个模块文件的名字) 是对某个模块的重命名， 而 [rename](#修改模块名字) 是对所有模块重命名
  2. [moduleName](#修改某个模块文件的名字) 不会影响[moduleConfig](#模块配置) 对象的`key`，[rename](#修改模块名字) 则会

```typescript
export default {
  moduleConfig: {
    模块名称: {
      moduleName: 'xxx'
    }
  }
} as Doc2TsConfig
```

#### 请求接口方法配置

- 参数：`moduleConfig.methodConfig`
- 必传：`否`
- 类型：`Object`
- 默认：` `
- 说明：每个方法对应的配置

```typescript
export default {
  moduleConfig: {
     '模块名称': {
       methodConfig: {...}
     }
  }
} as Doc2TsConfig
```

#### 修改某个请求接口方法名字

- 参数：`moduleConfig.methodConfig.name`
- 必传：`否`
- 类型：`String`
- 默认：` `
- 说明：修改方法名称, `接口id` 在生的类型文件里每一个导出方法都会有个一注释的`id`，`注意`: 该 id 是固定的，但会随后端接口改变而改变。

```typescript
export default {
  moduleConfig: {
    模块名称: {
      methodConfig: {
        接口id: {
          name: 'xxx'
        }
      }
    }
  }
} as Doc2TsConfig
```

#### 修改某个请求接口方法描述

- 参数：`moduleConfig.methodConfig.description`
- 必传：`否`
- 类型：`String`
- 默认：` `
- 说明：修改方法描述

```typescript
export default {
  moduleConfig: {
    模块名称: {
      methodConfig: {
        接口id: {
          description: 'xxx'
        }
      }
    }
  }
} as Doc2TsConfig
```

#### 修改某个请求接口方法描述

- 参数：`moduleConfig.methodConfig.isDownload`
- 必传：`否`
- 类型：`Boolean`
- 默认：`false`
- 说明：该接口是否是下载文件接口，如果是则会走 `IApiClient` 的 `downloadFile` 方法

```typescript
export default {
  moduleConfig: {
    模块名称: {
      methodConfig: {
        接口id: {
          downloadFile: true
        }
      }
    }
  }
} as Doc2TsConfig
```

#### 自定义接口配置参数

- 参数：`moduleConfig.methodConfig.config`
- 必传：`否`
- 类型：`Object`
- 默认：` `
- 说明：接口的自定义配置，会传递到调用对应基类的方法里

```typescript
export default {
  moduleConfig: {
     '模块名称': {
       methodConfig: {
         '接口id': {
           config: {...}
         }
       }
     }
  }
} as Doc2TsConfig
```
