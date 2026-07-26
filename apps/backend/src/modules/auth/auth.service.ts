import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { ApiError } from '../../lib/apiError.js';
import { signToken } from '../../lib/jwt.js';
import { AUTH_MESSAGES } from './auth.messages.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

const PASSWORD_SALT_ROUNDS = 10;

export async function register(input: RegisterInput) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (existing) {
    throw ApiError.conflict(AUTH_MESSAGES.accountExists);
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);

  const [user] = await db
    .insert(users)
    .values({ email: input.email, passwordHash, name: input.name })
    .returning();

  if (!user) {
    throw ApiError.internal('Failed to create user');
  }

  const token = signToken({ sub: user.id, email: user.email });
  return { token, user: toPublicUser(user) };
}

export async function login(input: LoginInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (!user) {
    throw ApiError.unauthorized(AUTH_MESSAGES.invalidCredentials);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw ApiError.unauthorized(AUTH_MESSAGES.invalidCredentials);
  }

  const token = signToken({ sub: user.id, email: user.email });
  return { token, user: toPublicUser(user) };
}

function toPublicUser(user: typeof users.$inferSelect) {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}
