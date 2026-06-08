# TEST_SCENARIOS.md

> Manual test plan for `@umituz/web-design-system` v3.1.22
>
> This document is the authoritative test specification for QA. Each scenario describes a **manual test step** with **expected result** and **failure signal**. Run scenarios in order, by layer, and mark Pass/Fail.

---

## Table of Contents

1. [Setup & Environment](#1-setup--environment)
2. [Atoms](#2-atoms)
3. [Molecules](#3-molecules)
4. [Organisms](#4-organisms)
5. [Templates](#5-templates)
6. [Hooks](#6-hooks)
7. [Infrastructure: Security](#7-infrastructure-security)
8. [Infrastructure: Performance](#8-infrastructure-performance)
9. [Infrastructure: Error Handling](#9-infrastructure-error-handling)
10. [Cross-cutting: Accessibility](#10-cross-cutting-accessibility)
11. [Cross-cutting: Theming](#11-cross-cutting-theming)
12. [Cross-cutting: Responsiveness](#12-cross-cutting-responsiveness)

---

## 1. Setup & Environment

### 1.1 Tooling
- Node 18+
- React 18+ project
- Tailwind CSS configured with the design-system CSS variables (see README §"Tailwind CSS Integration")
- `lucide-react` installed

### 1.2 Verification
```bash
npm install @umituz/web-design-system
```
- [ ] No peer dependency warnings for React, react-dom, react-router-dom, lucide-react, tailwind-merge, clsx, class-variance-authority, @radix-ui/*

### 1.3 Smoke test
- [ ] Import each subpath in a tiny sandbox component and render `<div>OK</div>` from it. None must throw.

---

## 2. Atoms

### 2.1 Button

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| B-01 | Render `<Button>Click</Button>` | Solid primary button with "Click" label | — |
| B-02 | Render with each `variant`: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link` | Each variant visually distinct; no TS error | TS error about variant type |
| B-03 | Render with each `size`: `default`, `sm`, `lg`, `icon` | Size scales appropriately; `icon` is square | Square size not applied |
| B-04 | Click button; `onClick` fires | Click handler invoked once | Handler not called / called multiple times |
| B-05 | Disable with `disabled` | Button is non-interactive; opacity 50% | Still clickable |
| B-06 | `asChild` with `<a>` child | Renders as anchor with merged classes | Renders as button |
| B-07 | Tab to button; press Enter/Space | Activates on both keys | Space does not trigger |
| B-08 | Ref attached to the rendered element | `ref.current` is the underlying `<button>` | null / wrong type |

### 2.2 Input

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| I-01 | Render `<Input />` | Empty text input | — |
| I-02 | Type into input; value reflects | Controlled value updates | Not updating |
| I-03 | Set `error` | Red border (`border-destructive`) | Border not red |
| I-04 | `size="sm"`, `"md"`, `"lg"` | Heights scale: 8, 9, 10 | Heights wrong |
| I-05 | Focus the input | Visible focus ring (2px ring-ring) | No focus ring |
| I-06 | `disabled` | Reduced opacity, no pointer events | Still focusable/typable |
| I-07 | Pass arbitrary `aria-*` and `data-*` | Forwarded to native input | Lost props |

### 2.3 Text

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| T-01 | `<Text>Body</Text>` | Renders as `<p>` with body styles | — |
| T-02 | `<Text as="h1" size="4xl">` | Renders as `<h1>` with `text-4xl` | Wrong tag / class |
| T-03 | Each `variant`: body, heading, label, caption | Different font weight / color | Looks identical |
| T-04 | Each `size`: xs, sm, md, lg, xl, 2xl, 3xl, 4xl | Tailwind text-* classes apply | Class missing |
| T-05 | Each `weight`: normal, medium, semibold, bold | Tailwind font-* classes apply | Class missing |
| T-06 | Polymorphic `as` accepts any of `p, span, h1-h6, label` | TS accepts the literal; DOM renders that tag | TS error |

### 2.4 Icon

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| IC-01 | `<Icon size="md" />` | SVG, 20x20 | No SVG / wrong size |
| IC-02 | Each size: xs, sm, md, lg, xl, 2xl | Renders 12/16/20/24/32/40px | Off by one step |
| IC-03 | Pass `viewBox` | Overrides default `0 0 24 24` | Default used |
| IC-04 | Pass `className` | Concatenated with base classes | Override replaces base |
| IC-05 | Ref attached | ref.current is SVGSVGElement | Wrong element |

### 2.5 Spinner

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SP-01 | `<Spinner />` | Spinning circle with default size | Static element |
| SP-02 | Each size: sm, md, lg, xl | Visible size changes | Same size |
| SP-03 | `aria-label="Loading"` | Spinner announced to screen readers | Missing label |

### 2.6 Checkbox

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| CB-01 | Toggle `checked` | Visual state changes | No change |
| CB-02 | `onCheckedChange` fires with boolean | Boolean passed | String "true" |
| CB-03 | Disabled | Not toggleable | Still toggles |
| CB-04 | Sizes: sm, md, lg | 16/20/24px | Off |
| CB-05 | Keyboard: Space toggles | Toggles | Does not toggle |

### 2.7 Radio

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| R-01 | Pass `value`, `name`, `checked` | Native radio | — |
| R-02 | Disabled | Not selectable | Selectable |

### 2.8 Slider

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SL-01 | Drag slider | `onValueChange([n])` called with current | Wrong shape |
| SL-02 | `min`, `max`, `step` | Clamps value | Out of range |

### 2.9 Divider

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| D-01 | `<Divider />` | Horizontal 1px line | No line |
| D-02 | `orientation="vertical"` | Vertical 1px line | Horizontal |
| D-03 | `decorative` true | role=none, no aria | role=separator exposed |

### 2.10 Skeleton

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SK-01 | `<Skeleton />` | Pulsing rectangle | No animation |
| SK-02 | `variant="text"`, `"circular"`, `"rectangular"` | Each shape | Wrong shape |

### 2.11 Link

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| L-01 | Render `<Link href="...">` | Renders anchor with href | Renders as button |
| L-02 | Each `variant`: default, primary, muted | Different color | Identical |
| L-03 | Each `underline`: none, hover, always | underline styling | No change |

### 2.12 Tooltip

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| TT-01 | Hover trigger | Tooltip appears after delay | No tooltip |
| TT-02 | Move mouse out | Tooltip disappears | Persists |
| TT-03 | Each `placement`: top, bottom, left, right | Positioned correctly | Wrong position |
| TT-04 | Unmount during pending timeout | No setState on unmounted | Warning |

### 2.13 Progress

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| PR-01 | `<Progress value={50} />` | 50% width bar | Wrong width |
| PR-02 | `value` > `max` | Clamped to 100% | Overflows |
| PR-03 | `value` < 0 | Clamped to 0% | Negative width |

### 2.14 Label

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| LB-01 | Render with className | Shadcn-compatible styles apply | Missing styles |
| LB-02 | Disabled peer (e.g. disabled input sibling) | Reduced opacity | No change |

### 2.15 AspectRatio

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| AR-01 | `<AspectRatio ratio={16/9}>` | 16:9 box | Wrong aspect |
| AR-02 | `ratio={1}` | Square | Non-square |

### 2.16 Switch

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SW-01 | Click switch | Toggles state | No toggle |
| SW-02 | Sizes: default, sm, lg | Visual size change | Same size |
| SW-03 | `disabled` | Non-interactive | Still toggles |
| SW-04 | Keyboard: Space toggles | Toggles | Does not |

### 2.17 Separator

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SP-01 | Horizontal/Vertical | Renders separator | — |

### 2.18 Toggle

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| TG-01 | Click; `pressed` flips | State changes | No change |
| TG-02 | Variants: default, outline | Different borders | Same |
| TG-03 | Sizes: default, sm, lg | Visual scale change | Same |
| TG-04 | Disabled | Non-interactive | Toggles |

### 2.19 IconButton

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| IB-01 | `<IconButton icon={...} label="..." />` | Renders with aria-label | Missing label |
| IB-02 | Each `size`: xs, sm, md, lg | Visual scale | Same |
| IB-03 | Each `variant`: default, ghost, outline | Background differs | Identical |
| IB-04 | Click triggers onClick | Fires once | Fires multiple times |

### 2.20 Show / Hide

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SH-01 | `<Show above="lg">…</Show>` on desktop | Children render | Hidden |
| SH-02 | `<Show below="md">…</Show>` on mobile | Children render | Hidden |
| SH-03 | `<Hide above="lg">…</Hide>` on desktop | Hidden | Visible |
| SH-04 | Multiple props (above + below) | Both conditions ANDed | ORed |

### 2.21 Badge

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| BD-01 | Each `variant`: primary, secondary, success, warning, destructive | Color differs | Identical |
| BD-02 | Each `size`: sm, md, lg | Visual scale | Same |

---

## 3. Molecules

### 3.1 FormField

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| FF-01 | Provide `label` and `inputProps` | Label + input rendered, linked by id | Not linked |
| FF-02 | Provide `error` | Error message styled destructive, `aria-invalid="true"` | Not surfaced |
| FF-03 | Provide `helperText` (no error) | Helper text rendered | — |
| FF-04 | `required` | Asterisk in label | Missing asterisk |
| FF-05 | `id` auto-generated from inputProps.id or name | Generated | Missing |

### 3.2 SearchBox

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SB-01 | Type into search | `onChange(value)` fires | Not fired |
| SB-02 | Search icon visible at left | Icon present | Missing icon |
| SB-03 | Placeholder renders | Shown when empty | — |

### 3.3 Avatar

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| AV-01 | `<Avatar><AvatarImage src="..." /></Avatar>` | Round image | Square |
| AV-02 | `<AvatarFallback>AB</AvatarFallback>` | Shows initials when no image | Empty |
| AV-03 | Sizes: xs, sm, md, lg, xl, 2xl | Visual scale | Same |
| AV-04 | `<AvatarImage>` with broken src | Renders broken image (fallback handling is consumer's job) | — |

### 3.4 Chip

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| CH-01 | Click; `onClick` fires | Fires | Not fired |
| CH-02 | Click X; `onRemove` fires; does NOT bubble to onClick | onRemove only | Both fire |
| CH-03 | `removable=false` | No X button | X visible |
| CH-04 | `variant` colors | Apply color | Wrong color |

### 3.5 Toggle (Molecule)

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| TM-01 | Click; `onPressedChange(!pressed)` | Fires | No fire |
| TM-02 | Sizes: sm, md, lg | Visual scale | Same |
| TM-03 | Thumb translates when checked | Animation visible | No movement |
| TM-04 | Disabled | Non-interactive | Toggles |

### 3.6 Select

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SE-01 | Click trigger | Dropdown opens | No open |
| SE-02 | Select item | Value updates, onValueChange fires | Not fired |
| SE-03 | Keyboard: arrow keys navigate | Selection moves | No nav |
| SE-04 | Keyboard: Enter selects | Item selected | No select |
| SE-05 | Keyboard: Esc closes | Closes | Stays open |
| SE-06 | Disabled items | Not selectable | Selectable |
| SE-07 | `SelectGroup`, `SelectLabel`, `SelectSeparator` | Render correctly | Broken layout |

### 3.7 Textarea

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| TX-01 | Type | Controlled value | Not updating |
| TX-02 | `resize` options | Resize handle matches | Wrong handle |
| TX-03 | `error` | Red border | Not red |

### 3.8 RadioGroup

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| RG-01 | Click option | `onChange(value)` fires | No fire |
| RG-02 | `value` matches one option | That option is selected | None selected |
| RG-03 | Disabled option | Not selectable | Selectable |
| RG-04 | `orientation="horizontal"` | Lays out horizontally | Vertical |

### 3.9 CheckboxGroup

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| CG-01 | Toggle options | `onChange([...values])` | Wrong shape |
| CG-02 | Multiple selected | All selected items show | Only first |
| CG-03 | Disabled option | Not toggleable | Toggleable |

### 3.10 InputGroup

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| IG-01 | Provide `leftElement` | Renders on left | Right side |
| IG-02 | Provide `rightElement` | Renders on right | Left side |
| IG-03 | `GroupedInput` with both | Input has left/right padding | No padding |

### 3.11 ScrollArea

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SC-01 | Long content | Scrolls smoothly | No scroll |
| SC-02 | Scrollbar appears | Custom styled | Native scrollbar |

### 3.12 ListItem

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| LI-01 | Renders title + description | Both visible | Missing |
| LI-02 | `onClick` fires | Click triggers | No fire |
| LI-03 | `href` provided | Renders as anchor | Renders as div |
| LI-04 | `disabled` | Reduced opacity, no events | Active |
| LI-05 | `selected` | Highlighted style | Not highlighted |
| LI-06 | `size`: sm, md, lg | Padding/font scales | Same |

### 3.13 ActiveFilterTags

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| AF-01 | No category, no tags | Returns null | Empty box |
| AF-02 | Category selected | Pill shown with X | Missing |
| AF-03 | Click X on category | `onCategoryRemove` fires | No fire |
| AF-04 | Tags selected | Each renders | Missing |
| AF-05 | Click X on tag | `onTagRemove(tag)` fires | No fire |
| AF-06 | Click "Clear all" | `onClearAll` fires | No fire |

### 3.14 Breadcrumb

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| BR-01 | Render items | All items shown | Missing |
| BR-02 | Last item has `aria-current="page"` | Set | Missing |
| BR-03 | Items with `href` | Render as link (anchor) | Render as text |
| BR-04 | `showHomeIcon` | Home icon visible | Missing |
| BR-05 | Custom `separator` | Replaces default | Default used |
| BR-06 | Empty `items` and no home | No separators after home | Trailing separator |

### 3.15 CodeBlock

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| CB-01 | Render | Syntax-highlighted block | No highlight |
| CB-02 | Click Copy | Text copied to clipboard, button shows "Copied!" | Not copied |
| CB-03 | After 2s | Reverts to "Copy" | Stuck |
| CB-04 | Long code (lines > 10) | Truncated with "Show all N lines" | No collapse |
| CB-05 | Click expand | Expands, shows all | Not expanding |
| CB-06 | `filename` | Shown in header | Missing |
| CB-07 | `showLineNumbers` | Line numbers shown | Missing |

---

## 4. Organisms

### 4.1 Card

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| CA-01 | Render with subcomponents | All slots styled correctly | Broken |
| CA-02 | `variant`: default, outlined, elevated | Visual differs | Same |

### 4.2 Alert

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| AL-01 | `variant="default"` | Neutral | Wrong color |
| AL-02 | `variant="destructive"` | Red tones | Wrong color |
| AL-03 | Icon inside alert | Auto-positioned via `[&>svg]:absolute` | Layout broken |

### 4.3 Modal

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| MO-01 | `open=true` | Visible with backdrop | Hidden |
| MO-02 | `open=false` initially then true | Animates in | No animation |
| MO-03 | Click backdrop | `onClose` fires | No fire |
| MO-04 | Click X | `onClose` fires | No fire |
| MO-05 | Esc key | `onClose` fires (if consumer wires it) | — |
| MO-06 | `size` sm/md/lg/xl/full | Width scales | Same |
| MO-07 | Body scroll while open | Locked | Scrolls |
| MO-08 | Toggle open/close rapidly | No state warnings | "setState on unmounted" |

### 4.4 Navbar

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| NA-01 | `variant`: default, sticky, fixed | Positioning matches | Wrong |
| NA-02 | Subcomponents: Brand, Links, Actions | Layout as designed | Broken |

### 4.5 Table

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| TA-01 | Compose with Header, Body, Row, Head, Cell | Renders semantic table | Wrong structure |
| TA-02 | `<TableCell colSpan={2}>` | TypeScript accepts | TS error |
| TA-03 | `TableCaption` | Renders as `<caption>` | Wrong element |

### 4.6 Tabs

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| TB-01 | Click tab | `aria-selected="true"` on active | Wrong tab |
| TB-02 | Active content | Renders in tabpanel | Missing |
| TB-03 | Disabled tab | Not clickable | Clickable |
| TB-04 | `variant`: default, pills, underline | Visual differs | Same |
| TB-05 | Keyboard: arrow keys | Move focus between tabs | No movement |

### 4.7 Accordion

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| AC-01 | Click trigger | Expands panel | No expand |
| AC-02 | Click again | Collapses | Stuck open |
| AC-03 | Type/single/multiple | Behaves per Radix type | Wrong mode |

### 4.8 Dialog

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| DI-01 | Trigger open | Modal opens | No open |
| DI-02 | Close button | Closes | Stays |
| DI-03 | Esc | Closes | Stays |
| DI-04 | Click overlay | Closes | Stays |
| DI-05 | Body scroll while open | Locked | Scrolls |
| DI-06 | Focus trap | Focus stays inside | Escapes |

### 4.9 Sheet (drawer)

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SH-01 | Open from left/right/top/bottom | Slides in from correct edge | Wrong side |
| SH-02 | Close | Slides out | Stays |

### 4.10 EmptyState

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| ES-01 | Render with icon, title, description, action | All visible | Missing |

### 4.11 LoadingState

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| LS-01 | `variant="spinner"` | Shows Spinner | Missing |
| LS-02 | `variant="dots"` | Three bouncing dots | Wrong |
| LS-03 | `variant="skeleton"` | Skeleton lines | Missing |
| LS-04 | `message` | Message shown | Not shown |
| LS-05 | `centered` | Centered in container | Top-left |

### 4.12 DataTable

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| DT-01 | Define columns and rows | Renders table | Empty |
| DT-02 | Click sortable column header | Sorts | No sort |
| DT-03 | Empty data | Empty state shown | Crashes |
| DT-04 | Pagination | Page changes | No change |

### 4.13 StatCard / MetricCard

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SC-01 | Provide label, value, delta | Renders all | Missing |

### 4.14 FormModal

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| FM-01 | Open | Modal with form | Just modal |
| FM-02 | Submit | onSubmit fires with form data | No fire |

### 4.15 Grid

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| GR-01 | Render with cols prop | Columns apply | One column |
| GR-02 | GridItem span | Spans columns | No span |

### 4.16 ConfirmDialog

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| CD-01 | Open | Dialog with confirm/cancel | No dialog |
| CD-02 | Confirm | onConfirm fires | No fire |
| CD-03 | Cancel | onCancel fires | No fire |

### 4.17 Calendar

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| CL-01 | Pick date | onSelect fires with Date | Wrong type |
| CL-02 | Navigate months | Changes | No nav |
| CL-03 | Keyboard nav | Arrow keys | No nav |

### 4.18 FilterBar

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| FB-01 | Type search | `setSearchQuery` fires | No fire |
| FB-02 | Click Filters | Drawer toggles | No toggle |
| FB-03 | Change sort | `onSortChange` fires | No fire |
| FB-04 | Click category | `onCategoryChange` fires | No fire |
| FB-05 | Click tag | `onTagToggle(tag)` fires | No fire |
| FB-06 | Click "Clear All" | `onClearFilters` fires | No fire |
| FB-07 | Active filter count | Number badge shows correct count | Wrong count |

### 4.19 MainNavbar

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| MN-01 | Desktop view (`lg`+) | All controls visible inline | Stacked |
| MN-02 | Mobile view (`<lg`) | Mobile button visible, controls hidden | Both visible |
| MN-03 | Click mobile button | Mobile menu opens | No open |
| MN-04 | Click language button | Language menu opens | No open |
| MN-05 | Click outside language menu | Closes | Stays |
| MN-06 | Click theme toggle | `onThemeToggle` fires | No fire |
| MN-07 | Click language | `onLanguageChange(code)` fires | No fire |
| MN-08 | Active route (when using custom LinkComponent) | `aria-current="page"` | Missing |
| MN-09 | Esc on mobile open | Closes mobile menu | Stays |
| MN-10 | `githubUrl` provided | GitHub link rendered | Missing |
| MN-11 | Custom `translations` | Used in titles/labels | Defaults shown |

### 4.20 NewsletterSignup

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| NS-01 | Submit valid email | `onSubscribe` fires | No fire |
| NS-02 | Submit invalid email | Validation error | No validation |

### 4.21 Comments

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| CO-01 | Render with giscus config | Loads giscus | Doesn't load |

### 4.22 ToggleGroup

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| TG-01 | Click item | Selects | Not selected |
| TG-02 | Multiple mode | Multiple selected | Only one |

### 4.23 ImageLightbox

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| IL-01 | `isOpen=true` with images | Lightbox visible | Hidden |
| IL-02 | `isOpen=false` | Hidden | Visible |
| IL-03 | Empty images array | Returns null | Crashes |
| IL-04 | Click X | `onClose` fires | No fire |
| IL-05 | Click backdrop | `onClose` fires | No fire |
| IL-06 | Esc | `onClose` fires | No fire |
| IL-07 | ArrowLeft | Previous image | Wrong |
| IL-08 | ArrowRight | Next image | Wrong |
| IL-09 | `+` or `=` | Toggles zoom | No zoom |
| IL-10 | Body scroll while open | Locked | Scrolls |
| IL-11 | Click thumbnail | Jumps to that image | No jump |
| IL-12 | Single image | Navigation buttons hidden | Visible |
| IL-13 | Current image with `title` | Title shown | Missing |

---

## 5. Templates

### 5.1 Form

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| F-01 | Render children | Spaced vertically | Stacked |
| F-02 | `onSubmit` fires | Form submit handler | — |
| F-03 | `FormActions` | Right-aligned actions | Misaligned |

### 5.2 List

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| LI-01 | `variant`: default, bordered, spaced | Differ | Same |
| LI-02 | `ListItem` | Rendered inside `<ul>` | Outside |

### 5.3 Section

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SC-01 | `title` and `description` | Both rendered | Missing |
| SC-02 | Children rendered | Below header | Wrong order |

### 5.4 PageLayout

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| PL-01 | `maxWidth`: 4xl, 7xl, full | Different widths | Same |

### 5.5 PageHeader

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| PH-01 | `title` and `subtitle` | Rendered | Missing |
| PH-02 | `align`: left, center, right | Aligned | Wrong |
| PH-03 | `size`: small, medium, large | Different scales | Same |
| PH-04 | `actions` | Right/centered | Misaligned |

### 5.6 ProjectSkeleton

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| PS-01 | Render | Card-shaped skeleton with pulsing placeholders | Static |

### 5.7 ResponsiveContainer

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| RC-01 | On mobile | `mobileMaxWidth` applied | desktopMaxWidth applied |
| RC-02 | On tablet | `tabletMaxWidth` | mobile |
| RC-03 | On desktop | `desktopMaxWidth` | tablet |
| RC-04 | `gradient` | Gradient background | None |
| RC-05 | `minHeight`: auto, screen, full | Matching class | Wrong |

---

## 6. Hooks

### 6.1 useTheme

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HT-01 | First mount | Reads from localStorage; default `system` | Wrong default |
| HT-02 | `toggleTheme` | light → dark → system → light | Skips values |
| HT-03 | `setTheme("dark")` | Applies `dark` class to html | No class |
| HT-04 | `system` + OS dark mode | `effectiveTheme === "dark"` | Wrong effective |
| HT-05 | System preference change (in `system`) | Updates `effectiveTheme` | Stuck |
| HT-06 | SSR (`window === undefined`) | No crash | Crash |

### 6.2 useMediaQuery

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HM-01 | Resize past `md` (768) | `useMediaQuery('md')` flips to true | Doesn't flip |
| HM-02 | SSR | Returns `false` | Crash |

### 6.3 useBreakpoint

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HB-01 | On mobile (375px) | `currentBreakpoint === 'xs'` | Wrong |
| HB-02 | Resize across breakpoints | Updates | Stale |
| HB-03 | `matches('lg')` | Boolean | Wrong |
| HB-04 | `isGreaterThan('md')` | True on lg+ | Wrong |
| HB-05 | `isLessThan('md')` | True on sm/xs | Wrong |

### 6.4 useLocalStorage

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HL-01 | Initial mount with `initialValue` | Returns `initialValue` when no key | Stored value |
| HL-02 | `setValue(newValue)` | Persists, updates state | No persist |
| HL-03 | Functional update | Applies | Wrong |
| HL-04 | `removeValue` | Removes key, resets to initial | No reset |
| HL-05 | localStorage throws (e.g. quota) | Logs error, doesn't crash | Crash |
| HL-06 | SSR | Returns `initialValue` | Crash |

### 6.5 useClickOutside

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HC-01 | Click inside ref | Callback NOT called | Called |
| HC-02 | Click outside ref | Callback called | Not called |
| HC-03 | Touch event | Works | Doesn't |
| HC-04 | `enabled=false` | Listener detached | Still active |
| HC-05 | Unmount | Listener removed | Leak |

### 6.6 useKeyboard / useEscape

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HK-01 | Press configured key | Callback fires | No fire |
| HK-02 | `useEscape` on Esc | Callback fires | No fire |
| HK-03 | With modifiers (Ctrl+S) | Fires only with modifiers | Fires without |
| HK-04 | `enabled=false` | Detached | Still attached |

### 6.7 useDebounce

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HD-01 | Change value rapidly | Returns debounced value after delay | Updates each time |
| HD-02 | Unmount during timeout | No leak | Leak |
| HD-03 | `useThrottle` | Throttled | Not throttled |

### 6.8 useClipboard

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HC-01 | `copy("text")` | Value set, copied=true | No |
| HC-02 | After 2s | copied=false | Stuck |
| HC-03 | Unmount during 2s window | Timer cleared | setState on unmounted |
| HC-04 | Clipboard API unavailable | Returns false, no crash | Crash |

### 6.9 useToggle

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HT-01 | Toggle | Flips | Stale |
| HT-02 | `setValue(true)` | Sets | Stale |

### 6.10 useScrollLock

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HS-01 | `enabled=true` | body overflow hidden | Scrolls |
| HS-02 | `enabled=false` | body overflow restored | Stuck |
| HS-03 | Toggling | Layout doesn't shift | Shift |

### 6.11 useLanguage

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HL-01 | Mount | Returns current language from i18n | Wrong |
| HL-02 | `changeLanguage(code)` | i18n switches | No switch |
| HL-03 | Invalid code | Falls back to default | Crash |

### 6.12 useIntersectionObserver

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HI-01 | Element enters viewport | `isIntersecting=true` | Stale |
| HI-02 | Once intersected, leaves | `hasIntersected` stays true | Resets |
| HI-03 | Unmount | Observer disconnected | Leak |

### 6.13 useLazyImage

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HLI-01 | Scroll into view, image loads | `isLoaded=true`, `imageSrc=src` | Stuck on placeholder |
| HLI-02 | Image 404 | `isError=true` | No error signal |
| HLI-03 | Empty `src` | No load attempt | Loads empty |

### 6.14 useVirtualList

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HVL-01 | Initial render | `visibleItems` includes only visible | All items |
| HVL-02 | Scroll | `visibleItems` updates | Stale |
| HVL-03 | `totalHeight` | `items.length * itemHeight` | Wrong |

### 6.15 useResourcePreloader

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HRP-01 | `preloadImage(src)` | Loads image | Fails silently |
| HRP-02 | `isPreloaded(src)` after success | True | False |
| HRP-03 | Concurrent loads of same src | Single load | Duplicate |

### 6.16 useLazyComponent

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HLC-01 | Component enters viewport | `importFunc` called | Not called |
| HLC-02 | Render `LazyComponent` after load | Renders loaded component | Renders fallback |
| HLC-03 | Load fails | Renders fallback, `error` set | Crash |

### 6.17 useProgressiveEnhancement

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HPE-01 | Online → offline event | `isOnline=false` | Stale |
| HPE-02 | 4G connection | `connectionType='fast'` | Wrong |
| HPE-03 | 2G connection | `connectionType='slow'` | Wrong |
| HPE-04 | `shouldLoadHeavyContent` | False when offline/slow | True |

### 6.18 useLazyLoading

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HLL-01 | Toggle `enablePreloading=false` | `preloadImage` is undefined | Function ref |

### 6.19 usePerformanceMonitor

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HPM-01 | Mount | `metrics.renderTime > 0` after first effect | 0 |
| HPM-02 | `onMetricsUpdate` | Called with metrics | Not called |
| HPM-03 | Re-render | `updateCount` increments | Stuck |
| HPM-04 | `resetMetrics` | Resets to 0 | Stale |
| HPM-05 | `getPerformanceReport` | Includes grade A/B/C/D | Missing grade |

### 6.20 useMemoryOptimization

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HMO-01 | `addEventListener` | Listener tracked | Not tracked |
| HMO-02 | Unmount | All listeners/timers/subscriptions cleaned | Leak |
| HMO-03 | `getMemoryStats` | Returns counts | Wrong |
| HMO-04 | `cleanup` | Forces cleanup | Stuck |

### 6.21 useMemoryLeakDetector

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| HML-01 | Mount | `renderCount` increments | Doesn't |
| HML-02 | Unmount | Final lifespan logged | No log |
| HML-03 | 100+ renders | Warning logged | No warning |

---

## 7. Infrastructure: Security

### 7.1 `validateInput`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SI-01 | Empty string, `minLength=1` | `{isValid:false, error:"This field is required"}` | Wrong error |
| SI-02 | 1001 chars with `maxLength=1000` | Rejects | Accepts |
| SI-03 | Plain text with HTML | Rejects "HTML tags or scripts are not allowed" | Accepts |
| SI-04 | `<script>alert(1)</script>` | Rejects | Accepts |
| SI-05 | `javascript:` URL | Rejects | Accepts |
| SI-06 | `on\w+=` event handler | Rejects | Accepts |
| SI-07 | HTML-allowed config | Accepts HTML | Rejects |

### 7.2 `validateEmail`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SE-01 | `user@example.com` | Valid | Invalid |
| SE-02 | `not-an-email` | Invalid | Valid |
| SE-03 | `user@<script>` | Invalid (HTML check) | Valid |
| SE-04 | Empty | Invalid | Valid |

### 7.3 `validateUrl`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SU-01 | `https://example.com` | Valid | Invalid |
| SU-02 | `ftp://server` | Valid | Invalid |
| SU-03 | `javascript:alert(1)` | Invalid | Valid |
| SU-04 | `not a url` | Invalid | Valid |

### 7.4 `validateFileName`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SF-01 | `..\/etc\/passwd` | Invalid (traversal) | Valid |
| SF-02 | `file|name.txt` | Invalid (illegal char) | Valid |
| SF-03 | `CON.txt` (Windows reserved) | Invalid | Valid |
| SF-04 | `.hidden` | Invalid (hidden) | Valid |
| SF-05 | 256 chars | Invalid (too long) | Valid |
| SF-06 | `valid-file_name.txt` | Valid | Invalid |

### 7.5 `sanitizeInput`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SS-01 | `<script>alert(1)</script>` | Strips tags | Unchanged |
| SS-02 | `javascript:` | Removes | Preserved |
| SS-03 | 2000+ chars | Truncates to limit | Unchanged |
| SS-04 | `allowHtml=true` | Preserves content | Strips |

### 7.6 `validateCSPCompliance`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SC-01 | Plain text | Valid | Invalid |
| SC-02 | `<script>` | Invalid | Valid |
| SC-03 | `<style>` | Invalid (style block) | Valid |

### 7.7 `useFormValidation`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SFV-01 | `updateField("email", "bad")` | Sets error from rule | No error |
| SFV-02 | `validateAllFields` | Returns boolean, sets all errors | Skips |
| SFV-03 | `getFieldProps("name")` | Returns bound props | Stale |
| SFV-04 | `resetForm` | Resets data, errors, touched | Partial |
| SFV-05 | `isFormValid` (memo) | True when no errors | Stale |
| SFV-06 | `touchedFields` (memo) | Only touched field names | All fields |

---

## 8. Infrastructure: Performance

### 8.1 `performanceUtils.measureRender`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| PM-01 | Slow render (>16ms) in DEV | Console warning | Silent |
| PM-02 | Fast render in DEV | No warning | False warning |
| PM-03 | In PROD | No warnings | Warnings leak |

### 8.2 `performanceUtils.measureAsync`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| PA-01 | Resolves | Returns result, logs in DEV | Throws |
| PA-02 | Rejects | Logs error, rethrows | Swallows |

### 8.3 `performanceUtils.getMetrics`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| PG-01 | Chrome | Memory info | Null |
| PG-02 | Firefox | Null | Crash |

---

## 9. Infrastructure: Error Handling

### 9.1 `ErrorBoundary`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| EB-01 | Children throw | Fallback rendered | App crash |
| EB-02 | `level="page"` | Page-style fallback | Component style |
| EB-03 | `level="feature"` | Feature-style | Wrong |
| EB-04 | `level="component"` | Component style | Wrong |
| EB-05 | `fallback` prop | Custom fallback used | Default shown |
| EB-06 | `showDetails={true}` in DEV | Stack shown | Hidden |
| EB-07 | `showDetails={true}` in PROD | Stack hidden | Leaks |
| EB-08 | Click "Try Again" | Resets state, retries | Stuck |
| EB-09 | Click "Refresh Page" | Reloads | Doesn't |
| EB-10 | Click "Go Home" (page level) | Navigates to `/` | Nothing |
| EB-11 | `onError` callback | Fired with error, errorInfo | Not fired |
| EB-12 | `errorId` displayed | Last 8 chars of id | Wrong |

### 9.2 `ErrorDisplay`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| ED-01 | `variant="minimal"` | Inline text + icon | Card |
| ED-02 | `variant="inline"` | Inline box | Card |
| ED-03 | `variant="card"` | Card-style | Inline |
| ED-04 | `variant="default"` | Modal-like | Card |
| ED-05 | `severity="error"` | Red, AlertCircle | Wrong |
| ED-06 | `severity="warning"` | Orange, AlertTriangle | Wrong |
| ED-07 | `severity="info"` | Blue, Info | Wrong |
| ED-08 | `showDetails` + stack in DEV | Stack visible | Hidden |
| ED-09 | Click "Retry" with `onRetry` | Fires | Not fired |
| ED-10 | `error` is `Error` instance | Uses `.message` | Raw object |
| ED-11 | `errorId` | Last 8 chars shown | Full id |
| ED-12 | Specialized: `NetworkError`, `NotFoundError`, `PermissionError`, `ApiError` | Pre-configured | Generic |

### 9.3 `SuspenseWrapper`

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| SS-01 | Children suspend | Default loading shown | Stuck |
| SS-02 | `fallback` prop | Custom used | Default |
| SS-03 | `variant="default"`, `"minimal"`, `"card"` | Spinner sizes differ | Same |
| SS-04 | `showErrorBoundary=false` | No boundary | Boundary catches |
| SS-05 | Error in children | ErrorBoundary fallback | Stuck on spinner |
| SS-06 | `errorBoundaryLevel="page"` | Page-style error | Component style |
| SS-07 | `PageSuspense`, `ComponentSuspense`, `FeatureSuspense`, `InlineSuspense` | Pre-configured | Generic |

---

## 10. Cross-cutting: Accessibility

For each interactive component:

- [ ] Tab order is logical
- [ ] Focus is visible (focus-visible ring)
- [ ] ARIA roles are correct (`button`, `dialog`, `tab`, `tabpanel`, `menu`, `menuitem`, `radiogroup`, `radio`, `switch`)
- [ ] `aria-label` or visible label is provided for icon-only buttons
- [ ] Esc closes overlays (Modal, Dialog, Sheet, Popover, HoverCard, Lightbox, MainNavbar mobile menu)
- [ ] Disabled state has `disabled` attribute AND `aria-disabled` if applicable
- [ ] `aria-invalid="true"` on form fields with errors
- [ ] `aria-describedby` links errors/helpers to inputs
- [ ] Color contrast meets WCAG AA (consumer's responsibility via tokens)

---

## 11. Cross-cutting: Theming

| # | Action | Expected | Failure Signal |
|---|--------|----------|----------------|
| TH-01 | Toggle dark mode (`useTheme` → `setTheme('dark')`) | `html.dark` class added | Missing |
| TH-02 | Component re-renders in dark mode | Colors update | Stale |
| TH-03 | All semantic tokens present (`--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--success`, `--warning`, `--info`, `--border`, `--input`, `--ring`, `--background`, `--foreground`, `--card`, `--popover`) | All defined | Missing tokens |
| TH-04 | Both light and dark variants | Both work | Only one |

---

## 12. Cross-cutting: Responsiveness

Test viewport sizes: 375 (mobile), 768 (tablet), 1280 (desktop).

| # | Component | 375 | 768 | 1280 |
|---|-----------|-----|-----|------|
| RE-01 | MainNavbar | Mobile menu button | Mobile menu button | Full nav |
| RE-02 | Tabs | Scrollable if needed | All visible | All visible |
| RE-03 | FilterBar | Visible | Hidden | Hidden (FilterSidebar instead) |
| RE-04 | FilterSidebar | Hidden | Hidden | Visible |
| RE-05 | ResponsiveContainer | mobileMaxWidth | tabletMaxWidth | desktopMaxWidth |
| RE-06 | Modal | Full width | Centered, sized | Centered, sized |
| RE-07 | Show/Hide | Per `above`/`below`/`at` | Same | Same |

---

## Pass/Fail Summary Template

After running all scenarios, summarize:

```
Total scenarios: ___
Pass: ___
Fail: ___
Blocked: ___

Critical failures (must fix before release):
- [ ]

Notes:
- [ ]
```

---

## Appendix A: Known Limitations

- `useFormValidation` uses sync validation only; for async validation, wrap in a custom hook.
- `CodeBlock` requires `react-syntax-highlighter` as a peer dependency in `devDependencies` only — it must be added to the consumer's `package.json` if not already present.
- The `Icon` atom is a generic SVG wrapper; consumers should prefer `lucide-react` directly for named icons.

## Appendix B: Test Run Checklist

Before publishing a new minor/patch version:

- [ ] All atom scenarios pass
- [ ] All molecule scenarios pass
- [ ] All organism scenarios pass
- [ ] All template scenarios pass
- [ ] All hook scenarios pass
- [ ] All security scenarios pass
- [ ] All performance scenarios pass
- [ ] All error-handling scenarios pass
- [ ] Accessibility checklist clean
- [ ] Theming checklist clean
- [ ] Responsiveness matrix clean
- [ ] `tsc --noEmit` passes
- [ ] No console warnings during smoke test
