# Plugin Copies Before Skill Verify

- Trigger: skills/devflow-* 内容改动, npm test 失败, dsh packaged asset drifted, 资产漂移, sync-assets 未跑, Codex 插件副本, 逐字节一致, plugins/devflow/skills 过期, preset 源与 assets 漂移
- Lesson: 根 skills 改动后 `npm test` 现在同时守两条镜像是各自独立的：dsh 插件 assets 由 `validate-skill-triggers.js` 的 `assertPackagedAssetParity` 把关，Codex 插件副本由 `validate-devflow.js` 的 `assertMirrorTree` 把关（14 棵 `devflow-*` 技能树逐字节 + 副本孤儿反查），`dsh/agent-presets/devflow-2` ↔ `assets/presets/devflow-2` 另有整体镜像断言。门禁只报漂移，不会替你同步副本：dsh 侧要跑 sync-assets，Codex 侧要手动刷新。
- Next action: Next time 修改 devflow 技能内容或 dsh preset 后，first 跑 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js`，再刷新 `plugins/devflow/skills/` 副本，最后 `npm test`；do not 只改根 skills 就宣布验证通过，也不要期待门禁自动修复副本。
- Scope: project
- Related: `scripts/validate-devflow.js`、`scripts/validate-skill-triggers.js`、`dsh/plugins/dsh-devflow/scripts/sync-assets.js`、`plugins/devflow/scripts/verify-plugin.js`、`docs/plans/2026-09-14-delivery-residue-hygiene.md`
- Evidence: 2026-09-14 delivery-residue-hygiene 构建：技能改动后 `npm test` 报 dsh packaged asset drifted 并要求 re-run sync-assets；sync 后 npm test 与资产校验 PASS；Codex 副本手动 cpSync + SHA-256 逐字节比对通过。同日追加门禁：`scripts/validate-devflow.js` 增 `assertMirrorTree`（Codex 副本）与 preset 源↔assets 镜像断言，变异测试使 `npm test` 由 exit 0 变 exit 1，而同变异下 `validate-skill-triggers.js` 仍 PASS；恢复后目标文件 sha256 与原值一致。
- Invalidation: 两条镜像门禁任一被移除，或副本改为自动同步（门禁不再是唯一防线）后需修订本卡。
