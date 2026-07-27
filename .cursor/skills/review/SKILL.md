---
name: review
description: Entry point for the Review phase of the agent-skills lifecycle (DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP). Only runs when explicitly invoked via /review.
disable-model-invocation: true
---

# /review — Quality gate before merge

Run these three review skills against the diff, in order:

1. `.cursor/skills/code-review-and-quality/SKILL.md` — five-axis review (correctness,
   readability, architecture, security, performance)
2. `.cursor/skills/security-and-hardening/SKILL.md` — required if the change touches
   user input, auth, storage, or an external integration
3. `.cursor/skills/code-simplification/SKILL.md` — only if the review surfaced
   unnecessary complexity; never simplify by changing behavior

Report findings labeled Nit / Optional / FYI vs. blocking, per `code-review-and-quality`.
Fix blocking issues before proceeding. Re-run `/test` after any fix.

For a deeper single-lens pass, adopt the matching persona from `.cursor/agents/` instead
of the general checklist: `code-reviewer.md` (staff-engineer standard), `security-auditor.md`
(threat modeling), or run `/webperf` for `web-performance-auditor.md` on frontend changes.

Next step: `/ship`.
