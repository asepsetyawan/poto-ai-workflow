---
name: express-api-layering
description: Implements Express REST endpoints using this repo's routes → controller → service → schema layering, asyncHandler, validate middleware, and ApiError. Use when adding or modifying any Express route, controller, or service in apps/backend.
paths:
  - 'apps/backend/src/modules/**'
  - 'apps/backend/src/middleware/**'
  - 'apps/backend/src/app.ts'
---

# Express API Layering

Four files per resource, one job each. Reference: `apps/backend/src/modules/users/`.

## The four layers

```ts
// <resource>.routes.ts — wiring only, no logic
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { getUserSchema, updateUserSchema } from './users.schema.js';
import { getUser, updateUser } from './users.controller.js';

export const usersRouter = Router();
usersRouter.get('/:id', requireAuth, validate(getUserSchema), getUser);
usersRouter.patch('/:id', requireAuth, validate(updateUserSchema), updateUser);
```

```ts
// <resource>.controller.ts — HTTP only: req → service → res. Never import db.
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.getUserById(req.params.id as string);
  res.status(200).json({ data: user });
});
```

```ts
// <resource>.service.ts — business logic + all DB access. Never touch req/res.
export async function getUserById(id: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!user) throw ApiError.notFound(`User ${id} not found`);
  return user;
}
```

```ts
// <resource>.schema.ts — Zod, shaped { body?, query?, params? }, types via z.infer
export const getUserSchema = z.object({
  params: z.object({ id: z.string().uuid('id must be a valid UUID') }),
});
```

Wire the router in `apps/backend/src/app.ts`: `app.use('/api/<resource>', resourceRouter);`

## Non-negotiable rules

- **Every controller handler is wrapped in `asyncHandler`** (`src/lib/asyncHandler.ts`). A bare `async (req, res) => {}` route handler drops rejected promises silently and the request hangs — never write one.
- **Every route with body/query/params gets `validate(schema)`** (`src/middleware/validate.ts`) before the controller. `validate` parses `{ body, query, params }` together and reassigns the parsed (coerced) values back onto `req`, so controllers can trust the shape.
- **Controllers never import `db` or `schema.ts`.** If a controller needs data, it calls a service function.
- **Services never see `req`/`res`.** They take plain arguments and return plain data or throw.
- **Protected routes get `requireAuth`** (`src/middleware/auth.ts`) before `validate`. It reads `Authorization: Bearer <token>`, verifies it with `verifyToken`, and sets `req.auth = { sub, email }`. On missing/invalid tokens it calls `next(ApiError.unauthorized(...))` — it never writes a response itself.

## Error handling — throw, don't respond

Throw from services/controllers; never `res.status(...).json(...)` an error from inside a try/catch:

```ts
throw ApiError.notFound('...'); // 404
throw ApiError.badRequest('...'); // 400
throw ApiError.conflict('...'); // 409
throw ApiError.unauthorized(); // 401
throw ApiError.forbidden(); // 403
```

`src/middleware/errorHandler.ts` is the single place that turns errors into responses:

| Error type    | Response                                                                          |
| ------------- | --------------------------------------------------------------------------------- |
| `ZodError`    | `400 { error: { message: 'Validation failed', details } }`                        |
| `ApiError`    | `err.statusCode { error: { message, details } }`; 5xx variants are also logged    |
| anything else | `500 { error: { message: 'Internal server error' } }`, logged as an unhandled bug |

A 500 with a stack trace in the logs is a bug to fix, not an error to catch-and-ignore.

## App wiring order (`app.ts`)

`helmet → cors → compression → json/urlencoded → pino-http → routes → notFoundHandler → errorHandler`. The error handler must be the last `app.use()` — Express identifies error middleware by its 4-argument signature and only reaches it after everything else.

## Checklist for a new endpoint

- [ ] Route only calls `router.METHOD(path, middleware..., controller)`
- [ ] `validate(schema)` present if body/query/params are used
- [ ] `requireAuth` present if the endpoint needs a logged-in user
- [ ] Controller wrapped in `asyncHandler`, no `db` import
- [ ] Service throws `ApiError` for expected failures, returns plain data otherwise
- [ ] New router mounted in `app.ts` under `/api/<resource>`
