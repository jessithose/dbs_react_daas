import { createGlobalStyle } from 'styled-components';

/**
 * Global (reset) styles for the digiWealth remote, mirroring the base-layer CSS
 * the app used to carry (html color-scheme + body reset + numeric alignment).
 * When the remote runs standalone these ensure a consistent canvas; when it is
 * mounted inside the host, the host's own global styles already cover the body,
 * so this only re-applies the same intent — harmless either way.
 * digiWealth remote 的全局（重置）样式，替代原先的 base 层 CSS
 * （html color-scheme + body 重置 + 数字对齐）。独立运行时保证画布一致；
 * 被 host 挂载时 host 自身全局样式已覆盖 body，本样式只是重申同一意图——均无副作用。
 */
export const GlobalStyle = createGlobalStyle`
  html {
    color-scheme: light;
  }

  body {
    margin: 0;
    font-family:
      'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif;
  }

  /* Numeric alignment helper (equivalent of the old tabular-nums utility). */
  /* 数字等宽对齐辅助（对应原先 tabular-nums 工具类）。 */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
`;
