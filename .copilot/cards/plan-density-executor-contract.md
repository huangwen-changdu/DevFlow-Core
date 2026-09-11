# Plan Density Follows The Executor Contract

- Trigger: 计划密度, 计划太薄, 计划太厚, 任务粒度, right-sizing, 跨会话执行, 跨模型交接, executor context, 内嵌代码, plan density
- Lesson: 计划密度由执行者预设定档，不是越详细越好。本仓执行者=不同会话/其他模型，可能加载 DevFlow 技能且可读仓库锚点；因此 v2（六字段 + 符号锚点 + 可运行 Verify）为基线，只在"机制无法从任务锚点推出"时让 `Change` 携带最小可运行改法（伪代码/精确替换/关键片段）。right-sizing 判据：任务=最小可独立评审单元——评审者可能拒一个却批准邻居处才拆，setup/config/文档折入交付任务。superpowers 式全量内嵌代码只在"无技能、无仓库的零上下文执行者"前提下才必要；v1 全量密度实测 277-396 行、Build 只照抄、计划漂移。
- Next action: Next time 决定计划密度或粒度，先确认执行者契约（技能可用？仓库可读？模型能力？），先给 v2 基线 + 条件改法，不要为假想消费者全量内嵌代码；改条件触发词时 grep 所有引用表面（plan SKILL / plan-methods / build SKILL），同步镜像并用断言锁住新短语。
- Scope: project
- Related: skills/devflow-plan/SKILL.md, skills/devflow-plan/references/plan-methods.md, skills/devflow-build/SKILL.md, scripts/validate-devflow.js, docs/requirements.md
- Evidence: 2026-09-11 两轮变更（任务粒度收紧 + 跨会话/跨模型可执行），npm run verify:all 退出码 0，既有 v2 计划 exit 0，DSH/Codex 镜像哈希一致，budget PASS。
- Invalidation: 若执行者前提改变（无技能裸执行成为常态）、或 v2 六字段契约被替换，需修订或退役本卡。
