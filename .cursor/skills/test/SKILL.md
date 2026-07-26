---
name: test
description: Entry point for the Verify phase of the agent-skills lifecycle (DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP). Only runs when explicitly invoked via /test.
disable-model-invocation: true
---

# /test — Prove it works

Read and follow `.agents/skills/test-driven-development/SKILL.md`. From the repo root:

```bash
npm run typecheck
npm run lint
npm run test                                      # backend, real Postgres
npm run test --workspace=@ai-workflow/frontend     # frontend, if touched
```

Follow `apps/backend/.cursor/skills/vitest-integration-testing` conventions for backend
tests (happy path, 400, 404, 401 coverage per endpoint).

If anything fails, switch to `.agents/skills/debugging-and-error-recovery/SKILL.md`:
reproduce → localize → reduce → fix → add a regression guard — don't just patch the
symptom. Don't report this phase done until every command above is green.

Next step: `/review`.
