import { createRemotePage } from '../createRemotePage';
import type { Account, Holding } from '../../stores/global';

/**
 * Props the host passes into the dashboard remote.
 * Host 传入 dashboard remote 的 props。
 */
export interface DashboardPageHostProps {
  preferredName: string;
  accounts: Account[];
  portfolio: Holding[];
  onRefresh: () => void;
  /**
   * Host-owned navigation callback the quick-action buttons call instead of using
   * raw `<a href>` anchors. A raw anchor forces a full page reload, which resets
   * the in-memory auth store and logs the user out — so quick actions must route
   * through the host (which owns the router) via this callback.
   * 由 host 持有的导航回调：quick-action 按钮调用它，而不是使用原生 `<a href>`
   * 锚点。原生锚点会强制整页刷新，从而重置内存中的 auth store 并导致用户登出，
   * 因此 quick actions 必须通过该回调经由 host（host 拥有 router）进行路由。
   */
  onNavigate: (path: string) => void;
}

/**
 * Host-side wrapper that mounts the `dashboard` remote MFE at runtime (/mfe/dashboard).
 * Host 侧包装组件，在运行时挂载 `dashboard` remote MFE（/mfe/dashboard）。
 *
 * `createRemotePage` loads the remote's named `DashboardPage` export on demand
 * and wraps it in ErrorBoundary + Suspense with the host-owned props type.
 * `createRemotePage` 按需加载 remote 的命名 `DashboardPage` 导出，并用
 * ErrorBoundary + Suspense 及 host 拥有的 props 类型进行包裹。
 */
export const DashboardPageHost = createRemotePage<DashboardPageHostProps>(
  'dashboard/DashboardPage',
  'DashboardPage',
);
