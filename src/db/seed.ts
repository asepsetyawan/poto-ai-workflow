import bcrypt from 'bcryptjs';
import { db, closeDb } from './index.js';
import { users } from './schema.js';
import { logger } from '../config/logger.js';

/**
 * Idempotent seed data for local development.
 * Usage: npm run db:seed
 */
async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  await db
    .insert(users)
    .values({
      email: 'dev@example.com',
      name: 'Dev User',
      passwordHash,
    })
    .onConflictDoNothing({ target: users.email });

  logger.info('Seed complete: dev@example.com / password123');
  await closeDb();
}

main().catch((err: unknown) => {
  logger.error({ err }, 'Seed failed');
  process.exit(1);
});
