# 循环工程 Agent Preset 实现计划

Goal: 交付可挂载、可实测的 loop-engine 循环工程 preset（devflow-2 两阶段锚定基底 + 循环 persona + 内置协议 skill 与三模板 + demo 场景），并在新会话实跑 demo 循环、按停止条件收尾。

Architecture: 仓库源 `dsh/agent-presets/loop-engine/` 为权威源，拷贝至 `~/.dsh/.agent-presets/loop-engine/` 生效；两阶段锚定沿用 devflow-2 bootstrap（零改动）；循环机制复用 goal/todo_write/ask_user/subagent 原语；零新插件代码；挂载校验走 standingKeyFor。

Tech Stack: DSH agent preset（agent.cordis.yml YAML 组合 + 沿用 .mjs 插件 + Markdown skill 与模板）；校验用 Node 检查器（scripts/devflow-spec.js、scripts/devflow-plan.js）与 pwsh 命令。

Source: docs/specs/2026-08-21-loop-engineering-preset.md（已批准修订版）

Spec coverage: R1 由 Task 1 与 Task 5 覆盖（锚定组合、persona、首行约束、挂载校验）；R2-R6、R8 由 Task 2 覆盖（循环协议与三模板）；R7 由 Task 1（组合与元数据）与 Task 3（README）覆盖；Acceptance 场景由 Task 4（demo 起点）与 Prove（新会话实跑）覆盖。

Cut Decision: CUT_PASS——允许范围：仓库源与运行时 loop-engine preset 目录、demo 场景、docs/plans 本文件；复用结论：devflow-2 组合与 bootstrap 原样派生，goal/todo_write/ask_user/subagent 原语承担循环机制，零新插件；裁剪：不单独建 loop.log（决策日志并入 loop-state.md）、不新增服务与 realm、skill 仅随 preset 不自带全局；排除：外部循环代码、宿主级引擎、编排扇出、dsh-devflow 资产同步、修改既有 preset；验证约束：standingKeyFor 通过 + demo 实测 + 静态检查器。

External Skills: editing-cordis-compositions; role: 组合编辑与挂载校验规则; expected evidence: standingKeyFor(loop-engine) 返回 mounted OK; return facts: 校验通过或失败信息 / cordis-plugin-development; role: 临时 probe 插件定义与运行 API; expected evidence: probe 工具返回 mounted OK; return facts: 返回文本或诊断

Execution mode: sequential

## Global Constraints

- 不改宿主组合与现有 preset；bootstrap 与 custom-bash 原样沿用；不新增服务与 isolate realm。
- demo 轮次预算 ≤8；循环定义缺停止条件或预算不启动。
- 中文为主、关键术语保留英文对照。

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| `dsh/agent-presets/loop-engine/agent.cordis.yml` / key `persona` | Create | 组合：devflow-2 派生、循环 persona、头注释 | preset 运行时组合源 | 不新增服务或 realm 行 |
| `dsh/agent-presets/loop-engine/preset.yml` / key `name` | Create | 选择器元数据 | preset 显示入口 | 无 |
| `dsh/agent-presets/loop-engine/tool-bootstrap.mjs` | Create | 两阶段锚定引导 | devflow-2 原样沿用 | 不改动内容 |
| `dsh/agent-presets/loop-engine/custom-bash.mjs` | Create | Windows bash 工具 | devflow-2 原样沿用 | 不改动内容 |
| `dsh/agent-presets/loop-engine/NOTICE` | Create | MIT 来源声明 | 沿用 devflow-2 | 无 |
| `dsh/agent-presets/loop-engine/skills/loop-engineering/SKILL.md` | Create | 循环协议文档 | preset 自带 skill 目录 | 不注册工具 |
| `dsh/agent-presets/loop-engine/skills/loop-engineering/templates/fix-bug-to-green.md` | Create | 修 bug 到测试绿模板 | 内置模板需求 | 无 |
| `dsh/agent-presets/loop-engine/skills/loop-engineering/templates/implement-feature-to-green.md` | Create | 实现功能到测试绿模板 | 内置模板需求 | 无 |
| `dsh/agent-presets/loop-engine/skills/loop-engineering/templates/generic-task.md` | Create | 通用任务模板 | 内置模板需求 | 无 |
| `dsh/agent-presets/loop-engine/README.md` | Create | 安装与使用说明 | 仓库惯例 | 无 |
| `demo/calc.js` / `demo/test.js` / `demo/TASK.md` | Create | demo 场景三文件 | 验收 demo | 不预置修复答案 |
| `~/.dsh/.agent-presets/loop-engine/agent.cordis.yml` `~/.dsh/.agent-presets/loop-engine/preset.yml` `~/.dsh/.agent-presets/loop-engine/tool-bootstrap.mjs` `~/.dsh/.agent-presets/loop-engine/custom-bash.mjs` `~/.dsh/.agent-presets/loop-engine/NOTICE` `~/.dsh/.agent-presets/loop-engine/README.md` `~/.dsh/.agent-presets/loop-engine/skills/loop-engineering/SKILL.md` `~/.dsh/.agent-presets/loop-engine/skills/loop-engineering/templates/fix-bug-to-green.md` `~/.dsh/.agent-presets/loop-engine/skills/loop-engineering/templates/implement-feature-to-green.md` `~/.dsh/.agent-presets/loop-engine/skills/loop-engineering/templates/generic-task.md` | Create | 运行时安装副本 | preset 生效落点 | 不改宿主组合 |

Task: 派生 preset 源目录与组合文件

Task type: Code change

Files:
- Create: dsh/agent-presets/loop-engine/agent.cordis.yml | new file | devflow-2 组合拷贝 + persona 替换 + 头注释
- Create: dsh/agent-presets/loop-engine/preset.yml | new file | 选择器元数据（name/description/order）
- Create: dsh/agent-presets/loop-engine/tool-bootstrap.mjs | new file | 两阶段锚定引导（devflow-2 原样）
- Create: dsh/agent-presets/loop-engine/custom-bash.mjs | new file | Windows bash 工具（devflow-2 原样）
- Create: dsh/agent-presets/loop-engine/NOTICE | new file | MIT 来源声明（devflow-2 原样）

Interfaces:
- Consumes: 无（静态文件，无代码接口）
- Produces: 可被 roster 挂载的 preset 源目录（5 个文件）

Current behavior: 仓库无 dsh/agent-presets/loop-engine/ 目录；devflow-2 为唯一锚定基底源，其 persona 为 DevFlow 文本。

Target behavior: loop-engine 源目录存在：组合文件 persona 为循环工程文本、bootstrap 保持首行、preset.yml 为循环工程元数据；两个插件与 NOTICE 与 devflow-2 逐字节一致。

Change mechanics: exact replacement: replace 拷贝所得 agent.cordis.yml 中 persona 行的 `text: |-` 内容块 with 下方循环工程 persona 块，文件其余行保持 devflow-2 原文，头注释同步改写为 loop-engine 派生说明。

```
  text: |-
    You are a loop engineer agent powered by the {{model}} model. Your working directory is {{cwd}}.

    You run loops, not single prompts. The human writes the loop definition; the loop decides what to prompt next. When you receive a loop definition (目标 / 停止条件 / 轮次预算 / 产出物), load the `loop-engineering` skill with the skill tool and follow its protocol exactly: every round reads the loop state, decides the next step itself, executes one small verifiable step, records progress in loop/loop-state.md, and self-checks the stop condition — repeat until the stop condition holds or the round budget is exhausted. A loop definition missing a stop condition or a round budget is invalid: refuse to start and ask the human to supply both. The human may interrupt or edit the loop definition at any time; treat that as the new loop.
```

Call impact: 无运行时调用者；preset 由 roster 在用户选择后挂载（Task 5 校验）。

Steps:
- [ ] Create `dsh/agent-presets/loop-engine/agent.cordis.yml` using exact replacement: replace persona `text: |-` 块 with 循环工程 persona 三段文本，并更新文件头注释为 loop-engine 派生说明。
- [ ] Create `dsh/agent-presets/loop-engine/preset.yml` using exact replacement: replace name/description/order 三键 with 循环工程元数据（name: Loop Engine 循环工程；description: 锚定开场 + 循环推进；order: 7）。
- [ ] 添加 `dsh/agent-presets/loop-engine/tool-bootstrap.mjs`、`custom-bash.mjs`、`NOTICE` 三文件 by copy: 与 `dsh/agent-presets/devflow-2/` 同名文件逐字节一致。
- [ ] Run `pwsh -Command "(Get-ChildItem dsh/agent-presets/loop-engine -File).Count"`; expect returns 5。

Acceptance: 五个文件齐备；persona 块为循环工程文本且 bootstrap 行仍为首行。

Verify: Run `pwsh -Command "Select-String -Path dsh/agent-presets/loop-engine/agent.cordis.yml -Pattern 'loop-engineering'"`; expect returns 命中行（persona 已替换）。

Comments: agent.cordis.yml 文件头注释说明基底来源（devflow-2 派生）、bootstrap 首行原因、goal/todo_write/ask_user/jobs 行保留理由。

Not doing: 不改 bootstrap 与 custom-bash 内容；不新增服务或 realm 行。

Prewalk:

Execution Trace:
- Read: `~/.dsh/.agent-presets/devflow-2/agent.cordis.yml` → 组合含 tool-bootstrap 首行、persona（DevFlow 文本）、persistent-shell（win32 禁用）、custom-bash（win32 启用）、str-replace-editor、fs、jobs、skill、goal、planning、compaction、delegation、web 行。
- Read: `~/.dsh/.agent-presets/devflow-2/preset.yml` → 元数据含 name、description、order 三键。
- Traced: 仓库 `dsh/agent-presets/devflow-2/`（glob）→ 源目录含 agent.cordis.yml、preset.yml、README.md、tool-bootstrap.mjs、custom-bash.mjs、NOTICE。
- Ran: `node scripts/devflow-spec.js docs/specs/2026-08-21-loop-engineering-preset.md` → Judgment: PASS。
- Edited: none yet → preset 源文件尚未创建。
- Verified: none yet → 挂载校验待 Task 5 执行。

Current Handoff Facts:
- Target anchors: `dsh/agent-presets/devflow-2/agent.cordis.yml` / key `persona`。
- Nearby convention: devflow-2 派生自 standard 行级保留，头注释解释行意图。
- Direct path: 无运行时调用者；preset 由 roster 挂载。
- Current constraints: bootstrap 行必须保持首行（pre-step 剥离依赖反向注册序）；win32 下 persistent-shell 禁用、custom-bash 启用；本任务不新增服务。
- Planned touch set: 新建 `dsh/agent-presets/loop-engine/` 五个文件；README 由 Task 3 负责。
- Risks / stop conditions: persona 替换破坏 YAML 缩进时，Task 5 挂载校验失败并返回。
- Read-basis: `~/.dsh/.agent-presets/devflow-2/agent.cordis.yml`、`~/.dsh/.agent-presets/devflow-2/preset.yml`、`docs/specs/2026-08-21-loop-engineering-preset.md`。
- Live anchors: `dsh/agent-presets/devflow-2/agent.cordis.yml` / key `persona`。

Remaining Structured Worklist:
- [ ] Create `dsh/agent-presets/loop-engine/agent.cordis.yml` using exact replacement: replace persona `text: |-` 块内容 with 循环工程 persona 三段文本，其余行保持 devflow-2 原文，bootstrap 行保持首行。
  Anchors: `dsh/agent-presets/devflow-2/agent.cordis.yml` / key `persona`。
  Verify: Run `pwsh -Command "Select-String -Path dsh/agent-presets/loop-engine/agent.cordis.yml -Pattern 'loop-engineering'"`; expect returns 命中行。
  Done when: 文件存在、persona 块为循环工程文本、bootstrap 为首行。
- [ ] Create `dsh/agent-presets/loop-engine/preset.yml` using exact replacement: replace name 为 Loop Engine 循环工程、description 为锚定开场加循环推进、order 为 7。
  Anchors: `~/.dsh/.agent-presets/devflow-2/preset.yml` 三键结构。
  Verify: Run `pwsh -Command "Select-String -Path dsh/agent-presets/loop-engine/preset.yml -Pattern '循环'"`; expect returns 命中行。
  Done when: name/description/order 三键齐全且指向循环工程。
- [ ] 添加 `dsh/agent-presets/loop-engine/tool-bootstrap.mjs`、`custom-bash.mjs`、`NOTICE` 三文件 by copy: 与 `dsh/agent-presets/devflow-2/` 同名文件逐字节一致。
  Anchors: `dsh/agent-presets/devflow-2/tool-bootstrap.mjs`。
  Verify: Run `pwsh -Command "(Get-Item dsh/agent-presets/loop-engine/tool-bootstrap.mjs).Length -eq (Get-Item dsh/agent-presets/devflow-2/tool-bootstrap.mjs).Length"`; expect returns True。
  Done when: 三文件存在且字节数与源一致。
- [ ] 验证 `dsh/agent-presets/loop-engine/` 目录文件数 by `pwsh -Command "(Get-ChildItem dsh/agent-presets/loop-engine -File).Count"`; expect returns 5。
  Anchors: `dsh/agent-presets/loop-engine/`。
  Verify: 运行同命令; expect returns 5。
  Done when: 文件数为 5（组合、元数据、两个插件、NOTICE）。

Task: 循环协议 skill 与三个模板

Task type: Documentation-only

Files:
- Create: dsh/agent-presets/loop-engine/skills/loop-engineering/SKILL.md | new file | 循环协议全文
- Create: dsh/agent-presets/loop-engine/skills/loop-engineering/templates/fix-bug-to-green.md | new file | 修 bug 到测试绿模板
- Create: dsh/agent-presets/loop-engine/skills/loop-engineering/templates/implement-feature-to-green.md | new file | 实现功能到测试绿模板
- Create: dsh/agent-presets/loop-engine/skills/loop-engineering/templates/generic-task.md | new file | 通用任务模板

Interfaces:
- Consumes: documentation-only
- Produces: documentation-only

Steps:
- [ ] Create `dsh/agent-presets/loop-engine/skills/loop-engineering/SKILL.md` 写入循环协议全文：循环定义六要素（目标/停止条件/轮次预算/产出物/检查点/模板）、每轮纪律（读状态、决定下一步、小步执行、记录、自检）、状态文件格式（loop/loop-state.md 含决策日志段）、空转与 blocked 上报、收尾报告格式。
- [ ] Create `dsh/agent-presets/loop-engine/skills/loop-engineering/templates/fix-bug-to-green.md` 写入修 bug 到测试绿模板（字段说明与示例：停止条件 = 测试命令退出码 0）。
- [ ] Create `dsh/agent-presets/loop-engine/skills/loop-engineering/templates/implement-feature-to-green.md` 写入实现功能到测试绿模板（字段说明与示例）。
- [ ] Create `dsh/agent-presets/loop-engine/skills/loop-engineering/templates/generic-task.md` 写入通用任务模板（字段说明与示例，停止条件由用户自定可验证判据）。
- [ ] Run `node scripts/devflow-spec.js docs/specs/2026-08-21-loop-engineering-preset.md`; expect Judgment: PASS。

Acceptance: SKILL.md 覆盖 R2-R5 与 R8 全部协议要素；三个模板均含停止条件与预算字段及示例。

Verify: Run `node scripts/devflow-spec.js docs/specs/2026-08-21-loop-engineering-preset.md`; expect Judgment: PASS；Run `pwsh -Command "(Get-ChildItem dsh/agent-presets/loop-engine/skills/loop-engineering/templates -File).Count"`; expect returns 3。

Comments: SKILL.md 即协议文档本身；每个模板头部自带字段说明（Code Documentation 要求）。

Not doing: 不在 ~/.dsh/skills 全局目录放置协议；不注册新工具。

Task: README 安装与使用说明

Task type: Documentation-only

Files:
- Create: dsh/agent-presets/loop-engine/README.md | new file | 安装、使用与 caveats 说明

Interfaces:
- Consumes: documentation-only
- Produces: documentation-only

Steps:
- [ ] Create `dsh/agent-presets/loop-engine/README.md` 写入四节：What it is（锚定开场 + 循环推进定位）、Install（拷贝到 ~/.dsh/.agent-presets/ 的命令）、Use（新会话选 preset，锚定后输入循环定义示例）、Caveats（升级后重拷、demo 成本、Windows bash 路径）。
- [ ] Run `pwsh -Command "Select-String -Path dsh/agent-presets/loop-engine/README.md -Pattern 'Install'"`; expect returns 命中行。

Acceptance: README 含安装/使用/caveats 三部分且可照做。

Verify: Run `pwsh -Command "Select-String -Path dsh/agent-presets/loop-engine/README.md -Pattern 'Install'"`; expect returns 命中行。

Comments: README 是用户可见入口文档（Code Documentation 要求）。

Not doing: 不改 README 之外的既有文档。

Task: demo 场景（故意 bug 与失败测试起点）

Task type: Code change

Files:
- Create: demo/calc.js | new file | demo 目标代码（内置一处故意 bug）
- Test: demo/test.js | `main 断言` | 失败断言证明 bug 存在（停止条件判据）
- Create: demo/TASK.md | new file | demo 任务说明与循环定义示例

Interfaces:
- Consumes: 无（独立 demo 目录）
- Produces: demo/test.js 退出码（0 = 停止条件达成）

Current behavior: 工作区无 demo/ 目录（glob demo/** 返回 No files found）。

Target behavior: `node demo/test.js` 失败（退出码 1）；demo/TASK.md 含可直接粘贴的循环定义。

Change mechanics: exact replacement: replace 空 demo 目录 with 三文件内容（如下方代码块）——calc.js 的 subtract 返回 a + b（故意 bug）；test.js 断言 subtract(2,1) 严格等于 1（当前失败）；TASK.md 给出目标（修复 subtract）、停止条件（node demo/test.js 退出码 0）、预算 8 轮、产出物 loop/loop-state.md。

```
function add(a, b) { return a + b; }
function subtract(a, b) { return a + b; } // 故意 bug：demo 循环修复目标

const assert = require('assert');
const { subtract } = require('./calc.js');
assert.strictEqual(subtract(2, 1), 1); // 修复前失败，修复后通过
console.log('demo test passed');
```

Call impact: 无运行时影响（独立 demo 目录，不属于 preset）。

Steps:
- [ ] Create `demo/calc.js` using exact replacement: replace 文件内容 with 代码块（add 正常，subtract 返回 a + b 的故意 bug）。
- [ ] Create `demo/test.js` using exact replacement: replace 文件内容 with 代码块（断言 subtract(2,1) 严格等于 1，修复前失败）。
- [ ] Create `demo/TASK.md` using exact replacement: replace 文件内容 with 任务说明与循环定义示例（目标/停止条件/预算 8/产出物 loop/loop-state.md）。
- [ ] Run `node demo/test.js`; expect fails with exit code 1（起点证据）。

Acceptance: `node demo/test.js` 失败（退出码 1）；TASK.md 循环定义六要素齐全。

Verify: Run `node demo/test.js`; expect fails with exit code 1。

Comments: calc.js 的故意 bug 处需注释说明「故意 bug，demo 循环修复目标」（非显然边界需 WHY 注释）。

Not doing: 不在 demo 内预置修复答案；不把 demo 纳入 preset 目录。

Prewalk:

Execution Trace:
- Read: 工作区根（glob demo/**）→ 无 demo 目录，demo 为全新目录。
- Traced: `docs/specs/2026-08-21-loop-engineering-preset.md` Acceptance 节 → demo 停止条件为测试全绿（node demo/test.js 退出码 0）。
- Ran: `node scripts/devflow-spec.js docs/specs/2026-08-21-loop-engineering-preset.md` → Judgment: PASS。
- Edited: none yet → demo 文件未创建。
- Verified: none yet → 起点失败断言待创建后运行。

Current Handoff Facts:
- Target anchors: `demo/`（尚不存在）。
- Nearby convention: 仓库 specs/plans 均落 docs/ 惯例路径；demo 为验收专用目录。
- Direct path: 无调用者；test.js 通过 require 读取 calc.js。
- Current constraints: 停止条件必须客观可检查（退出码）。
- Planned touch set: `demo/calc.js`、`demo/test.js`、`demo/TASK.md`。
- Risks / stop conditions: 若 test.js 起点即通过，说明 bug 设计错误，返回 Core。
- Read-basis: `docs/specs/2026-08-21-loop-engineering-preset.md`。
- Live anchors: `demo/` 目录。

Remaining Structured Worklist:
- [ ] Create `demo/calc.js` using exact replacement: replace 内容 with 代码块（subtract 故意返回 a + b）。
  Anchors: `demo/calc.js`。
  Verify: Run `node demo/test.js`; expect fails with exit code 1。
  Done when: calc.js 存在且 subtract 为 bug 实现。
- [ ] Create `demo/test.js` using exact replacement: replace 内容 with 断言 subtract(2,1) 严格等于 1。
  Anchors: `demo/test.js`。
  Verify: Run `node demo/test.js`; expect fails with exit code 1。
  Done when: test.js 存在且运行失败、退出码 1。
- [ ] Create `demo/TASK.md` using exact replacement: replace 内容 with 循环定义示例（目标/停止条件/预算 8/产出物 loop/loop-state.md）。
  Anchors: `demo/TASK.md`。
  Verify: Run `pwsh -Command "Select-String -Path demo/TASK.md -Pattern '停止条件'"`; expect returns 命中行。
  Done when: TASK.md 含六要素循环定义。

Task: 安装到运行时目录并挂载校验

Task type: Code change

Files:
- Create: ~/.dsh/.agent-presets/loop-engine/agent.cordis.yml | new file | 组合运行时副本
- Create: ~/.dsh/.agent-presets/loop-engine/preset.yml | new file | 元数据运行时副本
- Create: ~/.dsh/.agent-presets/loop-engine/tool-bootstrap.mjs | new file | 锚定引导运行时副本
- Create: ~/.dsh/.agent-presets/loop-engine/custom-bash.mjs | new file | Windows bash 运行时副本
- Create: ~/.dsh/.agent-presets/loop-engine/NOTICE | new file | 来源声明运行时副本
- Create: ~/.dsh/.agent-presets/loop-engine/README.md | new file | README 运行时副本
- Create: ~/.dsh/.agent-presets/loop-engine/skills/loop-engineering/SKILL.md | new file | 协议 skill 运行时副本
- Create: ~/.dsh/.agent-presets/loop-engine/skills/loop-engineering/templates/fix-bug-to-green.md | new file | 模板运行时副本
- Create: ~/.dsh/.agent-presets/loop-engine/skills/loop-engineering/templates/implement-feature-to-green.md | new file | 模板运行时副本
- Create: ~/.dsh/.agent-presets/loop-engine/skills/loop-engineering/templates/generic-task.md | new file | 模板运行时副本

Interfaces:
- Consumes: 仓库源 `dsh/agent-presets/loop-engine/` 全部文件；host agentPresets 服务（经 probe 插件注入）
- Produces: 可挂载的运行时 preset（standingKeyFor 通过）

Current behavior: ~/.dsh/.agent-presets/ 下无 loop-engine（glob loop-engine/** 返回 No files found）。

Target behavior: 运行时 preset 目录齐备；standingKeyFor(loop-engine) 返回 mounted OK。

Change mechanics: exact replacement: replace 目标目录 with 仓库源递归副本（pwsh Copy-Item -Recurse，源 `dsh/agent-presets/loop-engine/`）；随后用临时 probe 插件执行挂载校验，插件 Host 侧代码：

```
return {
  name: 'loop-engine-probe',
  inject: ['agentPresets'],
  apply(ctx) {
    harness.registerTool(ctx, harness.defineTool({
      name: 'loop_engine_mount_check',
      description: 'Run standingKeyFor(loop-engine) mount validation.',
      parameters: {},
      output: { schema: { type: 'string' }, render(_a, v) { return [{ type: 'text', text: v }] } },
      async execute() {
        try {
          await ctx.agentPresets.standingKeyFor('loop-engine')
          return 'mounted OK'
        } catch (error) {
          return error.message
        }
      },
    }))
  },
}
```

Call impact: 不改宿主；probe 插件用完即 `cordis_undefine`（临时探针，不留常驻能力）。

Steps:
- [ ] Create `~/.dsh/.agent-presets/loop-engine/` 全部文件 using exact replacement: replace 目标目录 with Copy-Item -Recurse 递归副本（源 `dsh/agent-presets/loop-engine/`）。
- [ ] 检查 `~/.dsh/.agent-presets/loop-engine/agent.cordis.yml` 首行 by `pwsh -Command "Get-Content $env:USERPROFILE\.dsh\.agent-presets\loop-engine\agent.cordis.yml -TotalCount 1"`; expect returns tool-bootstrap 行。
- [ ] 运行 probe 插件（`cordis_define` + `cordis_run`）执行 standingKeyFor(loop-engine) by exact replacement: replace 插件代码 with 上方 probe 块。
- [ ] Remove probe 插件 using exact replacement: replace probe 插件 with 空（`cordis_undefine`）。

Acceptance: standingKeyFor(loop-engine) 返回 mounted OK；失败信息逐条修复至通过。

Verify: Run `cordis_run`（probe 插件）; expect returns mounted OK from standingKeyFor(loop-engine)。

Comments: 运行时副本内容同仓库源，不另加注释（Code Documentation 已在源文件落实）。

Not doing: 不修改宿主组合；不把 probe 插件留作常驻能力（用完即删）。

Prewalk:

Execution Trace:
- Read: editing-cordis-compositions skill → standingKeyFor(id) 为挂载校验入口；probe 以临时插件注入 agentPresets 实现。
- Read: `~/.dsh/.agent-presets` 目录（glob）→ 现存 anchored-standard、liangshen、devflow-2，无 loop-engine。
- Traced: `cordis_define` / `cordis_run` 工具面 → 动态插件可定义并运行 Host 侧 probe。
- Ran: `node scripts/devflow-spec.js docs/specs/2026-08-21-loop-engineering-preset.md` → Judgment: PASS。
- Edited: none yet → 运行时目录未创建。
- Verified: none yet → 挂载校验未执行。

Current Handoff Facts:
- Target anchors: `~/.dsh/.agent-presets/loop-engine/agent.cordis.yml`（复制后）。
- Nearby convention: devflow-2 以同样方式落于 `~/.dsh/.agent-presets/`。
- Direct path: roster 挂载 preset；probe 经 agentPresets 服务调用 standingKeyFor。
- Current constraints: 运行时目录写入受当前文件策略约束；probe 插件用完必须移除。
- Planned touch set: `~/.dsh/.agent-presets/loop-engine/` 全部文件。
- Risks / stop conditions: 挂载失败信息需逐条修复并复验；用户预设根若被插件升级重建需重拷。
- Read-basis: editing-cordis-compositions skill、`docs/specs/2026-08-21-loop-engineering-preset.md`。
- Live anchors: `~/.dsh/.agent-presets/loop-engine/`。

Remaining Structured Worklist:
- [ ] Create `~/.dsh/.agent-presets/loop-engine/` 全部文件 by Copy-Item using exact replacement: replace 目标目录 with 仓库源递归副本。
  Anchors: `dsh/agent-presets/loop-engine/`。
  Verify: Run `pwsh -Command "Test-Path $env:USERPROFILE\.dsh\.agent-presets\loop-engine\agent.cordis.yml"`; expect returns True。
  Done when: 运行时目录 10 个文件齐备。
- [ ] 检查 `~/.dsh/.agent-presets/loop-engine/agent.cordis.yml` 首行 by `pwsh -Command "Get-Content $env:USERPROFILE\.dsh\.agent-presets\loop-engine\agent.cordis.yml -TotalCount 1"`; expect returns tool-bootstrap 行。
  Anchors: `~/.dsh/.agent-presets/loop-engine/agent.cordis.yml`。
  Verify: 运行同命令; expect returns 首行为 tool-bootstrap。
  Done when: bootstrap 行保持首行。
- [ ] 运行 probe 插件（`cordis_define` + `cordis_run`）执行 standingKeyFor(loop-engine) by exact replacement: replace 插件代码 with 上方 probe 块。
  Anchors: `cordis_define` 工具。
  Verify: Run `cordis_run`（probe）; expect returns mounted OK。
  Done when: standingKeyFor 返回 mounted OK。
- [ ] Remove probe 插件 by `cordis_undefine` using exact replacement: replace probe 插件 with 空。
  Anchors: probe 插件 id。
  Verify: Run `cordis_undefine`; expect returns 成功。
  Done when: 临时插件已删除。
