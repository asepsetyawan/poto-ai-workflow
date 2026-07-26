---
name: react-feature-structure
description: Structures React features, forms, auth context, and protected routes the way this repo does. Use when adding a new feature folder, a page component, a form, or wiring a new route in apps/frontend.
paths:
  - 'apps/frontend/src/features/**'
  - 'apps/frontend/src/app/routes.tsx'
  - 'apps/frontend/src/components/**'
---

# React Feature Structure

## Feature folder shape

```
features/<name>/
  <name>.schema.ts    # Zod schemas (form + API response shapes) + inferred types
  <name>.api.ts        # apiRequest() wrappers — see react-query-data-layer skill
  <Name>Page.tsx       # route-level component: composes hooks + markup
```

Auth is the special case with extra files (`auth-context.tsx`, `AuthProvider.tsx`, `use-auth.ts`, `ProtectedRoute.tsx`) because it's cross-cutting — most features only need the three files above.

## Auth context split (why three files, not one)

React Fast Refresh only works cleanly when a file exports _only_ components. This repo splits auth into:

```ts
// auth-context.tsx — just the Context object + its type
export const AuthContext = createContext<AuthContextValue | null>(null);
```

```tsx
// AuthProvider.tsx — the component; owns state, persists to auth-storage
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const login = useCallback((t: string) => {
    setStoredToken(t);
    setToken(t);
  }, []);
  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
  }, []);
  const value = useMemo(() => ({ token, login, logout }), [token, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

```ts
// use-auth.ts — the hook, thrown error if used outside the provider
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

Follow this split for any other app-wide context you add — don't put a hook and a component export in the same file if it triggers a `react-refresh/only-export-components` lint warning.

## Protecting a route

```tsx
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
```

Register routes in `app/routes.tsx`, wrapping protected pages: `<Route path="users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />`. `LoginPage` reads `location.state.from` to redirect back after a successful login.

## Forms

Pages own form state with plain `useState` per field (no form library) and validate on submit with the feature's Zod schema before calling a mutation:

```tsx
function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setFormError(null);
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    setFormError(parsed.error.issues[0]?.message ?? 'Invalid input');
    return;
  }
  mutation.mutate(parsed.data);
}
```

- Show the **first** Zod issue, not the whole error tree — keep the UI simple.
- Disable the submit button and swap its label while `mutation.isPending`.
- Render a `role="alert"` element for form-level errors so they're accessible.

## Shared vs. feature components

- `src/components/` holds presentational, reusable UI only (e.g. `AppLayout`) — no business logic, no direct API calls, no feature-specific state.
- Anything that knows about a specific domain (users, auth) lives in `src/features/<name>/`, not in `components/`.
- Page components (`<Name>Page.tsx`) are the composition root: they call hooks (`useQuery`/`useMutation`/`useAuth`) and render markup — extract a custom hook only once logic is reused or a component grows unwieldy.

## Checklist for a new feature

- [ ] `features/<name>/<name>.schema.ts` — Zod schemas, `z.infer` types
- [ ] `features/<name>/<name>.api.ts` — `apiRequest` calls, `safeParse` on responses
- [ ] `features/<name>/<Name>Page.tsx` — composes `useQuery`/`useMutation` + markup
- [ ] Route registered in `app/routes.tsx`, wrapped in `ProtectedRoute` if it needs auth
- [ ] Nav link added in `components/layout/AppLayout.tsx` if user-facing
- [ ] `npm run typecheck && npm run lint` from repo root
