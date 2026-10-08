# 013 – Saved-state repository consistency

Status: approved
Depends on: none

## Problem

The app saves several independent pieces of state in the browser between visits:
which lunch swaps are chosen, how many portions were last set for a recipe, which
label-checklist items are checked off, and which shopping-list items are checked
off. Each of these was built separately, and each re-implements its own version of
the same small contract: read a saved value back, fall back to a sensible default
when nothing is saved yet, and recover gracefully if the saved value is corrupted
rather than crashing the app.

Because that contract is implemented four times instead of once, there's no
guarantee the four pieces of state behave the same way in the cases that matter
most — missing data and corrupted data. A fix made to how one of them recovers from
a bad save is easy to forget to apply to the other three, and a new piece of saved
state added later has nothing to copy that is known to be correct and tested, other
than "copy whichever one looks closest."

## User stories

- As the person using the app day to day, I want my saved swaps, portion counts,
  and checked-off items to survive a bad or corrupted save the same way everywhere,
  so a glitch in one part of the app (e.g. a half-written save during a crash)
  never corrupts the whole app session.
- As the maintainer, I want the "read a saved value, falling back safely on missing
  or corrupted data" behavior defined and tested in one place, so a future feature
  that needs to save a new piece of state can reuse behavior that's already proven,
  instead of writing a fifth copy.

## Scope

In scope:
- The read/fall-back/recovery behavior for: lunch-swap choices, recipe portion
  counts, label-checklist checked items, and shopping-list checked items.
- Keeping each of the four features' own saved data shape, default value, and
  storage key exactly as they are today.

Out of scope:
- Any change to what is stored, where it is stored (the browser's local storage
  stays the only storage location), or any saved data's shape or default value.
- Any user-visible behavior change — this is a behavior-preserving consolidation,
  not a feature.
- Introducing a swappable storage backend, a generic "repository" type usable for
  storage other than local storage, or any abstraction aimed at a future storage
  backend. Local storage already works offline; nothing in the current backlog
  (see spec 008, not yet built) requires a second storage backend, so none should
  be designed in now.

## Acceptance criteria

- **AC1** – Given nothing has been saved yet for a given recipe's portion count
  (e.g. gulyásleves, `data/source/gf-ebed-gulyasleves.md`), when the recipe detail
  page reads the saved portion count, then it falls back to the recipe's existing
  default portion count, exactly as it does today.

- **AC2** – Given a saved value for any one of the four state pieces (lunch swaps,
  portion counts, label-checklist items, shopping-list checked items) is present
  but corrupted (not valid, parseable data), when the app reads it, then it
  recovers by falling back to that feature's default value rather than throwing an
  error or crashing the page — and this recovery behaves identically across all
  four, not just the ones that already happen to handle it today.

- **AC3** – Given a saved value exists and is valid for any of the four state
  pieces, when the app reads it back, then the value returned is unchanged from
  today's behavior (no regression in the normal, non-corrupted case).

- **AC4** – Given the full existing test suites for lunch swaps, portion counts,
  label checklist, and shopping-list checked items, when this consolidation is
  implemented, then every existing test still passes with its original intent
  unchanged, and the shared read/fall-back/recovery behavior itself has its own
  passing unit tests independent of any one feature.

## Data & rules

- The four saved-state pieces and their current default values stay exactly as
  defined today: lunch-swap choices default to "no swap chosen", recipe portion
  counts default to each recipe's own default portion count (e.g. gulyásleves,
  `data/source/gf-ebed-gulyasleves.md`, servings label "4 napi adagra"), and both
  checklist-style states (label checklist, shopping-list checked items) default to
  "nothing checked."
- "Corrupted" means the saved value cannot be parsed back into the shape the
  feature expects (e.g. invalid JSON, or JSON of the wrong shape) — not a value
  that is merely stale or out of range, which each feature already handles on its
  own terms today and which this spec does not change.
- No gluten-safety acceptance criterion applies here: none of these four saved
  state pieces display an ingredient, product, or gluten-risk signal themselves —
  they only store a choice (a swap, a count, a checked flag) made elsewhere.

## Open questions

- [ ] None outstanding — scope (all four pieces of saved state), the "tests only"
  done bar, and the explicit exclusion of a swappable storage backend were all
  confirmed with the user during the `/spec` interview (2026-10-08).
