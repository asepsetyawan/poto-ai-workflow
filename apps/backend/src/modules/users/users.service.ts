import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { ApiError } from '../../lib/apiError.js';
import type { ListUsersQuery, UpdateUserInput } from './users.schema.js';

export async function listUsers(query: ListUsersQuery) {
  const rows = await db.query.users.findMany({
    limit: query.limit,
    offset: query.offset,
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    columns: { passwordHash: false },
  });

  return rows;
}

export async function getUserById(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { passwordHash: false },
  });

  if (!user) {
    throw ApiError.notFound(`User ${id} not found`);
  }

  return user;
}

export async function updateUser(id: string, input: UpdateUserInput) {
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

  if (!updated) {
    throw ApiError.notFound(`User ${id} not found`);
  }

  return updated;
}

export async function deleteUser(id: string) {
  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });

  if (!deleted) {
    throw ApiError.notFound(`User ${id} not found`);
  }
}
