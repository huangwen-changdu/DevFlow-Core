# Meta-Skill Capability Integration

## Goal

将 DevFlow lifecycle skills 明确定位为元技能：`AGENTS.md` 和 `devflow-core` 负责声明流程 owner 与稳定边界；当前环境中匹配的专项 skill 可以在流程节点内完成有边界的实际工作，并回到原 owner 继续履约。

## Context

现有 Core 已有 Skill Discovery，但把匹配的外部 skill 表述为质量指导。Cut、Plan、Build 及 Plan command 又把 `External Skills` 固定为 `guides execution`。这会把可用专项能力限制成建议者，无法表达它可以在节点中承担实际工作。

用户确认本次只做最小修正：核心规则文件承担主要声明；只有仍写死限制性措辞的局部 skill/command 调整；不为统一而批量改动其他 lifecycle skill、diagram、scenario 或新增 validator。

## Requirements

1. `AGENTS.md`、`devflow-core/SKILL.md` 和 `core-methods.md` 必须声明：DevFlow skill 是流程元技能，匹配的专项 skill 可按需承担节点内工作，但不取得流程控制权。
2. 共享声明必须定义最小回收语义：专项 skill 的结果、不可用或失败事实回到调用节点；调用节点继续负责 artifact、审批、停止条件、direct-success edge、Core-return edge 和最终 Proof。
3. 仅调整当前明确限制专项能力的局部表面：`skills/devflow-cut/SKILL.md`、`skills/devflow-plan/SKILL.md`、`skills/devflow-build/SKILL.md`、`commands/devflow-plan.toml`。`External Skills` 可记录角色、预期证据和返回事实，不再固定为只能 guidance。
4. 保持 `CUT_REUSE` 原义：只有专项 skill 已完整满足用户目标且无需新增实现时才成立；专项 skill 本身不扩大 Cut scope、不跳过生命周期节点。
5. 不要求本次批量修改 Brainstorm、Spec、Prove、PUA、Learn、diagram 或新增 capability 场景/validator；共享 Core 声明覆盖它们，后续只有出现实际冲突才局部调整。
6. 不改变 A/B/C direct-success edges、非唯一状态回 Core、用户审批、Proof 新鲜证据或对抗审查要求。

## Non-goals

- 不新增通用 dispatcher、插件协议、运行时服务、配置格式、依赖或目录层级。
- 不把专项 skill 变成平行 lifecycle router，也不允许专项 skill 宣布 `CUT_PASS`、Plan/Spec approval 或最终 Proof `PASS`。
- 不要求每个任务使用专项 skill，不承诺当前环境未提供的 skill。
- 不批量改动没有限制性外部 skill 表述的 lifecycle skill、diagram、场景清单或 validator。

## Approach

比较的方案：

1. 批量修改所有 lifecycle skill、diagram、scenario 和 validator。覆盖完整，但改动面远超当前目标，增加重复规则和维护负担，拒绝。
2. 只改 `AGENTS.md` 与 Core。声明最小，但 Cut/Plan/Build 仍保留 `guides execution`，实际交接继续受限，拒绝。
3. 改 Core 启动/共享声明，并同步当前确实写死限制的 Cut、Plan、Build、Plan command。采用。

选择方案 3。它让元技能定位有唯一共享来源，同时清除已确认的局部限制；没有新增抽象、验证框架或全量同步责任。

边界：

```text
DevFlow owner identifies applicable specialist capability
  -> specialist performs bounded work and returns result / not-applicable / failure facts
  -> same owner evaluates its existing artifact and gate
  -> existing direct-success edge or Core-return edge
```

优先级保持为已批准用户目标与当前 DevFlow 节点契约高于专项 skill 建议或结果。

## Impact

- `AGENTS.md`：把启动层的外部 skill 说明从质量指导改为可按需使用的专项能力，并保留 DevFlow route owner。
- `skills/devflow-core/SKILL.md`：在 Context Map/Capability Dispatch 中声明元技能定位和节点内能力接入。
- `skills/devflow-core/references/core-methods.md`：在共享方法中定义调用节点、专项角色、预期证据、返回事实和不可越过的边界。
- `skills/devflow-cut/SKILL.md`：更新 Minimal Solution Ladder、Required Gates、Handoff 中的 `External Skills` 语义。
- `skills/devflow-plan/SKILL.md`：更新 Plan Header 与继承说明，使 Plan 能携带实际专项结果要求。
- `commands/devflow-plan.toml`：同步 Plan command 的 `External Skills` 提示。
- `skills/devflow-build/SKILL.md`：更新 Plan Review/Plan Pack/Stop Protocol，使 Build 能接住专项结果、不可用或失败事实。
- 不新增文件，不调整 plugin/manifest/installer 清单，不改其他 lifecycle skill 或验证场景。

## Acceptance

1. 仅阅读 `AGENTS.md`、Core skill 和 Core methods，即可知道 DevFlow 是流程 owner，专项 skill 可在节点内执行实际工作并回到原 owner。
2. Core methods 明确记录专项结果/不可用/失败事实的回收方式，以及专项 skill 不得改变的流程边界。
3. Cut、Plan、Build 和 Plan command 不再把 `External Skills` 固定为只能 `guides execution`，而能保留角色、预期证据和返回事实。
4. A/B/C、Core-return、Cut reuse、审批和 Proof 语义无变化；其他没有冲突的 lifecycle skill 不被批量改写。
5. 现有 Spec、package、trigger、host 和 whitespace 验证通过；不声称证明真实宿主加载专项 skill。

## Verification

1. `node scripts/devflow-spec.js docs/specs/2026-07-31-meta-skill-capability-integration.md`
2. `npm test`
3. `npm run trigger:verify`
4. `npm run host:verify`
5. `git diff --check`

## Code Documentation

不新增 validator helper、public API、配置格式或运行时模块；共享 Markdown contract 使用清晰的 owner、role、evidence、result 和 boundary 字段表达，不需要额外代码注释。

## Open Questions

None.
