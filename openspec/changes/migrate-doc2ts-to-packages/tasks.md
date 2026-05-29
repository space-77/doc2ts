## 1. 创建 `packages/doc2ts/` 目录并迁移源码文件

- [x] 1.1 创建 `packages/doc2ts/` 目录结构（`src/`、`bin/`、`scripts/`、`tests/`）
- [x] 1.2 将根目录 `src/` 完整复制到 `packages/doc2ts/src/`
- [x] 1.3 将根目录 `bin/` 完整复制到 `packages/doc2ts/bin/`
- [x] 1.4 将根目录 `scripts/` 完整复制到 `packages/doc2ts/scripts/`
- [x] 1.5 将根目录 `tests/` 完整复制到 `packages/doc2ts/tests/`
- [x] 1.6 复制 `tsconfig.json`、`tsconfig.esm.json` 到 `packages/doc2ts/`
- [x] 1.7 复制 `.npmignore` 到 `packages/doc2ts/`
- [x] 1.8 复制 `CHANGELOG.md`、`LICENSE`、`README.md`、`README_CN.md` 到 `packages/doc2ts/`

## 2. 创建 `packages/doc2ts/package.json`

- [x] 2.1 从根 `package.json` 中提取 `doc2ts` 包专属字段，创建 `packages/doc2ts/package.json`
  - 包含：`name`, `version`, `description`, `main`, `module`, `types`, `exports`, `type`, `bin`
  - 包含：`repository`, `bugs`, `homepage`, `author`, `license`, `keywords`
  - 包含：`dependencies`（含 `doc-pre-data: workspace:*`）
  - 包含：`devDependencies`（去掉 `@changesets/cli`）
  - 包含：构建/TEST/dev 相关 `scripts`（去掉 `changeset*` 和 `publish:all`）
  - 包含：`nodemonConfig`, `prettier`
- [x] 2.2 更新 `packages/doc2ts/package.json` 的 `scripts`：
  - `build` → `npm run clean && npm run build:cjs && npm run build:esm`
  - 其他脚本与迁移前根目录一致
- [x] 2.3 确认 `dependencies` 中 `doc-pre-data` 使用 `workspace:*` 协议

## 3. 改造根 `package.json` 为 workspace 编排层

- [x] 3.1 修改根 `package.json`：
  - 设置 `"private": true`
  - 改 `name` 为 `doc2ts-monorepo`（或保留原名，但添加 `private: true` 防误发布）
  - 删除 `version`, `description`, `main`, `module`, `types`, `exports`, `type`, `bin`
  - 删除 `repository`, `bugs`, `homepage`, `author`, `license`, `keywords`
  - 删除 `dependencies`、`nodemonConfig`, `prettier`
  - `devDependencies` 仅保留：`@changesets/cli`, `typescript`, `ts-node`
  - `scripts` 仅保留：`changeset`, `changeset:version`, `changeset:publish`, `publish:all`
  - 添加 `"build": "pnpm -r run build"` 用于一次性构建所有包

## 4. 更新 pnpm workspace 配置

- [x] 4.1 修改 `pnpm-workspace.yaml`：移除根目录声明 `- .`，仅保留 `packages: - packages/*`

## 5. 删除根目录冗余文件

- [x] 5.1 删除根目录下的 `src/`（已迁移到 `packages/doc2ts/src/`）
- [x] 5.2 删除根目录下的 `bin/`（已迁移）
- [x] 5.3 删除根目录下的 `scripts/`（已迁移）
- [x] 5.4 删除根目录下的 `tests/`（已迁移）
- [x] 5.5 删除根目录下的 `tsconfig.json`、`tsconfig.esm.json`（已迁移）
- [x] 5.6 删除根目录下的 `.npmignore`（已迁移）
- [x] 5.7 删除根目录下的 `CHANGELOG.md`、`README.md`、`README_CN.md`（已迁移）
- [x] 5.8 清理根目录下的多余 dotfiles（`.eslintrc.js`, `.eslintignore` 已复制到 `packages/doc2ts/`）

## 6. 验证构建

- [x] 6.1 运行 `pnpm install` 确保 workspace 依赖正确安装
- [x] 6.2 在 `packages/doc-pre-data` 中运行 `npm run build` 确认构建正常
- [x] 6.3 在 `packages/doc2ts` 中运行 `npm run build` 确认构建正常
- [x] 6.4 运行 `pnpm -r run build`（根目录）确认所有包都能构建成功
- [x] 6.5 检查 `packages/doc2ts/lib/` 产物与迁移前 `lib/` 产物对比（文件数量和关键内容一致）

## 7. 验证发版流程

- [x] 7.1 运行 `pnpm changeset` 创建一个测试 changeset（仅验证不改版本）
- [x] 7.2 运行 `pnpm changeset:version` 确认能正确解析 workspace 包版本
- [x] 7.3 运行 `pnpm changeset:publish --dry-run` 确认 `changeset publish` 能正确识别两个包
- [x] 7.4 验证 `doc2ts` 和 `doc-pre-data` 的 linked 关系仍然生效

## 8. 更新 AGENTS.md

- [x] 8.1 更新根 `AGENTS.md` 反映新的 workspace 结构（命令、项目结构等）
- [x] 8.2 确保 `packages/doc2ts/AGENTS.md` 和 `packages/doc-pre-data/AGENTS.md` 各自准确描述自己的构建命令