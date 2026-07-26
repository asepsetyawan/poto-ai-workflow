import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { eq } from 'drizzle-orm';
import { createApp } from '../src/app.js';
import { db, closeDb } from '../src/db/index.js';
import { users } from '../src/db/schema.js';
import { AUTH_MESSAGES } from '../src/modules/auth/auth.messages.js';
import { assertDatabaseReachable } from './helpers/db.js';

/**
 * End-to-end test through the real HTTP layer against a real Postgres
 * instance (see docker-compose.yml). This is intentionally an integration
 * test, not a mocked unit test: auth + CRUD wiring is exactly the kind of
 * thing that looks right in isolation but breaks at the seams.
 */
const app = createApp();
const testEmail = `test-${Date.now()}@example.com`;

let authToken: string;
let userId: string;

beforeAll(async () => {
  await assertDatabaseReachable();
});

afterAll(async () => {
  await db.delete(users).where(eq(users.email, testEmail));
  await closeDb();
});

describe('auth + users flow', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: 'password123', name: 'Test User' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTypeOf('string');
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user.passwordHash).toBeUndefined();

    authToken = res.body.token;
    userId = res.body.user.id;
  });

  it('rejects duplicate registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: 'password123', name: 'Test User' });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toBe(AUTH_MESSAGES.accountExists);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf('string');
  });

  it('rejects login with the wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe(AUTH_MESSAGES.invalidCredentials);
  });

  it('rejects login for an unknown email with the same message as a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe(AUTH_MESSAGES.invalidCredentials);
  });

  it('rejects unauthenticated access to /api/users', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.status).toBe(401);
  });

  it('fetches the current user by id when authenticated', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(testEmail);
  });

  it('updates the user', async () => {
    const res = await request(app)
      .patch(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated Name');
  });

  it('returns 404 for a well-formed but nonexistent id', async () => {
    const res = await request(app)
      .get('/api/users/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });

  it('returns 400 for a malformed id', async () => {
    const res = await request(app)
      .get('/api/users/not-a-uuid')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(400);
  });

  it('deletes the user', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(204);
  });
});
