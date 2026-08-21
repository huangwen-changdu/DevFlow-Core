// @devflow-core/dsh-loop-engine — asset sync engine.
// Adapted from @devflow-core/dsh-devflow/lib/sync.js (Apache-2.0), which was
// itself adapted from @linxin666/dsh-liangshen/src/sync.ts. Narrowed to the
// two Loop Engine asset groups (preset loop-engine, skill loop-engineering)
// with the "loop-* authoritative override" conflict policy: byte-identical
// files are skipped, differing files are overwritten, and only target files
// whose name matches the group's own prefix (loop-*) and no longer exist in
// the source are pruned. Files outside the group prefix are never touched.

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, utimesSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

/**
 * Clock/coarse-grain tolerance for the mtime fast path. When a source and a
 * target file share a size and a near-identical mtime we still fall through to
 * a byte comparison; a mtime gap beyond this simply proves the pair cannot be
 * byte-identical, so we skip the read.
 */
const MTIME_TOLERANCE_MS = 1000

/** One sync run's outcome, grouped for diagnostics. */
export function newSyncResult() {
  return { synced: [], current: [], failed: [], pruned: [] }
}

function filesUnder(root) {
  const out = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry)
      if (statSync(path).isDirectory()) walk(path)
      else out.push(path)
    }
  }
  walk(root)
  return out
}

/**
 * File identity is bytes. Size and mtime are only a fast negative check: a
 * size mismatch or a mtime gap beyond the tolerance proves the pair cannot be
 * byte-identical without reading both, but an equal size and close mtime still
 * fall through to a byte comparison so content differences are never missed.
 */
function sameFile(a, b) {
  const sourceStat = statSync(a)
  const targetStat = statSync(b)
  if (sourceStat.size !== targetStat.size) return false
  if (Math.abs(sourceStat.mtimeMs - targetStat.mtimeMs) > MTIME_TOLERANCE_MS) return false
  return readFileSync(a).equals(readFileSync(b))
}

/**
 * Copy the whole tree under `sourceDir` into `targetDir`, creating the target
 * directory as needed. Intentionally not `fs.cpSync` (recursive): on Node 22
 * for Windows, `fs.cpSync` with `recursive: true` crashes the process with a
 * fatal error (STATUS_STACK_BUFFER_OVERRUN / 0xC0000409, no JS exception is
 * thrown) whenever the source path contains non-ASCII characters such as a
 * CJK home directory (nodejs/node#54476). Source mtimes are preserved.
 */
function copyTreeSync(sourceDir, targetDir) {
  mkdirSync(targetDir, { recursive: true })
  for (const entry of readdirSync(sourceDir)) {
    const source = join(sourceDir, entry)
    const target = join(targetDir, entry)
    const stat = statSync(source)
    if (stat.isDirectory()) {
      copyTreeSync(source, target)
    } else {
      copyFileSync(source, target)
      utimesSync(target, stat.atime, stat.mtime)
    }
  }
}

/** Remove one target entry (file or dir) if it exists. */
function removeEntry(target) {
  if (!existsSync(target)) return
  rmSync(target, { recursive: true, force: true })
}

/**
 * Sync one source group into its target directory.
 *
 * @param sourceDir - bundled group root inside the package (e.g. assets/skills).
 * @param targetDir - user runtime group root (e.g. <home>/skills).
 * @param options - { prefix } the group's owned name prefix (e.g. 'loop-').
 *   Only entries matching the prefix are copied from source or pruned from
 *   target; everything else in either directory is left untouched.
 * @param report - SyncResult accumulator; pushes the group id when changed.
 * @param groupId - diagnostic id for the accumulator.
 */
export function syncGroup(sourceDir, targetDir, { prefix }, report, groupId) {
  if (!existsSync(sourceDir)) {
    report.failed.push({ id: groupId, error: `bundled source missing: ${sourceDir}` })
    return
  }
  mkdirSync(targetDir, { recursive: true })

  const sourceEntries = readdirSync(sourceDir).filter((name) => name.startsWith(prefix))
  let dirty = false

  // Copy or refresh every owned source entry, then prune owned target entries
  // the source no longer ships. Byte-identical files stay untouched so the
  // user's mtimes and any local tooling watching them are preserved.
  for (const name of sourceEntries) {
    const source = join(sourceDir, name)
    const target = join(targetDir, name)
    const stat = statSync(source)
    if (stat.isDirectory()) {
      const existing = existsSync(target) && statSync(target).isDirectory()
      if (existing && sameTree(source, target)) continue
      removeEntry(target)
      copyTreeSync(source, target)
      dirty = true
    } else {
      if (existsSync(target) && !statSync(target).isDirectory() && sameFile(source, target)) continue
      removeEntry(target)
      mkdirSync(dirname(target), { recursive: true })
      copyFileSync(source, target)
      utimesSync(target, stat.atime, stat.mtime)
      dirty = true
    }
  }

  for (const entry of readdirSync(targetDir)) {
    if (!entry.startsWith(prefix)) continue
    if (sourceEntries.includes(entry)) continue
    removeEntry(join(targetDir, entry))
    report.pruned.push(`${groupId}/${entry}`)
    dirty = true
  }

  if (dirty) report.synced.push(groupId)
  else report.current.push(groupId)
}

/** Byte-compare two directory trees without touching either. */
function sameTree(a, b) {
  const aFiles = filesUnder(a)
  const bFiles = filesUnder(b)
  const aSet = new Set(aFiles.map((file) => relative(a, file)))
  if (aFiles.length !== bFiles.length) return false
  for (const file of aFiles) {
    const rel = relative(a, file)
    const peer = join(b, rel)
    if (!existsSync(peer) || statSync(peer).isDirectory()) return false
    if (!sameFile(file, peer)) return false
  }
  for (const file of bFiles) {
    if (!aSet.has(relative(b, file))) return false
  }
  return true
}

/**
 * Sync every bundled Loop Engine asset group into the DSH home.
 * @param assetsRoot - package assets root (e.g. <pkg>/assets).
 * @param home - resolved DSH home directory.
 * @returns a SyncResult with per-group outcomes.
 */
export function syncAllAssets(assetsRoot, home) {
  const report = newSyncResult()
  syncGroup(join(assetsRoot, 'presets/loop-engine'), join(home, '.agent-presets/loop-engine'), { prefix: '' }, report, 'presets/loop-engine')
  syncGroup(join(assetsRoot, 'skills'), join(home, 'skills'), { prefix: 'loop-' }, report, 'skills/loop-engineering')
  return report
}
