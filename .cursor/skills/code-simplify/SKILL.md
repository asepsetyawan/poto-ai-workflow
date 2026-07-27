---
name: code-simplify
description: Entry point for the code-simplification companion to the Review phase of the agent-skills lifecycle (DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP). Only runs when explicitly invoked via /code-simplify.
disable-model-invocation: true
---

# /code-simplify — Simplify code for clarity

Read and follow `.cursor/skills/code-simplification/SKILL.md`. Simplify the specified
scope (default: recently changed code, i.e. the current diff) while preserving exact
behavior:

1. Understand the code's purpose, callers, edge cases, and existing test coverage before
   touching it (Chesterton's Fence — don't remove what you don't understand).
2. Scan for simplification opportunities: deep nesting → guard clauses, long functions →
   split by responsibility, nested ternaries → if/else, generic names → descriptive
   names, duplicated logic → shared helpers, dead code → remove after confirming it's
   unused.
3. Apply each simplification incrementally. After each change, re-run
   `npm run typecheck && npm run lint` and the relevant test suite
   (`npm run test`, plus the frontend workspace test command if frontend files changed).
4. If a simplification breaks a test, revert that simplification — never "fix" the test
   to match a behavior change smuggled in under the simplification label.

Never change behavior in the name of simplification. If a change would alter behavior,
call it out explicitly and treat it as a separate task requiring its own review.

Next step: fold the simplified diff back into `/review` if this wasn't already invoked
from inside a review pass.
