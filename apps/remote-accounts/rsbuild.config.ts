import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

/**
 * digiBank remote-accounts (Provider) build configuration.
 * This remote is a worked example of ADDING A NEW MFE — copy `apps/remote-template`
 * to create another, then register name + port + exposes here and in the host.
 * digiBank remote-accounts（提供者）构建配置。
 * 这个 remote 是“新增一个 MFE”的完整示例 —— 复制 `apps/remote-template` 即可创建
 * 另一个，然后在此处和 host 中注册 name + port + exposes。
 */
export default defineConfig({
  server: {
    port: 3005,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'accounts',
      filename: 'remoteEntry.js',
      manifest: true,
      exposes: {
        './AccountsPage': './src/AccountsPage.tsx',
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
