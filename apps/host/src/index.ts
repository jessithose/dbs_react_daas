/**
 * digiBank Host entry point.
 * digiBank Host 入口点。
 *
 * Uses the classic Module Federation "dynamic import bootstrap" pattern: we
 * import the app via a dynamic import so that the federated shared scope
 * (react / react-dom / react-router / zustand) is resolved by the MF runtime
 * *before* the app module executes. This avoids duplicated library instances
 * (e.g. "two Reacts") when consuming remotes.
 * 使用经典的 Module Federation “动态导入引导” 模式：我们通过动态导入引入应用，
 * 使联邦共享作用域（react / react-dom / react-router / zustand）在应用模块执行
 * *之前* 就被 MF 运行时解析。这避免了消费 remotes 时出现重复的库实例
 * （例如“两个 React”）。
 */
void import('./bootstrap');

export {};
