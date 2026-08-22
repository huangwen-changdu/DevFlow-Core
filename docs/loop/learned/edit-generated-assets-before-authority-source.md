# 失败卡: 改生成资产前未先确认权威源方向，被同步脚本覆盖

> 摘要: 用途=防止改动被官方同步脚本覆盖造成返工 | 做了什么=记录触发/根因/修复/防复发 | 复用入口=动手改任何「带 sync 脚本的插件资产」前先读本卡 | 更新时间=2026-08-23

- 触发: 循环直接修改 `dsh/plugins/dsh-loop-engine/assets/` 下的 SKILL.md 与模板，随后运行官方 `scripts/sync-assets.js` 把改动整体覆盖回旧版，浪费一轮重做。
- 根因: 插件 assets 是同步脚本从权威源派生的生成物——SKILL/模板权威源在仓库根 `skills/loop-engineering/`，preset 权威源在 `dsh/agent-presets/loop-engine/`；动手前未确认权威源方向（插件 README「升级更新」节其实已写明维护者流程 = 先 sync 再发布）。
- 修复: 把同一批改动重做在权威源上，再重跑 `node dsh/plugins/dsh-loop-engine/scripts/sync-assets.js` 刷新派生品，最后验证派生品与权威源一致（grep 对比）。
- 防复发: 动任何「带同步脚本的插件资产」前，先读该插件 README 的维护者流程与 sync 脚本源目录，确定权威源方向再改；改完必跑 sync 并做一致性别查。

召回记录:
- 2026-08-23 loop-docs-sedimentation: 本卡由该循环 R7 路线图修订生成（发现并已修复，返工一轮）。
