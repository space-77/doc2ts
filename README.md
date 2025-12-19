<div align="center">

# doc2ts - Build API Request Tools

</div>

> **[📖 中文文档](./README_CN.md)** | English Documentation

😉 Generate request tools from Swagger documentation (TypeScript or JavaScript)  
😉 Achieve interface definitions, parameter descriptions, parameter organization, and return data type definitions with just one command - freeing your hands and increasing productivity  
😉 Flexible configuration without interfering with the request process  
😉 Use git to manage generated code without fear of modifications  

## Quick Start

### Installation

```shell
npm i -D doc2ts
npm i qs
```

### Module Support

doc2ts supports both CommonJS and ES Modules:

- **CommonJS** (default): `const { Doc2Ts } = require('doc2ts')`
- **ES Modules**: `import { Doc2Ts } from 'doc2ts'`

The package automatically detects the module system and provides the appropriate format.

### Configure Project Scripts

Add the following script commands to package.json:

```json
{
  "scripts": {
    // ...
    "api": "doc2ts start",
    "api-git": "doc2ts start --git",
  }
}
```

### Initialize Configuration

```shell
# Follow the prompts to select your configuration
npx doc2ts init
```
- After entering the command, press Enter for all prompts to generate a sample configuration.
- If you select `Generate base class file`, a `.ts` file will be generated at the corresponding location. This file must export a base class that implements the `IApiClient` interface.
- After completing this command, a `doc2ts-config.ts` file will be generated in the project root directory. This file must export a `Doc2TsConfig` type object. For detailed configuration information, please see [Doc2TsConfig Configuration](#doc2tsconfig-configuration).

### Generate Files

```shell
npm run api
```

### Using Git to Manage Generated Code

> Valid for version v0.9.1 and above

Each time code is generated, it will overwrite the previous code. Often, you need to manually modify the generated code (interface documentation is not 100% accurate), and you can use git branches to manage this.
Automatic workflow:
Copy current branch configuration file (doc2ts-config.ts) -> Switch to doc2ts branch -> Update doc2ts branch code -> Generate code -> Commit -> Submit doc2ts branch code -> Switch back to original branch -> Merge doc2ts branch.

```shell
npm run api-git
```

## Base Class File Description

> The base class file must export a `data request class`. This `class` must implement the `IApiClient` interface, which means adding a `request` method. Each interface will pass organized parameters to the `request` method, so you need to implement the request process (axios, fetch, ajax...) in the `request` method yourself.

### request Method Parameter Description

The request method receives a [DocReqConfig](./src/types/client.d.ts#L39) type object. Detailed description is as follows:

| Key      | Type                                  | Required | Description                                                                                                                                        |
| -------- | ------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| url      | String                                | Yes      | Interface request address (without BaseURL)                                                                                                                |
| method   | [Method](./src/types/client.d.ts#L16) | Yes      | Request method                                                                                                                                    |
| body     | Object                                | No       | Request body, defined according to interface input parameters                                                                                                               |
| formData | FormData                              | No       | Packaged FormData request parameters, defined according to interface input parameters                                                                                            |
| headers  | Object                                | No       | Headers request parameters, defined according to interface input parameters                                                                                                      |
| config   | Object                                | No       | Custom interface parameters, see [Custom Interface Configuration Parameters](#custom-interface-configuration-parameters) for details |

## Doc2TsConfig Configuration

By modifying the configuration information in `doc2ts-config.ts`, you can control the content of the final generated files. This configuration file must export a `Doc2TsConfig` type object.

> Usage suggestion: Do not modify the content in generated files. Try to control the generation of new file content by modifying configuration information, as each generation will overwrite the old file content.

### Interface Documentation Address (origins)

- Parameter: `origins`
- Required: `Yes`
- Type: `(Origin | ApifoxConfig)[]`
- Default: `-`
- Description: Configure Swagger/Apifox interface information address

**Origin Type Description:**

| Key | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| url | String | Yes | Swagger interface information address, consistent with [example address](https://petstore.swagger.io/v2/swagger.json), can also be JS file address |
| version | String | No | Swagger version |
| name | String | No | Module name |
| requestName | String | No | Interface request method (default: request) |
| downloadName | String | No | File download method (default: download) |

**ApifoxConfig Type Description:**

| Key | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| sharedId | String | Yes | Apifox shared ID |
| name | String | No | Module name |
| requestName | String | No | Interface request method (default: request) |
| downloadName | String | No | File download method (default: download) |

```typescript
export default {
  origins: [
    { name: 'swagger-api', url: 'https://petstore.swagger.io/v2/swagger.json' },
    { name: 'apifox-api', sharedId: 'shared-xxxxx', requestName: 'fetch' }
  ]
} as Doc2TsConfig
```

### Swagger Authentication Headers (swaggerHeaders)

- Parameter: `swaggerHeaders`
- Required: `No`
- Type: `Record<string, any>`
- Default: `-`
- Description: If Swagger documentation requires authentication, you can add headers information when requesting documentation data

```typescript
export default {
  swaggerHeaders: {
    Authorization: 'Bearer token',
    cookie: 'session=xxx'
  }
} as Doc2TsConfig
```

### Custom Swagger Data Request Method (fetchSwaggerDataMethod)

- Parameter: `fetchSwaggerDataMethod`
- Required: `No`
- Type: `(url: string) => Promise<string>`
- Default: `-`
- Description: Custom method to get Swagger data, suitable for scenarios requiring special authentication

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

### Module Filter (filterModule)

- Parameter: `filterModule`
- Required: `No`
- Type: `(i: PathInfo) => boolean`
- Default: `-`
- Description: Filter out modules that don't need to be generated

```typescript
export default {
  filterModule(item) {
    // Only generate user and order modules
    return ['user', 'order'].includes(item.moduleName)
  }
} as Doc2TsConfig
```

### Git Configuration (gitConfig)

- Parameter: `gitConfig`
- Required: `No`
- Type: `GitConfig`
- Default: `-`
- Description: Automatic git management configuration

```typescript
export default {
  gitConfig: {
    remote: 'origin',
    branchname: 'doc2ts'
  }
} as Doc2TsConfig
```

### Use operationId as Method Name (useOperationId)

- Parameter: `useOperationId`
- Required: `No`
- Type: `boolean`
- Default: `true`
- Description: Whether to use operationId as method name, use request path as method name when false

```typescript
export default {
  useOperationId: false  // Use request path as method name
} as Doc2TsConfig
```

### File Output Directory (outDir)

- Parameter: `outDir`
- Required: `Yes`
- Type: `string`
- Default: `-`
- Description: Output directory for generated files

```typescript
export default {
  outDir: './src/services'
} as Doc2TsConfig
```

### Base Class Name (baseClassName)

- Parameter: `baseClassName`
- Required: `No`
- Type: `string`
- Default: `ApiClient`
- Description: Base class name that each module inherits from, the base class must implement the `IApiClient` interface

```typescript
export default {
  baseClassName: 'MyApiClient'  // Or {MyApiClient} if using export
} as Doc2TsConfig
```

### Language Type (languageType)

- Parameter: `languageType`
- Required: `No`
- Type: `'typeScript' | 'javaScript' | 'typescript' | 'javascript' | 'ts' | 'js'`
- Default: `'typeScript'`
- Description: Generate TypeScript or JavaScript files

```typescript
export default {
  languageType: 'typeScript'  // Or 'js', 'javascript', etc.
} as Doc2TsConfig
```

### Translation Type (translateType)

- Parameter: `translateType`
- Required: `No`
- Type: `TranslateType`
- Default: `TranslateType.none`
- Description: Translation type configuration for controlling code generation translation behavior

```typescript
export default {
  translateType: TranslateType.none // TranslateType.pinyin, TranslateType.english
} as Doc2TsConfig
```

### Arrow Function Mode (arrowFunc)

- Parameter: `arrowFunc`
- Required: `No`
- Type: `boolean`
- Default: `false`
- Description: Whether to use arrow function mode to generate interface methods

```typescript
export default {
  arrowFunc: true  // Use arrow functions: method = () => {}
} as Doc2TsConfig
```

### Keep TS Files (emitTs)

- Parameter: `emitTs`
- Required: `No`
- Type: `boolean`
- Default: `false`
- Description: Whether to keep TypeScript source files in JavaScript mode

```typescript
export default {
  emitTs: true  // Only valid when languageType is 'js'
} as Doc2TsConfig
```

### Generate Declaration Files (declaration)

- Parameter: `declaration`
- Required: `No`
- Type: `boolean`
- Default: `true`
- Description: Whether to generate `.d.ts` declaration files in JavaScript mode

```typescript
export default {
  declaration: true  // Generate corresponding .d.ts files
} as Doc2TsConfig
```

### Base Class Path (baseClassPath)

- Parameter: `baseClassPath`
- Required: `Yes`
- Type: `string`
- Default: `-`
- Description: Path to the base class file

```typescript
export default {
  baseClassPath: './src/services/client.ts'
} as Doc2TsConfig
```

### Prettier Configuration Path (prettierPath)

- Parameter: `prettierPath`
- Required: `No`
- Type: `string`
- Default: `-`
- Description: Prettier configuration file path (deprecated)

```typescript
export default {
  prettierPath: './.prettierrc.js'
} as Doc2TsConfig
```

### Disable Parameters (disableParams)

- Parameter: `disableParams`
- Required: `No`
- Type: `DisableParams[]`
- Default: `-`
- Description: Remove prompts for certain globally configured input parameters

```typescript
export default {
  disableParams: [
    { paramType: 'header', keys: ['token', 'Authorization'] }
  ]
} as Doc2TsConfig
```

### Return Type Rendering (resultTypeRender)

- Parameter: `resultTypeRender`
- Required: `No`
- Type: `string | ((funcName: string, typeInfo?: TypeInfoBase) => string)`
- Default: `-`
- Description: Customize interface return data type

```typescript
// Function approach
export default {
  resultTypeRender(funcName, typeInfo) {
    if (typeInfo) return `Promise<[any, ${typeInfo.typeName}['data'], ${typeInfo.typeName}]>`
    return 'Promise<any>'
  }
} as Doc2TsConfig

// String template approach
export default {
  resultTypeRender: '[any, {typeName}["data"], {typeName}]'
} as Doc2TsConfig
```

### Hook Before Generating Interface Files (render)

- Parameter: `render`
- Required: `No`
- Type: `(content: string, moduleName?: string) => string`
- Default: `-`
- Description: Hook before generating interface files, used to modify generated content

```typescript
export default {
  render(content, moduleName) {
    // Custom processing of generated file content
    return content.replace(/somePattern/g, 'replacement')
  }
} as Doc2TsConfig
```

### Hook Before Generating Interface Type Files (typeFileRender)

- Parameter: `typeFileRender`
- Required: `No`
- Type: `(content: string, modelName: string) => string`
- Default: `-`
- Description: Hook before generating interface type files, used to modify generated content

```typescript
export default {
  typeFileRender(content, modelName) {
    // Custom processing of generated type file content
    return content + '\n// Custom comment'
  }
} as Doc2TsConfig
```

### Callback Function Before Generating Types (generateTypeRender)

- Parameter: `generateTypeRender`
- Required: `No`
- Type: `(typeName: string, typeInfo: TypeInfoBase) => TypeInfoBase`
- Default: `-`
- Description: Callback function before generating types, used to modify type definitions

```typescript
export default {
  generateTypeRender(typeName, typeInfo) {
    // Make all fields of a type required
    if (typeName === 'User') {
      typeInfo.typeItems.forEach(item => {
        item.required = true
      })
    }
    return typeInfo
  }
} as Doc2TsConfig
```

### Post-Generation Script (postRender)

- Parameter: `postRender`
- Required: `No`
- Type: `string`
- Default: `-`
- Description: Script to execute after code generation, useful for formatting code or other post-processing tasks

```typescript
export default {
  postRender: 'npm run format && npm run lint'
} as Doc2TsConfig
```