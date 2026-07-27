---
name: ship
description: Entry point for the Ship phase of the agent-skills lifecycle (DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP). Only runs when explicitly invoked via /ship.
disable-model-invocation: true
---

# /ship — Ship with confidence

Read and follow `.cursor/skills/git-workflow-and-versioning/SKILL.md` and
`.cursor/rules/git-conventions.mdc`.

1. Confirm `/test` and `/review` both passed for every change being shipped.
2. Split unrelated changes into separate, atomic commits — imperative mood, explain why.
3. Use a `<type>/<short-description>` branch name.
4. Write the PR description: what changed, why, how it was tested; call out schema or
   deploy-behavior changes explicitly.
5. Do not merge on a failing CI run or with an unresolved review comment.

This repo has no separate staged-rollout/feature-flag infrastructure yet — if the change
needs one, say so explicitly instead of shipping it silently.
