# Install Destination Must Match Host Discovery

- Trigger: install destination, install:target 落位, skills 复制到项目, 同步到其他项目, skill 发现不了, 技能扫描不到, .agents/skills, host skill root, skills/ 旧布局, stale skills, 项目级技能目录
- Lesson: 运行时文件的落位和宿主的发现约定是同一个契约的两端。`install:target` 把 `skills/**` 原样复制到 `<目标>/skills/**` 时，读共享技能根的宿主永远扫不到；只改复制目标而不改入口文本，目标又会拿到指向不存在目录的 `AGENTS.md`、adapter 和命令。已证实的最小闭环：项目级技能落 `.agents/skills/`，源仓库保留 `skills/`（插件元数据、DSH 资产、校验器都读它），`AGENTS.md` 声明 skill root 并把 `skills/...` 解析到该根，manifest 记安装路径，`--check` 把旧 `skills/` 报成 stale 而不自动删。
- Rejected: 双写 `skills/` 与 `.agents/skills/`、或建目录 junction —— 被否：两套字节必然漂移，junction 在 Windows + git 下不可移植。只改复制目标而不改 `AGENTS.md`、adapter、命令入口 —— 被否：会留下指向旧目录的断链。
- Next action: 下次改安装落位或同步路径时，先确认宿主发现约定（项目 `.agents/skills`、用户 `~/.agents/skills`），再把落位映射、入口文本、manifest 键、校验器和迁移提示当成同一个改动提交；旧布局用 `--check` 报 stale，不自动删目标目录。
- Scope: project
- Related: `scripts/install-devflow.js`, `scripts/validate-installer.js`, `AGENTS.md`, `docs/platform-setup.md`, `docs/hotfix-log.md`, `.copilot/cards/skill-sync-after-update.md`
- Evidence: 2026-11-18 实测 KocServer 只有 `<project>/skills/`（DevFlow 0.8.1）且无 `.agents/`，hetu 的第三方技能放在 `.agents/skills/`；改写后 `npm run install:verify` 断言新目标只生成 `.agents/skills/`、不生成 `skills/`、旧 `skills/devflow-core/SKILL.md` 被 `--check` 报 `stale:` 且 exit 1；`AGENTS.md` 8180/8192 字节 PASS。
- Evidence Level: L1
- Invalidation: 宿主发现约定或项目级安装落位再次变化（例如 `.agents/skills` 被弃用）时修订。
