# Evidence Form Determines Falsifiability

- Trigger: 计划或规范要求写证据, 自述式证据, Prewalk, 证据可伪造, 形状校验, 只校验形式, evidence admission, fabricated evidence, checker validates form not truth, 侦查记录, 证据分级
- Lesson: 要求 AI 写下的每条证据，可验伪性由**形态**决定，不由措辞强度决定。四级阶梯：L1 可重跑命令加当时的输出（重跑即验伪）> L2 从既有产物机械复制（可机检子串或 diff）> L3 指向必须存在的路径或符号（只证明存在，不证明被使用）> L4 自由散文自述（无保护）。v1 计划的 Prewalk 三件套全是 L4，而 checker 只校验形状（行型种数、条数、上限 12 项）——**形状校验本身即伪造诱因**，因为填满结构比真读文件便宜，且填出来的内容与真读过的一模一样。反证：v2 保留下来的两处证据（`## Progress` 的证据列、`Landed`）恰好都是 L1。设计规则：只要求 L1 与 L2；L3 不得单独充当证据；L4 单独出现即等同没有证据。
- Next action: 下次给计划、规范或报告新增"证据字段"，先判定它落在哪一级；若只能给到 L3/L4，改设计（给一个能记录命令与输出的载体）而不是加字段。形态校验必须配至少一例反向用例——写一条无命令的散文证据须失败——否则校验退化成形状门。纯形式校验是刻意取舍时，用 `devflow: <ceiling>, revisit when <trigger>` 标出它的上限。
- Scope: project
- Related: skills/devflow-plan/SKILL.md, skills/devflow-plan/references/plan-methods.md, scripts/devflow-plan.js, scripts/validate-devflow.js, docs/specs/2026-09-16-plan-contract-evidence-density.md
- Evidence: 2026-09-16 计划契约重构；`node scripts/devflow-plan.js --self-test` 含 7 例反向用例（缺 Recon、散文侦查行、扇出缺通道、Not doing 无来源等）；`node scripts/validate-devflow.js` 新增 `liveContractSurfaces` 断言，落地时即抓到两处原清单外的同族残留；`npm run verify:all` 退出码 0；v1 对比数据为计划 277-396 行、checker 只校验形状。
- Invalidation: 若执行者获得对成品证据的独立核查能力（例如 checker 能零副作用地重跑命令并比对输出），L1 的形态校验可升级为内容校验，本卡的分级建议随之修订。
