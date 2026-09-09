# 功能索引渐进加载（触发词路由 + 查询模式）

Status: done
Goal: 让 `docs/features/INDEX.md` 成为路由表而非正文——AI 按触发词只读命中行的入口，索引变大时用 `--index --query` 过滤，不再整表展开能力文档。
Not doing: 不为每个能力新增详情文件；不改 `--index` 默认全量语义与退出码；不动 27 行历史计划正文；不新增目录、依赖或脚本。
Cut: 做 触发词列 + Sense 匹配后展开 + `--index --query` + Learn 维护触发词 | 不做 每能力详情文件、独立脚本、改默认语义 | 复用 `.copilot/LEARNING_INDEX.md` 触发词模式与既有 `--index` 解析 | 验证 `npm run index:verify`、`npm run verify:all`、`--query` 正负例 | Rejected: 每能力详情文件——新增 8 个文件与维护面，8 行索引当前不需要；独立 `devflow-features.js`——复用 `--index` 模式
Execution mode: sequential
Landed: 2026-09-10 · npm run verify:all 退出码 0 + --index PASS + --query 命中/未命中均 exit 0

## Tasks

Task: 功能索引加触发词列
Files:
- Modify: docs/features/INDEX.md | symbol: `## 索引` | 表格增加触发词列并更新用法段
Change: 表头增加「触发词」列，每行填该功能的任务关键词；用法段改为匹配后只读命中行，不批量读能力文档
Acceptance: 表头含「触发词」；8 行触发词非空；用法段写明只读命中行
Verify: run `node scripts/devflow-plan.js --index` expect exit 0
Not doing: 不新增能力详情文件、不改「一句话」列
Task: Sense 规则改为匹配后展开
Files:
- Modify: AGENTS.md | symbol: `## Start` | 第 4 步改为触发词匹配后只读命中行
- Modify: skills/devflow-core/SKILL.md | symbol: `## Context Map` | 同步匹配后展开
- Modify: skills/devflow-core/references/core-methods.md | symbol: `## Method 1: Context Map` | 第 2 步改为匹配后只读命中行
- Modify: commands/devflow.toml | symbol: `prompt` | 同步第一跳说明
Change: 四处改为「用任务关键词匹配索引行，只读命中行的入口或台账段」，增加索引超过 40 行时用 `--index --query 关键词` 过滤的说明，并明确不批量读能力文档
Acceptance: 四处均写明匹配后展开与查询阈值；索引缺失仍不阻塞
Verify: run `npm run trigger:verify` expect exit 0
Not doing: 不改路由表、A/B/C 语义与宿主适配器
Task: 增加 --index --query 查询模式
Files:
- Modify: scripts/devflow-plan.js | symbol: `runIndexCheck` | 支持 query 过滤输出
- Modify: scripts/devflow-plan.js | symbol: `checkIndexes` | 复用解析结果供查询
- Modify: scripts/devflow-plan.js | symbol: `usage` | 说明 `--query`
- Modify: scripts/devflow-plan.js | symbol: `selfTest` | 增加 query 正负例
Change: `--index` 增加可选 `--query` 关键词；命中行按索引类型输出功能行或计划行，无命中输出 none 且退出码 0；不带 `--query` 时输出与退出码保持不变
Acceptance: `--query` 命中时输出匹配行；无命中退出码 0；不带 `--query` 的 `--index` 行为不变
Verify: run `node scripts/devflow-plan.js --index --query 计划` expect 命中行且 exit 0
Not doing: 不改索引一致性校验规则与失败退出码
Task: Learn 维护触发词
Files:
- Modify: skills/devflow-learn/SKILL.md | symbol: `## Completion Review` | 行要求加触发词并同步边界表
Change: 功能条目行要求填写触发词，边界表说明索引只做路由不存正文
Acceptance: Learn 的行要求包含触发词
Verify: run `node -e "const s=require('fs').readFileSync('skills/devflow-learn/SKILL.md','utf8'); if(!s.includes('触发词')) process.exit(1)"` expect exit 0
Not doing: 不改学习卡格式与学习索引
Task: 断言同步与打包刷新
Files:
- Modify: scripts/validate-devflow.js | symbol: `assert` | 断言功能索引含触发词列
Change: 增加功能索引触发词断言；随后运行 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 刷新 DSH 资产并同步 Codex 镜像
Acceptance: `npm test` 通过且打包副本与源一致
Verify: run `npm test` expect 通过
Not doing: 不改安装器清单与 `verify:all` 项数
## Progress

| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | 功能索引加触发词列 | done | `node scripts/devflow-plan.js --index` PASS；表头含触发词，8 行非空 |
| 2 | Sense 规则改为匹配后展开 | done | `npm run trigger:verify` exit 0；AGENTS/core SKILL/core-methods/commands 四处同步 |
| 3 | 增加 --index --query 查询模式 | done | `--self-test` PASS；`--query 触发词` 命中 1 行；无命中 exit 0；按表头列名映射列位置，新增列不再移位 |
| 4 | Learn 维护触发词 | done | `node -e` 断言 exit 0；行要求与边界表含触发词 |
| 5 | 断言同步与打包刷新 | done | `npm test` PASS；Codex 镜像 verify-plugin 通过 |
