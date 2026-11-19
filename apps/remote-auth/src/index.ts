/**
 * digiBank remote-auth entry point.
 * digiBank remote-auth 入口点。
 *
 * Uses the dynamic-import bootstrap pattern: at module-federation runtime the
 * shared `react` / `react-dom` singletons must resolve first. When consumed by
 * the host, the host imports `./LoginPage` via the federation runtime
 * (mf-manifest.json) and this standalone entry is not wired up.
 * 使用动态导入引导模式：在 module-federation 运行时，必须先解析共享的
 * `react` / `react-dom` 单例。当被 host 消费时，host 会通过联邦运行时
 * （mf-manifest.json）直接导入 `./LoginPage`，此独立入口不参与。
 */
void import('./bootstrap');

export {};
