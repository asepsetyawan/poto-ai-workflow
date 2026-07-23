/**
 * Base class for all operational errors we throw intentionally (bad input,
 * not found, unauthorized, etc). Anything that is NOT an ApiError reaching
 * the error handler is treated as an unexpected bug and logged at `error`
 * level with a generic response body (see middleware/errorHandler.ts).
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly isOperational = true;
  readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message);
  }
}
