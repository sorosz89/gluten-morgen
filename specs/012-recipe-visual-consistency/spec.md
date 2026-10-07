# 012 – Recipe detail & catalog visual consistency

Status: approved
Depends on: 011

## Problem

The Today screen (`/ma`) already presents its controls, chips and callouts with a
consistent, componentized visual language (see `specs/constitution.md` Principle 7's
pilot). The Recipe catalog and Recipe detail pages were built earlier and still mix
hand-rolled controls (the servings +/- buttons, the gluten-risk badge, the tip and
gluten-free paragraphs) with ad hoc spacing and elevation choices of their own. The
person cooking moves between these three screens constantly in the same session —
check today's meal, open its recipe, scan the catalog for an alternative — and the
visual inconsistency between them (different chip shapes, different card elevation,
no clear distinction between a cooking tip and a gluten-safety warning) makes the
app feel less trustworthy exactly where trust matters most: recognizing the
gluten-risk signal at a glance, one-handed, while cooking or shopping.

This spec extends the same consistent, accessible presentation already proven on
Today to the Recipe catalog and Recipe detail pages — a second, deliberate step in
the component-library pilot per Principle 7 — without changing any recipe content,
servings-stepper behavior, or domain data.

## User stories

- As the person cooking, I want the gluten-risk badge to look and feel the same
  whether I'm scanning the catalog or reading a recipe's full ingredient list, so I
  recognize it instantly without having to re-read it.
- As the person cooking, I want a recipe's cooking tip and its gluten-safety note to
  look clearly different from each other, so I never mistake a flavor suggestion for
  a safety warning (or vice versa).
- As the person cooking, I want the recipe detail page's ingredients and steps to
  line up cleanly on a wide screen and stack without overlap on my phone, so I can
  scan it quickly with wet or busy hands.

## Scope

In scope:
- The Recipe detail page (`/receptek/:id`-style route): servings stepper's visual
  presentation, ingredient list, step cards, tip callout, gluten-free note callout,
  macros section, two-column layout and its responsive stacking.
- The Recipe catalog page's per-recipe cards: meal-type indicator and gluten-risk
  badge, restyled to match the same chip/badge pattern used on the detail page.
- Bringing both pages' card elevation, spacing and callout treatment in line with
  the pattern already proven on Today, so all three screens read as one consistent
  app.
- Recording, in `specs/constitution.md`'s change log, the decision to extend the
  piloted component library to these two additional pages (required by Principle 7).

Out of scope:
- The Shopping list, Cooking schedule, Label checklist and Lunch swap pages — not
  touched by this spec.
- Any change to the servings-stepper's *behavior* (defaults, 1–20 bounds, rounding,
  per-recipe persistence, live recalculation) — spec 011's acceptance criteria stay
  authoritative; only the control's visual presentation may change.
- Any change to recipe content, quantities, macros, step text or wording.
- Any new domain/schema field — no structured gluten-free checklist items, no
  per-ingredient substitute field, no per-step hints. This pass restyles exactly the
  fields `src/domain/recipe.ts` already has (`tip`, `glutenFreeNote`, ingredient
  `note`, `mustBeGlutenFree`).
- A tabbed/segmented switch between ingredients and steps on narrow screens —
  layout stays a single stacked scroll, as it is today.
- A dark theme or theme switcher — the app stays on its current single light theme.

## Acceptance criteria

- **AC1** – Given the Recipe detail page is opened for any recipe, when it renders
  at a 1440px-wide viewport, then the ingredient list and the step cards appear as
  two columns whose tops are vertically aligned, and all page content sits within a
  single bounded-width container with nothing overflowing the viewport.

- **AC2** – Given the Recipe detail page is opened at a 360px-wide viewport, when it
  renders, then ingredients and steps stack in one vertical column with no overlap
  or horizontal scrolling, and the servings stepper's controls remain at least
  44×44px tap targets (Principle 3).

- **AC3** – Given a recipe with at least one ingredient flagged `mustBeGlutenFree`
  (e.g. gulyásleves's 300 g gluten-free bread), when that recipe is viewed on the
  Catalog page and then on its own detail page, then the gluten-risk badge is shown
  with the same visual treatment in both places, and remains visually distinct from
  the meal-type indicator in both places (Principle 1 — never diluted into a
  generic/neutral color).

- **AC4** – Given a recipe that has both a `tip` and a `glutenFreeNote` (e.g.
  gulyásleves), when its detail page renders, then the two are shown as visually
  distinct callouts, and the gluten-safety callout (`glutenFreeNote`) is never the
  visually lower-emphasis one of the pair.

- **AC5** – Given the servings stepper on the Recipe detail page, when the user
  operates it at any recipe, then every behavior specified in spec 011 (AC1–AC9:
  default of 4, 1–20 bounds with disabled state at each end, live recalculation,
  nearest-whole-number rounding, per-recipe persistence, gluten-flag preservation
  while scaling) continues to hold unchanged — this spec changes only how the
  control looks, never how it behaves.

- **AC6** – Given the Catalog page's recipe cards, when any card renders, then its
  meal-type indicator uses the same chip/badge component pattern as the meal-type
  label on the Recipe detail page (same shape and elevation family, consistent with
  Today's existing chips).

- **AC7** – Given a recipe with no `tip`, no `macros`, and no `glutenFreeNote` set
  (all three are optional fields), when its detail page renders, then no empty
  callout or section placeholder appears for any of them — sections are omitted
  cleanly, exactly as they are today.

- **AC8** – Given either page rendered in the app's current light theme, when
  checked against its background (on-card content and the existing off-card/backdrop
  text alike), then all text meets WCAG AA contrast, with no regression from the
  presentation already reviewed for Today.

## Data & rules

- Example recipe for manual checks: gulyásleves (`data/source/gf-ebed-gulyasleves.md`,
  id in `src/data/recipes.json`), `servingsLabel: "4 napi adagra"`, one ingredient
  (300 g gluténmentes kenyér) flagged `mustBeGlutenFree`, both a `tip` and a
  `glutenFreeNote` present — exercises AC3, AC4 and AC5 together.
- Example recipe for AC7: `mezes-mustaros-sult-oldalas` (ribs) has none of `tip`,
  `macros`, or `glutenFreeNote` set in `src/data/recipes.json` today.
- Meal-type labels keep today's existing Hungarian copy from `mealTypeLabel()` in
  `src/domain/catalog.ts` — no new copy is introduced by this spec.
- The 360 / 768 / 1440px widths in AC1–AC2 are manual-check viewport widths, not new
  breakpoint tokens — implementation keeps using the project's existing shared
  breakpoints (`src/styles/breakpoints.ts`); this spec only requires the page to
  look correct when measured at those widths.
- The gluten-risk badge's exclusive meaning and the 44×44px tap-target floor
  (Principles 1 and 3) are hard invariants per `specs/constitution.md` and must be
  spot-checked, not assumed, on both pages after the restyle.
- This spec depends on 011 only in that it must not regress its behavior; it does
  not require 011's tasks to be reopened.

## Open questions

- [ ] None outstanding — page scope, stepper-behavior scope, mobile layout, and
  domain-data scope were all confirmed with the user during the `/spec` interview
  (2026-10-07).
