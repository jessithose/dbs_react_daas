/**
 * Self-contained domain types for the wealth remote (mirror host store).
 * wealth remote 的自包含领域类型（与 host store 对齐）。
 */
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
