# DevFlow DSH 插件包（@devflow-core/dsh-devflow）落地计划

Goal: 把 devflow-2 预设 + DevFlow skills + 斜杠命令 + 验证脚本打包成可上传的 DSH 插件子包，其他用户一条 `dsh plugin --profile web add @devflow-core/dsh-devflow` 命令即可获得完整 DevFlow。
Architecture: 仿 dsh-liangshen 分发机制——独立 npm 子包（纯 JS、零运行时依赖、无构建链），`dsh.bundle.patch` 声明 cordis.patch.yml 挂载 Host 插件；插件启动时把包内 `assets/` 四类资产同步到用户 `~/.dsh/`（presets → .agent-presets/，skills → skills/，commands → commands/，scripts → scripts/），冲突策略 devflow-* 权威覆盖、非 devflow 资产永不触碰。
Tech Stack: Node ≥22（ESM）、node:fs/node:path/node:os 原生、零第三方运行时依赖；复刻 liangshen 的 sync/dsh-home/mount-once 逻辑（Apache-2.0，NOTICE 注明）。
Source: Brainstorm Confirmed request（2026-08-19 会话）+ CUT_PASS Cut Decision（B 深度）
Spec coverage: Confirmed request 的 Goal/Scope/Exclusions/Constraints/Acceptance 全部映射到 Task 1-5；无独立 spec 文档
Cut Decision: 允许范围 = 新建 dsh/plugins/dsh-devflow/ 独立子包；复用 liangshen 分发机制与现有 devflow-2 preset 内容；排除 = 不带 devflow 标准版 preset、不动根包名/install:user、不做 Web UI/工具注册、不引入 TypeScript 构建链；验证 = 子包自测 + npm pack 内容 + 根仓库 verify:all 不回归
External Skills: cordis-plugin-development; role: 查询 Host 插件契约（apply/ctx/effect/logger）与 dsh.bundle.patch 挂载格式; expected evidence: 插件代码符合 Cordis 插件契约; return facts: result / not-applicable / failure

## Global Constraints
- 子包必须自包含（npm 发布只带包内文件，不能引用仓库根相对路径）
- 同步只管理 devflow-* 前缀资产；目标目录中其他文件（用户自装 skill/命令/脚本）绝不删除或覆盖
- 字节相同跳过、不同则覆盖；源不再拥有的 devflow-* 目标文件（升级残留）才 prune
- Windows 兼容：Node 22 下不用 `fs.cpSync` recursive（CJK 路径崩溃，nodejs/node#54476），逐条复制并保留 mtime
- 不改根 package.json 的 name/files；不新增根仓库 npm 依赖
- 许可合规：借鉴 liangshen（Apache-2.0）的同步/挂载逻辑，子包 NOTICE 注明出处

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| dsh/plugins/dsh-devflow/package.json | Create | npm 子包元数据：name/type/main/exports/dsh.bundle.patch/files | 子包根标识与挂载声明 | 根包发布 |
| dsh/plugins/dsh-devflow/cordis.patch.yml | Create | bundle patch：插入 `{id: devflow, name: '@devflow-core/dsh-devflow'}` | dsh plugin add 的挂载层 | 业务逻辑 |
| dsh/plugins/dsh-devflow/lib/index.js | Create | Host 插件：解析 DSH home、同步四类资产、可选 announce | 插件入口 | 资产内容本身 |
| dsh/plugins/dsh-devflow/lib/dsh-home.js | Create | DSH_HOME 解析（env override + ~ 展开） | 复刻 liangshen dsh-home（Apache） | 同步逻辑 |
| dsh/plugins/dsh-devflow/lib/mount-once.js | Create | 进程级单实例守卫（Symbol.for 全局注册表） | 防全家桶/独立包双挂载 | 同步逻辑 |
| dsh/plugins/dsh-devflow/lib/sync.js | Create | 四类资产同步：presets/skills/commands/scripts，devflow-* 权威覆盖 + prune | 核心同步引擎 | DSH home 解析 |
| dsh/plugins/dsh-devflow/assets/presets/devflow-2/ | Create | devflow-2 preset 5 文件副本（agent.cordis.yml/preset.yml/tool-bootstrap.mjs/custom-bash.mjs/NOTICE） | 随包分发的预设 | skills/commands/scripts |
| dsh/plugins/dsh-devflow/assets/skills/ | Create | 14 个 devflow-* skill 目录副本（含 references/） | 随包分发的技能 | 其他 skill |
| dsh/plugins/dsh-devflow/assets/commands/ | Create | 11 个 devflow*.toml 副本 | 随包分发的斜杠命令 | 其他命令 |
| dsh/plugins/dsh-devflow/assets/scripts/ | Create | 6 个 devflow-*.js checker 副本（spec/plan/review/debt/audit/doctor） | 随包分发的验证脚本 | 维护脚本（validate-*/install-*） |
| dsh/plugins/dsh-devflow/scripts/sync-assets.js | Create | 从仓库根复制 devflow-* 资产到子包 assets/（防漂移） | 维护者工具 | 用户运行时 |
| dsh/plugins/dsh-devflow/test/sync.test.js | Create | 自测：临时 home 下同步/跳过/覆盖/prune/隔离 | 验证核心契约 | 资产内容 |
| dsh/plugins/dsh-devflow/README.md | Create | 安装命令、行为、冲突策略、发布说明 | 用户文档 | 实现细节 |
| dsh/plugins/dsh-devflow/NOTICE | Create | Apache-2.0 借鉴声明（liangshen/anchored-standard） | 许可合规 | 其他 |
| docs/platform-setup.md | Modify | ## DeepSeek Harness (DSH) 小节 | 补插件一键安装入口 | 其他平台章节 |

## Task 1: 子包骨架（package.json + cordis.patch.yml）

Task: 创建 dsh/plugins/dsh-devflow/ 子包元数据与挂载 patch
Task type: Code change
Files:
- Create: dsh/plugins/dsh-devflow/package.json | new file | npm 子包元数据
- Create: dsh/plugins/dsh-devflow/cordis.patch.yml | new file | bundle 挂载 patch
Interfaces:
- Consumes: npm 包元数据约定（dsh.bundle.patch 指向 cordis.patch.yml，参考 @linxin666/dsh-liangshen package.json）
- Produces: 包名 @devflow-core/dsh-devflow，`dsh plugin add` 可解析
Current behavior: 仓库无此子包
Target behavior: 子包可被 npm pack / dsh plugin add 解析并挂载 Host 插件
Change mechanics: 写入 package.json，字段如下；cordis.patch.yml 为两行 insert：
```json
{
  "name": "@devflow-core/dsh-devflow",
  "version": "0.1.0",
  "description": "DevFlow for DeepSeek Harness: devflow-2 agent preset + skills + commands + verification scripts, synced into ~/.dsh on host startup.",
  "type": "module",
  "engines": { "node": "^22.19.0 || >=24.0.0" },
  "main": "./lib/index.js",
  "exports": { ".": "./lib/index.js", "./package.json": "./package.json", "./assets/*": "./assets/*" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "files": ["lib", "assets", "cordis.patch.yml", "README.md", "NOTICE"],
  "license": "Apache-2.0",
  "scripts": { "sync-assets": "node scripts/sync-assets.js", "test": "node test/sync.test.js" }
}
```
```yaml
# cordis.patch.yml
- insert:
    - id: devflow
      name: '@devflow-core/dsh-devflow'
```
Call impact: 无——新子包，根包不动
Steps:
- [ ] 创建 dsh/plugins/dsh-devflow/package.json，replace 占位内容 with 上述 JSON 字段（name/type/main/exports/dsh.bundle.patch/files/scripts）
- [ ] 创建 dsh/plugins/dsh-devflow/cordis.patch.yml，insert 上述 `- insert:` 两行 before 文件末尾
- [ ] 运行 `node -e "JSON.parse(require('fs').readFileSync('dsh/plugins/dsh-devflow/package.json','utf8'))"`，expected result: 无异常输出
Acceptance: 子包 package.json 含 dsh.bundle.patch 且指向存在的 cordis.patch.yml
Verify: `npm pack --dry-run`（cd dsh/plugins/dsh-devflow），expected result: tarball 列出 package.json 与 cordis.patch.yml
Comments: 无——元数据文件，无注释需求
Not doing: 根包名/version 改动；npm 发布动作本身
Prewalk:

Execution Trace:
- Read: @linxin666/dsh-liangshen/package.json → 模板字段 dsh.bundle.patch、files、exports 含 ./presets/*
- Read: @linxin666/dsh-liangshen/cordis.patch.yml → `- insert:` 挂载格式
- Ran: `npm pack --dry-run`（根仓库）→ 根 tarball 124→139 文件，files 白名单机制生效
- Edited: 根 package.json files 加 "dsh/" → npm 发布包含 dsh/ 目录（上一轮已完成）
- Verified: 根仓库 `npm run verify:all` → ALL PASS (exit 0)

Current Handoff Facts:
- Target anchors: dsh/plugins/dsh-devflow/ 目录；liangshen package.json 为模板
- Nearby convention: quick-cmds-static/package.json 为纯 JS 子包先例（type module、main lib/index.js）
- Direct path: dsh plugin add 读取 dsh.bundle.patch → cordis.patch.yml
- Current constraints: ESM only；Node ^22.19.0
- Planned touch set: lib/*.js、assets/、test/、README.md、NOTICE
- Risks / stop conditions: 无——模板已验证
- Read-basis: @linxin666/dsh-liangshen/package.json、cordis.patch.yml；根 package.json
- Live anchors: dsh/plugins/dsh-devflow/（新目录）

Remaining Structured Worklist:
- [ ] 添加 dsh/plugins/dsh-devflow/package.json 与 cordis.patch.yml 两个文件。
  Anchors: dsh/plugins/dsh-devflow/ 目录。
  Verify: `cd dsh/plugins/dsh-devflow && npm pack --dry-run`，expected result: 成功且列出两个文件。
  Done when: tarball 含 package.json + cordis.patch.yml。

## Task 2: 资产副本（assets/ 四类 + sync-assets 脚本）

Task: 把仓库 devflow-* 资产复制进子包 assets/，并写防漂移同步脚本
Task type: Code change
Files:
- Create: dsh/plugins/dsh-devflow/scripts/sync-assets.js | new file | 从根复制资产
- Create: dsh/plugins/dsh-devflow/assets/presets/devflow-2/ | new file | preset 5 文件副本
- Create: dsh/plugins/dsh-devflow/assets/skills/ | new file | 14 skill 目录副本
- Create: dsh/plugins/dsh-devflow/assets/commands/ | new file | 11 toml 副本
- Create: dsh/plugins/dsh-devflow/assets/scripts/ | new file | 6 checker 副本
Interfaces:
- Consumes: 根目录 skills/devflow-*/、commands/devflow*.toml、scripts/devflow-*.js、dsh/agent-presets/devflow-2/
- Produces: 子包 assets/{presets,skills,commands,scripts}/ 自包含副本
Current behavior: 资产只存在于根仓库
Target behavior: 子包自包含最新资产；sync-assets.js 可随时刷新
Change mechanics: sync-assets.js 按四组清单复制（源 = `path.resolve(__dirname, '../../..')`），逐条 copyFileSync + utimesSync 保 mtime，不删除目标多余文件；每组的 pick 过滤只保留 devflow 前缀：
```js
const groups = [
  { src: 'dsh/agent-presets/devflow-2', dst: 'assets/presets/devflow-2' },
  { src: 'skills', dst: 'assets/skills', pick: (name) => name.startsWith('devflow-') },
  { src: 'commands', dst: 'assets/commands', pick: (name) => name.startsWith('devflow') },
  { src: 'scripts', dst: 'assets/scripts', pick: (name) => /^devflow-.*\.js$/.test(name) },
]
// add 每组: mkdirSync(recursive) + copyFileSync + utimesSync 保 mtime；不 remove 目标多余文件
```
Call impact: 无——仅子包内部
Steps:
- [ ] 创建 dsh/plugins/dsh-devflow/scripts/sync-assets.js，按上述 groups 数组实现复制（mkdirSync + copyFileSync + utimesSync），pseudocode: 见 Change mechanics 代码块
- [ ] 运行 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js`，expected result: assets 四目录生成
- [ ] 重跑同一命令并检查 `git status --porcelain dsh/plugins/dsh-devflow/assets`，expected result: 无变更（幂等）
Acceptance: assets/ 与根 devflow-* 资产逐字节一致；脚本幂等
Verify: 重跑 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 后 `git status --porcelain dsh/plugins/dsh-devflow/assets`，expected result: 无输出
Comments: sync-assets.js 头部注释「发布前必须重跑，防漂移」
Not doing: 自动 prune 目标多余文件；把维护脚本 validate-*/install-* 复制进 assets
Prewalk:

Execution Trace:
- Read: 根 skills/ 目录清单 → 14 个 devflow-* 目录
- Read: 根 commands/ 清单 → 11 个 devflow*.toml
- Read: 根 scripts/ 清单 → 6 个 devflow-*.js checker（spec/plan/review/debt/audit/doctor）
- Read: dsh/agent-presets/devflow-2/ 清单 → 5 文件（agent.cordis.yml/preset.yml/tool-bootstrap.mjs/custom-bash.mjs/NOTICE）
- Ran: 根仓库 `npm run verify:all` → ALL PASS (exit 0)，资产清单为权威

Current Handoff Facts:
- Target anchors: 根 skills/devflow-*、commands/devflow*.toml、scripts/devflow-*.js、dsh/agent-presets/devflow-2/
- Nearby convention: install-devflow-user.js 的 userEntries/presetEntries 数组是权威文件清单
- Direct path: 子包 assets/ ← sync-assets.js ← 根资产
- Current constraints: 逐条复制防 CJK 路径崩溃；preset 只复制 5 文件（与 install:user 的 presetEntries 一致，不含 README）
- Planned touch set: assets/ 四目录 + sync-assets.js
- Risks / stop conditions: 根资产新增 devflow-* 文件时 pick 通配自动覆盖，无需改脚本
- Read-basis: install-devflow-user.js userEntries/presetEntries；根 skills/commands/scripts 清单
- Live anchors: dsh/plugins/dsh-devflow/assets/ 生成结果

Remaining Structured Worklist:
- [ ] 添加 dsh/plugins/dsh-devflow/scripts/sync-assets.js 并运行生成 assets/ 四目录。
  Anchors: 根 skills/、commands/、scripts/、dsh/agent-presets/devflow-2/。
  Verify: 重跑脚本后 `git status --porcelain dsh/plugins/dsh-devflow/assets`，expected result: 无变更。
  Done when: assets 四目录存在且与根逐字节一致。

## Task 3: Host 插件（lib/index.js + dsh-home + mount-once + sync）

Task: 实现插件启动同步四类资产到 ~/.dsh/
Task type: Code change
Files:
- Create: dsh/plugins/dsh-devflow/lib/dsh-home.js | new file | DSH_HOME 解析
- Create: dsh/plugins/dsh-devflow/lib/mount-once.js | new file | 单实例守卫
- Create: dsh/plugins/dsh-devflow/lib/sync.js | new file | 四类同步引擎
- Create: dsh/plugins/dsh-devflow/lib/index.js | new file | Cordis 插件入口
Interfaces:
- Consumes: cordis ctx（apply(ctx)）；node:fs/node:path/node:os；可选 ctx.get('systemPrompt')
- Produces: export { name, apply }（Cordis 插件契约）
Current behavior: 无插件
Target behavior: 插件启动时四组同步到 ~/.dsh/；字节相同跳过、不同覆盖；源不再拥有且目标为 devflow-* 前缀的文件才删；非 devflow 资产不动
Change mechanics: 复刻 liangshen 逻辑，四个文件核心实现（pseudocode）：
```js
// dsh-home.js: resolveDshHome() 读 env.DSH_HOME（优先），否则 join(homedir(), '.dsh')；expandHome 展开 ~
// mount-once.js: const MOUNTED = Symbol.for('dsh-devflow.mounted')；首挂 add 到全局 Set，ctx.effect disposer remove
// sync.js: sameFile() 比较 size+mtime+字节；syncTree() 逐条 copyFileSync；prune() 只 remove nameFilter 匹配的目标文件
// index.js: export const name = 'devflow'；apply(ctx) 内 const home = dshHome()，依次 sync 四组并 ctx.logger?.info
```
Call impact: 无——新插件；与 install:user 并存（同路径文件被插件权威覆盖，符合用户选择）
Steps:
- [ ] 创建 dsh/plugins/dsh-devflow/lib/dsh-home.js，insert resolveDshHome/expandHome 函数 before 文件末尾（env 优先、~ 展开、默认 ~/.dsh）
- [ ] 创建 dsh/plugins/dsh-devflow/lib/mount-once.js，insert Symbol.for('dsh-devflow.mounted') 守卫与 ctx.effect disposer before 文件末尾
- [ ] 创建 dsh/plugins/dsh-devflow/lib/sync.js，insert sameFile/syncTree/prune 与四组调用 before 文件末尾（presets/skills/commands/scripts，各带 nameFilter）
- [ ] 创建 dsh/plugins/dsh-devflow/lib/index.js，insert export { name, apply } before 文件末尾，apply 内解析 dshHome 后同步四组并日志
- [ ] 运行 `node --check dsh/plugins/dsh-devflow/lib/index.js dsh/plugins/dsh-devflow/lib/sync.js dsh/plugins/dsh-devflow/lib/dsh-home.js dsh/plugins/dsh-devflow/lib/mount-once.js`，expected result: 无语法错误
Acceptance: 插件代码语法正确；四组同步目标路径正确；prune 只删 devflow-* 前缀
Verify: `node --check` 四文件，expected result: 无输出；Task 4 自测覆盖行为
Comments: 每个借鉴自 liangshen 的文件头部注释「Adapted from @linxin666/dsh-liangshen (Apache-2.0)」
Not doing: TypeScript/构建链；systemPrompt 硬注入；Web UI/工具注册
Prewalk:

Execution Trace:
- Read: liangshen src/index.ts → apply 结构（mountOnce 包裹、sync + systemPrompt.section、ctx.logger）
- Read: liangshen src/sync.ts → syncOnePreset/syncPresetTrees/pruneExtras/copyTreeSync/sameFile
- Read: liangshen src/mount-once.ts → Symbol.for 全局注册表 + ctx.effect disposer
- Read: liangshen src/dsh-home.ts → resolveDshHome（env 优先、~ 展开、相对 CWD）
- Ran: `node --check dsh/plugins/quick-cmds-static/lib/index.js` → 无语法错误，确认纯 JS ESM 插件可行

Current Handoff Facts:
- Target anchors: liangshen 四个 src 文件为复刻模板；cordis ctx 契约（apply(ctx)、ctx.logger、ctx.effect、ctx.get）
- Nearby convention: quick-cmds-static/lib/index.js 纯 JS ESM export { apply, inject } 先例
- Direct path: dsh plugin add → cordis.patch.yml → lib/index.js apply
- Current constraints: 零第三方依赖；mountOnce symbol 用独立命名空间 Symbol.for('dsh-devflow.mounted')
- Planned touch set: lib 四文件 + test/sync.test.js
- Risks / stop conditions: ctx.logger 用可选链防御；systemPrompt 用 ctx.get 可选
- Read-basis: liangshen src/{index,sync,mount-once,dsh-home}.ts
- Live anchors: lib/ 四文件语法与导出

Remaining Structured Worklist:
- [ ] 添加 dsh/plugins/dsh-devflow/lib/ 四文件并通过 `node --check` 验证。
  Anchors: liangshen src/ 四个模板文件。
  Verify: `node --check dsh/plugins/dsh-devflow/lib/index.js dsh/plugins/dsh-devflow/lib/sync.js dsh/plugins/dsh-devflow/lib/dsh-home.js dsh/plugins/dsh-devflow/lib/mount-once.js`，expected result: 无输出。
  Done when: 无语法错误，apply 导出完整。

## Task 4: 子包自测（test/sync.test.js）

Task: 用临时 home 验证同步契约（创建/跳过/覆盖/prune/隔离）
Task type: Code change
Files:
- Create: dsh/plugins/dsh-devflow/test/sync.test.js | new file | 行为自测
Interfaces:
- Consumes: lib/sync.js 的同步函数（node 直接 import）
- Produces: 断言结果（进程退出码 0/非 0）
Current behavior: 无测试
Target behavior: 覆盖五场景：①空 home → 四组资产全创建；②重跑 → 全部 current（幂等）；③改目标文件字节 → 重新覆盖；④目标放非 devflow 文件 → 保留不删；⑤目标放 devflow-* 残留 → prune
Change mechanics: 用 fs.mkdtempSync 建临时 DSH home（.agent-presets/skills/commands/scripts），直接 import lib/sync.js 的同步函数，node:assert 断言（pseudocode）：
```js
// 场景①: check fs.existsSync(join(home, 'skills/devflow-core/SKILL.md')) 等四组各一
// 场景②: 第二次调用返回 current 集合且目标字节不变
// 场景③: 改写目标文件字节后重同步 → 字节恢复
// 场景④: 放 unrelated.txt 重同步 → 仍存在（不 remove）
// 场景⑤: 放 devflow-stale.txt 重同步 → 已 remove
```
Call impact: 无——仅子包测试
Steps:
- [ ] 创建 dsh/plugins/dsh-devflow/test/sync.test.js，insert 五场景断言 before 文件末尾（mkdtempSync 临时 home + node:assert）
- [ ] 运行 `node dsh/plugins/dsh-devflow/test/sync.test.js`，expected result: 打印 "DevFlow DSH plugin sync test passed"
Acceptance: 五场景全过；失败非零退出
Verify: `node dsh/plugins/dsh-devflow/test/sync.test.js`，expected result: passed 输出且退出码 0
Comments: 测试头部注明场景清单
Not doing: 引入 vitest/jest 等依赖（纯 node:assert）
Prewalk:

Execution Trace:
- Read: liangshen src/sync.test.ts → 临时目录 + 断言风格
- Read: scripts/devflow-plan.js 的自测模式 → node:assert + process.exit 风格
- Ran: `node -e "console.log(require('node:assert').ok(1))"` → 无异常，node:assert 可用
- Verified: 根仓库 `npm run verify:all` → ALL PASS (exit 0)

Current Handoff Facts:
- Target anchors: lib/sync.js 导出的同步函数
- Nearby convention: 仓库 scripts/*.js 用 node:assert + process.exit 风格
- Direct path: npm test（子包）→ node test/sync.test.js
- Current constraints: 纯 node:assert；测试内 DSH_HOME 用临时目录
- Planned touch set: test/sync.test.js
- Risks / stop conditions: sync.js 需导出可测函数（不只 apply 内闭包）
- Read-basis: liangshen src/sync.test.ts；scripts/devflow-plan.js 自测段
- Live anchors: lib/sync.js 导出签名

Remaining Structured Worklist:
- [ ] 添加 dsh/plugins/dsh-devflow/test/sync.test.js 五场景断言并运行验证。
  Anchors: lib/sync.js 导出。
  Verify: `node dsh/plugins/dsh-devflow/test/sync.test.js`，expected result: passed 且退出码 0。
  Done when: 输出 "DevFlow DSH plugin sync test passed"。

## Task 5: 文档与集成验证

Task: 子包 README/NOTICE + 根仓库文档更新 + 全量验证
Task type: Code change
Files:
- Create: dsh/plugins/dsh-devflow/README.md | new file | 安装/行为/发布说明
- Create: dsh/plugins/dsh-devflow/NOTICE | new file | 许可声明
- Modify: docs/platform-setup.md | ## DeepSeek Harness (DSH) | 补插件一键安装入口
Interfaces:
- Consumes: 子包事实（包名/安装命令/冲突策略）
- Produces: 用户可读文档
Current behavior: 文档只有 install:user 路径
Target behavior: README 写明 `dsh plugin --profile web add @devflow-core/dsh-devflow`、装完重启、预设选择「DevFlow 2.0 (Anchored)」、冲突策略；platform-setup.md DSH 章节补「或用插件一键安装」
Change mechanics: README 七小节（安装命令/同步内容表/冲突策略/升级更新/发布步骤/与 install:user 关系/Windows 提示）；NOTICE 声明借鉴 liangshen（Apache-2.0）与 anchored-standard（MIT）；platform-setup.md 在「User-level install」段后加一小节（pseudocode）：
```md
### 插件一键安装（可选）
npm run install:user 仍是首选；也可发布并安装 @devflow-core/dsh-devflow 插件：
npx @deepseek-ai/dsh plugin --profile web add @devflow-core/dsh-devflow
装完重启 web；插件启动时把 preset/skills/commands/scripts 同步到 ~/.dsh/。
```
README 升级更新小节（pseudocode）：
```md
### 升级更新
DevFlow-Core 仓库发布新版本后，重跑 dsh/plugins/dsh-devflow/scripts/sync-assets.js
刷新子包资产，bump 子包版本并重新 npm publish；已安装用户执行
npx @deepseek-ai/dsh plugin --profile web update @devflow-core/dsh-devflow（或 remove + add）
并重启 web，插件启动时自动把新资产同步到 ~/.dsh/（字节相同跳过，升级残留 prune）。
```
Call impact: 无——文档
Steps:
- [ ] 创建 dsh/plugins/dsh-devflow/README.md，insert 六小节内容 before 文件末尾（安装命令/同步内容/冲突策略/发布/关系/Windows），pseudocode: 见 Change mechanics
- [ ] 创建 dsh/plugins/dsh-devflow/NOTICE，insert 两段借鉴声明 before 文件末尾（liangshen Apache-2.0、anchored-standard MIT）
- [ ] 修改 docs/platform-setup.md 的 `## DeepSeek Harness (DSH)` 小节，insert 插件一键安装小节 before 「## Updating An Installed Project」
- [ ] 根仓库运行 `npm run verify:all`，expected result: ALL PASS (exit 0)
- [ ] 子包目录运行 `npm pack --dry-run`，expected result: tarball 含 lib/assets/cordis.patch.yml/README.md/NOTICE
Acceptance: 文档齐全；根 verify:all 全绿；子包 pack 内容完整
Verify: `npm run verify:all`（根）+ `cd dsh/plugins/dsh-devflow && npm pack --dry-run`，expected result: 两者均 pass
Comments: README 说明 Windows custom-bash 提示（bashPath 需指向本机 Git，参照 docs/dsh-plugins-guide.md 7.1）
Not doing: 上传 npm registry 本身（用户操作）；改根包发布
Prewalk:

Execution Trace:
- Read: docs/platform-setup.md DSH 章节（L172-195）→ 现有 install:user 说明
- Read: dsh/agent-presets/devflow-2/README.md → 现有预设说明
- Read: docs/dsh-plugins-guide.md 7.1 → Windows custom-bash 提示
- Ran: 根仓库 `npm run verify:all`（上一轮）→ ALL PASS (exit 0)
- Verified: 根仓库 `npm run user:verify` → User installer validation passed

Current Handoff Facts:
- Target anchors: docs/platform-setup.md「## DeepSeek Harness (DSH)」小节；子包 README 新文件
- Nearby convention: dsh/plugins/quick-cmds-static/README.md 为子包文档先例
- Direct path: 无代码消费者——文档
- Current constraints: platform-setup.md 结构不动（只加小节）；README 用中文（用户语言）
- Planned touch set: 子包 README/NOTICE + platform-setup.md
- Risks / stop conditions: 根 verify:all 若因子包失败（不应发生，子包不在根校验面）→ 返回 Core
- Read-basis: docs/platform-setup.md DSH 章节；devflow-2/README.md；docs/dsh-plugins-guide.md 7.1
- Live anchors: docs/platform-setup.md「## DeepSeek Harness (DSH)」小节位置

Remaining Structured Worklist:
- [ ] 添加子包 README.md/NOTICE 与 platform-setup.md 小节，并运行 npm run verify:all 与子包 pack 验证。
  Anchors: docs/platform-setup.md DSH 小节。
  Verify: `npm run verify:all` 退出码 0 且 `cd dsh/plugins/dsh-devflow && npm pack --dry-run` 列出四类文件，expected result: 均 pass。
  Done when: 文档落地且两处验证通过。
