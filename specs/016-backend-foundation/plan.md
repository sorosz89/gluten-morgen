# 016 – Implementation plan

Spec: ./spec.md

## Approach

Stand up one thin serverless function (Vercel — zero-config for this Vite app, built-in
secret storage for AC5, and a KV store available for the guardrail counter) that proxies to
the Anthropic Claude API (the project's own ecosystem; named as the example in
`specs/exploration-ai-assistant.md`'s Option C). A pure, unit-tested guardrail function in
`src/domain/` decides allow/reject by day + request count; the serverless function is the
only thing that calls it with real state. The frontend gets a thin client module and a new
beta-labeled page/nav entry — built as the real shell the next spec (AI recipe generator)
will extend, not a throwaway, per the spec's resolved open question.

No existing backend/deploy config exists in this repo, so this is a clean-slate addition.
`tsconfig.node.json` already includes `src/domain/**/*.ts` for Node-side reuse, so the
guardrail logic needs no new tsconfig wiring beyond adding the new `api/` folder itself.

## Files

| File | New/changed | Purpose |
|---|---|---|
| `api/ai-assistant.ts` | new | Serverless function: checks the guardrail, calls the hosted LLM API, returns its response |
| `src/domain/costGuardrail.ts` + `.test.ts` | new | Pure function: allow/reject a request given today's count + a limit |
| `src/data/aiAssistantClient.ts` + `.test.ts` | new | Frontend fetch wrapper for `/api/ai-assistant` |
| `src/features/aiAssistant/AiAssistantPage.tsx` + `.styles.ts` + `.test.tsx` | new | Beta page: prompt input, raw response display |
| `src/App.tsx`, `src/App.styles.ts`, `src/App.test.tsx` | changed | New route + nav entry with a "beta" marker |
| `tsconfig.node.json` | changed | add `api/**/*.ts` to `include` so it's typechecked |
| `specs/constitution.md` | changed (human applies) | Principle 6 amendment + change-log entry |

## Types & interfaces

```ts
// src/domain/costGuardrail.ts
type GuardrailState = { date: string; count: number }
function checkAndRecordRequest(state: GuardrailState, limit: number, now: Date):
  { allowed: boolean; nextState: GuardrailState }

// src/data/aiAssistantClient.ts
type AiAssistantResponse = { text: string } | { error: 'rate_limited' }
function requestAiAssistant(prompt: string): Promise<AiAssistantResponse>
```

## Test strategy

- AC1, AC5 → manual smoke test (per spec, no live-API integration test) + a written manual
  check that the API key never appears client-side.
- AC2, AC3 → component tests (`App.test.tsx` for the nav entry, `AiAssistantPage.test.tsx`
  for raw-response rendering, mocking `aiAssistantClient`).
- AC4 → unit tests on `costGuardrail.ts` with a small injected limit (allow under limit,
  reject at limit, resets on a new day).
- AC6 → manual check reading `constitution.md` after the amendment is applied.

## Risks

- The guardrail counter needs to persist across serverless invocations (cold starts reset
  in-memory state) — Vercel KV is the plan; if unavailable on the account tier, a fallback
  is needed.
- A day-based cap is a circuit breaker, not a hard ceiling — cost can still spike within one
  day if the threshold (still unset, per the spec's open question) is set too high.
- Vercel is a vendor choice made here, not previously confirmed by the user — easy to swap
  later since the function is deliberately thin.
