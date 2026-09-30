# 003 – Rotation & "Today" screen

Status: approved
Depends on: 001, 002

## Problem

The 2-week, 4-block rotation from `data/source/gf-etrend-attekintes.md` exists
only as a table in a markdown file. The person cooking needs the app to work
out, for right now, which of the 12 rotation recipes to eat today and whether
today is a cooking day or a "just eat what's already made" day — without
mentally tracking where in the 2-week cycle the family currently is.

## User stories

- As the cook, I want to open the app and immediately see today's breakfast,
  lunch and dinner, so I don't have to remember which week/block we're in.
- As the cook, I want a clear yes/no answer to "do I need to cook today?", so
  I know whether to start a bulk-cooking session or just reheat/serve what's
  already made.
- As the planner, I want to tell the app once which real calendar week starts
  the rotation, so "today" always lines up with the right block afterwards.

## Scope

In scope:
- A "Today" screen showing today's breakfast, lunch and dinner recipe (title,
  linking to its spec-002 detail page) and a single "cook today?" indicator
  for the day.
- A one-time setting where the user picks the Sunday that starts week 1 of
  the rotation ("the cycle anchor"), persisted so it doesn't need re-entry.
  The user can revisit and change it later.
- A first-run prompt to pick the anchor when none has been set yet, shown
  instead of meal data.
- The block → recipe mapping and the block boundaries are fixed by the
  domain data (see Data & rules) — the feature only computes "which block is
  today" and "is today a cook day", it does not let the user reassign which
  recipe belongs to which block/day.
- Reusing spec 002's gluten-risk badge rule on today's three meal entries.

Out of scope:
- Editing which recipe is assigned to which block (fixed rotation table).
- Swapping in an "Alternatíva" recipe for today (backlog #007).
- The shopping list and scaling quantities to family size (backlog #004).
- A cooking/thaw schedule spanning multiple future days (backlog #005).
- Any "day 2 of 3 in this block" or leftovers-remaining indicator — today's
  screen shows only today's meals and the cook flag, nothing else.
- Time zone handling beyond the device's local date; offline support
  (tracked separately, backlog #008).

## Acceptance criteria

- **AC1** – Given no cycle anchor has ever been set, when the user opens the
  Today screen, then it shows a prompt to pick the Sunday that starts week 1
  of the rotation, and no meal or cook-today information is shown until one
  is chosen.

- **AC2** – Given the cycle anchor is set to Sunday 2026-10-04 (week 1
  start), when today's date is 2026-10-04, then the Today screen shows
  breakfast "Gyümölcsös joghurtos magmix", lunch "Gulyásleves", dinner
  "Sonkás tükörtojás" (block 1's recipes), and "cook today?" = igen.

- **AC3** – Given the same anchor, when today's date is 2026-10-06 (Tuesday,
  the last day of block 1), then the Today screen shows the same block 1
  meals as AC2, and "cook today?" = nem.

- **AC4** – Given the same anchor, when today's date is 2026-10-07
  (Wednesday), then the Today screen shows breakfast "Görög joghurtos-banános
  muffin dupla tojással", lunch "Húsos zöldséges passata", dinner
  "Melegszendvics" (block 2's recipes), and "cook today?" = igen.

- **AC5** – Given the same anchor, when today's date is 2026-10-18 (the
  Sunday 14 days after the anchor), then the Today screen again shows block
  1's meals with "cook today?" = igen — the rotation has wrapped back to week
  1 of the next cycle.

- **AC6** – Given today is 2026-10-07 as in AC4, when the day's dinner
  "Melegszendvics" renders, then it shows the same gluten-risk badge used in
  the spec-002 catalog (its "gluténmentes zsemle vagy kenyér" ingredient is
  flagged); when that same day's lunch "Húsos zöldséges passata" renders,
  then it shows no badge (no ingredient in that recipe is flagged).

- **AC7** – Given a cycle anchor is already set, when the user opens the
  settings for it, then they can see the currently configured anchor date
  and change it to a different Sunday, and the Today screen immediately
  reflects the new anchor.

- **AC8** – Given any state of this feature, when viewed at 360px width,
  then the Today screen (meals, cook indicator, and the anchor prompt/
  setting) is fully readable with no horizontal scrolling and tap targets
  large enough for one-handed phone use (constitution principle 3).

## Data & rules

- Source of truth for the schedule: `data/source/gf-etrend-attekintes.md`.
  The rotation is 14 real calendar days, blocks pinned to weekdays, not a
  free-floating day-counter:

  | Day offset from anchor | Weekday | Block | Cook today? |
  |---|---|---|---|
  | 0 | Sun | 1 | igen |
  | 1 | Mon | 1 | nem |
  | 2 | Tue | 1 | nem |
  | 3 | Wed | 2 | igen |
  | 4 | Thu | 2 | nem |
  | 5 | Fri | 2 | nem |
  | 6 | Sat | 2 | nem |
  | 7 | Sun | 3 | igen |
  | 8 | Mon | 3 | nem |
  | 9 | Tue | 3 | nem |
  | 10 | Wed | 4 | igen |
  | 11 | Thu | 4 | nem |
  | 12 | Fri | 4 | nem |
  | 13 | Sat | 4 | nem |

  Day offset = (today − anchor date) mod 14, where the anchor is always a
  Sunday. Offsets 14–27 map to the same row as 0–13 (the cycle repeats).
  Because blocks are pinned to real weekdays, "cook today?" is equivalently
  just "is today Sunday or Wednesday?" — the anchor is only needed to know
  *which* block (which recipes), not whether to cook.

- Block → recipe mapping (from `src/data/recipes.json`, `mealType` values
  `breakfast`/`lunch`/`dinner` — exactly these 12 recipes make up the
  rotation; `alternative` and `extra` recipes are never shown here):

  | Block | Breakfast | Lunch | Dinner |
  |---|---|---|---|
  | 1 | Gyümölcsös joghurtos magmix (`gf-reggeli-joghurtos-magmix`) | Gulyásleves (`gf-ebed-gulyasleves`) | Sonkás tükörtojás (`gf-vacsora-sonkas-tukortojas`) |
  | 2 | Görög joghurtos-banános muffin dupla tojással (`gf-reggeli-gorogjoghurtos-banan-muffin`) | Húsos zöldséges passata (`gf-ebed-husos-zoldseges-passata`) | Melegszendvics (`gf-vacsora-melegszendvics`) |
  | 3 | Túrós epres kevert süti (`gf-reggeli-turos-epres-suti`) | Savanyú lencseleves (`gf-ebed-savanyu-lencseleves`) | Sajtos szendvics (`gf-vacsora-sajtos-szendvics`) |
  | 4 | Laza proteines zabkása (`gf-reggeli-proteines-zabkasa`) | Paradicsomos húsgombóc (`gf-ebed-paradicsomos-husgomboc`) | Tojásos-avokádó saláta (`gf-vacsora-tojasos-avokado-salata`) |

- Gluten-risk badge rule: identical to spec 002 — driven purely by each
  ingredient's existing `mustBeGlutenFree` flag; this feature does not
  decide gluten risk, only reuses the rule.
- "Today" always means the device's local calendar date; no timezone
  conversion.

## Open questions

None — resolved during the interview:
- Wednesday's block-boundary overlap is resolved as start-day-inclusive,
  next-start-day-exclusive (block 1 = Sun–Tue, block 2 = Wed–Sat, etc.).
- The cycle anchor is a single Sunday the user sets once and can edit later,
  persisted client-side; not a fixed hardcoded date.
- Today screen scope is deliberately minimal: 3 meals + one cook flag, no
  "day X of block" indicator.
