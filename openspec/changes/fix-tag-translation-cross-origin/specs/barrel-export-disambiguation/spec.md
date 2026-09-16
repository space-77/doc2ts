## Purpose

保证 doc2ts 在多个数据源（origin）的模块汇总到同一个 `index.ts` barrel 时，跨 origin 重名的导出标识符被确定性消歧，使生成的 barrel 不含重复导出、能通过 TypeScript 编译，同时让未冲突的导出名保持稳定不变。

## ADDED Requirements

### Requirement: 跨 origin 重名导出消歧

当多个数据源（origin）生成的模块拥有相同的导出标识符时，barrel 文件（`index.ts`）SHALL 为这些冲突的导出标识符追加各自 origin 的前缀以消除歧义。未发生跨 origin 冲突的导出标识符 SHALL 保持原名，不得追加前缀。

消歧 MUST 通过 re-export 的别名语法实现（`export { <原导出名> as <消歧后名> }`），MUST NOT 直接改写被 re-export 的成员名。因为模块文件实际导出的成员名不变（仍为 `audit`、`signIn` 等），barrel 必须以 `as` 保留原名作为来源成员。

#### Scenario: 两个 origin 存在同名模块

- **WHEN** origin `buddy` 与 origin `buddyV2` 均生成了模块 `audit`，两个模块文件内部均导出名为 `audit` 的成员
- **THEN** barrel 中分别为 `export { audit as buddyAudit } from './buddy/audit'` 与 `export { audit as buddyV2Audit } from './buddyV2/audit'`，对外的导出名分别为 `buddyAudit` 与 `buddyV2Audit`

#### Scenario: 三个 origin 存在同名模块

- **WHEN** origin `buddy`、`buddyV2`、`trae` 均生成了模块 `signIn`
- **THEN** barrel 中分别为 `signIn as buddySignIn`、`signIn as buddyV2SignIn`、`signIn as traeSignIn`，对外导出名三者互不重复

#### Scenario: 未冲突的导出名保持不变

- **WHEN** 某模块名仅在一个 origin 中出现（如 `trae` 的 `integralTrend`）
- **THEN** barrel 中该导出保持为 `export { integralTrend } from './trae/integralTrend'`，不追加 origin 前缀，也不使用 `as` 别名

### Requirement: 消歧输出为合法 TypeScript 标识符

追加的 origin 前缀 SHALL 被清洗为合法的 TypeScript 标识符片段：非标识符字符（连字符、点号、空格等）MUST 被移除或替换；当前缀以数字开头时 MUST 添加下划线前缀（因 `_.camelCase` 不处理前导数字，会生成 `123SignIn` 这类非法标识符）。匿名 origin（`name` 为空）SHALL 回退为固定前缀。模块路径中的引号与反斜杠 MUST 被转义，保证生成的字符串字面量语法合法。

#### Scenario: 数字开头的 origin 名

- **WHEN** origin 名为 `123` 与 `456`，且两者存在同名模块 `signIn`
- **THEN** barrel 中导出名为 `_123SignIn` 与 `_456SignIn`，均为合法标识符

#### Scenario: 含连字符的 origin 名

- **WHEN** origin 名为 `swagger-api` 与 `local-api`，且两者存在同名模块
- **THEN** 前缀被清洗为 `swaggerApi` 与 `localApi`，生成的标识符合法

#### Scenario: 模块路径含引号

- **WHEN** 模块路径中包含单引号（如 `./a'b/signIn`）
- **THEN** 生成的 `from` 字面量中该引号被转义，语句语法合法

### Requirement: barrel 无重复导出且可通过类型检查

生成的 `index.ts` SHALL 不含重复的导出标识符，且该文件 SHALL 能通过 TypeScript 编译——既不产生 `TS2300: Duplicate identifier`（重复导出名），也不产生 `TS2305`/`TS2614`/`TS2724`（re-export 了目标模块中不存在的成员）。消歧结果 SHALL 是确定性的：相同输入下多次生成得到相同的导出名与相同的行序。同一模块被重复登记时 SHALL 被去重，不得产生重复导出。

#### Scenario: 重复生成结果一致

- **WHEN** 在输入文档不变的情况下连续执行两次生成
- **THEN** 两次生成的 `index.ts` 内容逐字节一致，冲突导出名的前缀分配与行序均不随输入顺序改变

#### Scenario: 消歧后的 barrel 通过类型检查

- **WHEN** 对包含跨 origin 同名模块的配置生成代码后，对生成的 `index.ts` 执行类型检查
- **THEN** 既不产生重复标识符错误，也不产生"模块没有导出成员"类错误（即 `index.ts` 自身零错误）

#### Scenario: 每个导出都能解析到真实成员

- **WHEN** 对 barrel 中每条导出语句，检查其 `from` 目标模块是否实际导出了 `as` 左侧的成员名
- **THEN** 每条导出都能在对应模块文件中找到该成员的实际导出声明

#### Scenario: 同一模块被重复登记

- **WHEN** 相同的模块（导出名与路径均相同）在导出条目中出现两次
- **THEN** barrel 中只生成一条导出，不产生重复标识符

#### Scenario: 导出指向正确的模块文件

- **WHEN** 导出名被追加 origin 前缀后
- **THEN** 该导出的来源路径仍指向对应 origin 目录下的模块文件，且导出的类实例为对应模块的实例

### Requirement: 未冲突导出名不被消歧名抢占

消歧 SHALL 优先为未冲突的导出名保留原名；冲突名追加前缀后若与某个未冲突名相同，MUST 由该冲突名让位（追加数字后缀），SHALL NOT 改变未冲突名的名称。

#### Scenario: 非冲突名恰好等于某冲突名的消歧结果

- **WHEN** origin `z` 与 `z2` 均有模块 `a`（冲突，消歧为 `zA`/`z2A`），同时存在未冲突的模块 `zA`
- **THEN** 未冲突的 `zA` 保持为 `zA`，冲突项被调整为 `zA1` 或等价后缀

### Requirement: 消歧不影响模块文件与单 origin 命名

导出名消歧 SHALL 仅作用于 barrel 文件的导出标识符，SHALL NOT 改变各 origin 目录下的模块文件名，也 SHALL NOT 改变单个 origin 内部既有的模块名去重机制。

#### Scenario: 模块文件名保持原样

- **WHEN** origin `buddy` 与 `buddyV2` 均生成 `audit` 模块
- **THEN** 文件仍分别位于 `buddy/audit.ts` 与 `buddyV2/audit.ts`，文件名未被追加前缀

#### Scenario: 单 origin 内重名仍由既有机制处理

- **WHEN** 同一 origin 内出现两个同名模块
- **THEN** 仍由该 origin 既有的重名后缀机制处理，与跨 origin 消歧互不干扰
