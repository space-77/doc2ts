# AGENTS.md

## Commands

### Build & Development
```bash
npm run build        # Build both CJS and ESM
npm run build:cjs    # Build CommonJS only
npm run build:esm    # Build ESM only
npm run dev          # Run dev mode with ts-node (src/dev.ts)
npm run openapi      # Execute OpenAPI processing script
```

### Testing
```bash
npm test             # Run all Jest tests
npm test src/__tests__/common/utils.test.ts    # Run single test file
npm run test:watch   # Run tests in watch mode
```

### Release
```bash
npm run release      # Create release with standard-version
```

## Code Style

### Formatting (Prettier config in package.json)
- **No semicolons** - `semi: false`
- **2 spaces** indentation - `tabWidth: 2`
- **CRLF line endings** - `endOfLine: crlf`
- **120 char line width** - `printWidth: 120`
- **Single quotes** - `singleQuote: true`
- **No arrow parens** for single arg - `arrowParens: avoid`
- **No trailing commas** - `trailingComma: none`

### TypeScript
- **Strict mode enabled** - `strict: true`
- Target: ES2018
- Module resolution: Node
- Always include type declarations: `declaration: true`
- Source maps enabled

### Imports
- Use single quotes
- Order: external libs first, then internal modules (relative paths)
- Group imports: 1) External packages, 2) Types, 3) Internal modules
- Use `import type` for type-only imports

```typescript
// Good example
import _ from 'lodash'
import axios from 'axios'
import type { OpenAPIV3 } from 'openapi-types'
import { checkName } from '../common/utils'
```

### Naming Conventions
- **Files**: camelCase (e.g., `typeItem.ts`, `funInfo.ts`)
- **Classes/Types**: PascalCase (e.g., `TypeItem`, `PathInfo`)
- **Interfaces**: PascalCase with meaningful names
- **Functions**: camelCase, descriptive names
- **Constants**: camelCase (not UPPER_SNAKE_CASE)
- **Generic types**: Use `T`, `K`, `V` when appropriate

### Types & Interfaces
- Prefer `interface` for object shapes that may be extended
- Use `type` for unions, tuples, and complex type operations
- Always export types that are part of public API
- Use JSDoc for complex type documentation

```typescript
export interface PathItem {
  name: string
  method: HttpMethods
  apiPath: string
}

type ApiData = { json: OpenAPIV3.Document; dictList: DictList[] }
```

### Error Handling
- Use explicit error throwing with descriptive messages
- Prefer `throw new Error('message')` over generic errors
- Use try-catch for async operations with proper rejection handling
- Log errors to the errorList store for tracking

```typescript
if (!refPreData) {
  throw new Error(`数据异常 ${ref} 引用数据不存在`)
}
```

### Comments
- Use JSDoc for public functions with `@param` and `@description`
- Chinese comments allowed and common in this codebase
- Keep comments concise and meaningful

```typescript
/**
 * @param str
 * @description 首字母大写
 */
export function firstToUpper(str: string) {
  return str.replace(/^(\S)/g, val => val.toUpperCase())
}
```

### Testing
- Use Jest with ts-jest
- Test files: `src/__tests__/**/*.test.ts`
- Use `describe` blocks for grouping
- Use `it` for test cases with descriptive strings
- Mock external dependencies when appropriate

```typescript
describe('firstToUpper', () => {
  it('should capitalize the first character of a string', () => {
    expect(firstToUpper('hello')).toBe('Hello')
  })
})
```

### Project Structure
- `src/` - Source code
  - `docApi/` - API documentation processing
  - `common/` - Shared utilities
  - `types/` - Type definitions
  - `store/` - State management
  - `__tests__/` - Test files
- `lib/` - Compiled output (CJS & ESM)
- `mock/` - Test mock data

### Key Dependencies
- TypeScript 4.8+
- Jest + ts-jest for testing
- Lodash for utilities
- Axios for HTTP requests
- OpenAPI types support

### Chinese Language Support
This library specializes in Chinese text processing:
- Automatic Chinese text detection
- Pinyin conversion support
- Translation integration
- Safe naming conventions for Chinese identifiers
