// @devflow-core/dsh-client-quick-cmds — Host half (minimal).
// The browser half ships via exports["./client"], discovered through the
// package.json dsh.client declaration. The host half exists only so the
// package is a loadable cordis row; it contributes nothing itself.
const inject = [];

function apply() {
  // nothing host-side: this is a pure browser-surface plugin
}

export { apply, inject };
