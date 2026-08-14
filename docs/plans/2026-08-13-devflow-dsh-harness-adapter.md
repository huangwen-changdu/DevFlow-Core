# DevFlow DSH（DeepSeek Harness）适配落地计划

Status: done

Goal: 让 DevFlow-Core 的 skills 在 DeepSeek Harness（DSH）下，把触发、门控、独立审查、证据保留四件事落到 DSH 原生原语（ask_user_question / subagent / pwsh / 证据保留意识），在不改变生命周期语义、不新增依赖的前提下最大化 deepseek-v4-pro 的发挥。

Architecture: 纯文本/规则/skill 变更，零运行时代码。复用现有 host 适配器契约、install:user --home 同步面与渐进式按需加载。DSH 读 AGENTS.md + skills/（与 Codex/shared fallback 同源），故不新增 DSH 入口文件、不改 AGENTS.md；只在被选中的 lifecycle skill 内补 DSH 原生工具指引。

Tech Stack: Markdown + 现有零依赖 Node 校验器。

Source: 2026-08-13 会话分析结论（P0/P1 范围）；docs/platform-setup.md 现有 host 同步矩阵。

Spec coverage: design-only（无 Spec，直接 Plan 落地）。

Cut Decision: CUT_PASS (lite)。允许范围 = 8 个既有文件的最小文本改动 + 本 plan 文档；复用 = host 适配器契约 / install:user --home / Script Path Resolution；排除 = 不新增 DSH 入口文件、不改 AGENTS.md、不加 host-adapters 校验条目、不用 workflow/ralph/goal；验证 = verify:all + host:verify + trigger:verify + budget:verify + route:verify + git diff --check。

External Skills: none。

## Global Constraints
- 不改变 A/B/C direct-success、Core-return、审批、Proof PASS/FAIL/BLOCKED 语义。
- 不新增依赖/抽象/目录/配置面/框架层。
- 只写 DSH 现有模型工具名（ask_user_question / subagent / pwsh / todo_write），不发明 DSH 不具备的能力。
- 每个 skill 单文件不超过 15 KiB（budget:verify 门禁）；AGENTS.md 不超过 8 KiB（progressive-context 门禁），故不改 AGENTS.md。

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| docs/platform-setup.md | Modify | 记录 DSH 宿主读取面与同步矩阵行 | 现有 host 适配器文档面 | 不改 install 逻辑 |
| skills/devflow-core/references/core-methods.md | Modify | Script Path Resolution 增加 DSH 解析路径 | 脚本路径契约唯一 owner | 不改路由与方法语义 |
| skills/devflow-brainstorm/SKILL.md | Modify | A/B/C 门控补 ask_user_question 指引 | A/B/C 门控唯一 owner | 不改 A/B/C 语义 |
| skills/devflow-spec/SKILL.md | Modify | 审批 STOP 补 ask_user_question | 审批门唯一 owner | 不改 Spec 结构 |
| skills/devflow-plan/SKILL.md | Modify | 审批 STOP 补 ask_user_question | 审批门唯一 owner | 不改 Plan 结构 |
| skills/devflow-adversarial/SKILL.md | Modify | 补 fresh subagent 独立审查指引 | 独立审查唯一 owner | 不接生命周期 |
| skills/devflow-find-fault/SKILL.md | Modify | 补 fresh subagent 独立审查指引 | 独立审查唯一 owner | 不接生命周期 |
| skills/devflow-prove/SKILL.md | Modify | Evidence Rules 补 compaction 证据保留 | 证据纪律唯一 owner | 不改判定 |

Task: DSH 宿主文档与脚本路径
Task type: Documentation-only
Files:
- Modify: docs/platform-setup.md | Sync Matrix + new DSH section | 记录 DSH 入口面与用户级同步
- Modify: skills/devflow-core/references/core-methods.md | Script Path Resolution | 增加 DSH 脚本解析路径
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify docs/platform-setup.md Sync Matrix 增加 DSH 行，并在 WorkBuddy 之后新增 DeepSeek Harness (DSH) 小节，说明 AGENTS.md 入口、~/.dsh 用户目录、npm run install:user -- --home ~/.dsh --write 同步
- [ ] Modify skills/devflow-core/references/core-methods.md Script Path Resolution 追加 DSH 子句：经 DSH shell 工具执行 node scripts/devflow-*.js，用户级脚本解析到 ~/.dsh/scripts
- [ ] Run npm run host:verify and expect Host Adapter Verification Report prints Judgment: PASS
Acceptance: platform-setup.md 含 DSH 行与小节；core-methods.md Script Path Resolution 点名 DSH shell 路径与 ~/.dsh 目录
Verify: Run npm run host:verify; expect Judgment: PASS
Comments: none — 按现有 host 小节模式追加的文档
Not doing: 不加 DSH validator 条目、不改 AGENTS.md、不改 install 逻辑

Task: 结构化门控 ask_user_question
Task type: Documentation-only
Files:
- Modify: skills/devflow-brainstorm/SKILL.md | A/B/C Gate 小节 | 补 ask_user_question 指引
- Modify: skills/devflow-spec/SKILL.md | Process 步骤 7 STOP 行 | 补 ask_user_question 指引
- Modify: skills/devflow-plan/SKILL.md | Authoring Process 步骤 8 STOP 行 | 补 ask_user_question 指引
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify skills/devflow-brainstorm/SKILL.md A/B/C Gate，指示用 ask_user_question 工具以单选方式呈现 A / B / C 三个选项
- [ ] Modify skills/devflow-spec/SKILL.md Process 步骤 7，指示用 ask_user_question 请求审批，选项为 approve / request changes
- [ ] Modify skills/devflow-plan/SKILL.md Authoring Process 步骤 8，指示用 ask_user_question 请求评审，选项为 approve / request changes
- [ ] Run npm run trigger:verify and expect Skill Trigger Verification Report passed
Acceptance: brainstorm / spec / plan 三个 SKILL.md 均在各自 STOP 门点名 ask_user_question，且不改 A/B/C 与审批语义
Verify: Run npm run trigger:verify; expect Skill Trigger Verification Report passed
Comments: none — 在既有 STOP 门追加一行指引
Not doing: 改 A/B/C 语义、改审批语义、改 description frontmatter

Task: fresh subagent 独立审查
Task type: Documentation-only
Files:
- Modify: skills/devflow-adversarial/SKILL.md | Entry Gate 小节 | 补 fresh subagent 指引
- Modify: skills/devflow-find-fault/SKILL.md | Entry Gate 小节 | 补 fresh subagent 指引
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify skills/devflow-adversarial/SKILL.md Entry Gate，指示以 fresh subagent（不传对话种子）运行审查，使挑战独立于主代理推理
- [ ] Modify skills/devflow-find-fault/SKILL.md Entry Gate，指示以 fresh subagent（不传对话种子）运行审查，使批判独立于主代理推理
- [ ] Run npm run trigger:verify and expect Skill Trigger Verification Report passed
Acceptance: adversarial / find-fault 两个 SKILL.md 均点名 subagent，并保留不改变生命周期状态的边界
Verify: Run npm run trigger:verify; expect Skill Trigger Verification Report passed
Comments: none — 保留既有独立审查边界的追加指引
Not doing: 改五角度或 find-fault 输出契约、接生命周期交接

Task: compaction 证据纪律
Task type: Documentation-only
Files:
- Modify: skills/devflow-prove/SKILL.md | Evidence Rules 小节 | 补 compaction 证据保留规则
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify skills/devflow-prove/SKILL.md Evidence Rules，追加规则：DSH 会裁剪超长工具结果，关键命令、结果摘录、判定依据须在裁剪前保留到 completion report 或 todo_write
- [ ] Run npm test and expect DevFlow validation passed
Acceptance: prove SKILL.md Evidence Rules 点名 DSH 裁剪行为与保留动作，且不放松 PASS/FAIL/BLOCKED 判定
Verify: Run npm test; expect DevFlow validation passed
Comments: none — 追加一条证据纪律规则
Not doing: 改 PASS/FAIL/BLOCKED 语义、改 Completion 输出契约
