import { createRemotePage } from '../createRemotePage';
import type { Holding } from '../../stores/global';

/**
 * Props the host passes into the digiWealth remote.
 * Host 传入 digiWealth remote 的 props。
 */
export interface WealthPageHostProps {
  preferredName: string;
  riskProfile: string;
  portfolio: Holding[];
  onRefresh: () => void;
}

/**
 * Host-side wrapper that mounts the `wealth` (digiWealth) remote MFE at runtime.
 * Host 侧包装组件，在运行时挂载 `wealth`（digiWealth）remote MFE。
 */
export const WealthPageHost = createRemotePage<WealthPageHostProps>(
  'wealth/WealthPage',
  'WealthPage',
);
