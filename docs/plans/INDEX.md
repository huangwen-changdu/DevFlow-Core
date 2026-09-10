# 计划索引（INDEX）

> 摘要: 用途=一眼看清每份计划的状态与落地证据 | 维护=Plan 批准与 Prove PASS 时更新本表 | 机检=node scripts/devflow-plan.js --index | 更新日=2026-09-10

## 检索方式（给 AI 的用法）

1. 先在本表按 Status 过滤：`approved` 待执行、`in-progress` 执行中、`done` 已落地、`legacy` 旧格式历史计划。
2. 再打开目标计划读 `## Progress` 表看逐任务状态与证据；旧格式计划看正文与 `Source`。
3. 状态以计划文件头 `Status:` 为唯一事实源，本表只是视图；两者不一致时 `--index` 机检会报错。

## 索引

| 日期 | 计划 | Status | 来源 | 落地证据 | 功能条目 |
|---|---|---|---|---|---|
| 2026-07-14 | [2026-07-14-codex-devflow-observability](2026-07-14-codex-devflow-observability.md) | legacy | docs/specs/2026-07-14-codex-devflow-observability.md | - | - |
| 2026-07-16 | [2026-07-16-completion-knowledge-capture](2026-07-16-completion-knowledge-capture.md) | legacy | docs/specs/2026-07-16-completion-knowledge-capture.md | - | DevFlow 学习闭环 |
| 2026-07-17 | [2026-07-17-devflow-brainstorm-superpowers-interaction](2026-07-17-devflow-brainstorm-superpowers-interaction.md) | legacy | docs/specs/2026-07-17-devflow-brainstorm-superpowers-interaction.md | - | - |
| 2026-07-17 | [2026-07-17-knowledge-recall-chain](2026-07-17-knowledge-recall-chain.md) | legacy | docs/specs/2026-07-17-knowledge-recall-chain.md | - | - |
| 2026-07-20 | [2026-07-20-query-kibana-logs-skill](2026-07-20-query-kibana-logs-skill.md) | legacy | - | - | - |
| 2026-07-24 | [2026-07-24-local-capability-evaluation](2026-07-24-local-capability-evaluation.md) | legacy | docs/specs/2026-07-24-local-capability-evaluation.md | - | - |
| 2026-07-26 | [2026-07-26-completion-document-followup-skill](2026-07-26-completion-document-followup-skill.md) | legacy | approved design contract in the current task | - | - |
| 2026-07-26 | [2026-07-26-independent-manual-review-skills](2026-07-26-independent-manual-review-skills.md) | legacy | docs/specs/2026-07-26-independent-manual-review-skills.md | - | DevFlow 独立评审 |
| 2026-07-28 | [2026-07-28-devflow-brainstorm-clarification-boundary](2026-07-28-devflow-brainstorm-clarification-boundary.md) | legacy | docs/specs/2026-07-28-devflow-brainstorm-clarification-boundary.md | - | - |
| 2026-07-28 | [2026-07-28-devflow-brainstorm-spec-responsibility-split](2026-07-28-devflow-brainstorm-spec-responsibility-split.md) | legacy | docs/specs/2026-07-28-devflow-brainstorm-spec-responsibility-split.md | - | - |
| 2026-07-28 | [2026-07-28-devflow-plan-writing-plans](2026-07-28-devflow-plan-writing-plans.md) | legacy | Approved user clarification on 2026-07-28: retain `devflow-plan` as t... | - | - |
| 2026-07-29 | [2026-07-29-code-level-plan-pack-contract-implementation](2026-07-29-code-level-plan-pack-contract-implementation.md) | legacy | docs/specs/2026-07-29-code-level-plan-pack-contract.md | - | - |
| 2026-07-30 | [2026-07-30-constraint-rule-calibration](2026-07-30-constraint-rule-calibration.md) | legacy | docs/specs/2026-07-30-constraint-rule-calibration.md | - | - |
| 2026-07-30 | [2026-07-30-progressive-context-and-adapter-contract](2026-07-30-progressive-context-and-adapter-contract.md) | legacy | docs/specs/2026-07-31-skill-owned-lifecycle-flow.md | - | - |
| 2026-07-31 | [2026-07-31-ai-code-quality-gate](2026-07-31-ai-code-quality-gate.md) | draft | docs/specs/2026-07-31-ai-code-quality-gate.md（已批准） | - | - |
| 2026-07-31 | [2026-07-31-devflow-harness-iteration](2026-07-31-devflow-harness-iteration.md) | approved | Cut Decision（2026-07-31 Brainstorm 确认，B 深度）；无独立 Spec 文件 | - | DevFlow 验证矩阵 |
| 2026-07-31 | [2026-07-31-meta-skill-capability-integration](2026-07-31-meta-skill-capability-integration.md) | legacy | docs/specs/2026-07-31-meta-skill-capability-integration.md | - | - |
| 2026-07-31 | [2026-07-31-plan-owned-code-quality-gate](2026-07-31-plan-owned-code-quality-gate.md) | legacy | docs/specs/2026-07-31-plan-owned-code-quality-gate.md | - | - |
| 2026-08-13 | [2026-08-13-devflow-dsh-harness-adapter](2026-08-13-devflow-dsh-harness-adapter.md) | done | 2026-08-13 会话分析结论（P0/P1 范围）；docs/platform-setup.md 现有 host 同步矩阵。 | 已落地 commit 2ddba14（适配 DeepSeek Harness 运行时） | - |
| 2026-08-19 | [2026-08-19-devflow-dsh-plugin-pack](2026-08-19-devflow-dsh-plugin-pack.md) | legacy | Brainstorm Confirmed request（2026-08-19 会话）+ CUT_PASS Cut Decision（B ... | - | DSH 分发与预设 |
| 2026-08-20 | [2026-08-20-round-based-review-skills](2026-08-20-round-based-review-skills.md) | legacy | 2026-08-20 会话确认请求（B 分支，无存档 Spec）+ 本计划随附 Cut Decision。 | - | - |
| 2026-08-21 | [2026-08-21-loop-engine-four-suite](2026-08-21-loop-engine-four-suite.md) | legacy | Brainstorm Confirmed request（本会话 2026-08-21 四件套落地，无 spec 文件）+ 计划审阅修订（... | - | - |
| 2026-08-21 | [2026-08-21-loop-engineering-preset](2026-08-21-loop-engineering-preset.md) | legacy | docs/specs/2026-08-21-loop-engineering-preset.md（已批准修订版） | - | 循环工程 |
| 2026-08-23 | [2026-08-23-plan-zero-view-execution](2026-08-23-plan-zero-view-execution.md) | legacy | Brainstorm Confirmed request（2026-08-23 会话）+ 本计划随附 Cut Decision（B 深度） | - | - |
| 2026-09-01 | [2026-09-01-codex-devflow-plugin](2026-09-01-codex-devflow-plugin.md) | legacy | Confirmed request and CUT_PASS from the current task conversation. | - | - |
| 2026-09-04 | [2026-09-04-model-context-tightening](2026-09-04-model-context-tightening.md) | legacy | Confirmed request and CUT_PASS from the current task conversation. | - | - |
| 2026-09-10 | [2026-09-10-devflow-usability-flow-reconfiguration](2026-09-10-devflow-usability-flow-reconfiguration.md) | done | docs/specs/2026-09-10-devflow-usability-flow-reconfiguration.md | verify:all 退出码 0 + --index PASS + 六个用户级 home --check 通过 | DevFlow 计划生成与落地 |
| 2026-09-10 | [2026-09-10-feature-index-progressive-loading](2026-09-10-feature-index-progressive-loading.md) | done | 用户请求（2026-09-10 会话）+ Cut Decision | verify:all 退出码 0 + --index PASS + --query 正负例通过 | DevFlow 功能索引 |
| 2026-09-10 | [2026-09-10-requirement-loop-and-developer-profile](2026-09-10-requirement-loop-and-developer-profile.md) | done | docs/specs/2026-09-10-requirement-loop-and-developer-profile.md | verify:all 退出码 0 + --index PASS + --loop 计数 | DevFlow 需求闭环 |
| 2026-09-10 | [2026-09-10-wiki-single-way-publish](2026-09-10-wiki-single-way-publish.md) | done | 用户请求（2026-09-10 会话，方案 A）+ Cut Decision | wiki:check 无克隆 exit 0 + --self-test PASS + verify:all 退出码 0 | Wiki 单向发布 |

## 维护机制

- **Plan 批准时**：新增或更新本表行，Status 写 `approved`。
- **Prove PASS 时**：把 Status 改为 `done` 并填入落地证据（命令与关键结果）。
- **不迁移旧计划**：缺 `Status:` 的历史计划一律标 `legacy`，由 checker 的 legacy 分支校验。
- 索引与文件系统不一致（漏行、多行、状态不符、`done` 无证据）时 `node scripts/devflow-plan.js --index` 非零退出。
