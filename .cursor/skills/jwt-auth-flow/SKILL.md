---
name: jwt-auth-flow
description: Implements JWT-based registration, login, and route protection the way this repo does — bcrypt password hashing, token signing/verification, and the requireAuth middleware contract. Use when touching auth.service.ts, auth.controller.ts, middleware/auth.ts, lib/jwt.ts, or any route that needs an authenticated user.
paths:
  - 'apps/backend/src/modules/auth/**'
  - 'apps/backend/src/lib/jwt.ts'
  - 'apps/backend/src/middleware/auth.ts'
  - 'apps/backend/src/types/express.d.ts'
---

# JWT Auth Flow

## The pieces

| File                               | Responsibility                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/lib/jwt.ts`                   | `signToken(payload)` / `verifyToken(token)` — thin wrapper over `jsonwebtoken`, secret from `env.JWT_SECRET` |
| `src/middleware/auth.ts`           | `requireAuth` — reads `Authorization: Bearer <token>`, verifies, sets `req.auth`                             |
| `src/modules/auth/auth.service.ts` | `register` / `login` — bcrypt hashing, issues tokens                                                         |
| `src/types/express.d.ts`           | Declares `req.auth: JwtPayload` on Express's `Request`                                                       |

## Token payload contract

```ts
export interface JwtPayload {
  sub: string; // user id
  email: string;
}
```

Keep this minimal — the payload is decoded client-side-readable (JWTs are signed, not encrypted). Never put passwordHash or other secrets in the payload.

## Registration/login pattern (`auth.service.ts`)

```ts
const PASSWORD_SALT_ROUNDS = 10;

export async function register(input: RegisterInput) {
  const existing = await db.query.users.findFirst({ where: eq(users.email, input.email) });
  if (existing) throw ApiError.conflict(AUTH_MESSAGES.accountExists);

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
  const [user] = await db
    .insert(users)
    .values({ email: input.email, passwordHash, name: input.name })
    .returning();

  const token = signToken({ sub: user.id, email: user.email });
  return { token, user: toPublicUser(user) }; // strip passwordHash before returning
}

export async function login(input: LoginInput) {
  const user = await db.query.users.findFirst({ where: eq(users.email, input.email) });
  if (!user) throw ApiError.unauthorized(AUTH_MESSAGES.invalidCredentials);

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) throw ApiError.unauthorized(AUTH_MESSAGES.invalidCredentials);

  return { token: signToken({ sub: user.id, email: user.email }), user: toPublicUser(user) };
}
```

Critical details:

- **Unknown email and wrong password return the identical message and status** (`AUTH_MESSAGES.invalidCredentials`, 401). Never say "user not found" on login — that leaks which emails are registered.
- **Always strip `passwordHash`** before returning a user object (`toPublicUser` destructures it out). Never let a hash reach a JSON response, ever.
- Centralize user-facing auth strings in `auth.messages.ts` (`AUTH_MESSAGES`) so tests and code reference the same constant instead of duplicating literal strings.
- `bcrypt.hash`/`bcrypt.compare` are async — always `await` them; a missed `await` here is a silent security bug, not just a bug.

## `requireAuth` middleware contract

```ts
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(ApiError.unauthorized('Missing or malformed Authorization header'));
    return;
  }
  const token = header.slice('Bearer '.length);
  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}
```

- Never write a response directly in this middleware — always `next(ApiError...)` so the central `errorHandler` formats it consistently.
- Apply `requireAuth` **before** `validate(schema)` in the route chain, so an unauthenticated request short-circuits before body/param validation runs.
- Downstream controllers read the authenticated user via `req.auth.sub` / `req.auth.email` — never re-parse the header yourself in a controller.

## Swapping providers later

If the product moves to a hosted provider (Clerk, Auth0, etc.), replace `lib/jwt.ts` + `middleware/auth.ts` only, and keep the `req.auth: { sub, email }` shape and the `requireAuth` contract identical — every route and controller downstream is written against that contract, not against JWTs specifically.

## Testing

Cover, per protected resource: unauthenticated request → 401; wrong/expired token → 401; duplicate registration → 409 with `AUTH_MESSAGES.accountExists`; wrong password and unknown email → both 401 with `AUTH_MESSAGES.invalidCredentials`. See `apps/backend/tests/auth-and-users.test.ts` for the full pattern.
