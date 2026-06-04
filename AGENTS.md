# AGENTS.md

This file provides guidance to AI coding agents working in the doc2ts monorepo.

doc2ts is a TypeScript CLI tool that generates TypeScript/JavaScript API client code from Swagger/OpenAPI documentation. The project uses pnpm workspaces to manage multiple packages.

## Repository Structure

```
doc2ts/                              # workspace root (private, not published)
├── package.json                     # workspace-level scripts only
├── pnpm-workspace.yaml              # defines workspace members
├── .changeset/                      # changeset release management
├── packages/
│   ├── doc2ts/                      # CLI tool + API client generator
│   │   ├── src/builder/             # Core code generation logic
│   │   ├── bin/                     # CLI entry points
│   │   └── package.json
│   └── doc-pre-data/                # OpenAPI data processing library
│       ├── src/docApi/              # API documentation parsing
│       ├── src/common/              # Shared utilities (translate, AI naming)
│       └── package.json
```

## Workspace Commands

All commands are run from the repository root:

```bash
pnpm install            # Install all workspace dependencies
pnpm -r run build       # Build all packages
pnpm build              # Shortcut: build all packages

pnpm changeset          # Create a changeset
pnpm changeset:version  # Version packages based on changesets
pnpm publish:all        # Full release: version → install → publish

# doc2ts
pnpm --filter doc2ts publish
```

## Package-specific Commands

### packages/doc2ts

```bash
cd packages/doc2ts
npm run build           # Build CJS + ESM
npm run dev             # Dev mode with ts-node
npm run test            # Run CLI tool for manual testing
npm run test:unit       # Run unit tests
```

### packages/doc-pre-data

```bash
cd packages/doc-pre-data
npm run build           # Build CJS + ESM
npm test                # Run Jest tests
```

## Important Notes

- Root package.json is `"private": true` — never published to npm
- Both packages (`doc2ts`, `doc-pre-data`) are linked via changeset config
- The `doc2ts` package depends on `doc-pre-data` via `workspace:*`
- Follow the AGENTS.md in each package for package-specific conventions