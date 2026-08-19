# DSH Plugin Preset Distribution And Sync Side Effect

- Trigger: DSH 插件分发 agent preset, dsh plugin add, bundle patch, preset 同步, 插件打包 skills, 模拟插件 apply, 测试同步函数
- Lesson: DSH 插件分发 preset/skills/commands/scripts 的已验证模式 = npm 子包 + `dsh.bundle.patch` 指向 cordis.patch.yml（`- insert: [{id, name}]`）+ Host 插件 apply 时把包内 assets/ 同步到 ~/.dsh/（.agent-presets/skills/commands/scripts）。纯 JS ESM 零依赖可实现（mountOnce 用 Symbol.for 独立命名空间防双挂载、sync 用 size+mtime+字节快路径、Windows 禁用 fs.cpSync recursive 防 CJK 崩溃）。**关键坑**：直接调用插件 apply（含模拟测试）会对真实用户 home 产生同步副作用——prune 会删除目标目录中源不再拥有的文件（含用户手动备份 .bak）。必须先用临时 home 验证，或至少同步前备份目标。
- Next action: Next time 创建 DSH 插件分发 preset 或测试同步逻辑，first 复用 dsh-liangshen 模式（bundle patch + 启动同步 + 纯 JS），在测试中始终用 mkdtempSync 临时 home 并断言隔离性；do not 在模拟 apply 时指向真实 ~/.dsh，也不要让 preset 组 prune 无提示删除用户备份文件（README 必须声明"preset 目录完全由插件管理"）。
- Scope: project
- Related: dsh/plugins/dsh-devflow/、@linxin666/dsh-liangshen（Apache-2.0 模板）、scripts/sync-assets.js、lib/sync.js
- Evidence: dsh/plugins/dsh-devflow 落地并通过五场景自测（创建/幂等/覆盖/隔离/prune）；模拟 apply 对真实 home 同步时 prune 了 devflow-2/agent.cordis.yml.bak-*（核实为安装副本、无自定义丢失）；根 verify:all PASS
- Invalidation: DSH 改变 preset 分发机制（如内置插件 preset 字段）、liangshen 模板升级改变挂载协议、或 sync 语义变更后本卡过时
