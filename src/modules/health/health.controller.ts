import type { Request, Response } from 'express';
import { sql } from 'drizzle-orm';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { db } from '../../db/index.js';

/**
 * Liveness + readiness in one endpoint: returns 200 only if the process is
 * up AND it can reach Postgres. Point uptime/deploy checks at this route.
 */
export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const startedAt = Date.now();
  let dbStatus: 'ok' | 'error' = 'ok';

  try {
    await db.execute(sql`select 1`);
  } catch {
    dbStatus = 'error';
  }

  const status = dbStatus === 'ok' ? 200 : 503;

  res.status(status).json({
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    checks: { db: dbStatus },
    uptimeMs: process.uptime() * 1000,
    responseTimeMs: Date.now() - startedAt,
  });
});
