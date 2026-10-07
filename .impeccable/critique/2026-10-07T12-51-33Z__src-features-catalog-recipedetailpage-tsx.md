---
target: "http://localhost:5173/recipes/gf-ebed-husos-zoldseges-passata"
total_score: 17
max_score: 36
na_heuristics: 10
p0_count: 1
p1_count: 2
target_identity: "file:/Users/sandor_orosz/Repositories/zero-gluten-rutin/src/features/catalog/RecipeDetailPage.tsx"
target_fingerprint: "sha256:98a89db3417d11e40241901d4d2ba4ff5dece63f2ab5fac572fdfdd6b68c7250"
target_path: /Users/sandor_orosz/Repositories/zero-gluten-rutin/src/features/catalog/RecipeDetailPage.tsx
timestamp: 2026-10-07T12-51-33Z
slug: src-features-catalog-recipedetailpage-tsx
---
Method: dual-agent (A: isolated sub-agent — design review · B: isolated sub-agent — detector/browser evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Macros show no "per adag" context and don't move with the portion stepper, reading as stale rather than intentional. Confirmed separately: every page load throws a console error (Fluent's `Keyborg` nav-focus library "disposed incorrectly") — no visible symptom yet, but it's a live engineering smell under the same heuristic. |
| 2 | Match System / Real World | 3/4 | Good concrete Hungarian cooking language; the source markdown's "Makró (1 napi adag)" qualifier is dropped in the UI. |
| 3 | User Control and Freedom | 2/4 | No reset for the portion stepper, no jump-to-step, only one escape hatch (back link). |
| 4 | Consistency and Standards | 2/4 | Gluten-risk signal uses two different visual forms for the same meaning: the orange pill badge on flagged ingredients vs. unstyled prose for this recipe's actual risk (canned chickpeas/passata) — breaks the system's own "one signal" rule. |
| 5 | Error Prevention | 2/4 | Stepper correctly disables at min/max. But measured live: resizing into the 360px kitchen/shop viewport produces a transient 123px horizontal overflow (stepper row pushed off-screen) while the nav collapses — a real, reproducible structural glitch, not just an opinion. |
| 6 | Recognition Rather Than Recall | 2/4 | Nothing above the fold signals a safety note exists below; user must scroll past ingredients, steps, tip and macros to find it. |
| 7 | Flexibility and Efficiency | 1/4 | No cook-mode, no step check-off, no screen-wake-lock, no shortcut into the shopping list — nothing rewards a returning daily user. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Clean overall; measured contrast is strong everywhere (body text 15.5:1, gluten-note 6.15:1, meal chip 6.81:1, back-link 10.27:1 — all pass AA). Ingredients, steps, tip and macros all share one visual container shape despite being four different kinds of content. |
| 9 | Error Recovery | 0/4 | Confirmed live: navigating to a nonexistent recipe id silently redirects to Catalog with zero message. |
| 10 | Help and Documentation | n/a | Operate-mode, single-family tool with no help system anywhere in the app — not a gap specific to this page. |
| **Total** | | **17/36** | **Poor (47%)** |

## Design Specificity Verdict

**LLM assessment**: The page's chrome (dark nav, purple backdrop, off-card title/back-link) is clearly "Zero Gluten." The task content underneath it — a plain ingredient list, a numbered steps card, a gray tip box, a flat macros list — reads as interchangeable with any recipe site. Nothing communicates "this is one fixed meal in your family's repeating 2-week rotation" (no link back to "today," no rotation/day context). The one element that should be unmistakably specific to this product — the gluten-safety note — is present but demoted to the bottom of the page, undercutting the product's core promise that gluten safety is flagged everywhere, not just somewhere.

**Deterministic scan**: `impeccable detect` ran clean (exit 0, zero findings) on `RecipeDetailPage.tsx`/`.styles.ts` and on the two shared components it uses (`MealTypeChip`, `GlutenRiskBadge`). One advisory finding fired during live-browser injection — `ai-color-palette: Purple/violet gradient background` — but it points at the shared page-backdrop element, not this page's own code, and matches the deliberately authored, user-pinned "Violet Shift" direction already reviewed and documented in `DESIGN.md`. Treating it as a known, accepted exception rather than a defect.

**Visual overlays**: injection succeeded during the assessment (console confirmed the one finding above), but per protocol the assessment's browser tab and the temporary visualization server were both closed and stopped before this report — there is no live overlay left open in your browser right now.

## Overall Impression

Technically solid (clean detector scan, strong contrast everywhere, correct stepper math, working focus rings) but generically organized: it reads as a template recipe page with the Zero Gluten chrome wrapped around it, and in the one place this product most needs to be distinctive — making a gluten risk impossible to miss — it's currently the weakest-signaled content on the page. The single biggest opportunity is re-ordering the page around that signal rather than around generic recipe-site convention.

## What's Working

1. **The `glutenFreeNote` component itself** — amber surface, non-decorative warning icon, visually distinct from the neutral `tip` box below it — is well-built; measured contrast (6.15:1) clears AA with room to spare. The problem is purely where it sits, not how it's built.
2. **Portion stepper**: verified live, scaling 4→7→9→6 adag rescaled every ingredient quantity correctly each time, buttons disable at min/max, and real keyboard Tab presses show a clear focus ring on both stepper buttons and the back link.
3. **Steps boxed as their own white card** keeps dense, must-read-while-cooking text legible regardless of the purple backdrop, with no per-line color overrides needed.

## Priority Issues

**[P0] Gluten-safety note is the last thing on the page it should be first.**
Why it matters: `glutenFreeNote` renders after the full ingredient list, all steps, the tip, and all six macro lines — on this exact recipe, that note (check the canned chickpeas/passata label) is the only gluten-risk guidance that exists, and it's currently the weakest-signaled content on the page. This contradicts PRODUCT.md's Principle 1 ("flag it everywhere") and DESIGN.md's own "Always-Flagged Rule."
Fix: move `glutenFreeNote` to directly below the title/chip/servings block, above the portion stepper and ingredient list.
Suggested command: `/impeccable layout`

**[P1] Catalog and Today show zero signal for a recipe whose detail page carries a caution.**
Why it matters: this recipe has no ingredient flagged `mustBeGlutenFree`, so Catalog/Today render no badge at all — yet the detail page's prose says to check two labels. A user scanning the list sees no difference between this recipe and one with no gluten considerations at all; the two-tier signal (badge vs. prose note) doesn't exist at the list level.
Fix: give recipes that carry a `glutenFreeNote` but no flagged ingredient a lightweight list-level cue (e.g. a smaller "ellenőrizd a címkét" tag).
Suggested command: `/impeccable audit` then `/impeccable clarify`

**[P1] Transient 123px horizontal overflow at 360px while the nav collapses.**
Why it matters: measured live — immediately after resizing into the 360px kitchen/shop viewport, `scrollWidth` (468px) exceeds `clientWidth` (345px) because the `NavDrawer` briefly renders at its full desktop width before collapsing, pushing the portion-stepper row off-screen. It self-resolves about a second later, but the product's own stated primary use case is exactly this viewport, and a user landing mid-transition (slow device, a direct narrow-width load) can hit a visibly broken, scrolling layout.
Fix: make the inline↔overlay `NavDrawer` breakpoint switch synchronous with first paint (e.g. compute the initial mode from `matchMedia` before mount) instead of resolving after a layout pass.
Suggested command: `/impeccable adapt`

**[P2] Macros share the ingredient list's exact container with no "per adag" qualifier.**
Why it matters: after watching every ingredient number rescale with the stepper, a user reasonably expects the kcal figure to move too; it doesn't (correctly — it's per serving), but with no qualifying label this reads as broken rather than intentional, right next to a stacked, visually-identical "4 napi adagra" / "7 adag" pair that's easy to misread as contradicting itself.
Fix: add an "adagonként" caption to the macros block and drop its card styling to plain rows, so it reads as reference info rather than a second shopping list.
Suggested command: `/impeccable clarify`

**[P3] No mid-cook support on the one page whose explicit context is "hands wet, one-handed."**
Why it matters: all steps render as one static list with no position tracking and no wake-lock — exactly the moment PRODUCT.md calls out most explicitly, addressed with generic recipe-site layout.
Fix: at minimum a "current step" affordance or tap-to-check-off; ideally a `wakeLock` request while the page is open.
Suggested command: `/impeccable delight`

## Persona Red Flags

**Casey (distracted, one-handed, thumb zone)**: on mobile, ingredients sit above steps in one scroll — resuming mid-cook after an interruption means scrolling past the whole ingredient card every time, with no jump-to-steps anchor. The stepper buttons are a thumb-reachable 44×44px, but that's the only reachable action on an otherwise read-only scroll.

**Sam (accessibility-dependent)**: the live portion count has no `aria-live` region, so a screen-reader user pressing + gets no spoken confirmation that quantities changed. Separately confirmed: the first two Tab stops (likely the hamburger toggle and a skip-link) show no visually distinct focus indicator, while the back link and both stepper buttons do.

**Riley (stress tester)**: confirmed live that an invalid recipe id silently bounces to Catalog with no error state at all — not even a flash of feedback (heuristic 9 scored 0/4 on this). Also reproduces the 360px transient-overflow defect above on demand by resizing into that width.

## Minor Observations

- Detector found one advisory, likely-false-positive finding (`ai-color-palette`) on the shared purple backdrop — already a deliberate, documented, user-pinned direction; no action needed.
- A console error fires on every page load: `Keyborg instance k1 is being disposed incorrectly` (from Fluent UI's internal nav-focus library). No visible symptom found yet, but worth a quick look given it fires unconditionally.
- Ingredient quantity rounding under scaling looked sensible (e.g., 2 cloves → 4 at a 7/4 scale factor, not a fractional value) — domain-layer behavior, not this page's own concern, but worth noting it held up under live stress-testing.
- Three different containers on the page (ingredients, steps, tip) are indistinguishable by shape/shadow, relying only on position to signal their different meaning.

## Questions to Consider

1. If the gluten-safety note is this app's single most important signal, why does its layout position currently rank it below nutrition facts and a source citation?
2. The portion stepper already tracks "how much am I actually cooking right now" — so why does nothing else on the page (the macros label, the static "4 napi adagra" line) acknowledge that context once it's set?
3. Given this page is read almost exclusively while cooking, what's the answer to "my hands are wet and I just need to see step 4" — and should Recipe Detail be the next surface to get a dedicated pass, rather than another chrome-level pilot?
