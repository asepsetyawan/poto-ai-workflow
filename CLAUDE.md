# CLAUDE.md

This file is the source of truth for how AI agents (Claude Code and equivalents) and
humans should work in this codebase. If you're a human onboarding, read this too — it's
the same conventions we hold agents to. Everything here should also be enforced in code
review; the process only works if it's followed the same way every time, by everyone.

## What this project is

An Express + TypeScript API with PostgreSQL (via Drizzle ORM), JWT auth, structured
logging, and a test suite that runs against a real database. It's a **starter/reference
implementation** — the point is that every new resource in a real product should follow
the exact pattern demonstrated by the `users` module.

## Commands you will use constantly

```bash
npm run dev            # start the dev server with hot reload (tsx watch)
npm run typecheck      # tsc --noEmit — run this before every commit
npm run lint           # eslint --max-warnings=0 — zero warnings allowed, not just zero errors
npm run lint:fix        # autofix what's fixable
npm run format          # prettier --write
npm run test            # vitest run — requires DATABASE_URL reachable (see docker-compose.yml)
npm run test:watch
npm run build            # compile to dist/

npm run db:generate      # generate a migration from schema.ts changes — run after editing src/db/schema.ts
npm run db:migrate       # apply pending migrations to DATABASE_URL
npm run db:studio        # visual browser for the local database
npm run db:seed          # insert dev seed data (dev@example.com / password123)
```

Local Postgres: `docker compose up -d` (see `docker-compose.yml`). Copy `.env.example` to
`.env` before doing anything else.

## Before you consider any task done

Run, in this order, and fix everything before saying you're finished:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`

Do not report a task as complete if any of these fail. Do not disable a rule or skip a
test to make this pass — fix the actual problem, or explicitly flag to the human that a
rule/test seems wrong and why, and let them decide.

## Architecture — the pattern to copy

```
src/
  config/       env validation (env.ts) + logger (logger.ts)
  db/           drizzle client (index.ts), schema.ts, migrate.ts, seed.ts
  lib/          framework-agnostic helpers: ApiError, asyncHandler, jwt, etc.
  middleware/   auth, validate, errorHandler, notFound — cross-cutting concerns only
  modules/
    <resource>/
      <resource>.routes.ts       Express Router — wires middleware + controller, no logic
      <resource>.controller.ts   HTTP layer only: parse req, call service, shape res
      <resource>.service.ts      business logic + all DB access — no req/res here
      <resource>.schema.ts       Zod schemas for body/query/params + inferred types
      <resource>.test.ts         or a top-level tests/ file for integration coverage
```

**When adding a new resource, copy `src/modules/users/` and rename.** Don't invent a new
shape. If the existing shape genuinely doesn't fit, raise it with a human before
diverging — a pattern that's followed inconsistently is worse than an imperfect one that's
followed consistently.

### Layering rules (non-negotiable)

- **Routes** only wire `router.METHOD(path, middleware..., controller)`. No logic.
- **Controllers** only translate HTTP ↔ service calls: read `req`, call the service, set
  the status code and `res.json(...)`. No `db` imports in a controller, ever.
- **Services** hold all business logic and are the only layer that imports `db`/`schema`.
  Services throw `ApiError` (see `src/lib/apiError.ts`) for expected failure cases
  (not found, conflict, unauthorized) — they never touch `req`/`res`.
- **Every controller function is wrapped in `asyncHandler`** (`src/lib/asyncHandler.ts`).
  Never write a bare `async (req, res) => {...}` route handler — a rejected promise
  without `asyncHandler` is dropped silently and the request hangs.
- **Every route that accepts a body/query/params is validated with `validate(schema)`**
  (`src/middleware/validate.ts`) before it reaches the controller. Controllers should be
  able to trust `req.body`/`req.query`/`req.params` are already the right shape.

### Error handling

- Throw `ApiError.notFound(...)`, `ApiError.badRequest(...)`, etc. from services/
  controllers for anything the client did wrong or any expected "this doesn't exist"
  case. These are caught centrally in `src/middleware/errorHandler.ts` and turned into
  the right status code.
- Never `res.status(...).json(...)` an error directly from inside try/catch in a
  controller — throw and let the central handler do it, so the format stays consistent
  everywhere.
- Anything that reaches the error handler that is _not_ an `ApiError` or `ZodError` is
  logged at `error` level and returned as a generic 500. If you see a 500 in the logs
  with a stack trace, that is a bug to fix, not an error to catch-and-ignore.

### Database / Drizzle

- Schema lives in `src/db/schema.ts`. After changing it, run `npm run db:generate` and
  **commit the generated SQL file under `drizzle/`** — migrations are code, not
  something regenerated ad hoc in each environment.
- Never write raw string-interpolated SQL. Use Drizzle's query builder or the `sql`
  template tag (which parameterizes automatically).
- Primary keys are UUIDs (`gen_random_uuid()`), every table has `createdAt`/`updatedAt`.
  Follow this for new tables unless there's a specific reason not to.

### Validation

- All input validation is Zod, colocated in `<resource>.schema.ts`, shaped as
  `{ body?, query?, params? }`. Infer TS types from the schema (`z.infer<...>`) rather
  than hand-writing a parallel interface — one source of truth.

## Working with Claude Code / agents on this repo specifically

- **Plan before large changes.** For anything touching more than one module or the
  schema, state your plan (files you'll touch, migration you'll generate, tests you'll
  add) before writing code. Don't reason like the human isn't going to review it.
- **Read the `users` module fully before building a new resource.** Don't infer the
  pattern from partial context — read all five files.
- **Never commit `.env`**, print secrets in logs, or hardcode a connection string /
  JWT secret. Config always comes from `src/config/env.ts`.
- **Don't add a new dependency without saying so explicitly** in your summary of
  changes — a human should be able to see "added X because Y" and object before it's
  merged.
- **Write or update a test for every behavior change.** If you fix a bug, the test that
  would have caught it is part of the fix, not optional follow-up.
- **Keep PRs small and scoped to one thing.** If a task naturally splits into unrelated
  changes (e.g. a refactor plus a new feature), do them as separate commits/PRs.
- You are expected to run `npm run typecheck && npm run lint && npm run test` yourself
  before declaring a task finished — do not make the human discover a broken build.

## Git / PR conventions

- Branch names: `<type>/<short-description>`, e.g. `feat/vendor-invoices`,
  `fix/deploy-migration-order`.
- Commit messages: imperative mood, explain _why_ not just _what_
  (e.g. "Add idempotency key to invoice creation to prevent duplicate Xero syncs on
  retry", not "update invoice service").
- Every PR needs: what changed, why, and how it was tested (manually, automated, or
  both). If you touched deploy/migration behavior, say so explicitly in the PR
  description — that's a higher-risk category and reviewers should know to look harder.
- Decisions of consequence (schema changes, a new external dependency, an approach with
  real tradeoffs) get written down — in the PR description at minimum, in a doc if it
  affects more than one PR. Don't let a decision live only in a Slack thread or a Claude
  Code session that nobody else can see.

## Known trade-offs / things intentionally left simple in this starter

- Auth is JWT-based here for portability; if the real product uses a provider (e.g.
  Clerk), swap `src/middleware/auth.ts` and `src/lib/jwt.ts` for that provider's
  verification call and keep the rest of the pattern (the `req.auth` shape, the
  `requireAuth` middleware contract) the same so the rest of the codebase doesn't change.
- `drizzle-kit`'s dev-only dependency chain currently carries a moderate esbuild
  advisory (CVE relates to a dev server accepting arbitrary requests). It's a build-time
  CLI tool, not a running server, so this is accepted risk — re-check
  `npm audit` when bumping `drizzle-kit` and tighten if a fix ships.
