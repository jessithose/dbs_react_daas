import { Money } from './components/Money';
import type { Account, Holding } from './types';
import './styles/index.css';

/**
 * External-facing props that the HOST passes into the dashboard remote.
 * HOST 传入 dashboard remote 的对外 props。
 */
export interface DashboardPageProps {
  preferredName: string;
  accounts: Account[];
  portfolio: Holding[];
  onRefresh: () => void;
  /**
   * Host-owned navigation callback used by the quick-action buttons. The remote
   * must NOT call the router directly — the host owns routing — so quick actions
   * route through this prop. (A raw `<a href>` would force a full page reload,
   * reset the in-memory auth store and log the user out.)
   * 由 host 持有的导航回调，quick-action 按钮使用它。remote 不得直接调用 router
   * （host 拥有路由），因此 quick actions 通过该 prop 路由。（原生 `<a href>` 会
   * 强制整页刷新、重置内存 auth store 并导致登出。）
   */
  onNavigate: (path: string) => void;
}

/**
 * digibank-style account dashboard: greeting + total balances, quick action
 * shortcuts, current-account cards and a small wealth snapshot.
 * digibank 风格账户仪表盘：问候语 + 余额汇总、快捷操作按钮、往来账户卡片以及
 * 一个小的财富快照。
 */
export function DashboardPage({ preferredName, accounts, portfolio, onRefresh, onNavigate }: DashboardPageProps) {
  const liquid = accounts
    .filter((a) => a.type !== 'FD')
    .reduce((sum, a) => sum + a.availableBalance, 0);

  const portfolioValue = portfolio.reduce((sum, h) => sum + h.marketValue, 0);
  const portfolioDayChange = portfolio.reduce((sum, h) => sum + h.dayChange, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Good evening</p>
          <h1 className="text-2xl font-bold text-slate-800">{preferredName}</h1>
          <p className="mt-1 text-xs text-slate-400">
            Here's an overview of your accounts and investments.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
        >
          ↻ Refresh data
        </button>
      </div>

      {/* Balance summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-brand-950 to-brand-700 p-5 text-white shadow-md">
          <p className="text-xs uppercase tracking-wide text-brand-200">Available (SGD)</p>
          <p className="mt-2 text-2xl font-bold tabular-nums">
            <Money value={liquid} currency="SGD" sign={false} />
          </p>
          <p className="mt-1 text-xs text-brand-300">Across CASA &amp; PayLah</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Investments</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-800">
            <Money value={portfolioValue} currency="SGD" sign={false} />
          </p>
          <p className="mt-1 text-xs">
            <span className={portfolioDayChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
              <Money value={portfolioDayChange} currency="SGD" />
            </span>{' '}
            today
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Quick actions</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/mfe/payments')}
              className="rounded-lg bg-red-100 px-3 py-2 text-center text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
            >
              Pay
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/mfe/wealth')}
              className="rounded-lg bg-accent-400/20 px-3 py-2 text-center text-sm font-semibold text-accent-600 transition-colors hover:bg-accent-400/30"
            >
              Invest
            </button>
          </div>
        </div>
      </div>

      {/* Accounts */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Your accounts</h2>
        <div className="grid gap-3">
          {accounts.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-slate-800">{a.name}</p>
                <p className="text-xs text-slate-400">
                  {a.type} · {a.number}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold tabular-nums text-slate-800">
                  <Money value={a.availableBalance} currency={a.currency} sign={false} />
                </p>
                <p className="text-xs text-slate-400">as of {a.updatedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Wealth snapshot */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">digiWealth snapshot</h2>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2 font-semibold">Holding</th>
                <th className="px-4 py-2 font-semibold">Class</th>
                <th className="px-4 py-2 text-right font-semibold">Market value</th>
                <th className="px-4 py-2 text-right font-semibold">Today</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {portfolio.map((h) => (
                <tr key={h.id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{h.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{h.assetClass}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                    <Money value={h.marketValue} currency={h.currency} sign={false} />
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums ${h.dayChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                  >
                    <Money value={h.dayChange} currency={h.currency} /> (
                    {h.dayChangePct > 0 ? '+' : ''}
                    {h.dayChangePct.toFixed(2)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
