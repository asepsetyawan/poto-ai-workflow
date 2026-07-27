# Spec: POTO AI Landing Page (Lumina-inspired)

**Reference:** [ByteDance Lumina](https://ai.byteplus.com/lumina/en)  
**Supersedes:** prior POTO AI marketing one-pager (graphite/teal light sections). This revision redesigns `/` to match Lumina’s creative-studio home layout, rebranded for **POTO AI**.

## Objective

Rebuild the public `/` landing in `apps/frontend` so it **visually and structurally mirrors** Lumina’s English landing — dark creative hub with carousel, featured model strip, capability cards, inspiration grid, and floating prompt bar — while all branding, copy, and CTAs are **POTO AI**.

**Primary user:** creator discovering POTO AI (unauthenticated).

**Job to be done:** feel like a modern AI media studio in the first viewport, scan featured models/capabilities, and reach **Get started** / **Log in**.

**Success looks like:** a side-by-side glance at Lumina vs POTO AI reads as the same product pattern (layout, density, dark glass UI), but unmistakably **POTO AI** (no Lumina / ByteDance / Seed* names).

### User stories

1. As a visitor, I see a dark full-bleed studio home with **POTO AI** in the header.
2. As a visitor, I can browse a horizontal **featured carousel** of image / video / audio offerings.
3. As a visitor, I see a **featured model banner** (headline + lede + Try now) with a large visual.
4. As a visitor, I see a **model/capability grid** (image, video, audio at minimum) with short labels.
5. As a visitor, I see an **Inspiration** section with filter chips (All / Image / Video) and a media mosaic.
6. As a visitor, a **floating prompt bar** invites me to describe a scene; submitting / focusing routes me toward register (no real generation).
7. As a visitor, header **Log in** → `/login`; primary CTA → `/register` (labeled Get started or Try now consistently mapped).
8. As a signed-in user, I still see the same landing; CTAs remain Get started / Try now → `/register` (locked earlier).

## Decisions (locked from prior spec)

| Question       | Decision                                          |
| -------------- | ------------------------------------------------- |
| Product name   | **POTO AI**                                       |
| Scope          | Landing page only — no generation studio UI/APIs  |
| Feature folder | `features/home/`                                  |
| Layout on `/`  | Full-bleed landing-aware `AppLayout`              |
| Styling / UI   | Tailwind CSS v4 + Radix (Slot / Dialog as needed) |
| Signed-in CTA  | Still **Get started** / Try now → `/register`     |

## Decisions (this revision — locked)

| Question         | Decision                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Visual reference | Recreate [Lumina EN landing](https://ai.byteplus.com/lumina/en) layout & interaction pattern                 |
| Theme            | **Dark** creative-studio UI                                                                                  |
| Accent           | Teal/cyan primary CTAs                                                                                       |
| Promo modal      | **Excluded** — do not ship                                                                                   |
| Pricing          | Header **Pricing** → `/register`                                                                             |
| Assets           | **Clone** Lumina preview stills into `apps/frontend/public/poto/` (demo use; no live tokenized CDN hotlinks) |
| Naming           | Brand and product labels use **POTO AI** (capability cards: Image / Video / Audio under POTO AI)             |
| Generation       | Prompt bar navigates to `/register` only                                                                     |

## Assumptions (accepted)

1. Recreate UI pattern; do not claim to be Lumina/BytePlus.
2. No ByteDance trademarks in user-visible copy (Lumina, Seedream, Seedance, etc.).
3. Assets are downloaded once into `public/poto/` and referenced by local paths.
4. Inspiration grid is static; filters are client-side only.
5. Hamburger can be a simple no-op or link list — full app shell out of scope.
6. Auth/users routes stay usable under landing-aware layout.

## Reference layout (mapped to POTO AI)

Observed structure on Lumina (first viewport + below):

| Zone         | Lumina pattern                                          | POTO AI adaptation                                           |
| ------------ | ------------------------------------------------------- | ------------------------------------------------------------ |
| Header       | ☰ + brand · Pricing · Login                            | ☰ + **POTO AI** · Pricing → `/register` · Log in → `/login` |
| Carousel     | Large dual cards, prev/next                             | Featured Image / Video / Audio promos branded **POTO AI**    |
| Featured row | Model title + lede + Try now + hero still               | **POTO AI** featured capability + Try now → `/register`      |
| Model grid   | 2×2 cards with Hot/New badges                           | Image / Video / Audio (+ optional 4th) under POTO AI         |
| Prompt dock  | Floating “Describe the scene…”                          | Same UX; Enter / click → `/register`                         |
| Inspiration  | “Fresh inspiration…” + All/Image/Video filters + mosaic | Same; local `public/poto/` assets; client-side filters       |
| Promo modal  | 35% Extra Credits                                       | **Out of scope — excluded**                                  |

**Naming:** user-visible brand is **POTO AI** everywhere; capability titles are Image / Video / Audio (no Seed* / Lumina names).

## Tech Stack

| Layer      | Choice                                                                   |
| ---------- | ------------------------------------------------------------------------ |
| App        | `apps/frontend` (React 19 + Vite 6 + React Router 7)                     |
| Styling    | Tailwind v4 (already wired) + dark theme tokens                          |
| Primitives | `@radix-ui/react-slot` (existing); no Dialog (promo modal excluded)      |
| Motion     | CSS / Tailwind only unless framer-motion approved                        |
| Assets     | Cloned into `apps/frontend/public/poto/` — reference by local paths only |
| Auth CTAs  | `/register`, `/login`                                                    |
| Backend    | Out of scope                                                             |

## Commands

```bash
npm run dev:frontend
npm run typecheck
npm run lint
npm run test --workspace=@ai-workflow/frontend
```

## Project Structure

```
apps/frontend/
  public/poto/                 # downloaded or substitute stills
  src/
    app/index.css              # dark theme tokens for landing
    components/layout/AppLayout.tsx   # dark header on `/`
    components/ui/Button.tsx   # existing Slot button (extend variants)
    features/home/
      HomePage.tsx             # composition
      HomePage.test.tsx
      components/              # Carousel, FeaturedBanner, ModelGrid, PromptDock, Inspiration
      home-content.ts          # copy + asset paths (no secrets)
docs/specs/poto-ai-landing.md  # this spec
```

## Code Style

- Keep page composition in `HomePage`; extract presentational pieces under `features/home/components/`.
- Content/copy/asset paths in a plain `home-content.ts` module for easy edit.
- No BytePlus API calls; no tokenized CDN URLs in source.
- Semantic sections + keyboardable carousel controls.

## Design direction

- **Dark graphite** backgrounds (`~#0a0a0b`–`#17171a`), elevated cards with soft borders.
- **Teal/cyan** primary pills (Login / Try now).
- Large rounded cards (~16–24px), dense studio dashboard — cards **are** allowed here because they are the interaction containers (carousel / model pickers), unlike the prior “no cards in marketing hero” one-pager.
- Brand **POTO AI** must remain a hero-level signal in the header; featured banner title must not overpower the brand.
- ≥2 motions (carousel slide, card/prompt hover or entrance); honor `prefers-reduced-motion`.
- Mobile: stack carousel, keep prompt dock usable; no horizontal page overflow.

## Testing Strategy

| Level      | What                                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Component  | Brand “POTO AI”; Log in → `/login`; Get started/Try now → `/register`; Image/Video/Audio labels present; prompt dock visible |
| Manual     | Visual parity check vs Lumina layout (structure, not pixel-perfect); mobile; no promo modal                                  |
| Repo gates | typecheck, lint, frontend tests                                                                                              |

## Boundaries

**Always:**

- Full-bleed dark landing on `/` only; auth/users remain usable.
- Strip all Lumina/ByteDance/Seed* trademarks from UI copy.
- Prefer local `public/poto/` assets over expiring CDN tokens.
- Preserve existing auth flows.
- Run typecheck, lint, frontend tests before done.

**Ask first:**

- Adding a real Pricing page, credits system, or generation APIs.
- Adding framer-motion / heavy UI kits.
- Re-introducing a promo modal.

**Never:**

- Hotlink production BytePlus `x-aip-token` URLs as permanent assets.
- Implement real image/video/audio generation in this slice.
- Leave “Lumina”, “ByteDance”, or Seed* strings in user-visible UI.
- Break `/login`, `/register`, `/users`.

## Success Criteria

- [ ] `/` matches Lumina’s zone structure: header, carousel, featured banner, model grid, prompt dock, inspiration.
- [ ] All visible branding/copy is POTO AI (no Lumina/Seed*/ByteDance).
- [ ] Primary CTAs → `/register`; Log in → `/login`.
- [ ] Assets load from `public/poto/` or approved substitutes (no dead tokenized URLs).
- [ ] Dark theme + teal accents; works on mobile and desktop.
- [ ] `HomePage` tests updated for new structure.
- [ ] `npm run typecheck`, `npm run lint`, `npm run test --workspace=@ai-workflow/frontend` pass.
- [ ] No backend/schema changes.

## Open Questions

None — decisions locked. Ready for `/plan` → `/build`.
