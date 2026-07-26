# Tasks: POTO AI Landing Page

Spec: [`docs/specs/poto-ai-landing.md`](../docs/specs/poto-ai-landing.md)  
Plan: [`tasks/plan.md`](./plan.md)

## Phase 1: Foundation

- [x] **Task 1:** Install Tailwind (v4 + Vite plugin preferred) + brand fonts/tokens; set `index.html` title to POTO AI
- [x] **Task 2:** Landing-aware `AppLayout` — full-bleed on `/`, brand **POTO AI**; keep constrained shell for auth/users

### Checkpoint: Foundation

- [x] Tailwind + fonts work; full-bleed on `/` only; typecheck + lint clean

## Phase 2: Core landing

- [x] **Task 3:** Rebuild `HomePage` hero (brand, headline, lede, Get started + Log in, full-bleed visual) + `HomePage.test.tsx`
- [x] **Task 4:** Image / Video / Audio sections + license-safe assets; extend tests for three headings

### Checkpoint: Core landing

- [x] Hero + three capabilities + CTAs done; frontend tests pass; visual direction = graphite/teal (not purple/cream defaults)

## Phase 3: Polish

- [x] **Task 5:** Closing Get started CTA; ≥2 CSS motions with `motion-reduce:`; Radix `Slot` for CTA composition

### Checkpoint: Complete

- [x] Spec success criteria all met
- [x] Root: `npm run typecheck && npm run lint` + frontend tests (+ backend tests when Postgres available)
- [ ] Ready for review / ship — run `/test` then `/review` if desired
