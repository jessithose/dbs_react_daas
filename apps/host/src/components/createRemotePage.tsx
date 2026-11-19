import { lazy, Suspense, type ComponentType } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * createRemotePage — generic factory that mounts a Module Federation remote
 * *page* at runtime and returns a typed React component.
 * createRemotePage —— 通用工厂，在运行时挂载一个 Module Federation 远程
 * *页面*，并返回一个带类型的 React 组件。
 *
 * Usage (in `src/components/remotes/`):
 * 用法（在 `src/components/remotes/` 中）：
 *
 * ```tsx
 * interface CardsPageHostProps { ... }      // the props the HOST passes in
 * export const CardsPageHost = createRemotePage<CardsPageHostProps>(
 *   'cards/CardsPage',                       // remote specifier (remotes registry)
 *   'CardsPage',                             // NAMED export the remote exposes
 * );
 * ```
 *
 * How it works:
 * 工作原理：
 * - Each supported specifier is wired to a **static** `import('remote/...')` in
 *   the `REMOTE_LOADERS` map below. Statically analyzable imports are what
 *   Rspack's Module Federation plugin needs to resolve the specifier to the
 *   target remote **at build time** (see `remotes` in
 *   `apps/host/rsbuild.config.ts`). Ambient declarations in
 *   `src/types/remotes.d.ts` let those static imports type-check without the
 *   remote's generated types.
 *   - 每个受支持的 specifier 都连接到下方 `REMOTE_LOADERS` 映射中的 **静态**
 *     `import('remote/...')`。可静态分析的导入正是 Rspack 的 Module Federation
 *     插件在 **构建时** 将 specifier 解析到目标 remote 所需（见
 *     `apps/host/rsbuild.config.ts` 的 `remotes`）。`src/types/remotes.d.ts` 中的
 *     环境声明让这些静态导入无需远程生成类型即可通过类型检查。
 * - The remote exposes the target as a **NAMED** export (`exportName`); the
 *   loader remaps it onto the `{ default }` shape that `React.lazy()` expects.
 *   - remote 以 **命名** 导出暴露目标（`exportName`）；loader 会把它重映射为
 *     `React.lazy()` 期望的 `{ default }` 形状。
 * - Every remote page is wrapped in `<ErrorBoundary>` + `<Suspense>` so a single
 *   failing remote degrades gracefully instead of unmounting the whole shell.
 *   - 每个远程页面都被 `<ErrorBoundary>` + `<Suspense>` 包裹，单个 remote 出错会
 *     优雅降级，而不会卸载整个壳。
 *
 * The props type `P` is owned by the HOST (a contract the host and remote agree
 * on); the remote itself stays self-contained and never touches the router.
 * props 类型 `P` 由 HOST 拥有（host 与 remote 之间约定的契约）；remote 本身保持
 * 自包含，从不接触路由。
 *
 * --- Adding a new remote MFE ---
 * --- 新增一个 remote MFE ---
 * 1. add it to `apps/host/rsbuild.config.ts` `remotes`
 *    1. 在 `apps/host/rsbuild.config.ts` 的 `remotes` 中注册
 * 2. add a static loader entry below (key = specifier) so the remote resolves
 *    2. 在下方新增一条静态 loader 项（key = specifier），使该 remote 能解析
 * 3. add a matching `declare module '...'` in `src/types/remotes.d.ts`
 *    3. 在 `src/types/remotes.d.ts` 中添加对应的 `declare module '...'`
 * 4. create a host wrapper (`createRemotePage<P>('x/X', 'X')`) + a route + nav item
 *    4. 创建 host 包装组件（`createRemotePage<P>('x/X', 'X')`）+ 路由 + 导航项
 */

/** Result shape each loader must produce: the remote's default-export component. */
/** 每个 loader 必须产出的形状：远程组件的 default 导出。 */
type RemoteModule = { default: ComponentType };

/**
 * Map of supported remote specifiers to a **statically analyzable** importer.
 * Keeping this registry explicit means Rspack can resolve each specifier to its
 * remote at build time, and an unknown specifier degrades to a no-op instead of
 * crashing the shell at runtime.
 * 受支持 remote specifier 到 **可静态分析** 的导入器的映射。保持此注册表显式，
 * 使 Rspack 能在构建时把每个 specifier 解析到其 remote；未知 specifier 会降级为
 * 空操作，而不是在运行时使壳崩溃。
 */
const REMOTE_LOADERS: Record<string, () => Promise<RemoteModule>> = {
  'auth/LoginPage': () => import('auth/LoginPage').then((m) => ({ default: m.LoginPage })),
  'dashboard/DashboardPage': () =>
    import('dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
  'payments/PaymentsPage': () =>
    import('payments/PaymentsPage').then((m) => ({ default: m.PaymentsPage })),
  'wealth/WealthPage': () => import('wealth/WealthPage').then((m) => ({ default: m.WealthPage })),
  'accounts/AccountsPage': () =>
    import('accounts/AccountsPage').then((m) => ({ default: m.AccountsPage })),
};

/** Simple branded fallback shown while the remote chunk is loading. */
/** 在远程 chunk 加载期间显示的简洁 fallback。 */
function PageFallback() {
  return (
    <div className="space-y-3">
      <div className="h-6 w-1/3 animate-pulse rounded bg-indigo-100" />
      <div className="h-28 animate-pulse rounded-lg bg-slate-100" />
      <div className="h-28 animate-pulse rounded-lg bg-slate-100" />
    </div>
  );
}

export function createRemotePage<P extends object>(
  specifier: string,
  _exportName: string,
): ComponentType<P> {
  const loader = REMOTE_LOADERS[specifier];
  const Component = loader
    ? (lazy(loader) as ComponentType<P>)
    : // Unknown / not-yet-registered remote — render nothing rather than crash.
      // 未知 / 尚未注册的 remote —— 不渲染，而不是崩溃。
      (() => null);

  function RemotePage(props: P) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          {/* Props are a compile-time contract owned by the host (`P`), re-applied
              here at the component boundary; runtime just forwards them. */}
          {/* props 是 host 拥有的编译期契约（`P`），在此组件边界重新应用；运行时
              仅透传。 */}
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return RemotePage;
}
