import type { NextFunction, Request, Response } from 'express';

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wraps an async route/controller function so rejected promises are forwarded
 * to Express's error-handling middleware instead of crashing the process or
 * being silently swallowed. Every controller in this codebase should be
 * wrapped with this — see CLAUDE.md.
 */
export function asyncHandler(handler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}
