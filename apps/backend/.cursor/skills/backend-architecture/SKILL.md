---
name: backend-architecture
description: Guides backend module design in the Express + Drizzle API. Use when adding REST resources, changing schema, wiring routes, or reviewing backend layering in apps/backend.
---

# Backend Architecture

Reference implementation: `apps/backend/src/modules/users/`. Read all five module files before creating anything new.

## Module layout

```
apps/backend/src/modules/<resource>/
  <resource>.routes.ts       # Express Router — middleware + controller only
  <resource>.controller.ts   # HTTP layer: req → service → res
  <resource>.service.ts      # Business logic + Drizzle queries
  <resource>.schema.ts       # Zod { body?, query?, params? }
  <resource>.messages.ts     # Optional user-facing error strings
```

Wire new routers in `src/app.ts` under `/api/<resource>`.

## Workflow: add a resource

Copy this checklist and track progress:

```
- [ ] Read users module in full
- [ ] Create schema.ts with Zod types inferred via z.infer
- [ ] Implement service (throw ApiError, no req/res)
- [ ] Implement controller (asyncHandler wrappers)
- [ ] Wire routes with validate() + requireAuth when needed
- [ ] Add table to schema.ts if needed → npm run db:generate
- [ ] Write integration tests (happy path, 400, 404, 401)
- [ ] npm run typecheck && npm run lint && npm run test
```

## Layering rules

| Layer      | Allowed                                              | Forbidden                             |
| ---------- | ---------------------------------------------------- | ------------------------------------- |
| Routes     | `router.METHOD`, middleware, controller refs         | Business logic, db imports            |
| Controller | Parse validated input, call service, set status/json | db imports, try/catch error responses |
| Service    | Business rules, Drizzle, ApiError throws             | req, res, HTTP details                |

## Error handling

- Expected failures: `ApiError.notFound()`, `ApiError.badRequest()`, etc.
- Never send error JSON from controller catch blocks — central `errorHandler` formats responses.
- Unexpected errors become 500 with error-level logs.

## Database checklist

- Edit `src/db/schema.ts`
- Run `npm run db:generate` from monorepo root
- Commit SQL under `apps/backend/drizzle/`
- Use Drizzle query builder or parameterized `sql` tag — no string interpolation

## Testing

Integration tests live in `apps/backend/tests/`. Cover:

1. Happy path per endpoint
2. Validation failure (400)
3. Not found (404) where applicable
4. Unauthenticated access (401) for protected routes

Tests hit real Postgres (`docker compose up -d` locally; CI uses a service container).

## Deviating from the pattern

Stop and ask a human before inventing a new file layout, skipping validation, or importing `db` outside services.
