# Spec: POTO AI Landing Page

## Objective

Replace the current starter `HomePage` with a marketing landing page for **POTO AI** — a product that lets creators generate **image**, **video**, and **audio** with AI.

**Primary user:** a creator or marketer evaluating the product for the first time (unauthenticated).

**Job to be done:** understand what the platform does in one viewport scroll, feel the brand, and take a clear next step (sign up or sign in).

**Success looks like:** a visitor lands on `/`, immediately recognizes **POTO AI** and the three media capabilities, and can reach register/login without hunting.

### User stories

1. As a visitor, I see **POTO AI** as the hero-level brand signal, one headline, one supporting line, and a primary CTA.
2. As a visitor, I understand that I can generate image, video, and audio — each called out in its own focused section.
3. As a visitor, I can start with **Get started** → `/register` or **Log in** → `/login` from the hero CTA group and the site header.
4. As an authenticated user, I still land on `/`, see the same landing page, and still see **Get started** (not a studio stub). Existing app links (e.g. Users) remain available in the layout when signed in.

## Decisions (locked)

| Question       | Decision                                                               |
| -------------- | ---------------------------------------------------------------------- |
| Product name   | **POTO AI**                                                            |
| Scope          | Landing page only — no generation studio UI/APIs                       |
| Feature folder | Evolve `features/home/`                                                |
| Layout on `/`  | Full-bleed (escape the 960px `AppLayout` cage)                         |
| Styling / UI   | **Tailwind CSS** + **Radix UI**                                        |
| Assets         | May fetch from the internet (remote URLs or downloaded into `public/`) |
| Signed-in CTA  | Always **Get started** → `/register`                                   |

## Tech Stack

| Layer      | Choice                                                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| App        | `apps/frontend` (React 19 + Vite 6 + React Router 7)                                                                                                 |
| Styling    | **Tailwind CSS** (v4 preferred if it installs cleanly with Vite 6; else v3)                                                                          |
| Primitives | **Radix UI** primitives as needed (e.g. `@radix-ui/react-slot`, navigation/dialog only if a concrete a11y need appears — do not add unused packages) |
| Fonts      | Via Tailwind / Google Fonts — expressive display + readable body (no Inter/Roboto/Arial/system as the primary stack)                                 |
| Auth CTAs  | Existing `/register` and `/login` routes — no new auth API                                                                                           |
| Assets     | Unsplash / similar remote imagery or files under `apps/frontend/public/` — attribute if license requires                                             |
| Backend    | **Out of scope** — no generation APIs                                                                                                                |

**Approved new dependencies (this feature):** Tailwind CSS (+ Vite plugin / PostCSS as required by the chosen Tailwind major), and Radix UI packages actually used by the landing. Ask before adding animation libraries (e.g. framer-motion) or full UI kits on top of Radix.

## Commands

```bash
# From repo root
npm run dev:frontend          # SPA on :5173
npm run typecheck             # all workspaces
npm run lint                  # all workspaces
npm run test --workspace=@ai-workflow/frontend   # home/landing-related tests
```

## Project Structure

```
apps/frontend/
  index.html                   # font preconnect / stylesheet if needed
  public/                      # optional downloaded hero/section assets
  src/
    app/
      routes.tsx               # `/` → HomePage
      index.css                # Tailwind entry (@import "tailwindcss" or directives)
    components/layout/
      AppLayout.tsx            # brand → POTO AI; full-bleed on `/`
    features/home/
      HomePage.tsx             # landing composition
      HomePage.test.tsx        # brand, three capabilities, CTA hrefs
docs/specs/
  poto-ai-landing.md           # this spec
```

## Code Style

Match existing feature layout: page under `features/home/`, routes in `app/routes.tsx`, shared chrome in `components/layout/`.

```tsx
// features/home/HomePage.tsx — illustrative shape
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-svh ..." aria-labelledby="landing-brand">
        <p id="landing-brand" className="...">
          POTO AI
        </p>
        <h1 className="...">Create image, video, and audio with AI</h1>
        <p className="...">One studio for every medium your story needs.</p>
        <div className="flex gap-4">
          <Link to="/register">Get started</Link>
          <Link to="/login">Log in</Link>
        </div>
      </section>
      {/* One section each: Image / Video / Audio — one job per section */}
    </div>
  );
}
```

**Conventions:**

- Prefer Tailwind utility classes; use CSS variables in `@theme` / `:root` for brand tokens.
- Use Radix only where it earns its weight (accessible trigger/slot patterns) — not a wrapping layer over every `<a>`.
- Semantic HTML + `aria-labelledby` on major sections.
- No global state libraries; no generation business logic in `HomePage`.

## Design direction (landing-specific)

Follow the repo frontend design rules for promotional surfaces:

| Rule                   | Application here                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| One composition        | First viewport = brand + one headline + one lede + CTA group + one dominant visual plane                     |
| Brand first            | **POTO AI** is hero-level, not a nav-only label                                                              |
| Full-bleed hero        | Edge-to-edge visual plane / background — not an inset card                                                   |
| No cards in hero       | Capability areas below: default no cards                                                                     |
| One job per section    | Separate Image / Video / Audio sections after the hero                                                       |
| Motion                 | 2–3 intentional motions (hero fade/rise, section reveal, CTA hover); respect `prefers-reduced-motion`        |
| Avoid AI-default looks | No purple-indigo gradients; no cream+terracotta serif broadsheet; no dark-mode-by-default glow/pill clusters |

**Chosen visual direction:** cool graphite + electric teal accent on a layered photographic/gradient atmosphere (cinema/studio feel). Display font e.g. Syne or Outfit; body e.g. Source Sans 3. Light-leaning page; dark accents for contrast only.

**Hero content budget:**

1. Brand: **POTO AI**
2. Headline: one line on multi-medium creation
3. Supporting sentence: one short line
4. CTA group: **Get started** → `/register`, **Log in** → `/login` (same for signed-in users)
5. Dominant visual: full-bleed studio/media atmosphere (CSS + internet/public asset — no floating badges/overlays)

**Below the fold (ordered):**

1. Image generation — one headline, one short line, optional media still
2. Video generation — same pattern
3. Audio generation — same pattern
4. Closing CTA strip — **Get started** → `/register`

**Out of first viewport:** pricing, feature matrices, stats strips, schedule/event blocks, pill clusters, icon rows.

## Testing Strategy

| Level      | What                                                                                               | Where                             |
| ---------- | -------------------------------------------------------------------------------------------------- | --------------------------------- |
| Component  | Brand “POTO AI”, headline, three capability headings, Get started → `/register`, Log in → `/login` | `features/home/HomePage.test.tsx` |
| Manual     | First viewport brand test; mobile + desktop; reduced motion                                        | `npm run dev:frontend`            |
| Repo gates | typecheck + lint + frontend tests                                                                  | root scripts                      |

Coverage expectation: assert user-visible structure and CTA targets; do not snapshot entire Tailwind output.

## Boundaries

**Always:**

- Keep `/` as the public landing route served by `features/home`.
- Wire CTAs to existing `/register` and `/login`; signed-in users still see **Get started**.
- Full-bleed layout on `/` (landing-aware `AppLayout` exception is fine).
- Run `npm run typecheck`, `npm run lint`, and frontend tests before calling the task done.
- Preserve existing auth and users flows.
- Meet accessibility basics: landmarks, keyboard-reachable CTAs, sufficient contrast.
- Prefer license-safe remote assets; document source if required.

**Ask first:**

- Adding dependencies beyond Tailwind + the Radix packages actually used (e.g. framer-motion, shadcn full kit).
- Adding real generation APIs or backend modules.
- Changing the product name away from **POTO AI**.
- Replacing `AppLayout` behavior for _all_ routes in a breaking way (auth/users pages must stay usable).
- Adding pricing, blog, or dashboard routes.

**Never:**

- Implement actual image/video/audio generation in this slice.
- Commit secrets or hardcode API keys for media providers.
- Ship a card-heavy dashboard-style first viewport.
- Break protected `/users` or auth flows.

## Success Criteria

- [ ] `/` renders the **POTO AI** landing (not the “AI Workflow” starter blurb).
- [ ] First viewport shows brand, one headline, one supporting sentence, CTA group, and a dominant full-bleed visual — nothing else competing.
- [ ] Page includes distinct Image, Video, and Audio sections below the fold.
- [ ] Primary CTAs navigate to `/register` and `/login`; signed-in users still see **Get started**.
- [ ] Tailwind is configured and used for the landing; Radix is used only where needed.
- [ ] Layout is full-bleed on `/` and works on mobile and desktop without horizontal overflow.
- [ ] At least 2 intentional motion treatments exist and respect `prefers-reduced-motion`.
- [ ] `HomePage.test.tsx` covers brand + three capabilities + CTA hrefs.
- [ ] `npm run typecheck`, `npm run lint`, and `npm run test --workspace=@ai-workflow/frontend` pass.
- [ ] No backend/schema changes.

## Open Questions

None — decisions above are locked. Ready for `/plan`.
