# DevFlow Checkers

These scripts are optional command-line helpers; the Codex plugin manifest discovers
skills, not arbitrary executables. Invoke them with Node.js from a project directory
and pass paths relative to that project.

| Script | Purpose |
|---|---|
| `devflow-spec.js` | Validate saved Spec structure |
| `devflow-plan.js` | Validate executable Plan Pack structure |
| `devflow-review.js` | Check required Cut/review gates |
| `devflow-debt.js` | Harvest intentional debt markers |
| `devflow-audit.js` | Scan overengineering candidates |
| `verify-plugin.js` | Check manifest, skill count, and checker self-tests |

All scripts use Node.js built-ins only. Treat audit/debt/review output as evidence or
candidates; the owning DevFlow skill makes the final judgment.

From the plugin root, run `node scripts/verify-plugin.js` as a local smoke test before
sharing an archive or marketplace source.
