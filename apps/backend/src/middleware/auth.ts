import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../lib/jwt.js';
import { ApiError } from '../lib/apiError.js';

/**
 * Verifies the `Authorization: Bearer <token>` header and attaches the
 * decoded payload to `req.auth`. Throws (via asyncHandler-style forwarding)
 * rather than returning a response directly, so it composes with the
 * central error handler.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    next(ApiError.unauthorized('Missing or malformed Authorization header'));
    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}
