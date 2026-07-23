Scaffold a new REST resource module named "$ARGUMENTS" following this codebase's
established pattern exactly (see CLAUDE.md for the full rationale).

Steps:

1. Read all five files in `src/modules/users/` in full before writing anything.
2. Create `src/modules/$ARGUMENTS/` with the same five files, adapted to the new
   resource: `$ARGUMENTS.schema.ts`, `$ARGUMENTS.service.ts`, `$ARGUMENTS.controller.ts`,
   `$ARGUMENTS.routes.ts`, and a test file.
3. If the resource needs a new database table, add it to `src/db/schema.ts` following
   the existing conventions (UUID primary key, `createdAt`/`updatedAt` timestamps), then
   run `npm run db:generate` and show me the generated migration before applying it.
4. Wire the new router into `src/app.ts` under `/api/$ARGUMENTS`.
5. Write tests covering: the happy path for each endpoint, a validation failure (400),
   a not-found case (404), and — if the routes require auth — an unauthenticated request
   (401).
6. Run `npm run typecheck && npm run lint && npm run test` and fix anything that fails
   before telling me you're done.
7. Summarize what you created, any new dependency you added and why, and any place you
   deviated from the `users` pattern and why.

Do not invent a different file layout or naming convention. If something about the
`users` pattern genuinely doesn't fit this resource, stop and ask me instead of silently
diverging.
