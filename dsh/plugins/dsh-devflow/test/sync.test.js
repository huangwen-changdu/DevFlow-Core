// @devflow-core/dsh-devflow — sync engine self-test (no test framework).
//
// Five scenarios against a temporary DSH home:
//   1. empty home  -> all four asset groups created
//   2. re-run      -> idempotent (all current, target bytes unchanged)
//   3. tampered    -> target file bytes differ from source -> overwritten
//   4. isolation   -> non-devflow target files survive untouched
//   5. prune       -> stale devflow-* target files are removed
// Exit 0 on pass, non-zero on failure.

import assert from 'node:assert'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { syncAllAssets } from '../lib/sync.js'

const assetsRoot = fileURLToPath(new URL('../assets/', import.meta.url))
const home = mkdtempSync(join(tmpdir(), 'dsh-devflow-test-'))

/** Target paths that must exist after a fresh sync. */
const expected = [
  join(home, '.agent-presets/devflow-2/agent.cordis.yml'),
  join(home, '.agent-presets/devflow-2/preset.yml'),
  join(home, '.agent-presets/devflow-2/tool-bootstrap.mjs'),
  join(home, '.agent-presets/devflow-2/custom-bash.mjs'),
  join(home, '.agent-presets/devflow-2/NOTICE'),
  join(home, 'skills/devflow-core/SKILL.md'),
  join(home, 'skills/devflow-cut/references/cut-methods.md'),
  join(home, 'commands/devflow.toml'),
  join(home, 'scripts/devflow-plan.js'),
]

// Scenario 1: empty home -> everything created.
const first = syncAllAssets(assetsRoot, home)
for (const file of expected) {
  assert(existsSync(file), `scenario 1: missing after fresh sync: ${file}`)
}
assert.strictEqual(first.failed.length, 0, `scenario 1: unexpected failures: ${JSON.stringify(first.failed)}`)
assert(first.synced.length >= 4, `scenario 1: expected >=4 synced groups, got ${JSON.stringify(first.synced)}`)

// Scenario 2: re-run -> idempotent, bytes unchanged.
const probe = readFileSync(join(home, 'skills/devflow-core/SKILL.md'))
const second = syncAllAssets(assetsRoot, home)
assert(second.synced.length === 0, `scenario 2: re-run must not resync: ${JSON.stringify(second.synced)}`)
assert(second.failed.length === 0, `scenario 2: unexpected failures: ${JSON.stringify(second.failed)}`)
assert(probe.equals(readFileSync(join(home, 'skills/devflow-core/SKILL.md'))), 'scenario 2: target bytes changed on idempotent re-run')

// Scenario 3: tampered target -> overwritten from source.
writeFileSync(join(home, 'commands/devflow.toml'), 'TAMPERED', 'utf8')
const third = syncAllAssets(assetsRoot, home)
assert(third.synced.includes('commands'), `scenario 3: commands group must resync, got ${JSON.stringify(third.synced)}`)
assert.notStrictEqual(readFileSync(join(home, 'commands/devflow.toml'), 'utf8'), 'TAMPERED', 'scenario 3: tampered file not restored')

// Scenario 4: isolation -> non-devflow files survive.
const foreign = join(home, 'skills/atlassian/SKILL.md')
mkdirSync(join(home, 'skills/atlassian'), { recursive: true })
writeFileSync(foreign, 'KEEP', 'utf8')
const foreignCmd = join(home, 'commands/zzz-custom.toml')
writeFileSync(foreignCmd, 'KEEP', 'utf8')
const fourth = syncAllAssets(assetsRoot, home)
assert(readFileSync(foreign, 'utf8') === 'KEEP', 'scenario 4: non-devflow skill was touched')
assert(readFileSync(foreignCmd, 'utf8') === 'KEEP', 'scenario 4: non-devflow command was touched')
assert(!fourth.pruned.some((entry) => entry.includes('atlassian')), `scenario 4: atlassian pruned: ${JSON.stringify(fourth.pruned)}`)

// Scenario 5: stale devflow-* target -> pruned.
const stale = join(home, 'skills/devflow-stale/SKILL.md')
mkdirSync(join(home, 'skills/devflow-stale'), { recursive: true })
writeFileSync(stale, 'STALE', 'utf8')
const staleCmd = join(home, 'commands/devflow-old.toml')
writeFileSync(staleCmd, 'STALE', 'utf8')
const fifth = syncAllAssets(assetsRoot, home)
assert(!existsSync(join(home, 'skills/devflow-stale')), 'scenario 5: stale devflow-* skill dir not pruned')
assert(!existsSync(staleCmd), 'scenario 5: stale devflow-* command not pruned')
assert(fifth.pruned.some((entry) => entry.includes('devflow-stale')), `scenario 5: prune not reported: ${JSON.stringify(fifth.pruned)}`)
assert(existsSync(foreign), 'scenario 5: foreign skill lost during prune')

console.log('DevFlow DSH plugin sync test passed')
console.log('Checked fresh sync, idempotent re-run, tamper overwrite, non-devflow isolation, and stale prune')

// Self-clean the temporary home; keep the exit code from a failed cleanup
// visible so a leftover temp dir cannot be silently accepted.
try {
  rmSync(home, { recursive: true, force: true })
} catch (error) {
  console.error(`cleanup failed: ${error.message}`)
  process.exit(1)
}
process.exit(0)
