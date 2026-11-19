/**
 * Ambient type declarations for the remote MFE *modules* that this host
 * consumes. Each entry is a **shorthand ambient module** — it tells the
 * TypeScript compiler "this module exists" so that the static
 * `import('payments/PaymentsPage')` calls in `createRemotePage.tsx` type-check
 * without needing the remote's generated types (`@mf-types`) at build time.
 * 供本 host 消费的 remote MFE *模块* 的环境类型声明。每一项都是一个 **简写环境
 * 模块** —— 它告诉 TypeScript 编译器“该模块存在”，使 `createRemotePage.tsx`
 * 中的静态 `import('payments/PaymentsPage')` 调用无需远程生成类型
 * （`@mf-types`）即可通过类型检查。
 *
 * These specifiers are resolved to the actual remote **at build time** by the
 * Module Federation (Rsbuild/Rspack) plugin via the host's `remotes` registry
 * in `rsbuild.config.ts`; at runtime they are loaded on demand as shared
 * chunks. Actually implementing the real named exports, and the props contract
 * each remote agrees on, is done on the (host-owned) `*HostProps` wrapper types
 * in `src/components/remotes/`.
 * 这些标识符由 Module Federation（Rsbuild/Rspack）插件通过 `rsbuild.config.ts`
 * 中 host 的 `remotes` 注册表在 **构建时** 解析为真实 remote；运行时按需作为共享
 * chunk 加载。真实命名导出的具体实现，以及每个 remote 约定的 props 契约，由
 * `src/components/remotes/` 中（host 拥有的）`*HostProps` 包装类型完成。
 */
declare module 'auth/LoginPage';
declare module 'dashboard/DashboardPage';
declare module 'payments/PaymentsPage';
declare module 'wealth/WealthPage';
declare module 'accounts/AccountsPage';
