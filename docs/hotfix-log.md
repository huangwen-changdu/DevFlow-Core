# Hotfix 记录（Hotfix Log）

> 摘要: 用途=一行一次记录缺陷修复的改动点，让"这次到底动了什么"可被下一次会话检索 | 维护=每次缺陷修复由 devflow-learn 追加一行，是否已沉淀列是通向学习卡的钩子 | 机检=node scripts/validate-devflow.js、node scripts/devflow-docs.js --check | 更新日=2026-11-17

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
| 2026-11-17 | 踩坑召回复查仍可能只停在对抗审查清单：Recall check 写"Before editing"与后置 Prove 错位，机检只查关键词存在，无法证明真的读了踩坑文件；2026-10-27 已因同类问题修过一次 | 召回未进 Process 机械步骤，缺少逐文件 `Read` 证据输出契约与反向用例；规则措辞沿用编辑前语境 | SKILL 第 2 步改为先读 LEARNING_INDEX 与 hotfix-log（Method 15），Recall check 改"At proof time"+`Recall evidence` 双 `Read` 行；新增 Scenario 3Z 反向场景与 4 条 marker 断言；修正措辞、压缩主体腾出预算并同步双镜像 | `skills/devflow-prove/`、`scripts/validate-devflow.js`、`plugins/devflow/`、`dsh/.../assets/`、`docs/hotfix-log.md` | `recall-needs-read-evidence.md` | `npm run verify:all`；反向用例：三副本删 `Recall evidence` → exit 1 命中 marker 断言，恢复 → exit 0 | yes |
| 2026-11-18 | 项目同步后技能发现不了：`install:target` 把技能复制到 `<项目>/skills/`，而宿主从 `<项目>/.agents/skills/` 发现；入口与适配器还写死 `skills/...` | 落位沿用源仓库布局，没有对齐宿主发现约定；复制目标、入口文本、manifest 与校验器没有当成同一契约 | `install:target` 映射 `skills/**` -> `.agents/skills/**`（源布局与插件/DSH 资产不变）；`AGENTS.md` 声明 skill root 并把 `skills/...` 解析到该根；CLAUDE/4 适配器/`.claude` 命令改为 skill root，全部 `commands/*.toml` 的 `skills/...` 改为 skill root 相对路径并带解析声明；manifest 记安装路径；`--check` 报 stale 不自动删；适配器校验改 skill root 断言；`install:verify` 增布局、无旧副本、stale 报错与 `--write` 不删旧目录断言 | `scripts/install-devflow.js`, `scripts/validate-installer.js`, `scripts/validate-host-adapters.js`, `AGENTS.md`, `CLAUDE.md`, `commands/*.toml`, `.github/`, `.codebuddy/`, `.claude/commands/devflow-core.md`, `README.md`, `docs/platform-setup.md`, `docs/PRD.md`, `docs/features/devflow-core.md` | `install-destination-matches-discovery.md` | `npm run install:verify` PASS；`npm run verify:all` 19 项 PASS；KocServer `--check` 只读报 36 stale 并 exit 1 | yes |
| 2026-11-25 | 小改动也要半天：流程固定成本与改动大小脱钩 | 路由按是否已批准而非爆炸半径分级；Prove 无分档；Cut、回执、台账、学习卡按次收费；规则只增不减 | AGENTS.md, skills/devflow-core/, skills/devflow-prove/, skills/devflow-learn/, scripts/devflow-docs.js, docs/rule-health.md | devflow-core, devflow-prove, devflow-learn, devflow-docs, rule-health | - | npm run verify:all | no |
| 2026-11-25 | Small-fix 的 gate/tier 由 AI 自评，可能偷偷走窄通道 | 没有脚本数实际 diff、拦保护面、跑验证；narrow 可由 agent 自己选 | scripts/devflow-smallfix.js, AGENTS.md, skills/devflow-core/SKILL.md, skills/devflow-prove/SKILL.md, commands/devflow.toml, commands/devflow-prove.toml, hooks/devflow-session-start.js, scripts/install-devflow.js, scripts/install-devflow-user.js | devflow-core, devflow-prove, smallfix-checker, installers, dsh-assets | - | npm run verify:all | no |
