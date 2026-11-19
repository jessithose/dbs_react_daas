/**
 * styled-components theme tokens for the digiWealth remote (digiBank deep-indigo
 * + amber-gold brand palette). Replaces the former Tailwind `@theme` tokens.
 * digiWealth remote 的 styled-components 主题令牌（digiBank 深靛蓝 + 琥珀金品牌色），
 * 替代原先 Tailwind `@theme` 令牌。
 *
 * Typed so any styled component can read `props.theme.colors.brand[600]` etc.
 * 已类型化，任何 styled 组件均可读取 `props.theme.colors.brand[600]` 等。
 */
export const theme = {
  colors: {
    /** Brand (deep indigo / violet "wealth & trust"). / 品牌色（深靛蓝/紫罗兰）。 */
    brand: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1d1b4d',
    },
    /** Accent (amber-gold). / 强调色（琥珀金）。 */
    accent: {
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
    },
    /** Neutrals (Tailwind slate scale) and semantic tones used by the UI. */
    /** 中性色（Tailwind slate 色阶）与 UI 用到的语义色。 */
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
    },
    emerald: {
      300: '#6ee7b7',
      600: '#059669',
    },
    rose: {
      300: '#fda4af',
      600: '#e11d48',
    },
    amber: {
      100: '#fef3c7',
      800: '#92400e',
    },
    indigo: {
      50: '#eef2ff',
    },
    white: '#ffffff',
  },
  radius: {
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  },
} as const;

/** The shape of the theme available to every styled component via props.theme. */
/** 每个 styled 组件经 props.theme 可读取的主题形状。 */
export type Theme = typeof theme;
