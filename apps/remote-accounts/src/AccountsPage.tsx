import { useState } from 'react';
import type { Account, Transaction } from './types';
import { Money } from './components/Money';
import './styles/index.css';

/**
 * External-facing props that the HOST passes into the accounts remote.
 * HOST 传入 accounts remote 的对外 props。
 */
export interface AccountsPageProps {
  accounts: Account[];
  transactions: Transaction[];
  onRefresh: () => void;
}

/**
 * Accounts page — select an account to see its balances and full transaction
 * history. A worked example of an EXTENSION MFE that receives slices from the
 * host via props and reports refreshes back via callback.
 * 账户页面 —— 选择账户以查看其余额和完整交易历史。这是一个“扩展 MFE”的完整示例：
 * 通过 props 从 host 接收切片，并通过回调回报刷新。
 */
export function AccountsPage({ accounts, transactions, onRefresh }: AccountsPageProps) {
  const [selectedId, setSelectedId] = useState(accounts[0]?.id ?? '');

  const selected = accounts.find((a) => a.id === selectedId) ?? accounts[0];
  // Show the most recent transactions across accounts.
  // 展示各账户最近期的交易。
  const history = transactions.slice(0, 12);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Accounts</p>
          <h1 className="text-2xl font-bold text-slate-800">Account details &amp; activity</h1>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Account list */}
        <aside className="space-y-2 lg:col-span-2">
          {accounts.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedId(a.id)}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${
                a.id === selectedId
                  ? 'border-brand-500 bg-brand-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-brand-200'
              }`}
            >
              <p className="font-semibold text-slate-800">{a.name}</p>
              <p className="text-xs text-slate-400">{a.type} · {a.number}</p>
              <p className="mt-2 text-lg font-bold tabular-nums text-slate-800">
                <Money value={a.availableBalance} currency={a.currency} />
              </p>
            </button>
          ))}
        </aside>

        {/* Selected account detail */}
        <section className="lg:col-span-3">
          {selected && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{selected.name}</h2>
                  <p className="text-xs text-slate-400">
                    {selected.type} · {selected.number} · {selected.currency}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold tabular-nums text-brand-700">
                    <Money value={selected.availableBalance} currency={selected.currency} />
                  </p>
                  <p className="text-xs text-slate-400">available</p>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Ledger balance: <span className="tabular-nums"><Money value={selected.ledgerBalance} currency={selected.currency} /></span>
                <span className="mx-2">·</span>Updated {selected.updatedAt}
              </div>

              <h3 className="mt-6 mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                Recent activity
              </h3>
              <div className="divide-y divide-slate-100">
                {history.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">{t.description}</p>
                      <p className="text-xs text-slate-400">
                        {t.date} · {t.reference}
                      </p>
                    </div>
                    <p
                      className={`whitespace-nowrap text-sm font-semibold tabular-nums ${
                        t.category === 'CREDIT' ? 'text-emerald-600' : 'text-slate-800'
                      }`}
                    >
                      {t.category === 'CREDIT' ? '+' : '−'}{' '}
                      <Money value={t.amount} currency={selected.currency} />
                    </p>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-400">No recent activity.</p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
