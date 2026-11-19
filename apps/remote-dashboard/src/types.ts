/**
 * Self-contained domain types for the dashboard remote.
 * These mirror the shapes seeded in the host's global store so the prop
 * contract stays aligned across the federation boundary.
 * dashboard remote 的自包含领域类型。这些类型与 host 全局 store 中填充的数据形状
 * 保持一致，从而在联邦边界上保持 props 契约对齐。
 */

/** A CASA / savings-account record. */
/** 一条 CASA / 储蓄账户记录。 */
export interface Account {
  id: string;
  type: string;
  name: string;
  number: string;
  currency: string;
  availableBalance: number;
  ledgerBalance: number;
  updatedAt: string;
}

/** A digiWealth-style holdings record. */
/** 一条 digiWealth 风格持仓记录。 */
export interface Holding {
  id: string;
  name: string;
  assetClass: string;
  currency: string;
  marketValue: number;
  cost: number;
  dayChange: number;
  dayChangePct: number;
}
