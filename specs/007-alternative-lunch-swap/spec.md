# 007 – Alternative lunch swap

Status: implemented
Depends on: 002, 003, 004

## Problem

The 2-week rotation locks lunch to the same 4 recipes, cycle after cycle. The
project already has 5 "alternative" lunch recipes in `data/source/` for
exactly the moments the cook wants variety, but today they're only
browsable (spec 002) — picking one has no effect on what the Today screen
shows or what ends up on the shopping list. The cook has no way to actually
use them without manually remembering, every time that block comes around,
to cook something else and buy different ingredients.

## User stories

- As the cook, I want to pick an alternative lunch for one of the 4 rotation
  blocks, so that block uses it from now on instead of the original recipe,
  without me having to remember the exception each cycle.
- As the cook, I want to revert a block back to its original rotation lunch,
  so a swap isn't a one-way decision.
- As the shopper, I want the shopping list to reflect whichever lunch is
  actually active for each block, so I don't buy ingredients for a recipe
  we're not cooking, and don't forget ingredients for the one we are.

## Scope

In scope:
- For each of the 4 rotation lunch blocks, showing which lunch recipe is
  currently active for it (the block's default rotation recipe, or a
  previously chosen alternative) and letting the cook change it to any of
  the 5 `alternative`-mealType recipes, or back to the block's own default.
- Persisting the active lunch per block (one active lunch per block at a
  time; choosing a new one replaces whatever was active), surviving reload,
  until explicitly changed again — a swap does not expire or auto-revert.
- The Today screen (spec 003) showing whichever lunch is currently active
  for the block covering today, instead of always the fixed rotation
  recipe.
- Updating the shopping list (spec 004) so it reflects the active lunch per
  block: removing the swapped-out recipe's per-person ingredient quantities
  from the shopping-list lines they were part of, and adding the
  swapped-in recipe's per-person ingredient quantities to the matching (or,
  for a new ingredient, newly added) line — in the trip(s) that block's
  lunch belongs to (see Data & rules) and under an existing category in
  that trip.
- Reusing the existing gluten-risk badge rule (spec 002/004) on any
  newly-added shopping-list line.
- Reusing spec 002's catalog as where alternatives are browsed before
  swapping — no new browsing screen.

Out of scope:
- Any warning or block based on a calorie/macro mismatch between the
  swapped-in recipe and the block's original ~749–826 kcal target — the
  recipe's own kcal is shown (spec 002), nothing more.
- Breakfast or dinner swaps — no `alternative`-mealType recipes exist for
  those meal types today.
- A one-off "just for today" override — every swap is persistent until
  manually reverted; there is no auto-expiring mode.
- Introducing new shopping-list categories — a newly-added ingredient
  always files under an existing category already used in that trip (e.g.
  a fish ingredient under "Hús, hal, tojás"). If a swapped-in ingredient
  doesn't fit any existing category in that trip, that's a planning
  decision for `/plan-spec`, not resolved here (see Open questions).
- Changing the fixed block → recipe rotation table itself (spec 003's
  mapping) — a swap only changes which recipe's quantities currently count
  for that block's lunch slot, not the table.
- Recomputing the whole shopping list from all 18 recipes' ingredients —
  only the active lunch's own ingredient delta is applied on top of the
  existing, document-derived list from spec 004.
- `extra`-mealType recipes (e.g. "Mézes-mustáros sült oldalas") — not
  swappable; only the 5 `alternative`-mealType lunches are.
- Any multi-user or per-person swap state — one shared swap state for the
  whole family plan, same as every other setting in this app.

## Acceptance criteria

- **AC1** – Given no swap has ever been made, when the cook opens the swap
  picker, then it shows all 4 blocks each with its default rotation lunch
  as "active" (block 1 "Gulyásleves", block 2 "Húsos zöldséges passata",
  block 3 "Savanyú lencseleves", block 4 "Paradicsomos húsgombóc"), and for
  each block the 5 alternatives are offered as choices.

- **AC2** – Given the cook sets block 2's active lunch to "Sült lazacfilé
  citromos burgonyapürével és gőzölt brokkolival", when the Today screen
  (spec 003) is viewed on a date inside block 2 (e.g. 2026-10-07, per spec
  003's anchor example), then it shows lunch "Sült lazacfilé citromos
  burgonyapürével és gőzölt brokkolival" instead of "Húsos zöldséges
  passata"; viewing it again 14 days later, when the cycle reaches block 2
  again, still shows the swapped-in recipe — the swap did not expire.

- **AC3** – Given block 2's active lunch from AC2, when the cook reverts
  block 2 back to its default, then the swap picker shows "Húsos zöldséges
  passata" as block 2's active lunch again, and the next time the Today
  screen shows block 2 it shows "Húsos zöldséges passata".

- **AC4** – Given block 2 is already swapped to "Sült lazacfilé...", when
  the cook picks a different alternative for block 2 (e.g. "Tonhalas
  gluténmentes tésztasaláta zöldségekkel"), then block 2 has exactly one
  active lunch afterward (the tuna salad) — the salmon swap is replaced,
  not added alongside it.

- **AC5** – Given block 2's lunch is swapped from "Húsos zöldséges passata"
  (500 g darált hús, 960 g csicseriborsó, 500 g sárgarépa, 500 g cukkini,
  1000 g paradicsom passata, per person) to "Sült lazacfilé...", when the
  shopping list (spec 004) is viewed at family size 1, then: the pantry
  trip's "darált hús" line drops from 1300 g to 800 g (passata's 500 g
  share removed; block 4's "Paradicsomos húsgombóc" 800 g share is
  untouched); the pantry trip's "csicseriborsó (konzerv)" line (960 g,
  used only by passata) disappears entirely, since no remaining active
  recipe needs it; the pantry trip's "paradicsom passata" line drops from
  1500 g to 500 g (húsgombóc's share only); and the fresh week-1 trip's
  "sárgarépa" and "cukkini" lines (500 g each, used only by passata)
  disappear.

- **AC6** – Continuing AC5's swap, when the shopping list is viewed, then
  the fresh week-1 trip's "Hús, hal, tojás" category gains a new "lazacfilé"
  line at 640 g per person, its "Zöldség, gyümölcs" category gains a new
  "brokkoli" line at 400 g per person, and its existing "burgonya" line
  increases from 500 g to 1300 g per person (500 g still needed for block
  1's "Gulyásleves" + 800 g newly needed for the salmon dish, summed into
  the one line rather than listed twice).

- **AC7** – Given any block is swapped to "Tonhalas gluténmentes
  tésztasaláta zöldségekkel", when its "gluténmentes tészta" (280 g per
  person) line is added to the shopping list, then it shows the same
  gluten-risk badge used elsewhere (spec 002/004), per that ingredient's
  `mustBeGlutenFree: true` flag.

- **AC8** – Given a shopping-list item was checked before a swap removes it
  from the list (AC5), when the swap takes effect, then that item's checked
  state is gone along with the item; given a swap adds a new item (AC6),
  then that new item starts unchecked.

- **AC9** – Given the cook's chosen active lunch per block, when the page
  is reloaded, then every block still shows the same active lunch as before
  the reload (same persistence guarantee as the cycle anchor in spec 003
  and the family size in spec 004).

- **AC10** – Given the swap picker and its effect on the Today and shopping
  screens, when viewed at 360px width, then everything is fully readable
  with no horizontal scrolling, and the controls for choosing/reverting a
  block's lunch are large enough for one-handed phone use (constitution
  principle 3).

## Data & rules

- The 5 swappable recipes are exactly the `alternative`-mealType recipes in
  `src/data/recipes.json`: "Csirkés rizses egytálétel zöldségekkel", "
  Fokhagymás-citromos sertésszelet burgonyapürével és sárgarépával", "Sült
  csirkemell rizzsel és sült zöldségekkel", "Sült lazacfilé citromos
  burgonyapürével és gőzölt brokkolival", "Tonhalas gluténmentes
  tésztasaláta zöldségekkel". `extra`-mealType recipes are never offered.
- Block → trip mapping for the shopping-list delta, inherited from spec
  003's block definitions and spec 004's trip structure: block 1 and 2's
  lunch ingredients draw from the pantry trip (2-week-wide items) and the
  fresh week-1 trip; block 3 and 4's draw from the pantry trip and the
  fresh week-2 trip. A swap only ever changes lines in the trip(s) that
  belong to the swapped block.
- The delta is computed from each recipe's own structured ingredient list
  (`src/data/recipes.json`, already per-person) — not by re-parsing
  `gf-bevasarlolista-2het.md`. Per spec 004, that document's line for a
  given ingredient is, by construction, the sum of every active recipe's
  own amount for it; removing a recipe subtracts exactly its amount from
  each line it contributed to, adding one adds exactly its amount, and a
  line that reaches 0 is removed rather than shown as "0 g". This holds
  even when a line is shared with a recipe outside this feature's scope
  (e.g. the pantry "gluténmentes kenyér/zsemle" line is also fed by two
  dinner sandwich recipes — a lunch swap only ever subtracts/adds the lunch
  recipe's own share of such a line).
- A pantry line that also has a freezer-reminder line in a fresh trip
  (spec 004's "+ N g ... a fagyasztóból kiolvasztva" pattern, e.g. "pörköltnek
  való sovány hús") moves together: subtracting a block's recipe's share
  from the pantry total also removes or reduces that block's trip's
  reminder line by the same amount.
- New ingredients introduced by a swapped-in recipe are added to whichever
  existing category in the relevant trip they naturally belong to, using
  the same categories the source document already uses in that trip (e.g.
  "Hús, hal, tojás", "Zöldség, gyümölcs", "Tejtermékek"). This spec assumes
  every ingredient across the 5 alternatives fits an existing category in
  the trip(s) it would land in — true for all 5 recipes' current
  ingredients.
- Gluten-risk badge rule for any added line: unchanged from spec 002/004 —
  driven purely by the ingredient's existing `mustBeGlutenFree` flag.
- No guardrail on kcal mismatch: the swapped-in recipe's own `macros.kcal`
  is simply whatever spec 002 already shows for it; this feature adds no
  comparison to the block's original kcal.
- Checked-state handling: a shopping-list item's checked state is keyed to
  that item's existence in a trip; an item removed by a swap loses its
  checked state, a newly-added item starts unchecked (consistent with spec
  004's per-item, per-trip checked state).

## Open questions

- [ ] If a future alternative recipe introduces an ingredient that doesn't
  fit any existing category in its trip, where does it go? Not resolved
  here — raise it in `/plan-spec` if it comes up; none of the current 5
  alternatives hit this case.
