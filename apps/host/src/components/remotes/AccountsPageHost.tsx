import { createRemotePage } from '../createRemotePage';
import type { Account, Transaction } from '../../stores/global';

/**
 * Props the host passes into the accounts remote (an extension-MFE example).
 * Host 传入 accounts remote（一个扩展 MFE 示例）的 props。
 */
export interface AccountsPageHostProps {
  accounts: Account[];
  transactions: Transaction[];
  onRefresh: () => void;
}

/**
 * Host-side wrapper that mounts the `accounts` remote MFE at runtime.
 * Host 侧包装组件，在运行时挂载 `accounts` remote MFE。
 */
export const AccountsPageHost = createRemotePage<AccountsPageHostProps>(
  'accounts/AccountsPage',
  'AccountsPage',
);
