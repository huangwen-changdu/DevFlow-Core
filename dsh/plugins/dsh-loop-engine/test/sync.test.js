// @devflow-core/dsh-loop-engine — sync engine self-test (no test framework).
//
// Five scenarios against a temporary DSH home:
//   1. empty home  -> both asset groups created
//   2. re-run      -> idempotent (all current, target bytes unchanged)
//   3. tampered    -> target file bytes differ from source -> overwritten
//   4. isolation   -> non-loop target files survive untouched
//   5. prune       -> stale loop-* target files are removed
// Exit 0 on pass, non-zero on failure.

import assert from 'node:assert'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { syncAllAssets } from '../lib/sync.js'

const assetsRoot = fileURLToPath(new URL('../assets/', import.meta.url))
const home = mkdtempSync(join(tmpdir(), 'dsh-loop-engine-test-'))

/** Target paths that must exist after a fresh sync. */
const expected = [
  join(home, '.agent-presets/loop-engine/agent.cordis.yml'),
  join(home, '.agent-presets/loop-engine/preset.yml'),
  join(home, '.agent-presets/loop-engine/tool-bootstrap.mjs'),
  join(home, '.agent-presets/loop-engine/custom-bash.mjs'),
  join(home, '.agent-presets/loop-engine/NOTICE'),
  join(home, 'skills/loop-engineering/SKILL.md'),
  join(home, 'skills/loop-engineering/templates/fix-bug-to-green.md'),
]

// Scenario 1: empty home -> everything created.
const first = syncAllAssets(assetsRoot, home)
for (const file of expected) {
  assert(existsSync(file), `scenario 1: missing after fresh sync: ${file}`)
}
assert.strictEqual(first.failed.length, 0, `scenario 1: unexpected failures: ${JSON.stringify(first.failed)}`)
assert(first.synced.length >= 2, `scenario 1: expected >=2 synced groups, got ${JSON.stringify(first.synced)}`)

// Scenario 2: re-run -> idempotent, bytes unchanged.
const probe = readFileSync(join(home, 'skills/loop-engineering/SKILL.md'))
const second = syncAllAssets(assetsRoot, home)
assert(second.synced.length === 0, `scenario 2: re-run must not resync: ${JSON.stringify(second.synced)}`)
assert(second.failed.length === 0, `scenario 2: unexpected failures: ${JSON.stringify(second.failed)}`)
assert(probe.equals(readFileSync(join(home, 'skills/loop-engineering/SKILL.md'))), 'scenario 2: target bytes changed on idempotent re-run')

// Scenario 3: tampered target -> overwritten from source.
writeFileSync(join(home, 'skills/loop-engineering/SKILL.md'), 'TAMPERED', 'utf8')
const third = syncAllAssets(assetsRoot, home)
assert(third.synced.includes('skills/loop-engineering'), `scenario 3: skills group must resync, got ${JSON.stringify(third.synced)}`)
assert.notStrictEqual(readFileSync(join(home, 'skills/loop-engineering/SKILL.md'), 'utf8'), 'TAMPERED', 'scenario 3: tampered file not restored')

// Scenario 4: isolation -> non-loop files survive.
const foreign = join(home, 'skills/atlassian/SKILL.md')
mkdirSync(join(home, 'skills/atlassian'), { recursive: true })
writeFileSync(foreign, 'KEEP', 'utf8')
const foreignPreset = join(home, '.agent-presets/devflow-2/agent.cordis.yml')
mkdirSync(join(home, '.agent-presets/devflow-2'), { recursive: true })
writeFileSync(foreignPreset, 'KEEP', 'utf8')
const fourth = syncAllAssets(assetsRoot, home)
assert(readFileSync(foreign, 'utf8') === 'KEEP', 'scenario 4: non-loop skill was touched')
assert(readFileSync(foreignPreset, 'utf8') === 'KEEP', 'scenario 4: foreign preset dir was touched')
assert(!fourth.pruned.some((entry) => entry.includes('atlassian')), `scenario 4: atlassian pruned: ${JSON.stringify(fourth.pruned)}`)
assert(!fourth.pruned.some((entry) => entry.includes('devflow-2')), `scenario 4: devflow-2 pruned: ${JSON.stringify(fourth.pruned)}`)

// Scenario 5: stale loop-* target -> pruned.
const stale = join(home, 'skills/loop-stale/SKILL.md')
mkdirSync(join(home, 'skills/loop-stale'), { recursive: true })
writeFileSync(stale, 'STALE', 'utf8')
const fifth = syncAllAssets(assetsRoot, home)
assert(!existsSync(join(home, 'skills/loop-stale')), 'scenario 5: stale loop-* skill dir not pruned')
assert(fifth.pruned.some((entry) => entry.includes('loop-stale')), `scenario 5: prune not reported: ${JSON.stringify(fifth.pruned)}`)
assert(existsSync(foreign), 'scenario 5: foreign skill lost during prune')

console.log('Loop Engine DSH plugin sync test passed')
console.log('Checked fresh sync, idempotent re-run, tamper overwrite, non-loop isolation, and stale prune')

// Self-clean the temporary home; keep the exit code from a failed cleanup
// visible so a leftover temp dir cannot be silently accepted.
try {
  rmSync(home, { recursive: true, force: true })
} catch (error) {
  console.error(`cleanup failed: ${error.message}`)
  process.exit(1)
}
process.exit(0)
