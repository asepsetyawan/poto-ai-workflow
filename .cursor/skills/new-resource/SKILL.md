---
name: new-resource
description: Scaffolds a new backend REST resource (routes, controller, service, schema, tests) following this repo's established module pattern. Only runs when explicitly invoked via /new-resource — never auto-applied.
disable-model-invocation: true
---

# New Resource

Scaffold a new REST resource module in `apps/backend`, following the pattern in
`apps/backend/src/modules/users/` exactly. See `.cursor/rules/backend.mdc` and
`apps/backend/.cursor/skills/backend-architecture/SKILL.md` for the full rationale.

If the resource name wasn't given in the invocation (e.g. `/new-resource invoices`), ask
for it before proceeding.

## Steps

1. Read all files in `apps/backend/src/modules/users/` in full before writing anything.
2. Create `apps/backend/src/modules/<resource>/` with the same shape:
   `<resource>.schema.ts`, `<resource>.service.ts`, `<resource>.controller.ts`,
   `<resource>.routes.ts`, and a test file.
3. If the resource needs a new table, add it to `apps/backend/src/db/schema.ts` following
   existing conventions (UUID primary key, `createdAt`/`updatedAt`), then run
   `npm run db:generate` from the repo root and show the generated migration before
   applying it.
4. Wire the new router into `apps/backend/src/app.ts` under `/api/<resource>`.
5. Write tests in `apps/backend/tests/` covering: the happy path per endpoint, a
   validation failure (400), a not-found case (404), and — if the routes require auth —
   an unauthenticated request (401).
6. Run `npm run typecheck && npm run lint && npm run test` from the repo root and fix
   anything that fails before reporting done.
7. Summarize what was created, any new dependency added and why, and any place you
   deviated from the `users` pattern and why.

Do not invent a different file layout or naming convention. If the `users` pattern
genuinely doesn't fit this resource, stop and ask instead of silently diverging.
