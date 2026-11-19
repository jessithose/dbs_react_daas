import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TemplatePage } from './TemplatePage';
import './styles/index.css';

/** Standalone dev entry for the template remote. */
/** template remote 的独立开发入口。 */
const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root DOM node #root not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <div className="min-h-screen bg-indigo-50 p-6">
      <p className="mx-auto mb-4 max-w-lg rounded bg-amber-100 px-3 py-1 text-center text-xs font-medium text-amber-800">
        This is the TEMPLATE remote (standalone). Copy me to build your own MFE.
      </p>
      <TemplatePage title="Template MFE" message="Replace this component with your feature page." />
    </div>
  </StrictMode>,
);
