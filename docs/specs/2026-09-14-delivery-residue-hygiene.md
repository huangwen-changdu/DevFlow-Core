# Delivery Surface Residue Hygiene

Status: draft
Date: 2026-09-14
Source: Brainstorm Confirmed request（2026-09-14 会话，用户选择 Depth A）

## Goal

让 DevFlow 的最终产物（代码注释、commit/PR/交付文案、文档、终稿报告）只描述已采纳的最终状态，不回放会话中被否方案、用户纠正与否定指令本身；通过现有流程的少量位置内嵌规则与收口检查实现，并随 DSH/Codex 插件分发同步，不新增独立技能。

## Context

- 需求台账：docs/requirements.md 2026-09-14 行，状态 open，深度 A；本 Spec 为其设计契约。
- 问题证据（源项目 no-negative-echo 调研）：番茄炒蛋案例（PR 标题写成「番茄炒蛋（无东坡肉）」）；anthropics/claude-code#65961（注释泄漏会话，AGENTS.md 与记忆中的规则常被忽略）；astral-sh/ruff AGENTS.md（「读者没有 Codex 会话」验收标准）。源技能自述为提示词层缓解，PASS 不等于语义通过。
- 现有覆盖与缺口：Build 已有注释纪律（Comment rules 与 Comment output check），Prove 已有注释校验与 code review checklist；但没有任何规则约束「会话残留/负向回声」，commit/PR 文案没有节点拥有。
- 预算事实（机检）：AGENTS.md 6406B / 8192B 上限（余 1786B）；单 skill SKILL.md 上限 15360B——devflow-build 15274B（余 86B）、devflow-prove 15341B（余 19B）、devflow-plan 12614B、devflow-spec 6746B、devflow-core 8383B。build/prove 的 SKILL.md 不能再加规则正文。
- 分发事实：DSH 插件 dsh/plugins/dsh-devflow 通过 sync-assets.js 复制 skills（含 references，不含 AGENTS.md）到 assets/；Codex 插件 plugins/devflow 保存 14 个 skill 树副本（含 references，不含 AGENTS.md），按 2026-09-01 计划约定不建自动同步机制，手动复制并逐字节比对；宿主适配文件（CLAUDE.md、.codebuddy 规则、copilot-instructions）是 AGENTS.md 的指针，不需要镜像同句。
- 外发动作：npm publish 需要用户 token，按先例记为待用户执行，不阻塞本轮验收。

## Requirements

- R1：AGENTS.md 增加总规则短句，覆盖所有最终产物，包括生命周期之外用户要求生成的 commit、PR 与交付文案；规则以正向表述为主，不写禁词清单。
- R2：devflow-core SKILL.md 增加同一短规则（Sense 阶段常载；DSH/Codex 插件用户的会话内可见面）。
- R3：Build 规则与收口：注释只描述最终行为与必要的非显然 WHY，不写被否方案、会话纠正过程或「为什么没有做 X」。
- R4：Prove 收口：终稿前以「没有参与本次会话的读者」视角通读全部最终产物与包装（文件名、标题、注释、文档、终稿报告），剔除会话残留；不新增机器语义扫描。
- R5：Spec 与 Plan 文档规则：命名、标题与正文从已采纳目标生成；保留 Non-goals 与 Rejected 等决策记录。
- R6：规则详略落点满足预算：Build、Prove、Spec、Plan 的规则写入其必读 reference（build-methods.md、proof-recovery-methods.md、spec-plan-methods.md），相应 SKILL.md 不新增正文。
- R7：docs-followup 在产出正文文档时遵守同规则（规则落其 SKILL.md，预算允许）。
- R8：scripts/validate-devflow.js 增加接线断言：6 个承载位置各包含稳定标记短语 accepted final state，防止规则漂移或误删。
- R9：carve-out：保留刻意决策记录（plan Rejected、spec Non-goals、学习卡、评审发现）、安全/兼容/审计事实、任务开始前已有改动与已执行的外部事件。
- R10：插件同步：DSH 走 sync-assets、子包自测、bump 版本；Codex 刷新副本、verify-plugin、逐字节比对、bump 版本；publish 待用户执行。
- R11：规则措辞避免否定式清单（不反复点名禁词），这一约束同时适用于本 Spec 落地的规则文本。

## Non-goals

- 不新增技能、命令、扫描脚本或 exact-term 语义扫描工具。
- 不复制、不依赖 no-negative-echo 的源码、安装器与评测资产。
- 不改变路由表、生命周期交接契约、独立评审技能边界。
- 不把 AGENTS.md 打包进 DSH/Codex 插件。
- 不为 Codex 插件新建自动同步机制（沿用现有手动复制与逐字节比对约定）。
- 不清理计划 Rejected、spec Non-goals、学习卡与评审发现等刻意记录。
- 不处理凭据、隐私、合规类专门问题。

## Approach

对比选项：

- 选项 1（选定）：详情写进各节点必读 reference（build-methods.md、proof-recovery-methods.md、spec-plan-methods.md），AGENTS.md 与 devflow-core SKILL.md 各加短规则，validate-devflow.js 加接线断言。改动集中在预算安全的位置；references 本来就是节点必读文件。
- 选项 2：规则正文写进 6 个 SKILL.md。被预算否决：devflow-build 余 86B、devflow-prove 余 19B，任何正文都会超限。
- 选项 3：SKILL.md 只放一行指针、详情放 reference。比选项 1 多改两处 SKILL.md，收益相同（reference 本就必读），且指针仍占预算。
- 选项 4：只在 AGENTS.md 写总规则。无节点级收口与断言，无法覆盖插件用户，已在 Brainstorm 否决。

选定选项 1。权衡：详细规则不在 SKILL.md 顶层可见，依赖「必读 reference」的既有机制；换来的是不触碰预算红线、改动面最小、插件同步链自动携带 references。

规则的正向表述用于最终文案与标题；决策记录、安全事实与基线改动有明确保留清单（R9）。收口检查只做人工通读（语义判断），机器只断言规则存在（结构判断），与仓库既有分工一致。

## Impact

- 修改文件：
  - AGENTS.md（短规则，约 2 行，预算内）
  - skills/devflow-core/SKILL.md（短规则，预算内）
  - skills/devflow-build/references/build-methods.md（Build 注释规则扩充）
  - skills/devflow-prove/references/proof-recovery-methods.md（终稿通读收口）
  - skills/devflow-spec/references/spec-plan-methods.md（Spec/Plan 文档规则）
  - skills/devflow-docs-followup/SKILL.md（条件纳入的短规则）
  - scripts/validate-devflow.js（接线断言块）
  - docs/requirements.md（台账推进）、docs/specs 与 docs/plans（本次落地物）、docs/features/INDEX.md（Prove PASS 后由 Learn 增行）
- 分发与发布：dsh/plugins/dsh-devflow（sync-assets 刷新 assets、bump package.json）；plugins/devflow（刷新 skills 副本、bump .codex-plugin/plugin.json）；根 package.json 与 plugin.json 版本按既有发布节奏处理。
- 不影响：路由与生命周期契约、命令文件、hooks、宿主适配文件、既有 checker 脚本行为（devflow-spec/plan/review/debt/audit 不变）。
- 预算：AGENTS.md 增后仍低于 8KiB；单 skill 与总量预算因不新增 SKILL.md 正文（docs-followup 除外，余量充足）保持通过。

## Acceptance

- npm run verify:all 退出码 0（含新增接线断言、预算校验、触发与宿主校验）。
- 6 个承载位置含稳定标记短语 accepted final state：AGENTS.md、devflow-core/SKILL.md、build-methods.md、proof-recovery-methods.md、spec-plan-methods.md、devflow-docs-followup/SKILL.md。
- Build 与 Prove 的 SKILL.md 字节数不超过 15360B，且不因本变更上升。
- DSH 插件：sync-assets.js 连续两次运行幂等；node dsh/plugins/dsh-devflow/test/sync.test.js 通过；dsh/plugins/dsh-devflow/package.json 版本已 bump。
- Codex 插件：node plugins/devflow/scripts/verify-plugin.js 通过；plugins/devflow/skills 与根 skills 源逐字节一致；.codex-plugin/plugin.json 版本已 bump。
- 收口检查可演示：按一次真实最终 diff 与交付文案走通「无会话读者」通读，并给出保留/剔除判断示例。
- npm publish 未执行时，在需求台账与交付说明中记为待用户执行。

## Verification

- 结构：node scripts/devflow-spec.js docs/specs/2026-09-14-delivery-residue-hygiene.md；node scripts/devflow-plan.js --index。
- 规则接线：npm run verify:all（validate-devflow.js 断言、devflow-budget.js、host 与 trigger 校验）。
- 台账与索引：node scripts/devflow-plan.js --index 校验需求台账与双索引。
- DSH：node dsh/plugins/dsh-devflow/scripts/sync-assets.js（两次幂等）；node dsh/plugins/dsh-devflow/test/sync.test.js。
- Codex：node plugins/devflow/scripts/verify-plugin.js；源与副本递归逐字节比较（Node 脚本或 PowerShell 比对 SHA-256）。
- 收口演示：按最终 diff 列出交付面并逐面判断保留或剔除，作为 Prove 的人工证据。
- 外发：npm publish 由用户执行（需 token）。

## Code Documentation

- scripts/validate-devflow.js：新增接线断言块，按该文件既有段落注释风格（每组断言前一行注释说明防漂移目的）添加一行说明。
- 规则文本（AGENTS.md、devflow-core、三份 reference、docs-followup）本身即文档，不额外加代码注释。
- 无新增函数、接口或配置；无其他代码注释需求。

## Open Questions

无。npm publish 的执行权在用户，不构成阻塞项。
