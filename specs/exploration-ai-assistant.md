# Exploration – An in-app AI assistant for Zero Gluten

Status: exploration only — not a spec, nothing decided or approved.
Branch: `explore/ai-assistant-intro`

This is pre-spec ideation, written at the user's request to compare options for
introducing an AI assistant (in-app help/chat for the person cooking) before
committing to any direction. If one of these options is pursued, it needs its own
`/spec` and, per `specs/constitution.md`'s own rules, a deliberate constitution
amendment — this document is not that amendment.

## Why this isn't a small decision

Two things in `specs/constitution.md` are directly implicated:

- **Principle 6 — "No backend until a spec proves we need one."** Every option
  below that does more than replay the app's own existing data needs to cross
  this line explicitly, not by accident.
- **Out of scope (for now): "... AI features."** Any of these options would be
  the thing that moves AI out of that list — again, a deliberate call, not a
  side effect of picking a chat UI.

Two more principles shape *how* any version of this would have to work, not
*whether* to build it:

- **Principle 1 — gluten safety is non-negotiable.** Whatever answers a
  question about an ingredient or a swap, the gluten-risk signal and the
  "never suggest a wheat-based swap" rule can't become something a language
  model decides fresh each time. The assistant can *narrate* what the app's own
  domain data already says; it must never become a second, independent source
  of truth for what's safe.
- **Principle 4 — works offline (later milestone, don't block it).** The app is
  explicitly used in two places: the kitchen (wet/busy hands) and the shop
  (sometimes no signal). Any option that needs a live network call stops
  working in exactly the second of those two contexts.

## Options

### A. Not AI at all — a scripted help/FAQ widget over existing data

A chat-shaped UI, but every answer is templated and sourced directly from data
already in `src/domain`/`src/data` (today's meal, a recipe's ingredients, the
gluten watchlist, the shopping list). Pattern-matches the question to one of a
fixed set of intents ("what's for dinner", "is X gluten-free", "what can I swap
for Y") rather than generating free-form text.

- **Backend:** none. Stays fully inside Principle 6.
- **Offline:** yes — same guarantee as the rest of the app today.
- **Gluten-safety risk:** none beyond what already exists; it's reading the
  same flagged data every page already reads.
- **Cost:** none ongoing.
- **What it can't do:** anything outside its fixed intent list. "Why do you
  always use leveszöldség in the gulyás" has no good scripted answer. Feels
  like a smart search box, not a conversation.
- **Effort:** low-to-medium — mostly UI, a small intent-matching layer, no new
  domain truth.

### B. On-device (client-side) LLM

A small quantized model (e.g. via WebLLM/transformers.js) runs entirely in the
browser, with no server call. The app would hand it context (today's recipe,
the gluten watchlist) and let it answer more flexibly than A's fixed intents.

- **Backend:** none, architecturally — but a significant new client-side
  subsystem (model loading, caching, inference) where today there is none.
- **Offline:** yes, once the model is downloaded and cached — but that first
  download is large (commonly hundreds of MB), which cuts against "sometimes
  in a shop without reliable signal" for the *first* use, and against a phone's
  storage/battery for ongoing use.
- **Gluten-safety risk:** highest of the real-AI options. Small on-device
  models hallucinate more than hosted ones, and there is no server-side guard
  to catch it before the person sees it.
- **Cost:** none ongoing (no API), but real engineering cost to keep the model
  current and to constrain it to only repeat the app's own flagged data rather
  than improvise.
- **Effort:** high. This is the biggest architectural shift of the four
  options, for a safety profile that's actually the hardest to trust.

### C. Thin backend calling a hosted LLM API

A small serverless function proxies a chat request to a hosted LLM (e.g. the
Claude API), with the app's own recipe/gluten data injected into the prompt so
the model is grounded in real data rather than inventing it (a small-scale
version of retrieval-augmented generation).

- **Backend:** yes — crosses Principle 6 directly; this is the option that
  most needs the "a spec proves we need one" conversation first.
- **Offline:** no. Stops working exactly in the shop-without-signal case the
  product explicitly exists for.
- **Gluten-safety risk:** real, but more containable than B — a server-side
  step can refuse to let the model state a gluten-safety fact that isn't
  already in the app's own flagged data, and can log/review what it actually
  said. Still requires that guard to be built deliberately; a bare "pass the
  question to the model" integration would not meet Principle 1 on its own.
- **Cost:** ongoing, per request, plus hosting the function itself.
- **What it's good at:** genuinely flexible, natural-language help — the thing
  A fundamentally can't do.
- **Effort:** medium — mostly the backend + prompt-grounding + the safety
  guard; the chat UI itself is the easy part.

### D. Hybrid — scripted for safety, hosted LLM for everything else

Combine A and C with a hard boundary: any question that touches gluten safety,
an ingredient substitution, or "what's in this" is answered by A's scripted
layer (reading the app's own flagged data) and nothing else. Free-form
cooking/planning chat ("give me a tip for tonight", "what goes well with this")
goes to C's hosted model, explicitly scoped away from anything safety-related.

- **Backend / offline / cost:** same as C for the LLM half; same as A (free)
  for the safety half. The chat UI degrades gracefully offline — safety
  questions keep working, open-ended chat doesn't.
- **Gluten-safety risk:** lowest of the three AI-shaped options, because the
  one thing that must never be improvised, isn't — it's routed around the
  model entirely rather than guarded after the fact.
- **Effort:** medium-high — needs A's intent classifier to correctly *detect*
  a safety-adjacent question and route it away from the model, which is its
  own small piece of judgment to get right (a false negative here is exactly
  the failure Principle 1 exists to prevent).

### E. Do nothing yet — keep AI out of scope, revisit later

Worth stating explicitly rather than only implied: the constitution's current
"AI features: out of scope" line is a reasonable default for a single-family,
no-backend, offline-capable tool, and staying there costs nothing. The
trigger for revisiting it would be a concrete, recurring problem the existing
screens don't solve well (e.g. people frequently asking "what can I substitute
here" in a way A's fixed intents keep missing) — a backlog entry, not a
felt need.

## Comparison at a glance

| | A. Scripted | B. On-device LLM | C. Hosted LLM + backend | D. Hybrid | E. Do nothing |
|---|---|---|---|---|---|
| Needs a backend | No | No | **Yes** | Yes (partial) | — |
| Works offline | Yes | Yes (after first download) | No | Partial | — |
| Gluten-safety risk | None (reads existing data) | Highest | Moderate, guardable | Lowest of the AI options | — |
| Ongoing cost | None | None | Per-request | Per-request (partial) | None |
| Free-form Q&A | No | Yes | Yes | Yes (non-safety only) | — |
| Engineering effort | Low–medium | High | Medium | Medium–high | None |

## A recommendation, if this moves forward

If the answer to "do we want this" is yes, **D (hybrid)** is the only option
that doesn't ask Principle 1 to trust a language model with gluten safety —
it keeps that answer exactly where it is today (the app's own flagged domain
data) and only reaches for a model for the lower-stakes, free-form half of the
conversation. **A (scripted)** is the right *first* step even inside that plan
— it's the safety-routing layer D depends on, and it is shippable completely
on its own, inside the current constitution, before any backend/offline/cost
conversation has to happen at all. B is not recommended at any point: it carries
the highest gluten-safety risk of the four for no corresponding advantage over
C or D.

## What a real spec would need to settle, if this proceeds

- A constitution amendment (Principles 1, 4, 6, and the AI out-of-scope line
  all need an explicit update, the same way Principle 7 was added deliberately
  for the UI-framework pilot rather than assumed).
- Exactly what counts as a "safety-adjacent" question for D's routing layer,
  and what happens when the classifier is unsure (default to the scripted
  answer, never to the model, is the safe default to specify).
- What the chat UI shows when offline (C/D): a clear, honest state, not a
  silent failure — consistent with the shop-without-signal context Principle 4
  names explicitly.
- Whether recipe/ingredient data sent to a third-party API (C/D) needs any
  disclosure, given this is a personal single-family tool today.

## Open questions

- [ ] Is there a specific recurring moment (a real question the person asks
  while cooking/shopping that today's screens don't answer) driving this, or
  is this exploratory/speculative for now?
- [ ] If pursued, does it start at A (scripted) as a standalone, low-risk
  shippable step, or is the ambition specifically the free-form chat
  experience from day one?
