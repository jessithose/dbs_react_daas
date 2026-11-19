import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

/**
 * digiBank remote-dashboard (Provider) build configuration.
 * digiBank remote-dashboard（提供者）构建配置。
 */
export default defineConfig({
  server: {
    port: 3002,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'dashboard',
      filename: 'remoteEntry.js',
      manifest: true,
      exposes: {
        './DashboardPage': './src/DashboardPage.tsx',
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
