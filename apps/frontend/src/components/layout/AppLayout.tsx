import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/use-auth';

export function AppLayout() {
  const { token, logout } = useAuth();
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <div
      className={
        isLanding
          ? 'min-h-svh bg-studio-950 text-studio-50'
          : 'mx-auto min-h-svh max-w-3xl bg-graphite-50 px-4 py-8 text-graphite-900'
      }
    >
      <header
        className={
          isLanding
            ? 'absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-4 md:px-6'
            : 'mb-8 flex items-center justify-between'
        }
      >
        <div className="flex items-center gap-3">
          {isLanding ? (
            <button
              type="button"
              aria-label="Menu"
              className="flex h-9 w-9 cursor-default items-center justify-center rounded-lg border-0 bg-transparent text-studio-50"
            >
              <span className="flex flex-col gap-1" aria-hidden>
                <span className="block h-0.5 w-4 bg-current" />
                <span className="block h-0.5 w-4 bg-current" />
                <span className="block h-0.5 w-4 bg-current" />
              </span>
            </button>
          ) : null}
          <Link
            to="/"
            className={
              isLanding
                ? 'font-display text-lg font-semibold tracking-wide text-studio-50 no-underline'
                : 'font-display text-lg font-semibold tracking-wide text-graphite-900 no-underline'
            }
          >
            POTO AI
          </Link>
        </div>
        <nav className="flex items-center gap-2 text-sm font-medium md:gap-3">
          {token ? (
            <>
              <Link
                to="/users"
                className={
                  isLanding
                    ? 'rounded-full px-3 py-1.5 text-studio-100 no-underline hover:text-cyan-300'
                    : 'hover:text-teal-600'
                }
              >
                Users
              </Link>
              <button
                type="button"
                onClick={logout}
                className={
                  isLanding
                    ? 'cursor-pointer rounded-full border-0 bg-studio-700 px-3 py-1.5 text-studio-50 hover:bg-studio-600'
                    : 'cursor-pointer border-0 bg-transparent p-0 hover:text-teal-600'
                }
              >
                Log out
              </button>
            </>
          ) : (
            <>
              {isLanding ? (
                <Link
                  to="/register"
                  className="rounded-full bg-studio-800 px-4 py-1.5 text-cyan-300 no-underline transition hover:bg-studio-700"
                >
                  Pricing
                </Link>
              ) : null}
              <Link
                to="/login"
                className={
                  isLanding
                    ? 'rounded-full bg-cyan-400 px-4 py-1.5 font-semibold text-studio-950 no-underline transition hover:bg-cyan-300'
                    : 'hover:text-teal-600'
                }
              >
                Log in
              </Link>
              {!isLanding ? (
                <Link
                  to="/register"
                  className="rounded-md bg-teal-600 px-3 py-1.5 text-white no-underline transition hover:bg-teal-500"
                >
                  Register
                </Link>
              ) : null}
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
