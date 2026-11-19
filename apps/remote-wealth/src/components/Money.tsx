import styled from 'styled-components';

/** Locale-aware currency formatter. */
/** 本地化货币格式化组件。 */
export function money(value: number, currency = 'SGD'): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency,
  }).format(value);
}

export function Money({
  value,
  currency = 'SGD',
  sign = false,
}: {
  value: number;
  currency?: string;
  sign?: boolean;
}) {
  if (sign && value > 0) {
    return <Num>+{money(value, currency)}</Num>;
  }
  return <Num>{money(value, currency)}</Num>;
}

/** Formats a percentage with an explicit +/− sign. */
/** 格式化带显式 +/− 符号的百分比。 */
export function Pct({ value }: { value: number }) {
  return (
    <Num>
      {value > 0 ? '+' : ''}
      {value.toFixed(2)}%
    </Num>
  );
}

/* ------------------------------------------------------------------ */
/* Styled components / Styled 组件                                      */
/* ------------------------------------------------------------------ */

/** Aligns digits in a row of numbers (styled-component replacement for the old
 *  `.tabular-nums` utility class). 数字等宽对齐（替代原 `.tabular-nums` 工具类）。 */
const Num = styled.span`
  font-variant-numeric: tabular-nums;
`;
