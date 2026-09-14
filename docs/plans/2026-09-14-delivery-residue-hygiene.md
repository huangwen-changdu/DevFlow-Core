# 交付面残留治理：规则内嵌 + 接线断言 + 插件同步

Status: done
Goal: 让 DevFlow 最终产物只描述已采纳最终状态；六个承载位置写入短规则与收口检查，validate-devflow.js 加接线断言防漂移，DSH 与 Codex 插件副本及版本同步，npm publish 待用户执行。
Not doing: 不新增技能、命令、语义扫描脚本；不移植 no-negative-echo 源码与评测资产；不清除 Rejected、Non-goals、学习卡、评审发现等刻意决策记录；不改路由、生命周期契约与宿主适配文件；不为 Codex 插件新建自动同步机制。
Cut: 做 六个承载位置的规则文本 + validate-devflow.js 接线断言 + DSH sync-assets 与子包 bump + Codex 副本刷新与插件 bump + 根版本 bump | 不做 独立技能、exact-term 扫描脚本、六个 SKILL.md 正文、Codex 自动同步机制、preset 与宿主镜像同句 | 复用 既有必读 references、validate-devflow.js 断言段落模式、sync-assets.js 与 verify-plugin.js 既有发布链 | 验证 标记检查命令、`npm run verify:all`、sync-assets 幂等与子包自测、verify-plugin 与逐字节比对 | Rejected: 六个 SKILL.md 正文（devflow-build 余 86B、devflow-prove 余 19B，预算否决）；独立技能加 Python 扫描器移植（用户改选内嵌，仓库无 Python 运行时）；Codex 自动同步机制（2026-09-01 计划约定无实证漂移不建）；preset 与插件描述追加（同步面扩大、收益低）；宿主适配同句（适配文件是 AGENTS.md 指针，无需镜像）
Source: docs/specs/2026-09-14-delivery-residue-hygiene.md
Execution mode: sequential
Landed: 2026-09-14 · npm run verify:all 退出码 0；六处 accepted final state 标记 6/6；DSH sync 幂等+子包自测 PASS（0.9.0）；Codex 副本逐字节一致+verify-plugin PASS（0.3.0）；根版本 0.5.0

## Tasks

Task: 六个承载位置写入交付面规则
Files:
- Modify: AGENTS.md | symbol: `## Hard Boundaries` | 总规则短句，覆盖生命周期外 commit 与 PR 文案
- Modify: skills/devflow-core/SKILL.md | symbol: `## Context Map` | 同规则短小节，Sense 常载
- Modify: skills/devflow-build/references/build-methods.md | symbol: `## Build Comments` | Build 注释残留规则
- Modify: skills/devflow-prove/references/proof-recovery-methods.md | symbol: `## Method 13: Proof Before Done` | 终稿通读收口
- Modify: skills/devflow-spec/references/spec-plan-methods.md | symbol: `## Method 10: Spec Document And Plan Pack` | Spec 与 Plan 文档规则
- Modify: skills/devflow-docs-followup/SKILL.md | symbol: `## Evidence And Landing` | 交付文档规则
Change: 增加统一规则骨架——Final artifacts describe the accepted final state; rejected session-only alternatives, corrections, and negative instructions stay control data; keep decision records, safety facts, and pre-existing user changes——六个位置均含字面标记 `accepted final state`；Build 处写明注释只描述最终行为与非显然 WHY，不写被否方案或 why-not-X 叙述；Prove 处要求终稿前以无会话读者视角通读全部产物与包装；Spec 与 Plan 处要求命名、标题、正文从已采纳目标生成并保留 Non-goals 与 Rejected；docs-followup 处要求文档只描述已采纳实现；措辞保持正向，不列禁词清单
Acceptance: 六个承载文件全部含 accepted final state 标记，标记检查命令输出 markers 6/6
Verify: run `node -e "const fs=require('fs');const f=['AGENTS.md','skills/devflow-core/SKILL.md','skills/devflow-build/references/build-methods.md','skills/devflow-prove/references/proof-recovery-methods.md','skills/devflow-spec/references/spec-plan-methods.md','skills/devflow-docs-followup/SKILL.md'];const m=f.filter(p=>!fs.readFileSync(p,'utf8').includes('accepted final state'));if(m.length)throw new Error('missing: '+m);console.log('markers 6/6')"` expect output markers 6/6 and exit 0
Not doing: 不新增技能、脚本或禁词清单

Task: validate-devflow.js 增加接线断言
Files:
- Modify: scripts/validate-devflow.js | symbol: `end each user-facing message with one status line` | 六文件标记断言与段落注释
Change: 增加一个断言组，沿用状态行断言段写法：对 AGENTS.md、skills/devflow-core/SKILL.md、skills/devflow-build/references/build-methods.md、skills/devflow-prove/references/proof-recovery-methods.md、skills/devflow-spec/references/spec-plan-methods.md、skills/devflow-docs-followup/SKILL.md 六个路径逐一 assert 含 `accepted final state`，段首加一行说明注释防止规则漂移
Acceptance: npm test 退出码 0，断言组覆盖六个承载文件
Verify: run `npm test` expect exit 0; then run `node -e "const s=require('fs').readFileSync('scripts/validate-devflow.js','utf8');const n=(s.match(/accepted final state/g)||[]).length;if(n<6)throw new Error('assert refs '+n);console.log('assert refs',n)"` expect at least 6 references and exit 0
Not doing: 不改既有断言与校验分支

Task: DSH 插件资产同步与版本 bump
Files:
- Modify: dsh/plugins/dsh-devflow/package.json | symbol: `version` | 0.7.0 升为 0.9.0
- Modify: dsh/plugins/dsh-devflow/assets | symbol: `assets/skills` | sync-assets 刷新后的自包含副本
Change: 增加同步步骤：运行 sync-assets 把根 skills 的规则变更刷进 assets/ 副本，再把子包版本升为 0.9.0；不改 lib 代码、cordis 补丁与发布目录结构
Acceptance: sync-assets 二次运行幂等，子包 sync.test.js 通过，子包版本为 0.9.0
Verify: run `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` twice expect identical four synced lines; run `node dsh/plugins/dsh-devflow/test/sync.test.js` expect pass; run `node -e "if(require('./dsh/plugins/dsh-devflow/package.json').version!=='0.9.0')throw new Error('version')"` expect exit 0
Not doing: 不执行 npm publish，不改发布目录结构与 lib 代码

Task: Codex 插件副本刷新与版本 bump
Files:
- Modify: plugins/devflow/skills | symbol: `devflow-*` | 刷新变更的技能树副本
- Modify: plugins/devflow/.codex-plugin/plugin.json | symbol: `version` | 0.2.0 升为 0.3.0
Change: 替换插件内 devflow-core、devflow-build、devflow-prove、devflow-spec、devflow-docs-followup 五个技能树副本为根 skills 最新内容（整体覆盖，含 references 与 agents 元数据），保持 14 个技能树数量不变，再把 manifest 版本升为 0.3.0
Acceptance: 插件副本与根 skills 逐字节一致，verify-plugin 通过，manifest 版本为 0.3.0
Verify: run `node plugins/devflow/scripts/verify-plugin.js` expect passed; run `node -e "const fs=require('fs'),path=require('path'),crypto=require('crypto');const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);const bad=[];for(const e of fs.readdirSync('skills',{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name.startsWith('devflow-'))){const src=path.join('skills',e.name),dst=path.join('plugins/devflow/skills',e.name);const a=walk(src),b=walk(dst);if(a.length!==b.length){bad.push(e.name+' count');continue}for(const f of a){const rel=path.relative(src,f);const g=path.join(dst,rel);if(!fs.existsSync(g)||hash(f)!==hash(g))bad.push(e.name+'/'+rel)}}if(bad.length)throw new Error('drift: '+bad);console.log('byte-identical devflow-* trees')"` expect byte-identical output and exit 0; run `node -e "if(require('./plugins/devflow/.codex-plugin/plugin.json').version!=='0.3.0')throw new Error('version')"` expect exit 0
Not doing: 不改插件 scripts、README 结构与许可证

Task: 根版本 bump
Files:
- Modify: package.json | symbol: `version` | 0.4.0 升为 0.5.0
- Modify: plugin.json | symbol: `version` | 0.4.0 升为 0.5.0
Change: 替换两个根清单的 version 为 0.5.0，与插件版本同步进入本轮发布
Acceptance: 两个根清单版本均为 0.5.0
Verify: run `node -e "const p=require('./package.json'),q=require('./plugin.json');if(p.version!=='0.5.0'||q.version!=='0.5.0')throw new Error('version');console.log(p.version,q.version)"` expect output 0.5.0 0.5.0 and exit 0
Not doing: 不执行 npm publish

## Progress

| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | 六个承载位置写入交付面规则 | done | `node -e` 标记检查输出 markers 6/6；AGENTS.md、core、build-methods、proof-recovery、spec-plan、docs-followup 六处含 `accepted final state` |
| 2 | validate-devflow.js 增加接线断言 | done | `npm test` 通过（DevFlow validation passed）；assert refs 6；依赖顺序说明：技能改动后须先跑 sync-assets 才能过资产一致性校验 |
| 3 | DSH 插件资产同步与版本 bump | done | sync-assets 连续两次输出一致（synced 1/14/11/6）；`node dsh/plugins/dsh-devflow/test/sync.test.js` 通过五场景；package.json 0.9.0 |
| 4 | Codex 插件副本刷新与版本 bump | done | `node plugins/devflow/scripts/verify-plugin.js` 通过（14 skills / 5 self-tests）；源与副本 SHA-256 逐字节一致；manifest 0.3.0 |
| 5 | 根版本 bump | done | `node -e` 版本检查输出 0.5.0 0.5.0；package.json 与 plugin.json 同步 |
