## Why

当前 `doc2ts` 项目的 monorepo 结构不规范：根目录既是 pnpm workspace 的根，又是 `doc2ts` npm 包自身。这导致：

1. **职责混淆**：根目录 `package.json` 同时承载了 workspace 编排脚本（如 `publish:all`、`changeset:version`）和 `doc2ts` 包自身的构建/发布配置。
2. **违反 workspace 规范**：`pnpm-workspace.yaml` 中需要同时声明 `packages/*` 和 `.`（根目录），是一种反模式。
3. **发版不可靠**：`changeset publish` 通过 `pnpm` 发布时，由于根目录包的特殊性，遇到 `ERR_PNPM_OTP_NON_INTERACTIVE` 错误，导致无法正常发版。
4. **结构不对称**：`doc-pre-data` 在 `packages/` 下，而 `doc2ts` 却在根目录，两个包的地位不对等。

## What Changes

将根目录的 `doc2ts` 包源码和构建配置迁移到 `packages/doc2ts/` 下，使根目录变为纯粹的 workspace 编排层。

### 具体变更

1. **创建 `packages/doc2ts/`**：将 `src/`、`bin/`、`scripts/`、`tests/`、`tsconfig.json`、`tsconfig.esm.json` 等从根目录迁移到 `packages/doc2ts/`。
2. **拆分 `package.json`**：
   - 根目录：仅保留 workspace 编排脚本（`publish:all`、`changeset:version`、`changeset:publish`）和共享 `devDependencies`。
   - `packages/doc2ts/package.json`：包含该包特有的字段（`name`、`version`、`bin`、`dependencies`、构建脚本等）。
3. **更新 `pnpm-workspace.yaml`**：移除 `.` 根目录声明，只保留 `packages/*`。
4. **更新依赖引用**：`packages/doc2ts` 对 `doc-pre-data` 的依赖改为 `workspace:*`。
5. **更新 `.changeset/config.json`**：`linked` 包名保持 `["doc2ts", "doc-pre-data"]` 不变。
6. **更新根目录的 `.gitignore` / `.npmignore`**：排除新的 workspace 包构建产物路径。

## Capabilities

无新增能力——纯项目结构重构，对外 API 和 CLI 行为完全不变。

## Specs

该变更不涉及新规格说明——本质是对 monorepo 结构的规范化重构。