# 006 – Implementation plan

Spec: ./spec.md

## Approach

Three small layers, same shape as the existing shopping-list feature.

**Domain** (`src/domain/labelChecklist.ts`) — a single exported constant,
`LABEL_CHECKLIST_PRODUCTS`, holding the 7 fixed Hungarian product names from
the spec's Data & rules section, in a fixed order. No parsing or zod schema
needed: unlike recipes/shopping data, this is hardcoded content, not derived
from `data/source/*.md` at build time — the list itself is the source of
truth going forward.

**Persistence** (`src/data/labelChecklistRepository.ts`) — follows
`shoppingListRepository.ts`'s exact pattern: `createLabelChecklistRepository
(storage)` plus a `window.localStorage`-backed singleton export. Storage
shape is `Record<string, true>` keyed by product name (store `true`, delete
the key to uncheck — mirrors `shoppingListRepository`'s checked-items map),
under key `zero-gluten:label-checklist`. Only `isChecked`/`setChecked` — no
brand text or notes, per the approved scope.

**UI** (`src/features/labelChecklist/LabelChecklistPage.tsx`) — one checkbox
per product, checked state read from the repository on mount and updated on
toggle (same `useState` + repository-write-through pattern as
`ShoppingPage.tsx`). A summary line above the list shows `"{n} maradt"` while
remaining `n > 0`, and a distinct `"Minden termék ellenőrizve"` message when
`n === 0` — satisfies AC4 and AC5 being visibly different states, not just a
count reaching zero. New route `/cimkek` with nav link "Címkék" added to
`App.tsx`, alongside the existing `Receptek`/`Ma`/`Heti terv`/`Lista` links.

AC6 (shopping list unaffected) requires no code change: `ShoppingPage.tsx` is
not touched by this feature, and its existing AC5 test
(`shows the gluten-risk badge on "gluténmentes kenyér/zsemle" but not on
"light sajt"`) continues to pass unmodified, which is the evidence that the
two features don't interact. Verified as part of T4, not a separate task.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `src/domain/labelChecklist.ts` | new | `LABEL_CHECKLIST_PRODUCTS` constant |
| `src/domain/labelChecklist.test.ts` | new | unit test for AC1 |
| `src/data/labelChecklistRepository.ts` | new | checked-state persistence |
| `src/data/labelChecklistRepository.test.ts` | new | unit tests for AC2, AC3 |
| `src/features/labelChecklist/LabelChecklistPage.tsx` | new | checklist screen |
| `src/features/labelChecklist/LabelChecklistPage.module.css` | new | layout, mirrors `ShoppingPage.module.css` |
| `src/features/labelChecklist/LabelChecklistPage.test.tsx` | new | RTL tests, AC1–AC5 |
| `src/App.tsx` | changed | add `/cimkek` route + "Címkék" nav link |

## Types & interfaces

```ts
// src/domain/labelChecklist.ts
export const LABEL_CHECKLIST_PRODUCTS: readonly string[]

// src/data/labelChecklistRepository.ts
export interface LabelChecklistRepository {
  isChecked(product: string): boolean
  setChecked(product: string, checked: boolean): void
}
export function createLabelChecklistRepository(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
): LabelChecklistRepository
export const labelChecklistRepository: LabelChecklistRepository
```

## Test strategy

- **Domain (unit, Vitest)** — `labelChecklist.test.ts`: `LABEL_CHECKLIST_PRODUCTS`
  equals exactly the 7 names in the spec's fixed order (AC1).
- **Data (unit, Vitest, fake storage)** — `labelChecklistRepository.test.ts`,
  mirroring `shoppingListRepository.test.ts`'s fake-storage harness:
  - `isChecked` is `false` for an untouched product (AC1 baseline).
  - `setChecked(product, true)` then `isChecked(product)` round-trips, and
    persists in a fresh repository instance over the same storage (AC2).
  - `setChecked(product, false)` after checking unchecks it (AC3).
  - checking one product leaves every other product's `isChecked` at `false`
    (AC2/AC3 independence).
- **Component (RTL)** — `LabelChecklistPage.test.tsx`, following
  `ShoppingPage.test.tsx`'s pattern (`localStorage.clear()` in `beforeEach`):
  - renders exactly the 7 products from `LABEL_CHECKLIST_PRODUCTS`, all
    unchecked (AC1).
  - checking "Fehérjekoncentrátum (protein por)" shows it checked, and it is
    still checked after `unmount` + re-`render` (AC2).
  - checking then un-checking "Étcsokoládé" returns it to unchecked,
    including after a reload (AC3).
  - with 3 of 7 checked, the summary text shows "4 maradt" (AC4).
  - with all 7 checked, the summary shows the distinct all-done message, not
    "0 maradt" (AC5).
- **Manual verification** — AC6: after T4, run `npm run check`, confirm
  `ShoppingPage.tsx` and `ShoppingPage.test.tsx` are untouched by `git diff`,
  and spot-check in the running app that toggling items on `/cimkek` leaves
  `/bevasarlas`'s "Gluténmentes termék szükséges" badges unchanged.

## Risks

- **Route/label naming** (`/cimkek`, "Címkék") — cosmetic, trivial to rename.
- **Storage key collision** — `zero-gluten:label-checklist` is distinct from
  the existing `zero-gluten:checked-items` (shopping) and
  `zero-gluten:cycle-anchor`/`zero-gluten:family-size` keys; no risk of
  overlap.
- Low overall risk: no domain calculation, no date math, no dependency on
  other features' state (by design, per AC6).
