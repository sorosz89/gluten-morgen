# 016 – Tasks

Each task is small (≈ one commit, < 1 hour), leaves `npm run check` green,
and names the ACs it serves.

- [ ] T1 – Guardrail domain logic (AC4)
  - Test first: unit tests for `checkAndRecordRequest` — under limit allows, at limit
    rejects, new day resets.
  - Done when: `src/domain/costGuardrail.ts` passes those tests, `npm run check` green.
- [ ] T2 – Serverless function (AC1, AC4, AC5)
  - Test first: none automatable (live API call) — written manual smoke test using a real
    recipe excerpt as the prompt (per spec's Data & rules).
  - Done when: deployed function returns a real LLM response; guardrail wired in; API key
    read only from a server-side env var.
- [ ] T3 – Frontend client module (AC3)
  - Test first: unit test with mocked `fetch`, covering a normal response and a
    `rate_limited` response.
  - Done when: `src/data/aiAssistantClient.ts` passes those tests.
- [ ] T4 – Beta page UI (AC3)
  - Test first: component test asserting the raw response text renders unmodified.
  - Done when: `AiAssistantPage` renders, styled consistently with other feature pages
    (Fluent UI).
- [ ] T5 – Nav + route wiring (AC2)
  - Test first: `App.test.tsx` assertion that the new nav entry renders with a visible
    "beta" marker and meets the 44px tap-target style already used by other items.
  - Done when: `/asszisztens` route reachable from nav, `npm run check` green.
- [ ] T6 – Constitution amendment (AC6)
  - Test first: n/a (doc change) — written manual check.
  - Done when: Principle 6 no longer states a blanket "no backend" rule; the wording has
    been applied and recorded in the change log.
