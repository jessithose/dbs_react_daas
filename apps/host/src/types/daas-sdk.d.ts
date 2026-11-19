/**
 * Ambient type declarations for the (optional) internal DBS SDK.
 * 针对（可选的）内部 DBS SDK 的环境类型声明。
 *
 * The real `@dbs/webstudio-hub-athena-daas` ships its own types when installed
 * from an internal registry. This minimal declaration keeps the project
 * type-walking in the common case where the package is absent locally.
 * 当从内部 registry 安装后，真实的 `@dbs/webstudio-hub-athena-daas` 会自带类型。
 * 这份最小声明用于在常见的“本地未安装该包”的情况下保持项目可类型检查。
 */
declare module '@dbs/webstudio-hub-athena-daas' {
  import type { ComponentType, ReactNode } from 'react';

  export interface DaaSContainer {
    requestRemoteData?: (
      dataTypes: string[],
      options?: { force?: boolean; [key: string]: unknown },
    ) => Promise<unknown>;
    [key: string]: unknown;
  }

  export function init(config?: unknown): Promise<unknown>;
  export function useDaaSContainer(): DaaSContainer;

  export const Provider: ComponentType<{ children: ReactNode }>;
  export const CustomerDataTypes: Record<string, string>;

  export default init;
}
