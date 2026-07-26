# Implementation Plan: POTO AI Landing Page

## Overview

Replace the starter home page with a full-bleed marketing landing for **POTO AI** (image / video / audio generation pitch). Frontend-only: Tailwind CSS + minimal Radix, `features/home`, CTAs to existing auth routes. Spec: [`docs/specs/poto-ai-landing.md`](../docs/specs/poto-ai-landing.md).

## Architecture Decisions

- **Tailwind v4 via `@tailwindcss/vite`** — matches Vite 6; entry in `src/app/index.css`. Fall back to Tailwind v3 + PostCSS only if v4 install fails.
- **Radix `@radix-ui/react-slot` only (initially)** — compose accessible CTA buttons that can render as React Router `Link`. Add more Radix packages only if a real a11y need appears.
- **Landing-aware `AppLayout`** — on `/`, drop the 960px cage and use transparent/overlay header so the hero can be full-bleed; keep constrained layout for `/login`, `/register`, `/users`.
- **Keep `features/home/`** — evolve `HomePage.tsx` in place; add `HomePage.test.tsx` beside it.
- **Assets** — license-safe Unsplash (or similar) URLs for hero + three capability visuals; optionally mirror into `public/` if remote hotlinking is unreliable in tests/CI.
- **Motion via CSS** — Tailwind `animate-*` / keyframes + `motion-reduce:` utilities; no framer-motion unless approved later.
- **No backend changes.**

## Dependency Graph

```
Tailwind + fonts + theme tokens
        │
        ├── AppLayout: POTO AI brand + full-bleed on `/`
        │
        └── HomePage hero (brand, headline, lede, CTAs) + tests
                │
                ├── Image / Video / Audio sections + assets
                │
                └── Closing CTA + motion + Radix Slot CTAs
```

## Task List

### Phase 1: Foundation

#### Task 1: Install and wire Tailwind + brand fonts/tokens

**Description:** Add Tailwind (v4 + Vite plugin preferred) to `@ai-workflow/frontend`, point `index.css` at Tailwind, define graphite/teal theme tokens and Google Fonts (Syne or Outfit + Source Sans 3). Update document title to POTO AI.

**Acceptance criteria:**

- [ ] Tailwind utilities compile in the Vite app
- [ ] Theme tokens exist for brand colors/fonts
- [ ] `index.html` title is `POTO AI`

**Verification:**

- [ ] `npm run typecheck` and `npm run lint` pass
- [ ] Manual: a temporary utility class renders in the browser (removed before merge if only used for smoke)

**Dependencies:** None

**Files likely touched:**

- `apps/frontend/package.json`
- `apps/frontend/vite.config.ts`
- `apps/frontend/src/app/index.css`
- `apps/frontend/index.html`
- root `package-lock.json`

**Estimated scope:** Medium (3–5 files)

#### Task 2: Full-bleed, landing-aware AppLayout + POTO AI nav brand

**Description:** Make `/` full-bleed (no max-width cage). Header brand reads **POTO AI**. Auth/users routes keep a readable constrained shell. Nav still exposes Log in / Register or Users / Log out.

**Acceptance criteria:**

- [ ] On `/`, main content can span the viewport edge-to-edge
- [ ] Header brand link shows `POTO AI` and routes to `/`
- [ ] `/login`, `/register`, `/users` remain usable (not broken by full-bleed styles)

**Verification:**

- [ ] Manual: visit `/` vs `/login` and confirm layout difference
- [ ] `npm run typecheck` passes

**Dependencies:** Task 1

**Files likely touched:**

- `apps/frontend/src/components/layout/AppLayout.tsx`

**Estimated scope:** Small (1–2 files)

### Checkpoint: Foundation

- [ ] Tailwind + fonts work
- [ ] Layout full-bleed on `/` only
- [ ] typecheck + lint clean

### Phase 2: Core landing

#### Task 3: Hero composition + HomePage component tests

**Description:** Rebuild `HomePage` hero per content budget: brand, one headline, one lede, Get started → `/register`, Log in → `/login`, dominant full-bleed visual. Add `HomePage.test.tsx` asserting brand, CTA hrefs (capability headings can be stubbed if sections land in Task 4 — prefer including section heading stubs or land Task 3+4 tightly).

**Acceptance criteria:**

- [ ] First viewport matches hero budget (no stats/cards/pill clusters)
- [ ] CTAs link to `/register` and `/login`; label remains **Get started** regardless of auth
- [ ] Tests cover brand text + both CTA hrefs

**Verification:**

- [ ] `npm run test --workspace=@ai-workflow/frontend`
- [ ] Manual: brand-first first viewport on desktop + mobile width

**Dependencies:** Task 2

**Files likely touched:**

- `apps/frontend/src/features/home/HomePage.tsx`
- `apps/frontend/src/features/home/HomePage.test.tsx`

**Estimated scope:** Medium (2 files)

#### Task 4: Image / Video / Audio sections + assets

**Description:** Add three below-fold sections (one job each) with short copy and media stills from the internet/`public/`. Extend tests to assert the three capability headings. No generation UI.

**Acceptance criteria:**

- [ ] Distinct Image, Video, and Audio sections exist below the fold
- [ ] Each has one headline + one short supporting line + visual
- [ ] Tests assert all three section headings
- [ ] Asset sources are license-safe (comment or README note if required)

**Verification:**

- [ ] `npm run test --workspace=@ai-workflow/frontend`
- [ ] Manual: scroll `/` — sections read as separate jobs, not a card dashboard

**Dependencies:** Task 3

**Files likely touched:**

- `apps/frontend/src/features/home/HomePage.tsx`
- `apps/frontend/src/features/home/HomePage.test.tsx`
- `apps/frontend/public/` (optional mirrored assets)

**Estimated scope:** Medium (2–4 files)

### Checkpoint: Core landing

- [ ] Hero + three capabilities + CTAs complete
- [ ] Frontend tests pass
- [ ] Visual check: not purple/cream AI-default look

### Phase 3: Polish

#### Task 5: Closing CTA, CSS motion, Radix Slot CTAs

**Description:** Add closing Get started strip. Introduce 2–3 intentional motions (hero entrance, section reveal, CTA hover) with `prefers-reduced-motion` / `motion-reduce:` respect. Wire primary CTAs through Radix `Slot` where it earns weight (e.g. shared button styles as `Link`).

**Acceptance criteria:**

- [ ] Closing CTA → `/register` with label **Get started**
- [ ] ≥2 motions present; reduced-motion disables/simplifies them
- [ ] `@radix-ui/react-slot` is a declared dependency and used at least once for CTAs

**Verification:**

- [ ] Manual: load `/` with and without reduced motion
- [ ] `npm run typecheck && npm run lint && npm run test --workspace=@ai-workflow/frontend`

**Dependencies:** Task 4

**Files likely touched:**

- `apps/frontend/package.json`
- `apps/frontend/src/features/home/HomePage.tsx`
- `apps/frontend/src/components/` (optional small `Button` with Slot)
- `apps/frontend/src/app/index.css` (keyframes if needed)
- `package-lock.json`

**Estimated scope:** Medium (3–5 files)

### Checkpoint: Complete

- [ ] All spec success criteria met
- [ ] Root gates: `npm run typecheck`, `npm run lint`, `npm run test` (backend) + frontend tests
- [ ] Ready for `/build` completion review / PR

## Risks and Mitigations

| Risk                               | Impact | Mitigation                                        |
| ---------------------------------- | ------ | ------------------------------------------------- |
| Tailwind v4 Vite plugin friction   | Med    | Fall back to Tailwind v3 + PostCSS per spec       |
| Remote images fail in CI/offline   | Low    | Mirror critical assets into `public/`             |
| Full-bleed breaks auth pages       | Med    | Route-aware layout; verify `/login` at checkpoint |
| Overusing Radix / adding UI kit    | Low    | Slot-only unless a concrete need appears          |
| Design drifts to AI-default purple | Med    | Stick to graphite + teal tokens from the start    |

## Parallelization

- Mostly sequential (layout depends on Tailwind; sections depend on hero shell).
- After Task 1: asset sourcing can happen in parallel with Task 2.

## Open Questions

None — spec decisions are locked.
