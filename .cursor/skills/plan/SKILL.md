---
name: plan
description: Entry point for the Plan phase of the agent-skills lifecycle (DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP). Only runs when explicitly invoked via /plan.
disable-model-invocation: true
---

# /plan — Break it down

Read and follow `.agents/skills/planning-and-task-breakdown/SKILL.md` in full. Decompose
the spec (from `/spec`, or the user's request directly) into small, ordered,
independently-verifiable tasks with acceptance criteria — e.g. "schema + migration",
"service + tests", "routes + validation", "frontend feature", in dependency order.

Present the task list for approval before implementing. Once approved, move to `/build`.
