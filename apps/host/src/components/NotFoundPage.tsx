import { Link } from 'react-router';

/**
 * Fallback shown for unknown routes. Keeps the user inside the shell instead
 * of a dead end.
 * 未知路由时显示的兜底页面。让用户留在壳内，而不是进入死胡同。
 */
export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-indigo-100 bg-white/80 p-10 text-center shadow-sm backdrop-blur">
      <p className="text-5xl font-black text-indigo-200">404</p>
      <h1 className="mt-3 text-xl font-bold text-slate-800">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        The page you are looking for does not exist or is not wired into the shell yet.
      </p>
      <Link
        to="/mfe/dashboard"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
