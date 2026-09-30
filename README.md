# Zero Gluten – a spec-driven pet project for learning Claude Code

A mobile-first React + TypeScript app for a gluten-free family meal plan: what
to eat today, how to cook it, and what to buy. The real content (Hungarian
recipes, 2-week rotation, shopping list) is in `data/source/`.

The app is the excuse. The goal is to learn a repeatable way of building
software with Claude Code: **spec → plan → small tested tasks → verify.**

## What's in this kit

```
CLAUDE.md                    project memory, loaded into every session
specs/constitution.md        vision + non-negotiable rules
specs/backlog.md             feature list, in order
specs/_templates/            spec / plan / tasks templates
specs/000-scaffold/spec.md   ready to plan
specs/001-recipe-data/spec.md drafted example, review before planning
.claude/settings.json        pre-approved safe commands; source data is read-only
.claude/skills/
  spec/                      /spec           → write a spec (interviews you first)
  plan-spec/                 /plan-spec NNN  → plan + tasks (use in plan mode)
  implement-task/            /implement-task NNN → one task, test first
  verify-spec/               /verify-spec NNN → AC-by-AC report
  gluten-free-domain/        auto-loaded domain rules (not a slash command)
data/source/                 original recipe markdown (read-only)
```

## Setup

```bash
unzip zero-gluten-starter.zip && cd zero-gluten
git init && git add . && git commit -m "chore: spec-driven starter kit"
claude            # start Claude Code in this folder
```

Inside Claude Code, type `/` and check that `spec`, `plan-spec`,
`implement-task` and `verify-spec` appear. If not, restart the session.

## The loop (per feature)

| Step | You type | Mode | You do |
|---|---|---|---|
| 1. Specify | `/spec 002 recipe catalog` | normal | answer its questions, then **edit the spec yourself** and set `Status: approved` |
| 2. Plan | `/plan-spec 002` | **plan mode** (Shift+Tab until it says plan mode) | push back on the plan, approve it; Claude then writes plan.md + tasks.md |
| 3. Build | `/implement-task 002` | normal (or auto-accept edits once you trust it) | review the diff, say yes to the commit; repeat per task |
| 4. Verify | `/verify-spec 002` | normal | fix gaps with more tasks, then mark the spec implemented |

Use `/clear` between features (and often between tasks). The spec files carry
the context, so a fresh session loses nothing; this is one of the main
advantages of spec-driven work.

## Learning roadmap

Each milestone teaches one Claude Code skill. Don't rush; the reflection
questions are where the learning happens.

**M0 – Scaffold (spec 000).** Run `/plan-spec 000` in plan mode, then
`/implement-task 000` until done. *Learn:* plan mode, permissions prompts,
how `CLAUDE.md` steers output. *Reflect:* what did Claude do that you'd
rather it hadn't? Add a line to `CLAUDE.md` so it won't happen again.

**M1 – Recipe data (spec 001).** Read the drafted spec critically first:
answer the open questions, tighten an AC you disagree with, approve it.
*Learn:* TDD with Claude, reading red→green output, making it stop after one
task. *Try:* ask Claude to write the parser without the spec and compare.

**M2 – Recipe catalog (002).** First spec you write yourself via `/spec`.
*Learn:* the interview step, how vague ACs produce vague code. *Try:* use
`@specs/002-…/spec.md` to point Claude at files explicitly.

**M3 – Today screen (003).** Date logic and the Wednesday overlap make this
the first genuinely tricky spec. *Learn:* resolving open questions before
planning; asking Claude to "think hard" about edge cases in plan mode.

**M4 – Shopping list (004).** State + persistence. *Learn:* subagents: ask
Claude to "use a subagent to review this diff against the spec" and compare
with `/verify-spec`.

**M5 – Your own skill.** Write a new skill for something you repeat (e.g. a
`ui-review` skill that checks 360 px layout and tap-target size, or a
`commit` skill). Consider `disable-model-invocation: true` for skills that
should only run when you type them.

**M6 – Hooks & CI.** Add a hook that runs `npm run check` after edits, and a
GitHub Action that runs it on push. *Learn:* moving rules from "Claude should
remember" to "the tooling enforces".

**M7+ – PWA, e2e, alternatives swap.** Now you drive; the backlog is yours.

## Habits worth building

- The spec is yours. Claude drafts, you decide. If you approve a spec you
  didn't read, the rest of the loop just automates the misunderstanding.
- When Claude goes wrong, fix the cause (spec, CLAUDE.md, a skill), not just
  the code. That's how the setup gets better every week.
- Small tasks, frequent commits, `git diff` before every yes.
- Escape stops Claude mid-action; double Escape lets you rewind. Use them freely.
