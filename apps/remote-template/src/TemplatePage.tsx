import './styles/index.css';

/**
 * External-facing props that the HOST passes into this remote page.
 * HOST 传入本 remote 页面的对外 props。
 *
 * Replace this interface with the props your feature actually needs from the
 * host (e.g. slices, callbacks). Keep the remote SELF-CONTAINED — receive data
 * via props and report mutations back via callbacks; never own the router.
 * 用你的功能实际需要的 props 替换此接口（例如切片、回调）。保持 remote
 * 自包含 —— 通过 props 接收数据、通过回调回报变更；绝不拥有路由。
 */
export interface TemplatePageProps {
  title: string;
  message: string;
}

/**
 * TEMPLATE page component — the starting point for a new remote MFE.
 * TEMPLATE 页面组件 —— 新 remote MFE 的起点。
 */
export function TemplatePage({ title, message }: TemplatePageProps) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-brand-100 bg-white p-8 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-400">remote-template</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-800">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{message}</p>

      <div className="mt-6 rounded-xl bg-brand-50 p-4 text-left text-xs text-brand-700">
        <p className="font-semibold">To build your MFE from here:</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          <li>Copy this folder to apps/remote-&lt;name&gt;.</li>
          <li>Update name, port and exposes in rsbuild.config.ts.</li>
          <li>Replace this component with your feature page.</li>
          <li>Register the remote + a route in apps/host.</li>
        </ol>
      </div>
    </div>
  );
}
