# Preset UI Boundary: Client UI Is Deployment-Level

- Trigger: 给 preset 加 UI、固化插件、常驻看板、agent preset 界面、动态插件刷新后消失
- Lesson: DSH preset 组合行只能引用已安装 npm 包的 Host 半边；浏览器 UI 无法由 preset 携带——Client 插件必须进部署 Web 组合（`dsh-web-app` 的 dsh.client roster + 包内 `exports["./client"]` 构建产物）并重启部署才生效。动态插件的 Client 半边绑定页面：刷新、切窗口（浏览器标签休眠）、进程重启都会丢失，需重新激活。零部署手术的常驻状态显示 = 产品自带面板：`todo_write`（多条目、会话级持久、刷新不丢）+ `create_goal`。
- Next action: Next time a user asks to 固化 UI into a preset, first classify: 常驻 UI → 检查产品自带面板（todo/goal）能否承载，否则明确告知部署级手术成本；Host 工具固化 → 建 npm 包放进部署 node_modules + preset 行（npx 缓存刷新会丢，需告知用户）。
- Scope: project
- Related: `dsh/agent-presets/devflow/agent.cordis.yml`、`AGENTS.md` 状态可见性规则、已移除的 status-1 插件
- Evidence: 本会话 status-1 插件完整生命周期：切窗口/刷新后 Client 半边丢失需手动激活；`dsh-client-modules` 只扫部署 Web 组合的 dsh.client 包；用户最终选 todo/goal 产品通道承载状态
- Invalidation: Revise when DSH 支持 preset 级客户端插件或用户级 web roster。
