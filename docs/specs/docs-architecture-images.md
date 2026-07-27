# Spec: Documentation architecture / AI-workflow images

## Objective

Give contributors a clear, documented place to **manually add** architecture and AI-workflow diagrams to this repo, and a consistent way to embed them in markdown under `docs/`.

**Primary user:** humans and agents adding diagrams by hand (no upload UI).

**Job to be done:** drop an image in one agreed folder, reference it from a docs page with a relative path, and have it render on GitHub.

**Success looks like:** someone opening the README or `docs/` knows exactly where architecture/workflow images go, what to name them, and how to embed them — without putting docs diagrams in `apps/frontend/public/`.

## Assumptions

1. Images are added **manually** (copy into the working tree + commit) — no product upload feature.
2. Scope is **documentation assets** (architecture, agentic workflow, process diagrams), not SPA marketing assets.
3. Frontend UI / POTO landing images stay under `apps/frontend/public/` (existing convention; unchanged).
4. Preferred formats: PNG or SVG for diagrams; JPEG/WebP only when a photo is needed.
5. Keep files reasonably sized for git (prefer compressed PNG/SVG; avoid multi‑MB screenshots when a smaller export works).

## Tech Stack

N/A (docs-only). Markdown + git.

## Commands

```bash
# Inspect docs tree
ls docs/ docs/images/

# Preview markdown locally (optional) — GitHub rendering is the source of truth for links
```

Quality gates still apply for the PR (docs-only change; no app behavior change):

```bash
npm run typecheck
npm run lint
npm run test
```

## Project Structure

```
docs/
  images/                    → Architecture & AI-workflow diagrams (NEW)
    README.md                → Convention: naming, formats, embed examples
    <descriptive-name>.png   → Example: agentic-engineering-workflow.png
  agentic-engineering-workflow.md
  specs/
    docs-architecture-images.md   → This spec
  ...
apps/frontend/public/poto/   → Frontend marketing stills only (OUT OF SCOPE)
```

## Code Style (markdown embed)

```markdown
![Agentic engineering workflow](./images/agentic-engineering-workflow.png)
```

From a nested docs file (e.g. `docs/specs/…`):

```markdown
![Agentic engineering workflow](../images/agentic-engineering-workflow.png)
```

Naming: kebab-case, descriptive of the diagram topic (`agentic-engineering-workflow.png`, not `diagram1.png`).

## Testing Strategy

- Manual: after adding an image + markdown link, open the file on GitHub (or a PR preview) and confirm the image renders.
- No automated image tests required for this change.
- Repo quality gates (`typecheck` / `lint` / `test`) must still pass on the PR.

## Boundaries

- **Always:** Put architecture / AI-workflow / process diagrams in `docs/images/`. Use relative paths from the markdown that embeds them. Prefer PNG or SVG. Document the convention in `docs/images/README.md`. Link the convention from the main README `docs/` layout blurb.
- **Ask first:** Embedding a multi‑MB binary; adding a new top-level image directory outside `docs/images/` or `apps/frontend/public/`; replacing Mermaid diagrams in existing docs with raster images without an explicit reason.
- **Never:** Put docs diagrams under `apps/frontend/public/`. Hotlink external CDNs for architecture diagrams that belong in-repo. Commit secrets or screenshots that contain credentials/PII. Build an upload API/UI as part of this work.

## Success Criteria

1. `docs/images/` exists with a short `README.md` explaining purpose, naming, formats, and embed examples.
2. Root `README.md` repository-layout section mentions `docs/images/` for architecture/workflow diagrams.
3. Optional but preferred: `docs/agentic-engineering-workflow.md` notes that a raster diagram (if present) lives under `docs/images/` — without removing the existing Mermaid diagram unless the user supplies a replacement image.
4. Spec is saved at `docs/specs/docs-architecture-images.md` (this file).
5. No backend/frontend behavior changes; no new runtime dependencies.

## Open Questions

1. ~~Do you already have the image?~~ **Resolved:** `docs/images/ai-workflow.png` and `docs/images/lifecycle.png` added by hand.
2. ~~Mermaid vs PNG?~~ **Resolved:** Keep Mermaid as the editable source of truth; PNGs are supplements above it in `docs/agentic-engineering-workflow.md`.

**Spec locked** — implement via `/build`.
