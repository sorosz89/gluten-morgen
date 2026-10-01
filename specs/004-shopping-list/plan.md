# 004 – Implementation plan

Spec: ./spec.md

## Approach

Domain and parsing first, same shape as specs 001–003.

1. **Reuse the existing gluten-risk classifier.** `src/domain/recipeMarkdown.ts`
   already has a private `WATCHLIST`/`isGlutenFree` pair that is exactly the
   "must always buy labelled gluten-free" tier this spec needs (`gluténmentes`,
   `zab`, `kenyér`, `zsemle`, `liszt`, `sonka`, `felvágott`,
   `fehérjekoncentrátum`, `étcsoki`, `mustár`). Exporting both (no behavior
   change to spec 001) avoids re-deriving the same rule a second time and
   keeps the two features from drifting apart on what counts as "always
   flag this".

2. **Shopping-list domain + parser** (`src/domain/shoppingList.ts`,
   `src/domain/shoppingListMarkdown.ts`, pure, unit-tested, no React): the
   source document's item lines use a different grammar than recipe
   ingredient lines — `name: amount unit [note]` for most lines, but the
   "thawed from the freezer" reminder lines (`+ 1000 g pörköltnek való hús a
   fagyasztóból kiolvasztva (lásd fent)`) use the recipe-style `amount unit
   name (note)` order, because the leading `+` is literal line text ("plus,
   from the freezer"), not a different bullet marker. The parser detects
   and handles both shapes. Trips are the document's `##` headings;
   categories within a trip are its `###` headings — mirroring
   `splitSections` from `recipeMarkdown.ts` but one level, then split again
   one level deeper for categories. The trailing "Vásárláskor egyszer
   ellenőrizendő címkék" section (the softer check-once tier, backlog #006)
   is recognized and skipped, not parsed as a 4th trip. Only `g` and `db`
   units appear anywhere in the source document — no speculative units.

3. **Import script** (`scripts/import-shopping-list.ts`, mirrors
   `import-recipes.ts`): reads `data/source/gf-bevasarlolista-2het.md`,
   parses it, validates with `shoppingListSchema.parse`, writes
   `src/data/shoppingList.json`. `src/data/shoppingList.ts` is the single
   point where that generated JSON becomes a trusted typed value, exactly
   like `src/data/recipes.ts`.

4. **Family size & checked-item persistence**
   (`src/data/shoppingListRepository.ts`): this is the second feature
   needing persistence (after spec 003's `anchorRepository.ts`), so it
   follows that exact pattern — a small interface,
   `createShoppingListRepository(storage)` taking anything shaped like
   `Pick<Storage, 'getItem' | 'setItem'>` for its own tests, and a default
   instance backed by `window.localStorage`. Checked-item identity is
   `tripId + item name` — verified unique within every trip in the real
   document — computed at read/write time rather than stored as a
   synthetic ID, since nothing in the source data supplies one.

5. **ShoppingPage** (`src/features/shopping/`): reads the loaded
   `ShoppingTrip[]`, the family size, and checked state from the
   repository; renders each trip as a labeled section of category
   subsections of items. Each item shows its name, its
   `amount × familySize` (qualifier and unit kept attached, e.g. "kb. 68
   db"), a checkbox (persisted via the repository, independent per trip
   per item), and — since `mustBeGlutenFree` is already a direct per-item
   boolean from the parser, no aggregation helper needed — the same badge
   markup used on recipes. A single family-size number input sits once at
   the top of the page (not per trip, per the spec), and each trip has its
   own "lista törlése" button that clears only that trip's checked state.
   `App.tsx` gains the `/bevasarlas` route and a "Lista" nav link.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `src/domain/recipeMarkdown.ts` | changed | export the existing `WATCHLIST`/`isGlutenFree` (visibility only) |
| `src/domain/shoppingList.ts` | new | zod schema: `shoppingUnitSchema`, `shoppingItemSchema`, `shoppingCategorySchema`, `tripIdSchema`, `shoppingTripSchema`, `shoppingListSchema` |
| `src/domain/shoppingListMarkdown.ts` | new | `parseShoppingListMarkdown(raw): ShoppingTrip[]` |
| `src/domain/shoppingListMarkdown.test.ts` | new | unit tests against real document text: both line shapes, category grouping, trip order, qualifier parsing, gluten flag |
| `scripts/import-shopping-list.ts` | new | `buildShoppingList(sourceDir)`; writes `src/data/shoppingList.json` |
| `scripts/import-shopping-list.integration.test.ts` | new | `buildShoppingList()` against the real `data/source` dir |
| `src/data/shoppingList.json` | new (generated) | committed output of the import script |
| `src/data/shoppingList.ts` | new | `shoppingListSchema.parse(raw)` → typed `ShoppingTrip[]` |
| `src/data/shoppingList.test.ts` | new | loader returns 3 trips, schema-valid |
| `src/data/shoppingListRepository.ts` | new | `getFamilySize`/`setFamilySize`, `isChecked`/`setChecked`, `clearTrip` |
| `src/data/shoppingListRepository.test.ts` | new | unit tests against an injected fake storage |
| `src/features/shopping/ShoppingPage.tsx` | new | trips/categories/items, family-size input, badges, checkboxes, per-trip clear |
| `src/features/shopping/ShoppingPage.module.css` | new | layout, ≥44px tap targets |
| `src/features/shopping/ShoppingPage.test.tsx` | new | AC1, AC2, AC3, AC4, AC5, AC6, AC7 |
| `src/App.tsx` | changed | `/bevasarlas` route → `ShoppingPage`; "Lista" nav link |
| `src/App.test.tsx` | changed | smoke test for the new route |
| `package.json` | changed | `import:shopping` script |

## Types & interfaces

```ts
// src/domain/recipeMarkdown.ts (export only, unchanged behavior)
export const WATCHLIST: string[]
export function isGlutenFree(name: string, note: string | undefined): boolean

// src/domain/shoppingList.ts
export const shoppingUnitSchema = z.enum(['g', 'db'])
export type ShoppingUnit = z.infer<typeof shoppingUnitSchema>

export const shoppingItemSchema = z.object({
  name: z.string().min(1),
  amount: z.number(),
  amountQualifier: z.string().min(1).optional(), // e.g. "kb."
  unit: shoppingUnitSchema,
  note: z.string().min(1).optional(),
  mustBeGlutenFree: z.boolean(),
})
export type ShoppingItem = z.infer<typeof shoppingItemSchema>

export const shoppingCategorySchema = z.object({
  heading: z.string().min(1),
  items: z.array(shoppingItemSchema).min(1),
})
export type ShoppingCategory = z.infer<typeof shoppingCategorySchema>

export const tripIdSchema = z.enum(['pantry', 'freshWeek1', 'freshWeek2'])
export type TripId = z.infer<typeof tripIdSchema>

export const shoppingTripSchema = z.object({
  id: tripIdSchema,
  label: z.string().min(1),
  categories: z.array(shoppingCategorySchema).min(1),
})
export type ShoppingTrip = z.infer<typeof shoppingTripSchema>

export const shoppingListSchema = z.array(shoppingTripSchema).length(3)

// src/domain/shoppingListMarkdown.ts
export function parseShoppingListMarkdown(raw: string): ShoppingTrip[]

// src/data/shoppingList.ts
export const shoppingList: ShoppingTrip[] // validated via shoppingListSchema.parse(raw)

// src/data/shoppingListRepository.ts
export interface ShoppingListRepository {
  getFamilySize(): number // defaults to 1
  setFamilySize(size: number): void
  isChecked(tripId: TripId, itemName: string): boolean
  setChecked(tripId: TripId, itemName: string, checked: boolean): void
  clearTrip(tripId: TripId): void
}
export function createShoppingListRepository(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
): ShoppingListRepository
export const shoppingListRepository: ShoppingListRepository // backed by window.localStorage
```

## Test strategy

| AC | Covered by | Test type |
|---|---|---|
| AC1 | T1, T2, T4 | unit (`parseShoppingListMarkdown`, loader) + component |
| AC2 | T4 | component (default family size) |
| AC3 | T5 | component (set to 4, persists) |
| AC4 | T1, T5 | unit (qualifier parsed) + component (qualifier survives scaling) |
| AC5 | T1, T4 | unit (flag computed) + component (badge shown/hidden) |
| AC6 | T3, T6 | unit (repository) + component (independent per trip) |
| AC7 | T6 | component (clear one trip only) |
| AC8 | T7 | manual check at 360px (`npm run dev`); no automated test |

## Risks

- The two-line-shape parser (`name: amount unit` vs. `amount unit name`,
  triggered by a literal leading `+`) is the one place with real logic
  risk — mitigated by testing against the actual document text for every
  category, not synthetic fixtures, same approach as spec 001's recipe
  parser.
- Exporting `WATCHLIST`/`isGlutenFree` from `recipeMarkdown.ts` is
  mechanical (visibility only), but touches a spec-001 file — spec 001's
  existing tests must still pass unchanged after the export.
- `shoppingListRepository`'s checked-item key (`tripId + item name`) relies
  on names being unique within a trip; verified true for the real document,
  but would silently collide if a future edit to the source document added
  a duplicate name within one trip.
