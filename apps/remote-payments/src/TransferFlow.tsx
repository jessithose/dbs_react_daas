/**
 * TransferFlow — the multi-mode, multi-step transfer wizard for the payments remote.
 * TransferFlow —— payments remote 的多模式、多步骤转账向导。
 *
 * Every mode follows the same three-stage flow:
 *   1. FORM      — source account + amount + mode fields + PIN + note.
 *   2. REVIEW    — the preview page: a read-only summary of everything entered.
 *   3. CONFIRM   — the submit page: re-state the details, tap "Confirm & send".
 * Only step 3 calls `onPaymentComplete` (host contract unchanged).
 * 每种模式都遵循相同的三个阶段：
 *   1. 表单    —— 源账户 + 金额 + 模式字段 + PIN + 备注。
 *   2. 预览    —— 预览页：对已填内容的只读摘要。
 *   3. 确认    —— 提交页：复述详情，点按“确认并发送”。
 * 只有第 3 步才会调用 `onPaymentComplete`（host 契约保持不变）。
 *
 * All styling is via styled-components against the shared digiBank theme tokens
 * (deep-indigo + amber-gold). No Tailwind `className`/utility classes remain.
 * 全部样式经 styled-components 使用共享 digiBank 令牌（深靛蓝 + 琥珀金）。
 * 不再残留任何 Tailwind `className` / 工具类。
 *
 * Layout: functional helpers + page component first, then the styled-component
 * section at the bottom of the file.
 * 结构：功能辅助函数与页面组件在前，styled-component 样式区块置于文件底部。
 */
import { useMemo, useState, type FormEvent } from 'react';
import styled, { css } from 'styled-components';
import type { Account, PaymentModeId } from './types';
import { MODES, modeById, type FieldDef } from './modes';
import { money } from './components/Money';
import { theme } from './styles/theme';

/* ------------------------------------------------------------------ *
 * Functional helpers / 功能辅助函数
 * ------------------------------------------------------------------ */

/** Result of validating an amount entered as a decimal string. */
/** 对以十进制字符串输入的金额进行校验的结果。 */
function parseAmount(raw: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) return null;
  const n = Number(raw);
  return n > 0 ? n : null;
}

/** A read-only row used on the review + confirm screens. */
/** 预览页与确认页上使用的只读信息行。 */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <DetailRowWrap>
      <DetailLabel>{label}</DetailLabel>
      <DetailValue>{value}</DetailValue>
    </DetailRowWrap>
  );
}

/** The shared source-account selector (used on the form screen). */
/** 表单页上的共享源账户选择器。 */
function FromSelector({ accounts, value, onChange }: { accounts: Account[]; value: string; onChange: (id: string) => void }) {
  return (
    <FieldSelect value={value} onChange={(e) => onChange(e.target.value)}>
      {accounts.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name} · {a.number} — {money(a.availableBalance, a.currency)} available
        </option>
      ))}
    </FieldSelect>
  );
}

/** Renders a single mode-specific field definition bound to the inputs map. */
/** 渲染绑定到输入映射的单个模式专属字段定义。 */
function ModeField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (key: string, v: string) => void;
}) {
  if (field.kind === 'select') {
    return (
      <FieldSelect value={value} onChange={(e) => onChange(field.key, e.target.value)}>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </FieldSelect>
    );
  }
  return (
    <FieldText
      value={value}
      onChange={(e) => onChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      inputMode={field.inputMode ?? 'text'}
    />
  );
}

/** The compact wizard header showing which stage of the flow you are in. */
/** 展示当前流程阶段的紧凑向导头。 */
function StepBadge({ current, total, glyph, label }: { current: number; total: number; glyph: string; label: string }) {
  return (
    <BadgeRow>
      <BadgeGlyph>{glyph}</BadgeGlyph>
      <BadgeText>
        <StepLabel>
          Step {current} of {total}
        </StepLabel>
        <BadgeTitle>{label}</BadgeTitle>
      </BadgeText>
    </BadgeRow>
  );
}

/* ------------------------------------------------------------------ *
 * Page component / 页面组件
 * ------------------------------------------------------------------ */

/**
 * Embedded three-step transfer wizard.
 * 内嵌的三步转账向导。
 */
export function TransferFlow({ accounts, onPaymentComplete }: {
  accounts: Account[];
  onPaymentComplete: (fromId: string, amount: number, description: string) => void;
}) {
  const liquidAccounts = useMemo(() => accounts.filter((a) => a.type !== 'FD'), [accounts]);
  const [modeId, setModeId] = useState<PaymentModeId>('payNow');
  /** 0 = form, 1 = review (preview), 2 = confirm (submit). */
  /** 0 = 表单，1 = 预览，2 = 确认（提交）。 */
  const [step, setStep] = useState(0);

  const [fromId, setFromId] = useState(liquidAccounts[0]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [note, setNote] = useState('');
  const [modeValues, setModeValues] = useState<Record<string, string>>({});

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mode = modeById(modeId);
  const source = liquidAccounts.find((a) => a.id === fromId);
  const amountValue = parseAmount(amount);
  const amountText = source && amountValue != null ? money(amountValue, source.currency) : '—';

  const setModeValue = (key: string, v: string) =>
    setModeValues((prev) => ({ ...prev, [key]: v }));

  const setMode = (id: PaymentModeId) => {
    setModeId(id);
    setStep(0);
    setError('');
  };

  const handleReview = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    // Validate the SHARED basics on the form screen; mode-specific fields are
    // also validated here so the user never reaches a broken preview.
    // 在表单页校验共享基础信息；同时也校验模式专属字段，确保用户不会进入错误的预览。
    if (!source) return setError('Please pick a source account.');
    if (amountValue == null) return setError('Enter a positive amount with up to 2 decimals.');
    if (amountValue > source.availableBalance)
      return setError(`Insufficient funds — available is ${money(source.availableBalance, source.currency)}.`);
    if (!/^\d{6}$/.test(pin)) return setError('Transaction PIN must be 6 digits.');
    const m = mode.validate({ ...modeValues, amount, pin, fromId, note }, liquidAccounts);
    if (m) return setError(m);
    setStep(1);
  };

  const handleConfirm = () => {
    setError('');
    if (!source || amountValue == null) {
      setError('Something is missing — go back and review your transfer.');
      return;
    }
    const description = mode.completion(modeValues, money(amountValue, source.currency));
    onPaymentComplete(source.id, amountValue, description);
    setSuccess(`${mode.label} — ${description}`);
    setStep(2);
  };

  return (
    <Screen>
      {/* Screen header */}
      <Header>
        <Eyebrow>Transfer / Pay</Eyebrow>
        <Title>Send money securely</Title>
      </Header>

      {/* Mode picker */}
      <ModePicker>
        {MODES.map((m) => (
          <ModeTab
            key={m.id}
            type="button"
            $active={m.id === modeId}
            onClick={() => setMode(m.id)}
          >
            <ModeGlyph>{m.glyph}</ModeGlyph>
            {m.label}
          </ModeTab>
        ))}
      </ModePicker>

      {/* Card body: form / review / confirm / success */}
      <Card>
        {success && step === 2 ? (
          /* ---- Success ---- */
          <SuccessWrap>
            <SuccessCircle>✓</SuccessCircle>
            <SuccessTitle>{mode.label} completed</SuccessTitle>
            <SuccessMsg>{success}</SuccessMsg>
            <SuccessHint>The host has refreshed your balances and recorded the transaction.</SuccessHint>
            <SuccessButton
              type="button"
              onClick={() => {
                setAmount('');
                setPin('');
                setNote('');
                setModeValues({});
                setSuccess('');
                setStep(0);
              }}
            >
              Make another transfer
            </SuccessButton>
          </SuccessWrap>
        ) : step === 1 ? (
          /* ---- Review (preview) ---- */
          <Stack>
            <StepBadge current={2} total={3} glyph={mode.glyph} label={`Review · ${mode.label}`} />
            <Tagline>{mode.tagline}</Tagline>
            <AmountCard>
              <AmountCaption>Amount</AmountCaption>
              <AmountValue>{amountText}</AmountValue>
              {source && (
                <AmountFrom>
                  from {source.name} · {source.number}
                </AmountFrom>
              )}
            </AmountCard>
            <DetailsCard>
              <DetailRow label="To" value={mode.recipientLine(modeValues)} />
              <DetailRow label="Source account" value={source ? `${source.name} · ${source.number}` : '—'} />
              <DetailRow label="Description" value={mode.completion(modeValues, amountText)} />
              {note.trim() && <DetailRow label="Note" value={note.trim()} />}
              <DetailRow label="PIN" value={'••••••'} />
            </DetailsCard>
            {error && <ErrorText>{error}</ErrorText>}
            <ButtonRow>
              <GhostButton type="button" onClick={() => setStep(0)}>
                ← Back
              </GhostButton>
              <ActionButton type="button" onClick={handleConfirm}>
                Confirm &amp; send →
              </ActionButton>
            </ButtonRow>
          </Stack>
        ) : (
          /* ---- Form ---- */
          <FormStack onSubmit={handleReview}>
            <StepBadge current={1} total={3} glyph={mode.glyph} label={mode.label} />
            <Tagline>{mode.tagline}</Tagline>

            <FieldGroup>
              <FieldLabel>From</FieldLabel>
              <FromSelector accounts={liquidAccounts} value={fromId} onChange={setFromId} />
            </FieldGroup>

            {/* Mode-specific fields */}
            {mode.fields.map((f) => (
              <FieldGroup key={f.key}>
                <FieldLabel>{f.label}</FieldLabel>
                <ModeField field={f} value={modeValues[f.key] ?? ''} onChange={setModeValue} />
              </FieldGroup>
            ))}

            <TwoCol>
              <FieldGroup>
                <FieldLabel>Amount</FieldLabel>
                <FieldInput
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                  placeholder="0.00"
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Transaction PIN</FieldLabel>
                <FieldInput
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6 digits"
                />
              </FieldGroup>
            </TwoCol>

            <FieldGroup>
              <FieldLabel>Note (optional)</FieldLabel>
              <FieldText
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
              />
            </FieldGroup>

            {error && <ErrorText>{error}</ErrorText>}

            <SubmitButton type="submit">Review &amp; send</SubmitButton>
          </FormStack>
        )}
      </Card>

      <FooterNote>
        Demo flow only — Review opens a preview page, then Confirm submits and the host refreshes your balances.
      </FooterNote>
    </Screen>
  );
}

/* ------------------------------------------------------------------ *
 * Styled components — every visual value derives from theme tokens.
 * Styled 组件 —— 所有视觉值取自主题令牌。
 * ------------------------------------------------------------------ */

const Screen = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* space-y-6 */
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Eyebrow = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${(p) => theme.colors.slate[500]};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700;
  color: ${(p) => theme.colors.slate[800]};
`;

/* Mode picker -------------------------------------------------------- */

const ModePicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

interface ModeTabProps {
  $active: boolean;
}

const ModeTab = styled.button<ModeTabProps>`
  border: 1px solid ${(p) => (p.$active ? theme.colors.brand[600] : theme.colors.slate[300])};
  border-radius: ${(p) => theme.radius.full};
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 150ms, border-color 150ms, background-color 150ms;
  cursor: pointer;

  ${(p) =>
    p.$active
      ? css`
          background-color: ${theme.colors.brand[600]};
          color: ${theme.colors.white};
          box-shadow: ${theme.shadow.sm};
        `
      : css`
          background-color: ${theme.colors.white};
          color: ${theme.colors.slate[600]};
          &:hover {
            border-color: ${theme.colors.brand[300]};
            color: ${theme.colors.brand[700]};
          }
        `}
`;

const ModeGlyph = styled.span`
  margin-right: 0.25rem;
`;

/* Card + footer ----------------------------------------------------- */

const Card = styled.div`
  border: 1px solid ${(p) => theme.colors.slate[200]};
  border-radius: ${(p) => theme.radius['2xl']};
  background-color: ${(p) => theme.colors.white};
  padding: 1.5rem;
  box-shadow: ${(p) => theme.shadow.md};
`;

const FooterNote = styled.p`
  margin: 0;
  text-align: center;
  font-size: 0.75rem;
  color: ${(p) => theme.colors.slate[400]};
`;

/* Generic form field styling (shared by select + text inputs). */
const fieldBase = css`
  width: 100%;
  border: 1px solid ${(p) => theme.colors.slate[300]};
  border-radius: ${(p) => theme.radius.lg};
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: ${(p) => theme.colors.slate[800]};
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: ${(p) => theme.colors.brand[500]};
    box-shadow: 0 0 0 2px ${(p) => theme.colors.brand[200]};
  }
`;

const FieldSelect = styled.select`
  ${fieldBase}
  font-weight: 500;
`;

const FieldText = styled.input`
  ${fieldBase}
`;

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: ${(p) => theme.colors.slate[500]};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
`;

/* Amount + PIN inputs need a top margin (was `mt-1`). */
const FieldInput = styled(FieldText)`
  margin-top: 0.25rem;
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => theme.colors.rose[600]};
`;

/* Buttons ------------------------------------------------------------ */

const PrimaryButton = styled.button`
  border: none;
  border-radius: ${(p) => theme.radius.lg};
  background-color: ${(p) => theme.colors.brand[600]};
  color: ${(p) => theme.colors.white};
  font-weight: 600;
  transition: background-color 150ms;
  cursor: pointer;
  &:hover {
    background-color: ${(p) => theme.colors.brand[700]};
  }
`;

const SubmitButton = styled(PrimaryButton)`
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(p) => theme.colors.brand[300]};
  }
`;

const GhostButton = styled.button`
  border: 1px solid ${(p) => theme.colors.slate[300]};
  border-radius: ${(p) => theme.radius.lg};
  background-color: transparent;
  color: ${(p) => theme.colors.slate[600]};
  font-weight: 600;
  transition: background-color 150ms;
  cursor: pointer;
  &:hover {
    background-color: ${(p) => theme.colors.slate[100]};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled(PrimaryButton)`
  flex: 1;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
`;

const SuccessButton = styled(PrimaryButton)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
`;

/* Step badge --------------------------------------------------------- */

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BadgeGlyph = styled.span`
  display: grid;
  place-items: center;
  height: 2.25rem;
  width: 2.25rem;
  border-radius: ${(p) => theme.radius.xl};
  background-color: ${(p) => theme.colors.brand[50]};
  font-size: 1.125rem;
  color: ${(p) => theme.colors.brand[600]};
  box-shadow: 0 0 0 1px ${(p) => theme.colors.brand[200]} inset;
`;

const BadgeText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const StepLabel = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => theme.colors.brand[600]};
`;

const BadgeTitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${(p) => theme.colors.slate[800]};
`;

/* Review / success blocks ------------------------------------------- */

const Tagline = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${(p) => theme.colors.slate[500]};
`;

const AmountCard = styled.div`
  border: 1px solid ${(p) => theme.colors.slate[200]};
  border-radius: ${(p) => theme.radius.xl};
  background-color: ${(p) => theme.colors.slate[50]};
  padding: 1rem;
`;

const AmountCaption = styled.p`
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: ${(p) => theme.colors.slate[500]};
`;

const AmountValue = styled.p`
  margin: 0;
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  color: ${(p) => theme.colors.brand[700]};
`;

const AmountFrom = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: ${(p) => theme.colors.slate[500]};
`;

const DetailsCard = styled.div`
  border: 1px solid ${(p) => theme.colors.slate[200]};
  border-radius: ${(p) => theme.radius.xl};
  padding: 0.5rem;
`;

const DetailRowWrap = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.625rem 0;
  font-size: 0.875rem;
  border-bottom: 1px solid ${(p) => theme.colors.slate[100]};
  &:last-child {
    border-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  flex-shrink: 0;
  color: ${(p) => theme.colors.slate[500]};
`;

const DetailValue = styled.span`
  text-align: right;
  font-weight: 500;
  color: ${(p) => theme.colors.slate[800]};
`;

const SuccessWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
  text-align: center;
`;

const SuccessCircle = styled.div`
  display: grid;
  place-items: center;
  height: 3.5rem;
  width: 3.5rem;
  margin: 0 auto;
  border-radius: ${(p) => theme.radius.full};
  background-color: ${(p) => theme.colors.emerald[100]};
  font-size: 1.5rem;
  color: ${(p) => theme.colors.emerald[600]};
`;

const SuccessTitle = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(p) => theme.colors.slate[800]};
`;

const SuccessMsg = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${(p) => theme.colors.slate[500]};
`;

const SuccessHint = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${(p) => theme.colors.slate[400]};
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* space-y-5 */
`;

const FormStack = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
`;
