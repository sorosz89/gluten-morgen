# 001 – Recipe data model & import

Status: draft (review it, then set to approved)
Depends on: 000

## Problem
Every feature (today's meals, recipe view, shopping list) needs the recipes as
typed, validated data. Today they are Hungarian markdown files in `data/source/`.
Parsing them at runtime is fragile, so we convert them once, at build time, into
JSON that is validated by a schema, and fail loudly if a file doesn't fit.

## User stories
- As the developer, I want recipes as typed data, so that features can't break
  on a typo in a markdown file.
- As the cook, I want every quantity and macro to match the original recipe, so I
  can trust the app over the paper.

## Scope
In scope:
- A `Recipe` domain type and matching Zod schema in `src/domain/recipe.ts`.
- A script `scripts/import-recipes.ts` (run with `npm run import`) that reads
  every recipe file in `data/source/` and writes `src/data/recipes.json`.
- Classification of each recipe: `breakfast | lunch | dinner | alternative | extra`,
  derived from the filename (`reggeli`, `ebed`, `vacsora`, `alternativ`, other).
- Flagging ingredients that must be bought gluten-free.

Out of scope:
- The rotation / meal plan (spec 003), the shopping list (spec 004), any UI.
- Parsing the overview and shopping-list files (they aren't recipes).

## Acceptance criteria
- **AC1** – Given the 18 recipe files in `data/source/` (all `.md` files except
  `gf-etrend-attekintes.md` and `gf-bevasarlolista-2het.md`), when I run
  `npm run import`, then `src/data/recipes.json` contains 18 recipes and every one
  passes the Zod schema.
- **AC2** – Given a recipe file with a missing required section (e.g. no
  "Hozzávalók"), when I run the import, then it exits non-zero and the error names
  the file and the missing section.
- **AC3** – Given `gf-ebed-gulyasleves.md`, then the imported recipe has
  `mealType: "lunch"`, `servingsLabel: "4 napi adagra"`, 8 ingredients,
  9 method steps, and macros `{ kcal: 822, proteinG: 65, carbsG: 77, saltMg: 670,
  fatG: 28, fiberG: 12 }`.
- **AC4** – Given an ingredient line like `- 1000 g pörköltnek való sovány hús, 2 cm-es
  kockákra vágva (…)`, then it is parsed to `{ amount: 1000, unit: "g",
  name: "pörköltnek való sovány hús", note: "2 cm-es kockákra vágva (…)" }`.
  Lines without a leading number (e.g. `só, bors ízlés szerint`) keep
  `amount: null, unit: null` and the full text as `name`.
- **AC5** – Given an ingredient written in bold (`**gluténmentes kenyér**`) or
  containing any keyword from the gluten-free watchlist (see Data & rules), then
  `mustBeGlutenFree: true`.
- **AC6** – Given the imported data, when a test searches all ingredient names,
  then none contain a forbidden term (`bulgur`, `kuszkusz`, `durum`, `búzaliszt`),
  unless it appears only inside a "do not use" note.
- **AC7** – `npm run check` passes and the import logic is covered by unit tests
  that use small inline markdown fixtures, not the real files.

## Data & rules
Recipe markdown shape (from the real files):
- `# Title (gluténmentes, 822 kcal/adag, 4 napra – …)` → title = text before the
  first ` (`; kcal from the heading if present.
- `## Idő és eszközök` → prep/cook time text and equipment list (optional section).
- `## Hozzávalók (…)` → the text in parentheses is `servingsLabel`. **Required.**
- `## Előkészület (mise en place)` → numbered list (optional).
- `## Elkészítés` → numbered list. **Required.** (Some files use a different
  heading for step sections, e.g. "Pácolás"; collect those as extra step groups.)
- `## Tipp` → free text (optional), may contain `*Forrás: …*` → `source`.
- `## Makró (…)` → `822 kcal | 65 g fehérje | 77 g szénhidrát | 670 mg só |
  28 g zsír | 12 g rost` (optional for "extra" recipes).
- `## Gluténmentességi megjegyzés` → free text (optional).

Gluten-free watchlist (case-insensitive substring): `gluténmentes`, `zab`,
`kenyér`, `zsemle`, `liszt`, `sonka`, `felvágott`, `fehérjekoncentrátum`,
`protein por`, `étcsoki`, `mustár`.

Numbers use Hungarian decimals (`0,5`) and ranges (`1,2–1,5 kg`, `2-3 evőkanál`).
For a range, store the lower bound in `amount` and the original text in `amountText`.

## Open questions
- [ ] Should `extra` (the oldalas recipe, 4 főre, not per person) be imported now
      or excluded until a spec needs it?
- [ ] Keep units as written (`evőkanál`, `db`, `gerezd`) or normalize to an enum?
