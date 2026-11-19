import styled from 'styled-components';

/** Small locale-aware currency formatter. */
/** 小型本地化货币格式化组件。 */
export function money(value: number, currency = 'SGD'): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency,
  }).format(value);
}

export function Money({
  value,
  currency = 'SGD',
}: {
  value: number;
  currency?: string;
}) {
  return <Num>{money(value, currency)}</Num>;
}

/* ------------------------------------------------------------------ */
/* Styled components / Styled 组件                                      */
/* ------------------------------------------------------------------ */

/** Aligns digits in a row of numbers (styled-component replacement for the old
 *  `.tabular-nums` utility class). 数字等宽对齐（替代原 `.tabular-nums` 工具类）。 */
const Num = styled.span`
  font-variant-numeric: tabular-nums;
`;
