# 000 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves the scripts defined so
far green, and names the ACs it serves.

- [x] T1 – Scaffold Vite + React + TS app with strict tsconfig (AC1, AC4)
  - Test first: n/a (tooling setup, nothing to unit test yet).
  - Done when: `npm create vite@latest` (react-ts template) scaffolded into
    the repo without clobbering existing `package.json`/`README.md`/etc.;
    `tsconfig.app.json` has `strict: true` and `noUncheckedIndexedAccess:
    true`; `npm install && npm run typecheck` passes; `npm run dev` starts.
  - Note: hand-wrote the scaffold files instead of copying the generated
    output verbatim — the current `create-vite` react-ts template ships
    oxlint (not ESLint) and omits `strict: true` by default, both of which
    conflict with the plan/CLAUDE.md, so those were adjusted. Also needed
    `@types/node` (not in the template's deps) for `tsconfig.node.json`'s
    `"types": ["node"]` to resolve. `typecheck` script is `tsc -b` (project
    references + per-config `noEmit: true`), not a bare `tsc --noEmit`,
    since `--noEmit` isn't compatible with `--build` mode.

- [x] T2 – Add ESLint flat config and `lint` script (AC1)
  - Test first: n/a (lint config itself).
  - Done when: `eslint.config.js` exists (typescript-eslint + react-hooks +
    react-refresh); `npm run lint` runs and reports zero errors on the
    scaffolded files.

- [x] T3 – Add Vitest + React Testing Library and `test` script (AC1)
  - Test first: n/a (test infra itself; nothing to assert yet).
  - Done when: `vite.config.ts` has a `test` block (jsdom env, `src/test/setup.ts`
    wired in); `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
    installed; `npm test` runs and exits 0 (even with zero test files or a
    trivial smoke test).
  - Note: used `vitest run --passWithNoTests` for the `test` script instead
    of a throwaway smoke test file — Vitest exits 1 on zero test files by
    default, and a smoke test would just be deleted once T5 adds the real
    one. The flag is a no-op once real tests exist. Also hit an unrelated
    global npm cache permission error (a root-owned entry from a past `sudo
    npm` run); worked around it with a scratch-local `--cache` dir for
    installs rather than touching the system cache.

- [x] T4 – Create folder layout from CLAUDE.md (AC5)
  - Test first: n/a (structural).
  - Done when: `src/domain/`, `src/data/`, `src/features/`, `scripts/` exist
    in git (each with a `.gitkeep` or a first real file).

- [x] T5 – Home page heading + component test (AC2, AC3)
  - Test first: write `src/App.test.tsx` asserting
    `screen.getByRole('heading', { name: 'Zéró Glutén Konyha' })` is present;
    confirm it fails against a stub/empty `App`.
  - Done when: `src/App.tsx` renders `<h1>Zéró Glutén Konyha</h1>`, the test
    passes (`npm test`), and `npm run dev` shows the heading in the browser.

- [ ] T6 – `.gitignore`, `check` script, final green run (AC1)
  - Test first: n/a (wiring + verification task).
  - Done when: `.gitignore` covers `node_modules`, `dist`,
    editor/OS cruft; `package.json` has a `check` script running
    `typecheck && lint && test`; a fresh `npm install && npm run check`
    passes end to end, satisfying AC1.
