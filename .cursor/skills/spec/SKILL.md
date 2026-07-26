---
name: spec
description: Entry point for the Define phase of the agent-skills lifecycle (DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP). Only runs when explicitly invoked via /spec.
disable-model-invocation: true
---

# /spec — Define what to build

Read and follow `.agents/skills/spec-driven-development/SKILL.md` in full before writing
any code. Produce a short spec (objectives, boundaries, acceptance criteria) for the
feature/change the user described, using this repo's stack and conventions
(`.cursor/rules/`, `apps/backend/.cursor/skills/backend-architecture/`,
`apps/frontend/.cursor/skills/frontend-architecture/`) as the implementation context.

If the ask is already unambiguous and trivial (e.g. a one-line fix), say so and skip
straight to `/plan` or `/build` instead of manufacturing a spec for its own sake.

Next step once the spec is agreed: `/plan`.
