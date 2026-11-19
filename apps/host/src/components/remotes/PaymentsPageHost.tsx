import { createRemotePage } from '../createRemotePage';
import type { Account } from '../../stores/global';

/**
 * Props the host passes into the payments remote.
 * Host 传入 payments remote 的 props。
 */
export interface PaymentsPageHostProps {
  accounts: Account[];
  /**
   * Called by the remote after a confirmed transfer so the host can "refresh"
   * its balances (demo stand-in for the documented `requestRemoteData` call).
   * 当 remote 确认一笔转账后调用，使 host 能“刷新”余额
   * （模拟文档中 `requestRemoteData` 调用的演示替身）。
   */
  onPaymentComplete: (fromAccountId: string, amount: number, description: string) => void;
}

/**
 * Host-side wrapper that mounts the `payments` remote MFE at runtime.
 * Host 侧包装组件，在运行时挂载 `payments` remote MFE。
 */
export const PaymentsPageHost = createRemotePage<PaymentsPageHostProps>(
  'payments/PaymentsPage',
  'PaymentsPage',
);
