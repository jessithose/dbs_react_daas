import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { WealthPage } from './WealthPage';
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

const demoPortfolio = [
  { id: 'H1', name: 'DBS Global Equity Fund', assetClass: 'UNIT_TRUST', currency: 'SGD', marketValue: 18420, cost: 16000, dayChange: 221, dayChangePct: 1.21 },
  { id: 'H2', name: 'Singapore Blue-Chip ETF', assetClass: 'EQUITY', currency: 'SGD', marketValue: 10250, cost: 9500, dayChange: -68, dayChangePct: -0.66 },
  { id: 'H3', name: 'Global Bond Fund', assetClass: 'BOND', currency: 'SGD', marketValue: 22400, cost: 22500, dayChange: 34, dayChangePct: 0.15 },
  { id: 'H4', name: 'Structured Deposit 2Y', assetClass: 'STRUCTURED_DEPOSIT', currency: 'SGD', marketValue: 15000, cost: 15000, dayChange: 0, dayChangePct: 0 },
];

/** Standalone dev entry for the wealth remote (http://localhost:3004). */
/** wealth remote 的独立开发入口（http://localhost:3004）。 */
const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root DOM node #root not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <Canvas>
      <Banner>
        Running standalone (port 3004). Normally mounted inside the host at /mfe/wealth.
      </Banner>
      <WealthPage
        preferredName="Jesseeeeeeeeeeee"
        riskProfile="Balanced"
        portfolio={demoPortfolio}
        onRefresh={() => console.log('[wealth] refresh requested')}
      />
    </Canvas>
  </StrictMode>,
);
