---
name: implement-task
description: Implement the next unchecked task from a spec's tasks.md, test first. Use when the user runs /implement-task NNN or asks to build the next task of a planned spec.
argument-hint: <spec number> [task id, e.g. T3]
---

# Implement one task

Target: $ARGUMENTS

## Rules

- Do exactly ONE task, then stop. Small steps are the point of this workflow.
- Do not change `spec.md`. If the spec or plan turns out wrong, stop, explain
  the problem and propose a fix for the user to approve.
- Follow the domain rules in the `gluten-free-domain` skill.

## Steps

1. Read `specs/NNN-*/spec.md`, `plan.md` and `tasks.md`.
2. Pick the task: the given task id, or the first unchecked `- [ ]` task.
   Tell the user which task you're doing and which ACs it serves.
3. **Red:** write or extend tests that express the task's "done when" and the
   relevant ACs. Reference ACs in test names, e.g. `it("AC4: parses amount and unit")`.
   Run `npm test` and show that the new tests fail for the right reason.
4. **Green:** write the minimum code to make them pass.
5. **Refactor:** tidy up names and duplication with tests still green.
6. Run `npm run check`. Fix until it passes.
7. Tick the task in `tasks.md` (`- [x]`), and add a one-line note under it
   if anything differed from the plan.
8. Show a short summary: files changed, tests added, anything worth reviewing.
9. Suggest the commit message `feat(NNN): <task title>` and ask whether to
   commit. Only commit after the user says yes.
