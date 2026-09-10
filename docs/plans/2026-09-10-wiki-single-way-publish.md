# Wiki 单向发布（repo 为源，wiki 为派生视图）

Status: done
Goal: 用一条命令把 `docs/features/INDEX.md`、`docs/requirements.md`、`docs/plans/INDEX.md`、`docs/project-knowledge/AI-START-HERE.md` 发布成 GitHub Wiki 页面（Home + Sidebar + 四个页面），repo 始终是唯一事实源。
Not doing: 把 wiki 当事实源；任何技能读取 wiki；把网络动作放进 `verify:all`；新增依赖；把发布脚本打包进安装器与 sync-assets。
Cut: 做 生成器脚本 + `--check`/`--write`/`--push`/`--self-test` + npm 脚本 + README 说明 + 能力行 + 需求行 | 不做 wiki 当源、技能读 wiki、网络动作进验证矩阵、新依赖、打包分发 | 复用 `sync-assets.js` 的生成与一致性校验模式、`devflow-plan.js` 的参数与自测惯例、现有索引与台账作为唯一输入 | 验证 `--self-test`、`--check` 在无克隆时 exit 0、临时目录模拟写入比对、`npm run verify:all` 不受影响 | Rejected: wiki 当事实源（AI 读不到、无评审、无机检）；脚本进安装器（维护者专用）；引入 markdown 库（stdlib 足够）
Source: 用户请求（2026-09-10 会话，方案 A）+ 本 Cut Decision
Execution mode: sequential
Landed: 2026-09-10 · npm run wiki:check 无克隆 exit 0 + --self-test PASS + npm run verify:all 退出码 0

## Tasks

Task: 实现 wiki 单向发布脚本
Files:
- Create: scripts/devflow-wiki.js | new file | 读取四个源文件并生成 wiki 页面
Change: 增加页面映射与生成逻辑：`Home.md` 汇总功能索引并给快速入口，`_Sidebar.md` 提供导航，四个源文件各自生成一个页面并在顶部加生成提示与源路径；支持 `--check`（比对克隆内容，漂移非零退出，无克隆时提示并 exit 0）、`--write`、`--push`（显式提交并推送）、`--self-test`、`--json`
Acceptance: 页面映射覆盖 6 个文件；`--check` 无克隆时 exit 0 且打印初始化提示；写入结果顶部含生成提示与源路径
Verify: run `node scripts/devflow-wiki.js --self-test` expect exit 0
Not doing: 不改任何技能、不引入依赖、不写主仓 docs
Task: 接入 npm 脚本与 README 说明
Files:
- Modify: package.json | symbol: `scripts` | 增加 wiki:check 与 wiki:write
- Modify: README.md | symbol: `## Verification` | 说明单向发布与首次初始化
Change: 增加 `wiki:check`、`wiki:write` 两条 npm 脚本；README 说明 repo 是源、wiki 是派生视图、首次需在网页建页后克隆，并给出推送命令
Acceptance: `npm run wiki:check` 在无克隆时 exit 0；README 含初始化与推送说明
Verify: run `npm run wiki:check` expect exit 0
Not doing: 不改 `verify:all` 的项与顺序
Task: 登记能力行与需求行
Files:
- Modify: docs/features/INDEX.md | symbol: `## 索引` | 增加 Wiki 发布能力行
- Modify: docs/requirements.md | symbol: `## 台账` | 增加本次需求行并推进状态
Change: 增加一行能力条目（含触发词 wiki、发布、派生视图）与一行需求记录，状态按生命周期推进到 `landed`
Acceptance: 能力行含触发词与入口；需求行终态含证据
Verify: run `node scripts/devflow-plan.js --index` expect exit 0
Not doing: 不动已有索引行与历史需求行

## Progress

| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | 实现 wiki 单向发布脚本 | done | `--self-test` PASS；模拟克隆写入 6 页且 check PASS；手改一页后 drift exit 1 |
| 2 | 接入 npm 脚本与 README 说明 | done | `npm run wiki:check` 在无克隆时 exit 0 并打印初始化命令；README 含单向发布与首建说明 |
| 3 | 登记能力行与需求行 | done | `node scripts/devflow-plan.js --index` PASS；能力行含触发词与入口，需求行入台账 |
