/**
 * digiBank remote-template entry point.
 * digiBank remote-template 入口点。
 *
 * Uses the dynamic-import bootstrap pattern so federated singletons resolve
 * before the app runs. When consumed by the host, the host imports the exposed
 * modules directly via mf-manifest.json and this entry is not involved.
 * 使用动态导入引导模式，使联邦单例在应用运行前解析。当被 host 消费时，host
 * 通过 mf-manifest.json 直接导入被暴露的模块，本入口不参与。
 */
void import('./bootstrap');

export {};
