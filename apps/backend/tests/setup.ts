// Runs once before the test suite. Ensures required env vars exist so
// src/config/env.ts validation doesn't blow up when modules are imported.
// Real values (e.g. a local/CI Postgres) should come from the environment;
// these are only fallbacks for secrets that don't need to be "real" in tests.
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL ??= 'silent';
process.env.JWT_SECRET ??= 'test-secret-key-that-is-at-least-32-characters-long';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/ai_workflow';
