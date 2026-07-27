---
name: webperf
description: Entry point for the web performance audit companion to the Review phase of the agent-skills lifecycle (DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP). Only runs when explicitly invoked via /webperf.
disable-model-invocation: true
---

# /webperf — Audit web performance

Applies to `apps/frontend` (browser-facing code) only — skip for backend-only or
non-browser-facing changes and say so instead of manufacturing an audit.

Read and follow `.cursor/skills/performance-optimization/SKILL.md`, and adopt the
`web-performance-auditor` persona defined in `.cursor/agents/web-performance-auditor.md`
for tone and report structure (Cursor has no native subagent spawning, so read that file
directly rather than delegating to a subagent tool).

## Determine the mode

- **Deep mode** — use when any of these is available: a Lighthouse JSON report
  (`npx lighthouse <url> --output json --output-path ./report.json`), a PageSpeed
  Insights JSON response, a CrUX API response (`$CRUX_API_KEY`/`$GOOGLE_API_KEY` env
  vars only — never hard-code them), a DevTools performance trace, or a live URL you can
  measure directly.
- **Quick mode** (default when none of the above exist) — scan the source for structural
  anti-patterns per `.cursor/references/performance-checklist.md` and label every
  finding "potential impact," never a fabricated measured number.

## Run the audit

1. Identify the files, components, or diff under review and the target route(s).
2. Score against the Core Web Vitals targets and checklist in
   `.cursor/references/performance-checklist.md`.
3. Produce a scorecard populated only with sourced values (mark unmeasured fields
   "not measured"), a ranked list of findings, positive observations, and proactive
   recommendations.

## Output

Return the full audit report to the user. Fold blocking findings into `/review`;
non-blocking findings can ship with a follow-up noted in the PR description.
