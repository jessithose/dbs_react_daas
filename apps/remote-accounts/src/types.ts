/**
 * Self-contained domain types for the accounts remote (mirror host store).
 * accounts remote 的自包含领域类型（与 host store 对齐）。
 */
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

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'CREDIT' | 'DEBIT';
  amount: number;
  reference: string;
}
