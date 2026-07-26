import { apiRequest } from '@/lib/api-client';
import { usersListSchema, type User } from '@/features/users/users.schema';

type UsersResponse = {
  data: User[];
};

export async function fetchUsers(token: string): Promise<User[]> {
  const response = await apiRequest<UsersResponse>('/api/users', { token });
  const parsed = usersListSchema.safeParse(response);

  if (!parsed.success) {
    throw new Error('Unexpected users response shape');
  }

  return parsed.data.data;
}
