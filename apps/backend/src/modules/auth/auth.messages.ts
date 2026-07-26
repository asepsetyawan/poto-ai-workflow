/** User-facing auth copy — keep in one place so API responses and tests stay aligned. */
export const AUTH_MESSAGES = {
  invalidCredentials: 'The email or password you entered is incorrect.',
  accountExists: 'An account with this email already exists',
} as const;
