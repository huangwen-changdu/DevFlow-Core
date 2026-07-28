---
name: devflow-plan-writing-plans-integration
overview: 新增仅负责生成实施计划的独立 skill，并将其生成纪律融入现有 devflow-plan，保留 DevFlow 追踪与生命周期门禁，排除 TDD 与 Commit 模块。
todos:
  - id: define-plan-v2-skill
    content: 使用 [skill:skill-creator] 创建 devflow-writing-plans 技能与 Plan v2 模板
    status: pending
  - id: wire-plan-command
    content: 接入 /devflow-plan 和核心路由，保留 Cut、Build、Prove 交接
    status: pending
    dependencies:
      - define-plan-v2-skill
  - id: version-plan-checker
    content: 扩展 devflow-plan checker，分版本校验新旧计划契约
    status: pending
    dependencies:
      - define-plan-v2-skill
  - id: verify-plan-contract
    content: 运行 plan 自测并抽查 v1、v2 和无效计划边界
    status: pending
    dependencies:
      - wire-plan-command
      - version-plan-checker
---

## User Requirements
调整项目内的 `devflow-plan`，吸收 `superpowers/writing-plans` 的高可执行计划规范，并保留现有 DevFlow 的需求追踪、范围约束与后续交接机制。

## Product Overview
计划文档升级为可直接指导实施的 Plan v2：明确目标、架构、约束、文件操作、接口关系和顺序步骤；生成后继续进入既有 Cut、Build、Prove 流程。

## Core Features
- 新增仅负责生成计划的独立 skill。
- `/devflow-plan` 使用新 skill 生成 Plan v2。
- Plan v2 保留 `Source`、`Spec coverage`、验收、验证、注释和不做项。
- 增加文件 Create/Modify/Test 分类、Consumes/Produces、原子化实施步骤。
- 不包含 TDD 红绿步骤、每任务 Commit 步骤或独立 reviewer。
- 保留历史计划兼容性，不批量迁移旧文档。
- 无界面变更。


## Tech Stack Selection
- 复用项目现有 Markdown skill、TOML command 与 Node.js checker 架构。
- 复用 `scripts/devflow-plan.js` 和现有 `npm run plan:verify` 验证入口；不新增依赖。

## Implementation Approach
以版本化 Plan 契约完成兼容演进：新独立 skill 只生成 `Plan format: v2` 文档；`/devflow-plan` 负责收集已批准的设计或 spec 输入、调用该 skill，并保持向 `devflow-cut` 的既有交接。

Plan v2 合并两方优点：全局层保留 `Source`、`Spec coverage`、目标、架构、技术栈与全局约束；任务层保留现有验收、验证、注释和不做项，同时加入文件操作分类、`Consumes/Produces` 与编号实施步骤。步骤要求足够具体、按依赖顺序执行，但不引入 TDD 或 Commit 章节。

为避免历史 `docs/plans/` 文档因新必填项整体失效，checker 以 `Plan format: v2` 作为严格校验开关：v2 执行扩展契约校验；无版本标识的既有计划继续按当前契约校验。Markdown 解析维持单次线性扫描，时间复杂度 O(n)，不执行目录全量迁移或额外 I/O。

## Implementation Notes
- 新 skill 仅生成计划，不创建 reviewer 角色、审查交接或第二套生命周期。
- `/devflow-plan` 继续要求来源已批准，输出完成后仍交给 `devflow-cut`，不得绕过现有门禁。
- `Files` 只描述本任务实际影响的 `[CREATE]`、`[MODIFY]`、`[TEST]` 文件；测试文件可选，但不得用 TDD 流程强制生成。
- checker 继续拒绝占位符和模糊措辞；新增字段仅对 v2 生效，控制历史文档爆炸半径。
- 自测覆盖有效 v1、有效 v2、缺少 v2 字段、非法文件操作标识、缺少步骤或接口字段等边界。

## Architecture Design
```text
已批准的设计 / Spec
        ↓
/devflow-plan
        ↓
devflow-writing-plans（仅生成 Plan v2）
        ↓
docs/plans/YYYY-MM-DD-<name>.md
        ↓
scripts/devflow-plan.js（v1/v2 契约校验）
        ↓
devflow-cut → devflow-build → devflow-prove
```

## Directory Structure Summary
本次只新增计划生成能力，并对命令入口、发现入口和 checker 做最小同步；不迁移既有计划文档。

```text
DevFlow-Core/
├── AGENTS.md                                      # [MODIFY] 在技能路由中声明独立计划生成 skill 的职责与 /devflow-plan 交接边界。
├── commands/
│   └── devflow-plan.toml                           # [MODIFY] 将命令提示收敛为输入校验、加载计划生成 skill、落盘与 Cut 交接。
├── scripts/
│   └── devflow-plan.js                             # [MODIFY] 支持 Plan v2 严格字段校验、v1 兼容校验及对应自测用例。
└── skills/
    ├── devflow-core/
    │   └── SKILL.md                                # [MODIFY] 在核心能力映射中登记计划生成 skill，明确不替代 Cut/Build/Prove。
    └── devflow-writing-plans/
        └── SKILL.md                                # [NEW] 独立计划生成 skill；定义 Plan v2 模板、任务粒度、文件分类、接口与步骤规则。
```

## Key Plan v2 Contract
- 全局字段：`Plan format`、`Source`、`Spec coverage`、`Goal`、`Architecture`、`Tech Stack`、`Global Constraints`。
- 每个任务：`Task`、`Files`、`Interfaces`（`Consumes`、`Produces`）、`Steps`、`Acceptance`、`Verify`、`Comments`、`Not doing`。
- `Steps` 为可执行的有序动作；不要求失败测试、通过测试或提交代码。


## Agent Extensions
### Skill
- **skill-creator**
  - Purpose: 依据项目既有 DevFlow skill 写法设计独立计划生成 skill。
  - Expected outcome: 形成职责单一、可发现、可复用且不越界到审查或实施的 `devflow-writing-plans` skill。
