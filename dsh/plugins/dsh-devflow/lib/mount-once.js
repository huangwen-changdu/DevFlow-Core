// @devflow-core/dsh-devflow — host single-instance guard.
// Adapted from @linxin666/dsh-liangshen/src/mount-once.ts (Apache-2.0).
// The registry rides a global symbol so two module instances of the same
// package (npm copy vs repository link) still share one verdict. This plugin
// uses its own symbol namespace (`dsh-devflow.mounted`) so it never collides
// with the dsh-web-ui family registry.

const MOUNTED = Symbol.for('dsh-devflow.mounted')

function mountedSet() {
  const registry = globalThis
  return (registry[MOUNTED] ??= new Set())
}

/**
 * Wrap a cordis plugin apply so the package runs at most once per process.
 * The first mount registers normally and unmarks when its fiber disposes;
 * any later mount of the same package name is a no-op.
 * @param packageName - npm package identity shared by every install source.
 * @param fn - the original plugin apply.
 * @returns an apply of the same shape.
 */
export function mountOnce(packageName, fn) {
  return (...args) => {
    const mounted = mountedSet()
    if (mounted.has(packageName)) return
    mounted.add(packageName)
    const ctx = args[0]
    ctx?.effect?.(() => () => {
      mounted.delete(packageName)
    })
    return fn(...args)
  }
}
