import { create } from 'zustand';

/**
 * Host-wide Zustand store — the single source of truth for the demo.
 * Host 全局 Zustand store —— 本演示应用的唯一数据源。
 *
 * It mirrors the shape of the DaaS customer-data slices described in the
 * platform docs (see `mfe-catalog/data-types`) so the UI reads like a real
 * digibank app, but backed by in-memory mock data instead of a backend.
 * 它模拟了平台文档（参见 `mfe-catalog/data-types`）所述的 DaaS 客户数据切片
 * 结构，使界面读起来像一个真实的 digibank 应用，但底层使用内存 mock 数据
 * 而非后端。
 *
 * Remotes stay SELF-CONTAINED: the host passes the slices they need in via
 * props and receives mutations back through callbacks (e.g. after a payment
 * the host "refreshes" portfolio/balances, mirroring the documented
 * `requestRemoteData` refresh-on-mutation pattern). Remotes never reach into
 * this store directly, and never own the router.
 * Remotes 保持自包含：host 通过 props 传入它们所需的切片，并通过回调接收更新
 * （例如支付完成后 host 会“刷新”资产组合/余额，模拟文档所述的
 * `requestRemoteData` 变更后刷新模式）。Remotes 从不直接访问本 store，也从不
 * 拥有路由。
 */

// ---------------------------------------------------------------------------
// Types (mirroring DaaS data-type references)
// 类型（模拟 DaaS 数据类型参考）
// ---------------------------------------------------------------------------

/** A CASA / savings-account record from the `customerassets` slice. */
/** `customerassets` 切片中的 CASA / 储蓄账户记录。 */
export interface Account {
  id: string;
  /** e.g. "SAVINGS-PLUS", "EVERYDAY", "FD" */
  /** 例如 "SAVINGS-PLUS"、"EVERYDAY"、"FD" */
  type: string;
  name: string;
  /** Masked account number, e.g. "011-123456-7". */
  /** 脱敏账号，例如 "011-123456-7"。 */
  number: string;
  currency: string;
  availableBalance: number;
  ledgerBalance: number;
  /** ISO date string, e.g. "2026-11-03". */
  /** ISO 日期字符串，例如 "2026-11-03"。 */
  updatedAt: string;
}

/** A recent transaction on an account. */
/** 账户上的一笔近期交易。 */
export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'CREDIT' | 'DEBIT';
  amount: number;
  reference: string;
}

/** The `portfolio` slice — a digiWealth-style holdings summary. */
/** `portfolio` 切片 —— digiWealth 风格的持仓汇总。 */
export interface Holding {
  id: string;
  name: string;
  /** e.g. "EQUITY", "BOND", "UNIT_TRUST", "STRUCTURED_DEPOSIT" */
  /** 例如 "EQUITY"、"BOND"、"UNIT_TRUST"、"STRUCTURED_DEPOSIT" */
  assetClass: string;
  currency: string;
  marketValue: number;
  cost: number;
  /** Daily P&L in absolute currency. */
  /** 当日盈亏（绝对币值）。 */
  dayChange: number;
  /** Daily P&L in percent. */
  /** 当日盈亏（百分比）。 */
  dayChangePct: number;
}

/**
 * GlobalStore state + actions.
 * GlobalStore 的状态 + 动作。
 */
export interface GlobalStore {
  // --- Application config (mirrors `globalConfig`/`meta` slices) ----------
  // --- 应用配置（模拟 `globalConfig`/`meta` 切片） -----------------------
  appName: string;
  region: 'SG' | 'HK' | 'TW' | 'ID';
  device: string;

  // --- Auth state ----------------------------------------------------------
  // --- 认证状态 ------------------------------------------------------------
  isAuthenticated: boolean;
  user: { displayName: string; maskedId: string } | null;
  login: (id: string, displayName: string) => void;
  logout: () => void;

  // --- Customer data slices (seeded by seedDemoData) -----------------------
  // --- 客户数据切片（由 seedDemoData 填充） --------------------------------
  customerProfile: {
    customerId: string;
    preferredName: string;
    riskProfile: string;
  } | null;
  accounts: Account[];
  transactions: Transaction[];
  portfolio: Holding[];

  // --- Cross-MFE update helpers --------------------------------------------
  // --- 跨 MFE 更新辅助 -----------------------------------------------------
  /**
   * Called by the payments MFE after a confirmed transfer. Reduces the source
   * account balance and appends a DEBIT transaction — the demo's version of the
   * documented "refresh CFO data after a payment".
   * 支付 MFE 在确认转账后调用。减少源账户余额并追加一笔 DEBIT 交易 —— 这是文档中
   * “支付后刷新 CFO 数据”在本演示中的实现。
   */
  applyPayment: (fromAccountId: string, amount: number, description: string) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGlobalStore = create<GlobalStore>((set) => ({
  appName: 'digiBank (React DaaS)',
  region: 'SG',
  device: 'web',

  isAuthenticated: false,
  user: null,
  login: (id, displayName) => set({ isAuthenticated: true, user: { maskedId: id, displayName } }),
  logout: () => set({ isAuthenticated: false, user: null }),

  customerProfile: null,
  accounts: [],
  transactions: [],
  portfolio: [],

  applyPayment: (fromAccountId, amount, description) =>
    set((s) => {
      const updatedAccounts = s.accounts.map((a) =>
        a.id === fromAccountId
          ? {
              ...a,
              availableBalance: round2(a.availableBalance - amount),
              ledgerBalance: round2(a.ledgerBalance - amount),
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : a,
      );
      const txn: Transaction = {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        description,
        category: 'DEBIT',
        amount: round2(amount),
        reference: `REF${String(Date.now()).slice(-8)}`,
      };
      return { accounts: updatedAccounts, transactions: [txn, ...s.transactions] };
    }),
}));

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Seeds realistic demo data once on bootstrap so every remote MFE has
 * something meaningful to render. Idempotent (only seeds when empty).
 * 在启动时填充一份真实的演示数据，使每个 remote MFE 都有可渲染的内容。
 * 是幂等的（仅在为空时填充）。
 */
export function seedDemoData(): void {
  const s = useGlobalStore.getState();
  if (s.accounts.length > 0) return;

  const accounts: Account[] = [
    {
      id: 'ACC-SG-001',
      type: 'SAVINGS-PLUS',
      name: 'Savings Plus',
      number: '011-123456-7',
      currency: 'SGD',
      availableBalance: 12854.6,
      ledgerBalance: 12904.6,
      updatedAt: '2026-11-03',
    },
    {
      id: 'ACC-SG-002',
      type: 'EVERYDAY',
      name: 'Everyday Account',
      number: '022-987654-3',
      currency: 'SGD',
      availableBalance: 3210.25,
      ledgerBalance: 3210.25,
      updatedAt: '2026-11-03',
    },
    {
      id: 'ACC-SG-003',
      type: 'FD',
      name: 'Fixed Deposit 6M',
      number: '033-456789-1',
      currency: 'SGD',
      availableBalance: 50000,
      ledgerBalance: 50000,
      updatedAt: '2026-08-01',
    },
    {
      id: 'ACC-SG-004',
      type: 'FD',
      name: 'Fixed Deposit 12M',
      number: '033-112233-9',
      currency: 'SGD',
      availableBalance: 20000,
      ledgerBalance: 20000,
      updatedAt: '2026-06-15',
    },
  ];

  const transactions: Transaction[] = [
    { id: 'T1', date: '2026-11-02', description: 'Salary Credit', category: 'CREDIT', amount: 6500, reference: 'REF11111111' },
    { id: 'T2', date: '2026-11-01', description: 'GrabPay Top Up', category: 'DEBIT', amount: 150, reference: 'REF22222222' },
    { id: 'T3', date: '2026-10-29', description: 'NTUC FairPrice', category: 'DEBIT', amount: 86.4, reference: 'REF33333333' },
    { id: 'T4', date: '2026-10-27', description: 'Transfer to Mike', category: 'DEBIT', amount: 320, reference: 'REF44444444' },
    { id: 'T5', date: '2026-10-25', description: 'SBS Transit', category: 'DEBIT', amount: 12.5, reference: 'REF55555555' },
  ];

  // digiWealth portfolio holdings (mirrors `portfolio` / `investment` slices).
  // digiWealth 资产组合持仓（模拟 `portfolio` / `investment` 切片）。
  const portfolio: Holding[] = [
    { id: 'H1', name: 'DBS Global Equity Fund', assetClass: 'UNIT_TRUST', currency: 'SGD', marketValue: 18420, cost: 16000, dayChange: 221, dayChangePct: 1.21 },
    { id: 'H2', name: 'Singapore Blue-Chip ETF', assetClass: 'EQUITY', currency: 'SGD', marketValue: 10250, cost: 9500, dayChange: -68, dayChangePct: -0.66 },
    { id: 'H3', name: 'Global Bond Fund', assetClass: 'BOND', currency: 'SGD', marketValue: 22400, cost: 22500, dayChange: 34, dayChangePct: 0.15 },
    { id: 'H4', name: 'Structured Deposit 2Y', assetClass: 'STRUCTURED_DEPOSIT', currency: 'SGD', marketValue: 15000, cost: 15000, dayChange: 0, dayChangePct: 0 },
  ];

  useGlobalStore.setState({
    customerProfile: {
      customerId: 'CUST-8821',
      preferredName: 'Jesseeeeeeeeeeee',
      riskProfile: 'Balanced',
    },
    accounts,
    transactions,
    portfolio,
  });
}
