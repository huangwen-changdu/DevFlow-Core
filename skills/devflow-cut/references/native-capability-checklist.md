# Native Capability Checklist

Use this before adding a dependency, wrapper, generic helper, or custom framework layer. The goal is not code golf. The goal is fewer owned moving parts while keeping correctness, security, accessibility, and verification.

## Browser And HTML

| You think you need | Check first |
|---|---|
| Date picker | `<input type="date">` |
| Time picker | `<input type="time">` |
| Color picker | `<input type="color">` |
| Range slider | `<input type="range">` |
| Modal/dialog library | `<dialog>` and `showModal()` |
| Accordion/FAQ component | `<details><summary>...</summary>...</details>` |
| Searchable dropdown | `<input list>` and `<datalist>` |
| Progress/gauge | `<progress>` or `<meter>` |
| Tooltip | `title` for simple hints, CSS pseudo-elements for styled hints |
| Auto-growing textarea | `field-sizing: content` where supported |
| Sticky header | `position: sticky` |

## CSS

| You think you need JS for | Check first |
|---|---|
| Responsive layout | Grid/flex with `minmax`, `auto-fit`, `auto-fill` |
| Component-level responsive layout | Container queries |
| Dark mode | `prefers-color-scheme` |
| Reduced motion | `prefers-reduced-motion` |
| Sticky header | `position: sticky` |
| Text truncation | `text-overflow`, line clamp |
| Scroll carousel | Scroll snap |
| Theming | CSS custom properties |
| Aspect ratio boxes | `aspect-ratio` |
| Parent-state styling | `:has(...)` |
| Native CSS nesting | nested selectors |

## JavaScript And Browser APIs

| You think you need | Check first |
|---|---|
| Query-string parser | `URLSearchParams` |
| Deep clone | `structuredClone` |
| Currency/number formatting | `Intl.NumberFormat` |
| Date formatting | `Intl.DateTimeFormat` |
| Relative time | `Intl.RelativeTimeFormat` |
| Plural rules | `Intl.PluralRules` |
| UUID | `crypto.randomUUID()` |
| Clipboard helper | `navigator.clipboard` |
| Infinite scroll | `IntersectionObserver` |
| Resize listener | `ResizeObserver` |
| DOM mutation watcher | `MutationObserver` |
| Abort fetch on timeout | `AbortSignal.timeout()` |
| Simple event bus | `EventTarget` and `CustomEvent` |

## Node.js

| You think you need | Check first |
|---|---|
| `mkdirp` / `make-dir` | `fs.mkdirSync(path, { recursive: true })` |
| `rimraf` | `fs.rmSync(path, { recursive: true, force: true })` |
| `path-exists` | `fs.existsSync` |
| JSON file helpers | `fs.readFileSync` + `JSON.parse`, `fs.writeFileSync` + `JSON.stringify` |
| `object-assign` | `Object.assign` or spread |
| array unique | `new Set()` |
| array flatten | `Array.prototype.flat()` |
| stream check | `value instanceof stream.Readable` |
| path normalization | `path.normalize`, `path.posix`, or `path.win32` |

## Python

| You think you need | Check first |
|---|---|
| simple data records | `dataclasses.dataclass` |
| basic timezone support | `zoneinfo.ZoneInfo` |
| JSON | `json` |
| CLI parsing | `argparse` |
| caching | `functools.lru_cache` |
| path handling | `pathlib.Path` |
| basic iteration helpers | `itertools` |
| partial/reduce helpers | `functools.partial`, `functools.reduce` |
| dict merge | `dict_a | dict_b` on Python 3.9+ |

## Database

| App code temptation | Database primitive |
|---|---|
| Uniqueness checks | `UNIQUE` constraint |
| Referential integrity | `FOREIGN KEY` |
| Value ranges | `CHECK` constraint |
| Pagination | `LIMIT` / `OFFSET` or cursor query |
| Deduplication | `DISTINCT` / conflict handling |
| Running totals or ranking | Window functions |
| JSON query | Native JSON support |
| Full-text search basics | Built-in FTS / text indexes |
| Insert/update timestamps | column defaults and update triggers |

## Shell And Platform

| You think you need | Check first |
|---|---|
| custom file finder | `rg --files`, `find`, or platform search |
| custom process runner | package scripts or existing task runner |
| generated config loader | existing env/config conventions |
| new project metadata format | existing `package.json`, manifest, TOML, YAML, or platform manifest |

## Required Output

```text
Native Check：checked <layer>; native option <used/not enough>; reason <why>
```

If the native option is not enough, name the current limitation and the proof. Do not cite future flexibility as a reason.
