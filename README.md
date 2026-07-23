# ai-workflow

An Express + TypeScript + PostgreSQL API starter with a standardized, AI-native
development workflow built in — the goal is that any developer (or Claude Code session)
picks this up and builds new features the same way, without re-deriving conventions from
scratch each time.

See [`CLAUDE.md`](./CLAUDE.md) for the full set of conventions this repo enforces. Read
it before your first PR — it's the same rules a human reviewer and an agent are both
held to.

## Stack

- **Express 4** + TypeScript (strict mode, ESM/`NodeNext`)
- **PostgreSQL** via **Drizzle ORM** (`drizzle-kit` for migrations, `drizzle-orm` for
  queries)
- **Zod** for request validation, with types inferred from schemas
- **JWT** auth (swap for Clerk/Auth0/etc. by replacing `src/lib/jwt.ts` +
  `src/middleware/auth.ts` — see CLAUDE.md)
- **Pino** structured logging (`pino-http` request logs, pretty-printed in dev)
- **Vitest** + **Supertest** for tests, run against a real Postgres instance
- **ESLint 9 (flat config) + Prettier + Husky/lint-staged** for consistent style,
  enforced automatically on commit

## Getting started

```bash
cp .env.example .env          # fill in real values; never commit .env
docker compose up -d          # starts local Postgres on :5432
npm install
npm run db:generate           # generates SQL from src/db/schema.ts (already committed on first clone)
npm run db:migrate            # applies migrations to DATABASE_URL
npm run db:seed               # optional: creates dev@example.com / password123
npm run dev                   # starts the API on :3000 with hot reload
```

Verify it's running:

```bash
curl http://localhost:3000/health
```

## Everyday commands

| Command                       | What it does                                          |
| ----------------------------- | ----------------------------------------------------- |
| `npm run dev`                 | Start the dev server with hot reload                  |
| `npm run typecheck`           | `tsc --noEmit` — run before every commit              |
| `npm run lint` / `lint:fix`   | ESLint, zero warnings allowed                         |
| `npm run format`              | Prettier, auto-fix                                    |
| `npm run test` / `test:watch` | Vitest, requires a reachable `DATABASE_URL`           |
| `npm run build` / `start`     | Compile to `dist/` and run the compiled server        |
| `npm run db:generate`         | Generate a migration after editing `src/db/schema.ts` |
| `npm run db:migrate`          | Apply pending migrations                              |
| `npm run db:studio`           | Browser UI for inspecting the local database          |
| `npm run db:seed`             | Insert dev seed data                                  |

A pre-commit hook (Husky + lint-staged) runs ESLint/Prettier automatically on staged
files, so basic style/lint issues can't reach a PR.

## Project structure

```
src/
  config/       env validation + logger
  db/           drizzle client, schema, migration/seed scripts
  lib/          ApiError, asyncHandler, jwt, password helpers
  middleware/   auth, validate, errorHandler, notFound
  modules/
    health/     liveness/readiness check (checks DB connectivity)
    auth/       register/login, issues JWTs
    users/      reference CRUD module — copy this pattern for every new resource
tests/          integration tests hitting the real HTTP layer + a real DB
drizzle/        generated SQL migrations (committed to git)
```

`src/modules/users/` is the canonical example: `routes → controller → service → schema`,
each with one job. New resources should look structurally identical. Run
`/new-resource <name>` in Claude Code to scaffold one automatically following this
pattern (see `.claude/commands/new-resource.md`).

## Working with Claude Code on this repo

This repo ships a `CLAUDE.md` with the conventions above, plus a `.claude/commands/`
directory with slash commands (currently: `/new-resource`) so the workflow is
standardized across every developer's agent sessions, not just documented in a wiki
nobody opens. When you add a new convention, add it to `CLAUDE.md` in the same PR — that
file is the shared memory for every future session, human or agent.

## Testing philosophy

Tests in `tests/` run against a real Postgres instance (`docker compose up -d`) rather
than a mocked DB layer — auth + CRUD wiring is exactly the kind of thing that looks
correct in isolation but breaks at the integration seams (wrong status code, missed
`await`, a schema field that doesn't round-trip). CI spins up Postgres as a service
container so this works the same locally and in GitHub Actions (`.github/workflows/ci.yml`).

## Known, accepted trade-offs

- `drizzle-kit`'s dev-only dependency chain currently has a moderate-severity `esbuild`
  advisory (a dev-server request-forgery issue). It only affects a local CLI tool, not
  anything that runs in production, so this is accepted risk — re-run `npm audit` when
  bumping `drizzle-kit`.
- Auth is plain JWT for portability as a starter. If your real product uses a hosted
  auth provider (Clerk, Auth0, etc.), replace `src/lib/jwt.ts` and
  `src/middleware/auth.ts` with that provider's verification logic and keep the
  `req.auth` shape / `requireAuth` contract the same so the rest of the codebase is
  unaffected.
