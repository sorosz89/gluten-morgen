# 007 – Implementation plan

Spec: ./spec.md

## Approach

The 4 rotation lunch IDs are already hardcoded in `domain/rotation.ts`
(`BLOCK_RECIPE_IDS`). This feature adds a parallel, independently-persisted
"active lunch per block" layer on top of it, following the exact repository
pattern already used three times in this project (`anchorRepository`,
`shoppingListRepository`, `labelChecklistRepository`): a pure domain
function resolves the lunch that's actually active for a block right now, a
thin `localStorage`-backed repository persists the override, and the
existing Today/Schedule pages read through it instead of the fixed table
directly. `BLOCK_RECIPE_IDS` itself never changes — a swap only changes
which recipe currently counts for a block's lunch slot.

The harder part is the shopping-list delta. Recipe ingredient names in
`recipes.json` don't reliably match shopping-list item names: there's a
pre-existing import quirk that truncates a name at a comma inside
parentheses (e.g. `"darált hús (10% zsírtartalom alatt – sertés"` vs the
shopping list's clean `"darált hús"`), and separately the rotation recipes
say "zsír" while the shopping list and the alternative recipes say
"zsiradék" for what is the same purchasable cooking-fat product — by
decision, those are treated as one product (see Data & rules below). No
automatic string-matching algorithm is reliable against these quirks, so
the delta is driven by a small hand-authored mapping table: one row per
(recipe, ingredient) → (trip placement, category, exact shopping-list item
name). The amount itself is always read live from the recipe's own
ingredient list at apply time, never re-typed into the map, so it can't
drift from the recipe data. A completeness test cross-checks that every
`g`/`db` ingredient (the only units the shopping list itself uses) of the 9
relevant recipes — the 4 rotation lunches and the 5 alternatives — has a
row.

Subtracting or adding against a missing mapping row, or a shopping item
that the map says should exist but doesn't, throws rather than silently
producing a wrong number — this is pure domain code covered by tests, so a
mistake surfaces as a failing test, not a wrong number in production.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `src/domain/lunchSwap.ts` | new | `ActiveSwaps` type, `getActiveLunchId`, `ALTERNATIVE_RECIPE_IDS` |
| `src/domain/lunchSwap.test.ts` | new | AC1, AC4 |
| `src/domain/lunchShoppingMap.ts` | new | hand-authored contribution map, `resolveTripId`, `applyLunchSwaps`, `diffRemovedItems` |
| `src/domain/lunchShoppingMap.test.ts` | new | AC5, AC6, AC7 |
| `src/data/lunchSwapRepository.ts` | new | persists active swaps, same pattern as `anchorRepository.ts` |
| `src/data/lunchSwapRepository.test.ts` | new | AC3, AC4, AC9 |
| `src/features/lunchSwap/LunchSwapPage.tsx` | new | the swap picker: 4 blocks, each with a select of default + 5 alternatives |
| `src/features/lunchSwap/LunchSwapPage.module.css` | new | layout, 360px-usable controls |
| `src/features/lunchSwap/LunchSwapPage.test.tsx` | new | AC1, AC3, AC4, AC8, AC9 |
| `src/features/today/TodayPage.tsx` | changed | lunch resolved via `getActiveLunchId` + `lunchSwapRepository` instead of the fixed id |
| `src/features/today/TodayPage.test.tsx` | changed | AC2 |
| `src/features/schedule/SchedulePage.tsx` | changed | same change, for consistency with Today |
| `src/features/schedule/SchedulePage.test.tsx` | changed | regression coverage for the same change |
| `src/features/shopping/ShoppingPage.tsx` | changed | renders `applyLunchSwaps(shoppingList, swaps, recipesById)` instead of the raw `shoppingList` |
| `src/features/shopping/ShoppingPage.test.tsx` | changed | AC5, AC6, AC7 |
| `src/App.tsx` | changed | nav link + `/csere` route for the swap picker |

## Types & interfaces

```ts
// domain/lunchSwap.ts
export type ActiveSwaps = Partial<Record<BlockNumber, string>>

export const ALTERNATIVE_RECIPE_IDS = [
  'gf-alternativ-csirkes-rizses-egytal',
  'gf-alternativ-sertesszelet',
  'gf-alternativ-sult-csirke-rizs',
  'gf-alternativ-sult-lazac',
  'gf-alternativ-tonhalas-tesztasalata',
] as const

export function getActiveLunchId(block: BlockNumber, swaps: ActiveSwaps): string {
  return swaps[block] ?? getBlockRecipeIds(block).lunchId
}

// domain/lunchShoppingMap.ts
interface ShoppingContribution {
  recipeId: string
  ingredientName: string    // exact `name` field as stored in recipes.json
  placement: 'pantry' | 'fresh'
  category: string          // existing category heading in that trip
  shoppingItemName: string  // clean name to merge into, or create as a new item
}

export const LUNCH_SHOPPING_MAP: ShoppingContribution[] = [ /* ~60 rows, see Data & rules */ ]

export function resolveTripId(placement: 'pantry' | 'fresh', block: BlockNumber): TripId {
  if (placement === 'pantry') return 'pantry'
  return block === 1 || block === 2 ? 'freshWeek1' : 'freshWeek2'
}

export function applyLunchSwaps(
  base: ShoppingTrip[],
  swaps: ActiveSwaps,
  recipesById: Map<string, Recipe>,
): ShoppingTrip[]

export function diffRemovedItems(
  before: ShoppingTrip[],
  after: ShoppingTrip[],
): { tripId: TripId; itemName: string }[]

// data/lunchSwapRepository.ts
export interface LunchSwapRepository {
  getSwaps(): ActiveSwaps
  setSwap(block: BlockNumber, recipeId: string | null): void // null = revert to the block's default
}
```

## Data & rules

- `applyLunchSwaps` only touches a block whose active id (per
  `getActiveLunchId`) differs from `BLOCK_RECIPE_IDS`' default for that
  block. For each such block it subtracts the default recipe's
  contributions and adds the active recipe's, both resolved through
  `resolveTripId(contribution.placement, block)`.
- Subtracting: find the item by `shoppingItemName` in the resolved
  trip/category; subtract the recipe's live ingredient amount (looked up by
  `ingredientName` in that recipe's own `ingredients` array); if the result
  is `<= 0`, remove the item entirely (never render "0 g"); if the item or
  category isn't found, throw.
- Adding: if an item with that `shoppingItemName` already exists in the
  resolved trip/category, add to its amount; otherwise append a new item
  (amount, unit, and `mustBeGlutenFree` taken directly from the recipe's
  ingredient) to that existing category. No new categories are ever
  created (matches the spec's scope line — true for all 5 current
  alternatives).
- "zsír" (used by the 4 rotation lunch recipes) and "zsiradék" (used by the
  shopping list and the 5 alternatives) are the same purchasable
  cooking-fat product, by decision: every recipe's zsír/zsiradék ingredient
  maps to the pantry's `"zsiradék (kókuszzsír / sertészsír / sütésre
  alkalmas olaj)"` line.
- Only ingredients with unit `g` or `db` and a non-null amount get a
  mapping row — this matches the shopping list's own unit vocabulary
  (`shoppingUnitSchema`) and the existing project convention that
  to-taste/tool-count ingredients (gerezd fokhagyma, evőkanál fűszerpaprika,
  "só, bors ízlés szerint") never appear on the shopping list.
- Checked-state clearing (AC8): on every swap action, `LunchSwapPage`
  computes `diffRemovedItems` between the shopping list before and after
  the swap and calls `shoppingListRepository.setChecked(tripId, itemName,
  false)` for each one, so a removed line's checked flag never resurfaces
  if the same name is reintroduced by a later swap.

## Test strategy

| AC | Covered by |
|---|---|
| AC1 | `lunchSwap.test.ts`, `LunchSwapPage.test.tsx` |
| AC2 | `TodayPage.test.tsx` |
| AC3 | `LunchSwapPage.test.tsx`, `lunchSwapRepository.test.ts` |
| AC4 | `lunchSwap.test.ts`, `LunchSwapPage.test.tsx` |
| AC5, AC6, AC7 | `lunchShoppingMap.test.ts` (pure numbers), `ShoppingPage.test.tsx` (rendered) |
| AC8 | `LunchSwapPage.test.tsx` (swap, then assert the shopping list's checked state) |
| AC9 | `lunchSwapRepository.test.ts`, `LunchSwapPage.test.tsx` (unmount/remount) |
| AC10 | Manual check at 360px — no existing spec in this project automates viewport width |

## Risks

- The hand-authored mapping (~60 rows across 9 recipes) is the main
  correctness risk; mitigated by a completeness test and fail-loud lookups,
  but it's manual authoring work, not generated.
- "zsír" = "zsiradék" is a product decision, confirmed with the user, not
  derived from the data.
- None of the 5 current alternatives need a shopping-list category that
  doesn't already exist in their trip; a future alternative that does is an
  open question the spec explicitly defers.
