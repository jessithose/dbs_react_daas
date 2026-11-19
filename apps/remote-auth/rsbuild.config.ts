import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

/**
 * digiBank remote-auth (Provider) build configuration.
 * digiBank remote-auth（提供者）构建配置。
 *
 * Exposes the LoginPage module for the host to consume. Shares the same
 * singleton packages (react, react-dom, react-router, zustand) as the host so
 * there is a single copy at runtime.
 * 暴露 LoginPage 模块供 host 消费。与 host 共享相同的单例包
 * （react, react-dom, react-router, zustand），以便运行时只有一份副本。
 */
export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'auth',
      filename: 'remoteEntry.js',
      manifest: true,
      exposes: {
        './LoginPage': './src/LoginPage.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.1' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
        'react-router': { singleton: true, requiredVersion: '^7.0.0' },
        zustand: { singleton: true, requiredVersion: '*' },
      },
      dev: {
        // Disable live-reload so the host doesn't force a full page reload.
        // 禁用 live-reload，使 host 不强制整页刷新。
        disableLiveReload: true,
      },
      dts: false,
    }),
  ],
});
