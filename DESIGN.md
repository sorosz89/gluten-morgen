---
name: Zero Gluten
description: A colorful dark/purple app shell with a two-row segmented nav bar, wrapping white left-striped card-grid pages and a cardless, accent-stripe Recipe Detail page, for a gluten-free family's 2-week meal rotation.
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
  nav-bar-item:
    textColor: "{colors.nav-link-default}"
    rounded: "10px"
    height: "44px"
  nav-bar-item-active:
    textColor: "#ffffff"
    backgroundColor: "rgba(255, 255, 255, 0.14)"
    rounded: "10px"
---

# Design System: Zero Gluten

## Overview

**Creative North Star: "The Violet Shift"**

Zero Gluten runs inside a dark navy/indigo chrome over a purple gradient backdrop — a register
borrowed, user-pinned, from an unrelated enterprise dashboard reference. The product itself hasn't
changed across any shell or page pass: it's still a plain-spoken kitchen companion, read one-handed,
sometimes in a dim kitchen or a shop. Most real tasks — ingredient checklists, shopping checkboxes,
the cook-today answer — still live on the same white, elevated cards this system built before any of
the dark chrome existed; only the chrome and the page background around those cards went dark and
colorful. Recipe Detail is the one deliberate exception (see Key Characteristics and Cards below):
its content now sits directly on the backdrop, cardless, in the off-card light palette. Meal-type
color lives as a left-edge stripe on card-grid pages, a deliberate reversal of an earlier top-strip
rule (see Named Rules below).

The nav has been rebuilt three times since this system's first pass: a two-tier top bar (brand strip
over a link row) → a collapsible Fluent 2 `NavDrawer` left pane → a single horizontal icon-only bar →
its current shape, a two-row bar (brand + current-page title, then a segmented icon-and-label control)
spanning the full width, content routed below it. The dark/purple shell palette carried over unchanged
across every rebuild; only the structure and the underlying markup changed. Visible labels returned in
this pass (`impeccable /live`, explicit "redesign... mobile-first" request): a quick glance beats
guessing an icon's meaning one-handed with wet or busy hands, and the active route now fills its whole
segment with a background rather than relying on a thin bottom border — a stronger, easier-to-spot
signal at a glance.

This is the **current, fully-shipped state** across all six pages (Today, Recipe catalog, Recipe
detail, Shopping list, Schedule, Label checklist, Lunch swap) plus the app shell itself. Two things
stay hard invariants regardless of this or any future pass: the 44×44px tap-target floor, and the
gluten-risk signal's exclusive, unmissable meaning — both remain codified in `specs/constitution.md`
Principle 7.

**Key Characteristics:**
- **Theme architecture is deliberately split.** Fluent's `FluentProvider` theme stays the light
  `zeroGlutenTheme` — every card, input, and button keeps the exact contrast already proven. The
  dark/purple treatment is hand-pinned hex (`src/styles/shellColors.ts`), applied only to the
  nav/shell, each page's outer background, and (on Recipe Detail only) the page's own loose text —
  never inside a card elsewhere. No `createDarkTheme` switch; re-verifying every component's contrast
  for a full dark theme would buy nothing, since most real tasks still render on a white card.
- **The nav is a hand-rolled two-row bar, not a Fluent navigation primitive.** A plain `<nav>` of
  `<a>` tags (`src/App.tsx`), client-side routing wired by hand on click: a top row (brand + the
  current page's own label) over a segmented row of icon+label links, each segment a full-width flex
  item. No responsive collapse, no overlay, no keyboard-nav primitive to inherit from `NavDrawer` —
  traded deliberately for a bar that never needs to hide and reads at a glance.
- **Purple/indigo is the chrome/world color; rosemary green is demoted, not removed.** Green keeps
  its prior meaning exactly — primary actions, checkbox accent, link color, all *inside* a white
  card. Purple/indigo owns the outer chrome, the page backdrop, and — uniquely on Recipe Detail —
  the page's own body text via the off-card palette.
- **Left-edge status stripes**, not top strips — Catalog and Today's cards, and (at 6px, the same
  width and hue family, but as a `border-left` rather than a separate flex rail) Recipe Detail's
  cardless sections.
- **Recipe Detail is cardless by design, not by omission.** Its header, macros, ingredients, and
  steps sit directly on the dark backdrop in the off-card light palette, with a meal-type-colored
  left accent standing in for the card edge every other page still uses. The gluten-risk badge and
  the `glutenFreeNote` callout are the sole exceptions — see the Always-Flagged Rule.
- **Off-card text is a first-class concern.** Several elements across the app sit directly on the
  dark backdrop rather than inside a card (page headings, date lines, empty-state prompts, the nav
  bar's own brand label and links, and — in full now — Recipe Detail's entire body). Each was
  individually checked against the actual rendered page, not assumed safe from a written plan.

## Theme Architecture

`src/main.tsx` mounts `FluentProvider` on `zeroGlutenTheme` (unchanged, light, from `src/theme.ts`)
— this is the single most consequential decision in this system, and it has held across every nav
rebuild and the Recipe Detail cardless pass. Switching to `createDarkTheme` would force re-verifying
every already-proven component's contrast for little benefit, since most real tasks still render on
a white card.

Dark/purple styling lives in `src/styles/shellColors.ts` (hand-pinned hex, deliberately outside the
Fluent theme) and `src/styles/shell.ts` (`usePageBackdropStyles`, a single shared Griffel hook every
page's outer wrapper applies). The app root (`src/App.tsx`) is a flex **column**: the horizontal
`<nav>` bar as one child, a flex-column content area as the other, each routed page stacking below
the bar at every viewport. Each routed page's own JSX root is still a two-level wrapper inside that
content area — an outer `backdropStyles.backdrop` div (full-bleed gradient, `min-height: 100dvh`)
containing the inner `.page` div (padding/max-width centering) — unaffected by nav shape.

## Colors

### Shell
- **Utility bar** (`#120f1c`): the nav bar's own fill — now the *only* bar (no second tier); a
  1px `rgba(255,255,255,0.08)` bottom hairline separates it from the content below.
- **Header bar** (`#241a3f`): no longer a nav surface — it now appears only as a gradient stop in
  the page backdrop's top-right `radial-gradient` (see Backdrop gradient below).
- **Nav link default / active** (`#b9aed6` / `#ffffff`): link color tiers — default for unselected
  icons, active (white) plus the segment filling with `rgba(255,255,255,0.14)` for the current route
  (a background fill, not a border — stronger at a glance than the prior bottom-border tiers). Both
  contrast-checked against the utility bar (7.8:1, 16.2:1). The prior third tier, a lighter violet
  "tint" marking two secondary routes, was dropped with the first nav rebuild and has not returned.
- **Backdrop gradient**: two CSS `radial-gradient`s (violet→indigo bottom-left, magenta→header-bar
  top-right) over a `#1b1430` base fill — pure CSS, no images. An abstract decorative gradient,
  distinct from the "no fabricated food photography" constraint in PRODUCT.md, which is about real
  photos specifically.
- **Off-card text** (`#e3dcf2` / `#cdbfe8` muted / `#9fd9b9` accent-green): the palette for the
  handful of real content elements that sit directly on the backdrop rather than inside a card —
  now including the whole of Recipe Detail's body text, not just its loose headings and labels.

### Primary (in-card)
- **Rozmaring 80** (`#2d7652`): primary actions, checkbox accent, link color — always inside a
  white card. Generated via `createLightTheme` from a 16-step ramp (`src/theme.ts`).

### Secondary — the gluten-risk signal
- **Gluten Risk** (`#fbe0cc` background / `#8a3b00` text): the one safety signal in the system. The
  badge keeps its own filled background on every page, Recipe Detail included, so chrome, nav, or
  card-vs-cardless changes never affect its contrast or its unmissability. On Recipe Detail's
  ingredient rows specifically, the badge is scaled down (`transform: scale(0.85)`, flowing inline
  after the ingredient text via `display: flex` instead of a manual `marginLeft`) so it reads as a
  lighter annotation rather than a second, equally-loud label — the hex, text, and the signal itself
  are untouched; only its size and position soften.

### Tertiary — meal-type data series
- **Breakfast** (`#fbefd9` bg / `#8a6416` text / `#d9a33e` strip)
- **Lunch** (`#e1f1ef` bg / `#1f5a54` text / `#2f8c82` strip)
- **Dinner** (`#f1e7f1` bg / `#5c3a5e` text / `#8b5a8c` strip)

The `strip` value is applied as a **left-edge rail** on Catalog's and Today's cards (a dedicated
6px flex-item bar) and as a 6px `border-left` on Recipe Detail's cardless header/macros/ingredients/
steps sections — same width and hue family, implemented against a border instead of a card edge
since there is no card there to rail. The pill chip on Schedule's meal rows reuses the `bg`/`text`
pair. Shopping's trip cards and Schedule's day cards deliberately do **not** take a stripe — Shopping
groups by trip, not meal type, and a 6px rail doesn't fit an inline pill.

### Neutral (in-card)
- **Neutral Background 1** (`#ffffff`): card/surface background, everywhere a card still exists.
- **Neutral Stroke** (`#e0e0e0`-family): card borders, hairline dividers.
- **Neutral Text Secondary** (`#616161`-family): servings, captions — *inside* a card only; the
  same gray would under-contrast directly on the dark backdrop, which is why off-card text (and all
  of Recipe Detail) uses the separate shell palette instead.

### Named Rules
**The Always-Flagged Rule.** The gluten-risk-ingredient signal is reserved exclusively for that one
meaning, on every page, regardless of color, backdrop, or whether the surrounding content sits in a
card. Recipe Detail's gluten-risk badge and `glutenFreeNote` callout keep their filled backgrounds
even though the rest of that page went cardless — this is the one deliberate exception to "no filled
background," never the other way around. Codified in `specs/constitution.md` Principle 7.

**The One Hex, One Place Rule.** In-card colors stay in `src/styles/colors.ts`, shell/backdrop
colors in `src/styles/shellColors.ts`, each imported everywhere needed, never re-declared locally.

**The Left-Border Reversal.** Left/right decorative card borders are a standing craft-floor ban in
general, but meal-type color deliberately renders as a left-edge stripe or `border-left` — Catalog
and Today's card rail, Recipe Detail's cardless-section accent — adopted from the user-pinned dark
dashboard reference. The nest-cards-inside-cards ban is unaffected: stripes replace a color's
*position*, they never become their own nested card, and Recipe Detail's accent replaces a card
*edge* it no longer has, not a new card.

**The Check-The-Component's-Own-Defaults Rule.** A library component carries its own default
styling from the active Fluent theme regardless of what backdrop it's dropped onto — composing one
inside a hand-pinned dark surface requires explicitly overriding that default, not just adding new
color on top. First caught on the (now-retired) `NavDrawer`'s light-neutral background, by reading
the rendered page's computed styles, not by reasoning about a className override in isolation; the
same discipline applies to any Fluent primitive used off-theme going forward.

## Typography

Fluent's own type ramp via the theme's default font stack (`Segoe UI` leading a system fallback, no
self-hosted font). Off-card text — including the nav bar's brand label, and now all of Recipe
Detail's body text — uses the same type roles (`Caption1`, `Subtitle1`, plain `Text`/`h1`/`h2`) with
only their *color* swapped to the shell palette, never a different typeface or scale for off-card
vs. on-card content.

### Hierarchy
- **Status** (`Subtitle1`, 600/20px): Today's "Kell főzni ma?" line — off-card, white text, with
  the "igen" word in the off-card accent green rather than the in-card brand green.
- **Title** (`Title2`/`h1`, 600/20px): recipe titles — off-card on Recipe Detail, white text.
- **Section headings** (`h2`/`h3`): Catalog's meal-type sections (off-card, white), Shopping's trip
  and category headings, Schedule's day headers (on-card), Recipe Detail's "Hozzávalók" and
  step-group ("Elkészítés") headings (off-card, sharing one `stepHeading` style so the ingredients
  list stopped relying on an invisible `aria-label` and now points at its own visible heading via
  `aria-labelledby`) — kept as real semantic headings throughout; `getByRole('heading', {level})` is
  load-bearing in several test suites.
- **Body** (`Body1`/`Text`, 400/14px): ingredient lines, step text, item names — on-card everywhere
  except Recipe Detail, where the same type role renders off-card in the light palette.
- **Caption** (`Caption1`, 400/12px): date lines (off-card, muted shell color), servings.
- **Chip label** (12px/700, uppercase): meal-type chips, category headings, badge text.
- **Nav label** (600/0.6rem, under each icon): visible again — a quick glance beats guessing an
  icon's meaning one-handed in the kitchen. **Nav page title** (600/0.78rem, white, top-right of the
  bar's first row): names the current route next to the brand mark.

## Layout

Unchanged page breakpoints (480/640/1024/1366px, `src/styles/breakpoints.ts`), plus `bpLarge` (640px)
now referenced directly by the nav bar's own second row. The app root (`src/App.tsx`) is a flex
**column** — the two-row nav bar on top, the routed content below — the same stacking at every
viewport, no responsive collapse or overlay logic. Mobile-first: the bar's segmented row is built to
work at 360px first (full-width equal segments), then simply caps its own width and centers
(`max-width: 480px; margin: 0 auto`) at `bpLarge` and up rather than restructuring.

Each page's own root is still the full-bleed backdrop wrapper (`min-height: 100dvh`) around the
centered `.page` content wrapper, full-viewport width at every breakpoint now that nothing pushes it
from the side.

**Recipe Detail's two-column split** (ingredients | steps, `twoColumn` in its styles) still switches
to a single stacked column below `bpXLarge` (1024px) and side-by-side above it — unaffected by the
cardless pass; only the columns' own content (and the 6px accent `border-left` on each) changed.

## Elevation & Depth

Cards rest at `tokens.shadow4` (`0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.14)`), lift to
`tokens.shadow8` (`0 0 2px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.14)`) on hover/focus. The nav bar
is flat (no shadow, just the 1px bottom hairline) — depth is still reserved for cards, not the shell.
Recipe Detail, having no cards, carries no shadow at all outside its gluten-risk badge and
`glutenFreeNote` callout, which keep their own filled, bordered treatment regardless.

## Shapes

`rounded.xlarge` for cards, `rounded.medium` for buttons, inputs, and nav items, `rounded.pill` for
badges/chips. The meal-type stripe is a 6px bar: a separate `align-self: stretch` flex item on
Catalog/Today's cards, or a `border-left` of the same width on Recipe Detail's cardless sections —
never a new wrapper, never an actual card border.

## Components

### Buttons
- **Primary**, **Subtle**, **Destructive-ghost**: unchanged in behavior and in-card appearance. The
  collapsed "subtle" edit-affordance on Today is the one non-nav button that sits off-card (below
  the meal cards, directly on the backdrop) and carries an explicit color override
  (`editButtonOffCard`) since Fluent's default subtle-button gray would under-contrast there — the
  same class of fix the nav and Recipe Detail's own portion-stepper buttons needed.

### Badges / Chips
- **Gluten-risk badge**, **meal-type chip**, **"Utolsó nap" tag**: unchanged in hex, shape, and
  meaning regardless of the surrounding chrome or whether the page around them has a card. Recipe
  Detail's ingredient rows use a scaled-down (`0.85`), inline-flowing variant of the gluten-risk
  badge specifically — a sizing/position override on the wrapper only, never on the badge's own
  color or text.

### Cards
- **Recipe card** (Catalog): a left-edge rail + title + servings + optional gluten badge
  (`display: flex` card, rail as the first flex child).
- **Meal card** (Today): a left-edge rail; the meal-type label lives as a small chip inside the
  card body.
- **Anchor-edit form card** (Today): the expanded rotation-anchor form is boxed in its own white
  card, so Fluent's `Field`/`Input`/`Button` keep their already-proven light-surface contrast with
  zero per-component dark overrides needed.
- **Day card, Trip card, Shell card**: unchanged in structure.
- **Recipe Detail has no cards.** Its header widget, macros, ingredients, and step sections render
  directly on the backdrop in the off-card palette, each with a 6px meal-type `border-left` instead
  of a card edge (see Colors → Tertiary and the Left-Border Reversal). The gluten-risk badge and the
  `glutenFreeNote` callout are the only filled, boxed surfaces left on this page — see the
  Always-Flagged Rule. This replaced an earlier pass where the same content was boxed in white
  (and, briefly, translucent "glass") cards; neither survived — see Do's and Don'ts.

### Inputs / Fields
Same `Field`+`Input` slot-override pattern, same deliberately-kept native `<select>` on Lunch swap,
same native checkboxes elsewhere.

### Navigation
A plain two-row `<nav>` (`src/App.tsx`), hand-rolled, not a Fluent navigation primitive. Row one:
the brand label, and — right-aligned — the current page's own name (derived from the matching
`NAV_LINKS` entry), so the bar always names where you are. Row two: six links laid out as an
equal-width segmented control (`flex: 1 1 0` each), each a `@fluentui/react-icons` icon
(`bundleIcon`'d so the glyph swaps outline-to-filled on the active route) over a visible Hungarian
label, 44px tall. Client-side routing is wired by hand on click (a plain left-click is intercepted
and handed to the router; modified clicks keep native anchor behavior); the active link also carries
`aria-current="page"`. Selection state is the whole segment filling with `rgba(255,255,255,0.14)`
and the icon/label going full white — no border, no inset accent bar. This replaced a single
icon-only row (`aria-label`-only, no visible text), which had replaced the `NavDrawer` left pane,
which had replaced the original two-tier top bar; the brand label and all six routes carried over
across every rebuild, only the structure, the underlying components, and the label visibility did
not.

### Off-Card Text
A handful of elements sit directly on the backdrop rather than inside a card: the nav bar's own
brand label; Today's date line, cook-status line, setup prompt, and collapsed edit button;
Catalog's section headings and "no results" text; Shopping's family-size label; Schedule's
empty-state prompt and anchor-link; Label checklist's summary line; and, in full now, Recipe
Detail's back-link, title, meal-type chip surroundings, servings, portion stepper, macros,
ingredient list, step instructions, tip, and source line. Each uses the shell's off-card
text/muted/accent-green colors, never the in-card neutral-gray tokens, which would under-contrast
on the dark backdrop.

## Do's and Don'ts

### Do:
- **Do** keep `FluentProvider` on the light theme — dark/purple styling is chrome-only (or, on
  Recipe Detail, page-body-only) hand-pinned hex, never a theme-level switch. This is the
  architecture decision everything else depends on.
- **Do** check every page's actual rendered output — including a library component's own computed
  styles, not just the className you added — before trusting a written plan's survey.
- **Do** keep the gluten-risk color and the three meal-type hues sourced from their one shared
  module each, regardless of position, backdrop, or card-vs-cardless treatment.
- **Do** box genuinely dense content (Today's expanded anchor-edit form) in its own white card
  rather than recoloring many individual text nodes, when a card is the chosen treatment for that
  surface — fewer failure points.
- **Do** keep the gluten-risk badge and `glutenFreeNote` boxed and filled even on a page that has
  otherwise gone cardless — the Always-Flagged Rule outranks any surface's own direction.

### Don't:
- **Don't** assume a page — or a drop-in component — has no contrast problem because nothing in the
  diff touched color; verify the real render.
- **Don't** map the gluten-risk signal or any data-series hue to a UI framework's own semantic
  color token — pin every one explicitly.
- **Don't** carry forward a decorative distinction (the old nav's violet "tint" on two routes) into
  a new structure just because it existed before — it was dropped once already and has not earned
  its way back across three further nav rebuilds.
- **Don't** give every list card treatment by default — Label checklist's flat list is still the
  deliberate exception, and Recipe Detail's cardless body is now a second one.
- **Don't** reach for decorative `backdrop-filter`/glass treatments on a card — Recipe Detail briefly
  carried a translucent, blurred "glass" surface on its header/ingredients/step boxes; it matched no
  other page in the system and was removed in the same pass that made the page fully cardless.
- **Don't** treat this file as a snapshot of a transition — the current nav bar and Recipe Detail's
  cardless treatment are each the one and only shipped state for their surface. Re-run
  `/impeccable document` the next time the visual system changes meaningfully.
