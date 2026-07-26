---
name: drizzle-postgres-patterns
description: Defines PostgreSQL schema, migrations, and queries with Drizzle ORM the way this repo does — UUID PKs, timestamps, generated SQL migrations, and the query-builder API. Use when editing apps/backend/src/db/schema.ts, writing DB queries in a service, or generating/applying migrations.
paths:
  - 'apps/backend/src/db/**'
  - 'apps/backend/drizzle/**'
  - 'apps/backend/drizzle.config.ts'
---

# Drizzle + PostgreSQL Patterns

## Table conventions (`src/db/schema.ts`)

```ts
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('users_email_unique_idx').on(table.email)],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

Rules for every new table:

- Primary key is `uuid('id').primaryKey().defaultRandom()` — never an auto-increment int.
- Always include `createdAt` / `updatedAt` as `timestamp(..., { withTimezone: true }).notNull().defaultNow()`.
- Table names: plural, snake_case in Postgres (`text('password_hash')`), camelCase in TS (`passwordHash`).
- Export `$inferSelect` / `$inferInsert` types instead of hand-writing parallel interfaces — one source of truth.
- Add unique/lookup indexes explicitly (`uniqueIndex(...).on(table.column)`), don't rely on app-level uniqueness checks alone.

## Migration workflow

1. Edit `apps/backend/src/db/schema.ts`.
2. From the **repo root**: `npm run db:generate` (runs `drizzle-kit generate`, reads `apps/backend/drizzle.config.ts`).
3. Review the generated SQL under `apps/backend/drizzle/`.
4. **Commit the generated SQL file** — migrations are code, never regenerated ad hoc per environment.
5. Apply with `npm run db:migrate` (runs `tsx src/db/migrate.ts`).

Never hand-edit a committed migration file after it has been applied anywhere; add a new migration instead.

## Query patterns

Prefer the relational query API for reads, the update/insert builder for writes:

```ts
// Find one
const user = await db.query.users.findFirst({
  where: eq(users.email, input.email),
});

// Find many with pagination + explicit column selection (never return passwordHash)
const rows = await db.query.users.findMany({
  limit: query.limit,
  offset: query.offset,
  orderBy: (t, { desc }) => [desc(t.createdAt)],
  columns: { passwordHash: false },
});

// Insert, returning the created row
const [user] = await db.insert(users).values({ email, passwordHash, name }).returning();

// Update, returning only public columns
const [updated] = await db
  .update(users)
  .set({ ...input, updatedAt: new Date() })
  .where(eq(users.id, id))
  .returning({
    id: users.id,
    email: users.email,
    name: users.name,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  });
```

- **Never write raw string-interpolated SQL.** Use the query builder, or the `sql` template tag (`sql\`select 1\``) which parameterizes automatically — see `tests/helpers/db.ts`for the one place raw`sql`is used, and only for a literal`select 1` health check.
- **Never select `passwordHash` (or any secret column) into a response.** Use `columns: { passwordHash: false }` on reads, or an explicit `.returning({...})` allowlist on writes — don't strip secrets after the fact in the controller.
- Set `updatedAt: new Date()` explicitly on every update; Drizzle does not do this for you.
- Every DB access lives in a `*.service.ts` file. If you're importing `db` or `schema.ts` from a controller or route, that's a layering violation — see the `express-api-layering` skill.

## Client setup (`src/db/index.ts`)

The Drizzle client wraps a `pg` `Pool` using `DATABASE_URL` from `src/config/env.ts` (Zod-validated at startup — never read `process.env.DATABASE_URL` directly in a service). Tests import the same `db` and call `closeDb()` in `afterAll` to release the pool cleanly.
