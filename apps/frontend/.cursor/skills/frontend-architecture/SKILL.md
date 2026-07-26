---
name: frontend-architecture
description: Guides React feature design, routing, and API integration in the Vite SPA. Use when adding pages, features, auth flows, or reviewing frontend structure in apps/frontend.
---

# Frontend Architecture

Canonical examples: `features/auth/` and `features/users/`. Read them before adding a new feature.

## Directory map

```
apps/frontend/src/
  app/              # App shell, global CSS, route table
  components/       # Shared, presentational UI (layout, buttons)
  features/         # Domain features (auth, users, …)
  lib/              # api-client, auth-storage, utilities
  test/             # Vitest setup
```

## Workflow: add a feature

```
- [ ] Create features/<name>/<name>.schema.ts (Zod API + form shapes)
- [ ] Create features/<name>/<name>.api.ts (apiRequest wrappers)
- [ ] Create page component(s) with TanStack Query or useMutation
- [ ] Register route in app/routes.tsx
- [ ] Add nav link in components/layout/AppLayout.tsx if user-facing
- [ ] Add schema/unit tests where logic is non-trivial
- [ ] npm run typecheck && npm run lint from repo root
```

## Data fetching

| Concern             | Tool                                       | Location                       |
| ------------------- | ------------------------------------------ | ------------------------------ |
| Server state        | TanStack Query (`useQuery`, `useMutation`) | Page or feature hook           |
| Auth token          | `useAuth()` context                        | Passed to `*.api.ts` functions |
| HTTP transport      | `apiRequest()`                             | `lib/api-client.ts`            |
| Response validation | Zod `safeParse` in api layer               | `*.schema.ts`                  |

Dev proxy: Vite forwards `/api` and `/health` to `http://localhost:3000`. Leave `VITE_API_BASE_URL` empty locally.

## Auth flow

1. Login/register mutations return `{ token, user }`.
2. `AuthProvider.login()` persists token via `auth-storage`.
3. Protected routes wrap children in `ProtectedRoute`.
4. API modules receive `token` and set `Authorization: Bearer …`.

## Component rules

- Pages compose hooks + presentational markup; extract hooks when logic grows.
- No business rules in shared `components/` — keep them dumb/reusable.
- Validate forms with Zod before mutations; surface first issue to the user.
- Prefer explicit loading and error UI over silent failures.

## Testing

- Unit-test Zod schemas and pure helpers in `*.test.ts` beside the module.
- Use Vitest + Testing Library for component tests when behavior matters.
- Do not mock the entire API client for trivial schema tests.

## Deviating from the pattern

Ask a human before adding global state libraries, a shared monorepo package, or fetching outside `api-client`.
