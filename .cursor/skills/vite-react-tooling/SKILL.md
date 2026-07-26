---
name: vite-react-tooling
description: Configures Vite, the dev proxy, path aliases, env vars, and Vitest + Testing Library for the React SPA. Use when editing vite.config.ts, vitest.config.ts, tsconfig, ESLint config, or test setup in apps/frontend.
paths:
  - 'apps/frontend/vite.config.ts'
  - 'apps/frontend/vitest.config.ts'
  - 'apps/frontend/tsconfig*.json'
  - 'apps/frontend/eslint.config.js'
  - 'apps/frontend/src/test/**'
  - 'apps/frontend/src/vite-env.d.ts'
---

# Vite + React Tooling

## Dev proxy — never hardcode the backend origin

```ts
// vite.config.ts
server: {
  port: 5173,
  proxy: {
    '/api': { target: 'http://localhost:3000', changeOrigin: true },
    '/health': { target: 'http://localhost:3000', changeOrigin: true },
  },
},
```

Components call relative paths (`/api/users`) via `apiRequest()`; the proxy forwards them to the backend on `:3000` during `npm run dev:frontend`. Leave `VITE_API_BASE_URL` empty in `.env` for local dev — only set it when the frontend is deployed against a separate API origin.

## Path alias — keep `@/*` consistent across every config

The `@/*` → `src/*` alias must be declared in **three places** and kept in sync:

```ts
// vite.config.ts / vitest.config.ts
resolve: { alias: { '@': path.resolve(dirname, 'src') } },
```

```json
// tsconfig.json
"baseUrl": ".", "paths": { "@/*": ["src/*"] }
```

If you add the alias to one and not the others, imports resolve in the editor but fail at build (or vice versa) — always update all three together.

## Env var typing (`src/vite-env.d.ts`)

```ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

Every new `VITE_*` variable you add to `.env.example` must be added here too, or `import.meta.env.VITE_YOUR_VAR` fails typecheck. Vite only exposes vars prefixed `VITE_` to client code — never put a secret behind that prefix, it ships in the client bundle.

## Vitest + Testing Library setup

```ts
// vitest.config.ts
test: {
  environment: 'jsdom',
  globals: false,               // import describe/it/expect explicitly, don't rely on globals
  include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  setupFiles: ['src/test/setup.ts'],
},
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
```

- `globals: false` means every test file imports `describe`, `it`, `expect` from `'vitest'` explicitly — don't assume they're ambient.
- Colocate test files next to what they test (`auth.schema.test.ts` beside `auth.schema.ts`), not in a separate top-level `tests/` folder like the backend.
- Reuse the same `@` alias and the `react()` plugin in `vitest.config.ts` as in `vite.config.ts` — a mismatch causes tests to fail resolving `@/...` imports even though the app builds fine.

## ESLint config shape

Frontend lint extends the backend's typed-lint base (`typescript-eslint` recommendedTypeChecked) plus React-specific plugins:

```js
plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
rules: {
  ...reactHooks.configs.recommended.rules,
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
},
```

- `react-refresh/only-export-components` will warn on files mixing a component export with a hook/context/constant export — split them (see `react-feature-structure` skill's auth-context example) rather than disabling the rule per-file, except for genuinely context-only files where an explicit override already exists in `eslint.config.js`.
- Lint runs with `--max-warnings=0` (`npm run lint`) — a warning fails CI exactly like an error; don't leave warnings "for later".

## Before considering frontend work done

From the repo root: `npm run typecheck && npm run lint`, plus `npm run test --workspace=@ai-workflow/frontend` if you touched testable logic (schemas, hooks, non-trivial components).
