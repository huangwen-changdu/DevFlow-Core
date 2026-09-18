# DevFlow-Core 项目长期记忆

## Skill 体系

- devflow 已系统性吸收 Ponytail 方法论（README 明确声明）。ponytail-audit 的能力被 devflow-audit（超集）覆盖；ponytail-review 的 diff review 能力被 devflow-cut 的 ultra 模式 + Overengineering Review 段落覆盖。
- **约定**：不再原样移植 ponytail-* skill 到 devflow。需要增强时，把优点吸收进现有 devflow skill，保持单一入口、避免 tag 退化（ponytail 只有 5 tag，devflow 有 6 个含 reuse）。
- devflow-audit = 事后仓库扫描（只报告不改代码）；devflow-cut = 事前门禁（7 Required Gates + CUT_* 控制流）。两者方向相反、职责互补。
- devflow skill 命名风格：description 内嵌显式触发词短语，便于用户自然激活。

## 契约变更纪律（2026-09-16 教训）

- 计划契约 v1→v2 瘦身（commit e2ade6d）当初只改了 `devflow-plan` skill 与 checker 的 legacy 分支，**下游消费面未同步**，曾留下 10 处活体面残留（`commands/devflow-plan.toml` 整份 v1 模板、`spec-plan-methods.md` 的 v1 描述、build/prove 的已删字段引用等）。这些已在 `docs/plans/2026-09-16-plan-contract-evidence-density.md` 中修正。
- **现已有机检防护**：`scripts/validate-devflow.js` 的 `liveContractSurfaces` 扫描 skills 全部 md、commands 全部 toml、AGENTS.md、README.md，命中已删字段名（`Prewalk`/`Current behavior`/`Target behavior`/`Change mechanics`/`Call impact`/`Task type`/`File Structure`/`Spec coverage`）即失败，除非该行同时含 legacy 语境词（legacy|v1|no longer|not part of）。落地时它立即抓出两处原清单外的同族残留。
- **仍未覆盖**：`Comments`、`Steps`、`Architecture`、`Tech Stack`、`External Skills` 未列入禁用清单（受当时计划范围限制），这些字段的漂移仍不可检。
- 改根 `skills/` 或 `scripts/` 后必须刷新三份副本：`node dsh/plugins/dsh-devflow/scripts/sync-assets.js`（DSH assets）与**手工镜像** `plugins/devflow/`（Codex 插件无同步脚本，按 `skills/*` 与 `scripts/*.js` 交集覆盖；`verify-plugin.js` 只校验不刷新）。

## 计划证据规则（2026-09-16 起）

- 证据两级准入：**L1 可重跑命令 + 当时输出**；**L2 从既有产物机械复制**（路径存在或字符串确实出现）。指向存在的路径/符号不得单独充当证据；无引证散文断言等同无证据。
- 计划头部应有 `## Recon`（侦查记录）：每行"反引号命令 → 该命令的输出"，无侦查需求时写 `none` 加理由。
- 全局不变量由既有头部 `Not doing` 字段承载，每句须能在 `Source` 的 Non-goals 或 `Cut` 行找到逐字痕迹，冲突时以 `Cut` 行为准——**不新增独立 Global Constraints 小节**。
- 跨任务 `Interfaces` 通道只在 `Execution mode` 为 `single-subagent` 或 `fan-out` 时必填。
- 已知天花板（代码里带 `devflow:` 标记）：Recon 与 Not doing 只校验**形态**不校验真伪；可行的伪造路径是"长 Cut 行覆盖无来源的语句"。

## 关键路径

- devflow skill 目录：`skills/devflow-*/SKILL.md`
- devflow-audit 脚本：`scripts/devflow-audit.js`
- devflow-cut 原生能力清单：`skills/devflow-cut/references/native-capability-checklist.md`
- devflow-debt：command `commands/devflow-debt.toml` + script `scripts/devflow-debt.js`
