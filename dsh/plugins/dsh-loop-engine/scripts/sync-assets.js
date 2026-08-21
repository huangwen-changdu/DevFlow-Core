// @devflow-core/dsh-loop-engine — asset sync helper (maintainer tool).
// Copies the Loop Engine assets from the repository root into this package's
// self-contained assets/ tree so the npm tarball carries the current
// preset/skills. MUST be re-run before every publish; otherwise the packaged
// assets drift from the repo sources.
//
// Intentional simplification: sync only copies — it never prunes files under
// assets/. A removed source file stays in the tarball until manually deleted,
// which keeps the tool safe against accidental loss of a packaged file.
// devflow: no prune, revisit when a source asset is removed and stale copies
// are observed in the tarball.

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, utimesSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// Repository root = ../../../.. relative to this file (dsh/plugins/dsh-loop-engine/scripts/).
const root = fileURLToPath(new URL('../../../..', import.meta.url))
const outDir = fileURLToPath(new URL('../assets/', import.meta.url))

/** One copy group: source dir under the repo root, dest dir under assets/. */
const groups = [
  { src: 'dsh/agent-presets', dst: 'presets', pick: (name) => name === 'loop-engine' },
  { src: 'skills', dst: 'skills', pick: (name) => name === 'loop-engineering' },
]

function copyTree(sourceDir, targetDir) {
  mkdirSync(targetDir, { recursive: true })
  for (const entry of readdirSync(sourceDir)) {
    const source = join(sourceDir, entry)
    const target = join(targetDir, entry)
    const stat = statSync(source)
    if (stat.isDirectory()) {
      copyTree(source, target)
    } else {
      copyFileSync(source, target)
      utimesSync(target, stat.atime, stat.mtime)
    }
  }
}

function copyEntry(source, target) {
  const stat = statSync(source)
  if (stat.isDirectory()) {
    copyTree(source, target)
  } else {
    // File target: create only the parent dir; mkdirSync on the file path
    // itself would turn the target into a directory and copyFileSync fails.
    mkdirSync(target.replace(/[^/\\]*$/, ''), { recursive: true })
    copyFileSync(source, target)
    utimesSync(target, stat.atime, stat.mtime)
  }
}

function syncGroup({ src, dst, pick }) {
  const sourceRoot = join(root, src)
  if (!existsSync(sourceRoot)) throw new Error(`Missing source dir: ${src}`)
  const targetRoot = join(outDir, dst)
  mkdirSync(targetRoot, { recursive: true })
  let count = 0
  for (const entry of readdirSync(sourceRoot)) {
    if (pick && !pick(entry)) continue
    copyEntry(join(sourceRoot, entry), join(targetRoot, entry))
    count += 1
  }
  return count
}

for (const group of groups) {
  const count = syncGroup(group)
  console.log(`synced ${count} entries: ${group.src} -> assets/${group.dst}`)
}
console.log(`Loop Engine DSH plugin assets synced into ${relative(root, outDir)}`)
