# 000 – Project scaffold

Status: approved
Depends on: none

## Problem
Before any feature, we need an empty app with the tooling from `CLAUDE.md`
working, so every later task can end with a green `npm run check`.

## Scope
In scope: Vite + React + TypeScript (strict) app, Vitest + React Testing Library,
ESLint, npm scripts `dev`, `test`, `typecheck`, `lint`, `check`, folder layout from
`CLAUDE.md`, a Hungarian placeholder home page, `.gitignore`.

Out of scope: routing, styling system, PWA, CI.

## Acceptance criteria
- **AC1** – Given a fresh clone, when I run `npm install && npm run check`,
  then typecheck, lint and tests all pass.
- **AC2** – Given the dev server runs, when I open it, then I see the heading
  "Zéró Glutén Konyha".
- **AC3** – A component test asserts AC2's heading is rendered.
- **AC4** – `tsconfig` has `strict: true` and `noUncheckedIndexedAccess: true`.
- **AC5** – Folders `src/domain`, `src/data`, `src/features`, `scripts` exist
  (with a `.gitkeep` or first file).

## Open questions
- none
