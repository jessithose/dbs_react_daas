import { useState, type FormEvent } from 'react';
import './styles/index.css';

/**
 * External-facing props that the HOST passes into the auth remote's LoginPage.
 * HOST 传入 auth remote 的 LoginPage 的对外 props。
 */
export interface LoginPageProps {
  /** Application / brand name to show on the login screen. */
  /** 登录屏幕上显示的应用/品牌名称。 */
  brandName?: string;
  /**
   * Called by the remote when credentials pass the local validation so the
   * host can set auth state and navigate. The remote never owns the router.
   * 当凭证通过本地校验后，由 remote 调用，使 host 能设置认证状态并导航。
   * remote 从不拥有路由。
   */
  onLogin: (id: string, displayName: string) => void;
}

/* Inline SVG icons (kept local; this MFE has no icon library).
 * 内联 SVG 图标（本地自带；该 MFE 无图标库）。 */
function LockIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ShieldIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 1.22a.75.75 0 0 0-.52.2L4.1 6.04A2.5 2.5 0 0 0 3.25 7.9v2.56c0 4.03 2.8 7.6 6.44 8.22.47.08.9.08 1.37 0 3.64-.62 6.44-4.19 6.44-8.22V7.9a2.5 2.5 0 0 0-.85-1.86L10.52 1.42A.75.75 0 0 0 10 1.22Zm3.6 6.3a.75.75 0 0 1 .05 1.06l-3.5 4a.75.75 0 0 1-1.08.07l-1.75-1.6a.75.75 0 1 1 1-1.1l1.24 1.13 2.99-3.41a.75.75 0 0 1 1.05-.15Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function KeyIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M14.25 1a4.75 4.75 0 1 0 0 9.5c.13 0 .26-.01.39-.02.27.17.54.23.86.23h.25a2.25 2.25 0 0 0 2.25-2.25v-1a1 1 0 0 0-1-1h-1.1l.06-.18A4.74 4.74 0 0 0 14.25 1Zm-2.5 4.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * A digibank-style login screen, refreshed to match the DBS iBanking (NGIB)
 * pattern: a clean, focused, centered credential flow surfaced with clear
 * trust & security cues — while staying on the project's own design tokens.
 * 一个 digibank 风格的登录页面，刷新为契合 DBS iBanking（NGIB）范式：
 * 清晰、专注、居中的凭证流程，并以明确的信任与安全提示呈现——同时保持在
 * 本工程自身的设计令牌之上。
 *
 * Demo-only credential check: any 6-10 digit "NRIC/ID" plus any 6-digit PIN
 * will log you in (this MFE has no real backend in the demo).
 * 仅演示用的凭证校验：任意 6-10 位的 “证件号/ID” 加任意 6 位 PIN 即可登录
 * （本演示中该 MFE 没有真实后端）。
 */
export function LoginPage({ brandName = 'digiBank', onLogin }: LoginPageProps) {
  const [id, setId] = useState('');
  const [pin, setPin] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6,10}$/.test(id)) {
      setError('ID should be 6–10 digits.');
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      setError('PIN should be exactly 6 digits.');
      return;
    }
    setError('');
    onLogin(id, `Customer ${id.slice(-4)}`);
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Brand panel — trust narrative + security cues */}
      {/* 品牌面板 —— 信任叙事 + 安全提示 */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 p-10 text-white md:flex">
        {/* subtle decorative glow / 微弱的装饰光晕 */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative flex items-center gap-2 text-2xl font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent-300 to-accent-500 text-brand-950 shadow-lg">
            ◆
          </span>
          <span>
            digi<span className="text-accent-300">Bank</span>
          </span>
        </div>

        <div className="relative">
          <h1 className="max-w-sm text-3xl font-bold leading-tight">
            Manage your money, simply and securely.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-brand-200">
            A micro-frontend demo built with React 18, Module Federation 2.0,
            Rsbuild/Rspack, React Router v7, Zustand and Tailwind — modelled on the
            DBS React DaaS platform.
          </p>

          {/* Feature highlights — why digiBank / 特色亮点 */}
          <ul className="mt-8 space-y-4">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-accent-300">
                <LockIcon />
              </span>
              <div>
                <p className="text-sm font-semibold">Secure by design</p>
                <p className="text-xs text-brand-300">
                  Encrypted sessions and a federated, single-tenant login surface.
                  <br />
                  加密会话与联邦式单租户登录界面。
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-accent-300">
                <ShieldIcon />
              </span>
              <div>
                <p className="text-sm font-semibold">Always protected</p>
                <p className="text-xs text-brand-300">
                  Session-guarded routes and a shared, trusted shell boundary.
                  <br />
                  受会话保护的路由与共享可信的壳边界。
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-accent-300">
                <KeyIcon />
              </span>
              <div>
                <p className="text-sm font-semibold">One key, many services</p>
                <p className="text-xs text-brand-300">
                  A single sign-in unlocks every remote feature module.
                  <br />
                  一次登录解锁全部远程功能模块。
                </p>
              </div>
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-brand-300">
          This screen is a federated <em>remote</em> MFE (port 3001) mounted by the host shell.
        </p>
      </div>

      {/* Login form — centered, focused, trust cues (DBS pre-login background) */}
      {/* 登录表单 —— 居中、专注、信任提示（DBS 登录前背景图） */}
      <div className="relative flex items-center justify-center overflow-hidden bg-slate-100 p-6">
        {/* DBS pre-login background image + dark veil for contrast */}
        {/* DBS 登录前背景图 + 深色遮罩以增强对比 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://www.dbs.com.sg/iwov-resources/generic/images/prelogin-bg/dbs/Daytime.jpg')",
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-slate-950/45" />
        <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-sm">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            {/* Mobile brand / 移动端品牌 */}
            <div className="mb-2 flex items-center gap-2 text-xl font-bold text-brand-700 md:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-300 to-accent-500 text-brand-950">
                ◆
              </span>
              <span>
                digi<span className="text-accent-500">Bank</span>
              </span>
            </div>

            {/* Secure login badge / 安全登录徽章 */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Welcome back</h2>
                <p className="mt-1 text-sm text-slate-500">Log in to {brandName}</p>
              </div>
              <span className="hidden items-center gap-1 rounded-full border border-accent-400/40 bg-accent-200/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-800 sm:flex">
                <LockIcon className="h-3 w-3 text-accent-500" />
                Secure login
              </span>
            </div>

            <label className="mt-6 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              ID / NRIC
            </label>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              inputMode="numeric"
              autoComplete="username"
              placeholder="6–10 digits"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Your 6–10 digit NRIC / registration ID. 您的 6–10 位证件号 / 注册 ID。
            </p>

            <div className="mt-4 flex items-baseline justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                PIN
              </label>
              <button
                type="button"
                className="text-[11px] font-medium text-brand-600 hover:text-brand-700 hover:underline"
              >
                Forgot PIN?
              </button>
            </div>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoComplete="current-password"
              placeholder="6-digit PIN · 6 位 PIN"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />

            <div className="mt-4 flex items-center justify-between">
              <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 accent-brand-600"
                />
                Remember me on this device
              </label>
              <span className="text-[11px] font-medium text-brand-600">
                First time? <span className="cursor-pointer hover:underline">Register</span>
              </span>
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
            >
              Sign in
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.19l-3.5-3.5a.75.75 0 1 1 1.06-1.06l4.75 4.75a.75.75 0 0 1 0 1.06l-4.75 4.75a.75.75 0 1 1-1.06-1.06l3.5-3.5H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="mt-5 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-[11px] leading-relaxed text-slate-500">
              <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" />
              <span>
                Your information is encrypted and this session is HTTPS-secured.
                By continuing you agree to our Terms of Service.
                <br />
                您的信息已加密，本会话经由 HTTPS 安全保护。继续即表示您同意我们的服务条款。
              </span>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            Demo: any 6–10 digit ID + any 6-digit PIN. 演示：任意 6–10 位 ID + 任意 6 位 PIN。
          </p>
        </form>
      </div>
    </div>
  );
}
