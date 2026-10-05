---
name: Zero Gluten
description: A colorful dark/purple app shell with a collapsible left-pane nav, wrapping white, left-striped kitchen content for a gluten-free family's 2-week meal rotation.
colors:
  utility-bar-bg: "#120f1c"
  header-bar-bg: "#241a3f"
  nav-link-default: "#b9aed6"
  nav-link-active: "#ffffff"
  blob-violet: "#5b21b6"
  blob-magenta: "#9333ea"
  blob-indigo: "#312e81"
  backdrop-base: "#1b1430"
  off-card-text: "#e3dcf2"
  off-card-text-muted: "#cdbfe8"
  off-card-accent-green: "#9fd9b9"
  rozmaring-80: "#2d7652"
  gluten-risk-bg: "#fbe0cc"
  gluten-risk-text: "#8a3b00"
  breakfast-bg: "#fbefd9"
  breakfast-text: "#8a6416"
  breakfast-strip: "#d9a33e"
  lunch-bg: "#e1f1ef"
  lunch-text: "#1f5a54"
  lunch-strip: "#2f8c82"
  dinner-bg: "#f1e7f1"
  dinner-text: "#5c3a5e"
  dinner-strip: "#8b5a8c"
  neutral-background-1: "#ffffff"
  neutral-stroke: "#e0e0e0"
  neutral-text-secondary: "#616161"
typography:
  status:
    fontFamily: "Segoe UI, system-ui, sans-serif (Fluent webLightTheme default — no self-hosted font)"
    fontSize: "20px"
    fontWeight: 600
  title:
    fontFamily: "Segoe UI, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
  body:
    fontFamily: "Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  caption:
    fontFamily: "Segoe UI, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  chipLabel:
    fontFamily: "Segoe UI, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
rounded:
  medium: "4px"
  xlarge: "8px"
  pill: "10000px"
spacing:
  xs: "0.3rem"
  sm: "0.5rem"
  md: "0.9rem"
  lg: "1.25rem"
  xl: "1.5rem"
components:
  badge-gluten:
    backgroundColor: "{colors.gluten-risk-bg}"
    textColor: "{colors.gluten-risk-text}"
    rounded: "{rounded.pill}"
    padding: "0.15rem 0.6rem"
  card:
    rounded: "{rounded.xlarge}"
    padding: "0.9rem 1rem 1.1rem"
  button-primary:
    backgroundColor: "{colors.rozmaring-80}"
    textColor: "#ffffff"
    rounded: "{rounded.medium}"
  button-destructive-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-text-secondary}"
    rounded: "{rounded.pill}"
  nav-pane:
    backgroundColor: "{colors.header-bar-bg}"
    width: "320px"
  nav-item:
    textColor: "{colors.nav-link-default}"
    rounded: "{rounded.medium}"
    height: "44px"
  nav-item-active:
    textColor: "{colors.nav-link-active}"
    backgroundColor: "rgba(255, 255, 255, 0.1)"
---

# Design System: Zero Gluten

## Overview

**Creative North Star: "The Violet Shift"**

Zero Gluten runs inside a dark navy/indigo chrome over a purple gradient backdrop — a register
borrowed, user-pinned, from an unrelated enterprise dashboard reference. The product itself hasn't
changed across either shell pass: it's still a plain-spoken kitchen companion, read one-handed,
sometimes in a dim kitchen or a shop. Every real task — ingredient lists, shopping checkboxes, the
cook-today answer — still lives on the same white, elevated cards this system built before any of
the dark chrome existed; only the chrome and the page background around those cards went dark and
colorful. Meal-type color lives as a left-edge stripe on card-grid pages, a deliberate reversal of
an earlier top-strip rule (see Named Rules below).

This pass rebuilt the chrome itself: the nav moved from a two-tier top bar (a slim brand strip over
a link row) to a collapsible left pane, built on Fluent 2's own `NavDrawer` primitives rather than
hand-rolled links. The visual identity carries over unchanged — same hex, same two-tier brand/link
split, just rotated from horizontal to vertical — but the nav is now a distinct, Fluent-native
component: real keyboard navigation, a native selected-state treatment, and a built-in responsive
collapse to an overlay on narrow viewports, none of which the old `<nav>` of plain links had.

This is the **current, fully-shipped state** across all six pages (Today, Recipe catalog, Recipe
detail, Shopping list, Schedule, Label checklist, Lunch swap) plus the app shell itself. Two things
stay hard invariants regardless of this or any future pass: the 44×44px tap-target floor, and the
gluten-risk signal's exclusive, unmissable meaning — both remain codified in `specs/constitution.md`
Principle 7.

**Key Characteristics:**
- **Theme architecture is deliberately split.** Fluent's `FluentProvider` theme stays the light
  `zeroGlutenTheme` — every card, input, and button keeps the exact contrast already proven. The
  dark/purple treatment is hand-pinned hex (`src/styles/shellColors.ts`), applied only to the
  nav/shell and each page's outer background — never inside a card. No `createDarkTheme` switch;
  re-verifying every component's contrast for a full dark theme would buy nothing, since cards stay
  white either way.
- **The left nav is a real Fluent 2 component, not a styled list of links.** `NavDrawer` /
  `NavDrawerHeader` / `NavDrawerBody` / `NavItem` / `Hamburger` from `@fluentui/react-components`
  replace the old hand-rolled `<nav>` + `<Link>` markup. It inherits the shell's dark/purple palette
  via per-slot `className` overrides, not Fluent's own (light-theme) default styling — see the
  Named Rules below for the contrast bug that habit caused.
- **Purple/indigo is the chrome/world color; rosemary green is demoted, not removed.** Green keeps
  its prior meaning exactly — primary actions, checkbox accent, link color, all *inside* a white
  card. Purple/indigo owns only the outer chrome, the nav pane, and the page backdrop.
- **Left-edge status stripes**, not top strips — Catalog and Today's cards specifically.
- **Off-card text is a first-class concern.** Several elements across the app sit directly on the
  dark backdrop rather than inside a card (page headings, date lines, empty-state prompts, the nav
  pane's own brand label and links). Each was individually checked against the actual rendered page,
  not assumed safe from a written plan.

## Theme Architecture

`src/main.tsx` mounts `FluentProvider` on `zeroGlutenTheme` (unchanged, light, from `src/theme.ts`)
— this is the single most consequential decision in this system, and it held across the move from a
top bar to a left pane. Switching to `createDarkTheme` would force re-verifying every already-proven
component's contrast for zero visible benefit, since every real task still renders on a white card.

Dark/purple styling lives in `src/styles/shellColors.ts` (hand-pinned hex, deliberately outside the
Fluent theme) and `src/styles/shell.ts` (`usePageBackdropStyles`, a single shared Griffel hook every
page's outer wrapper applies). The app root (`src/App.tsx`) is a flex row: the `NavDrawer` pane as
one child, a flex-column content area as the other. Each routed page's own JSX root is still a
two-level wrapper inside that content area — an outer `backdropStyles.backdrop` div (full-bleed
gradient, `min-height: 100dvh`) containing the inner `.page` div (padding/max-width centering) —
unaffected by where the nav now lives.

## Colors

### Shell
- **Utility bar** (`#120f1c`): the nav pane's own header row (brand label + collapse toggle), and
  the matching top bar that appears in the content area whenever the pane is collapsed (any
  viewport) so there's always a way to reopen it.
- **Header bar** (`#241a3f`): the nav pane's body — the six-link list sits on this fill, replacing
  its prior job as the horizontal link row's background.
- **Nav link default / active** (`#b9aed6` / `#ffffff`): link color tiers — default for unselected
  items (icon + label), active (white) plus a bold weight and an inset left accent bar for the
  current route. Both contrast-checked against the header bar (7.8:1, 16.2:1). The prior third tier,
  a lighter violet "tint" marking two secondary routes (Lista, Csere), was dropped with the top bar —
  it was a top-bar-specific highlight with no meaning that survived the move to a vertical list; see
  Named Rules.
- **Backdrop gradient**: two CSS `radial-gradient`s (violet→indigo bottom-left, magenta→header-bar
  top-right) over a `#1b1430` base fill — pure CSS, no images. An abstract decorative gradient,
  distinct from the "no fabricated food photography" constraint in PRODUCT.md, which is about real
  photos specifically.
- **Off-card text** (`#e3dcf2` / `#cdbfe8` muted / `#9fd9b9` accent-green): the palette for the
  handful of real content elements that sit directly on the backdrop rather than inside a card.

### Primary (in-card)
- **Rozmaring 80** (`#2d7652`): primary actions, checkbox accent, link color — always inside a
  white card. Generated via `createLightTheme` from a 16-step ramp (`src/theme.ts`).

### Secondary — the gluten-risk signal
- **Gluten Risk** (`#fbe0cc` background / `#8a3b00` text): the one safety signal in the system. The
  badge always renders on a white card body, so chrome/nav changes never affect its contrast.

### Tertiary — meal-type data series
- **Breakfast** (`#fbefd9` bg / `#8a6416` text / `#d9a33e` strip)
- **Lunch** (`#e1f1ef` bg / `#1f5a54` text / `#2f8c82` strip)
- **Dinner** (`#f1e7f1` bg / `#5c3a5e` text / `#8b5a8c` strip)

Applied as a **left-edge rail** on Catalog's and Today's cards, plus the pill chip on Schedule's
meal rows. Shopping's trip cards and Schedule's day cards deliberately do **not** take a stripe —
Shopping groups by trip, not meal type, and a 6px rail doesn't fit an inline pill.

### Neutral (in-card)
- **Neutral Background 1** (`#ffffff`): card/surface background.
- **Neutral Stroke** (`#e0e0e0`-family): card borders, hairline dividers.
- **Neutral Text Secondary** (`#616161`-family): servings, captions — *inside* a card only; the
  same gray would under-contrast directly on the dark backdrop, which is why off-card text uses the
  separate shell palette instead.

### Named Rules
**The Always-Flagged Rule.** The gluten-risk-ingredient signal is reserved exclusively for that one
meaning, on every page, regardless of color or backdrop. Codified in `specs/constitution.md`
Principle 7.

**The One Hex, One Place Rule.** In-card colors stay in `src/styles/colors.ts`, shell/backdrop
colors in `src/styles/shellColors.ts`, each imported everywhere needed, never re-declared locally.

**The Left-Border Reversal.** Left/right decorative card borders are a standing craft-floor ban in
general, but meal-type color deliberately renders as a left-edge stripe on Catalog and Today cards,
adopted from the user-pinned dark dashboard reference. The nest-cards-inside-cards ban is unaffected
— stripes replace a color's *position*, they never become their own nested card. The nav's own
selected-item indicator (a 3px inset `box-shadow`, not a `border`) follows the same earned exception
for the same reason: it's the real Fluent 2 selected-state treatment, re-pinned to the shell palette
instead of Fluent's brand green.

**The Check-The-Component's-Own-Defaults Rule.** A library component (`NavItem`) carries its own
default background from the active Fluent theme (`#f0f0f0`, light-neutral) regardless of what
backdrop it's dropped onto — composing it inside a hand-pinned dark surface requires explicitly
overriding that default, not just adding new color on top. Caught only by reading the rendered page's
computed styles, not by reasoning about the className override in isolation.

## Typography

Fluent's own type ramp via the theme's default font stack (`Segoe UI` leading a system fallback, no
self-hosted font). Off-card text — including the nav pane's brand label and link list — uses the
same type roles (`Caption1`, `Subtitle1`, plain `Text`/`h1`/`h2`) with only their *color* swapped to
the shell palette, never a different typeface or scale for off-card vs. on-card content.

### Hierarchy
- **Status** (`Subtitle1`, 600/20px): Today's "Kell főzni ma?" line — off-card, white text, with
  the "igen" word in the off-card accent green rather than the in-card brand green.
- **Title** (`Title2`/`h1`, 600/20px): recipe titles — off-card on Recipe Detail, white text.
- **Section headings** (`h2`/`h3`): Catalog's meal-type sections (off-card, white), Shopping's trip
  and category headings, Schedule's day headers (on-card) — kept as real semantic headings
  throughout; `getByRole('heading', {level})` is load-bearing in several test suites.
- **Body** (`Body1`/`Text`, 400/14px): ingredient lines, step text, item names — always on-card.
- **Caption** (`Caption1`, 400/12px): date lines (off-card, muted shell color), servings.
- **Chip label** (12px/700, uppercase): meal-type chips, category headings, badge text.
- **Nav link** (`fontWeightSemibold`/14px): nav item labels, semibold at rest, white at the active
  route — not a distinct type role, but called out because it's the one place link text and page
  body text now share a visual column.

## Layout

Unchanged page breakpoints (480/640/1024/1366px, `src/styles/breakpoints.ts`). New this pass: the
app root (`src/App.tsx`) is a flex row — the `NavDrawer` as one child, a flex-column content area as
the other — rather than every page stacking below a full-width top bar.

**Responsive nav collapse.** At 1024px and above (`bpXLarge`) the nav renders `type="inline"`: a
persistent 320px pane that pushes the content column, open by default. Below 1024px it renders
`type="overlay"`: closed by default, floating above the content on open, with its own scrim. A
`window.matchMedia` listener drives the switch automatically on resize; a `Hamburger` toggle (in the
nav pane's own header when open, in a matching top bar in the content area when closed) lets the
user override either state manually at any width. Selecting a nav item while in overlay mode closes
it, standard overlay-dismiss-on-navigate behavior.

Each page's own root is still the full-bleed backdrop wrapper (`min-height: 100dvh`) around the
centered `.page` content wrapper, now simply narrower when the pane is open rather than full-viewport
— the gradient's percentage-based `radial-gradient` positions adapt to the column width with no
per-page change needed.

## Elevation & Depth

Cards rest at `tokens.shadow4` (`0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.14)`), lift to
`tokens.shadow8` (`0 0 2px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.14)`) on hover/focus. The nav pane
stays flat when inline (no shadow) — depth is still reserved for cards, not the shell. In its
overlay form (narrow viewports), the pane floats above the content with Fluent's own built-in drawer
shadow and scrim — a library default left untouched, not a custom elevation added for this system.

## Shapes

`rounded.xlarge` for cards, `rounded.medium` for buttons, inputs, and nav items, `rounded.pill` for
badges/chips. The meal-type stripe and the nav's selected-item indicator are both a 6px/3px
`align-self: stretch` bar styled in place on the existing element — never a new wrapper, never an
actual `border`.

## Components

### Buttons
- **Primary**, **Subtle**, **Destructive-ghost**: unchanged in behavior and in-card appearance. The
  collapsed "subtle" edit-affordance on Today is the one non-nav button that sits off-card (below
  the meal cards, directly on the backdrop) and carries an explicit color override
  (`editButtonOffCard`) since Fluent's default subtle-button gray would under-contrast there — the
  same class of fix the nav itself needed (see Named Rules).

### Badges / Chips
- **Gluten-risk badge**, **meal-type chip**, **"Utolsó nap" tag**: unchanged in hex, shape, and
  meaning regardless of the surrounding chrome.

### Cards
- **Recipe card** (Catalog): a left-edge rail + title + servings + optional gluten badge
  (`display: flex` card, rail as the first flex child).
- **Meal card** (Today): a left-edge rail; the meal-type label lives as a small chip inside the
  card body.
- **Step card** (Recipe Detail): each step group is its own white card, since recoloring many
  nested list items individually against the dark backdrop would be more error-prone than boxing.
- **Anchor-edit form card** (Today): the expanded rotation-anchor form is boxed in its own white
  card, so Fluent's `Field`/`Input`/`Button` keep their already-proven light-surface contrast with
  zero per-component dark overrides needed.
- **Day card, Trip card, Shell card**: unchanged in structure.

### Inputs / Fields
Same `Field`+`Input` slot-override pattern, same deliberately-kept native `<select>` on Lunch swap,
same native checkboxes elsewhere.

### Navigation
A Fluent 2 `NavDrawer` left pane — `NavDrawerHeader` (brand label + `Hamburger` collapse toggle,
`#120f1c` fill) above `NavDrawerBody` (six `NavItem`s, `#241a3f` fill), responsive per Layout above.
Each item carries a matching icon (`@fluentui/react-icons`, `bundleIcon`'d so the glyph itself swaps
from outline to filled on the active route, not just its color) plus the Hungarian label. Selection
state is Fluent's own native treatment — bold white text, a tinted background
(`rgba(255,255,255,.1)`), and a 3px inset left accent bar — re-pinned to the shell palette rather
than Fluent's brand green, since brand green is reserved exclusively for in-card content (see
Colors). This replaces the prior two-tier top bar (a slim brand strip over a flat link row, plain
`<Link>`s with a manual underline for the active route); the brand/link two-tier split and all six
routes carried over unchanged, only the orientation and the underlying components did not.

### Off-Card Text
A handful of elements sit directly on the backdrop rather than inside a card: the nav pane's own
brand label and item labels; the collapsed-state top bar's brand label; Today's date line,
cook-status line, setup prompt, and collapsed edit button; Catalog's section headings and "no
results" text; Recipe Detail's back-link, title, meal-type, servings, gluten-free note, and source
line; Shopping's family-size label; Schedule's empty-state prompt and anchor-link; Label checklist's
summary line. Each uses the shell's off-card text/muted/accent-green colors, never the in-card
neutral-gray tokens, which would under-contrast on the dark backdrop.

## Do's and Don'ts

### Do:
- **Do** keep `FluentProvider` on the light theme — dark/purple styling is chrome-only, hand-pinned
  hex, never a theme-level switch. This is the architecture decision everything else depends on.
- **Do** check every page's actual rendered output — including a library component's own computed
  styles, not just the className you added — before trusting a written plan's survey. The nav's
  default light-neutral background only surfaced by reading the live DOM.
- **Do** reach for Fluent's own primitives (`NavDrawer`, `NavItem`, `Hamburger`) over hand-rolled
  nav markup when the library ships one — real keyboard nav, focus management, and responsive
  overlay behavior come for free; only the color layer needs re-pinning to the shell palette.
- **Do** keep the gluten-risk color and the three meal-type hues sourced from their one shared
  module each, regardless of position or backdrop.
- **Do** box genuinely dense content (Recipe Detail's step instructions, Today's expanded form) in
  its own white card rather than recoloring many individual text nodes — fewer failure points.

### Don't:
- **Don't** assume a page — or a drop-in component — has no contrast problem because nothing in the
  diff touched color; verify the real render.
- **Don't** map the gluten-risk signal or any data-series hue to a UI framework's own semantic
  color token — pin every one explicitly.
- **Don't** carry forward a decorative distinction (the old nav's "tint" on two routes) into a new
  structure just because it existed before — it was dropped here precisely because nothing about the
  left-pane layout gave it a meaning to preserve.
- **Don't** give every list card treatment by default — Label checklist's flat list is still the
  deliberate exception.
- **Don't** treat this file as a snapshot of a transition — the left-pane-nav, dark-shell system is
  the one and only shipped state across all six pages plus the app shell. Re-run
  `/impeccable document` the next time the visual system changes meaningfully.
