# 003 – Implementation plan

Spec: ./spec.md

## Approach

Three layers, domain first, mirroring how spec 002 was built:

1. **Rotation domain logic** (`src/domain/rotation.ts`, pure, unit-tested, no
   React, no `Date.now()`): the block table from the spec's "Data & rules"
   section becomes a 14-entry offset→block lookup plus a fixed
   `BLOCK_RECIPE_IDS` constant (mirrors how `catalog.ts` hardcodes meal-type
   labels — this is a fixed domain fact, not something derived at runtime).
   `getRotationDay(anchor, today)` does calendar-day arithmetic only: both
   dates are normalized to a UTC day-number from their *local* year/month/day
   components (never through `Date` string parsing, which is timezone-
   sensitive) before diffing and taking `mod 14`. This keeps DST and
   timezone entirely out of the calculation — "today" and "anchor" are pure
   calendar dates, per the spec's "Data & rules".

2. **Anchor persistence** (`src/data/anchorRepository.ts`): this is the
   first feature needing persistence, so it introduces the small repository
   interface CLAUDE.md's stack section calls for, rather than calling
   `localStorage` directly from `TodayPage`. `createAnchorRepository(storage)`
   takes anything shaped like `Pick<Storage, 'getItem' | 'setItem'>`, so its
   own test uses an in-memory fake and doesn't depend on jsdom's
   `localStorage`; the app uses a default instance backed by
   `window.localStorage`.

3. **TodayPage** (`src/features/today/TodayPage.tsx`): reads the anchor from
   the repository on mount. No anchor → renders the setup prompt (AC1) and
   nothing else. Anchor present → computes `getRotationDay(anchor, today)`,
   looks up the block's three recipes from `src/data/recipes.ts` via
   `BLOCK_RECIPE_IDS`, and renders each as a title linking to its spec-002
   detail route (`/recipes/:id`), reusing `recipeHasGlutenRiskIngredient`
   from `catalog.ts` for the badge (AC6) — no new gluten-risk logic. The
   `today` prop (default `new Date()`) is the only testability seam: tests
   pin it to the spec's concrete dates instead of mocking the system clock.
   The anchor is always visible and editable inline (a date input pre-filled
   with the current value + a save action) rather than behind a separate
   settings route — simplest thing that satisfies AC7's "see it, change it".
   Saving validates the picked date is a Sunday (`isSunday`, from the
   domain layer) before writing it, per the spec's stated anchor rule.

   `App.tsx` gains the new `/ma` route and a small shared nav (`Receptek` /
   `Ma`) so the screen is reachable — `/` and the existing catalog are
   otherwise untouched.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `src/domain/rotation.ts` | new | `BlockNumber`, `RotationDay`, `BLOCK_RECIPE_IDS`, `getRotationDay`, `getBlockRecipeIds`, `isSunday`, `parseIsoDate`, `formatIsoDate` |
| `src/domain/rotation.test.ts` | new | unit tests for AC2–5's concrete dates, the wraparound, and mapping-vs-real-data consistency |
| `src/data/anchorRepository.ts` | new | `AnchorRepository` interface, `createAnchorRepository(storage)`, default `anchorRepository` on `window.localStorage` |
| `src/data/anchorRepository.test.ts` | new | get/set round-trip and "nothing stored" against an injected fake storage |
| `src/features/today/TodayPage.tsx` | new | setup prompt, today's 3 meals + cook flag, gluten badge, editable anchor |
| `src/features/today/TodayPage.module.css` | new | layout, ≥44px tap targets, no horizontal overflow |
| `src/features/today/TodayPage.test.tsx` | new | AC1, AC2, AC3, AC4, AC5, AC6, AC7 |
| `src/App.tsx` | changed | `/ma` route → `TodayPage`; small shared nav (`Receptek` / `Ma`) |
| `src/App.test.tsx` | changed | smoke test: `/ma` renders `TodayPage`'s setup prompt |

## Types & interfaces

```ts
// src/domain/rotation.ts
export type BlockNumber = 1 | 2 | 3 | 4

export interface RotationDay {
  block: BlockNumber
  cookToday: boolean
}

export const BLOCK_RECIPE_IDS: Record<
  BlockNumber,
  { breakfastId: string; lunchId: string; dinnerId: string }
>

export function getRotationDay(anchor: Date, today: Date): RotationDay
export function getBlockRecipeIds(block: BlockNumber): { breakfastId: string; lunchId: string; dinnerId: string }
export function isSunday(date: Date): boolean
export function parseIsoDate(value: string): Date   // 'YYYY-MM-DD', local calendar date, no timezone shift
export function formatIsoDate(date: Date): string

// src/data/anchorRepository.ts
export interface AnchorRepository {
  getAnchor(): string | null   // ISO 'YYYY-MM-DD', always a Sunday
  setAnchor(anchor: string): void
}
export function createAnchorRepository(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
): AnchorRepository
export const anchorRepository: AnchorRepository // backed by window.localStorage

// src/features/today/TodayPage.tsx
function TodayPage(props: { today?: Date }): JSX.Element
```

## Test strategy

| AC | Covered by | Test type |
|---|---|---|
| AC1 | T3 | component (`TodayPage`, no anchor stored) |
| AC2 | T1, T4 | unit (`getRotationDay`) + component (`today` = 2026-10-04) |
| AC3 | T1, T4 | unit + component (`today` = 2026-10-06) |
| AC4 | T1, T4 | unit + component (`today` = 2026-10-07) |
| AC5 | T1, T4 | unit + component (`today` = 2026-10-18) |
| AC6 | T5 | component (badge present/absent on the two 2026-10-07 meals) |
| AC7 | T6 | component (edit the anchor input, assert meals/cook-flag change) |
| AC8 | T7 | manual check at 360px (`npm run dev`); no automated test |

## Risks

- The shared nav bar and the `/ma` route are additive plumbing the spec
  text doesn't literally describe — needed only so the new screen is
  reachable; `/` and spec 002's catalog are unchanged.
- `getRotationDay`'s UTC-day-number normalization is the one piece of real
  logic risk (DST, month/year rollovers) — covered by unit tests at each
  concrete AC date plus the 14-day wraparound (AC5), not just one happy path.
- Anchor input validation (must be a Sunday) is inferred from the spec's
  "Data & rules" statement that the anchor is always a Sunday, not from a
  numbered AC — kept minimal (reject + inline message), not a full form
  library.
