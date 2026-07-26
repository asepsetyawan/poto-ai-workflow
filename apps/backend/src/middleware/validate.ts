import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

/**
 * Validates req.{body,query,params} against a Zod schema shaped as
 * `{ body?, query?, params? }` and replaces each with the parsed
 * (and thus type-safe + coerced) value. Validation errors are forwarded
 * to the central error handler, which knows how to format ZodErrors.
 *
 * Usage: router.post('/', validate(createUserSchema), createUser)
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const input: { body: unknown; query: unknown; params: unknown } = {
        body: req.body,
        query: req.query,
        params: req.params,
      };
      const parsed = schema.parse(input) as { body?: unknown; query?: unknown; params?: unknown };

      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query as typeof req.query;
      if (parsed.params !== undefined) req.params = parsed.params as typeof req.params;

      next();
    } catch (err) {
      next(err);
    }
  };
}
