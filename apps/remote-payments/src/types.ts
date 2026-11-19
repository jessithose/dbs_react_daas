/**
 * Self-contained domain types for the payments remote (mirror host store).
 * payments remote 的自包含领域类型（与 host store 对齐）。
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

/** The six payment capabilities available in the payments remote. */
/** payments remote 中可用的六种支付能力。 */
export type PaymentModeId =
  | 'payNow'
  | 'localTransfer'
  | 'overseasTransfer'
  | 'billGiro'
  | 'edp'
  | 'exchangeCurrency';

/** The per-mode input snapshot that drives form, review and confirm. */
/** 驱动 表单/预览/确认 三页的模式专属输入快照。 */
export interface PaymentInputs {
  /** Source account id (shared selector). 源账户 id（共享选择器）。 */
  fromId: string;
  /** Transaction PIN (shared). 交易 PIN（共享）。 */
  pin: string;
  /** Free-text note (shared, optional). 备注（共享，可选）。 */
  note: string;
  /** A shared amount as decimal string (parsed for actual value). */
  /** 十进制字符串金额（解析后得到实际数值）。 */
  amount: string;
  /** Mode-specific raw field values keyed by each mode's FieldDef.key. */
  /** 各模式专属字段的原始值，按所属 FieldDef.key 组织。 */
  mode: Record<string, string>;
}
