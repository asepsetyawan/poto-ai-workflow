import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../lib/apiError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

/**
 * Single place where all errors are turned into HTTP responses.
 * - ApiError -> its own status code + message (safe to expose).
 * - ZodError -> 400 with field-level details.
 * - Anything else -> logged as a bug, 500 with a generic message
 *   (never leak internal error messages/stack traces to clients in prod).
 */
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: { message: 'Validation failed', details: err.flatten() },
    });
    return;
  }

  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error({ err, path: req.path }, err.message);
    }
    res.status(err.statusCode).json({
      error: { message: err.message, details: err.details },
    });
    return;
  }

  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json({
    error: {
      message: 'Internal server error',
      ...(env.NODE_ENV !== 'production' && err instanceof Error ? { stack: err.stack } : {}),
    },
  });
}
