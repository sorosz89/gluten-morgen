# 016 – Backend foundation

Status: approved
Depends on: none

## Problem

The app has been static-data-only by design: constitution Principle 6 says "No backend until a
spec proves we need one." That's no longer where the product is headed — there's now a concrete,
deliberate plan that needs one (an AI-assisted recipe generator, explored in
`specs/exploration-ai-assistant.md`), plus other future ideas beyond that single feature. Rather
than treat backend as a one-off exception carved out for a single feature, this spec stands up a
minimal backend as a standing capability and retires the blanket "no backend" rule, so later
specs can build product features on top of it instead of each re-justifying infrastructure from
scratch.

## User stories

- As the person building and maintaining this app, I want a minimal, working backend (a thin
  function that can call a hosted LLM API) in place, so upcoming features — starting with an AI
  recipe generator — have real infrastructure to build on.
- As the same person, I want a visible UI entry point for this infrastructure, styled consistently
  with the rest of the app, so I can confirm the plumbing actually works end-to-end, not just in
  isolation behind the scenes.
- As the same person, I want basic protection against runaway API cost, so a bug or an unexpected
  usage pattern can't silently rack up a bill before anyone notices.

## Scope

In scope:
- A deployed backend function, reachable from the app, that makes an authenticated call to a
  hosted LLM API and returns its response.
- A UI entry point: a page styled consistently with the rest of the app (mobile-first, same
  visual language as the existing nav and screens), reachable via a nav entry visibly marked as
  "beta" to distinguish it from the stable, established pages. This page proves the round trip
  works — it sends a basic request and shows the raw response — and nothing more.
- A basic cost guardrail that limits how much the backend can be called/spent in a given period.
  Exact mechanism and threshold are an open question below.
- Retiring Principle 6's blanket "no backend" rule in `specs/constitution.md`, replaced with
  language reflecting that backend usage is now a deliberate, standing capability rather than a
  one-off exception. (Claude proposes the wording; the human edits the constitution directly, per
  CLAUDE.md's own rule.)

Out of scope:
- Any recipe-generation logic, prompt design, or grounding the LLM call in the app's own recipe or
  gluten data — that is the next spec (AI recipe generator), which depends on this one.
- Any gluten-safety checking of AI output — next spec; this spec's test page never displays
  ingredients or product data, so Principle 1 isn't implicated here.
- Handling or surfacing LLM call failures/timeouts to a user — happy path only for now.
- Offline messaging/degradation design for the new page beyond the fact that it simply won't work
  without a connection — next spec can refine this.
- Automated integration tests against the live hosted LLM API. Verified instead by unit tests for
  any logic that doesn't require a live call (e.g. the cost-guardrail check), plus a manual smoke
  test (a written manual check) for the real round trip.

## Acceptance criteria

- **AC1** – Given the backend function is deployed, when it receives a simple test request, then
  it calls the hosted LLM API and returns a non-empty text response.
- **AC2** – Given the app's main navigation, when viewing it, then a new nav entry exists, visibly
  marked/styled as distinct ("beta") from the stable entries (Today, Recipes, Shopping list,
  etc.), and meets the same mobile-first/360px-wide/44×44px tap-target rules as the rest of the nav.
- **AC3** – Given the new beta page, when a person enters a test prompt and submits it, then the
  page shows the raw response returned by the backend, with no recipe-specific formatting, parsing,
  or validation applied to it.
- **AC4** – Given the cost guardrail is configured with some request-volume limit, when that limit
  is reached, then further calls are rejected rather than continuing to call the paid API
  indefinitely — checkable with a unit test using a small, injected limit, independent of whatever
  the real production threshold ends up being.
- **AC5** – Given the hosted LLM API call succeeds, when the response reaches the browser, then no
  API key or credential is present anywhere in client-side code or in network responses visible to
  the browser's network tab.
- **AC6** – Given this spec ships, when `specs/constitution.md` is next updated, then Principle 6
  no longer states a blanket "no backend" rule — checkable by reading the updated principle text.

## Data & rules

- No recipe or gluten domain logic is touched by this spec. The one place real data is useful is
  the manual smoke test for AC1/AC3: use a real excerpt as the test prompt payload — e.g. the
  title and macro line from `data/source/gf-ebed-gulyasleves.md` ("Marhahúsos gulyásleves...",
  822 kcal) — not because this spec does anything recipe-specific, but to prove the round trip
  handles realistically-sized real content before the next spec starts injecting real recipe data
  into prompts for real.
- The cost guardrail only needs to reject/block once a configured limit is hit (AC4); it does not
  need to notify anyone, log anywhere specific, or auto-reset on a schedule — those are
  implementation details for `/plan-spec`, not requirements of this spec.

## Open questions

- [ ] Exact cost-guardrail mechanism and threshold (a simple per-day request cap? a dollar-budget
      limit via the provider's own spend controls? something else?) — no preference stated yet.
- [ ] Exact replacement wording for Principle 6 — Claude will propose it, but the human edits
      `specs/constitution.md` directly.
- [ ] Is the beta page's shell UI built here meant to literally become the same page the AI recipe
      generator spec extends with its real UX (meal type, ingredients input, etc.), or a separate,
      throwaway diagnostic screen? Assumed here to be the same page (least wasteful) — confirm
      before approving.
- [ ] Hosting/runtime platform and LLM provider choice — deliberately left for `/plan-spec` to
      resolve, consistent with keeping this spec to WHAT/WHY only.
