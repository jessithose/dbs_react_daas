import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

/**
 * digiBank remote-template (Provider) build configuration.
 * digiBank remote-template（提供者）构建配置。
 *
 * ── HOW TO ADD A NEW MFE (6 quick steps) ─────────────────────────────────
 * ── 如何新增一个 MFE（6 个快速步骤）─────────────────────────────────────────
 * 1. Copy this whole folder: `apps/remote-template` → `apps/remote-<name>`
 *    复制整个文件夹：`apps/remote-template` → `apps/remote-<name>`
 * 2. Update this file:
 *    更新本文件：
 *    - `name`: 'template' → 'cards' (or your MFE name)
 *           'template' → 'cards'（或你的 MFE 名）
 *    - `server.port`: 3099 → 3006 (must not clash with host 3000 / other remotes)
 *           server.port：3099 → 3006（不能与 host 3000 / 其他 remote 冲突）
 *    - `exposes`: './TemplatePage' → './CardsPage' and point to your page file
 *           exposes：'./TemplatePage' → './CardsPage' 并指向你的页面文件
 * 3. Rename `src/TemplatePage.tsx` → `src/CardsPage.tsx` and replace its body.
 *    将 `src/TemplatePage.tsx` 改名为 `src/CardsPage.tsx` 并替换其内容。
 * 4. Update `package.json` → name: `@daas/remote-template` → `@daas/remote-cards`.
 *    更新 `package.json` → name：`@daas/remote-template` → `@daas/remote-cards`。
 * 5. Register the remote in the HOST:
 *    在 HOST 中注册该 remote：
 *    - `apps/host/rsbuild.config.ts` → add to `remotes` with its port
 *          apps/host/rsbuild.config.ts → 在 `remotes` 中添加并指定端口
 *    - `apps/host/src/components/remotes/CardsPageHost.tsx` → copy one of the
 *      existing wrappers and point the `createRemotePage(...)` specifier at
 *      `'cards/CardsPage'`
 *          → 复制一个现有包装组件，并把 `createRemotePage(...)` 的标识符指向
 *            `'cards/CardsPage'`
 *    - `apps/host/src/router.tsx` → add a route `mfe/cards`
 *          → 在 `apps/host/src/router.tsx` 添加路由 `mfe/cards`
 * 6. (Optional) add the nav item in `apps/host/src/AppLayout.tsx` NAV_ITEMS.
 *    6. （可选）在 `apps/host/src/AppLayout.tsx` 的 NAV_ITEMS 中添加导航项。
 * ──────────────────────────────────────────────────────────────────────────
 */
export default defineConfig({
  server: {
    port: 3099,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'template',
      filename: 'remoteEntry.js',
      manifest: true,
      exposes: {
        './TemplatePage': './src/TemplatePage.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.1' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
        'react-router': { singleton: true, requiredVersion: '^7.0.0' },
        zustand: { singleton: true, requiredVersion: '*' },
      },
      dev: {
        disableLiveReload: true,
      },
      dts: false,
    }),
  ],
});
