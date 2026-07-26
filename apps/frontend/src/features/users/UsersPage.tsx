import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/features/users/users.api';
import { useAuth } from '@/features/auth/use-auth';

export function UsersPage() {
  const { token } = useAuth();

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(token ?? ''),
    enabled: Boolean(token),
  });

  if (usersQuery.isLoading) {
    return <p>Loading users…</p>;
  }

  if (usersQuery.isError) {
    return <p role="alert">Failed to load users.</p>;
  }

  return (
    <section>
      <h1>Users</h1>
      <ul>
        {usersQuery.data?.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </section>
  );
}
