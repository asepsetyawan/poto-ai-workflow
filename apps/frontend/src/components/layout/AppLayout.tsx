import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/use-auth';

export function AppLayout() {
  const { token, logout } = useAuth();
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <div className={isLanding ? 'min-h-svh' : 'mx-auto min-h-svh max-w-3xl px-4 py-8'}>
      <header
        className={
          isLanding
            ? 'absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 text-graphite-50 md:px-10'
            : 'mb-8 flex items-center justify-between'
        }
      >
        <Link
          to="/"
          className={
            isLanding
              ? 'font-display text-lg font-semibold tracking-wide text-graphite-50 no-underline'
              : 'font-display text-lg font-semibold tracking-wide text-graphite-900 no-underline'
          }
        >
          POTO AI
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          {token ? (
            <>
              <Link
                to="/users"
                className={
                  isLanding ? 'text-graphite-100 hover:text-teal-400' : 'hover:text-teal-600'
                }
              >
                Users
              </Link>
              <button
                type="button"
                onClick={logout}
                className={
                  isLanding
                    ? 'cursor-pointer border-0 bg-transparent p-0 text-graphite-100 hover:text-teal-400'
                    : 'cursor-pointer border-0 bg-transparent p-0 hover:text-teal-600'
                }
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={
                  isLanding ? 'text-graphite-100 hover:text-teal-400' : 'hover:text-teal-600'
                }
              >
                Log in
              </Link>
              <Link
                to="/register"
                className={
                  isLanding
                    ? 'rounded-md bg-teal-500 px-3 py-1.5 text-graphite-50 no-underline transition hover:bg-teal-400'
                    : 'rounded-md bg-teal-600 px-3 py-1.5 text-white no-underline transition hover:bg-teal-500'
                }
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
