# DevFlow-Core Agent Harness 流程检查与迭代规划

Status: draft
Goal: 以 agent harness 开发架构师视角检查 DevFlow-Core 当前流程，形成流程快照与架构评估；盘点 2026-07-31 harness 迭代剩余工作（P2-6 本地观测日志、docs/iteration-plan.md 长期迭代文档），并给出后续迭代规划候选
Architecture: 复用现有 7 层 harness 架构（Prompt/Loop/Harness/Context/Memory/Eval-verifier/Orchestration）与零依赖校验器模式；不新增依赖、不新增目录、不改流程语义
Tech Stack: Node.js 标准库（node:fs、node:path、node:crypto）+ Markdown 文档
Source: 本次架构师流程检查（2026-07-31 调查结论）；基于 2026-07-31-devflow-harness-iteration.md 的剩余任务
Spec coverage: design-only——本次检查结论 + 2 个收尾任务 + 迭代规划候选逐条映射
External Skills: none

## 1. 流程检查结论（架构师视角）

### 1.1 流程架构全景

DevFlow-Core 是一套可安装、可校验、跨平台运行的 agent 开发流程框架，当前 `verify:all` 全绿（16 个 npm script 串联，零外部依赖）。

```text
入口面（多平台适配器，薄接口）
  AGENTS.md / CLAUDE.md / .codebuddy/RULE.mdc / .github/copilot-instructions.md
  plugin.json / gemini-extension.json / commands/*.toml / hooks/*

路由面（devflow-core，非唯一状态才回 Core）
  Fast / Problem / Design-lite / Design / Build / Recovery

生命周期面（确定性成功边直连，异常返回 Core）
  A: Brainstorm -> Spec -> Cut -> Plan -> Build -> Prove
  B: Brainstorm -> Cut -> Plan -> Build -> Prove
  C: Brainstorm -> Cut -> Build -> Prove
  CUT_REDUCE/REUSE/BLOCKED, scope drift, BUILD_BLOCKED,
  Proof FAIL/BLOCKED, PUA recovery -> Core 再路由

验证面（npm run verify:all，16 项零依赖校验）
  test / learn:verify / scenario:coverage / trigger:verify / host:verify
  install:verify / user:verify / debt / review / spec / plan / audit
  capability:verify / capability:eval / budget:verify / route:verify

安装面
  install:target（dry-run -> --write -> --check + manifest 版本差检测）
  install:user（user 级 skills/commands/scripts 同步）
```

### 1.2 关键结构评估

| 维度 | 现状 | 评估 |
|---|---|---|
| 入口契约 | 8 个 host 适配器 + 2 个 manifest，`host:verify` 全绿 | 良好：薄适配器，单一契约 |
| 路由契约 | 4 个路由表面（AGENTS.md / core SKILL.md / README / skill-call-diagram）由 `route:verify` 防漂移 | 良好：成功边 + 7 个异常返回边已固化 |
| 生命周期 | 确定性成功边直连，非唯一 artifact 回 Core | 良好：hybrid 边界清晰 |
| Context 预算 | 单 skill ≤15 KiB（最大 14,715）、总量 ≤280,000（当前 131,874），`budget:verify` 门禁 | 良好：量化为门禁 |
| 验证面 | 16 项校验全绿，含场景覆盖率报告（6 层全覆盖、Gaps: none） | 良好：可重复证明 |
| 安装面 | target installer 含 sha256 manifest + 上游版本差检测 | 良好：升级路径明确 |
| 观测面 | P2-6 本地观测日志未实现（hooks 无 DEVFLOW_OBSERVE） | 待收尾 |
| 迭代文档 | docs/iteration-plan.md 缺失，README 未链接 | 待收尾 |

### 1.3 2026-07-31 harness 迭代实施状态

| 任务 | 内容 | 状态 |
|---|---|---|
| Task 1 (P0-1) | CI（.github/workflows/ci.yml） | 已完成 |
| Task 2 (P0-2+P2-7) | skill 预算门禁（devflow-budget.js） | 已完成 |
| Task 3 (P0-3) | 路由一致性校验（validate-route-consistency.js） | 已完成 |
| Task 4 (P1-4+P1-5a) | plan/spec checker Status + --json | 已完成 |
| Task 5 (P1-5a) | review/debt/audit checker --json | 已完成 |
| Task 6 (P1-5b) | installer manifest + 版本差检测 | 已完成 |
| Task 7 (P2-6) | 本地观测日志（DEVFLOW_OBSERVE） | 未完成 |
| Task 8 (文档) | docs/iteration-plan.md + README 链接 | 未完成 |

## 2. 迭代规划候选（后续）

1. **观测数据驱动约束校准**：DEVFLOW_OBSERVE 日志积累后，用会话启动频率校准 budget 阈值与 skill 体积。
2. **budget 阈值演进**：当前 15 KiB 单 skill 上限接近 devflow-project-knowledge（14,715），skill 增长需配套拆分策略。
3. **checker 输出消费方**：--json 已就绪，可为 CI 聚合报告提供机器可读摘要（目前 verify:all 仅人类可读）。
4. **跨会话状态自动恢复**：Status 字段已支持 draft/approved/in-progress/done，可评估基于 Status 的跨会话恢复。
5. **升级路径细化**：manifest 版本差已检测，可补充增量同步与逐文件 diff 合并策略。

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| `hooks/devflow-session-start.js` | Modify | P2-6 本地观测日志：env 开关追加 .devflow-observe.log | 现有 SessionStart hook | 不改变注入文本 |
| `.gitignore` | Modify | 忽略 .devflow-observe.log | 现有忽略清单 | 不忽略其他文件 |
| `docs/iteration-plan.md` | Create | 长期迭代计划活文档 | docs/ 现有文档面 | 不含实施代码 |
| `README.md` | Modify | 链接 iteration-plan 并简述 Status/--json/manifest | 现有用户入口 | 不重写安装说明 |

Task: 本地观测日志收尾（P2-6）

Task type: Code change
Files:
- Modify: hooks/devflow-session-start.js | `use strict` | env 开关的本地会话日志
- Modify: .gitignore | `nul` | 忽略 .devflow-observe.log
Interfaces:
- Consumes: 环境变量 DEVFLOW_OBSERVE === "1"；process.cwd()
- Produces: 项目根 .devflow-observe.log 追加行（ISO 时间戳 + session-start）；默认无任何输出变化
Current behavior: hook 只向 stdout 输出注入上下文 JSON，无任何文件写入；.gitignore 无 observe 条目
Target behavior: 显式设置 DEVFLOW_OBSERVE=1 时每次会话启动追加一行本地日志；未设置时行为与现状逐字节一致
Change mechanics: exact replacement——文件顶部加 const fs = require("node:fs") 与 const path = require("node:path")；在 context 定义前插入 if (process.env.DEVFLOW_OBSERVE === "1") { try { fs.appendFileSync(path.join(process.cwd(), ".devflow-observe.log"), `${new Date().toISOString()} session-start\n`, "utf8"); } catch {} }；.gitignore 追加一行 .devflow-observe.log
Call impact: hook 的 stdout 输出与 hooks.json 触发不变；默认运行零行为差异；日志写入失败静默
Steps:
- [ ] Modify `hooks/devflow-session-start.js` 顶部按 exact replacement 添加 fs/path 引用与 env 开关日志块
- [ ] Modify `.gitignore` 按 exact replacement 末尾追加 `.devflow-observe.log`
- [ ] 运行 `node hooks/devflow-session-start.js` 验证无 env 时输出与现状一致且不产生日志文件
- [ ] 运行 `$env:DEVFLOW_OBSERVE="1"; node hooks/devflow-session-start.js` 后清除该环境变量，验证日志文件生成一行
Acceptance: 无 env 时无文件写入且输出不变；有 env 时 .devflow-observe.log 追加一行
Verify: Run `node hooks/devflow-session-start.js`; expect 仅输出 JSON 且工作目录无 .devflow-observe.log
Comments: 日志仅本地、默认关闭、无网络上报；cwd 即会话启动的项目目录；不记录路由/门禁详情（hook 无法捕获对话内决策）
Not doing: 不记录路由/门禁详情、不做日志轮转、不写入用户主目录

Prewalk:

Execution Trace:
- Read: `hooks/devflow-session-start.js` → 现为纯 stdout JSON 输出，无 require 语句（L1-19），无 DEVFLOW_OBSERVE 逻辑。
- Read: `.gitignore` → 仅 2 行（.deepcode/settings.json、nul），无 observe 条目。
- Read: `hooks/hooks.json` → SessionStart matcher 存在（启动/清理/紧凑事件），hook 由宿主以 node 执行。
- Traced: `node hooks/devflow-session-start.js` → 当前直接输出 JSON 到 stdout，工作目录无日志文件。
- Verified: `npm run verify:all` → 全绿（16 项），budget/route/capability 均 PASS。
- Edited: none yet → 观测日志改动待执行。
Current Handoff Facts:
- Target anchors: `hooks/devflow-session-start.js` L1-4 顶部区；`.gitignore` 末尾。
- Nearby convention: hook 保持零依赖与静默失败风格；validate-devflow.js 通过 runVerifier 挂载兄弟校验器。
- Direct path: hooks.json 的 command 调用入口；进程 cwd 即项目根。
- Current constraints: 日志必须 try/catch 静默，防止阻断会话注入；无 env 时零文件写入。
- Planned touch set: hooks/devflow-session-start.js、.gitignore。
- Risks / stop conditions: appendFileSync 在只读目录抛错——已由 try/catch 覆盖；无其他阻断。
Remaining Structured Worklist:
- [ ] Modify `hooks/devflow-session-start.js` 顶部添加 env 开关日志块。
  Anchors: `hooks/devflow-session-start.js` L1-4。
  Verify: `node hooks/devflow-session-start.js` 无 env 时输出不变。
  Done when: 有 env 时日志文件生成且无 env 时零文件写入。

Task: 长期迭代文档（用户点名交付）

Task type: Documentation-only
Files:
- Create: docs/iteration-plan.md | new file | 长期迭代计划活文档
- Modify: README.md | 文档引用段 | 链接 iteration-plan 并简述 Status/--json/manifest
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Create `docs/iteration-plan.md` 包含：目的与范围；更新机制（触发时机为每批完成、每次发布或用户要求；步骤为更新已落地状态、修订候选清单、运行 npm run verify:all、提交）；本次已落地清单（7 条逐条记录位置与验证命令）；后续迭代候选（观测数据驱动约束校准、budget 阈值演进、跨会话状态自动恢复、checker 输出消费方、升级路径细化）
- [ ] Modify `README.md` 在 Quick Start 文档引用处追加 docs/iteration-plan.md 链接，并在脚本表格后补一行说明 --json、.devflow-manifest.json 与 Status 字段
- [ ] 运行 `git status --short docs/iteration-plan.md README.md` 确认两文件变更可见
Acceptance: docs/iteration-plan.md 存在且含更新机制与已落地清单；README 含链接
Verify: Run `git status --short docs/iteration-plan.md`; expect 文件被列出且 README 含 iteration-plan 链接
Comments: 该文档是后续迭代的唯一更新入口，其自身必须写明更新流程；不含实施代码、不复制流程文档内容
Not doing: 不含实施代码、不复制流程文档内容、不承诺具体排期

Prewalk:

Execution Trace:
- Read: `docs/plans/` → 17 个计划文件，无 docs/iteration-plan.md。
- Read: `README.md` → Quick Start 引用 docs/platform-setup.md 与 docs/PRD.md，未链接 iteration-plan；脚本表格无 --json/manifest 说明。
- Read: `docs/PRD.md` → 第 8 节 Roadmap 含 P0/P1/P2/P3 方向，可作迭代候选来源。
- Verified: `npm run verify:all` → 全绿；validate-devflow.js 已挂载 budget 与 route 校验器。
- Edited: none yet → 迭代文档创建待执行。
Current Handoff Facts:
- Target anchors: `docs/iteration-plan.md`（新建）；`README.md` Quick Start 文档引用段与脚本表格。
- Nearby convention: docs/ 下文档面清晰（PRD、specs、plans、features）；README 是用户入口。
- Direct path: README 的 Quick Start 引用处；docs/ 根目录。
- Current constraints: iteration-plan 必须自身写明更新机制；README 只补链接不重写安装说明。
- Planned touch set: docs/iteration-plan.md、README.md。
- Risks / stop conditions: README 表格若改动会触发 route:verify 的 README 断言——只追加行不改动边文本；无其他阻断。
Remaining Structured Worklist:
- [ ] Create `docs/iteration-plan.md` 并包含更新机制与已落地清单。
  Anchors: `docs/iteration-plan.md`。
  Verify: `git status --short docs/iteration-plan.md` 期望文件被列出。
  Done when: 文档存在且 README 含 iteration-plan 链接。

## 批次与验证

| 批次 | 任务 | 批后验证 |
|---|---|---|
| 收尾 | Task 7（观测日志）+ Task 8（迭代文档） | npm run verify:all + node scripts/devflow-plan.js 自校验本文件 |
