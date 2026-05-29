## Design

### 目标结构

```
doc2ts/                              # root — workspace 编排层（private, 不发布）
├── package.json                     # 仅 scripts + 共享 devDependencies
├── pnpm-workspace.yaml              # packages/*  only
├── .changeset/                       # changeset 配置（不变）
├── AGENTS.md                        # 更新为 workspace 级说明
├── packages/
│   ├── doc2ts/                      # 迁移后的主包
│   │   ├── src/                     # ← 从根目录 src/ 迁移
│   │   ├── bin/                     # ← 从根目录 bin/ 迁移
│   │   ├── scripts/                 # ← 从根目录 scripts/ 迁移
│   │   ├── tests/                   # ← 从根目录 tests/ 迁移
│   │   ├── tsconfig.json            # ← 从根目录迁移
│   │   ├── tsconfig.esm.json        # ← 从根目录迁移
│   │   ├── package.json             # 迁移 + 重构
│   │   ├── .npmignore               # 从根目录迁移
│   │   └── README.md                # 可选迁移
│   └── doc-pre-data/                # 不变
│       └── ...
```

### package.json 拆分策略

**根 `package.json`** → 变为 workspace-only，`private: true` 确保不会发布：

```json
{
  "name": "doc2ts-monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm -r run build",
    "changeset": "changeset",
    "changeset:version": "changeset version",
    "changeset:publish": "pnpm -r run build && changeset publish",
    "publish:all": "pnpm changeset:version && pnpm install && pnpm changeset:publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.29.8",
    "typescript": "^5.5.3",
    "ts-node": "^10.9.2"
  }
}
```

**`packages/doc2ts/package.json`** → 继承原根 `package.json` 中除 workspace 脚本外的全部字段：
- `name`、`version`、`description`、`bin`、`main`、`module`、`types`、`exports` 保持不变
- `scripts` 仅保留构建/测试/dev 相关（去掉 `changeset*` 和 `publish:all`）
- `dependencies` 原样保留（`doc-pre-data: workspace:*` 不变）
- `devDependencies` 原样保留（去掉 `@changesets/cli`）

### tsconfig 路径修正

当前 `doc2ts` 的 tsconfig 中（如果有配置 paths），需要将：
```json
// before（根目录视角）
"paths": { "doc-pre-data": ["./packages/doc-pre-data/src/index.ts"] }
```
改为：
```json
// after（packages/doc2ts/ 视角）
"paths": { "doc-pre-data": ["../doc-pre-data/src/index.ts"] }
```

如果当前 tsconfig 没有显式 paths 配置，则无需修改——pnpm workspace 的软链接机制 (`node_modules/doc-pre-data` → `packages/doc-pre-data`) 在构建时通过 `workspace:*` 协议自动生效。

### pnpm-workspace.yaml

```yaml
# before
packages:
  - packages/*
  - .

# after
packages:
  - packages/*
```

移除 `.` 根目录声明，根目录不再是 workspace 成员包。

### Changeset 发版兼容性

`.changeset/config.json` 中的 `linked` 配置引用的是 **npm 包名**（`"doc2ts"` 和 `"doc-pre-data"`），包名不变，所以 changeset 的 link 逻辑不受影响。

发版流程不变：
```bash
pnpm publish:all
# 1. changeset version → 根据 changeset 升级版本
# 2. pnpm install → 更新 workspace 内部依赖
# 3. changeset publish → 先 pnpm -r run build 构建所有包，再发布有变更的包
```

### 风险点与缓解

| 风险 | 缓解措施 |
|------|----------|
| `bin/doc2api.js` 中的 `require('../lib/...')` 路径失效 | `bin/` 和 `lib/` 同时迁移到 `packages/doc2ts/`，相对路径关系不变 |
| `scripts/build.ts` 中的 `__dirname` 路径失效 | 同上，`scripts/` 和 `src/`、`lib/` 一起迁移 |
| git 历史丢失 | 迁移完成后运行一次完整构建，确认产物与迁移前一致（相同的文件数和内容） |
| 本地开发时 ts-node 路径解析错误 | 迁移后运行 `pnpm dev` 验证，确保 docs-pre-data 的 workspace 软链接正常 |
| OTP 发版问题 | 迁移后 `changeset publish` 仍然可能遇到 pnpm OTP 问题，这是 pnpm 的 bug，与结构无关。后续考虑将 `changeset:publish` 脚本改为使用 `npm` 发布单包 |