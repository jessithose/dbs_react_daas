import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

/**
 * digiBank remote-wealth (Provider) build configuration.
 * digiBank remote-wealth（提供者）构建配置。
 */
export default defineConfig({
  server: {
    port: 3004,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'wealth',
      filename: 'remoteEntry.js',
      manifest: true,
      exposes: {
        './WealthPage': './src/WealthPage.tsx',
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
