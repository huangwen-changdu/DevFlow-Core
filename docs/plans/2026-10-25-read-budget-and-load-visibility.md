# 代理读取预算与加载可见性

Status: done
Goal: 让 Sense 阶段的读取有可核对的预算与可见的计划，使"读太多"与"读太少"都成为显式声明而非默认行为
Not doing: 两段式 Sense（拆分路由前/路由后读取）；修改 AGENTS.md 的七阶段描述；token 级预算估算工具；新增 skill、命令、依赖、抽象、目录或 references 文件；改动现有 6 条读取顺序本身
Cut: 做 core-methods Method 1 的按路由读取预算、计数规则、越界停止报告与读取计划行，devflow-core Context Map 的读取计划要求，validate-devflow 的两条契约断言 | 不做 两段式 Sense、AGENTS.md 改动、token 级预算估算工具、新增 skill/命令/依赖/抽象/目录或 references 文件、改动现有 6 条读取顺序本身 | 复用 现有 Method 1 读取顺序、现有精确短语断言机制、现有执行回执契约 | 验证 npm run verify:all 与人工读取计划观察 | Rejected: 两段式 Sense（用户已排除；需替换 AGENTS.md 七阶段，仅余 76 字节，风险等级不同）；新建 references/context-budget.md（Method 1 已是读取契约的 owner，新建会造出双源）；token 估算脚本（需新脚本与估算逻辑，而文件数已足够断言）；在 devflow-prove 加读取审计（读取发生在 Sense，Prove 无权回顾，且制造跨节点耦合）；把预算写进 AGENTS.md（76 字节余量不足，且违背后者只放执行规则、方法深度留 skills 的分层）
External Skills: none
Execution mode: sequential
Landed: 2026-10-25 — `npm run verify:all` 退出码 0（19 项全 PASS）；`npm test` 18 runtime 文件；SKILL 三处 md5 05bc9bc9、core-methods 三处 md5 16c97d1e；反向用例 BROKEN 1 且报 `read-budget contract: Read plan:`

## Recon

- `wc -c skills/devflow-core/references/core-methods.md skills/devflow-core/SKILL.md` → 12756 / 10672（SKILL 距 15360 上限余 4688 字节）
- `grep -n "## Method 1: Context Map" skills/devflow-core/references/core-methods.md` → 33:## Method 1: Context Map
- `grep -n "Read the narrowest relevant project facts" skills/devflow-core/SKILL.md` → 38:Read the narrowest relevant project facts, then match the task keywords against ...
- `grep -n "assertCapabilityContract(coreMethods" scripts/validate-devflow.js` → 184:assertCapabilityContract(coreMethods, [
- `npm test` → DevFlow validation passed; Checked 18 runtime files, 30 learning cards, and selected host and trigger contracts

## Tasks

Task: Method 1 声明按路由的读取预算与越界停止规则
Files:
- Modify: skills/devflow-core/references/core-methods.md | `## Method 1: Context Map` | 新增读取计划行、按路由预算表、计数规则与越界停止报告
Change: 在 `## Method 1: Context Map` 标题与现有 `Read the narrowest useful facts:` 之间插入三块内容，现有编号清单保持不动：(1) 一行必填输出，以 `Read plan:` 开头，后接路由状态（首读时写 `route pending`）、本次预算文件数、正在读的每个文件及其理由、跳过的每个文件及其理由；(2) 预算表，表头含 `Reads before Change`，行取 Fast 0、Design-lite 3、Design 8、Build 8、Recovery 5，每行带放宽条件（Fast 为答案跨一个以上文件，Design-lite 为触及流程跨模块边界，Design 为涉及契约或调用图，Build 为已批准计划点名的锚点更多，Recovery 为失败跨一个以上模块）；(3) 计数规则（每个文件计 1、重读同一文件不重复计、工具输出不计）与越界报告，以 `Read budget:` 开头，写明已用数量、上限、已确认事实与缺失事实，要求停止并询问而非静默续读。首读发生在路由之前，故首行固定 `route pending` 与上限 3。
Acceptance: Method 1 段内同时出现 `Read plan:`、`Read budget:`、`Reads before Change`、`route pending` 四个契约 token。
Verify: `node -e "const s=require('fs').readFileSync('skills/devflow-core/references/core-methods.md','utf8');for(const t of ['Read plan:','Read budget:','Reads before Change','route pending'])if(!s.includes(t))throw new Error('missing '+t);console.log('PASS')"` → 输出 PASS
Not doing: 不改现有读取顺序条目；不引入 token 估算；不新建文件。

Task: Context Map 要求先输出读取计划再读
Files:
- Modify: skills/devflow-core/SKILL.md | `## Context Map` | 在 `Read the narrowest relevant project facts` 之前加读取计划要求
Change: 在 `Read the narrowest relevant project facts` 所在句之前插入一句要求：读取前先输出一行 `Read plan:`，包含路由状态、本次预算、读什么及理由、跳过什么及理由，并按 `skills/devflow-core/references/core-methods.md` 的 Method 1 预算与越界规则执行。原句与其中 `Do not bulk-read capability documents` 保持不变。
Acceptance: 该文件同时包含 `Read plan:` 与原句 `Read the narrowest relevant project facts`。
Verify: `node -e "const s=require('fs').readFileSync('skills/devflow-core/SKILL.md','utf8');for(const t of ['Read plan:','Read the narrowest relevant project facts'])if(!s.includes(t))throw new Error('missing '+t);console.log('PASS')"` → 输出 PASS
Not doing: 不复制预算表进 SKILL，单一源留在 core-methods；不改 Context Map 其余内容。

Task: 断言守住读取计划与预算契约
Files:
- Modify: scripts/validate-devflow.js | `assertCapabilityContract` | 在其调用点之后添加读取预算断言
Change: 添加函数 `assertReadBudgetContract(coreMethods, coreSkill)`：检查 coreMethods 是否含 `Read plan:`、`Read budget:`、`Reads before Change`、`route pending`，检查 coreSkill 是否含 `Read plan:`，缺失时以消息说明缺哪条契约并抛出。在 `assertCapabilityContract(coreMethods, [...])` 调用之后追加 `assertReadBudgetContract(coreMethods, read("skills/devflow-core/SKILL.md"));`。
Acceptance: 移除 `core-methods.md` 中的 `Read plan:` 文本后 `npm test` 以非零退出。
Verify: `npm test` → expected DevFlow validation passed with exit 0；把 `core-methods.md` 的 `Read plan:` 临时改为 `Read planX:` 后重跑 `npm test` → expected exit 1 with a missing-contract message；恢复原文后再跑 `npm test` → expected exit 0
Not doing: 不改动任何现有断言；不新增校验脚本。

Task: 同步镜像并跑全量验证
Files:
- Modify: plugins/devflow/skills/devflow-core/SKILL.md | `# DevFlow Core` | 与源逐字节一致
- Modify: plugins/devflow/skills/devflow-core/references/core-methods.md | `# DevFlow Core Methods` | 与源逐字节一致
- Modify: dsh/plugins/dsh-devflow/assets/skills/devflow-core/SKILL.md | `# DevFlow Core` | 与源逐字节一致
- Modify: dsh/plugins/dsh-devflow/assets/skills/devflow-core/references/core-methods.md | `# DevFlow Core Methods` | 与源逐字节一致
Change: 用 `cp` 把两个源文件替换到 `plugins/devflow/skills/devflow-core/` 对应路径，再运行 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 刷新 DSH 资产；不手工编辑镜像内容。
Acceptance: 两个源文件与其 Codex 副本、DSH 副本的 md5 两两相同。
Verify: `md5 -q skills/devflow-core/SKILL.md plugins/devflow/skills/devflow-core/SKILL.md dsh/plugins/dsh-devflow/assets/skills/devflow-core/SKILL.md skills/devflow-core/references/core-methods.md plugins/devflow/skills/devflow-core/references/core-methods.md dsh/plugins/dsh-devflow/assets/skills/devflow-core/references/core-methods.md` → 每三个一组哈希相同；`npm run verify:all` → 全部 PASS 且退出码 0
Not doing: 不改镜像内容；不动其他技能；不 bump 版本号。

## Progress

| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | Method 1 声明按路由的读取预算与越界停止规则 | done | `node -e` 四项 token 检查 → PASS；core-methods.md 新增预算表、计数规则、越界报告 |
| 2 | Context Map 要求先输出读取计划再读 | done | `node -e` 双 token 检查 → PASS；SKILL.md 10945/15360 字节 |
| 3 | 断言守住读取计划与预算契约 | done | `npm test` → POSITIVE 0；移除 `Read plan:` 后 BROKEN 1 且报 `read-budget contract: Read plan:`；恢复后 RESTORED 0 |
| 4 | 同步镜像并跑全量验证 | done | SKILL md5 05bc9bc9 / core-methods md5 16c97d1e 三处一致；`npm run verify:all` 退出码 0 |
