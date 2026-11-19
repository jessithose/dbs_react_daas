import { createContext, useContext, useMemo, type ComponentType, type ReactNode } from 'react';

/**
 * Result of loading the DBS SDK: always provides a React Provider component
 * and a status flag, whether or not the real internal SDK is installed.
 * 加载 DBS SDK 的结果：无论真实的内部 SDK 是否已安装，总是提供一个 React
 * Provider 组件和一个状态标志。
 */
export interface DbsSdkHandle {
  /** True when the real `@dbs/webstudio-hub-athena-daas` is installed & loaded. */
  /** 当真实的 `@dbs/webstudio-hub-athena-daas` 已安装并加载时为 true。 */
  loaded: boolean;
  /** React Provider (real SDK Provider when loaded, otherwise a passthrough). */
  /** React Provider（已加载时为真实 SDK Provider，否则为直通 Provider）。 */
  Root: ComponentType<{ children: ReactNode }>;
}

const DbsStatusContext = createContext<DbsSdkHandle>({ loaded: false, Root: Passthrough });

/** Small hook so any component can read SDK availability. */
/** 小型 hook，让任何组件都能读取 SDK 是否可用。 */
export function useDbsSdk(): DbsSdkHandle {
  return useContext(DbsStatusContext);
}

function Passthrough({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Best-effort, non-blocking DBS SDK loader.
 * 尽力而为、非阻塞的 DBS SDK 加载器。
 *
 * - If the SDK is installed (internal registry configured), it is imported at
 *   runtime and `init` is called; its Provider (if any) is embedded in `Root`.
 * - 如果已安装 SDK（配置了内部 registry），则在运行时导入并调用 `init`；
 *   其 Provider（如果有）会被内嵌到 `Root` 中。
 * - If not installed, or init throws, we log an informational warning and
 *   degrade gracefully to a passthrough provider so the app still runs.
 * - 如果未安装，或 init 抛出异常，我们会记录一条信息性警告，并优雅降级到
 *   直通 Provider，使应用仍能运行。
 *
 * The dynamic `import()` uses `webpackIgnore` so the bundler does NOT try to
 * statically resolve the (possibly absent) package at build time — keeping the
 * project compilable without the SDK.
 * 动态 `import()` 使用 `webpackIgnore`，因此打包器不会在构建时尝试对
 * （可能不存在的）包做静态解析 —— 从而在没有 SDK 的情况下项目仍可编译。
 */
export async function initDbsSdk(): Promise<DbsSdkHandle> {
  const enabled = process.env.DBS_DAAS_ENABLED !== 'false';

  if (!enabled) {
    console.warn('[daas] DBS SDK disabled via DBS_DAAS_ENABLED=false');
    return { loaded: false, Root: Passthrough };
  }

  let provider: ComponentType<{ children: ReactNode }> | null = null;
  let reason: unknown = null;

  try {
    // Runtime-only dynamic import. Rspack emits this without static resolution.
    // 仅运行时的动态导入。Rspack 会原样发出它，而不做静态解析。
    const mod = (await import(
      /* webpackIgnore: true */ /* @vite-ignore */ '@dbs/webstudio-hub-athena-daas'
    )) as Record<string, unknown>;
    const daas = ((mod?.default ?? mod) ?? {}) as {
      init?: (config?: unknown) => Promise<unknown>;
      Provider?: ComponentType<{ children: ReactNode }>;
    };

    if (!daas || typeof daas.init !== 'function') {
      throw new Error('SDK loaded but has no init()');
    }

    await daas.init({ env: process.env.DBS_DAAS_ENV ?? 'dev' });

    if (typeof daas.Provider === 'function') {
      provider = daas.Provider;
    }
    console.info('[daas] DBS SDK initialized.');
  } catch (err) {
    // Non-blocking: the internal SDK is simply not installed on this machine.
    // 非阻塞：仅仅是本机上没有安装内部 SDK。
    reason = err;
  }

  if (!provider) {
    console.warn(
      '[daas] @dbs/webstudio-hub-athena-daas is not available ' +
        '(install it via a DBS registry to enable platform features). ' +
        'Continuing without it.',
    );
    if (reason && process.env.NODE_ENV !== 'production') {
      console.debug('[daas] reason:', reason);
    }
  }

  const handle: DbsSdkHandle = {
    loaded: provider !== null,
    Root: provider ?? Passthrough,
  };

  // Wrap the (possibly real) SDK provider in our own status context so any
  // component can call useDbsSdk().
  // 将（可能是真实的）SDK Provider 包装进我们自己的状态上下文，以便任何组件
  // 都可以调用 useDbsSdk()。
  const DbsRoot = ({ children }: { children: ReactNode }) => {
    const value = useMemo(() => handle, []);
    const Inner = provider ?? Passthrough;
    return (
      <DbsStatusContext.Provider value={value}>
        <Inner>{children}</Inner>
      </DbsStatusContext.Provider>
    );
  };

  return { loaded: handle.loaded, Root: DbsRoot };
}
