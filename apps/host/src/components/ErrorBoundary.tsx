import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

/**
 * Simple error boundary so a failing remote doesn't crash the whole host.
 * When a remote dev server (e.g. payments on :3003) is not running, the lazy
 * import rejects and this shows a friendly message instead of a white screen.
 * 简单的错误边界，让出错的 remote 不会导致整个 host 崩溃。
 * 当某个 remote 开发服务器（例如 payments 的 :3003）未运行时，懒加载 import
 * 会失败（reject），这里会显示一条友好的提示信息，而不是白屏。
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[host] remote render error:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <p className="font-semibold">Failed to render remote MFE</p>
            <p className="mt-1 text-rose-600">
              {this.state.message ?? 'Is the corresponding remote dev server running? See README ports.'}
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
