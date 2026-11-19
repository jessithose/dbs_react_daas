/**
 * Self-contained payment-mode registry for the payments remote.
 * payments remote 的自包含支付模式注册表。
 *
 * Each mode defines its own form fields, review summary and the free-text
 * description reported back to the host on completion. All modes share the
 * transfer basics (source account + amount + transaction PIN) which the flow
 * assembles automatically. Everything is client-side for the demo.
 * 每个模式定义各自的表单字段、预览摘要与完成时回传给 host 的文本描述。所有模式
 * 共享转账基础信息（源账户 + 金额 + 交易 PIN），由流程自动装配。演示全部在端侧完成。
 */

/** The six payment capabilities requested for remote-payments. */
/** remote-payments 需要的六种支付能力。 */
export type ModeId =
  | 'payNow'
  | 'localTransfer'
  | 'overseasTransfer'
  | 'billGiro'
  | 'edp'
  | 'exchangeCurrency';

/** A single form field definition rendered by the generic form. */
/** 由通用表单渲染的单个表单字段定义。 */
export type FieldDef =
  | {
      kind: 'text';
      label: string;
      key: string;
      placeholder?: string;
      hint?: string;
      inputMode?: 'text' | 'numeric' | 'decimal' | 'tel';
    }
  | {
      kind: 'select';
      label: string;
      key: string;
      options: { value: string; label: string }[];
    };

/** One payment mode's static definition. */
/** 单个支付模式的静态定义。 */
export interface ModeDef {
  id: ModeId;
  label: string;
  /** Short descriptor under the tab label. */
  /** 标签页下方的一行简介。 */
  sublabel: string;
  /** Longer explainer shown at the top of the mode's form. */
  /** 模式表单顶部的较长说明。 */
  tagline: string;
  /** Decorative solo character shown on the mode's step badge. */
  /** 模式步骤徽章上展示的装饰字符。 */
  glyph: string;
  /** Extra fields (on top of the shared from/amount/pin/note). */
  /** 额外字段（在共享 源账户/金额/交易PIN/备注 之上）。 */
  fields: FieldDef[];
  /** Validates mode-specific fields, returning an error message or ''. */
  /** 校验模式专属字段，返回错误信息或空字符串。 */
  validate: (v: Record<string, string>, accounts: { name: string }[]) => string;
  /** Builds the "to / recipient" line shown on the review + confirm pages. */
  /** 生成预览页与确认页展示的“收款方 / 接收方”行。 */
  recipientLine: (v: Record<string, string>) => string;
  /** Builds the description reported to the host on completion. */
  /** 生成完成时回传给 host 的描述文本。 */
  completion: (v: Record<string, string>, amountText: string) => string;
}

/** Validation basics shared by several modes. */
/** 多个模式共用的基础校验。 */
const pinCheck = (v: Record<string, string>): string =>
  /^\d{6}$/.test(v.pin) ? '' : 'Transaction PIN must be 6 digits.';
const amountCheck = (v: Record<string, string>): string =>
  /^\d+(\.\d{1,2})?$/.test(v.amount) && Number(v.amount) > 0
    ? ''
    : 'Enter a positive amount with up to 2 decimals.';

export const MODES: ModeDef[] = [
  {
    id: 'payNow',
    label: 'PayNow',
    sublabel: 'Mobile / NRIC / UEN',
    tagline: 'Send money instantly to a PayNow proxy — mobile number, NRIC/FIN, or UEN.',
    glyph: '⚡',
    fields: [
      {
        kind: 'text',
        label: 'PayNow proxy',
        key: 'proxy',
        placeholder: 'Mobile / NRIC / UEN',
        hint: 'e.g. 9123 4567 · S1234567A · 201612345M',
        inputMode: 'tel',
      },
    ],
    validate: (v) => {
      const m = amountCheck(v) || pinCheck(v);
      if (m) return m;
      return v.proxy.trim() ? '' : 'Enter a PayNow proxy (mobile / NRIC / UEN).';
    },
    recipientLine: (v) => v.proxy.trim(),
    completion: (v, amountText) => `PayNow ${amountText} to ${v.proxy.trim()}`,
  },
  {
    id: 'localTransfer',
    label: 'Local transfer',
    sublabel: 'Within Singapore',
    tagline: 'Transfer funds to a beneficiary at any local bank via FAST.',
    glyph: '↔',
    fields: [
      { kind: 'text', label: 'Beneficiary name', key: 'name', placeholder: 'Full name' },
      {
        kind: 'text',
        label: 'Bank account number',
        key: 'account',
        placeholder: 'e.g. 123-456789-0',
        inputMode: 'tel',
      },
      {
        kind: 'select',
        label: 'Destination bank',
        key: 'bank',
        options: [
          { value: 'DBS / POSB', label: 'DBS / POSB' },
          { value: 'UOB', label: 'UOB' },
          { value: 'OCBC', label: 'OCBC' },
          { value: 'Standard Chartered', label: 'Standard Chartered' },
          { value: 'Other local bank', label: 'Other local bank' },
        ],
      },
    ],
    validate: (v) => {
      const m = amountCheck(v) || pinCheck(v);
      if (m) return m;
      if (!v.name.trim()) return 'Enter the beneficiary name.';
      if (!/^\d{3,20}$/.test(v.account.replace(/-/g, ''))) return 'Enter a valid local bank account number.';
      return '';
    },
    recipientLine: (v) => `${v.name.trim()} · ${v.bank}`,
    completion: (v, amountText) =>
      `Local transfer ${amountText} to ${v.name.trim()} (${v.bank}, ${v.account})`,
  },
  {
    id: 'overseasTransfer',
    label: 'Overseas transfer',
    sublabel: 'International wire',
    tagline: 'Send money overseas by international telegraphic transfer.',
    glyph: '🌐',
    fields: [
      { kind: 'text', label: 'Beneficiary name', key: 'name', placeholder: 'Full name' },
      {
        kind: 'text',
        label: 'Beneficiary bank',
        key: 'bank',
        placeholder: 'Bank name & branch',
      },
      {
        kind: 'text',
        label: 'Account / IBAN',
        key: 'account',
        placeholder: 'Account number or IBAN',
      },
      {
        kind: 'text',
        label: 'SWIFT / BIC',
        key: 'swift',
        placeholder: 'e.g. DBSGSGSG',
        hint: '8 or 11 characters',
      },
      {
        kind: 'select',
        label: 'Destination currency',
        key: 'currency',
        options: [
          { value: 'USD', label: 'USD — US Dollar' },
          { value: 'EUR', label: 'EUR — Euro' },
          { value: 'GBP', label: 'GBP — British Pound' },
          { value: 'AUD', label: 'AUD — Australian Dollar' },
          { value: 'CNY', label: 'CNY — Chinese Yuan' },
          { value: 'JPY', label: 'JPY — Japanese Yen' },
        ],
      },
    ],
    validate: (v) => {
      const m = amountCheck(v) || pinCheck(v);
      if (m) return m;
      if (!v.name.trim()) return 'Enter the beneficiary name.';
      if (!v.bank.trim()) return 'Enter the beneficiary bank.';
      if (!v.account.trim()) return 'Enter the account / IBAN.';
      if (!/^[A-Z0-9]{8,11}$/.test(v.swift.trim().toUpperCase())) return 'Enter a valid SWIFT / BIC code.';
      return '';
    },
    recipientLine: (v) => `${v.name.trim()} · ${v.currency} · ${v.bank.trim()}`,
    completion: (v, amountText) =>
      `Overseas transfer ${amountText} to ${v.name.trim()} (${v.bank}, ${v.account}, SWIFT ${v.swift})`,
  },
  {
    id: 'billGiro',
    label: 'Bill & GIRO',
    sublabel: 'Bill payments',
    tagline: 'Pay bills to billing organisations or set up GIRO arrangements.',
    glyph: '🧾',
    fields: [
      {
        kind: 'select',
        label: 'Billing organisation',
        key: 'biller',
        options: [
          { value: 'SP Group — Utilities', label: 'SP Group — Utilities' },
          { value: 'Singtel', label: 'Singtel' },
          { value: 'StarHub', label: 'StarHub' },
          { value: 'M1', label: 'M1' },
          { value: 'HDB — Town Council', label: 'HDB — Town Council' },
          { value: 'IRAS', label: 'IRAS' },
        ],
      },
      {
        kind: 'text',
        label: 'Billing reference',
        key: 'reference',
        placeholder: 'Reference / account number',
        inputMode: 'numeric',
      },
    ],
    validate: (v) => {
      const m = amountCheck(v) || pinCheck(v);
      if (m) return m;
      if (!v.reference.trim()) return 'Enter the billing reference number.';
      return '';
    },
    recipientLine: (v) => `${v.biller} · Ref ${v.reference.trim()}`,
    completion: (v, amountText) =>
      `Bill payment ${amountText} to ${v.biller} (ref ${v.reference.trim()})`,
  },
  {
    id: 'edp',
    label: 'EDP',
    sublabel: 'Electronic direct payment',
    tagline: 'Electronic direct payment — transfer between your DBS accounts instantly.',
    glyph: '⇄',
    fields: [
      {
        kind: 'select',
        label: 'Destination',
        key: 'destination',
        options: [
          { value: 'own', label: 'My own DBS account' },
          { value: 'other', label: 'Another DBS/POSB account' },
        ],
      },
      {
        kind: 'text',
        label: 'Recipient account',
        key: 'account',
        placeholder: 'e.g. 011-123456-7',
        inputMode: 'tel',
      },
    ],
    validate: (v) => {
      const m = amountCheck(v) || pinCheck(v);
      if (m) return m;
      if (!/^\d{3,20}$/.test(v.account.replace(/-/g, ''))) return 'Enter a valid DBS/POSB account number.';
      return '';
    },
    recipientLine: (v) =>
      `${v.destination === 'own' ? 'My own account' : 'Another DBS/POSB account'} · ${v.account}`,
    completion: (v, amountText) =>
      `EDP ${amountText} to ${v.destination === 'own' ? 'own account' : v.account}`,
  },
  {
    id: 'exchangeCurrency',
    label: 'Exchange currency',
    sublabel: 'Currency conversion',
    tagline: 'Exchange currency and transfer the converted amount to a destination account.',
    glyph: '⇄',
    fields: [
      {
        kind: 'select',
        label: 'Convert to',
        key: 'toCurrency',
        options: [
          { value: 'USD', label: 'USD — US Dollar' },
          { value: 'EUR', label: 'EUR — Euro' },
          { value: 'GBP', label: 'GBP — British Pound' },
          { value: 'AUD', label: 'AUD — Australian Dollar' },
          { value: 'CNY', label: 'CNY — Chinese Yuan' },
          { value: 'JPY', label: 'JPY — Japanese Yen' },
        ],
      },
      {
        kind: 'text',
        label: 'Credit to account',
        key: 'account',
        placeholder: 'Destination DBS account',
        inputMode: 'tel',
      },
    ],
    validate: (v) => {
      const m = amountCheck(v) || pinCheck(v);
      if (m) return m;
      if (!/^\d{3,20}$/.test(v.account.replace(/-/g, ''))) return 'Enter a valid destination account number.';
      return '';
    },
    recipientLine: (v) => `${v.toCurrency} · ${v.account}`,
    completion: (v, amountText) =>
      `Currency exchange ${amountText} to ${v.toCurrency} (credit ${v.account})`,
  },
];

export const modeById = (id: ModeId): ModeDef =>
  MODES.find((m) => m.id === id) ?? MODES[0];
