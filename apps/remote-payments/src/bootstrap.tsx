import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { PaymentsPage } from './PaymentsPage';
import { theme } from './styles/theme';

/** Standalone dev canvas (styled-components replacement for the old Tailwind
 *  `min-h-screen bg-indigo-50 p-6` wrapper). 独立开发画布（替代原 Tailwind
 *  `min-h-screen bg-indigo-50 p-6` 包装层）。 */
const Canvas = styled.div`
  min-height: 100vh;
  background: ${theme.colors.indigo[50]};
  padding: 1.5rem;
`;

/** Standalone banner (styled-components replacement for the old Tailwind
 *  `mx-auto mb-4 max-w-lg rounded bg-amber-100 ...` notice). 独立运行提示条
 *  （替代原 Tailwind 提示样式）。 */
const Banner = styled.p`
  margin: 0 auto 1rem;
  max-width: 32rem;
  border-radius: 0.25rem;
  background: ${theme.colors.amber[100]};
  padding: 0.25rem 0.75rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${theme.colors.amber[800]};
`;

const demoAccounts = [
  { id: 'ACC-SG-001', type: 'SAVINGS-PLUS', name: 'Savings Plus', number: '011-123456-7', currency: 'SGD', availableBalance: 12854.6, ledgerBalance: 12904.6, updatedAt: '2026-11-03' },
  { id: 'ACC-SG-002', type: 'EVERYDAY', name: 'Everyday Account', number: '022-987654-3', currency: 'SGD', availableBalance: 3210.25, ledgerBalance: 3210.25, updatedAt: '2026-11-03' },
];

/** Standalone dev entry for the payments remote (http://localhost:3003). */
/** payments remote 的独立开发入口（http://localhost:3003）。 */
const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root DOM node #root not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <Canvas>
      <Banner>
        Running standalone (port 3003). Normally mounted inside the host at /mfe/payments.
      </Banner>
      <PaymentsPage
        accounts={demoAccounts}
        onPaymentComplete={(fromId, amount, desc) =>
          console.log('[payments] payment complete:', fromId, amount, desc)
        }
      />
    </Canvas>
  </StrictMode>,
);
