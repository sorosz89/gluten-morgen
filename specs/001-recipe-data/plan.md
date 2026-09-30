# 001 – Implementation plan

Spec: ./spec.md

## Approach

Parsing is **section-first, then line-level**, as pure functions in
`src/domain/`, separate from the Zod schema/types module.

1. Split raw markdown into `{ heading, body }` sections by scanning for
   `^## (.+)$` lines (title is line 1, `# …`).
2. Classify each section by heading **prefix**, not exact match (headings
   carry parentheticals): six known non-step prefixes (`Hozzávalók`,
   `Előkészület`, `Idő és eszközök`, `Tipp`, `Makró`, `Gluténmentességi
   megjegyzés`). **Every other heading becomes a step group, by
   elimination** — this makes `## Elkészítés`, the two zabkása variant
   headings (`## Elkészítés – hidegen (áztatva)` / `– melegen`), and the
   oldalas `## Pácolás (előző este)` / `## Sütés másnap` headings all fit
   the same `StepGroup[]` shape with no per-file special-casing. Within a
   step group's body: lines matching `^\d+\.\s+` become one step each;
   otherwise the whole body is a single one-element steps array (the
   oldalas `Pácolás` case, which is prose). Zero step-ish headings found at
   all → the "missing required step section" error.
3. `Idő és eszközök` and `Előkészület` are recognized only as section
   boundaries and dropped — no AC reads their content.
4. Errors surface via `RecipeImportError(fileName, reason)` thrown
   synchronously from the pure parser, filename + specific problem baked
   into the message — this is what AC2's test asserts directly. The CLI
   wraps `recipeSchema.parse(...)` too, rethrowing any `ZodError` as the
   same error type, so structural and schema-shape problems both funnel
   through one error type and one non-zero exit path.
5. Zod schema is the source of truth for types (`Recipe` etc. are
   `z.infer<>` results, not hand-duplicated interfaces).
6. AC6's forbidden-term list is **test-only**, not production code — no
   AC asks the importer to actively block forbidden ingredients, only that
   a test confirms none leaked into `name` fields. In the real data these
   terms occur only inside another ingredient's `note` (e.g. `rizs (… SOHA
   ne bulgur, kuszkusz vagy durum tészta …)`), so correct `name`/`note`
   splitting (AC4) makes AC6 pass "for free."
7. **No TS script runner needed**: `node scripts/import-recipes.ts` runs
   directly on this project's Node (v24.5.0) via native type-stripping —
   `tsconfig.app.json`/`tsconfig.node.json` already set
   `erasableSyntaxOnly: true` and `allowImportingTsExtensions: true` (from
   spec 000), which is exactly what that needs.
8. Wiring `scripts/` to import from `src/domain/` under `tsc -b` is done by
   widening `tsconfig.node.json`'s `include`, **not** by adding a
   `references` entry — a `references` entry to `tsconfig.app.json` fails
   with `TS6310` because that project has `noEmit: true`.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `src/domain/recipe.ts` | new | `MealType`/`Unit` enums; `ingredientSchema`, `stepGroupSchema`, `macrosSchema`, `recipeSchema` (Zod); types via `z.infer` |
| `src/domain/recipe.test.ts` | new | Schema-level tests: valid `Recipe` passes; missing `ingredients` fails; `amount`/`unit` null-mismatch fails the refine |
| `src/domain/recipeMarkdown.ts` | new | Pure parsing: `parseRecipeMarkdown`, `parseIngredientLine`, `splitSections`, `parseStepGroups`, `parseMacrosLine`, `classifyMealType`, `RecipeImportError` |
| `src/domain/recipeMarkdown.test.ts` | new | Unit tests over inline markdown fixtures (AC2, AC4, AC5, AC7) |
| `scripts/import-recipes.ts` | new | I/O only: `buildRecipes(sourceDir): Recipe[]` (reads `data/source/*.md`, excludes the 2 non-recipe files, parses + validates), `main()` writes `src/data/recipes.json`, non-zero exit + per-file error message on failure |
| `scripts/import-recipes.integration.test.ts` | new | Integration tests against the **real** `data/source/` (AC1, AC3, AC6) |
| `src/data/recipes.json` | new, generated & **committed** | Output of `npm run import`; the project ships data as static JSON (no backend), so committing matches that architecture |
| `package.json` | changed | add `zod`; add `"import": "node scripts/import-recipes.ts"` |
| `tsconfig.node.json` | changed | widen `"include"` to `["vite.config.ts", "scripts/**/*.ts", "src/domain/**/*.ts"]` (no `references` addition) |
| `scripts/.gitkeep`, `src/domain/.gitkeep` | removed | superseded by real files |

## Types & interfaces

```ts
// src/domain/recipe.ts
import { z } from 'zod'

export const mealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'alternative', 'extra'])
export type MealType = z.infer<typeof mealTypeSchema>

// Complete real unit vocabulary across all 18 files — no speculative members.
export const UNITS = ['g', 'kg', 'db', 'gerezd', 'evőkanál', 'tk'] as const
export const unitSchema = z.enum(UNITS)
export type Unit = z.infer<typeof unitSchema>

export const ingredientSchema = z
  .object({
    amount: z.number().nullable(),
    amountText: z.string().min(1).optional(), // only set when amount came from a range
    unit: unitSchema.nullable(),
    name: z.string().min(1),
    note: z.string().min(1).optional(),
    mustBeGlutenFree: z.boolean(),
  })
  .refine((i) => (i.amount === null) === (i.unit === null), {
    message: 'amount and unit must both be present or both be null',
  })
export type Ingredient = z.infer<typeof ingredientSchema>

export const stepGroupSchema = z.object({
  heading: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
})
export type StepGroup = z.infer<typeof stepGroupSchema>

export const macrosSchema = z.object({
  kcal: z.number(),
  proteinG: z.number(),
  carbsG: z.number(),
  saltMg: z.number(),
  fatG: z.number(),
  fiberG: z.number(),
})
export type Macros = z.infer<typeof macrosSchema>

export const recipeSchema = z.object({
  id: z.string().min(1), // filename without extension, e.g. "gf-ebed-gulyasleves"
  title: z.string().min(1),
  mealType: mealTypeSchema,
  servingsLabel: z.string().min(1),
  ingredients: z.array(ingredientSchema).min(1),
  stepGroups: z.array(stepGroupSchema).min(1),
  tip: z.string().min(1).optional(),
  source: z.string().min(1).optional(),
  macros: macrosSchema.optional(), // absent only for the oldalas recipe
  glutenFreeNote: z.string().min(1).optional(),
})
export type Recipe = z.infer<typeof recipeSchema>
```

`id` isn't required by any single AC but is the minimum needed for an array
of 18 records to be addressable by any future feature — a structural field,
not a speculative one.

```ts
// src/domain/recipeMarkdown.ts
export class RecipeImportError extends Error {
  constructor(fileName: string, reason: string) {
    super(`${fileName}: ${reason}`)
    this.name = 'RecipeImportError'
  }
}

export function classifyMealType(fileName: string): MealType
export function parseIngredientLine(rawLine: string, fileName: string): Ingredient
export function parseStepGroups(sections: Section[], fileName: string): StepGroup[]
export function parseMacrosLine(line: string, fileName: string): Macros
export function parseRecipeMarkdown(fileName: string, raw: string): Recipe
```

### Ingredient-line parsing algorithm

Input: bullet text with leading `- ` stripped, e.g.
`1000 g pörköltnek való sovány hús, 2 cm-es kockákra vágva (…)`.

1. `hasBold = /\*\*/.test(rawLine)` (checked **before** stripping `**`).
2. `clean = rawLine.replaceAll('**', '')`.
3. Match `/^(\d+(?:[.,]\d+)?(?:\s*[–-]\s*\d+(?:[.,]\d+)?)?)\s+(\S+)\s*(.*)$/`
   against `clean` (`–` = en dash; class also covers plain hyphen — real
   data mixes both, even within one file).
   - **No match** → `amount: null, unit: null`, `name = clean.trim()`, no
     note. (AC4's no-leading-number rule.)
   - **Match** → group1 = quantity text, group2 = candidate unit token,
     group3 = rest of line.
4. Look up group2 in `{ g, kg, db, gerezd, evőkanál, tk, teáskanál→tk }`.
   Not found → **throw `RecipeImportError`** naming the file and the bad
   unit (fail loud rather than silently discard a real quantity — matches
   the constitution's "don't invent/lose data" principle; never hit by the
   real 18 files, only exercised by an inline test fixture).
5. Range vs. single: group1 contains `–`/`-` → `amount` = lower bound
   (parsed), `amountText` = group1 verbatim; else `amount` = group1 parsed,
   no `amountText`.
6. Split group3 on the **first** comma: before = `name`, after (trimmed) =
   `note` (or `note` absent if no comma).
7. `mustBeGlutenFree = hasBold || WATCHLIST.some(term => (name + ' ' + (note ?? '')).toLowerCase().includes(term.toLowerCase()))`
   — `WATCHLIST` = the 10-term list from the spec (production code, since
   AC5 is a real runtime feature, unlike AC6's test-only forbidden list).

## Test strategy

- **AC1** (18 recipes, all schema-valid) — T6 integration test over real `data/source/`.
- **AC2** (missing section → non-zero, names file + section) — T4 inline fixture missing `## Hozzávalók`.
- **AC3** (gulyásleves exact shape) — T6, asserted against the real file.
- **AC4** (ingredient line parsing) — T2 table-driven inline-fixture tests, including the exact AC4 example line.
- **AC5** (gluten-free flagging) — T2, bold + each watchlist keyword.
- **AC6** (forbidden terms only in `note`, never `name`) — T6, scanned across all 18 real recipes' `name` fields.
- **AC7** (`npm run check` green; tests use inline fixtures, not real files) — true throughout T1–T5 (T6 is the sole real-data consumer, by design).

## Risks

- Step-heading classification is by elimination over 6 known non-step
  prefixes — generalizes across all 18 files today, but a brand-new section
  heading in a future recipe file would silently become a step group.
- Unrecognized-unit → throw (T2) is a judgment call; never hit by real data
  either way, so low risk, but worth a comment in code since a "silently
  null it" alternative was considered and rejected.
- `tsconfig.node.json` widened `include` means `src/domain/*.ts` is
  type-checked under two separate TS programs (app + node) — harmless today
  since domain code has no DOM/JSX dependency.
- `Makró` line regex must stay whitespace-tolerant (`\s*` not exact
  spacing) since the label parenthetical varies across files even though
  the 6-field format itself is constant.
