# 012 – Implementation plan

Spec: ./spec.md

## Context

The Today page (`/ma`) already pilots Fluent UI v9 with a consistent card/chip/badge
language (left color rail + pill meal-type chip + amber gluten-risk `Badge`, all boxed
cards sharing `shadow4`→`shadow8`/`borderRadiusXLarge`/`colorNeutralStroke2`). The
Recipe catalog and Recipe detail pages predate that pilot: each hand-rolls its own
`<span>` for the gluten-risk badge (three near-duplicate style objects across
Today/Catalog/Detail for the same signal), the catalog card has no text chip at all
(just a color rail), the detail page's meal-type label is a plain muted `<span>`, and
the `tip`/`glutenFreeNote` callouts are not visually distinguished from each other at
all — `glutenFreeNote` is actually the *less* visually prominent of the two today,
which is backwards for a safety signal. This spec closes that gap so the three screens
the cook moves between constantly read as one app, per constitution Principle 7's
recorded pilot-extension rule. No recipe content, domain data, or servings-stepper
behavior (spec 011) changes — this is a pure presentation pass over two pages.

Design choices confirmed with the user during planning:
- The `glutenFreeNote` callout gets the Caution Amber box **plus** a small
  `Warning16Filled` icon (from the already-installed `@fluentui/react-icons`) for the
  strongest, lowest-risk visual separation from the tip.
- Catalog cards **keep** their existing color rail and **add** the new meal-type chip
  alongside it, exactly mirroring Today's card recipe (rail + chip + badge together).
- A new top-level `src/components/` directory is introduced as the home for the two
  pieces now needed in more than one feature (`GlutenRiskBadge`, `MealTypeChip`) — the
  first shared-UI extraction in the project.

## Approach

1. **Extract two shared presentational components** into a new `src/components/`
   directory, built from the exact visual recipe already proven on Today
   (`src/features/today/TodayPage.tsx` / `.styles.ts`), reusing the existing color
   tokens (`glutenBg`/`glutenFg`/`mealColors` from `src/styles/colors.ts`) rather than
   inventing new ones:
   - `GlutenRiskBadge` — wraps Fluent's real `<Badge appearance="tint" shape="rounded">`
     (matching Today, not a hand-rolled `<span>` like Catalog/Detail do today), fixed
     Hungarian label `"Gluténmentes termék szükséges"` (must stay byte-identical — both
     pages' existing tests query it by exact text), accepts an optional `className` for
     placement-only spacing (Catalog needs `marginTop`-stacked-under-title, Detail needs
     `marginLeft`-inline-after-text — color/shape are never overridden by callers).
   - `MealTypeChip` — wraps a pill `<span>` styled like Today's `mealChip` +
     `mealChipBreakfast/Lunch/Dinner` (bold, uppercase, `borderRadiusCircular`, tinted
     per `mealColors`), takes a `mealType` prop and internally maps `alternative`/`extra`
     to the `lunch` color family (same fallback Today already uses), accepts an optional
     `className` for placement spacing.
   Today's own page is **not** touched — it already matches this visual language, and
   refactoring it is out of this spec's scope; only Catalog and Detail adopt the shared
   components.

2. **Wire both components into the Catalog card and the Recipe Detail page**, replacing
   the hand-rolled badge `<span>`s' worth of duplicated style (Catalog's `badge` key,
   Detail's `badge` key) and Detail's plain `mealType` text span. Catalog's card keeps
   its rail (`strip`/`stripBreakfast` etc.) and adds the chip in the card body next to
   the title; Detail's header replaces the muted `mealType` span with the chip.

3. **Restyle the `glutenFreeNote` callout** on the Recipe Detail page to use the same
   Caution Amber pair (`glutenBg`/`glutenFg`) as the gluten-risk badge, boxed the same
   way the `tip` is boxed today (padding, `borderRadiusXLarge`) but filled amber instead
   of `colorNeutralBackground2`, plus a small `Warning16Filled` icon at the start of the
   text. `tip` keeps its current neutral box unchanged. This makes the pair visually
   distinct (amber+icon vs. plain neutral) and puts `glutenFreeNote` unambiguously at
   higher emphasis, satisfying AC4.

4. **Add a regression test for AC7** (no `tip`/`macros`/`glutenFreeNote` for the ribs
   recipe `mezes-mustaros-sult-oldalas` renders no empty section) — the conditional
   rendering already does this correctly; the test documents and locks in the
   guarantee now that the callouts are getting restyled.

5. **Record the decision in `specs/constitution.md`'s change log** (required by
   Principle 7 and spec 012's scope) — naming the two new shared components and the
   pages now covered by the pilot.

6. **Manual verification pass** for the acceptance criteria that aren't (and can't
   usefully be) unit-tested in jsdom: AC1/AC2 (1440px / 360px layout — the existing
   `twoColumn` flexbox breakpoint at `bpXLarge` (1024px) already does this; verify
   nothing introduced by the badge/chip changes overflows or breaks stacking), AC5
   (full `npm test` run confirms all spec-011 AC1–AC9 stepper tests still pass
   unmodified — the stepper's logic/markup is untouched by this plan), and AC8
   (contrast — reusing already-reviewed tokens, spot-check in browser).

No changes to `src/domain/`, `src/data/`, or the stepper's logic/hooks
(`src/domain/recipeScaling.ts`, `src/data/recipePortionsRepository.ts`, the
`useState`/`updateCount`/`factor` block in `RecipeDetailPage.tsx`).

## Files

| File | New/changed | Purpose |
|---|---|---|
| `src/components/GlutenRiskBadge.tsx` | New | Shared Fluent `Badge`-based gluten-risk badge |
| `src/components/GlutenRiskBadge.styles.ts` | New | Amber color classes (`glutenBg`/`glutenFg`) |
| `src/components/GlutenRiskBadge.test.tsx` | New | Renders with correct text; forwards `className` |
| `src/components/MealTypeChip.tsx` | New | Shared meal-type pill chip |
| `src/components/MealTypeChip.styles.ts` | New | Pill shape + per-meal-type tint classes |
| `src/components/MealTypeChip.test.tsx` | New | Renders correct label/color per `MealType`, incl. alternative/extra fallback |
| `src/features/catalog/CatalogPage.tsx` | Changed | Use `GlutenRiskBadge` + `MealTypeChip`; keep rail |
| `src/features/catalog/CatalogPage.styles.ts` | Changed | Remove local `badge` key; add chip/badge spacing-only class |
| `src/features/catalog/CatalogPage.test.tsx` | Changed | Assert chip renders per card |
| `src/features/catalog/RecipeDetailPage.tsx` | Changed | Use `GlutenRiskBadge` + `MealTypeChip`; amber `glutenFreeNote` box + icon |
| `src/features/catalog/RecipeDetailPage.styles.ts` | Changed | Remove local `badge`/`mealType` keys; add amber `glutenFreeNote` styles |
| `src/features/catalog/RecipeDetailPage.test.tsx` | Changed | Assert chip renders; tip/note have distinct classes; AC7 empty-section regression test |
| `specs/constitution.md` | Changed | Change log entry recording the pilot extension |

## Types & interfaces

```ts
// src/components/GlutenRiskBadge.tsx
interface GlutenRiskBadgeProps {
  className?: string
}
function GlutenRiskBadge(props: GlutenRiskBadgeProps): JSX.Element

// src/components/MealTypeChip.tsx
interface MealTypeChipProps {
  mealType: MealType   // from src/domain/recipe.ts
  className?: string
}
function MealTypeChip(props: MealTypeChipProps): JSX.Element
```

Both are pure presentational components — no new domain types, no new Zod schema
fields, no new persisted state.

## Test strategy

| AC | Covered by |
|---|---|
| AC1 (1440px two-column alignment, bounded width) | Manual check (existing layout, unchanged by this plan) |
| AC2 (360px stack, no overlap, 44×44 tap targets) | Manual check (existing layout + stepper untouched) |
| AC3 (badge identical catalog ↔ detail) | `GlutenRiskBadge.test.tsx` + existing Catalog/Detail badge assertions continuing to pass against the shared component |
| AC4 (tip vs. glutenFreeNote visually distinct, note never lower-emphasis) | `RecipeDetailPage.test.tsx`: assert the two paragraphs render with different classes; manual check confirms amber+icon reads as higher emphasis than the neutral tip box |
| AC5 (spec 011 behavior unchanged) | Full existing `RecipeDetailPage.test.tsx` stepper suite (AC1–AC9) re-run unmodified; manual check |
| AC6 (catalog chip matches detail/Today chip pattern) | `MealTypeChip.test.tsx` + updated Catalog/Detail component tests |
| AC7 (no empty callouts/sections) | New regression test on `mezes-mustaros-sult-oldalas` |
| AC8 (WCAG AA contrast, no regression) | Manual check (reusing already-reviewed tokens) |

## Risks

- Fluent's real `Badge` component may render slightly different default padding/font
  size than the current hand-rolled `<span>` once color overrides are the only
  customization (mirroring Today's own usage, which has already been visually
  reviewed) — low risk, but worth an eyeball check on both pages after wiring it in.
- Swapping Detail's plain-text `mealType` span for a colored pill chip is the most
  visible change on that page (bigger than a recolor) — confirmed with the user as the
  intended direction (AC6 requires the same chip pattern as Catalog/Today, not just a
  palette match).
- `src/components/` is a new top-level directory with no existing precedent in this
  repo — confirmed with the user as the right home for cross-feature shared UI going
  forward, not a one-off deviation.
- None of the three test files' existing assertions key off class names (all
  role/text based), so swapping implementations underneath is low-risk for
  regressions — but the new/updated test files should still run before touching JSX,
  per the test-first task order in `tasks.md`.
