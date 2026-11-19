import { createRemotePage } from '../createRemotePage';

/**
 * Props the host passes into the auth remote's LoginPage.
 * Host 传入 auth remote 的 LoginPage 的 props。
 */
export interface LoginPageHostProps {
  brandName: string;
  onLogin: (id: string, displayName: string) => void;
}

/**
 * Host-side wrapper that mounts the `auth` remote MFE at runtime (/login).
 * Host 侧包装组件，在运行时挂载 `auth` remote MFE（/login）。
 *
 * The remote exposes `LoginPage` as a *named* export; `createRemotePage`
 * remaps it onto the `{ default }` shape that `React.lazy()` expects (otherwise
 * React throws "Element type is invalid") and wraps it in ErrorBoundary +
 * Suspense. The specifier is loaded dynamically, so the host type-checks
 * without needing the remote's generated types.
 * remote 以 *命名* 导出暴露 `LoginPage`；`createRemotePage` 会把它重映射成
 * `React.lazy()` 期望的 `{ default }` 形状（否则 React 会抛出 "Element type is
 * invalid"），并用 ErrorBoundary + Suspense 包裹。标识符是动态加载的，因此 host
 * 无需远程生成类型也能通过类型检查。
 */
export const LoginPageHost = createRemotePage<LoginPageHostProps>(
  'auth/LoginPage',
  'LoginPage',
);
