# Review Selector Belongs At The Trigger Surface

- Trigger: independent review skills, audit vs adversarial vs find-fault, 审查一下, review overlap, double load, 同时加载, skill description, trigger surface, review selector, 对象 + 问题
- Lesson: 多个“审查”技能重叠时，判别器必须放在**触发面**（description 的 not-for 行 + 一个 canonical Review Selector 表），不能只写在正文的“另一个用 X”。默认只选一个 owner，按“对象 + 问题”分流：仓库/文件集 -> audit；当前结果/结论 -> adversarial；需求/实现遗漏 -> find-fault；diff/plan 过度设计 -> cut。说不清就只问一次四选一，不并行加载；用户明确两个都要时再按顺序跑并分开报告。Prove 内置的 adversarial review 是完成门步骤，不是加载独立技能。
- Rejected: 合并 adversarial + find-fault（两个 SKILL 合计约 15KB，顶预算；五角度覆盖与 unease 输出契约不同）；按阶段分（两者都声明 any stage）；只在正文互指（用户先看到的是 description，看到时已经选错）。
- Next action: 新增或修改审查类技能时，先写 Review Selector 表和 description 的 not-for 行，再加 trigger 用例；默认一个 owner；不要用“力度/阶段”当判别器。
- Scope: project
- Related: skills/devflow-core/references/skill-guide.md, skills/devflow-core/references/core-methods.md, skills/devflow-adversarial/SKILL.md, skills/devflow-find-fault/SKILL.md, skills/devflow-audit/SKILL.md, scripts/validate-skill-triggers.js
- Evidence: 2026-11-15 用户反馈实际审查时同时加载 adversarial + find-fault，三技能定位不清；Review Selector 落地后 `npm run trigger:verify` 新增 `review selector without double load` 通过，反向删 `## Review Selector` → EXIT:1 点名后恢复 PASS；`npm run verify:all` EXIT:0；三份副本 sha256 逐字节一致。
- Evidence Level: L2
- Invalidation: 若审查入口合并成一个技能或由一个统一 router 自动选择，且不再需要 description 级判别，需修订或退役本卡。
