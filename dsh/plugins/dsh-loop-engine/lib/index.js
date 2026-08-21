// @devflow-core/dsh-loop-engine — Loop Engine asset preset plugin for the dsh
// web GUI. 独立插件：只分发 loop-engine 预设与 loop-engineering skill，不依赖
// dsh-devflow。
//
// Host half only: on startup it syncs the bundled Loop Engine assets (agent
// preset loop-engine, skill loop-engineering) into the harness-home runtime
// roots (~/.dsh/.agent-presets/loop-engine, ~/.dsh/skills/loop-engineering),
// making the preset selectable for new sessions without copying files by hand,
// and announces the capability through a system-prompt section. No browser
// half, no routes, no agent tools — the preset itself provides the tools.
//
// Adapted from @devflow-core/dsh-devflow (Apache-2.0), which was itself
// adapted from @linxin666/dsh-liangshen: two-phase anchored preset
// distribution + startup sync + system-prompt announcement.

import { fileURLToPath } from 'node:url'
import { dshHome } from './dsh-home.js'
import { mountOnce } from './mount-once.js'
import { syncAllAssets } from './sync.js'

/** Stable cordis plugin name. */
export const name = 'loop-engine'

/** Order of the announcement section within the tool-guidance band. */
const SECTION_ORDER = 150

/** Absolute path of the bundled assets tree inside this package. */
export function bundledAssetsRoot() {
  return fileURLToPath(new URL('../assets/', import.meta.url))
}

/** Model-facing announcement: plugin presence, preset, and conflict policy. */
export const LOOP_GUIDANCE =
  '本机已安装 @devflow-core/dsh-loop-engine 插件（Loop Engine 循环工程 preset 分发，独立插件）：新建会话的预设选择器中可选「Loop Engine 循环工程」（两阶段锚定 + 循环工程）。插件启动时把 loop-engine 预设同步到 ~/.dsh/.agent-presets/loop-engine/、loop-engineering skill 同步到 ~/.dsh/skills/loop-engineering/；冲突策略为 loop-* 权威覆盖（字节相同跳过），非 loop 资产永不触碰；升级插件后重启即自动更新。用户提到「Loop Engine / 循环工程 / 循环定义」时即指本插件，请据此协作。'

/**
 * Mount the plugin: sync bundled Loop Engine assets into the harness-home
 * runtime roots, then announce through a system-prompt section.
 * @param ctx - host plugin context (cordis).
 */
export const apply = mountOnce('@devflow-core/dsh-loop-engine', (ctx) => {
  const sync = () => {
    const home = dshHome()
    try {
      const result = syncAllAssets(bundledAssetsRoot(), home)
      for (const { id, error } of result.failed) {
        ctx?.logger?.warn?.(`dsh-loop-engine: ${id} sync failed: ${error}`)
      }
      if (result.synced.length > 0) {
        ctx?.logger?.info?.(`dsh-loop-engine: assets synced into ${home}: ${result.synced.join(', ')}`)
      }
      if (result.pruned.length > 0) {
        ctx?.logger?.info?.(`dsh-loop-engine: pruned stale assets from ${home}: ${result.pruned.join(', ')}`)
      }
    } catch (error) {
      ctx?.logger?.warn?.(`dsh-loop-engine: asset sync failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  sync()

  // Optional announcement: register only when the systemPrompt service is
  // available; a missing service must not block the sync (no hard inject).
  let disposeSection
  try {
    const systemPrompt = ctx?.get?.('systemPrompt')
    if (systemPrompt && typeof systemPrompt.section === 'function') {
      disposeSection = systemPrompt.section({
        name: 'plugin:dsh-loop-engine',
        order: SECTION_ORDER,
        text: LOOP_GUIDANCE,
      })
    }
  } catch {
    disposeSection = undefined
  }

  ctx?.effect?.(() => () => {
    if (typeof disposeSection === 'function') disposeSection()
  }, 'dsh-loop-engine: announcement')
})
