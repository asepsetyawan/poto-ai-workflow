import { useCallback, useMemo, useState } from 'react';
import { AuthProvider as AuthContextProvider } from '@/features/auth/auth-context';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/lib/auth-storage';
import type { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const login = useCallback((nextToken: string) => {
    setStoredToken(nextToken);
    setToken(nextToken);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
    }),
    [token, login, logout],
  );

  return <AuthContextProvider value={value}>{children}</AuthContextProvider>;
}
