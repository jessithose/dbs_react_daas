import { createBrowserRouter, Navigate, RouterProvider, useLocation, useNavigate } from 'react-router';
import { AppLayout } from './AppLayout';
import { NotFoundPage } from './components/NotFoundPage';
import { RequireAuth } from './components/RequireAuth';
import { useGlobalStore } from './stores/global';
import { LoginPageHost } from './components/remotes/LoginPageHost';
import { DashboardPageHost } from './components/remotes/DashboardPageHost';
import { PaymentsPageHost } from './components/remotes/PaymentsPageHost';
import { WealthPageHost } from './components/remotes/WealthPageHost';
import { AccountsPageHost } from './components/remotes/AccountsPageHost';

/**
 * Host-owned router (react-router v7, declarative mode).
 * Host 拥有的路由（react-router v7，声明式模式）。
 *
 * In this architecture the HOST owns routing; remotes expose self-contained
 * page components and never mount their own router. This follows the DBS
 * guidance: "navigate() 属于 Host 的导航机制，MFE 不应自行接管 Host 的 Router"
 * (navigation belongs to the host).
 * 在此架构中 HOST 拥有路由；remotes 暴露自包含的页面组件，从不挂载自己的路由。
 * 这遵循 DBS 指引："navigate() 属于 Host 的导航机制，MFE 不应自行接管 Host 的
 * Router"（导航属于 host）。
 *
 * Adding an MFE route: 1) register the remote in host `remotes` + `shared`
 * (rsbuild.config.ts) · 2) create a host lazy wrapper under `components/remotes/`
 * · 3) register it below under `/mfe/<name>`.
 * 添加 MFE 路由：1) 在 host 的 `remotes` + `shared` 注册该 remote
 * （rsbuild.config.ts） · 2) 在 `components/remotes/` 下创建 host 懒加载包装组件
 * · 3) 在下方 `/mfe/<name>` 注册。
 */

/** /login — public auth screen that redirects back after a successful login. */
function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appName } = useGlobalStore();
  const alreadyAuthed = useGlobalStore((s) => s.isAuthenticated);

  if (alreadyAuthed) {
    return <Navigate to="/mfe/dashboard" replace />;
  }

  const from = (location.state as { from?: string } | null)?.from ?? '/mfe/dashboard';

  return (
    <LoginPageHost
      brandName={appName}
      onLogin={(id, displayName) => {
        useGlobalStore.getState().login(id, displayName);
        navigate(from, { replace: true });
      }}
    />
  );
}

/** Gathers the slices the dashboard remote needs and feeds them via props. */
function DashboardRoute() {
  const { customerProfile, accounts, portfolio } = useGlobalStore();
  const navigate = useNavigate();
  return (
    <DashboardPageHost
      preferredName={customerProfile?.preferredName ?? 'Guest'}
      accounts={accounts}
      portfolio={portfolio}
      onRefresh={() => {
        // Demo stand-in for the documented requestRemoteData([CFO]) refresh.
        // 模拟文档中 requestRemoteData([CFO]) 刷新的演示替身。
        useGlobalStore.setState((s) => ({ accounts: [...s.accounts], portfolio: [...s.portfolio] }));
      }}
      onNavigate={(path) => navigate(path)}
    />
  );
}

/** Routes the payments remote through the shared store's applyPayment. */
function PaymentsRoute() {
  const accounts = useGlobalStore((s) => s.accounts);
  return (
    <PaymentsPageHost
      accounts={accounts}
      onPaymentComplete={(fromId, amount, description) => {
        useGlobalStore.getState().applyPayment(fromId, amount, description);
      }}
    />
  );
}

/** Feeds the digiWealth remote its portfolio + customer profile. */
function WealthRoute() {
  const { customerProfile, portfolio } = useGlobalStore();
  return (
    <WealthPageHost
      preferredName={customerProfile?.preferredName ?? 'Guest'}
      riskProfile={customerProfile?.riskProfile ?? '—'}
      portfolio={portfolio}
      onRefresh={() => {
        useGlobalStore.setState((s) => ({ portfolio: [...s.portfolio] }));
      }}
    />
  );
}

/** Feeds the accounts (extension) remote its accounts + transactions. */
function AccountsRoute() {
  const { accounts, transactions } = useGlobalStore();
  return (
    <AccountsPageHost
      accounts={accounts}
      transactions={transactions}
      onRefresh={() => {
        useGlobalStore.setState((s) => ({ transactions: [...s.transactions] }));
      }}
    />
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/mfe/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginRoute />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/mfe/dashboard" replace /> },
      { path: 'mfe/dashboard', element: <DashboardRoute /> },
      { path: 'mfe/payments', element: <PaymentsRoute /> },
      { path: 'mfe/wealth', element: <WealthRoute /> },
      { path: 'mfe/accounts', element: <AccountsRoute /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
