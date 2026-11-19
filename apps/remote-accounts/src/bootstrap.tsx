import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { AccountsPage } from './AccountsPage';
import type { Account, Transaction } from './types';

/** Standalone dev entry for the accounts remote (http://localhost:3005). */
/** accounts remote 的独立开发入口（http://localhost:3005）。 */
const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root DOM node #root not found');
}

const demoAccounts: Account[] = [
  {
    id: 'ACC-SG-001',
    type: 'SAVINGS-PLUS',
    name: 'Savings Plus',
    number: '011-123456-7',
    currency: 'SGD',
    availableBalance: 12854.6,
    ledgerBalance: 12904.6,
    updatedAt: '2026-11-03',
  },
  {
    id: 'ACC-SG-002',
    type: 'EVERYDAY',
    name: 'Everyday Account',
    number: '022-987654-3',
    currency: 'SGD',
    availableBalance: 3210.25,
    ledgerBalance: 3210.25,
    updatedAt: '2026-11-03',
  },
  {
    id: 'ACC-SG-004',
    type: 'FD',
    name: 'Fixed Deposit 12M',
    number: '033-112233-9',
    currency: 'SGD',
    availableBalance: 20000,
    ledgerBalance: 20000,
    updatedAt: '2026-06-15',
  },
];

const demoTransactions: Transaction[] = [
  { id: 'T1', date: '2026-11-02', description: 'Salary Credit', category: 'CREDIT', amount: 6500, reference: 'REF11111111' },
  { id: 'T2', date: '2026-11-01', description: 'GrabPay Top Up', category: 'DEBIT', amount: 150, reference: 'REF22222222' },
  { id: 'T3', date: '2026-10-29', description: 'NTUC FairPrice', category: 'DEBIT', amount: 86.4, reference: 'REF33333333' },
  { id: 'T5', date: '2026-10-25', description: 'SBS Transit', category: 'DEBIT', amount: 12.5, reference: 'REF55555555' },
];

createRoot(rootEl).render(
  <StrictMode>
    <div className="min-h-screen bg-indigo-50 p-6">
      <p className="mx-auto mb-4 max-w-lg rounded bg-amber-100 px-3 py-1 text-center text-xs font-medium text-amber-800">
        Running standalone (port 3005). Normally this remote is mounted inside the host at
        /mfe/accounts.
      </p>
      <AccountsPage
        accounts={demoAccounts}
        transactions={demoTransactions}
        onRefresh={() => console.log('[accounts] refresh requested')}
      />
    </div>
  </StrictMode>,
);
