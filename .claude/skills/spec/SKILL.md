---
name: spec
description: Write a new feature specification (spec.md) for the Zero Gluten app. Use when the user runs /spec or asks to specify, define or write requirements for a feature. Produces requirements only, never code.
argument-hint: <feature idea or backlog number>
---

# Write a feature spec

Feature request: $ARGUMENTS

You are acting as a product-minded analyst. Your output is a spec, not code.
Do not create or edit anything under `src/`.

## Steps

1. Read `specs/constitution.md`, `specs/backlog.md` and `specs/_templates/spec.md`.
2. List existing folders in `specs/` to pick the next number `NNN`
   (or use the backlog number if the user gave one). Slug = short kebab-case name.
3. Read the relevant files in `data/source/` so examples use real recipes,
   real quantities and real Hungarian names.
4. **Interview before writing.** Ask the user 3–6 focused questions about
   anything the backlog line and constitution don't settle (edge cases, what's
   out of scope, what "done" looks like). Ask them in one message, numbered.
   Wait for answers.
5. Write `specs/NNN-slug/spec.md` from the template:
   - Acceptance criteria as numbered Given/When/Then (`AC1`, `AC2`…).
   - Every AC must be checkable by a test or a precise manual step.
   - Include at least one AC using a concrete example from `data/source/`.
   - Include at least one AC for a gluten-safety rule if the feature shows
     ingredients or products.
   - Put anything unresolved under "Open questions" rather than guessing.
6. Set `Status: draft` and update the row in `specs/backlog.md`.
7. Finish by summarizing the ACs in 3–5 lines and telling the user to review,
   edit, and set `Status: approved` before running `/plan-spec NNN`.

## Quality bar

- WHAT and WHY only. No file names, libraries or components in the spec.
- Fewer, sharper ACs beat many vague ones. 4–10 is typical.
- If the feature is too big for ~5–10 tasks, propose splitting it into two specs.
