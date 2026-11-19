/**
 * Tiny locale-aware currency formatter used across the demo pages.
 * 跨演示页面使用的小型本地化货币格式化组件。
 */
export function Money({
  value,
  currency = 'SGD',
  sign = true,
}: {
  value: number;
  currency?: string;
  /** Show a +/− sign for change figures. */
  /** 是否对变动数值显示 +/− 符号。 */
  sign?: boolean;
}) {
  if (sign && value > 0) {
    return (
      <span className="tabular-nums">
        +{money(value, currency)}
      </span>
    );
  }
  return <span className="tabular-nums">{money(value, currency)}</span>;
}

export function money(value: number, currency = 'SGD'): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency,
  }).format(value);
}
