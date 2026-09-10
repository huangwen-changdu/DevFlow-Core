# External Platform Is A Publish Target, Not A Source

- Trigger: wiki, GitHub Wiki, 文档发布, 知识沉淀出口, 外部平台当文档源, 派生视图, 发布脚本, sync docs to wiki
- Lesson: 外部平台（GitHub Wiki 等）适合作"给人看的发布目标"，不适合作事实源：它不在仓库工作树里，技能在 Sense 阶段读不到；没有 PR 评审；机检（`--index` / `--loop`）也看不见它。一旦在平台上手写正文，就会和 repo 的索引与台账形成双事实源并必然漂移。正确姿势是 repo 为源、脚本单向派生、`--check` 报漂移。
- Next action: 下次要接外部文档平台时，先问三件事——技能读得到吗、有机检吗、会不会与 repo 双源；然后只做单向派生加漂移检查，不让任何技能读该平台。回写终态时，计划头、计划索引行、需求台账行三处必须同时更新，否则 `--index` 立刻报 `status mismatch`。
- Scope: project
- Related: scripts/devflow-wiki.js, docs/features/INDEX.md, docs/plans/INDEX.md, docs/requirements.md, package.json
- Evidence: 2026-09-10 接入 GitHub Wiki：生成 Home 与 Sidebar 共 6 页；模拟克隆写入后 `--check` PASS；手改一页后 `--check` exit 1 报 `wiki page out of date`；源文件缺失时 exit 2 并中止发布；终态回写漏掉计划索引行时 `--index` 立即报 `status mismatch for 2026-09-10-wiki-single-way-publish.md`。
- Invalidation: 若平台支持把文档纳入主仓工作树并纳入机检，本卡可退役。
