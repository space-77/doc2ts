# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript library that processes and formats OpenAPI 3.0 and Swagger 2.0 specifications for TypeScript/JavaScript code generation. It specializes in Chinese language support with translation and pinyin conversion capabilities.

## Essential Commands

```bash
# Development
npm run dev          # Run development mode with ts-node
npm run build        # Compile TypeScript to JavaScript (lib/)
npm run test         # Run Jest tests
npm run openapi      # Execute OpenAPI processing

# Testing specific files
npm test src/__tests__/common/utils.test.ts
```

## Architecture Overview

### Core Processing Flow
1. **Input**: OpenAPI 3.0 or Swagger 2.0 JSON/YAML data
2. **Conversion**: Swagger 2.0 → OpenAPI 3.0 (using do-swagger2openapi)
3. **Processing**: Chinese text detection, translation, pinyin conversion
4. **Output**: Structured data ready for TypeScript/JavaScript code generation

### Key Modules

**Format Module (src/format.ts)**
- Main entry point for OpenAPI processing
- Handles Swagger to OpenAPI conversion
- Manages translation and Chinese text processing
- Validates ECMAScript keywords and safe naming

**DocApi Module (src/docApi/)**
- `index.ts`: Core API documentation processing logic
- `components/`: Individual processors for OpenAPI components
  - `schemas.ts`: Schema definitions processing
  - `parameters.ts`: Parameter handling
  - `requestBodies.ts`: Request body processing
  - `custom.ts`: Custom component handling
- `typeItem.ts`: Type information management

**Translation System (src/common/translate.ts)**
- Multi-language translation support
- Chinese text detection and pinyin conversion
- Translation dictionary management

### Data Flow
```
OpenAPI/Swagger Input → Format Module → DocApi Processing → Component Processing → Translation → Output
```

### Key Features
- **Chinese Language Support**: Automatic detection and processing of Chinese text with pinyin conversion
- **Translation Integration**: Built-in translation for API documentation
- **Name Validation**: ECMAScript keyword validation and safe naming conventions
- **Type Safety**: Full TypeScript implementation with strict typing

### Testing
- Jest with ts-jest for TypeScript support
- Test files in `src/__tests__/`
- Mock data in `mock/` directory for testing various scenarios

### Development Notes
- Source code in `src/`, compiled output in `lib/`
- Use `src/dev.ts` for development testing with mock data
- Translation dictionaries stored in JSON format
- Supports both URL fetching and local file processing