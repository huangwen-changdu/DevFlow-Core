# Recall Needs Read Evidence

- Trigger: 踩坑召回, 同一坑重复踩, 踩坑记录复查, Recall evidence, read evidence, 读取证据, keyword-only rule, 只读召回, Prove 召回, 反向用例, marker 断言, validator only checks presence
- Lesson: 一条"必须读某文件"的规则若只靠字符串存在性断言守住，证明的是规则存在，不是规则真的执行过。Prove 的踩坑召回必须写进 Process 机械步骤，并要求逐文件 `Read` 行证据；反向用例删掉 marker 必须让门禁 exit 1，才是可机检的闭环。2026-10-27 已因"review 不检索既往踩坑"修过一次，但只加对抗审查清单项，召回仍没进机械 Proof 步骤。
- Rejected: 只在 Adversarial Review 写 `Recall check`、只用 `includes("Recall check")` 校验 —— 被否，因为校验只防规则被删、防不住未真实读取；同类问题在 2026-10-27 后仍可复发。
- Next action: Next time 给规则加"必须读某文件"约束时，first 把读取放进机械步骤并要求逐文件 `Read` 行，do not 停在清单项或只做关键词存在性校验；写反向用例时 do not 只变异源副本，否则镜像守卫先拦，需同步变异 source + 两个镜像副本。
- Scope: project
- Related: `skills/devflow-prove/SKILL.md`、`skills/devflow-prove/references/proof-recovery-methods.md`（Method 15）、`skills/devflow-prove/references/flow-self-test.md`（Scenario 3Z）、`scripts/validate-devflow.js`、`docs/hotfix-log.md`、`.copilot/cards/plugin-parity-before-skill-verify.md`
- Evidence: 2026-11-17 三项修复落地：`npm test` 正向 exit 0；三副本同步删除 `Recall evidence` marker 后 `npm test` exit 1 且报错正是标记断言，恢复后 exit 0；`node scripts/devflow-budget.js` 显示 prove SKILL.md 15316/15360 字节 PASS。首次反向测试只变异源副本，被 `assertMirrorTree` 先拦（exit 1 但原因错误），读到 `plugin-parity-before-skill-verify.md` 后改为三副本同步变异才验到目标断言。
- Evidence Level: L1
- Invalidation: 移除 Method 15、`Recall evidence` 契约或对应 marker 断言后本卡失效，需修订。
