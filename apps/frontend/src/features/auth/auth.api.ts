import { apiRequest } from '@/lib/api-client';
import type { AuthResponse, LoginInput, RegisterInput } from '@/features/auth/auth.schema';

export async function login(input: LoginInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: input,
  });
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: input,
  });
}
