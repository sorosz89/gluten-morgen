---
name: verify-spec
description: Check a spec's acceptance criteria against the actual code and tests and report what is done, partial or missing. Use when the user runs /verify-spec NNN or asks whether a feature is complete.
argument-hint: <spec number>
---

# Verify a spec

Spec: `specs/$ARGUMENTS-*/spec.md`

1. Read the spec, plan and tasks.
2. Run `npm run check` and report the result.
3. For each acceptance criterion, find the evidence:
   - a test whose name references the AC and that passes, or
   - code you can point to plus a manual check the user can do in 1–2 steps.
4. Report as a table: AC | status (✅ done / ⚠️ partial / ❌ missing) | evidence
   (file:line or test name) | gap.
5. Also flag: code with no matching AC (scope creep), and any gluten-safety rule
   from the `gluten-free-domain` skill that the feature touches but doesn't test.
6. If everything is ✅, suggest setting the spec to `Status: implemented` and
   updating `specs/backlog.md`. Don't change them yourself unless asked.
