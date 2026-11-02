# Hotfix 记录（Hotfix Log）

> 摘要: 用途=一行一次记录缺陷修复的改动点，让"这次到底动了什么"可被下一次会话检索 | 维护=每次缺陷修复由 devflow-learn 追加一行，是否已沉淀列是通向学习卡的钩子 | 机检=node scripts/validate-devflow.js、node scripts/devflow-docs.js --check | 更新日=2026-10-27

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
