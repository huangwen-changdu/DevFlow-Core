# @devflow-core/dsh-loop-engine — Loop Engine 循环工程插件（DSH）

独立插件：把「Loop Engine 循环工程」agent preset 与 `loop-engineering` skill
打包分发到 DeepSeek Harness，一条命令安装，随插件启动自动同步。**不依赖
dsh-devflow**，两者互不触碰。

## 安装

```sh
npx @deepseek-ai/dsh plugin --profile web add @devflow-core/dsh-loop-engine
```

装完**必须重启 web**（Ctrl+C → 重新 `npx @deepseek-ai/dsh web`）才生效。

重启后：

1. 新建会话，预设选择器可选 **Loop Engine 循环工程**（两阶段锚定 + 循环工程）。
2. 会话内 `loop-engineering` skill 出现在技能目录，按循环定义/需求自动触发。

## 同步内容

插件启动时把包内 `assets/` 两类资产同步到用户 `~/.dsh/`：

| 资产 | 源（包内） | 目标（用户） |
|---|---|---|
| agent preset | `assets/presets/loop-engine/`（6 文件） | `~/.dsh/.agent-presets/loop-engine/` |
| skill | `assets/skills/loop-engineering/`（1 个，含 templates/） | `~/.dsh/skills/` |

## 冲突策略

- **loop-\* 权威覆盖**：目标文件与包内源文件字节相同 → 跳过；不同 → 覆盖。
- 源不再包含的 loop-\* 残留（升级后旧文件）→ 删除（prune）。
- **非 loop 资产永不触碰**：其他插件分发的 preset/skill（devflow-*、
  atlassian、rtk 等）与用户自装内容一律保留，不删除不覆盖。
- **preset 目录完全由插件管理**：`~/.dsh/.agent-presets/loop-engine/` 整目录归
  插件所有，目录内非包内文件（含手动备份如 `agent.cordis.yml.bak-*`）会在
  下次同步时被清理。请勿在该目录存放自定义文件；如需自定义 preset，把
  目录复制成新预设 id 或改源码重新打包。

## 升级更新

DevFlow-Core 仓库发布新版本后，维护者流程：

```sh
node dsh/plugins/dsh-loop-engine/scripts/sync-assets.js   # 刷新子包资产（防漂移）
# bump dsh/plugins/dsh-loop-engine/package.json 版本号
npm publish                                            # 在 dsh/plugins/dsh-loop-engine 目录
```

已安装用户升级：

```sh
npx @deepseek-ai/dsh plugin --profile web update @devflow-core/dsh-loop-engine
# 或 remove + add，然后重启 web
```

重启后插件自动把新资产同步到 `~/.dsh/`（字节相同跳过，升级残留 prune）。

## 使用

预设的行为（循环定义、循环隔离、模板）见 preset 自带 README
（`dsh/agent-presets/loop-engine/README.md`）与 `loop-engineering` skill。

## Windows 提示

preset 的 `custom-bash.mjs` 需要 Git Bash 可解析：默认自动推断 Git 安装位置；
若 `git` 不在 PATH，在 `~/.dsh/.agent-presets/loop-engine/agent.cordis.yml`
的 custom-bash 行显式配置 `bashPath` 指向本机 Git。

## NOTICE

本插件改编自 @devflow-core/dsh-devflow（Apache-2.0），其同步/挂载/单实例
守卫逻辑源自 @linxin666/dsh-liangshen；preset 内 bootstrap 代码源自
xiaobright/dsh-anchored-standard（MIT）经 dsh-liangshen / devflow-2 派生。
详见 NOTICE。
