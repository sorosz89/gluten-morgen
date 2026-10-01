# 005 – Implementation plan

Spec: ./spec.md

## Approach

Add one new domain function, `getSchedule(anchor, today, days = 7)`, next to
the existing `getRotationDay` in `src/domain/rotation.ts`. It reuses the
same private `OFFSET_TO_BLOCK` / `COOK_OFFSETS` / `toUtcDayNumber` internals
`getRotationDay` already uses (per the spec: "it does not change how blocks
or cook days are computed"), and additionally derives, per day, the block's
fixed length (3 or 4 days) and the day's 1-indexed position within that
block, using a new `BLOCK_LENGTHS` lookup and `OFFSET_TO_BLOCK.indexOf(block)`
to find the block's start offset (safe here because each block number
occupies exactly one contiguous run in the 14-slot array).

`getRotationDay` itself is left untouched — no risk to its existing
passing tests.

A new feature page, `src/features/schedule/SchedulePage.tsx`, follows
`TodayPage.tsx`'s exact shape: reads `anchorRepository.getAnchor()`, and
when set, renders `getSchedule()`'s 7 entries as a list, looking up each
block's breakfast/lunch/dinner recipes via `getBlockRecipeIds()` +
`recipesById` and reusing `recipeHasGlutenRiskIngredient()` for the badge,
exactly as `TodayMeals` does today. Styling mirrors `ShoppingPage.module.css`
(flex-wrap rows, explicit `min-height: 44px` on interactive/link elements,
`max-width: 100%` on the page) — no media queries, matching the existing
no-breakpoint convention.

**Assumption flagged to the user and accepted**: AC7 says the empty-anchor
state shows "the same first-run anchor prompt as spec 003's Today screen...
instead of any schedule data," while the Scope section says this feature
"does not add a second place to set [the anchor]." Resolved by showing the
same informational sentence TodayPage shows, plus a link to `/ma` to
actually set it — not a duplicate `<form>`.

New route `/heti-terv` ("Heti terv") added to `App.tsx`'s nav, alongside
`Ma`/`Lista`/`Receptek` — short two-word style matching the existing nav
items.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `src/domain/rotation.ts` | changed | add `ScheduleDay` type, `BLOCK_LENGTHS`, `getSchedule()` |
| `src/domain/rotation.test.ts` | changed | unit tests for `getSchedule()` (AC1, AC3, AC4, wraparound) |
| `src/features/schedule/SchedulePage.tsx` | new | renders the 7-day schedule |
| `src/features/schedule/SchedulePage.module.css` | new | layout, mirrors `ShoppingPage.module.css` |
| `src/features/schedule/SchedulePage.test.tsx` | new | RTL tests (AC1, AC2, AC3, AC4, AC5, AC7) |
| `src/App.tsx` | changed | add `/heti-terv` route + nav link |

## Types & interfaces

```ts
// src/domain/rotation.ts
export interface ScheduleDay {
  date: Date
  block: BlockNumber
  cookToday: boolean
  dayInBlock: number       // 1-indexed position within the current block
  blockLength: number      // 3 or 4, from BLOCK_LENGTHS
  isLastDayOfBlock: boolean
}

export function getSchedule(anchor: Date, today: Date, days?: number): ScheduleDay[]
```

## Test strategy

- **Domain (unit, Vitest)** — `rotation.test.ts`:
  - `getSchedule(anchor 2026-10-04, today 2026-10-04)` returns 7 entries,
    dates `2026-10-04`..`2026-10-10`, blocks/cookToday matching spec AC1's
    table.
  - Entry for `2026-10-06`: `block: 1, dayInBlock: 3, blockLength: 3,
    isLastDayOfBlock: true` (AC3).
  - Entry for `2026-10-10`: `block: 2, dayInBlock: 4, blockLength: 4,
    isLastDayOfBlock: true` (AC4).
  - Bonus (not a numbered AC, but covers the spec's documented wraparound
    rule): a window starting `2026-10-16` continues correctly into
    `2026-10-18` (next cycle's block 1, cook day) — same case spec 003's
    AC5 already exercises for `getRotationDay`.
- **Component (RTL)** — `SchedulePage.test.tsx`, following
  `TodayPage.test.tsx`'s exact pattern: real `anchorRepository` +
  `localStorage.clear()` in `beforeEach`, a `today` prop for a fixed date,
  wrapped in `MemoryRouter`:
  - No anchor set → prompt shown, no schedule rows (AC7).
  - Anchor `2026-10-04`, today `2026-10-04` → 7 rows with correct
    date/weekday/block/cook-flag; today's row (block 1, cook day) lists
    "Gyümölcsös joghurtos magmix" / "Gulyásleves" / "Sonkás tükörtojás"
    (AC1, AC2).
  - Row for `2026-10-06` shows day 3/3 + last-day flag; row for
    `2026-10-10` shows day 4/4 + last-day flag; a mid-block row (e.g.
    `2026-10-05`) shows day 2/3 with no last-day flag (AC3, AC4).
  - Row for `2026-10-07`: dinner "Melegszendvics" shows the gluten badge,
    lunch "Húsos zöldséges passata" does not (AC5).
- **Manual check** — AC6 (360px/tap targets): no automated test, same
  precedent as spec 003 T7 / spec 004 T7 ("jsdom doesn't do real layout").
  Verified by hand in the running app and the result recorded in the task
  list + commit message.

## Risks

- **AC7 interpretation** (see Assumption above) — low risk, easy to adjust
  either direction (add the form, or swap the link text) without touching
  the domain layer.
- **Route/label naming** (`/heti-terv`, "Heti terv") — cosmetic, trivial to
  rename.
- Date arithmetic (crossing month/cycle boundaries) reuses the same native
  `Date` + `toUtcDayNumber` approach `getRotationDay` already relies on, so
  it inherits no new risk — covered by the wraparound unit test above.

## Verification

- `npm run check` (typecheck + lint + test) green after each task.
- Manually run `npm run dev`, open `/heti-terv` with and without an anchor
  set, confirm the 7-day list, last-day flags, gluten badge, and layout at
  360px width in dev tools.
