# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

doc2ts is a TypeScript CLI tool that automatically generates TypeScript/JavaScript API client code from Swagger/OpenAPI documentation. It supports multiple documentation sources (Swagger, Apifox) and provides flexible configuration for custom request handling.

## Development Commands

### Build and Development
- `npm run build` - Build the project (compiles TypeScript and copies resources)
- `npm run dev` - Run development mode with ts-node
- `npm run init-config` - Initialize configuration file

### Code Generation
- `npm run api` - Generate API client code (alias for `doc2ts start`)
- `npm run api-git` - Generate code with Git branch management (alias for `doc2ts start --git`)
- `npx doc2ts init` - Initialize doc2ts configuration interactively

### Testing
- `npm run test` - Runs the main CLI tool (not formal unit tests)
- Manual testing uses mock data in `mock/apifox.json`

## Architecture

### Core Structure
```
src/
├── builder/          # Core code generation logic
│   ├── index.ts      # Main Doc2Ts class - orchestrates build process
│   ├── buildType.ts  # TypeScript type generation
│   └── tsFileBuilder.ts # File output management
├── types/           # TypeScript type definitions
├── scripts/         # CLI commands and utilities
├── generators/      # File generation utilities
├── apifox/          # Apifox integration
├── common/          # Shared utilities (Config, etc.)
└── utils/           # Helper functions
```

### Key Components
- **Doc2Ts Class** (`src/builder/index.ts`): Main orchestrator that handles configuration, data fetching, file creation, and JS transformation
- **Type Builder** (`src/builder/buildType.ts`): Generates TypeScript interfaces from API definitions
- **File Builder** (`src/builder/tsFileBuilder.ts`): Manages file output and imports
- **CLI Interface** (`bin/doc2api.js`): Command-line interface using Commander.js

### Configuration System
- Main config: `doc2ts-config.ts` in project root
- Must export a `Doc2TsConfig` object
- Controls output directory, API sources, language type, base class, etc.

## Code Generation Flow

1. **Configuration Loading**: Reads `doc2ts-config.ts` and validates settings
2. **Data Fetching**: Downloads API documentation from configured sources (Swagger/Apifox)
3. **Type Generation**: Creates TypeScript interfaces from API definitions
4. **File Creation**: Generates service classes that extend a user-provided base class
5. **Post-processing**: Optionally converts to JavaScript, applies formatting, manages Git branches

## Important Implementation Details

### Base Class Requirement
Users must provide a base class that implements `IApiClient` interface with a `request` method. The generated code extends this class.

### Language Support
- TypeScript mode: Generates `.ts` files with full type definitions
- JavaScript mode: Generates `.js` files with optional `.d.ts` declarations

### Git Integration
When using `--git` flag, automatically:
1. Creates/switches to `doc2ts` branch
2. Generates code and commits changes
3. Merges back to original branch

### Multi-Source Support
Can handle multiple API documentation sources simultaneously, organizing them by module name.

## Dependencies

### Core Runtime Dependencies
- **TypeScript**: Primary language and compilation
- **Puppeteer**: For web scraping/documentation fetching
- **Axios**: HTTP requests
- **Commander**: CLI interface
- **Prettier**: Code formatting
- **Lodash**: Utility functions

### Development Dependencies
- **ts-node**: TypeScript execution
- **ESLint**: Code linting (configured for TypeScript)

## Code Style Guidelines

- TypeScript strict mode enabled
- Prettier formatting with project-specific config (see package.json)
- CommonJS module system
- Target: ES6
- No comments unless explicitly requested
- Follow existing patterns in neighboring files