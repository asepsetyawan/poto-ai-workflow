# Production-Grade Agentic Engineering Workflow

**Sources:**

- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — "Production-grade engineering skills for AI coding agents," 24 skills mapped to a `DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP` lifecycle, 8 slash commands, 4 specialist agent personas.
- [FORGET Loop Engineering. Agentic Engineering is about THIS](https://www.youtube.com/watch?v=VQy50fuxI34) — argues effective agentic engineering isn't an unstructured prompt-and-retry loop, but a gated pipeline with verification at every step (the thesis this diagram operationalizes).

## Diagram

```mermaid
flowchart TD
    Start(["New idea / task"]) --> Meta{{"using-agent-skills (meta)\nroutes work to the right skill"}}

    Meta --> Define

    subgraph Define["DEFINE — Clarify what to build  ·  /spec"]
        direction TB
        D1["interview-me\none question at a time, until ~95% confidence"]
        D2["idea-refine\ndivergent → convergent thinking"]
        D3["spec-driven-development\nPRD: objectives, structure, style, tests, boundaries"]
        D1 --> D2 --> D3
    end

    Define -->|"Spec approved"| Plan

    subgraph Plan["PLAN — Break it down  ·  /plan"]
        direction TB
        P1["planning-and-task-breakdown\nsmall, atomic, testable tasks + dependency order"]
    end

    Plan -->|"Human approves the plan"| Build

    subgraph Build["BUILD — Write the code  ·  /build  (or /build auto)"]
        direction TB
        B1["incremental-implementation\nthin vertical slices, feature flags, rollback-friendly"]
        B2["test-driven-development\nRed → Green → Refactor, 80/15/5 test pyramid"]
        B3["context-engineering\nright info at the right time"]
        B4["api-and-interface-design\ncontract-first, Hyrum's Law"]
        B5["frontend-ui-engineering\ndesign systems, WCAG 2.1 AA"]
        B6["source-driven-development\nground decisions in official docs"]
        B7["doubt-driven-development\nadversarial self-review on risky decisions"]
        B1 --> B2
    end

    Build -->|"One slice implemented + tested"| Verify

    subgraph Verify["VERIFY — Prove it works  ·  /test"]
        direction TB
        V1["debugging-and-error-recovery\nreproduce → localize → reduce → fix → guard"]
        V2["browser-testing-with-devtools\nDOM, console, network, perf traces"]
        V3["test-engineer persona\ncoverage analysis + the Prove-It pattern"]
    end

    Verify -->|"Tests fail"| Build
    Verify -->|"Evidence: tests pass, build green"| Review

    subgraph Review["REVIEW — Quality gates before merge  ·  /review  /code-simplify"]
        direction TB
        R1["code-review-and-quality\nfive-axis review, ~100-line changes, severity labels"]
        R2["security-and-hardening\nOWASP Top 10, threat modeling, dependency audit"]
        R3["performance-optimization\nmeasure-first, Core Web Vitals  ·  /webperf"]
        R4["code-simplification\nChesterton's Fence, Rule of 500"]
        R5["code-reviewer persona — Staff Engineer standard"]
        R6["security-auditor persona"]
        R7["web-performance-auditor persona"]
    end

    Review -->|"Request changes"| Build
    Review -->|"Approved: improves code health"| Ship

    subgraph Ship["SHIP — Deploy with confidence  ·  /ship"]
        direction TB
        S1["git-workflow-and-versioning\ntrunk-based dev, atomic commits"]
        S2["ci-cd-and-automation\nShift Left, quality-gate pipeline, feature flags"]
        S3["documentation-and-adrs\nrecord the why"]
        S4["observability-and-instrumentation\nstructured logs, RED metrics, tracing"]
        S5["shipping-and-launch\nstaged rollout, rollback plan, monitoring"]
        S6["deprecation-and-migration\nretire old code safely"]
        S1 --> S2 --> S4 --> S5
    end

    Ship --> Live(["Production\nmonitored, rollback-ready"])
    Live -.->|"Incident / regression detected"| Verify

    classDef definePhase fill:#dbeafe,stroke:#2563eb,color:#1e3a8a;
    classDef planPhase fill:#ede9fe,stroke:#7c3aed,color:#4c1d95;
    classDef buildPhase fill:#dcfce7,stroke:#16a34a,color:#14532d;
    classDef verifyPhase fill:#fef9c3,stroke:#ca8a04,color:#713f12;
    classDef reviewPhase fill:#ffedd5,stroke:#ea580c,color:#7c2d12;
    classDef shipPhase fill:#fee2e2,stroke:#dc2626,color:#7f1d1d;

    class D1,D2,D3 definePhase;
    class P1 planPhase;
    class B1,B2,B3,B4,B5,B6,B7 buildPhase;
    class V1,V2,V3 verifyPhase;
    class R1,R2,R3,R4,R5,R6,R7 reviewPhase;
    class S1,S2,S3,S4,S5,S6 shipPhase;
```

## Reading the diagram

- **Meta routing (`using-agent-skills`)** — the entry point for every session: decides which skill(s) apply before any work starts, so an agent doesn't skip straight to code.
- **Six phases, 8 commands, 24 skills** — each phase maps to one or two slash commands (`/spec`, `/plan`, `/build`, `/test`, `/review`, `/code-simplify`, `/webperf`, `/ship`) and activates the relevant skills automatically (e.g. designing an API triggers `api-and-interface-design`).
- **Two feedback loops, not a straight line** — `VERIFY` failures loop back to `BUILD` (fix and re-slice), and `REVIEW` "request changes" loops back to `BUILD` too. This is the core difference from unstructured "loop engineering": failures re-enter a _gated_ step, not an open-ended retry.
- **Agent personas plug into VERIFY/REVIEW** — `test-engineer`, `code-reviewer`, `security-auditor`, and `web-performance-auditor` are specialist lenses applied at the quality-gate phases, not separate pipeline stages.
- **`/build auto`** — collapses `PLAN` + `BUILD` into one approved autonomous pass (you approve the plan once, then every task is still individually test-driven and committed, pausing on failures/risky steps) — it removes the human stepping _between_ tasks, not the verification gates themselves.
- **Post-ship loop** — production incidents/regressions re-enter at `VERIFY`, not at `DEFINE` — the fix goes through the same test → review → ship gates as any other change.

## Why this matches "Agentic Engineering is about THIS," not loop engineering

The video's core argument (per its title/thesis) is that agentic coding value doesn't come from bigger prompt loops or longer autonomous runs — it comes from **enforced structure**: specs before code, small verifiable slices, mandatory review axes, and evidence-based verification at every gate. That's exactly what this pipeline encodes: no phase transition happens without an artifact (spec, plan, passing tests, review approval) — the loop only ever re-enters a gated phase, never bypasses one.

---

## Technical Architecture

The diagram above is the _process_ view (what phase you're in). This section is the _implementation_
view — how the `agent-skills` package is actually structured as a repo, how it gets distributed into
different agent runtimes, and what happens mechanically when a skill fires.

### Package & distribution architecture

The repo is one source of truth (`skills/`, `agents/`, `references/`, `hooks/`, command defs, plugin
manifests). Every supported tool consumes the same source through a different adapter mechanism —
some are native plugin installs, some are file copies, some are just Markdown pasted into a
tool-specific instruction file.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#f8fafc', 'primaryTextColor': '#1e293b', 'primaryBorderColor': '#64748b', 'lineColor': '#64748b', 'fontFamily': 'Inter, Segoe UI, sans-serif'}}}%%
flowchart LR
    subgraph Source["agent-skills repo — single source of truth"]
        direction TB
        SK["skills/\n24 SKILL.md files\n(23 lifecycle + using-agent-skills meta)"]
        AG["agents/\n4 persona files\ncode-reviewer · test-engineer\nsecurity-auditor · web-performance-auditor"]
        RF["references/\n7 checklists\nsecurity · testing · performance\na11y · observability · orchestration · DoD"]
        HK["hooks/\nsession lifecycle hooks"]
        CMD["8 slash command defs\n/spec /plan /build /test\n/review /code-simplify /webperf /ship"]
        MANIFEST["plugin manifests\nplugin.json · .claude-plugin · .codex-plugin"]
    end

    SK --> CLI{"Install path"}
    AG --> CLI
    CMD --> CLI
    MANIFEST --> CLI

    CLI -->|"npx skills add\n(universal CLI, 70+ agents)"| Universal["Any agent accepting\nsystem prompts / instruction files"]
    CLI -->|"/plugin marketplace add\n/plugin install"| Claude["Claude Code\n.claude-plugin/ + .claude/commands/"]
    CLI -->|"codex plugin marketplace add"| Codex["Codex CLI (>=0.122)\nreads skills/ via .codex-plugin/plugin.json\ninvoke with @skill-name"]
    CLI -->|"gemini skills install"| Gemini["Gemini CLI\nnative skills, or pasted into GEMINI.md"]
    CLI -->|"agy plugin install"| Antigravity["Antigravity CLI\nnative plugin: skills + subagents + commands"]
    CLI -->|"manual sync"| Cursor["Cursor\n.cursor/skills/ (full text)\n.cursor/rules/*.mdc (short policies only)"]
    CLI -->|"manual copy"| Windsurf["Windsurf\nskill content pasted into rules config"]
    CLI -->|"AGENTS.md + skill tool"| OpenCode["OpenCode\nagent-driven skill execution"]
    CLI -->|"agents/ as personas"| Copilot["GitHub Copilot\n.github/copilot-instructions.md"]
    CLI -->|"native"| Kiro["Kiro IDE / CLI\n.kiro/skills/ (project or global)"]

    classDef src fill:#eef2ff,stroke:#4f46e5,color:#312e81;
    classDef adapter fill:#ecfdf5,stroke:#059669,color:#064e3b;
    class SK,AG,RF,HK,CMD,MANIFEST src;
    class Universal,Claude,Codex,Gemini,Antigravity,Cursor,Windsurf,OpenCode,Copilot,Kiro adapter;
```

**Note for this repo specifically:** we followed the Cursor adapter pattern above end-to-end, per
upstream's own
[`docs/cursor-setup.md`](https://github.com/addyosmani/agent-skills/blob/main/docs/cursor-setup.md) —
`.cursor/skills/` is "the source of truth for the agent." All 24 skills live there with full
text, their 7 supporting checklists live in `.cursor/references/`, and the 4 specialist
personas live in `.cursor/agents/` — all synced 1:1 from upstream so in-skill relative
mentions of `references/x.md` / `agents/x.md` resolve correctly. Cursor also auto-discovers
project skills from `.agents/skills/` (they're equivalent per
[cursor.com/docs/skills](https://cursor.com/docs/skills)), but this repo standardized on
`.cursor/skills/` alone since it's Cursor-only today (no `.claude/`, `.codex/`, `.zed/`, etc.).
One consequence: the `npx skills` CLI's `add`/`update` commands hardcode `.agents/skills/` as
their Cursor write target, so they can't manage this tree — upstream updates are synced by
bumping the pinned `agent-skills/` git submodule (the doc's "Optional: git submodule or vendor
clone" layout element) and `rsync`-ing its `skills/`, `references/`, and `agents/` into their
`.cursor/` counterparts (see README). `skills-lock.json` is kept as a record of what was last
synced. A routing rule,
`.cursor/rules/agent-skills.mdc`, points the agent at `using-agent-skills` before non-trivial
work, matching the doc's "Add minimal project rules" step. All 8 lifecycle commands (`/spec
/plan /build /test /review /code-simplify /webperf /ship`) are implemented as
`disable-model-invocation` skills under `.cursor/skills/<command>/`, since Cursor has no native
slash-command or subagent-spawning primitive — commands read the matching persona file directly
instead of delegating to a subagent tool. Short, enforceable policies are pulled into
`.cursor/rules/*.mdc` rather than pasting entire skill files into always-on context.

### Skill resolution & execution flow (what happens when a skill fires)

This is the mechanical sequence behind a single skill invocation — how `using-agent-skills` routes
work, how progressive disclosure keeps token usage low, and how the anti-rationalization table and
verification gate stop an agent from silently skipping a step.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#f8fafc', 'primaryTextColor': '#1e293b', 'primaryBorderColor': '#64748b', 'lineColor': '#64748b', 'fontFamily': 'Inter, Segoe UI, sans-serif'}}}%%
sequenceDiagram
    participant U as Developer
    participant R as Agent Runtime
    participant M as using-agent-skills (meta)
    participant S as Matched SKILL.md
    participant Ref as references/*.md
    participant G as Verification Gate

    U->>R: Invoke /review (or organic trigger: "review this PR")
    R->>M: Route request (task text + each skill's frontmatter description)
    M->>M: Match "Use when..." trigger conditions
    M->>S: Resolve to code-review-and-quality (+ security-and-hardening if input/auth touched)
    R->>S: Load SKILL.md into context (Overview, When to Use, Process, Rationalizations, Red Flags, Verification)
    S->>R: Execute Process steps 1..N
    opt Step needs deeper detail
        S->>Ref: Progressive disclosure - pull checklist only when needed
        Ref-->>S: e.g. security-checklist.md content
    end
    R->>R: Attempt shortcut ("tests can come later")
    R->>S: Check Rationalizations table
    S-->>R: Documented counter-argument - shortcut rejected
    R->>G: Submit evidence (tests passing, build output, diff)
    G-->>U: Pass: merge allowed / Fail: back to Process step
```

### Reading the technical diagrams

- **One source, many adapters.** The 24 `SKILL.md` files never change per tool — only how they're
  _surfaced_ changes: full-text install (Claude Code `.claude/skills/`, Cursor `.cursor/skills/`
  or `.agents/skills/`), plugin manifest read (Codex), pasted-into-instructions (Copilot,
  Windsurf, Gemini's `GEMINI.md` path), or
  agent-driven lookup (OpenCode's `skill` tool). This is why the same skill pack works across 70+
  agents without a rewrite per tool.
- **Frontmatter is the router, not the content.** `using-agent-skills` only reads each skill's
  `description` field (its "Use when…" trigger) to decide relevance — the full body only loads once
  a skill is actually selected. This keeps meta-routing cheap even with 24 skills installed.
  Frontmatter is intentionally short; instruction bodies are looked up lazily.
- **Progressive disclosure = the `references/` split.** Checklists (security, testing, performance,
  a11y, observability) are separate files specifically so they don't bloat every skill's context —
  they're pulled in only at the `Process` step that actually needs them.
- **The anti-rationalization table is the enforcement mechanism**, not documentation. It's a
  pre-written table of excuses ("I'll add tests later," "this is a small change, skip review") each
  paired with a counter-argument, so a shortcut has to be argued past explicitly rather than silently
  taken.
- **Verification is evidence, not self-report.** The gate at the end of every skill requires an
  artifact — passing test output, a build log, a diff — before a step counts as done. "Looks right"
  never satisfies it.
