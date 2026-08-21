# DSH 插件仓库更新必须同步发布 npm

- Trigger: 改动 dsh/plugins/<插件>/ 源码或 assets、修改插件分发的 preset/skill、dsh 插件有更新、loop-engine/dsh-devflow 资产变更
- Lesson: dsh/plugins/ 下的插件（如 dsh-loop-engine、dsh-devflow）是 npm 分发形态：仓库源码改动后只同步本地 ~/.dsh 不够，还必须走发布链，否则用户 update 拿到的还是旧包（本地改了、包里没改 = 下次安装/覆盖回退）。标准链（dsh-loop-engine README「升级更新」节）：`node dsh/plugins/<插件>/scripts/sync-assets.js`（把权威源刷进 assets/，防打包漂移）→ bump 该插件 package.json 版本 → 在插件目录 `npm publish` → 通知用户 `dsh plugin --profile web update <包名>` + 重启 web。注意 sync-assets.js 只拷贝不 prune（源文件删除需手动清 assets 残留）。
- Next action: Next time 修改任何 dsh/plugins/ 插件（尤其 assets/presets 或 assets/skills 内容），first 在收尾时跑 sync-assets.js、bump 版本并 npm publish（或明确记录「已改源码未发布」待办），do not 只同步本地 ~/.dsh 就当作完成。
- Scope: project
- Related: dsh/plugins/dsh-loop-engine/README.md（升级更新节）、dsh/plugins/dsh-loop-engine/scripts/sync-assets.js、.copilot/cards/dsh-plugin-preset-distribution.md
- Evidence: 本次入口修复改了权威源并同步了运行时与插件 assets 镜像，但未 bump/npm publish；用户提醒「下次记着 dsh 插件有更新的话 npm 也更新」；dsh-loop-engine README 已写明维护者发布流程
- Invalidation: 插件分发机制改为非 npm 形态（如内置发布、monorepo 统一发版）后本卡过时
