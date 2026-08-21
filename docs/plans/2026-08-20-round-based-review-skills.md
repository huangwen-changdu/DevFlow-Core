# 分轮执行的独立审查技能改造

Goal: 让 devflow-adversarial 与 devflow-find-fault 在 DSH 上以分轮方式执行：子代理每轮只完成一个审查单元并回报，主代理逐轮汇总进度，全部轮次后输出完整报告，使审查在子代理单次约 10 分钟限制下仍可完成；同时落地 SKILL.md 改进项 1 至 6 与 README 用户文档。
Architecture: 纯声明式文本改造。两份 SKILL.md 写入分轮执行协议；两个命令 TOML 跨面同步一句话；flow-self-test 与 capability 清单各补一条分轮证据；现有 validate-skill-triggers.js 新增打包资产一致性断言；打包副本用既有 sync-assets.js 重新生成。无新依赖、无新目录、无新脚本文件。
Tech Stack: Markdown 技能契约、TOML 命令、Node.js 校验脚本（全部为现有机制）。
Source: 2026-08-20 会话确认请求（B 分支，无存档 Spec）+ 本计划随附 Cut Decision。
Spec coverage: 分轮执行模型覆盖 Task 1 至 4；改进项 1 选型说明覆盖 Task 1、2、7；改进项 2 中文触发词覆盖 Task 1；改进项 3 多条发现模板覆盖 Task 1、2；改进项 4 子代理上下文交接并入 Task 1、2 的分轮协议；改进项 5 防漂移覆盖 Task 5、6；改进项 6 不安感触发边界覆盖 Task 2；改进项 7 覆盖 Task 7。
External Skills: writing-skills; role: bounded specialist work — 校验技能编辑约定（frontmatter 触发词、结构、验证边界）; expected evidence: Task 1、2 的编辑遵循技能约定与 trigger-surface 学习卡; return facts: result / not-applicable / failure
Cut Decision: CUT_PASS。允许范围＝上述七项文件改动；复用 dsh/plugins/dsh-devflow/scripts/sync-assets.js 刷新打包副本，不新增同步机制；排除＝五个角度与三个必答题内容、独立审查不进 lifecycle 的边界、DSH harness 配置、其它技能与 host adapters；验证＝trigger:verify、capability:verify、capability:eval 两条目证据、打包资产一致性断言。
Execution mode: sequential
Post-completion: ① .claude 恢复后 npm run verify:all 全绿（capability:eval Judgment: PASS，Harness/Validation 11/11，Eval/Verifier 9/9，Orchestration/Slices 5/5），计划中记录的宿主环境缺口已闭合。② 实测发现流程式描述不会触发子代理，已把 DSH 段改为命令式（call the subagent tool / send_message），并新增「Must dispatch a fresh subagent.」契约证据行，全部校验仍 PASS。

## Global Constraints
- 保留 validate-skill-triggers.js 既有断言串：两份 SKILL.md 的 do not read, require, or alter `devflow-prove`；find-fault 的 不安感检查 与 Unease Risk Classification；commands/devflow-find-fault.toml 的 post-implementation unease check。
- 不修改五个角度、三个必答题、Unease Risk Classification 表与 Required Output 的结构字段。
- 不新增依赖、抽象、配置面、目录、框架层或脚本文件；不修改 DSH harness 配置。
- 已知环境缺口：本机无 .claude 目录（gitignore 的本地文件），npm test、host:verify、install:verify 与 capability:eval 基线即失败（ENOENT .claude/commands/devflow-core.md 与 .claude/settings.json）；本次不动 host adapters，验收以 trigger:verify、capability:verify 及 capability:eval 中两条独立审查条目为准。

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| `skills/devflow-adversarial/SKILL.md` / DSH 段 | Modify | 对抗审查分轮执行与触发词 | 技能自身定义执行方式 | 不改五个角度内容 |
| `skills/devflow-find-fault/SKILL.md` / DSH 段与 Unease 段 | Modify | 找茬分轮执行与不安感边界 | 技能自身定义执行方式 | 不改必答题与分级表 |
| `commands/devflow-adversarial.toml` | Modify | 命令面同步分轮说明 | 跨面契约同步先例 | 不承载审查细节 |
| `commands/devflow-find-fault.toml` | Modify | 命令面同步分轮说明 | 跨面契约同步先例 | 不承载审查细节 |
| `skills/devflow-prove/references/flow-self-test.md` / 场景 1F 1G | Modify | 自测补分轮断言 | 能力契约验证载体 | 不改其它场景 |
| `scripts/capability-eval-scenarios.json` / 两条独立审查条目 | Modify | 能力清单补分轮证据行 | 契约与自测同步 | 不新增场景 |
| `scripts/validate-skill-triggers.js` / `assertScenario` | Modify | 新增打包资产一致性断言 | 技能面校验器延伸 | 不校验触发词语义 |
| `dsh/plugins/dsh-devflow/assets/skills/devflow-adversarial/SKILL.md` 与 find-fault 及 commands 两个 TOML | Modify | 打包副本刷新 | 由 sync-assets.js 生成 | 不手改资产 |
| `README.md` / Reference Map 前新节 | Modify | 用户可读用法说明 | 用户入口文档 | 不改其它章节 |

Task: 对抗审查技能写入分轮执行模型
Task type: Documentation-only
Files:
- Modify: skills/devflow-adversarial/SKILL.md | frontmatter 的 description | 补充中文触发词
- Modify: skills/devflow-adversarial/SKILL.md | 标题行之后 | 增加选型对照行
- Modify: skills/devflow-adversarial/SKILL.md | On DeepSeek Harness 段 | 分轮执行协议
- Modify: skills/devflow-adversarial/SKILL.md | Findings 输出块之后 | 多条发现与排序说明
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Replace the frontmatter description of `skills/devflow-adversarial/SKILL.md` using exact replacement: new description equals `Use when a user explicitly asks for an independent deep adversarial review, upgraded adversarial review, red-team review, 对抗审查, 升级版对抗审查, 红队审查, 五角度挑战, or a five-angle challenge of current work. It can run at any task stage and does not read, require, modify, or hand off to devflow-prove, PUA, Build, Learn, or any completion state.`
- [ ] Insert one line directly under the `# DevFlow Adversarial Review` heading using exact replacement: `Use this skill when the user asks to challenge whether the current result holds. When the user asks what is missing or uncertain instead, use devflow-find-fault.`
- [ ] Replace the whole On DeepSeek Harness paragraph of `skills/devflow-adversarial/SKILL.md` using exact replacement with the bounded-round protocol in the fenced block below:
```
On DeepSeek Harness (DSH), run this review as a fresh `subagent` with no conversation seed so the challenge is genuinely independent of the main agent's reasoning. DSH subagent turns are time-bounded, so the review runs in bounded rounds instead of one silent pass:

1. The main agent starts one fresh subagent and sends it the review target and material paths explicitly; the subagent has no conversation seed and cannot see the main conversation.
2. Each round covers exactly one review unit. The subagent inspects only that unit and returns that unit's findings to the main agent. The subagent returns findings only and never declares lifecycle status, edits files, or invokes another skill.
3. After every round the main agent aggregates the unit's findings, reports progress, and sends the next unit through the same subagent conversation.
4. After the final unit the main agent assembles the complete `Required Output` below from the aggregated findings.
5. If a round returns nothing usable (timeout, truncation, or failure), record it under `Context limitations`, retry that unit once with a narrower instruction, and continue with the remaining units; never silently drop a unit.

Review units: one of the five angles per round, five rounds in total.
```
- [ ] Insert one line after the three Findings bullets in the Required Output block using exact replacement: `Repeat one bullet per finding; order findings by severity, then confidence; write none when a level has no finding.`
- [ ] Run `npm run trigger:verify` and expect `Judgment: PASS`
Acceptance: description 含 红队审查 与 五角度挑战；DSH 段描述分轮协议与逐轮汇总；Findings 允许每条发现一行并按严重度加置信度排序；trigger:verify PASS。
Verify: Run `npm run trigger:verify`; expect Judgment: PASS
Comments: 按 .copilot/cards/skill-description-trigger-surface.md 约定，description 只写触发短语；分轮协议同时覆盖改进项 4（主代理向子代理显式传递目标与材料路径）。
Not doing: 不改五个角度、Required Output 结构字段、其它技能与 lifecycle 边界。

Task: 找茬技能写入分轮执行模型与不安感边界
Task type: Documentation-only
Files:
- Modify: skills/devflow-find-fault/SKILL.md | 标题行之后 | 增加选型对照行
- Modify: skills/devflow-find-fault/SKILL.md | On DeepSeek Harness 段 | 分轮执行协议
- Modify: skills/devflow-find-fault/SKILL.md | Post-Implementation Unease Check 开头段 | 补触发边界句
- Modify: skills/devflow-find-fault/SKILL.md | Findings 输出块之后 | 多条发现与排序说明
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Insert one line directly under the `# DevFlow Find Fault` heading using exact replacement: `Use this skill when the user asks what is missing, unrecognized, or uncertain. When the user asks a five-angle challenge of whether the result holds instead, use devflow-adversarial.`
- [ ] Replace the whole On DeepSeek Harness paragraph of `skills/devflow-find-fault/SKILL.md` using exact replacement with the bounded-round protocol in the fenced block below:
```
On DeepSeek Harness (DSH), run this review as a fresh `subagent` with no conversation seed so the challenge is genuinely independent of the main agent's reasoning. DSH subagent turns are time-bounded, so the review runs in bounded rounds instead of one silent pass:

1. The main agent starts one fresh subagent and sends it the review target and material paths explicitly; the subagent has no conversation seed and cannot see the main conversation.
2. Each round covers exactly one review unit. The subagent inspects only that unit and returns that unit's findings to the main agent. The subagent returns findings only and never declares lifecycle status, edits files, or invokes another skill.
3. After every round the main agent aggregates the unit's findings, reports progress, and sends the next unit through the same subagent conversation.
4. After the final unit the main agent assembles the complete `Required Output` below from the aggregated findings.
5. If a round returns nothing usable (timeout, truncation, or failure), record it under `Context limitations`, retry that unit once with a narrower instruction, and continue with the remaining units; never silently drop a unit.

Review units: one question per round — the three default questions and every user-supplied question — plus one final round for the unease check when the target contains implementation material.
```
- [ ] Insert one sentence after the line ending in `not code quality or test coverage.` in the Post-Implementation Unease Check section using exact replacement: `When the target contains no implementation material (no diff, no new code, no completion-ready result), skip the unease check and report Unease check: not applicable with the reason; do not invent business decisions from requirements text alone.`
- [ ] Insert one line after the three Findings bullets in the Required Output block using exact replacement: `Repeat one bullet per finding; order findings by severity, then confidence; write none when a level has no finding.`
- [ ] Run `npm run trigger:verify` and expect `Judgment: PASS`
Acceptance: 选型行、分轮协议（单位＝一个必答问题、用户追加问题或不安感检查块）、不安感触发边界句、Findings 排序说明全部就位；trigger:verify PASS。
Verify: Run `npm run trigger:verify`; expect Judgment: PASS
Comments: 保留 不安感检查 与 Unease Risk Classification 原样（validate-skill-triggers.js 断言）；description 已含足够中文触发词，本次不改。
Not doing: 不改三个必答题、Unease Risk Classification 表、Required Output 结构字段。

Task: 命令 TOML 跨面同步分轮执行句
Task type: Documentation-only
Files:
- Modify: commands/devflow-adversarial.toml | prompt 文本 | 补分轮执行句
- Modify: commands/devflow-find-fault.toml | prompt 文本 | 补分轮执行句
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Insert one line into `commands/devflow-adversarial.toml` using exact replacement before the line starting `Do not edit files, invoke another skill`: `On DeepSeek Harness (DSH), run the review in bounded rounds, one round per review angle; the subagent returns each round's findings and the main agent aggregates them into the final report.`
- [ ] Insert one line into `commands/devflow-find-fault.toml` using exact replacement before the line starting `Do not edit files, invoke another skill`: `On DeepSeek Harness (DSH), run the review in bounded rounds, one round per question and one round for the post-implementation unease check; the subagent returns each round's findings and the main agent aggregates them into the final report.`
- [ ] Run `npm run trigger:verify` and expect `Judgment: PASS`
Acceptance: 两个 TOML 各含一句分轮执行说明，commands/devflow-find-fault.toml 的 post-implementation unease check 断言串保持原样；trigger:verify PASS。
Verify: Run `npm run trigger:verify`; expect Judgment: PASS
Comments: 遵循 v34 跨面契约同步先例：命令面与技能面表述一致但不重复细节。
Not doing: 不改两个 TOML 的 description 与其它段落。

Task: 能力契约补分轮证据行
Task type: Code change
Files:
- Modify: skills/devflow-prove/references/flow-self-test.md | `Scenario 1F: Independent Manual Adversarial Review` | 补分轮 bullet
- Modify: skills/devflow-prove/references/flow-self-test.md | `Scenario 1G: Independent Manual Find-Fault Review` | 补分轮 bullet
- Modify: scripts/capability-eval-scenarios.json | `independent-manual-adversarial-review` | 补 scenarioEvidence 行
- Modify: scripts/capability-eval-scenarios.json | `independent-manual-find-fault-review` | 补 scenarioEvidence 行
Interfaces:
- Consumes: scripts/capability-eval.js / validateEntry 以 scenarioBody.includes(evidence) 消费 scenarioEvidence
- Produces: self-test 正文与清单中逐字一致的两条证据串
Current behavior: 场景 1F/1G 的 Expected behavior 与清单 scenarioEvidence 均无分轮执行语句；capability:verify 基线 PASS。
Target behavior: 1F/1G 各含一条分轮证据（与清单逐字一致）；capability:verify 与 capability:eval 对两条目无缺失证据。
Change mechanics: exact replacement: 在 flow-self-test.md 场景 1F 的 five fixed dimensions bullet 之后插入 `- Must run on DSH in bounded rounds, one round per review angle, with the subagent returning each round's findings to the main agent for aggregation.`；场景 1G 的 unease bullet 之后插入 `- Must run on DSH in bounded rounds, one round per question or unease-check block, with the subagent returning each round's findings to the main agent for aggregation.`；在 capability-eval-scenarios.json 两个条目的 scenarioEvidence 数组末尾各追加同串。
Call impact: npm run capability:verify 与 npm run capability:eval 都会校验新证据串；无运行时代码路径依赖数组长度。
Steps:
- [ ] Insert the 1F bullet into `skills/devflow-prove/references/flow-self-test.md` using exact replacement: after the `Must cover all five fixed dimensions` bullet add `- Must run on DSH in bounded rounds, one round per review angle, with the subagent returning each round's findings to the main agent for aggregation.`
- [ ] Insert the 1G bullet into `skills/devflow-prove/references/flow-self-test.md` using exact replacement: after the unease-check bullet add `- Must run on DSH in bounded rounds, one round per question or unease-check block, with the subagent returning each round's findings to the main agent for aggregation.`
- [ ] Append the evidence string to the scenarioEvidence arrays of both independent-review entries in `scripts/capability-eval-scenarios.json` using exact replacement: add the matching sentence to each array
- [ ] Run `npm run capability:verify` and expect `DevFlow capability evaluation self-test passed`
- [ ] Run `npm run capability:eval` and expect the two independent-review entries with Gaps none, only the three pre-existing host-related gaps remain
Acceptance: 两个场景正文与清单逐字一致；capability:verify PASS；capability:eval 对两条目无缺失证据。
Verify: Run `npm run capability:verify`; expect DevFlow capability evaluation self-test passed
Comments: 证据串必须与 self-test 正文完全一致（validateEntry 用 includes 匹配）；不改场景结构。
Not doing: 不新增场景、不改 commandEvidence、不修 host 相关基线缺口。

Prewalk:

Execution Trace:
- Read: `skills/devflow-prove/references/flow-self-test.md` / 场景 1F 与 1G → Expected behavior 列表无分轮执行语句。
- Read: `scripts/capability-eval-scenarios.json` / 两个独立审查条目 → scenarioEvidence 数组无分轮证据行。
- Traced: `scripts/capability-eval.js` / `validateEntry` → scenarioEvidence 逐条经 scenarioBody.includes 校验。
- Ran: `npm run capability:verify` → 基线 PASS。
- Edited: none yet → 契约与自测尚未修改。
- Verified: none yet → 尚未验证新证据行。
- Edited: `skills/devflow-prove/references/flow-self-test.md` 与 `scripts/capability-eval-scenarios.json` → 1F/1G 各加一条分轮 bullet，两条目 scenarioEvidence 各追加同行。
- Verified: `npm run capability:verify` → self-test passed；`npm run capability:eval` → 两条独立审查条目 PASS、Gaps none，仅基线三条 host 缺口仍在。

Current Handoff Facts:
- Target anchors: `skills/devflow-prove/references/flow-self-test.md` 的 `Scenario 1F: Independent Manual Adversarial Review` 与 `Scenario 1G: Independent Manual Find-Fault Review` 标题块；`scripts/capability-eval-scenarios.json` 的 `independent-manual-adversarial-review` 与 `independent-manual-find-fault-review` 条目。
- Nearby convention: v51 先例 — 行为改动同步 command、self-test 与 capability-evaluation 契约。
- Direct path: `scripts/capability-eval.js` / `validateEntry` 以 scenarioBody.includes(evidence) 校验 scenarioEvidence。
- Current constraints: 两条证据串必须与 self-test 正文逐字一致，且不得含未解析占位符。
- Planned touch set: flow-self-test.md 场景 1F/1G 各加一条 bullet；scenarios JSON 两条目 scenarioEvidence 各追加一行；其余文件不动。
- Risks / stop conditions: 若 capability:verify 或 capability:eval 出现新缺口，返回事实到 Core。
- Read-basis: `skills/devflow-prove/references/flow-self-test.md`；`scripts/capability-eval-scenarios.json`；`scripts/capability-eval.js`。
- Live anchors: `flow-self-test.md` 场景 1F/1G 的 Expected behavior 列表；`capability-eval-scenarios.json` 两条目的 scenarioEvidence 数组。

Remaining Structured Worklist:
- [x] Add round-based bullet to `skills/devflow-prove/references/flow-self-test.md` in Scenario 1F and Scenario 1G using exact replacement: insert the two evidence sentences verbatim at the planned positions.
  Anchors: `Scenario 1F: Independent Manual Adversarial Review`、`Scenario 1G: Independent Manual Find-Fault Review`.
  Verify: Run `npm run capability:verify`; expect self-test passed.
  Done when: both scenario bodies contain their evidence sentence verbatim.
- [x] Add scenarioEvidence line to `scripts/capability-eval-scenarios.json` for both independent-review entries using exact replacement: append the same sentences to each array.
  Anchors: `independent-manual-adversarial-review`、`independent-manual-find-fault-review`.
  Verify: Run `npm run capability:verify` and `npm run capability:eval`; expect both entries with no missing evidence.
  Done when: capability:eval lists both entries with Gaps none.

Task: 打包资产一致性断言
Task type: Code change
Files:
- Modify: scripts/validate-skill-triggers.js | `assertScenario` | 新增 filesUnder 与 assertPackagedAssetParity
Interfaces:
- Consumes: 现有 read(rel: string) 与 assert(condition, message) 助手
- Produces: assertPackagedAssetParity(): void，失败时抛出含 sync-assets 命令的错误；报告追加 Packaged asset parity: PASS
Current behavior: validate-skill-triggers.js 只校验触发场景与命令归属；无打包资产一致性检查；trigger:verify 基线 PASS。
Target behavior: 场景与命令校验之后断言每个 devflow-* 技能文件与 devflow*.toml 命令同 dsh/plugins/dsh-devflow/assets 下副本字节一致；漂移时报出重跑 sync-assets.js 的命令。
Change mechanics: exact replacement: 在 assertScenario 函数之后新增 filesUnder 与 assertPackagedAssetParity 两个函数，并在最终报告输出之前调用；完整代码：
```
/** Recursively returns absolute file paths under dir. */
function filesUnder(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...filesUnder(full));
    else out.push(full);
  }
  return out;
}

/** Fails loudly when a packaged dsh skill or command asset drifts from its repo-root source. */
function assertPackagedAssetParity() {
  const assetRoot = path.join(root, "dsh", "plugins", "dsh-devflow", "assets");
  const skillDirs = fs.readdirSync(path.join(root, "skills")).filter((name) => name.startsWith("devflow-"));
  for (const dir of skillDirs) {
    const srcDir = path.join(root, "skills", dir);
    for (const full of filesUnder(srcDir)) {
      const rel = path.relative(srcDir, full);
      const dst = path.join(assetRoot, "skills", dir, rel);
      assert(fs.existsSync(dst) && fs.readFileSync(dst, "utf8").equals(fs.readFileSync(full, "utf8")),
        `dsh packaged asset drifted from source: skills/${dir}/${rel} — re-run node dsh/plugins/dsh-devflow/scripts/sync-assets.js`);
    }
  }
  for (const name of fs.readdirSync(path.join(root, "commands")).filter((n) => n.startsWith("devflow") && n.endsWith(".toml"))) {
    const src = path.join(root, "commands", name);
    const dst = path.join(assetRoot, "commands", name);
    assert(fs.existsSync(dst) && fs.readFileSync(dst, "utf8").equals(fs.readFileSync(src, "utf8")),
      `dsh packaged asset drifted from source: commands/${name} — re-run node dsh/plugins/dsh-devflow/scripts/sync-assets.js`);
  }
}
```
Call impact: npm run trigger:verify 与 npm test 的验证面扩大；不影响其它调用方。
Steps:
- [x] Add functions filesUnder and assertPackagedAssetParity to `scripts/validate-skill-triggers.js` using exact replacement: insert both after the assertScenario function and call assertPackagedAssetParity(); before the `Skill Trigger Verification Report` console.log, then add a `Packaged asset parity: PASS` report line after the scenario loop
- [ ] Run `npm run trigger:verify` and expect `Packaged asset parity: PASS` and `Judgment: PASS`
- [ ] Negative drift proof: append one marker line to `dsh/plugins/dsh-devflow/assets/skills/devflow-adversarial/SKILL.md`, run `npm run trigger:verify` and expect failure naming sync-assets.js, then restore the file and expect PASS
Acceptance: 基线一致时输出 Packaged asset parity: PASS 且 Judgment: PASS；人为漂移被断言捕获，错误信息给出修复命令。
Verify: Run `npm run trigger:verify`; expect Packaged asset parity: PASS and Judgment: PASS
Comments: 断言覆盖 devflow-* 技能目录全部文件与 devflow*.toml 命令；复用 read 与 assert，不引入新文件。
Not doing: 不改 sync-assets.js 本体、不为 references/scripts 组新增独立断言文件。

Prewalk:

Execution Trace:
- Read: `scripts/validate-skill-triggers.js` / `assertScenario` → 证据循环是技能面的唯一扩展点，报告在文件末尾打印。
- Read: `dsh/plugins/dsh-devflow/scripts/sync-assets.js` → groups 从仓库根复制 skills 与 commands 到 assets。
- Traced: `package.json` / `trigger:verify` → 独立运行 validate-skill-triggers.js，不依赖 .claude。
- Ran: `npm run trigger:verify` → 基线 PASS。
- Ran: `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` → synced 14 skills 与 11 commands，git status 干净。
- Edited: none yet → 断言函数尚未写入。
- Verified: none yet → 尚未验证漂移检测。
- Edited: `scripts/validate-skill-triggers.js` → 新增 filesUnder 与 assertPackagedAssetParity，报告追加 Packaged asset parity: PASS。
- Edited: `scripts/validate-skill-triggers.js` / `assertPackagedAssetParity` → 初版代码把 utf8 字符串当 Buffer 调用 equals 报 TypeError，改用无编码 readFileSync 的 Buffer.equals（机制不变：字节比较）。
- Verified: 资产未同步时 `npm run trigger:verify` → 失败并提示 sync-assets.js（自然负例）；sync 后 → Packaged asset parity: PASS 且 Judgment: PASS。

Current Handoff Facts:
- Target anchors: `scripts/validate-skill-triggers.js` / `assertScenario` 与末尾报告段。
- Nearby convention: read(rel) 与 assert(cond, msg) 是脚本内统一助手。
- Direct path: `package.json` 的 trigger:verify 脚本直接调用该文件。
- Current constraints: 断言不得依赖 .claude 宿主目录；报告必须保留 Judgment: PASS 行。
- Planned touch set: 仅 `scripts/validate-skill-triggers.js`。
- Risks / stop conditions: 若 assets 树结构与 sync 分组不一致导致误报，返回事实到 Core。
- Read-basis: `scripts/validate-skill-triggers.js`；`dsh/plugins/dsh-devflow/scripts/sync-assets.js`。
- Live anchors: `scripts/validate-skill-triggers.js` / `assertScenario` 与末尾 console.log 段。

Remaining Structured Worklist:
- [ ] Add functions filesUnder and assertPackagedAssetParity to `scripts/validate-skill-triggers.js` using exact replacement: append both after assertScenario and call assertPackagedAssetParity(); before the report output, then add the Packaged asset parity: PASS report line.
  Anchors: `scripts/validate-skill-triggers.js` / `assertScenario`、`Skill Trigger Verification Report` console.log.
  Verify: Run `npm run trigger:verify`; expect Packaged asset parity: PASS and Judgment: PASS.
  Done when: 输出含两条 PASS 行且退出码为 0。
- [x] Add negative drift proof using exact replacement: temporarily append a marker line to `dsh/plugins/dsh-devflow/assets/skills/devflow-adversarial/SKILL.md`, run the check, then restore the original bytes.
  Anchors: `dsh/plugins/dsh-devflow/assets/skills/devflow-adversarial/SKILL.md`.
  Verify: Run `npm run trigger:verify`; expect failure naming sync-assets.js, then restore and expect PASS.
  Done when: 漂移被断言捕获且恢复后 PASS。

Task: 刷新打包资产副本
Task type: Documentation-only
Files:
- Modify: dsh/plugins/dsh-devflow/assets/skills/devflow-adversarial/SKILL.md | 生成副本 | 由同步脚本刷新
- Modify: dsh/plugins/dsh-devflow/assets/skills/devflow-find-fault/SKILL.md | 生成副本 | 由同步脚本刷新
- Modify: dsh/plugins/dsh-devflow/assets/commands/devflow-adversarial.toml | 生成副本 | 由同步脚本刷新
- Modify: dsh/plugins/dsh-devflow/assets/commands/devflow-find-fault.toml | 生成副本 | 由同步脚本刷新
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Run `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` to regenerate the packaged copies from the repo root
- [ ] Run `git diff --stat` and expect changes only in the four asset files listed above
- [ ] Run `npm run trigger:verify` and expect `Packaged asset parity: PASS` and `Judgment: PASS`
Acceptance: 四个资产副本与源文件字节一致；git diff 范围只有四个文件；parity 断言 PASS。
Verify: Run `npm run trigger:verify`; expect Packaged asset parity: PASS and Judgment: PASS
Comments: sync-assets.js 只复制不剪枝；资产副本禁止手改。
Not doing: 不改同步脚本、不加剪枝逻辑。

Task: README 用户文档
Task type: Documentation-only
Files:
- Modify: README.md | `## Reference Map` 之前新节 | 独立审查用法说明
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Insert a new `## 独立审查怎么用` section into `README.md` before the `## Reference Map` heading using exact replacement with this content:
```
## 独立审查怎么用（devflow-adversarial / devflow-find-fault）

两个可随时单独召唤的独立审查技能，只报告、不改代码、不宣告任务状态：

| 技能 | 触发方式 | 审查什么 | 输出 |
|---|---|---|---|
| devflow-adversarial | 说 对抗审查 / 红队审查 / 升级版对抗审查 / 五角度挑战，或用命令 /devflow-adversarial | 五个固定角度攻击当前结论：需求覆盖、可达性、边界与回归、证据强度、用户可见结果 | 分级发现（Critical / Important / Observation）加五角度覆盖、上下文限制与建议 |
| devflow-find-fault | 说 找茬 / 最大遗漏是什么 / 我没有意识到什么 / 需求细节是否确认 / 眼下你最没把握的事情是什么 / 不安感检查，或用命令 /devflow-find-fault | 最大遗漏、未意识到的盲点、最不确定的点，加实现后未确认的业务决定（不安感检查） | 每个答案分事实、推断、未知，带置信度与下一步，加分级发现 |

在 DeepSeek Harness（DSH）上，两个技能都按轮执行：子代理每轮只完成一个审查单元（对抗审查一个角度一轮；找茬一个问题或不安感检查一轮）并回报，主代理逐轮汇总进度，全部轮次后输出完整报告，避免审查被子代理单次运行时长截断。

拿到审查结论后怎么修：Critical 或 High 发现带回 DevFlow 主流程按正常修复链处理；Medium 级未确认业务决定先按输出里的确认问题问用户再改；每条 next step 是最小的人工动作；Context limitations 说明缺材料时先补齐材料再动手。
```
- [ ] Run `node -e "console.log(require('node:fs').readFileSync('README.md','utf8').includes('## 独立审查怎么用'))"` and expect `true`
Acceptance: README 出现新章节，覆盖对比表、触发词、分轮执行与修复路径四个内容点。
Verify: Run `node -e "console.log(require('node:fs').readFileSync('README.md','utf8').includes('## 独立审查怎么用'))"`; expect true
Comments: 章节放在 Reference Map 之前，与现有章节顺序一致；不新增独立文档文件。
Not doing: 不改其它章节、不新增 docs 文件。

