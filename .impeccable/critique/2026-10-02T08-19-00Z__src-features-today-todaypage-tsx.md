---
target: Today page (/ma)
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 1
target_identity: "file:/Users/sandor_orosz/Repositories/zero-gluten-rutin/src/features/today/TodayPage.tsx"
target_fingerprint: "sha256:e6dba35427e9fafcb5ad2b6fc47b39f72f1b6dd1363c66d1ffe06271ed771c43"
target_path: /Users/sandor_orosz/Repositories/zero-gluten-rutin/src/features/today/TodayPage.tsx
timestamp: 2026-10-02T08-19-00Z
slug: src-features-today-todaypage-tsx
closed: true
---
Method: dual-agent (A: independent design-review sub-agent · B: detector/browser-evidence sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | No date/weekday shown anywhere on a page named "Today"; nav has no active-route indicator |
| 2 | Match System / Real World | 3 | "vasárnap"/cook-day framing and Reggeli→Ebéd→Vacsora order match household mental model |
| 3 | User Control and Freedom | 2 | Anchor is editable anytime, but swap management lives on a disconnected page (`/csere`) with no link from here |
| 4 | Consistency and Standards | 3 | Badge/pill, border, and tap-target conventions match the rest of the app exactly |
| 5 | Error Prevention | 2 | Anchor-date validated before save; `recipesById.get(id)!` non-null assertions have zero fallback — bad state throws, not degrades |
| 6 | Recognition Rather Than Recall | 3 | Explicit "Reggeli:", "Ebéd:", "Vacsora:" labels, no memorization needed |
| 7 | Flexibility and Efficiency | 2 | No shortcut from a flagged lunch to the swap page, no peek-ahead to tomorrow without leaving to Heti terv |
| 8 | Aesthetic and Minimalist Design | 2 | The flat system is deliberate, but the always-on setup form clutters the one screen meant for a fast daily glance |
| 9 | Error Recovery | 2 | Specific Hungarian validation message (`Válassz vasárnapot.`) with `role="alert"`; no recovery path for a missing/mismatched recipe id |
| 10 | Help and Documentation | 2 | No inline help for what "Ciklus kezdete" controls, despite being permanently visible |
| **Total** | | **22/40** | **Acceptable — significant improvements needed before users are happy** |

## Design Specificity Verdict

**LLM assessment**: Strip the Hungarian strings and the gluten badge and `/ma` is indistinguishable from any generic "today's 3-item list" view: a plain sentence, three unstyled links, and a permanently-visible settings form. The one genuinely product-specific element — the Caution Amber gluten badge — is implemented correctly and consistently, but nothing else about composition, hierarchy, or copy reflects that this answers the single highest-stakes daily decision for a gluten-free family, read one-handed with wet hands. The literal answer to constitution question #1 (`Kell főzni ma?`) renders at the same size and weight as the meal titles beneath it — the page buries its own reason for existing.

**Deterministic scan**: `impeccable detect --json src/features/today` → exit code 0, **0 findings**, confirmed again via a plain-text re-run (0 findings, 0 stderr). The browser-injected detector agreed: the only `impeccable`-tagged console line was `No anti-patterns found.` This is consistent with DESIGN.md's own description of the system as deliberately flat and free of decorative slop — the detector isn't built to catch information-hierarchy or progressive-disclosure problems, so a clean scan here doesn't conflict with the LLM's hierarchy findings; the two assessments are evaluating different failure classes and neither contradicts the other.

**Visual overlays**: Injection succeeded and the detector genuinely ran in the page (verified via real DOM/script mutation, not a read-only check), but the live server used for injection was stopped as part of the evidence-gathering run, so there is no persistent overlay left visible in your own browser right now. If you want a live visual overlay to look at yourself, that needs a fresh `/impeccable live` or detector run.

One useful side-effect of running two independent browser sessions: Assessment A inspected a tab with a rotation anchor already configured (meals + badges rendering for 2026-10-04), while Assessment B's fresh tab had no anchor set and rendered only the setup prompt and form. Together these two sessions incidentally cover both states the page can be in — see Priority Issues below, where this nuance changes the shape of the P1 finding.

## Overall Impression

The screen is functionally correct and its one safety-critical element (the gluten badge) works perfectly under live inspection. But it reads as a list-and-a-form, not as "the one glance that tells you whether to cook tonight." The biggest opportunity is simple: make the yes/no cook answer the actual headline, and stop showing the rotation-setup form to a user who already configured it weeks ago.

## What's Working

1. **The Always-Flagged Rule holds.** Independently confirmed live: every gluten-risk meal in the inspected rotation block rendered its "Gluténmentes termék szükséges" badge, with no misses.
2. **44px tap targets are real, not just documented.** Verified in both the CSS (`.mealLink { min-height: 44px }`) and the rendered DOM, matching DESIGN.md's stated invariant.
3. **Validation copy is good.** `Válassz vasárnapot.` is short, specific, in Hungarian, and wired to `role="alert"` — a genuinely accessible error state in an app that otherwise has few of them.
4. **Clean on both automated scans.** CLI and browser-injected detector agree: zero anti-pattern findings. The flat system isn't accidentally sloppy — it's consistently flat.

## Priority Issues

**[P0] No hierarchy on the page's core answer.**
- *Why it matters*: `Kell főzni ma?` is literally constitution question #1, and it renders at body size with only the igen/nem word bolded — identical visual weight to the meal list underneath. A one-handed glance in a kitchen shouldn't require reading a full sentence to get the answer.
- *Fix*: Give the cook/no-cook answer its own larger, heavier status line, visually separated (not just a bold word mid-sentence) from the meal list below it.
- *Suggested command*: `/impeccable bolder`

**[P1] The rotation-setup form never goes away — and the two browser sessions show why that's worse than it first looks.**
- *Why it matters*: Assessment A (anchor already configured) found the date-anchor input and "Mentés" button rendering unconditionally below the meal list on every single visit, forever — clutter on the one screen meant for a 1-second daily check, for a setting changed maybe twice a year. Assessment B's fresh, no-anchor tab showed the *same* form as the *entire* page content when nothing is configured yet — which is actually a clean, appropriately single-focus first-run moment. So the form is in the wrong place specifically for returning users, not for first-timers.
- *Fix*: Once an anchor exists, collapse the form to a small, out-of-the-way "edit cycle start" affordance (e.g. a settings link), not a permanently open input+button pair competing with today's meals.
- *Suggested command*: `/impeccable distill`

**[P2] No date or weekday shown.**
- *Why it matters*: `/ma` never displays what date it thinks "today" is. With state held only in `localStorage` and offline use planned, the user has no way to sanity-check the answer before trusting it with a cooking decision.
- *Fix*: Add a secondary date/weekday line near the top of the page.
- *Suggested command*: `/impeccable clarify`

**[P2] Unguarded recipe lookups can crash the page.**
- *Why it matters*: `recipesById.get(breakfastId)!` and its siblings use non-null assertions with no fallback render. A bad swap value or a data drift doesn't degrade gracefully — it throws, in exactly the rushed, kitchen-in-hand moment where a crash is most costly.
- *Fix*: Replace the assertions with a safe fallback and a Hungarian-language error state instead of a hard crash.
- *Suggested command*: `/impeccable harden`

**[P3] Meal rows don't look tappable.**
- *Why it matters*: Links inherit body text color with no underline, chevron, or other affordance — a first-time user may not realize the rows are navigable.
- *Fix*: Add a subtle tap affordance consistent with the existing flat system (not a new visual language).
- *Suggested command*: `/impeccable polish`

## Persona Red Flags

**Casey (distracted, one-handed mobile)**: Must *read* a full sentence to learn igen/nem rather than glance at it; the ever-present date form sits one mis-tap away from today's content during a one-handed scroll.

**Jordan (first-timer)**: No save confirmation beyond a silent re-render after hitting "Mentés"; no visual cue that meal rows are links until tapped.

**Sam (screen reader / keyboard)**: The nav has no `aria-current` (DESIGN.md itself flags this gap), so tabbing through gives no sense of "you are on Ma"; each meal row reads as one run-on string with no structured announcement that it opens a recipe.

## Minor Observations

- No "day X of block" context on `/ma`, despite that context existing on the Schedule page — a missed, cheap cross-reference.
- Confirmed no responsive breakpoints exist: the page rendered pixel-identical at mobile and desktop widths in Assessment A's inspection, matching DESIGN.md's own claim.
- No meal-type icon or color differentiation beyond bold label text — breakfast/lunch/dinner are typographically identical except for the word itself.
- Viewport-resize tooling in Assessment B's environment couldn't actually change the tab's rendered width (stuck at 570×707 across three different resize attempts) — a tool limitation, not an app finding; Assessment A's independent width checks are the more reliable evidence on responsive behavior here.

## Questions to Consider

1. What if `Kell főzni ma?` were the actual headline of the page, read in under a second, with the meal list as supporting detail rather than equal-weight content?
2. What if the rotation-anchor form only ever appeared once, during first-run setup, off this screen entirely?
3. What if the meal matching the current time of day (breakfast in the morning, dinner in the evening) were visually emphasized over the other two, instead of all three given equal weight regardless of when you open the app?
