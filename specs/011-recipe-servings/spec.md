# 011 – Recipe portion scaling

Status: implemented
Depends on: none

## Problem

A recipe's ingredient amounts are fixed numbers as authored (e.g. 1000 g meat
for the gulyásleves "4 napi adagra" batch). If the family wants to cook more
or less than the recipe's as-written yield, they have to do the multiplication
by hand for every ingredient on the recipe detail page. The recipe's own
"yield" label (`servingsLabel`) is free text and not uniform — some recipes
state a single-person daily portion ("1 adagra"), some a multi-day batch
("4 napi adagra"), one a people count ("4 főre") — so any scaling control must
work off the number actually written into that label, not assume it always
means "people".

## User stories

- As the person cooking, I want to bump a recipe's portion count up or down on
  its detail page and see every ingredient amount recalculate immediately, so
  I don't have to do the multiplication myself when I'm making more or less
  than the recipe's as-written batch.
- As the person cooking, I want the recipe to remember the portion count I
  last chose when I come back to it, so I don't have to re-enter it every time
  I open the same recipe during the week.

## Scope

In scope:
- A portion-count stepper (+/-) on the recipe detail page
  (`/receptek/:id`-style route), defaulting to 4 portions for every recipe.
- Live recalculation of every scalable ingredient amount shown on that page as
  the count changes.
- Persisting the chosen count per recipe (per recipe id), so it's remembered
  the next time that recipe is opened.

Out of scope:
- The shopping list's existing family-size setting
  (`zero-gluten:family-size`, default 1) — this feature does not read from,
  write to, or otherwise affect it. The two numbers may legitimately disagree.
- The recipe catalog list view — portion scaling only appears on the detail
  page, not on catalog cards.
- Any change to the source recipe data in `data/source/` or to the recipe
  macros/kcal figures shown per portion — those stay as authored.
- Re-deriving the shopping list from scaled recipe amounts.

## Acceptance criteria

- **AC1** – Given a recipe detail page is opened for the first time, when the
  page renders, then the portion control shows **4** and every scalable
  ingredient amount is shown at `authored amount × (4 / baseCount)`, where
  `baseCount` is the first integer found in that recipe's `servingsLabel`.
  Example: the gulyásleves recipe (`servingsLabel: "4 napi adagra"`,
  `baseCount = 4`) shows its authored amounts unchanged at the default
  (1000 g meat, 500 g potato, …), since `4 / 4 = 1`.

- **AC2** – Given a recipe whose `baseCount` differs from 4, when its detail
  page opens at the default, then amounts are scaled accordingly. Example: the
  "Laza proteines zabkása" breakfast (`servingsLabel: "1 adagra"`,
  `baseCount = 1`) shows **280 g** gluten-free oats (authored 70 g × 4), not
  70 g, at the default portion count of 4.

- **AC3** – Given the portion control, when the user presses `+` or `-`, then
  the displayed count changes by 1 and every scalable ingredient amount
  recalculates immediately using the new `count / baseCount` factor, with no
  page reload. Example: pressing `-` three times on the gulyásleves page
  (4 → 1) shows 250 g meat (1000 g × 1/4), 125 g potato (500 g × 1/4).

- **AC4** – Given the portion control is at its minimum of **1**, when the
  user presses `-` again, then the count does not go below 1 and the `-`
  control is disabled. Given the portion control is at its maximum of **20**,
  when the user presses `+` again, then the count does not go above 20 and the
  `+` control is disabled.

- **AC5** – Given an ingredient with no numeric amount (`amount: null`, e.g.
  "só, bors ízlés szerint" / salt and pepper to taste), when the portion count
  changes, then that ingredient's displayed line is unaffected by scaling at
  any portion count.

- **AC6** – Given an ingredient authored as a free-text range via
  `amountText` (e.g. "3-4 evőkanál méz", stored as `amount: 3` with
  `amountText: "3-4"`), when the portion count is changed away from the
  recipe's `baseCount`, then the ingredient displays the scaled numeric
  `amount` value, not the original range text. Example: the ribs recipe
  (`servingsLabel: "4 főre"`, `baseCount = 4`) at a portion count of 6
  (`factor = 6/4 = 1.5`) shows **5 evőkanál méz** (3 × 1.5 = 4.5, rounded to
  the nearest whole number per AC7), not "3-4 evőkanál méz".

- **AC7** – Given any scalable ingredient amount, when it is displayed at a
  portion count other than its `baseCount`, then the value is rounded to the
  nearest whole number for display (kitchen-practical quantities, no
  decimals shown).

- **AC8** – Given a recipe detail page is left and reopened later (same
  device, same browser), when the page renders, then the portion control
  shows the count last chosen for that specific recipe, not the default of 4
  and not another recipe's last-chosen count.

- **AC9** – Given an ingredient flagged `mustBeGlutenFree` (e.g. the
  gulyásleves's gluten-free bread, or the zabkása's certified gluten-free
  oats), when its amount is scaled to any portion count, then its
  gluten-safety flag/badge continues to render exactly as it does unscaled —
  scaling never hides, removes or alters a gluten-risk flag.

## Data & rules

- `baseCount` for a recipe = the first integer that appears anywhere in its
  `servingsLabel` string (not necessarily the leading token — e.g.
  `"teljes tepsi, 4 napi adagra"` → `baseCount = 4`). Every recipe currently
  in `src/data/recipes.json` contains exactly one such integer (always `1` or
  `4` today), so this rule is unambiguous for all 18 existing recipes.
- Scale factor = `chosenCount / baseCount`. Applies uniformly to every
  ingredient's numeric `amount`, regardless of unit (g, ml, evőkanál, gerezd,
  pcs, …) — see conventions in `CLAUDE.md` (quantities are plain numbers in
  base units; formatting/scaling is a UI-layer concern, not a data concern).
- The control is labeled using the recipe's own vocabulary ("adag" / portion),
  not "fő" / people — e.g. "4 adag" with +/- buttons — since the underlying
  number is a yield multiplier, not a headcount, and calling it "people" would
  misrepresent batch-style recipes like the gulyásleves (whose "4" means 4
  daily portions consumed across 4 days, not 4 people at once).
- `servingsLabel` itself is never rewritten or hidden — it keeps showing the
  recipe's original authored text so the "as written" framing (e.g. "4 napi
  adagra") stays visible alongside the live portion count.
- Range-style ingredients (`amountText` set) lose their range text once any
  scaling away from `baseCount` is in effect (AC6); at exactly `baseCount`
  (i.e. factor = 1, the recipe's own as-written yield), the original
  `amountText` is shown unchanged, same as today.
- Minimum portion count: **1**. Maximum: **20**. Both bounds are enforced by
  disabling the respective +/- button, not by silently clamping a typed value
  (there is no free-text entry in scope — only +/- buttons per AC3/AC4).
- Rounding: nearest whole number, standard rounding (0.5 rounds up).
- Persistence key is per recipe id (not global), separate from
  `zero-gluten:family-size`.

## Open questions

- [ ] None outstanding — all scope and edge-case decisions above were
  confirmed with the user during the `/spec` interview (2026-10-05).
