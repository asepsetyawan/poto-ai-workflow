import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, closeDb } from './index.js';
import { logger } from '../config/logger.js';

/**
 * Runs pending migrations from ./drizzle against DATABASE_URL.
 * Usage: npm run db:migrate
 */
async function main() {
  logger.info('Running database migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  logger.info('Migrations complete.');
  await closeDb();
}

main().catch((err: unknown) => {
  logger.error({ err }, 'Migration failed');
  process.exit(1);
});
