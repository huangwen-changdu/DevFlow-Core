# Report Inventory Must Not Be Capped

- Trigger: report-only skill, audit output, finding cap, lean list swallowed, 另有 N 条未列出, 用户点名要完整清单, replacement code, 替换代码, Apply next, 交接建议, 报告省略
- Lesson: 报告型技能的上限只能压“建议类 finding”，不能压用户点名要的清单（lean/cut inventory）。清单全量打印，每条带可判定的替换（一行内联 / 最多 6 行缩进 / 无替换写 `Nothing replaces it.`），然后在清单后给 `Apply next`：所有可安全落地的项按 handoff 路径分组列出，不设条数上限；报告仍然不改文件，用户确认后由 `/devflow-simplify` 或 `core -> cut -> build -> prove` 落地并重验。把清单折成计数，用户看到的是一个数字而不是可决策的证据；把推荐写成自动执行，又会跳过用户确认和 Prove 的重验。
- Rejected: 用统一 20 条上限管所有输出（会吞掉清单）；让 audit 直接应用（跳过用户确认与重验）；只出清单不推荐（用户仍要自己判断落点）；只在用户选定后再出替换代码（与“一起输出”的要求相反，首轮无法判断值不值得做）。
- Next action: 以后给报告加 cap 时先分“建议类”与“用户点名清单”：清单类不设上限、不折计数；清单项必须带替换或明确无替换；所有可安全落地项按 handoff 路径分组、不设条数上限，需要行为决策的项留在清单外；给关键契约句加 validator 锚点，并做一次反向删除验证。
- Scope: project
- Related: skills/devflow-audit/SKILL.md, skills/devflow-audit/references/full-quality-audit.md, commands/devflow-audit.toml, scripts/validate-devflow.js, skills/devflow-prove/references/simplify-pass.md
- Evidence: 2026-11-15 用户反馈 audit 实际输出吞掉 10+ 条 lean；三轮契约调整后 `npm run verify:all` EXIT:0（19 项）；三份副本 sha256 F32FC231 / D816CE03 / 49CD8E55 逐字节一致；validator 反向删 `Apply next:` → EXIT:1 点名后恢复 PASS，另删 `Route by blast radius` 同样 EXIT:1 后恢复；audit SKILL 9085/15360。
- Evidence Level: L2
- Invalidation: 若 audit 改为有界清单且用户显式设定上限，或改成自动应用（不再需要 handoff），需修订或退役本卡。
