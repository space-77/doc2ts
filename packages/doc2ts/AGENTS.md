# AGENTS.md

This file provides guidance to AI coding agents working in the doc2ts package.

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
npm run init-config     # Initialize doc2ts configuration file
npm run test            # Run main CLI tool (manual testing)
npm run test-post       # Test post-render script
```

### Testing

```bash
npm run test:unit       # Run unit tests
npm run test:unit:watch # Run unit tests in watch mode
```

### Release (managed from workspace root)

```bash
pnpm release            # Standard-version release
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

The `doc-pre-data` package is linked via pnpm workspace:

- **Development**: pnpm workspace links `node_modules/doc-pre-data` → `packages/doc-pre-data`
- **Production**: Uses built package from `node_modules/doc-pre-data/lib/`

### Imports

- Use single quotes
- Order: Node.js built-ins first, then external packages, then internal modules
- Group imports logically with blank lines between groups
- Use `import type` for type-only imports

```typescript
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
- doc-pre-data (workspace:*)

## ESLint

Configuration in .eslintrc.js:

- Uses @typescript-eslint/parser and @typescript-eslint plugin
- Extends recommended TypeScript rules

## Important Notes

- This package is part of the doc2ts monorepo managed with pnpm workspaces
- Depends on `doc-pre-data` via `workspace:*` protocol
- Release is managed at the workspace root via changeset