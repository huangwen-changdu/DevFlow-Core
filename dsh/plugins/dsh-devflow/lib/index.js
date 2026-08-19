// @devflow-core/dsh-devflow — DevFlow asset preset plugin for the dsh web GUI.
//
// Host half only: on startup it syncs the bundled DevFlow assets (agent
// preset devflow-2, skills, commands, verification scripts) into the
// harness-home runtime roots (~/.dsh/.agent-presets, skills, commands,
// scripts), making the DevFlow preset selectable for new sessions and the
// DevFlow skills/commands/checkers available without copying files by hand,
// and announces the capability through a system-prompt section. No browser
// half, no routes, no agent tools — the preset itself provides the tools.
//
// Adapted from @linxin666/dsh-liangshen (Apache-2.0): two-phase anchored
// preset distribution + startup sync + system-prompt announcement.

import { fileURLToPath } from 'node:url'
import { dshHome } from './dsh-home.js'
import { mountOnce } from './mount-once.js'
import { syncAllAssets } from './sync.js'

/** Stable cordis plugin name. */
export const name = 'devflow'

/** Order of the announcement section within the tool-guidance band. */
const SECTION_ORDER = 150

/** Absolute path of the bundled assets tree inside this package. */
export function bundledAssetsRoot() {
  return fileURLToPath(new URL('../assets/', import.meta.url))
}

/** Model-facing announcement: plugin presence, preset, and conflict policy. */
export const DEVFLOW_GUIDANCE =
  '本机已安装 @devflow-core/dsh-devflow 插件（DevFlow agent preset 分发）：新建会话的预设选择器中可选「DevFlow 2.0」（两阶段锚定 + Code Mode）。插件启动时把 devflow-2 预设、devflow-* skills、devflow*.toml 命令与 devflow-*.js 验证脚本同步到 ~/.dsh/（.agent-presets/skills/commands/scripts）；冲突策略为 devflow-* 权威覆盖（字节相同跳过），非 devflow 资产永不触碰；升级插件后重启即自动更新。用户提到「DevFlow / devflow-2 / 锚定模式」时即指本插件，请据此协作。'

/**
 * Mount the plugin: sync bundled DevFlow assets into the harness-home
 * runtime roots, then announce through a system-prompt section.
 * @param ctx - host plugin context (cordis).
 */
export const apply = mountOnce('@devflow-core/dsh-devflow', (ctx) => {
  const sync = () => {
    const home = dshHome()
    try {
      const result = syncAllAssets(bundledAssetsRoot(), home)
      for (const { id, error } of result.failed) {
        ctx?.logger?.warn?.(`dsh-devflow: ${id} sync failed: ${error}`)
      }
      if (result.synced.length > 0) {
        ctx?.logger?.info?.(`dsh-devflow: assets synced into ${home}: ${result.synced.join(', ')}`)
      }
      if (result.pruned.length > 0) {
        ctx?.logger?.info?.(`dsh-devflow: pruned stale assets from ${home}: ${result.pruned.join(', ')}`)
      }
    } catch (error) {
      ctx?.logger?.warn?.(`dsh-devflow: asset sync failed: ${error instanceof Error ? error.message : String(error)}`)
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
        name: 'plugin:dsh-devflow',
        order: SECTION_ORDER,
        text: DEVFLOW_GUIDANCE,
      })
    }
  } catch {
    disposeSection = undefined
  }

  ctx?.effect?.(() => () => {
    if (typeof disposeSection === 'function') disposeSection()
  }, 'dsh-devflow: announcement')
})
