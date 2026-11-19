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
    return <span className="tabular-nums text-emerald-600">+{money(value, currency)}</span>;
  }
  return <span className="tabular-nums">{money(value, currency)}</span>;
}
