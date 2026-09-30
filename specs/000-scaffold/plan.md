# 000 – Implementation plan

Spec: ./spec.md

## Approach

Scaffold with `npm create vite@latest . -- --template react-ts` (Vite 8, React 19,
TypeScript), scaffolding into a temp directory first and merging in so the
existing `package.json`, `README.md`, `CLAUDE.md`, `data/`, `specs/` and
`.claude/` are not clobbered. Then layer on:

- Vitest + `@testing-library/react` + `@testing-library/jest-dom` + jsdom for
  component tests (Vitest reuses the Vite config, no separate test runner
  needed).
- ESLint flat config (`eslint.config.js`) with `typescript-eslint`,
  `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` — this is
  what the Vite `react-ts` template already ships, so mostly kept as-is.
- Stricter `tsconfig` options (`noUncheckedIndexedAccess`) on top of the
  template's `strict: true`.
- The folder layout from `CLAUDE.md` (`src/domain`, `src/data`,
  `src/features`, `scripts`), each seeded with a `.gitkeep` or a trivial
  first file so git tracks the empty dirs.
- A Hungarian placeholder home page (`<h1>Zéró Glutén Konyha</h1>`) and one
  RTL test asserting the heading renders.
- `.gitignore` for `node_modules`, `dist`, editor/OS cruft.

No routing, styling system, PWA or CI — out of scope per the spec.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `package.json` | changed | Vite/React/TS/Vitest/RTL/ESLint deps; scripts `dev`, `test`, `typecheck`, `lint`, `check` |
| `vite.config.ts` | new | Vite build config + Vitest `test` block (jsdom env, setup file) |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | new | `strict: true`, `noUncheckedIndexedAccess: true` |
| `eslint.config.js` | new | Flat config: typescript-eslint + react-hooks + react-refresh |
| `index.html` | new | Vite HTML entry |
| `src/main.tsx` | new | React root render |
| `src/App.tsx` | new | Home page component, heading "Zéró Glutén Konyha" |
| `src/App.test.tsx` | new | RTL test asserting the heading renders |
| `src/test/setup.ts` | new | `@testing-library/jest-dom` matchers registered for Vitest |
| `src/domain/.gitkeep` | new | Folder layout placeholder |
| `src/data/.gitkeep` | new | Folder layout placeholder |
| `src/features/.gitkeep` | new | Folder layout placeholder |
| `scripts/.gitkeep` | new | Folder layout placeholder |
| `.gitignore` | new | Ignore `node_modules`, `dist`, `.DS_Store`, etc. |

## Types & interfaces

No domain types yet — this spec is tooling only. `src/App.tsx` is a plain
function component:

```ts
function App(): JSX.Element
```

## Test strategy

- **AC1** (`npm install && npm run check` passes) – verified by running the
  command at the end of the last task; not a unit test itself, it's the
  aggregate of typecheck + lint + test all succeeding.
- **AC2** (heading visible) – covered by AC3's test plus a manual `npm run
  dev` check.
- **AC3** (component test for the heading) – `src/App.test.tsx`, RTL
  `render` + `screen.getByRole('heading', ...)`.
- **AC4** (strict tsconfig flags) – manual check: read `tsconfig.app.json`
  for `strict: true` and `noUncheckedIndexedAccess: true`.
- **AC5** (folder layout exists) – manual check: `ls` the four folders.

## Risks

- React 19 + latest `typescript-eslint`/`eslint-plugin-react-hooks` peer
  ranges can be finicky right after a major React bump; if `npm install`
  reports peer conflicts, pin the offending package to the version the Vite
  template lockfile picked rather than forcing with `--legacy-peer-deps`.
- Scaffolding into a non-empty directory: `npm create vite@latest .` refuses
  on a non-empty dir, so we scaffold into a scratch temp dir and copy the
  generated files in, taking care not to overwrite `package.json`/`README.md`
  — instead merging the needed fields/scripts by hand.
- `npm run check` doesn't exist as a working aggregate until the last task;
  earlier tasks are validated against whichever scripts are defined so far
  (`typecheck`, then `+lint`, then `+test`), not the full `check` command.
