# Zero Gluten – project memory

A gluten-free family meal-planning web app (Hungarian UI). The family eats one shared
gluten-free menu on a 2-week rotation, and the app shows what to eat and cook today,
the recipes, and a shopping list scaled to the family size.

## How we work: spec-driven development

Nothing gets implemented without a spec. The loop for every feature is:

1. `/spec <idea>`      → writes `specs/NNN-slug/spec.md` (WHAT and WHY, no code)
2. `/plan-spec NNN`    → run in **plan mode**; explores the code, proposes HOW,
                         then writes `plan.md` + `tasks.md` after I approve
3. `/implement-task NNN` → does ONE task from `tasks.md` at a time, test first
4. `/verify-spec NNN`  → checks every acceptance criterion against code + tests

Rules for Claude:
- Read `specs/constitution.md` before any spec or plan. It wins over everything else.
- If the spec is ambiguous, stop and ask. Do not invent requirements.
- Never edit a `spec.md` during implementation. If the spec is wrong, say so and
  propose the change; the human edits it.
- Keep `tasks.md` checkboxes up to date as tasks finish.
- One task = one commit. Commit message: `feat(NNN): <task title>` (or fix/test/chore).

## Stack

- Vite + React 19 + TypeScript (strict), no backend: data ships as static JSON
- Zod for runtime validation of recipe data
- Vitest + React Testing Library for tests; Playwright later for e2e
- CSS Modules (no UI framework until the constitution says otherwise)
- Persistence: `localStorage` behind a small repository interface

## Commands

- `npm run dev` – dev server
- `npm test` – unit tests (Vitest, run mode)
- `npm run typecheck` – `tsc --noEmit`
- `npm run lint` – ESLint
- `npm run check` – typecheck + lint + test; must pass before a task is done

## Layout

- `specs/` – constitution, templates, one folder per feature
- `data/source/` – original recipe markdown (Hungarian). Read-only source of truth.
- `src/domain/` – pure TS: types, schemas, calculations. No React here.
- `src/data/` – generated JSON + loaders
- `src/features/<feature>/` – React components per feature
- `scripts/` – build-time tools (e.g. markdown → JSON import)

## Conventions

- Domain logic lives in pure functions in `src/domain/` and is unit tested.
- Quantities are stored as numbers in base units (g, ml, pcs). Formatting is UI only.
- UI strings are Hungarian; code, identifiers, comments and specs are English.
- Gluten safety is a correctness concern, not a nice-to-have: see the
  `gluten-free-domain` skill.
