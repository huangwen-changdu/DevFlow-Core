# 需求落地第一原理完整性基线

Status: done
Goal: 让“用户需求 → 完整功能”有一个可推导、可追溯、可机检的行为基线，并在 Plan/Prove 强制对账，而不是只在 Confirmed request 处假定完整。
Not doing: 不新增 skill、脚本、目录或依赖；不迁移历史 plan 与 spec；不改 A-B-C 语义；不给 Design-lite 强加 Plan；不改 spec checker 的必填节；不手改生成副本。
Cut: 做 需求契约基线 + Plan Baseline/Coverage 机检 + Prove 对账 | 不做 新 skill/新脚本/新目录/新依赖、迁移历史 plan 与 spec、改 A-B-C 语义、给 Design-lite 强加 Plan、改 spec checker 的必填节、手改生成副本 | 复用 现有 v2 Plan checker 的 legacy/done 分支、Prove 的 Coverage 块、sync-assets | 验证 plan:verify/spec:verify/budget:verify/verify:all | Rejected: 新增 devflow-completeness skill — 与 Brainstorm/Spec/Plan/Prove 职责重叠；新增 spec 必填节 — 会打挂 5 份带 Status 的旧 spec；改 AGENTS.md 加阶段文本 — 仅余 12 字节；每任务加 Covers 字段 — 会改动任务边界并挤爆 plan SKILL 预算，改用头部 Coverage 表
Source: 2026-11-05 会话 Confirmed request（B 深度）
Execution mode: sequential
Landed: 2026-11-05 · `npm run verify:all` exit 0；`verify-plugin` 14 skills/5 self-tests；副本逐字节一致

## Recon

- `wc -c AGENTS.md skills/devflow-plan/SKILL.md skills/devflow-prove/SKILL.md` → 8180 AGENTS.md; 15188 skills/devflow-plan/SKILL.md; 15332 skills/devflow-prove/SKILL.md
- `node scripts/devflow-plan.js --self-test` → DevFlow plan self-test passed
- `node scripts/devflow-spec.js --self-test` → DevFlow spec self-test passed
- `node scripts/devflow-budget.js | tail -1` → Judgment: PASS
- `grep -c "Coverage:\|Not covered:" skills/devflow-prove/SKILL.md` → 2
- `grep -l "^Status:" docs/specs/*.md | wc -l` → 5
- `git diff --stat` → 15 files changed, 167 insertions(+), 91 deletions(-)（上一轮 plan 说明/机检修复尚未提交，本次在其上叠加，不回退）

## Baseline

- B1 Brainstorm 的 Confirmed request 在 A/B/C 之前携带可观察行为、不变量与边界 → 固定输出块出现三行基线字段
- B2 Design-lite 契约在无 Plan 的路径上携带同一套基线 → Core 与 AGENTS 的 Design-lite 段落点名三项
- B3 A 分支 Spec 的 Requirements 行携带 B 编号与验收 → spec 流程段写明 Requirements 行携带 B 编号和验收
- B4 活跃 v2 计划缺 Baseline/Coverage、漏 B、未知 B 或未知任务号时 checker 失败 → self-test 正反用例覆盖
- B5 Prove 的 Coverage 按 B 编号映射证据，未覆盖的 B 进入 Not covered → proof 输出块出现 B 编号
- B6 三份副本与校验断言保持同步 → verify:all 退出码 0

## Coverage

| B | Tasks |
|---|---|
| B1 | 1 |
| B2 | 2 |
| B3 | 3 |
| B4 | 4, 5 |
| B5 | 6 |
| B6 | 7 |

## Tasks

Task: Brainstorm 确认请求携带需求基线
Files:
- Modify: skills/devflow-brainstorm/SKILL.md | symbol: `## Fixed Output Contract` | add the three baseline fields to the fixed summary
- Modify: skills/devflow-brainstorm/references/interview-discipline.md | symbol: `## Problem-Space Recommendation` | define the derivation rule for the baseline
Change: 在 Confirmed request 的固定输出里增加 `Required behaviors`（B1..Bn 可观察结果）、`Invariants`、`Edge/failure cases` 三行，并在 reference 说明从 Goal/Scope/Acceptance 与六角度清单推导，而不是只向用户提问。
Acceptance: `## Fixed Output Contract` 的代码块出现 `Required behaviors`、`Invariants`、`Edge/failure cases` 三行。
Verify: `grep -n "Required behaviors\|Invariants\|Edge/failure cases" skills/devflow-brainstorm/SKILL.md` → expect 3 matches; `node scripts/devflow-budget.js` → expect exit 0
Not doing: 不把基线写成实现步骤；不新增提问轮次。

Task: Design-lite 契约携带需求基线
Files:
- Modify: skills/devflow-core/references/core-methods.md | symbol: `## Method 2: Route Precedence And Risk Gate` | extend the Design-lite contract with the baseline
- Modify: skills/devflow-core/SKILL.md | symbol: `## Capability Dispatch` | name the baseline in the Design-lite row
- Modify: AGENTS.md | symbol: `3. **Gate**` | add the baseline to the Design-lite contract phrase
Change: 在 Design-lite 契约里增加 B 列表、invariants 和 edge cases 三项，并在 Core 的 Design-lite 行与 AGENTS 契约短语里点名；Depth C 的走向不变。
Acceptance: Design-lite 契约段落点名 B 列表、invariants、edge cases 三项。
Verify: `grep -n "Design-lite contract" skills/devflow-core/references/core-methods.md` → expect a line naming the baseline; `node scripts/validate-route-consistency.js` → expect exit 0; `wc -c AGENTS.md` → expect 8192 or less
Not doing: 不给 Design-lite 强加 Plan；不新增门。

Task: A 分支 Spec 用 B 编号承接基线
Files:
- Modify: skills/devflow-spec/SKILL.md | symbol: `## Process` | require Requirements rows to carry B IDs
- Modify: skills/devflow-spec/references/spec-plan-methods.md | symbol: `## Method 10: Spec Document And Plan Pack` | state the B-ID trace
Change: 在 Spec 的 Requirements 写法里增加“每行带 Confirmed request 的 B 编号和验收”的规则，并在 spec-plan 方法里说明编号不重排、不静默丢弃。
Acceptance: Spec 流程段写明 Requirements 行携带 B 编号和验收。
Verify: `grep -n "B 编号\|B ID" skills/devflow-spec/SKILL.md` → expect at least 1 match; `node scripts/devflow-spec.js --self-test` → expect exit 0
Not doing: 不新增 spec 必填章节；不改 spec checker。

Task: Plan 模板增加 Baseline 与 Coverage
Files:
- Modify: skills/devflow-plan/SKILL.md | symbol: `## Required Plan Header` | add `## Baseline` and `## Coverage` to the template
- Modify: commands/devflow-plan.toml | symbol: `Keep the plan header in English` | mirror the same header sections
- Modify: skills/devflow-plan/references/plan-methods.md | symbol: `## Progress Table` | define the trace rule and active-plan scope
Change: 在计划头部模板里增加 `## Baseline`（B 编号 + 可观察行为 + 验收）和 `## Coverage`（B → 任务号）两节，并在 plan-methods 说明活跃计划必填、done/legacy 豁免；同步 `commands/devflow-plan.toml` 的模板，删掉一句冗余的长度说明以守住 15 KiB。
Acceptance: SKILL 与 command 模板都出现 `## Baseline` 与 `## Coverage` 两节。
Verify: `grep -n "## Baseline\|## Coverage" skills/devflow-plan/SKILL.md commands/devflow-plan.toml` → expect 4 matches; `node scripts/devflow-budget.js` → expect exit 0
Not doing: 不加每任务 Covers 字段；不改 checker。

Task: Plan checker 强制 Baseline 覆盖
Files:
- Modify: scripts/devflow-plan.js | symbol: `checkPlanV2` | add baseline and coverage validation
- Modify: scripts/devflow-plan.js | symbol: `selfTest` | add valid and negative baseline cases
Change: 在 checkPlanV2 里增加 `## Baseline`/`## Coverage` 解析与活跃计划校验（缺节、漏 B、未知 B、未知任务号），并在 selfTest 增加对应正反用例；done/legacy 分支保持豁免。
Acceptance: `--self-test` 覆盖新增的 Baseline/Coverage 反例并通过。
Verify: `node scripts/devflow-plan.js --self-test` → expect exit 0
Not doing: 不改 legacy 分支；不改 spec checker。

Task: Prove 按 B 编号对账
Files:
- Modify: skills/devflow-prove/SKILL.md | symbol: `## Required Output` | change the Coverage placeholders to B IDs
- Modify: skills/devflow-prove/references/proof-recovery-methods.md | symbol: `## Proof Context Selection` | define the B-ID mapping and missing-B rule
Change: 把 Proof 输出里的 `Coverage`/`Not covered` 占位符替换为 B 编号映射，并在 proof-methods 说明每个 Baseline B 必须有证据或进 Not covered；不新增 proof 门。
Acceptance: Proof 输出块把 `Coverage` 写成 B 编号到证据的映射。
Verify: `grep -n "B IDs\|B 编号" skills/devflow-prove/SKILL.md` → expect at least 1 match; `node scripts/devflow-budget.js` → expect exit 0
Not doing: 不新增 proof 门；不超 15 KiB。

Task: 校验断言与分发副本同步
Files:
- Modify: scripts/validate-devflow.js | symbol: `usabilityPlanSkill` | assert the Baseline/Coverage markers
- Modify: plugins/devflow/skills/devflow-plan/SKILL.md | symbol: `## Required Plan Header` | mirror the root skill
- Modify: plugins/devflow/scripts/devflow-plan.js | symbol: `checkBaselineCoverage` | mirror the checker
- Modify: dsh/plugins/dsh-devflow/assets/skills/devflow-plan/SKILL.md | symbol: `## Required Plan Header` | generated copy
- Modify: dsh/plugins/dsh-devflow/assets/commands/devflow-plan.toml | symbol: `Keep the plan header in English` | generated command copy
Change: 在 validate-devflow 里增加 Baseline/Coverage 的契约标记断言，运行 dsh sync-assets 并刷新 Codex 的全部改动 skill/reference/script 副本，最后跑全量验证。
Acceptance: `npm run verify:all` 退出码 0。
Verify: `npm run verify:all` → expect exit 0
Not doing: 不新增依赖；不把生成副本当作源文件修改。

## Progress

| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | Brainstorm 确认请求携带需求基线 | done | `grep -n "Required behaviors\|Invariants\|Edge/failure cases"` 命中 3 行；budget 15358/15360 PASS |
| 2 | Design-lite 契约携带需求基线 | done | core-methods:102 命中三项；`node scripts/validate-route-consistency.js` exit 0；AGENTS 8190/8192 |
| 3 | A 分支 Spec 用 B 编号承接基线 | done | spec SKILL:42 命中 B ID；`node scripts/devflow-spec.js --self-test` PASS |
| 4 | Plan 模板增加 Baseline 与 Coverage | done | SKILL/command 共 6 处命中；plan SKILL 15356/15360 PASS |
| 5 | Plan checker 强制 Baseline 覆盖 | done | `--self-test` PASS；missing Baseline/Coverage、unknown B/task、uncovered B 均 FAIL；本计划 PASS |
| 6 | Prove 按 B 编号对账 | done | proof SKILL:94-95 含 B IDs；prove 15359/15360 PASS |
| 7 | 校验断言与分发副本同步 | done | `npm run verify:all` exit 0；`verify-plugin` 14 skills/5 self-tests；`npm test` PASS（19 runtime/34 cards） |
