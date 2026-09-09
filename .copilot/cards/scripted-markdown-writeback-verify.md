# Scripted Markdown Write-Back Must Verify The Header

- Trigger: 用 node 脚本回写 Markdown 表行, 计划 Progress 回写, 索引表更新, heredoc 里写正则, 文件头被改坏, replace 插到文件开头
- Lesson: 通过 shell/heredoc 传给 node 的正则字符串会丢一层反斜杠——写 `'^\\| 1 \\|.*$'` 实际得到 `'^| 1 |.*$'`，其中 `^` 变成"字符串起始"这一可选分支，零宽匹配位置 0，于是 `String.replace` 把新内容插到文件最前面，标题行被顶掉。更糟的是回写后没有校验文件头，损坏直到 plan checker 报 `Progress rows: 6 (tasks 5) mismatch` 才暴露。
- Next action: 下次用脚本回写 Markdown 时，(1) 表行更新用「旧整行字符串 → 新整行字符串」映射，不要用带 `\\` 的字符串构造正则，需要正则时用 RegExp 字面量；(2) 写完立即 `head -1` 校验标题/表头并用对应 checker 复核行数；(3) 把回写步骤的证据写进计划 Progress，让下一次核对有依据。
- Scope: project
- Related: docs/plans/*.md, docs/features/INDEX.md, docs/plans/INDEX.md, scripts/devflow-plan.js
- Evidence: 2026-09-10 功能索引渐进加载计划回写 Progress 时标题行被替换为第 5 行，checker 报 `Progress rows: 6 (tasks 5) mismatch`；改用精确整行映射后 60 行 PASS。
- Invalidation: 若回写统一交给带单测的脚本/工具处理，本卡可退役。
