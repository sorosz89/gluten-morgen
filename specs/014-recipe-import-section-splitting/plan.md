# 014 – Implementation plan

Spec: ./spec.md

## Approach

`src/domain/recipeMarkdown.ts` and `src/domain/shoppingListMarkdown.ts` each
implement their own "split a markdown document into sections by heading"
function. The two implementations are character-for-character identical except
that the recipe version hardcodes a single heading regex (`/^##\s+(.+)$/`)
while the shopping-list version takes the regex as a parameter
(`headingRe: RegExp`) and is called twice — once over the whole document with
`TRIP_HEADING_RE` (`##`), then recursively over each trip's body with
`CATEGORY_HEADING_RE` (`###`).

The plan extracts one shared `splitSections(markdown, headingRe)` into a new
`src/domain/markdownSections.ts`, using the shopping-list module's existing
(more general) signature since it already handles both the single-level case
(pass a `##`-only regex) and the two-level case (call it twice with different
regexes). Both importers switch to calling the shared function with their own
existing regex constants, unchanged — `recipeMarkdown.ts` keeps
`/^##\s+(.+)$/` (named as a local constant, matching the shopping-list module's
style), and `shoppingListMarkdown.ts` keeps `TRIP_HEADING_RE`/
`CATEGORY_HEADING_RE` exactly as they are. Only the function body they call
moves.

`recipeMarkdown.test.ts`'s one direct import of `splitSections` (used as a
fixture-builder for `parseStepGroups` tests) is repointed at the new module —
a test-file-only change, not a behavior change. `shoppingListMarkdown.test.ts`
never imported its splitter directly (it's private/unexported there), so it
needs no import change. `shoppingListMarkdown.ts`'s private `RawSection` type
is dropped in favor of the shared `Section` type (identical shape, one name
instead of two).

No existing test exercises either `splitSections` in isolation today — both
are only exercised as fixture-builders or indirectly through end-to-end
parsing. The spec's AC5 wants the shared function to have its own direct
tests; this closes a real gap, not busywork.

Both `recipes.json` and `shoppingList.json` are checked into git (not
generated-only), so regenerating them via `npm run import` /
`npm run import:shopping` after the refactor and expecting an empty `git diff`
is a strong, exact way to confirm nothing changed — stronger than spot-
checking fixtures alone. The existing integration tests
(`scripts/import-recipes.integration.test.ts`,
`scripts/import-shopping-list.integration.test.ts`) that run the real
importers against `data/source/*.md` are re-run unmodified as the main
regression net.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `src/domain/markdownSections.ts` | new | Shared `Section` type + `splitSections(markdown, headingRe)` |
| `src/domain/markdownSections.test.ts` | new | Direct unit tests: single heading level, two nested levels, no-heading edge case |
| `src/domain/recipeMarkdown.ts` | changed | Local `splitSections`/`Section` removed; imports shared ones; same regex |
| `src/domain/recipeMarkdown.test.ts` | changed | Import of `splitSections`/`Section` repointed to `markdownSections.ts` |
| `src/domain/shoppingListMarkdown.ts` | changed | Local `splitSections`/`RawSection` removed; imports shared `splitSections`/`Section`; `TRIP_HEADING_RE`/`CATEGORY_HEADING_RE` unchanged |
| `src/domain/shoppingListMarkdown.test.ts` | unchanged | Never imported the splitter directly; existing fixtures re-run as regression check |
| `src/data/recipes.json`, `src/data/shoppingList.json` | regenerated, not hand-edited | Verification: `npm run import`/`import:shopping`, expect empty `git diff` |

## Types & interfaces

```ts
// src/domain/markdownSections.ts
export interface Section {
  heading: string
  body: string
}
export function splitSections(markdown: string, headingRe: RegExp): Section[]
```

`parseStepGroups` in `recipeMarkdown.ts` keeps taking `Section[]`, now imported
from the shared module instead of declared locally.

## Test strategy

- **AC1/AC4** (recipe parsed fields unchanged, for gulyásleves and every source
  file): existing `recipeMarkdown.test.ts` fixtures +
  `import-recipes.integration.test.ts` re-run unmodified, plus regenerating
  `recipes.json` and expecting an empty `git diff`.
- **AC2** (gulyásleves's gluten flag survives): same regenerated-`recipes.json`
  diff (the flag is part of that file) — an empty diff directly proves the
  flag is byte-identical, not just "probably fine."
- **AC3** (shopping list unchanged): existing `shoppingListMarkdown.test.ts`
  fixtures + `import-shopping-list.integration.test.ts` re-run unmodified,
  plus regenerating `shoppingList.json` and expecting an empty `git diff`.
- **AC5** (shared logic has its own tests + existing suites still pass): new
  `markdownSections.test.ts` directly tests both the single-level pattern
  (recipes' `##`) and the two-level nested pattern (shopping list's `##`/
  `###`, including "split the body of one section again with a different
  regex"); `npm run check` green confirms the rest.

## Risks

- `shoppingListMarkdown.ts`'s nested call (`splitSections(section.body,
  CATEGORY_HEADING_RE)`) depends on the same function handling a
  smaller/already-trimmed body correctly — low risk since it's the exact
  existing parameterized function, just relocated; covered by
  `markdownSections.test.ts`'s nested-level test case.
- Renaming `RawSection` → `Section` inside `shoppingListMarkdown.ts` touches
  several internal call sites (mapping over `categorySections`, etc.) —
  purely a type-name change, caught immediately by `tsc -b` if anything's
  missed.
- The "no heading at all" and "content before the first heading" edge cases
  are currently undocumented behavior (content before the first heading is
  silently dropped, per the `heading !== null` guard) — the plan preserves
  this exactly and adds a test naming it explicitly, rather than treating it
  as a bug to fix (out of scope: spec 014 is a zero-behavior-change refactor).
