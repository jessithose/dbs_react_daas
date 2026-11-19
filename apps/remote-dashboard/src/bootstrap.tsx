import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DashboardPage } from './DashboardPage';
import './styles/index.css';

/** Standalone dev entry for the dashboard remote (http://localhost:3002). */
/** dashboard remote 的独立开发入口（http://localhost:3002）。 */
const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root DOM node #root not found');
}

const demoAccounts = [
  { id: 'ACC-SG-001', type: 'SAVINGS-PLUS', name: 'Savings Plus', number: '011-123456-7', currency: 'SGD', availableBalance: 12854.6, ledgerBalance: 12904.6, updatedAt: '2026-11-03' },
  { id: 'ACC-SG-002', type: 'EVERYDAY', name: 'Everyday Account', number: '022-987654-3', currency: 'SGD', availableBalance: 3210.25, ledgerBalance: 3210.25, updatedAt: '2026-11-03' },
];
const demoPortfolio = [
  { id: 'H1', name: 'DBS Global Equity Fund', assetClass: 'UNIT_TRUST', currency: 'SGD', marketValue: 18420, cost: 16000, dayChange: 221, dayChangePct: 1.21 },
  { id: 'H2', name: 'Singapore Blue-Chip ETF', assetClass: 'EQUITY', currency: 'SGD', marketValue: 10250, cost: 9500, dayChange: -68, dayChangePct: -0.66 },
];

createRoot(rootEl).render(
  <StrictMode>
    <div className="min-h-screen bg-indigo-50 p-6">
      <p className="mx-auto mb-4 max-w-lg rounded bg-amber-100 px-3 py-1 text-center text-xs font-medium text-amber-800">
        Running standalone (port 3002). Normally mounted inside the host at /mfe/dashboard.
      </p>
      <DashboardPage
        preferredName="Jesseeeeeeeeeeee"
        accounts={demoAccounts}
        portfolio={demoPortfolio}
        onRefresh={() => console.log('[dashboard] refresh requested')}
      />
    </div>
  </StrictMode>,
);
