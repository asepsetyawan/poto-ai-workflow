import { sql } from 'drizzle-orm';
import { db } from '../../src/db/index.js';

/**
 * Integration tests require a reachable Postgres instance. Fail fast with a
 * clear message instead of cascading 500s when docker compose isn't running.
 */
export async function assertDatabaseReachable(): Promise<void> {
  try {
    await db.execute(sql`select 1`);
  } catch {
    throw new Error(
      'Postgres is not reachable at DATABASE_URL. Start it with: docker compose up -d',
    );
  }
}
