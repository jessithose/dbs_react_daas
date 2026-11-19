import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useGlobalStore } from '../stores/global';

/**
 * Route guard: redirects unauthenticated users to /login, preserving the
 * intended destination so they can be sent back after login.
 * 路由守卫：将未认证用户重定向到 /login，并保留目标地址，以便登录后跳回。
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useGlobalStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
