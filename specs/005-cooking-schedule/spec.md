# 005 – Cooking schedule

Status: implemented
Depends on: 003

## Problem

Spec 003's Today screen answers "what do we eat today?" and "do I need to
cook today?", but only for today. The cook can't see further ahead — whether
tomorrow or the day after is a cook day, or how much longer the current
batch has to last before it runs out. Without that, planning when to start a
bulk-cooking session, or noticing a batch is about to run out, still
requires mentally tracking the 2-week rotation by hand.

## User stories

- As the cook, I want to see the next several days at a glance — which are
  cook days, which block each belongs to, and what's cooked on cook days —
  so I can plan ahead instead of only finding out the morning of.
- As the cook, I want to know how many days are left before the current
  batch runs out, so I notice in time rather than discovering an empty
  container at mealtime.

## Scope

In scope:
- A 7-day forward-looking schedule, starting today, showing for each day:
  its date, weekday, block number, whether it's a cook day, and — on cook
  days — the block's breakfast/lunch/dinner recipe names.
- A "which day of the current batch is this" indicator for every day shown
  (e.g. "day 2 of 3"), including a distinct flag on each batch's last day,
  since a block's length is 3 or 4 days depending on the block (see Data &
  rules).
- Reusing spec 002/003's gluten-risk badge on the recipe names shown here.
- Reusing the cycle anchor already configured in spec 003; this feature
  reads it, it does not add a second place to set it.

Out of scope:
- Freezer/thaw reminders. None of the 12 rotation recipes' source documents
  mention freezing a batch — each is cooked once and eaten from the fridge
  across its block. Confirmed with the user: not part of this feature.
- Marking a day or batch as "cooked" (done), or any other new persisted
  state — this feature is read-only, fully computed from the rotation and
  today's date, the same as spec 003's Today screen.
- Editing or reassigning which recipe belongs to which block (still fixed,
  same as spec 003).
- Swapping in an "Alternatíva" recipe for a given day (backlog #007).
- The shopping list and family-size scaling (backlog #004).
- A configurable look-ahead window — fixed at 7 days for this spec.
- Advance prep that spans into the day before a cook day (e.g.
  marinate-the-night-before). No recipe in the current 12-recipe rotation
  needs this; it only appears on `mezes-mustaros-sult-oldalas`, which is an
  "extra" recipe outside the rotation and therefore outside this feature.

## Acceptance criteria

- **AC1** – Given the cycle anchor is set to Sunday 2026-10-04 (as in spec
  003), when today's date is 2026-10-04 and the user opens the schedule,
  then it shows 7 days, 2026-10-04 through 2026-10-10, each with its date,
  weekday, block number, and cook-day flag.

- **AC2** – Given the same anchor and schedule, when the entry for
  2026-10-04 (Sunday, a cook day, block 1) is shown, then it lists block 1's
  three recipes: breakfast "Gyümölcsös joghurtos magmix", lunch
  "Gulyásleves", dinner "Sonkás tükörtojás" — consistent with spec 003 AC2.

- **AC3** – Given the same anchor and schedule, when the entry for
  2026-10-06 (Tuesday) is shown, then it is flagged as day 3 of 3 of block
  1's batch and marked as that batch's last day, because block 1 runs
  Sunday–Tuesday (3 days) and block 2 starts the next day.

- **AC4** – Given the same anchor and schedule, when the entry for
  2026-10-10 (Saturday) is shown, then it is flagged as day 4 of 4 of block
  2's batch and marked as that batch's last day, because block 2 runs
  Wednesday–Saturday (4 days) — demonstrating the indicator handles both the
  3-day and 4-day block lengths correctly within the same 7-day window.

- **AC5** – Given the same anchor and schedule, when the entry for
  2026-10-07 (Wednesday, a cook day, block 2) is shown, then its dinner
  "Melegszendvics" carries the same gluten-risk badge used in specs 002/003
  (its "gluténmentes zsemle vagy kenyér" ingredient is flagged), while that
  same day's lunch "Húsos zöldséges passata" shows no badge.

- **AC6** – Given any state of this feature, when viewed at 360px width,
  then the 7-day schedule is fully readable with no horizontal scrolling and
  tap targets large enough for one-handed phone use (constitution principle
  3).

- **AC7** – Given no cycle anchor has ever been set, when the user opens the
  schedule, then it shows the same first-run anchor prompt as spec 003's
  Today screen (AC1) instead of any schedule data.

## Data & rules

- Built entirely on spec 003's existing rotation domain
  (`getRotationDay`/block-offset table) — this feature adds a 7-day sliding
  window and a "day X of N" position within the current block, it does not
  change how blocks or cook days are computed.
- Block lengths (fixed, from the block → weekday mapping in spec 003's Data
  & rules table):
  | Block | Weekdays | Length |
  |---|---|---|
  | 1 | Sun–Tue | 3 days |
  | 2 | Wed–Sat | 4 days |
  | 3 | Sun–Tue | 3 days |
  | 4 | Wed–Sat | 4 days |
  "Day X of N" for a given date = 1 + (that date's offset from its block's
  start day); N = the block's length from the table above. The last day of
  a block is day N of N.
- The 7-day window always starts today and runs forward; it crosses the
  14-day cycle boundary the same way `getRotationDay` already wraps (e.g. a
  window starting 2026-10-16 continues past 2026-10-17 into 2026-10-18,
  which restarts block 1 of the next cycle — same wraparound spec 003 AC5
  already relies on).
- Gluten-risk badge rule: identical to specs 002/003 — driven purely by each
  ingredient's existing `mustBeGlutenFree` flag.

## Open questions

None — resolved during the interview:
- No freezer/thaw concept exists in the source recipes, so thaw reminders
  from the original backlog line are dropped from this spec.
- The look-ahead window is fixed at 7 days, not user-configurable.
- This feature is read-only/computed; no "mark as cooked" state is added.
