# loop-engine 测试指南（分层验证）

> 摘要: 用途=回答「怎么测试新版 loop-engine」并给出可复用的分层验证命令 | 做了什么=L1 分发层 / L2 资产一致性 / L3 运行态生效 / L4 会话冒烟四层方案 + 本机实跑证据 | 复用入口=每次改动 loop-engine（SKILL/模板/preset/路径）后按 L1→L4 顺序跑一遍 | 更新时间=2026-08-23

本指南面向「改完 loop-engine 怎么验证」。改动层不同，必跑层不同；全量回归按 L1→L4 顺序执行。

| 层 | 测什么 | 什么时候必跑 |
|---|---|---|
| L1 分发层 | 插件自带 sync 引擎五场景（fresh/幂等/篡改覆盖/隔离/剪枝） | 改了 lib/sync 或 assets 结构 |
| L2 资产一致性 | 插件打包资产 = 仓库权威源（发布前防漂移） | 改了权威源（skills/loop-engineering、dsh/agent-presets/loop-engine）|
| L3 运行态生效 | ~/.dsh 资产 = 仓库资产，且新版内容真在运行态 | 改动要立刻对当前 dsh 生效 |
| L4 会话冒烟 | 新会话真能走到循环协议（skill 加载 + 新路径可用） | 协议/路径/沉淀规则变更 |

## L1 插件分发层

命令（在仓库根）：

```sh
cd dsh/plugins/dsh-loop-engine && node test/sync.test.js
```

预期：输出 `Loop Engine DSH plugin sync test passed`，退出码 0。五场景：空家目录创建、重跑幂等、篡改覆盖、非 loop 资产隔离、stale prune。

### 执行证据

- 2026-08-23 实跑：输出 `Loop Engine DSH plugin sync test passed`（fresh sync, idempotent re-run, tamper overwrite, non-loop isolation, stale prune），退出码 0 ✓

## L2 资产一致性（发布前防漂移）

命令（在仓库根）：

```sh
node dsh/plugins/dsh-loop-engine/scripts/sync-assets.js
diff -r dsh/agent-presets/loop-engine dsh/plugins/dsh-loop-engine/assets/presets/loop-engine
diff -r skills/loop-engineering dsh/plugins/dsh-loop-engine/assets/skills/loop-engineering
```

预期：sync 输出 synced；两个 diff 退出码 0（无输出）。**注意权威源方向**：改 SKILL/模板去 `skills/loop-engineering/`，改 preset 去 `dsh/agent-presets/loop-engine/`，永远先改权威源再跑 sync（失败卡：edit-generated-assets-before-authority-source）。

### 执行证据

- 2026-08-23 实跑：sync 输出 `synced 2 entries`；preset diff 退出码 0、skills diff 退出码 0 ✓

## L3 运行态生效（~/.dsh）

命令（在仓库根）：

```sh
diff -r dsh/agent-presets/loop-engine ~/.dsh/.agent-presets/loop-engine
diff -r skills/loop-engineering ~/.dsh/skills/loop-engineering
grep -c 'docs/loop' ~/.dsh/skills/loop-engineering/SKILL.md
grep -c '文档沉淀' ~/.dsh/skills/loop-engineering/SKILL.md
```

预期：两个 diff 退出码 0；grep 命中 > 0（新版路径与沉淀规则已到运行态）。若 diff 非 0：插件会在 dsh 重启时自动同步，或手动复制权威源到对应目录。

### 执行证据

- 2026-08-23 实跑：preset diff 退出码 0、skills diff 退出码 0；`grep -c 'docs/loop'` = 12、`grep -c '文档沉淀'` = 2；4 个模板均含 `docs/loop/loop-state.md`（2/3/2/2 处）✓

## L4 会话冒烟

验证点（无需命令，观察当前/新会话）：

1. 预设可选：Web 新建会话预设选择器有「Loop Engine 循环工程」（preset.yml 已同步）。
2. skill 可见：会话技能目录含 `loop-engineering`（当前会话已加载——系统技能列表可见）。
3. 协议走新路径：本循环的状态文件正在 `docs/loop/loop-state.md` 更新（`loop/` 已不存在）；产物按新规则带摘要头并同步 INDEX。

### 执行证据

- 2026-08-23 实跑：① `~/.dsh/.agent-presets/loop-engine/preset.yml` 存在且 name=`Loop Engine 循环工程`、order=7 ✓；② 当前会话技能目录含 loop-engineering（会话按该 SKILL 协议运行 = 加载证据）✓；③ 状态文件位于 `docs/loop/loop-state.md` 且 `loop/` 目录已不存在（新路径生效）✓

## 维护机制

- 本指南自身也是 loop 产物：改动本指南后须同步 INDEX.md 对应行与摘要头更新时间。
- 新增测试层时在此文件追加；改动命令时同步改预期与证据块。

## 实现边界与局限声明

- L4 的「模型真按协议走」无法用命令 100% 证明——文件级证据只能证明「声称与记录一致」（状态文件在 docs/loop/ 更新、摘要头存在），行为真伪靠重放与人工观察。
- L3 的 grep 只证「新版文本在运行态文件里」，不证 dsh 进程已重载（插件资产同步发生在 dsh 启动时；本机为手动同步后 diff 一致）。
