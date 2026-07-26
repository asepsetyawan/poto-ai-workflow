# ai-workflow

Monorepo starter: **Express API** + **React SPA**, with an AI-native development workflow
built entirely on Cursor's native customization — no `CLAUDE.md`/`AGENTS.md` layer, just
[Rules](https://cursor.com/docs/rules.md) (`.cursor/rules/`) and
[Agent Skills](https://cursor.com/docs/skills.md) (`.cursor/skills/`, `.agents/skills/`).
Conventions live there, not in a separate doc, so they're always in context and scoped
to the files they apply to.

## Stack

| App      | Location        | Tech                                                         |
| -------- | --------------- | ------------------------------------------------------------ |
| Backend  | `apps/backend`  | Express 4, TypeScript, PostgreSQL, Drizzle, Zod, JWT, Vitest |
| Frontend | `apps/frontend` | React 19, Vite, TanStack Query, React Router, Zod, Vitest    |

## Getting started

```bash
cp apps/backend/.env.example apps/backend/.env   # set DATABASE_URL, JWT_SECRET, etc.
docker compose up -d
npm install
npm run db:migrate
npm run db:seed                                  # optional: dev@example.com / password123

npm run dev:backend                              # :3000
npm run dev:frontend                             # :5173
```

Verify:

```bash
curl http://localhost:3000/health
open http://localhost:5173
```

## Everyday commands (repo root)

| Command                | What it does                              |
| ---------------------- | ----------------------------------------- |
| `npm run dev:backend`  | API with hot reload                       |
| `npm run dev:frontend` | SPA with Vite (proxies `/api` to backend) |
| `npm run typecheck`    | TypeScript — all workspaces               |
| `npm run lint`         | ESLint — all workspaces                   |
| `npm run test`         | Backend integration tests (real Postgres) |
| `npm run build`        | Production builds                         |

## Repository layout

```
apps/
  backend/     Express API, Drizzle migrations, integration tests
  frontend/    React SPA
.cursor/
  rules/       Always-on and file-scoped agent rules (.mdc)
  skills/      Tech-stack skills, /new-resource, and /spec../ship lifecycle entry points
.agents/
  skills/      Lifecycle skills from addyosmani/agent-skills (see below)
docs/          Engineering workflow documentation
skills-lock.json  Locked source/version of every installed .agents skill
```

App-specific architecture skills (auto-scoped to each package in monorepos):

- `apps/backend/.cursor/skills/backend-architecture/`
- `apps/frontend/.cursor/skills/frontend-architecture/`

Deeper, tech-specific skills live in the top-level `.cursor/skills/` (visible under
Cursor's Customize → Skills) and auto-surface for matching files via each skill's `paths`
frontmatter: `express-api-layering`, `drizzle-postgres-patterns`, `jwt-auth-flow`,
`vitest-integration-testing`, `react-query-data-layer`, `react-feature-structure`,
`vite-react-tooling`.

Invoke any of these in Cursor Agent with `/<skill-name>`, e.g. `/backend-architecture` or
`/drizzle-postgres-patterns`.

## Testing

Backend tests in `apps/backend/tests/` run against real Postgres locally and in CI.
Frontend unit tests live beside features under `apps/frontend/src/`.

## Agent workflow

- **Rules** in `.cursor/rules/` — short, always-on or file-scoped constraints:
  `monorepo.mdc`, `backend.mdc`, `frontend.mdc`, `workflow.mdc` (definition of done),
  `git-conventions.mdc`.
- **Skills** — detailed, multi-step workflows: architecture overviews per app
  (`apps/<app>/.cursor/skills/`), deep tech-specific patterns and the `/new-resource`
  scaffold in the top-level `.cursor/skills/`, and the full engineering lifecycle in
  `.agents/skills/` (below).

When adding a backend resource, read `apps/backend/src/modules/users/` and run
`/new-resource` in Cursor Agent (see `.cursor/skills/new-resource/SKILL.md`).

### End-to-end lifecycle (`addyosmani/agent-skills`)

`.agents/skills/` carries 10 lifecycle skills from
[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), tracked in
`skills-lock.json`, covering the full **Define → Plan → Build → Verify → Review → Ship**
pipeline:

| Phase  | Skill(s)                                                                   |
| ------ | -------------------------------------------------------------------------- |
| Meta   | `using-agent-skills` — routes any task to the right skill                  |
| Define | `spec-driven-development`                                                  |
| Plan   | `planning-and-task-breakdown`                                              |
| Build  | `incremental-implementation`, `test-driven-development`                    |
| Verify | `debugging-and-error-recovery`                                             |
| Review | `code-review-and-quality`, `security-and-hardening`, `code-simplification` |
| Ship   | `git-workflow-and-versioning`                                              |

The upstream repo's `/spec /plan /build /test /review /ship` shortcuts live in
Claude/Gemini-specific command folders that Cursor doesn't read, so this repo adds
matching entry-point skills in `.cursor/skills/{spec,plan,build,test,review,ship}/` —
each is a short pointer into the relevant `.agents/skills/` workflow plus this repo's own
architecture skills/rules, invoked the same way: type `/spec`, `/plan`, `/build`,
`/test`, `/review`, or `/ship` in Cursor Agent. A typical feature runs all six in order;
a small bug fix might only need `/test` (which routes to `debugging-and-error-recovery`
on failure) then `/review`.

Manage the lifecycle skill set with the [skills CLI](https://skills.sh):

```bash
npx skills list                                                    # what's installed
npx skills add addyosmani/agent-skills --list                      # browse all 24
npx skills add addyosmani/agent-skills --skill <name>               # add one
npx skills update                                                   # update to latest
```

Note: only each skill's own `SKILL.md` is installed, not the upstream `references/`
checklists it occasionally points to (e.g. `definition-of-done.md`) — this repo's own
`workflow.mdc` rule covers the equivalent "definition of done" instead.
