# 005 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [x] T1 – `getSchedule()` in the rotation domain (AC1, AC3, AC4)
  - Test first: add domain unit tests to `rotation.test.ts` —
    `getSchedule(anchor 2026-10-04, today 2026-10-04)` returns 7 entries
    matching AC1's table; entry for `2026-10-06` is `block: 1, dayInBlock:
    3, blockLength: 3, isLastDayOfBlock: true` (AC3); entry for
    `2026-10-10` is `block: 2, dayInBlock: 4, blockLength: 4,
    isLastDayOfBlock: true` (AC4); plus a wraparound test starting
    `2026-10-16` continuing correctly into `2026-10-18`.
  - Done when: `ScheduleDay`, `BLOCK_LENGTHS`, `getSchedule()` exported from
    `rotation.ts`; `getRotationDay` unchanged; `npm run check` green.
  - Note: `BLOCK_LENGTHS` is kept module-private (not exported) since
    nothing outside `rotation.ts` needs it directly — `ScheduleDay` already
    exposes `blockLength` per day.

- [x] T2 – SchedulePage skeleton, route, no-anchor state (AC1, AC2, AC7)
  - Test first: `SchedulePage.test.tsx` — no-anchor prompt case (no
    schedule rows); anchor-set case asserting 7 rows' dates/weekdays/
    blocks/cook-flags and today's 3 recipe titles for block 1.
  - Done when: `SchedulePage.tsx` created and wired into `App.tsx` at
    `/heti-terv` with a "Heti terv" nav link; reads the anchor, calls
    `getSchedule`, renders rows with recipe titles linking to
    `/recipes/:id` (same as `TodayMeals`); no anchor-setting form duplicated
    here — unset state links to `/ma` instead; `npm run check` green.
  - Note: also added an explicit test for block 2's cook day
    (2026-10-07) listing its three recipes, beyond the plan's minimum, to
    pin down the block→recipe lookup works for a block other than block 1.

- [x] T3 – Day-in-block / last-day indicator (AC3, AC4)
  - Test first: extend `SchedulePage.test.tsx` with the day-3/3-last-day
    (`2026-10-06`), day-4/4-last-day (`2026-10-10`), and mid-block
    (`2026-10-05`, day 2/3, no flag) assertions.
  - Done when: each row renders `dayInBlock`/`blockLength` and a distinct
    marker when `isLastDayOfBlock`; `npm run check` green.
  - Note: rendered as "`N`. nap / `blockLength`" plus an "Utolsó nap" badge
    on the last day, styled like the existing gluten-badge pill.

- [x] T4 – Gluten-risk badge reuse (AC5)
  - Test first: extend `SchedulePage.test.tsx` — for `2026-10-07`, dinner
    "Melegszendvics" shows the badge, lunch "Húsos zöldséges passata" does
    not.
  - Done when: rows reuse `recipeHasGlutenRiskIngredient` exactly as
    `TodayPage` does; `npm run check` green.

- [x] T5 – Responsive / tap-target pass (AC6)
  - Test first: none automated — jsdom doesn't do real layout; same
    approach as specs 002/003/004's final task.
  - Done when: `SchedulePage.module.css` follows the `ShoppingPage`
    flex-wrap + `min-height: 44px` + `max-width: 100%` pattern; manual
    360px check performed in the running app (no horizontal scroll, tap
    targets ≥44px) and the result recorded in this task and the commit
    message; `npm run check` green.
  - Manual check result: verified against `npm run dev` using a 360×740
    `<iframe>` (same technique as spec 004's T7, since the OS enforces a
    wider minimum Chrome window). `scrollWidth === clientWidth === 360` in
    both the no-anchor state and the 7-day schedule — no horizontal
    overflow. Tap-target bounding boxes: nav links (incl. the new "Heti
    terv") 23–63px wide × 44px tall; each meal row `<Link>` 312×56.8px
    (whole row, same full-card-is-a-link pattern as spec 003's fix) — all
    ≥44px. Found and fixed one real gap: the no-anchor prompt's inline
    `/ma` link was only 21.3×18.5px (just the word "Ma" inline in a
    sentence). Restructured so the whole explanatory sentence is itself
    the `<Link>`, styled like the meal-row links (`flex`, `align-items:
    center`, `min-height: 44px`) — now 312×44px.
