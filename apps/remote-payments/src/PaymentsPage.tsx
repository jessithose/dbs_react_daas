import { ThemeProvider } from 'styled-components';
import type { Account } from './types';
import { TransferFlow } from './TransferFlow';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';

/**
 * External-facing props that the HOST passes into the payments remote.
 * HOST 传入 payments remote 的对外 props。
 */
export interface PaymentsPageProps {
  accounts: Account[];
  /**
   * Called after a confirmed transfer so the host can update balances and
   * re-fetch its slices (demo stand-in for `requestRemoteData`).
   * 确认转账后调用，使 host 能更新余额并重新获取切片
   * （模拟 `requestRemoteData` 的演示替身）。
   */
  onPaymentComplete: (fromAccountId: string, amount: number, description: string) => void;
}

/**
 * A digibank-style "Pay / Transfer" hub with six payment capabilities.
 * 一个 digibank 风格的“付款 / 转账”中心，提供六种支付能力：
 *
 *  • PayNow · Local transfer · Overseas transfer · Bill & GIRO · EDP ·
 *    Exchange currency
 *
 * Every mode runs the same three-stage flow: FORM → REVIEW (preview page) →
 * CONFIRM (submit page). All validation is client-side for the demo (no real
 * backend). The styled-components theme tokens + global reset are applied here
 * so both standalone and host-mounted usage render identically.
 * 每种模式均执行相同的三阶段流程：表单 → 预览（预览页）→ 确认（提交页）。
 * 演示中全部为端侧校验（无真实后端）。在此注入 styled-components 主题令牌与全局
 * 重置，使独立运行与 host 挂载两种场景渲染一致。
 */
export function PaymentsPage({ accounts, onPaymentComplete }: PaymentsPageProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <TransferFlow accounts={accounts} onPaymentComplete={onPaymentComplete} />
    </ThemeProvider>
  );
}

export type { Account } from './types';
