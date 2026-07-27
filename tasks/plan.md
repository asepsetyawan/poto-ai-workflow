# Implementation Plan: POTO AI Landing (Lumina-inspired)

## Overview

Rebuild `/` as a dark Lumina-style creative hub for **POTO AI**: clone reference stills into `public/poto/`, then replace the current light marketing landing with carousel, featured banner, model grid, inspiration mosaic, and floating prompt dock. Frontend-only. Spec: [`docs/specs/poto-ai-landing.md`](../docs/specs/poto-ai-landing.md).

## Architecture Decisions

- **Clone assets once** from Lumina preview URLs (via browser session) into `apps/frontend/public/poto/*.jpg` (or webp). Source references `/poto/...` only — never commit tokenized CDN URLs.
- **Dark theme tokens** in `index.css` / `@theme` for landing graphite + teal; `AppLayout` on `/` uses dark header (Pricing → `/register`, Log in → `/login`, brand POTO AI).
- **Compose in `features/home/`** with small presentational components + `home-content.ts` for copy/asset map.
- **No promo modal.** No new Radix Dialog dependency.
- **Prompt dock** is decorative UX: submit/click → `navigate('/register')`.
- **CSS motion only** (carousel transition, hover); respect `motion-reduce:`.
- **No backend / schema changes.**

## Dependency Graph

```
Clone assets → public/poto/
        │
        ├── Dark theme tokens + AppLayout (Pricing→register)
        │
        └── home-content.ts + failing HomePage tests
                │
                ├── Carousel + Featured banner
                │
                ├── Model grid + Inspiration (filters)
                │
                └── Prompt dock + polish / verify
```

## Task List

### Phase 1: Assets & chrome

#### Task 1: Clone Lumina stills into `public/poto/`

**Description:** From the live Lumina page (or captured preview URLs), download a minimal set of stills for carousel (2–3), featured banner (1), model cards (3–4), and inspiration mosaic (6–8). Save under `apps/frontend/public/poto/` with stable filenames. Add a short `public/poto/README.md` noting demo/reference origin.

**Acceptance criteria:**

- [ ] `public/poto/` contains local image files used by the landing
- [ ] No `x-aip-token` URLs in committed source
- [ ] README documents that files are reference clones for POTO AI demo

**Verification:**

- [ ] Files open locally; `ls apps/frontend/public/poto` shows expected set

**Dependencies:** None

**Files likely touched:**

- `apps/frontend/public/poto/*`
- `apps/frontend/public/poto/README.md`

**Estimated scope:** Small–Medium

#### Task 2: Dark landing chrome — tokens + AppLayout

**Description:** Add dark studio tokens (background, card, teal CTA). Update `AppLayout` on `/`: dark header, **POTO AI** brand, **Pricing** → `/register`, **Log in** → `/login` (and Register / Users / Log out when signed in). Keep constrained light shell for auth/users routes.

**Acceptance criteria:**

- [ ] `/` header is dark full-bleed compatible with studio page
- [ ] Pricing links to `/register`; Log in to `/login`
- [ ] `/login` and `/users` remain readable (not broken by dark full-bleed)

**Verification:**

- [ ] Manual `/` vs `/login`
- [ ] `npm run typecheck --workspace=@ai-workflow/frontend`

**Dependencies:** None (can parallel Task 1)

**Files likely touched:**

- `apps/frontend/src/app/index.css`
- `apps/frontend/src/components/layout/AppLayout.tsx`
- `apps/frontend/src/components/ui/Button.tsx` (dark variants if needed)

**Estimated scope:** Medium (2–3 files)

### Checkpoint: Foundation

- [ ] Assets on disk; dark header Pricing→register works; typecheck clean

### Phase 2: Studio home slices

#### Task 3: Content module + RED tests for new structure

**Description:** Add `home-content.ts` mapping zones to local `/poto/...` paths and POTO AI copy (Image / Video / Audio). Rewrite `HomePage.test.tsx` for: brand, Pricing→`/register`, Log in→`/login`, Image/Video/Audio labels, prompt dock, no “Lumina”/“Seed” strings. Tests fail until UI lands.

**Acceptance criteria:**

- [ ] `home-content.ts` has carousel, featured, models, inspiration entries
- [ ] Tests encode new structure and CTA hrefs
- [ ] Tests fail on current light landing (RED)

**Verification:**

- [ ] `npm run test --workspace=@ai-workflow/frontend -- src/features/home/HomePage.test.tsx` fails for missing structure

**Dependencies:** Task 1 (paths), Task 2 optional

**Files likely touched:**

- `apps/frontend/src/features/home/home-content.ts`
- `apps/frontend/src/features/home/HomePage.test.tsx`

**Estimated scope:** Small (2 files)

#### Task 4: Carousel + featured banner

**Description:** Implement horizontal featured carousel (prev/next, keyboard) and featured model banner using `home-content` + local assets. Try now → `/register`. Wire into `HomePage`.

**Acceptance criteria:**

- [ ] Carousel shows ≥2 promo cards with local images
- [ ] Prev/next works; reduced-motion safe
- [ ] Featured banner shows POTO AI copy + Try now → `/register`

**Verification:**

- [ ] Manual carousel; typecheck

**Dependencies:** Task 3

**Files likely touched:**

- `features/home/components/FeatureCarousel.tsx`
- `features/home/components/FeaturedBanner.tsx`
- `features/home/HomePage.tsx`

**Estimated scope:** Medium (3–4 files)

#### Task 5: Model grid + Inspiration section

**Description:** 2×2 (or similar) model/capability cards (Image / Video / Audio + optional fourth) with Hot/New badges as content flags. Inspiration section with All / Image / Video filter chips and mosaic from `public/poto/`.

**Acceptance criteria:**

- [ ] Image, Video, Audio cards visible
- [ ] Inspiration filters change visible set client-side
- [ ] No Lumina/Seed* copy

**Verification:**

- [ ] Frontend tests progressing toward green; manual filter check

**Dependencies:** Task 4

**Files likely touched:**

- `features/home/components/ModelGrid.tsx`
- `features/home/components/InspirationGallery.tsx`
- `features/home/HomePage.tsx`
- `HomePage.test.tsx` (if needed)

**Estimated scope:** Medium (3–4 files)

#### Task 6: Prompt dock + final polish

**Description:** Floating “Describe the scene you want to generate” dock; submit or primary action → `/register`. Ensure page padding so dock doesn’t cover inspiration. Motion polish; update tests to green; remove old light marketing sections entirely.

**Acceptance criteria:**

- [ ] Prompt dock visible; interaction → `/register`
- [ ] All HomePage tests pass
- [ ] No promo modal in the tree
- [ ] Mobile: no horizontal overflow

**Verification:**

- [ ] `npm run typecheck && npm run lint && npm run test --workspace=@ai-workflow/frontend`

**Dependencies:** Task 5

**Files likely touched:**

- `features/home/components/PromptDock.tsx`
- `features/home/HomePage.tsx`
- `HomePage.test.tsx`
- `AppLayout.tsx` / `index.css` as needed

**Estimated scope:** Medium (3–4 files)

### Checkpoint: Complete

- [ ] Spec success criteria met (zones, branding, CTAs, local assets, no modal)
- [ ] Root typecheck + lint + frontend tests green
- [ ] Ready for `/build` completion → `/test` → `/review`

## Risks and Mitigations

| Risk                                      | Impact | Mitigation                                                 |
| ----------------------------------------- | ------ | ---------------------------------------------------------- |
| Tokenized CDN URLs expire during download | Med    | Download in one browser session; persist files immediately |
| Large binary assets bloat git             | Med    | Cap resolution/count; prefer webp/jpg under ~500KB each    |
| Copyright of cloned stills                | Med    | Demo-only; README note; user approved clone                |
| Dark layout breaks auth pages             | Med    | Route-aware `AppLayout` (already patterned)                |
| Over-scoping full Lumina app shell        | Low    | Hamburger no-op; no generation                             |

## Parallelization

- Task 1 (assets) ∥ Task 2 (chrome)
- After Task 3: Tasks 4→5→6 sequential

## Open Questions

None — locked in spec.
