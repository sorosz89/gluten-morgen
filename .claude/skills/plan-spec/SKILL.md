---
name: plan-spec
description: Turn an approved feature spec into a technical plan (plan.md) and a task list (tasks.md). Use when the user runs /plan-spec NNN or asks how to implement an approved spec. Best used in plan mode.
argument-hint: <spec number, e.g. 001>
---

# Plan a spec

Spec: `specs/$ARGUMENTS-*/spec.md`

## Before planning

1. Read the spec, `specs/constitution.md` and `CLAUDE.md`.
2. If the spec's status isn't `approved`, stop and tell the user.
3. If the spec has unresolved open questions, list them and ask the user to
   answer them first. Do not plan around unanswered questions.

## Explore (read-only)

4. Look at the existing code under `src/`, `scripts/` and `package.json`.
   Reuse existing types, helpers and patterns; note anything you'd need to change.
5. If a library would help, name it and why, and prefer what's already installed.

## Propose

6. Present the plan to the user using the structure in
   `specs/_templates/plan.md`, plus a draft task list following
   `specs/_templates/tasks.md`. Keep it concise.
   - Map every AC to at least one task and to a test type.
   - Order tasks so each one leaves `npm run check` green.
   - First task is usually types/schema + failing tests; UI comes after domain.
   - 4–10 tasks. Each task: title, ACs served, "test first", "done when".
7. Wait for the user's approval or edits. (In plan mode, this is where the
   user approves the plan and exits plan mode.)

## After approval

8. Write `specs/NNN-slug/plan.md` and `specs/NNN-slug/tasks.md`.
9. Do not start implementing. Tell the user to run `/implement-task NNN`.
