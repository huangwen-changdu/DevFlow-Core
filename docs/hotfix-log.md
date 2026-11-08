# Hotfix 记录（Hotfix Log）

> 摘要: 用途=一行一次记录缺陷修复的改动点，让"这次到底动了什么"可被下一次会话检索 | 维护=每次缺陷修复由 devflow-learn 追加一行，是否已沉淀列是通向学习卡的钩子 | 机检=node scripts/validate-devflow.js、node scripts/devflow-docs.js --check | 更新日=2026-11-08

## 用途与边界

本表承接**单次缺陷修复**的改动点，补上"踩一次就修好"没有记录位、而学习卡又要求可复用证据的空缺。

| 记录 | 放哪 | 为什么不放一起 |
|---|---|---|
| 一行需求从确认到落地 | `requirements.md` | 需求语义，承载不了"改了哪几行、为什么" |
| 下次该怎么做（拦截规则） | `.copilot/cards/` | 要求可复用、有证据、有被否方案；单次修复通常没有 |
| 循环工程的失败卡 | `docs/loop/learned/` | loop-engineering 自有产物，只在其循环内产生 |
| **一次缺陷修复的改动点** | **本文件** | 低摩擦、可检索、能反向指出"这次值得单独建卡" |

## 使用规则

1. **写入时机**：`devflow-prove` 判 PASS 后，由 `devflow-learn` 的完成复盘追加；一次修复一行。
2. **必填**：日期、症状、根因、改动点、涉及模块、验证命令。「关联学习卡」无对应卡写 `-`，「是否已沉淀」写 `no`。
3. **沉淀判断**：同模式第二次出现，或改动本身就是可复用拦截规则时，建 `.copilot/cards/` 学习卡，并把卡文件名回填到「关联学习卡」、把「是否已沉淀」改为 `yes`。
4. **不改写历史行**：后续修复只在表尾追加；被推翻的结论追加新行并在「根因」里说明取代关系。

## 记录

| 日期 | 症状 | 根因 | 改动点 | 涉及模块 | 关联学习卡 | 验证命令 | 是否已沉淀 |
|---|---|---|---|---|---|---|---|
| 2026-10-27 | review 阶段不检索既往踩坑，同一镜像门禁坑可重复踩 | Prove 只在 Sense 召回，Adversarial Review 清单无召回项 | Adversarial Review 增加 Recall check；本表建立并接入 devflow-learn | `skills/devflow-prove/`、`skills/devflow-learn/`、`docs/hotfix-log.md` | `plugin-parity-before-skill-verify.md` | `npm run verify:all` | yes |
| 2026-11-05 | 写计划的说明与机检互相矛盾：Recon 被判"不是计划字段"、执行模式被写成"不改变 checker"、中文 Change/Verify 被英文白名单拒绝、`abandoned` 是模板值却非法、计划批准后无人更新 plans/INDEX | v2 契约两次重构后说明保留旧口径；checker 关键词白名单与状态值域没跟上"内容用用户语言"的承诺；索引维护规则写在本表却未分配给任何节点 | 修正 plan SKILL 第 3/8/9 步、Execution mode 段与检查清单；checker 增加中文动词/期望词/External Skills 词、`abandoned`、`--index` 项目根解析；prove 增加 plans/INDEX 回写；同步 command/README/副本并删除误提交的 `plan-check.json` | `skills/devflow-plan/`、`skills/devflow-prove/`、`scripts/devflow-plan.js`、`commands/devflow-plan.toml`、`README.md` | - | `npm run verify:all`；`node scripts/devflow-plan.js --self-test`；中文样例 PASS；`Status: abandoned` PASS；临时根未登记计划 FAIL | no |
| 2026-11-08 | 其他项目触发缺陷修复时，没有 `docs/hotfix-log.md`（部分项目也没有 `docs/requirements.md`），记录被当作"无文件可写"跳过 | 生成器只建地图/进度/架构/spec 索引，不建台账；AGENTS 第 7 阶段写成"台账存在才记"，learn 只要求追加、未给缺失时的创建动作 | `--init` 建图时补建两本台账骨架；AGENTS 改为"缺失即按表头创建、不得跳过"；learn 第 8 步与反合理化表明确缺失时先建表头再追加；校验器新增契约断言 | `scripts/devflow-docs.js`、`skills/devflow-learn/SKILL.md`、`AGENTS.md`、`scripts/validate-devflow.js`、`README.md`、`docs/INDEX.md` | - | `npm run verify:all` | no |
