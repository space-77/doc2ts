# openapiFormat QWEN.md

## Project Overview

The `openapiFormat` project is a TypeScript library designed to process and format OpenAPI 3.x and Swagger 2.x specifications. It transforms OpenAPI data structures to generate TypeScript or JavaScript code, with special features for handling Chinese text by translating it to English equivalents.

The project is published as an NPM package named `doc-pre-data` and provides utilities for:
- Converting Swagger 2.x to OpenAPI 3.x
- Translating Chinese names and descriptions to English
- Formatting and optimizing OpenAPI schema names
- Organizing API endpoints by tags into functional groups
- Generating type information from API schemas

## Key Features

- **OpenAPI/Swagger Processing**: Converts and formats OpenAPI 3.x and Swagger 2.x documents
- **Chinese Language Support**: Comprehensive handling of Chinese text including detection, translation to English, and pinyin conversion
- **Schema Processing**: Handles complex schema structures including allOf, anyOf, oneOf
- **Code Generation Preparation**: Formats data to make it suitable for code generation
- **Type Information Management**: Creates structured type definitions from OpenAPI schemas

## Core Architecture

The main components include:

1. **`format.ts`**: Main entry point that handles API data processing, translation, and conversion
2. **`DocApi`**: Organizes API paths into functional groups by tags
3. **`Components`**: Manages OpenAPI components (schemas, parameters, requestBodies, responses)
4. **`TypeInfoBase` and `TypeItem`**: Handle type information and schema representation
5. **`Translate`**: Provides translation services with caching capabilities

## Building and Running

### Prerequisites
- Node.js
- npm or yarn

### Development Commands
- `npm run dev`: Run in development mode using ts-node
- `npm run build`: Compile TypeScript to JavaScript (outputs to lib/)
- `npm run test`: Run tests with Jest
- `npm run test:watch`: Run tests in watch mode
- `npm run openapi`: Run OpenAPI processing pipeline

### Build Process
The project uses TypeScript with the following configuration:
- Source files in `src/` directory
- Compiled output to `lib/` directory
- Declaration files (.d.ts) are generated for type safety
- Target: ESNext, module: CommonJS

## Testing
Tests are handled with Jest and TypeScript support via ts-jest:
- Test files are located in `src/__tests__/`
- Test environment: Node.js
- Configuration in `jest.config.js`

## Development Conventions

### Code Structure
- `src/`: Source files
- `lib/`: Compiled output
- `src/common/`: Shared utilities and translation services
- `src/docApi/`: OpenAPI document processing logic
- `src/types/`: Type definitions
- `src/store/`: State management

### Naming Conventions
- PascalCase for class names
- camelCase for function and variable names
- Constants in UPPER_SNAKE_CASE

### Translation Handling
The project provides comprehensive translation capabilities:
- Supports multiple translation types via `TranslateType` (none, pinyin, english)
- Caches translations in dictionaries for consistency
- Handles Chinese text detection using `is-chinese` library
- Converts Chinese text to pinyin using `pinyin-pro` library
- Provides fallback mechanisms when translation fails
- Integrates with external translation services for enhanced capabilities

### Type Safety
- Strong TypeScript typing throughout
- Uses `openapi-types` for OpenAPI 3.x definitions
- Extensive use of interfaces and type definitions
- Strict mode enabled in TypeScript configuration

## Dependencies

Key dependencies include:
- `axios`: HTTP client for fetching OpenAPI documents
- `do-swagger2openapi`: Swagger to OpenAPI 3.x conversion
- `lodash`: Utility functions
- `traverse`: Object traversal utilities
- `jsonrepair`: JSON format error correction
- `is-chinese`: Chinese text detection
- `pinyin-pro`: Chinese to pinyin conversion
- `openapi-types`: TypeScript definitions for OpenAPI

Dev dependencies include:
- `jest`, `ts-jest`: Testing framework
- `typescript`: Language compiler
- `ts-node`: TypeScript execution runtime

## API Usage

The main export is the `format` function that takes:
- `url`: OpenAPI document URL or object
- `dict`: Dictionary object for translation caching
- `options`: Configuration options including translation type and operation ID usage

Returns a promise resolving to formatted API data with type information.

## Important Files

- `src/format.ts`: Core processing logic
- `src/docApi/index.ts`: API organization and grouping
- `src/docApi/components.ts`: Component management (this is the file currently being worked on)
- `src/common/translate.ts`: Translation services
- `src/docApi/typeItem.ts`: Type representation

## Special Handling

The project has special handling for:
- Complex schema combinations (allOf, anyOf, oneOf) - see the current file components.ts for the implementation
- Chinese text detection, translation and pinyin conversion
- Schema name optimization (removing unnecessarily long names)
- Operation ID normalization
- Module name deduplication
- Translation caching to maintain consistency across runs

## Development Notes

When working with this project, pay attention to:
- The complex logic for handling OpenAPI schema combinations in the `formatCode` method
- The translation caching mechanism that preserves previous translations
- The component organization system that handles multiple schema types
- The type generation system that creates TypeScript interfaces from OpenAPI schemas