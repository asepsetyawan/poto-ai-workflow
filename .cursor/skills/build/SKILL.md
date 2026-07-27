---
name: build
description: Entry point for the Build phase of the agent-skills lifecycle (DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP). Only runs when explicitly invoked via /build.
disable-model-invocation: true
---

# /build — Build incrementally

Read and follow `.cursor/skills/incremental-implementation/SKILL.md`. Implement one task
from the plan at a time, as a thin vertical slice — not the whole feature at once.

For each slice, also apply:

- The relevant tech-stack skill (`.cursor/skills/express-api-layering`,
  `drizzle-postgres-patterns`, `jwt-auth-flow`, `react-query-data-layer`,
  `react-feature-structure`, etc.) and the app-level architecture skill/rule
  (`apps/backend/.cursor/skills/backend-architecture/`,
  `apps/frontend/.cursor/skills/frontend-architecture/`, `.cursor/rules/backend.mdc` /
  `frontend.mdc`).
- `.cursor/skills/test-driven-development/SKILL.md` — write the test before or alongside
  the implementation, not after.

Verify each slice (`npm run typecheck && npm run lint`, relevant tests) before moving to
the next task. When all tasks are implemented, move to `/test` for full verification,
then `/review`.
