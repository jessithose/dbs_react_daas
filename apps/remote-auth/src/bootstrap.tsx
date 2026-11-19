import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LoginPage } from './LoginPage';
import './styles/index.css';

/**
 * Standalone dev entry for the auth remote. Renders LoginPage directly so you
 * can develop it in isolation at http://localhost:3001 without the host.
 * auth remote 的独立开发入口。直接渲染 LoginPage，以便在
 * http://localhost:3001 独立开发它，而不需要 host。
 */
const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root DOM node #root not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <div className="min-h-screen bg-indigo-50 p-6">
      <p className="mx-auto mb-4 max-w-lg rounded bg-amber-100 px-3 py-1 text-center text-xs font-medium text-amber-800">
        Running standalone (port 3001). Normally this remote is mounted inside the host at /login.
      </p>
      <LoginPage
        brandName="digiBank (React DaaS)"
        onLogin={(id, displayName) => console.log('[auth] login:', id, displayName)}
      />
    </div>
  </StrictMode>,
);
