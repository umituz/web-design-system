# @umituz/web-design-system

Atomic Design component library for React: atoms, molecules, overlay/data
organisms, templates and hooks. **Authored in Tailwind v4, shipped as both
source and a precompiled stylesheet** — it works in any React host, with or
without Tailwind.

The package is **source-distributed** (raw TypeScript in `src/`); your
bundler compiles the components. Styling is available two ways:

- `@umituz/web-design-system/styles.css` — precompiled (`dist/styles.css`),
  Tailwind included. For vanilla-CSS hosts.
- `@umituz/web-design-system/bridge.css` — the semantic palette bridge: maps
  the `--color-*` contract onto the host's `--app-*` tokens. For vanilla-CSS
  hosts that theme via their own token names (see below).
- `@umituz/web-design-system/theme.css` — the `@theme` layer alone. For
  Tailwind v4 hosts that compile the component classes themselves.

**Never use both** — a Tailwind host that adds the package source to its own
`@source` scan must not also import the precompiled stylesheet (duplicate
rules).

## Installation

```bash
npm install @umituz/web-design-system
```

`clsx`, `class-variance-authority` and `tailwind-merge` are real runtime
dependencies (installed automatically). Peers: `react`, `react-dom`,
`lucide-react`, `react-syntax-highlighter` (CodeBlock only) and the 14
Radix primitives actually imported (dialog, dropdown-menu, select, …).

### Vanilla host (no Tailwind)

```tsx
// main.tsx — one import, includes preflight
import '@umituz/web-design-system/styles.css';
import { Button } from '@umituz/web-design-system/atoms';

<Button>Save</Button>
```

Restyle by overriding the CSS variables — no rebuild needed:

```css
:root {
  --color-primary: #2e8b5f;        /* brand color, e.g. herb green */
  --color-primary-foreground: #ffffff;
  --color-ring: rgba(46, 139, 95, 0.45);
}
```

Dark mode: add `data-theme="dark"` or `class="dark"` on any ancestor
(typically `<html>`). The package never switches themes on its own.

Hosts with their own token vocabulary (`--app-*`) use the bridge instead of
overriding `--color-*` one by one:

```css
/* app tokens css — imports in this order */
@import "@umituz/web-design-system/styles.css";
@import "@umituz/web-design-system/bridge.css";

:root {
  --app-background: #fdfcf9;      /* paper */
  --app-foreground: #1c1917;      /* ink  */
  --app-primary: #2e8b5f;         /* brand */
  --app-primary-foreground: #ffffff;
  /* … the 19 required slots (missing slots break loudly). Optional:
     --app-success / --app-warning / --app-info (+ -foreground),
     --app-primary-soft, --app-font-sans fall back to DS defaults. */
}
[data-theme="dark"] {
  --app-background: #0c0a09;      /* re-define per theme */
}
```

`--radius-*` and `--font-mono` are deliberately not in the bridge — re-declare
them unlayered in the host css to override (name-collision doctrine).

### Tailwind v4 host

Compile the component classes as part of your own build — then utilities
you pass via `className` merge naturally with the package's:

```css
/* app.css */
@import "tailwindcss";
@import "@umituz/web-design-system/source.css";
```

`source.css` imports the `@theme` token layer and scans the package's
component sources for classes; the `@source` directive inside it resolves
relative to the package, so hosts never write `node_modules` paths (the
old relative-`@source` recipe broke silently twice in the fleet — a wrong
depth compiled zero classes).

You control the palette the same way (override `--color-*` in your theme),
and your `@theme` extensions apply everywhere.

## Theming

Every component binds to semantic variables defined in `src/styles/theme.css`:

| Variable | Light default | Purpose |
| --- | --- | --- |
| `--color-background` / `--color-foreground` | `#f8fafc` / `#0f172a` | app surface & text |
| `--color-card` / `--color-popover` (+ `-foreground`) | `#ffffff` | elevated surfaces |
| `--color-primary` / `--color-primary-foreground` | `#2563eb` / `#fff` | brand actions |
| `--color-secondary` / `--color-secondary-foreground` | `#8b5cf6` / `#fff` | secondary actions |
| `--color-muted` / `--color-muted-foreground` | `#f1f5f9` / `#64748b` | quiet surfaces & text |
| `--color-accent` / `--color-accent-foreground` | `#f1f5f9` / `#0f172a` | hover accents |
| `--color-destructive` / `--color-destructive-foreground` | `#dc2626` / `#fff` | danger actions |
| `--color-success` / `--color-warning` / `--color-info` | `#16a34a` / `#d97706` / `#2563eb` | status (Badge variants) |
| `--color-border` / `--color-input` | `#e2e8f0` | borders & inputs |
| `--color-ring` | `rgba(37,99,235,.45)` | focus rings |
| `--radius-sm` / `--radius-md` / `--radius-lg` / `--radius-xl` | 6/8/12/16px | radii scale |
| `--shadow-sm` / `--shadow-md` / `--shadow-lg` | dashboard scale | elevation |
| `--font-sans` / `--font-mono` | system stacks | typography |

The defaults mirror `@umituz/web-dashboard`'s tokens, so dashboard adoption
is visually regression-free. A brand override (e.g. foodora's herb green)
is three variables:

```css
:root {
  --color-primary: #2e8b5f;
  --color-primary-foreground: #ffffff;
  --color-info: #2e8b5f;
}
.dark {
  --color-primary: #3aa76d;
}
```

## Entry points

```bash
@umituz/web-design-system/styles.css   # precompiled stylesheet (vanilla hosts)
@umituz/web-design-system/source.css    # theme + @source scan (Tailwind v4 hosts)
@umituz/web-design-system/theme.css     # @theme layer alone
@umituz/web-design-system/bridge.css    # --color-* → --app-* palette bridge
@umituz/web-design-system/atoms         # Button, Input, Badge, Spinner, …
@umituz/web-design-system/molecules     # FormField, Select, Avatar, …
@umituz/web-design-system/organisms     # Card, Dialog, Sheet, Table, DataTable, ToastProvider, KeyValueList, …
@umituz/web-design-system/templates     # page-level layouts
@umituz/web-design-system/hooks         # useMediaQuery, useDebounce, useTheme, …
@umituz/web-design-system/utils         # cn, responsive helpers, clamp/pagination math
@umituz/web-design-system/utils/cn      # cn alone
@umituz/web-design-system/constants     # size/type maps
@umituz/web-design-system/tokens        # RESPONSIVE_* scale maps
@umituz/web-design-system/types         # shared type contracts
```

Subpath imports are recommended; the root barrel exists but pulls
everything.

## What changed in v4 (major)

- **Authored in Tailwind v4, precompiled CSS shipped.** v3 required the
  host to run Tailwind with matching config; v4 compiles itself and binds
  semantic classes to `--color-*` variables (`dist/styles.css` is a
  published artifact with contract tests).
- **Dead towers removed**: `infrastructure/security`, `performance`,
  `calculation`, `error` (~2.5k lines, zero consumers). The four live
  calculation helpers live in `utils` (`clampToRange`, `percentOfMax`,
  `formatTrendMagnitude`, `computePageBounds`).
- **App-specific organisms removed**: Navbar, MainNavbar, Footer,
  NewsletterSignup, Comments, ImageLightbox, Calendar, FilterBar,
  FilterSidebar, QuickActionCard, Grid, Modal, FormModal, ConfirmDialog,
  AlertDialog (use Dialog), Breadcrumb molecule (organism stays).
- **JS theme tokens removed** — theming is CSS-native now
  (`src/styles/theme.css`). The `./tokens` subpath keeps the
  `RESPONSIVE_*` scale maps only.
- **`useLanguage` removed** — i18n runtime belongs to the host (same
  principle as dashboard v4). `react-i18next` is no longer a peer.
- **Peer list tightened to real imports** (14 Radix primitives;
  `react-day-picker`, `react-alert-dialog`, `react-tabs`,
  `react-tooltip` dropped). `clsx`/`class-variance-authority`/
  `tailwind-merge` moved from peers to dependencies.
- **Package ships tests** (contract + unit + smoke) and a `build` step;
  `prepublishOnly` runs the full gate.

## Platform compatibility

React 18 and 19. Rendering targets the DOM; React Native is not supported.

## Development

```bash
npm install
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run build       # tailwindcss → dist/styles.css (minified)
npm test            # build + vitest (contract, unit, smoke)
```

Component classes must stay literal in the source: `@source` scans
`src/`, so classes passed in from outside (props) are not compiled into
the precompiled stylesheet.

## License

MIT
