---
name: vitest-integration-testing
description: Writes backend integration tests the way this repo does — real HTTP layer via Supertest, real Postgres, no mocked DB layer. Use when adding or updating tests under apps/backend/tests or testing a new REST resource.
paths:
  - 'apps/backend/tests/**'
  - 'apps/backend/vitest.config.ts'
---

# Vitest Integration Testing (Backend)

Tests hit the real Express app and a real Postgres instance — never a mocked DB layer. Auth + CRUD wiring is exactly the kind of thing that looks correct in isolation but breaks at the integration seams (wrong status code, missed `await`, a schema field that doesn't round-trip).

## Required setup before running

```bash
docker compose up -d   # Postgres on :5432
npm run db:migrate      # from repo root
npm run test            # or: npm run test --workspace=@ai-workflow/backend
```

CI runs the same tests against a Postgres service container (`.github/workflows/ci.yml`) — no separate mocking path exists.

## Structure of a test file

```ts
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { eq } from 'drizzle-orm';
import { createApp } from '../src/app.js';
import { db, closeDb } from '../src/db/index.js';
import { users } from '../src/db/schema.js';
import { assertDatabaseReachable } from './helpers/db.js';

const app = createApp();
const testEmail = `test-${Date.now()}@example.com`;

beforeAll(async () => {
  await assertDatabaseReachable(); // fails fast with a clear message if Postgres isn't up
});

afterAll(async () => {
  await db.delete(users).where(eq(users.email, testEmail)); // clean up rows this test created
  await closeDb(); // release the pg pool so the process can exit
});

describe('auth + users flow', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: 'password123', name: 'Test User' });

    expect(res.status).toBe(201);
    expect(res.body.user.passwordHash).toBeUndefined(); // assert secrets never leak
  });
});
```

Key conventions:

- **Call `createApp()` once per file**, reuse the same `app` instance across `it()` blocks — don't call `app.listen()`, Supertest drives the app directly without binding a port.
- **Use a unique email per test run** (`test-${Date.now()}@example.com`) so tests are safe to re-run against a persistent dev database without colliding with prior runs.
- **Always clean up what you created** in `afterAll` (`db.delete(...).where(eq(...))`) — this suite runs against a real, potentially shared database.
- **Always `await closeDb()`** at the end — otherwise the open pg pool keeps the test process alive.
- **Chain related steps in one `describe` block with shared `let` state** (e.g. `authToken`, `userId` set in an earlier `it`, consumed in a later one) when testing a flow — register → login → fetch → update → delete, in that order, mirrors real usage better than isolated fixtures per test.

## Required coverage per endpoint/resource

Copy this checklist when adding tests for a new resource:

```
- [ ] Happy path for every endpoint (register, login, create, get, update, list, delete)
- [ ] Validation failure → 400 (malformed body/query/params, e.g. a non-UUID id)
- [ ] Not-found case → 404 (well-formed id, no matching row)
- [ ] Unauthenticated request → 401 (if the route requires auth)
- [ ] Conflict case → 409 (if the resource enforces uniqueness, e.g. duplicate email)
```

Assert both `res.status` and the relevant parts of `res.body` — a 400 with the wrong error message is still a bug.

## `tests/helpers/db.ts`

`assertDatabaseReachable()` runs `db.execute(sql\`select 1\`)`in a`beforeAll` and throws a human-readable error (`"Postgres is not reachable... Start it with: docker compose up -d"`) instead of letting every test fail with a cryptic connection error. Call it in every new integration test file's `beforeAll`.

## What NOT to do

- Don't mock `drizzle-orm`, `pg`, or the `db` client — that defeats the point of this test suite; if a unit test without a DB is genuinely useful, put it next to the pure function it tests (e.g. a schema-only test), not in `tests/`.
- Don't skip `db:migrate` locally and assume CI will catch schema drift — run migrations before running tests.
- Don't leave test data behind; an `afterAll` that doesn't clean up pollutes the shared dev database for the next run.
