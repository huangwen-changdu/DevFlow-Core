# DevFlow Marker Harvest Grammar

- Trigger: devflow: marker, 简化标记, devflow-debt, ceiling, revisit, no-ceiling, 债务标记, intentional simplification marker, /devflow-debt 收割不到
- Lesson: `scripts/devflow-debt.js` 的 classifyMarker 只认字面 token：必须同时出现 `ceiling:`（或 `ceiling `）与 `revisit:`（或 `revisit when`）才算 `ok`；只写"这是一个没有 checker 的静态副本"这类 ceiling 语义但不含 ceiling 字样，会被判 `no-ceiling`。另外 Cut skill 的模板 `devflow: <ceiling>, revisit when <trigger>` 因为 detail 里同时含 `<` 和 `>` 会被 harvester 整体跳过（scan 第 107-109 行）——照抄模板等于标记不可见，必须替换成真实文本。标记是"可收割"，不是"写上去就算"，且独立扫描发现任何非 ok 标记即 exit 1（`npm run debt:verify` 只跑 --self-test，不会拦住）。
- Next action: 下次写 `devflow:` 标记时，first 用 `# devflow: ceiling: <接受的简化及其实测上限>, revisit when <触发条件>` 的字面格式（保留 ceiling: 与 revisit when 两个 token），再跑 `node scripts/devflow-debt.js` 确认该行 status 为 `ok`；do not 直接照抄 Cut skill 的尖括号模板，也不要只写 ceiling 的语义描述。
- Scope: project
- Related: scripts/devflow-debt.js, skills/devflow-cut/SKILL.md, dsh/agent-presets/devflow-2/agent.cordis.yml, dsh/plugins/dsh-devflow/scripts/sync-assets.js, dsh/plugins/dsh-loop-engine/scripts/sync-assets.js
- Evidence: 2026-09-14 devflow-2 persona 补齐：首版标记写作 "restated here with no checker on this file, revisit when..." 被判 `no-ceiling`；补上 `ceiling:` 字面 token 后同一行 status 变 `ok`（源与插件资产两处同验）。同时实测发现两个既有标记（`dsh/plugins/dsh-devflow/scripts/sync-assets.js:10`、`dsh/plugins/dsh-loop-engine/scripts/sync-assets.js:10`）同样处于 no-ceiling，独立扫描因此 exit 1，而 `npm run verify:all` 仍全绿。
- Invalidation: devflow-debt.js 放宽词法（接受自然语言 ceiling）、或 Cut skill 模板改为非尖括号占位符、或 debt 独立扫描被纳入 verify:all 门禁后需修订本卡
