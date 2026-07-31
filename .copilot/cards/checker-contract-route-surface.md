# Checker Contract And Route Surface Design

- Trigger: checker 脚本改动, --json 输出, Status 字段, budget 阈值, 路由一致性校验, 校验表面, devflow-plan/spec/review/debt/audit/budget/route 校验器
- Lesson: 运行时 checker 契约三原则——(1) 新能力用可选参数（--json），默认输出逐字节不变，target 项目拷贝不受影响；(2) 可选字段缺失视为 legacy 不报错，存在时值域受限（Status: draft|approved|in-progress|done），绝不可把可选字段加进 requiredFields；(3) 字节统计必须用 statSync().size（UTF-8 字节），字符数统计会低估中文内容——devflow-project-knowledge 字符数 9,996 实为 14,715 字节，曾导致 14 KiB 阈值误判。路由一致性按表面角色分权：core SKILL.md 的 Core Flow Map 是权威边源（全量检查），AGENTS.md 与 skill-call-diagram.md 全量检查，README 是用户文档只用描述性语言（仅轻量检查成功边+CUT_PASS+scope drift），core-methods.md 不含边文本不列入检查清单。
- Next action: 下次修改 checker 或校验表面时，先保持默认输出不变并让可选字段向后兼容（缺失=legacy）；预算阈值以 UTF-8 字节数为准；新增路由表面时先 grep 确认该文件实际承载的边文本与变体（反引号/连字符/缩写）再定检查集，不要凭印象决定。
- Scope: project
- Related: scripts/devflow-plan.js, scripts/devflow-spec.js, scripts/devflow-review.js, scripts/devflow-debt.js, scripts/devflow-audit.js, scripts/devflow-budget.js, scripts/validate-route-consistency.js, scripts/install-devflow.js
- Evidence: 2026-07-31 迭代批次 npm run verify:all 四次全绿；五个 checker --self-test 通过；installer --write/--check/版本差/legacy 四场景实测通过；route:verify 四表面 ok（执行中校准了 core-methods.md 与 README 的检查角色）
- Invalidation: 若 checker 默认输出被重新定义为机器可解析契约、或 README/core-methods.md 改版承载全部路由边 token、或字节统计口径切换，需修订或退役本卡
