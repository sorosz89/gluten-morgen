# 011 – Implementation plan

Spec: ./spec.md

## Approach

Add one new pure domain module for the scaling math, one new localStorage
repository for per-recipe persistence (both following existing patterns
exactly), then wire a stepper into `RecipeDetailPage` that uses both. Keep
`formatIngredientLine` as the single ingredient-to-text function; feed it
*already-scaled* ingredient objects rather than teaching it about scaling, so
existing formatting behavior (notes, amountText-vs-amount) stays centralized.

Reasoning: `src/domain/recipe.ts` has no numeric base-servings field, only
the free-text `servingsLabel`, so `baseCount` must be parsed from it
(`parseBaseCount`, first integer found anywhere in the string — covers the
"teljes tepsi, 4 napi adagra" case, not just a leading-token match).
`RecipeDetailPage.tsx` renders ingredients via a module-level
`formatIngredientLine(ingredient)` and shows `recipe.servingsLabel` as a
static span (next to which the stepper belongs); the component has no state
today, so this is its first `useState`. The existing localStorage repository
pattern (`lunchSwapRepository.ts`, `labelChecklistRepository.ts`) is a
`createXRepository(storage)` factory + `window.localStorage` singleton,
tested with an in-memory fake storage; `labelChecklistRepository.ts`'s
`Record<string, T>`-keyed-by-id shape is the closer precedent since
persistence here is per recipe id (AC8). `src/domain/lunchShoppingMap.ts` +
its test file is the precedent for a new pure domain module + co-located
test, importing real fixtures from `src/data/recipes.ts`. All 6 real units
in `unitSchema` (`g`, `kg`, `db`, `gerezd`, `evőkanál`, `tk`) are
quantity-style, so scaling applies uniformly with no per-unit special-casing.
No new libraries are needed: `Math.round` covers AC7's rounding rule.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `src/domain/recipeScaling.ts` | new | `parseBaseCount`, `scaleIngredient`, and the `DEFAULT_PORTION_COUNT`/`MIN_PORTION_COUNT`/`MAX_PORTION_COUNT` constants |
| `src/domain/recipeScaling.test.ts` | new | Unit tests for the above, using real recipes from `src/data/recipes.ts` |
| `src/data/recipePortionsRepository.ts` | new | `getPortions(recipeId)` / `setPortions(recipeId, count)`, keyed by recipe id, localStorage key `zero-gluten:recipe-portions` |
| `src/data/recipePortionsRepository.test.ts` | new | Repository tests with fake storage, mirroring `lunchSwapRepository.test.ts` |
| `src/features/catalog/RecipeDetailPage.tsx` | changed | Add portion state (seeded from the repository), +/- buttons next to `servingsLabel`, scale ingredients before rendering |
| `src/features/catalog/RecipeDetailPage.styles.ts` | changed | New style keys for the stepper control and its buttons (44×44px tap targets) |
| `src/features/catalog/RecipeDetailPage.test.tsx` | new or extended | Component tests covering AC1, AC3, AC4, AC5, AC6, AC8, AC9 end-to-end |

## Types & interfaces

```ts
// src/domain/recipeScaling.ts
export const DEFAULT_PORTION_COUNT = 4
export const MIN_PORTION_COUNT = 1
export const MAX_PORTION_COUNT = 20

export function parseBaseCount(servingsLabel: string): number
// First integer found anywhere in the label (regex /\d+/), e.g.
// "teljes tepsi, 4 napi adagra" -> 4, "1 adagra" -> 1.

export function scaleIngredient(ingredient: Ingredient, factor: number): Ingredient
// amount === null -> returned unchanged (AC5).
// factor === 1 -> returned unchanged, including amountText (AC1's "unscaled at base" case).
// otherwise -> { ...ingredient, amount: Math.round(amount * factor), amountText: undefined } (AC6, AC7).
```

```ts
// src/data/recipePortionsRepository.ts
export interface RecipePortionsRepository {
  getPortions(recipeId: string): number | null // null = nothing stored yet, caller defaults to 4
  setPortions(recipeId: string, count: number): void
}
export function createRecipePortionsRepository(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
): RecipePortionsRepository
export const recipePortionsRepository: RecipePortionsRepository
```

In `RecipeDetailPage.tsx`: a `[count, setCount]` state seeded by
`recipePortionsRepository.getPortions(recipe.id) ?? DEFAULT_PORTION_COUNT`;
`factor = count / parseBaseCount(recipe.servingsLabel)`; ingredients rendered
via `recipe.ingredients.map((i) => scaleIngredient(i, factor))` before being
passed into the existing `formatIngredientLine`. `+`/`-` handlers clamp
within `[MIN_PORTION_COUNT, MAX_PORTION_COUNT]`, update state, and call
`recipePortionsRepository.setPortions(recipe.id, next)`.

## Test strategy

- **Unit (domain)** — `recipeScaling.test.ts`: `parseBaseCount` against all
  distinct label shapes actually in `recipes.json` (`"4 napi adagra"`,
  `"1 adagra"`, `"4 főre"`, `"teljes tepsi, 4 napi adagra"`, `"4 napi
  adagra / teljes tepsire"`); `scaleIngredient` for null-amount passthrough
  (AC5), factor=1 passthrough including amountText (AC1 baseline), scaling +
  rounding using the real zabkása (70 g → 280 g, AC2) and ribs méz
  (3 → 5 at factor 1.5, AC6/AC7) examples from the spec.
- **Unit (repository)** — `recipePortionsRepository.test.ts`: default
  `null` for an unseen recipe id, round-trip get/set, two distinct recipe ids
  don't clash, a second repository instance over the same fake storage sees
  a prior write (reload simulation) — covers AC8.
- **Component** — `RecipeDetailPage.test.tsx`: render a base=4 recipe and
  assert the stepper shows 4 and amounts are unscaled (AC1); click `+`/`-`
  and assert amounts recalculate with no reload (AC3); drive the count to 1
  and to 20 and assert the respective button disables (AC4); assert a
  to-taste ingredient's text never changes (AC5); assert a range ingredient
  shows its original range text at the default and a scaled number once
  moved off it (AC6); assert the gluten-free badge still renders at a scaled
  count (AC9); unmount and remount (or re-render after a `+`) to assert the
  chosen count is read back from the repository (AC8).
- **Manual** — exercise the control in the browser on one recipe of each
  `baseCount` shape (zabkása base=1, gulyásleves base=4, ribs base=4) per the
  spec's worked examples, confirming `npm run check` stays green throughout.

## Risks

- `parseBaseCount`'s "first integer anywhere in the string" rule is correct
  for all 18 current recipes (verified), but a future recipe markdown import
  with a label containing an unrelated leading number (e.g. a temperature or
  time accidentally included) would silently produce a wrong `baseCount`.
  Out of scope for this spec to fix generally; acceptable per spec's explicit
  scope (today's 18 recipes).
- Dropping `amountText` entirely once scaled (vs. e.g. showing "≈3-4g→5g")
  loses the recipe's authored "about this much" nuance for ranges — this was
  an explicit, deliberate tradeoff from the spec interview (AC6), not an
  oversight.
- `key={index}` on the ingredient `<li>` (existing code, unchanged by this
  plan) means React may not perfectly preserve item identity across scaling
  re-renders, but since the list length/order never changes here, this has
  no observable effect.
