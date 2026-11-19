import { NavLink, Outlet, useNavigate } from 'react-router';
import { useDbsSdk } from './daas/initDbsSdk';
import { useGlobalStore } from './stores/global';

/**
 * Navigation entries. Each maps a shell route label to a remote MFE route.
 * Adding a new MFE? Add an entry here plus the route in `router.tsx`.
 * 导航项。每项将壳路由标签映射到某个 remote MFE 路由。
 * 要新增 MFE？在此添加一项，并在 `router.tsx` 中添加路由。
 */
const NAV_ITEMS = [
  { to: '/mfe/dashboard', label: 'Dashboard' },
  { to: '/mfe/payments', label: 'Pay & Transfer' },
  { to: '/mfe/wealth', label: 'digiWealth' },
  { to: '/mfe/accounts', label: 'Accounts' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-white/15 text-white shadow-inner'
      : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`;

/**
 * Host shell: top navigation (deep indigo, amber gold accent) + <Outlet/>.
 * Host 壳：顶部导航（深靛蓝 + 琥珀金强调色）+ <Outlet/>。
 *
 * The host owns the layout & router; remotes fill the <Outlet/> only. Logout
 * clears the shared auth state and returns to /login.
 * host 拥有布局与路由；remotes 只填充 <Outlet/>。退出登录会清空共享认证状态并
 * 返回 /login。
 */
export function AppLayout() {
  const { loaded } = useDbsSdk();
  const { user, logout } = useGlobalStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-100">
      <header className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-violet-900 shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <NavLink to="/mfe/dashboard" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 text-indigo-950">
              ◆
            </span>
            <span>
              digi<span className="text-amber-300">Bank</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.to === '/mfe/dashboard'}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-sm text-slate-200">
            {user && (
              <span className="hidden rounded-full bg-white/10 px-3 py-1 font-medium md:inline">
                {user.displayName}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex items-center gap-1 overflow-x-auto px-4 pb-3 sm:hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10'
                }`
              }
              end={item.to === '/mfe/dashboard'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-indigo-100 bg-white/60 py-4 text-center text-xs text-slate-500">
        React 18 · Module Federation 2.0 · Rspack/Rsbuild · React Router v7 · Zustand · Tailwind · TS
        <span className="mx-2">·</span>
        DBS SDK: <span className={loaded ? 'text-indigo-600' : 'text-amber-600'}>{loaded ? 'loaded' : 'stub (not installed)'}</span>
      </footer>
    </div>
  );
}
