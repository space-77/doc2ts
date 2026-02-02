# AGENTS.md

This file provides guidance to AI coding agents working in the doc2ts repository.

doc2ts is a TypeScript CLI tool that generates TypeScript/JavaScript API client code from Swagger/OpenAPI documentation.

## Commands

### Build & Development

```bash
npm run build           # Build both CJS and ESM outputs
npm run build:cjs       # Build CommonJS only
npm run build:esm       # Build ESM only
npm run clean           # Remove lib directory
npm run dev             # Run development mode with ts-node (src/dev.ts)
```

### Code Generation

```bash
npm run api             # Generate API client code (doc2ts start)
npm run init-config     # Initialize doc2ts configuration file
npx doc2ts init         # Interactive configuration setup
```

### Testing

```bash
npm run test            # Run main CLI tool (manual testing)
npm run test-post       # Test post-render script
```

### Release

```bash
npm run release         # Create release with standard-version
npm run changeset       # Create a changeset
npm run changeset:version    # Version packages
npm run changeset:publish    # Publish packages
```

## Code Style

### Formatting (Prettier)

Configuration in package.json:

- **No semicolons** - `semi: false`
- **2 spaces** indentation - `tabWidth: 2`
- **LF line endings** - `endOfLine: lf`
- **120 char line width** - `printWidth: 120`
- **Single quotes** - `singleQuote: true`
- **No arrow parens** for single arg - `arrowParens: avoid`
- **No trailing commas** - `trailingComma: none`

### TypeScript

- **Strict mode enabled** - `strict: true` in tsconfig.json
- Target: ES6
- Module: CommonJS
- Module resolution: Node
- Generate declarations: `declaration: true`
- Source maps: disabled (`sourceMap: false`)

### Path Mapping (Monorepo)

The `doc-pre-data` package uses TypeScript paths for development:

```json
"paths": {
  "doc-pre-data": ["./packages/doc-pre-data/src/index.ts"]
}
```

- **Development**: Uses source from `packages/doc-pre-data/src/`
- **Production**: Uses built package from `node_modules/doc-pre-data/lib/`

### Imports

- Use single quotes
- Order: Node.js built-ins first, then external packages, then internal modules
- Group imports logically with blank lines between groups
- Use `import type` for type-only imports

```typescript
// Good example
import fs from 'fs-extra'
import path from 'path'
import _ from 'lodash'
import axios from 'axios'
import type { TypeItem } from 'doc-pre-data'
import { Config } from '../common/config'
import type { ModelList } from '../types/types'
```

### Naming Conventions

- **Files**: camelCase (e.g., `buildType.ts`, `tsFileBuilder.ts`)
- **Classes**: PascalCase (e.g., `Doc2Ts`, `BuildTypeFile`, `TsFileBuilder`)
- **Interfaces**: PascalCase with descriptive names (e.g., `ModelList`, `ApifoxConfig`)
- **Types**: PascalCase (e.g., `DocListItem`, `TypeInfo`)
- **Functions**: camelCase, descriptive names (e.g., `firstToUpper`, `loadPrettierConfig`)
- **Constants**: camelCase (not UPPER_SNAKE_CASE)
- **Private class members**: Regular camelCase (no underscore prefix)

### Types & Interfaces

- Use `interface` for object shapes that may be extended or implemented
- Use `type` for unions, tuples, and complex type operations
- Always export types that are part of the public API
- Use JSDoc with `@param` and `@description` for complex types

```typescript
export interface ModelList extends DefaultFun {
  url: string
  name?: string
}

type LogInfo = { type: 'error' | 'warn'; message: string }
```

### Comments

- Use JSDoc for public functions with `@param` and `@description`
- Chinese comments are common in this codebase
- Keep comments concise and meaningful
- No inline comments unless explaining complex logic

```typescript
/**
 * @param str
 * @description 首字母大写
 */
export function firstToUpper(str: string) {
  return str.replace(/^(\S)/g, val => val.toUpperCase())
}
```

### Error Handling

- Use explicit error throwing with descriptive messages
- Use `throw new Error('message')` with Chinese or English messages
- Log errors using the `log` utility for CLI feedback
- Store errors in `errorList` array for batch reporting

```typescript
if (!config) {
  throw new Error('配置不存在')
}
```

### Class Structure

- Use definite assignment assertion (`!`) for properties set in methods
- Initialize arrays and simple values inline
- Group related properties together

```typescript
export default class Doc2Ts {
  config!: Config
  warnList: LogInfo[] = []
  errorList: LogInfo[] = []
  docList: DocListItem[] = []

  async build() {
    await this.getConfig()
    await this.initRemoteDataSource()
  }
}
```

## Project Structure

```
src/
├── builder/           # Core code generation logic
│   ├── index.ts       # Main Doc2Ts class
│   ├── buildType.ts   # TypeScript type generation
│   └── tsFileBuilder.ts # File output management
├── types/             # TypeScript type definitions
├── scripts/           # CLI utilities and dev scripts
├── generators/        # File generation utilities
├── apifox/            # Apifox integration
├── common/            # Shared utilities (Config, etc.)
├── utils/             # Helper functions
├── services/          # Service layer
└── index.ts           # Main exports
```

## Key Dependencies

- TypeScript 5.5+
- Lodash for utilities
- Axios for HTTP requests
- Puppeteer for web scraping
- Prettier for code formatting
- Commander for CLI interface
- ts-node for development

## ESLint

Configuration in .eslintrc.js:

- Uses @typescript-eslint/parser and @typescript-eslint plugin
- Extends recommended TypeScript rules

## Important Notes

- No comments unless explicitly requested in final output
- Follow existing patterns in neighboring files
- This is a monorepo with packages in `packages/` directory
- Uses pnpm workspaces
