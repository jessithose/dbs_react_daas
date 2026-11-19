import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

/**
 * digiBank Host (Consumer / Shell) build configuration.
 * digiBank Host（消费者 / 壳）构建配置。
 *
 * The host owns the React Router (v7) and renders remote MFEs into its routes.
 * Host 拥有 React Router（v7），并将远程 MFE 渲染进它的路由。
 * Remote entries are resolved at runtime through each remote's `mf-manifest.json`
 * (Module Federation 2.0 runtime federation).
 * 远程入口在运行时通过各 remote 的 `mf-manifest.json` 解析
 * （Module Federation 2.0 运行时联邦）。
 *
 * Adding a new remote MFE — the extension recipe kept here for convenience:
 * 新增 remote MFE —— 为方便起见在此保留扩展步骤：
 *   1. create `apps/remote-<name>` from `apps/remote-template`
 *      基于 `apps/remote-template` 创建 `apps/remote-<name>`
 *   2. register it in `remotes` below with a unique name + port
 *      用唯一名称 + 端口在下面的 `remotes` 中注册
 *   3. keep `react` / `react-dom` / `react-router` / `zustand` as singletons here
 *      在此保持 `react` / `react-dom` / `react-router` / `zustand` 为单例
 *   4. add a host lazy wrapper in `src/components/daasRemote/` + a route in `src/router.tsx`
 *      在 `src/components/daasRemote/` 添加 host 懒加载包装组件，并在 `src/router.tsx` 添加路由
 */
export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  source: {
    // DBS SDK toggles, explicit & tree-shakeable at build time.
    // DBS SDK 开关，在构建时显式化并可被 tree-shaking 消除。
    define: {
      'process.env.DBS_DAAS_ENABLED': JSON.stringify(process.env.DBS_DAAS_ENABLED ?? 'true'),
      'process.env.DBS_DAAS_ENV': JSON.stringify(process.env.DBS_DAAS_ENV ?? 'dev'),
    },
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'host',
      // Remotes consumed by this host, keyed by the remote's registered name.
      // 本 Host 消费的 remotes，以 remote 注册名为键。
      remotes: {
        auth: 'auth@http://localhost:3001/mf-manifest.json',
        dashboard: 'dashboard@http://localhost:3002/mf-manifest.json',
        payments: 'payments@http://localhost:3003/mf-manifest.json',
        wealth: 'wealth@http://localhost:3004/mf-manifest.json',
        accounts: 'accounts@http://localhost:3005/mf-manifest.json',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.1' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
        'react-router': { singleton: true, requiredVersion: '^7.0.0' },
        zustand: { singleton: true, requiredVersion: '*' },
      },
      // Best-effort type generation. Set to false if noisy in dev.
      // 尽力而为的类型生成。若在开发环境中有干扰可设为 false。
      dts: true,
    }),
  ],
});
