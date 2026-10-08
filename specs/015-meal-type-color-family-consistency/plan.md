# 015 – Implementation plan

Spec: ./spec.md

## Approach

Four files each independently decide which color family (breakfast/lunch/
dinner) a `MealType` maps to, including the fallback for `alternative`/
`extra` recipes — `MealTypeChip.tsx` (`Record`, typed, commented),
`TodayPage.tsx` (`Record`, typed, uncommented), `RecipeDetailPage.tsx`
(`Record`, typed, commented, different key names), and `SchedulePage.tsx`
(untyped `if`/`else` chain). All four agree today: fall back to `lunch`.

Exploration during planning found a fifth place: `CatalogPage.tsx`'s own
card-rail color (`stripClass`, another untyped `if`/`else` chain) falls back
to `fluentStyles.stripNeutral` (a gray, `tokens.colorNeutralStroke1`) — not
lunch. So today, an alternative recipe's Catalog card already shows two
disagreeing colors on the same card: a lunch-teal chip (via the shared
`MealTypeChip` component) next to a gray rail. Spec 015's AC1 already
requires "the Catalog page's card" to show lunch for alternative/extra
recipes, so fixing this rail isn't scope creep — it's finishing what AC1
already asked for. Confirmed with the user during planning; `spec.md` was
amended (Problem, Scope, AC1/AC3, Data & rules) to document this fifth case
explicitly rather than leave it as a silent fix.

`src/domain/catalog.ts` already has the exact pattern to follow —
`mealTypeLabel`, a private `Record<MealType, string>` plus a one-line
exported lookup function. No color-related export exists there yet.
`styles/colors.ts`'s `mealColors` object only has 3 keys (breakfast/lunch/
dinner) — confirming there's genuinely no native family for `alternative`/
`extra`; every call site must choose to redirect them.

The only existing test that exercises the fallback today is
`MealTypeChip.test.tsx`'s `'AC6: alternative and extra fall back to the same
color treatment as lunch'` — it must keep passing unmodified. No other file
(Today, Recipe detail, Schedule, Catalog) currently tests color/fallback at
all; those are the net-new tests spec 015's AC1/AC3 call for.

Add one function to `src/domain/catalog.ts`, right next to `mealTypeLabel`,
same shape:

```ts
const MEAL_COLOR_FAMILIES: Record<MealType, 'breakfast' | 'lunch' | 'dinner'> = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  alternative: 'lunch',
  extra: 'lunch',
}

export function mealTypeColorFamily(mealType: MealType): 'breakfast' | 'lunch' | 'dinner' {
  return MEAL_COLOR_FAMILIES[mealType]
}
```

Each of the five call sites keeps its own local code shape and just asks
this function for the family instead of deciding it locally:

- **`MealTypeChip.tsx`**: its local `COLOR_CLASS_KEY` Record becomes
  unnecessary — its 3 color-family names already match its Fluent style
  keys exactly, so `fluentStyles[mealTypeColorFamily(mealType)]` replaces
  the Record entirely.
- **`TodayPage.tsx`** / **`RecipeDetailPage.tsx`**: their Records shrink
  from 5 keys to 3 (`Record<'breakfast'|'lunch'|'dinner', ...>`), indexed by
  `mealTypeColorFamily(mealType)` instead of by the raw `MealType`.
- **`SchedulePage.tsx`** / **`CatalogPage.tsx`**: both keep their `if`/`else`
  shape, now branching on `mealTypeColorFamily(mealType)` instead of the raw
  meal type — which also fixes both functions' current type gap (`mealType:
  string` → `mealType: MealType`), and, for Catalog, removes the only
  remaining path to `stripNeutral`.

`CatalogPage.styles.ts`'s now-unreachable `stripNeutral` key is removed
(confirmed used nowhere else in `src/`).

## Files

| File | New/changed | Purpose |
|---|---|---|
| `src/domain/catalog.ts` | changed | add `mealTypeColorFamily` + `MEAL_COLOR_FAMILIES`, mirroring `mealTypeLabel` |
| `src/domain/catalog.test.ts` | changed | new tests: all 5 `MealType`s → correct family |
| `src/components/MealTypeChip.tsx` | changed | `COLOR_CLASS_KEY` removed; calls shared function directly |
| `src/features/today/TodayPage.tsx` | changed | `railClassByType` narrowed to 3 keys, indexed via shared function |
| `src/features/today/TodayPage.test.tsx` | changed | new test: alternative/extra rail matches lunch's rail |
| `src/features/catalog/RecipeDetailPage.tsx` | changed | `ACCENT_STYLE_KEY` narrowed to 3 keys, indexed via shared function |
| `src/features/catalog/RecipeDetailPage.test.tsx` | changed | new test: alternative accent matches lunch's accent |
| `src/features/schedule/SchedulePage.tsx` | changed | `mealChipClass` branches on shared function; param typed `MealType` |
| `src/features/schedule/SchedulePage.test.tsx` | changed | new test: alternative/extra chip matches lunch's chip |
| `src/features/catalog/CatalogPage.tsx` | changed | `stripClass` branches on shared function; param typed `MealType` |
| `src/features/catalog/CatalogPage.styles.ts` | changed | remove unreachable `stripNeutral` |
| `src/features/catalog/CatalogPage.test.tsx` | changed | new test: alternative/extra rail matches lunch's rail (red today, green after) |

## Types & interfaces

```ts
// src/domain/catalog.ts
export function mealTypeColorFamily(mealType: MealType): 'breakfast' | 'lunch' | 'dinner'
```

Every call site's own Record/if-else keeps its existing key names
(`accentBreakfast`, `stripLunch`, `mealChipDinner`, etc.) — only what feeds
into them changes.

## Test strategy

- **AC3** (shared decision has its own test covering all 5 types): new
  `catalog.test.ts` cases for `mealTypeColorFamily` — breakfast/lunch/dinner
  map to themselves, alternative/extra map to lunch.
- **AC1** (alternative/extra consistent across every surface, Catalog's card
  included): existing `MealTypeChip.test.tsx` AC6 test re-run unmodified;
  one new equivalent test added to each of Today, Recipe detail, Schedule,
  and Catalog's test files (render an alternative-type item next to a
  lunch-type one, assert matching color class). Catalog's new test is the
  one that's genuinely red before the fix (today it'd see `stripNeutral` vs
  `stripLunch` — different classes) and green after.
- **AC2** (breakfast/lunch/dinner unchanged): existing tests across all five
  files already cover normal meal-type rendering indirectly; `npm run check`
  green confirms no regression.

## Risks

- Catalog's rail is the one place where "done" isn't purely cosmetic-neutral
  — it's a real, intentional visible color change (gray → lunch-teal) for
  alternative/extra recipes, decided explicitly with the user during
  planning (and now reflected in `spec.md`), not discovered-and-silently-fixed.
- `stripNeutral` removal must be confirmed dead after the `stripClass`
  rewrite — already grepped repo-wide; only two references exist
  (`CatalogPage.tsx`'s old fallback line and its own style definition), both
  removed together.
