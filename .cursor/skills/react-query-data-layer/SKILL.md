---
name: react-query-data-layer
description: Fetches and mutates server state with TanStack Query through this repo's api-client and Zod response validation. Use when adding a query/mutation, a new *.api.ts file, or any component that talks to the backend in apps/frontend.
paths:
  - 'apps/frontend/src/lib/api-client.ts'
  - 'apps/frontend/src/features/**/*.api.ts'
  - 'apps/frontend/src/features/**/*.schema.ts'
  - 'apps/frontend/src/app/App.tsx'
---

# React Query Data Layer

Every network call goes through one transport function and gets its response shape checked with Zod — no raw `fetch` scattered in components.

## The transport (`lib/api-client.ts`)

```ts
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  // sets Content-Type/Accept, adds Authorization: Bearer <token> if options.token is set,
  // throws ApiError(message, status, details) on non-2xx, otherwise returns parsed JSON
}
```

- `ApiError` carries `status` and the parsed error `details` from the backend's `{ error: { message, details } }` shape — catch it specifically to show field-level messages, don't just show a generic "something went wrong".
- Dev requests go through the Vite proxy (`vite.config.ts` forwards `/api` and `/health` to `:3000`), so `VITE_API_BASE_URL` stays empty locally; only set it for a deployed frontend hitting a separate API origin.

## `*.api.ts` — one function per endpoint, validated with Zod

```ts
// features/users/users.api.ts
export async function fetchUsers(token: string): Promise<User[]> {
  const response = await apiRequest<UsersResponse>('/api/users', { token });
  const parsed = usersListSchema.safeParse(response);
  if (!parsed.success) throw new Error('Unexpected users response shape');
  return parsed.data.data;
}
```

- Define the response shape in `<feature>.schema.ts` with Zod, infer types with `z.infer`, and `safeParse` the response in the `*.api.ts` function — treat the backend as an untrusted external source, the same way the backend treats client input as untrusted.
- Pass `token` explicitly into `*.api.ts` functions rather than reaching into `useAuth()` inside them — keeps the API layer framework-agnostic and testable without React.

## Wiring `QueryClientProvider`

```tsx
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});
// <QueryClientProvider client={queryClient}><AuthProvider>...</AuthProvider></QueryClientProvider>
```

Create the `QueryClient` once at module scope in `app/App.tsx` (or a dedicated file if it grows) — never inside a component body, or it gets recreated (and caches lost) on every render.

## Reads: `useQuery`

```tsx
const usersQuery = useQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers(token ?? ''),
  enabled: Boolean(token), // don't fire the request until a token exists
});

if (usersQuery.isLoading) return <p>Loading users…</p>;
if (usersQuery.isError) return <p role="alert">Failed to load users.</p>;
```

- Always handle `isLoading` and `isError` explicitly — no silent blank screens.
- Use `enabled` to gate queries on preconditions (auth token present, id defined) instead of an early `return null` before the hook call.
- Keep `queryKey` arrays specific and serializable (`['users']`, `['users', id]`) so invalidation targets exactly what changed.

## Writes: `useMutation`

```tsx
const mutation = useMutation({
  mutationFn: login,
  onSuccess: (data) => {
    storeToken(data.token);
    void navigate('/users');
  },
  onError: (error) => setFormError(error instanceof ApiError ? error.message : 'Login failed'),
});

mutation.mutate(parsedInput);
// mutation.isPending drives the submit button's disabled/label state
```

- Validate the form input with the feature's Zod schema (`safeParse`) **before** calling `mutation.mutate` — surface the first Zod issue to the user instead of sending invalid data to the server.
- Narrow errors with `error instanceof ApiError` to show the backend's message; fall back to a generic message for network-level failures.
- After a mutation that changes data another query depends on, call `queryClient.invalidateQueries({ queryKey: [...] })` (import `useQueryClient`) rather than manually poking cached data.

## What NOT to do

- Don't call `fetch` directly in a component — always go through `apiRequest` in an `*.api.ts` file.
- Don't trust an unvalidated response shape — every `*.api.ts` read function parses with the feature's Zod schema.
- Don't put TanStack Query logic inside shared `components/` — data fetching belongs in `features/<name>/`, components stay presentational.
