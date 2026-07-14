# DevFlow-Core 项目长期记忆

## Skill 体系

- devflow 已系统性吸收 Ponytail 方法论（README 明确声明）。ponytail-audit 的能力被 devflow-audit（超集）覆盖；ponytail-review 的 diff review 能力被 devflow-cut 的 ultra 模式 + Overengineering Review 段落覆盖。
- **约定**：不再原样移植 ponytail-* skill 到 devflow。需要增强时，把优点吸收进现有 devflow skill，保持单一入口、避免 tag 退化（ponytail 只有 5 tag，devflow 有 6 个含 reuse）。
- devflow-audit = 事后仓库扫描（只报告不改代码）；devflow-cut = 事前门禁（7 Required Gates + CUT_* 控制流）。两者方向相反、职责互补。
- devflow skill 命名风格：description 内嵌显式触发词短语，便于用户自然激活。

## 关键路径

- devflow skill 目录：`skills/devflow-*/SKILL.md`
- devflow-audit 脚本：`scripts/devflow-audit.js`
- devflow-cut 原生能力清单：`skills/devflow-cut/references/native-capability-checklist.md`
- devflow-debt：command `commands/devflow-debt.toml` + script `scripts/devflow-debt.js`
