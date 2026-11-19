import styled from 'styled-components';
import type { Holding } from './types';
import { Money, Pct } from './components/Money';
import { AllocationBar } from './components/AllocationBar';
import { theme } from './styles/theme';

/**
 * External-facing props that the HOST passes into the digiWealth remote.
 * HOST 传入 digiWealth remote 的对外 props。
 */
export interface WealthPageProps {
  preferredName: string;
  riskProfile: string;
  portfolio: Holding[];
  onRefresh: () => void;
}

function pct(value: number, total: number): number {
  return total > 0 ? (value / total) * 100 : 0;
}

/**
 * digiWealth page: personal wealth overview with asset-allocation breakdown
 * and a holdings table (mirrors the documented `portfolio` slice).
 * digiWealth 页面：个人财富总览，包含资产配置明细和持仓表
 * （模拟文档中的 `portfolio` 切片）。样式使用 styled-components。
 */
export function WealthPage({ preferredName, riskProfile, portfolio, onRefresh }: WealthPageProps) {
  const totalValue = portfolio.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCost = portfolio.reduce((sum, h) => sum + h.cost, 0);
  const totalDay = portfolio.reduce((sum, h) => sum + h.dayChange, 0);
  const totalGain = totalValue - totalCost;
  const returnPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  return (
    <Page>
      <Header>
        <div>
          <Eyebrow>digiWealth</Eyebrow>
          <Title>Hi {preferredName}</Title>
          <Subtitle>
            Your investment portfolio · risk profile:{' '}
            <SubtitleStrong>{riskProfile}</SubtitleStrong>
          </Subtitle>
        </div>
        <RefreshButton type="button" onClick={onRefresh}>
          ↻ Refresh portfolio
        </RefreshButton>
      </Header>

      {/* Portfolio summary */}
      <SummaryCard>
        <SummaryLabel>Total portfolio value</SummaryLabel>
        <SummaryValue>
          <Money value={totalValue} currency="SGD" sign={false} />
        </SummaryValue>
        <SummaryStats>
          <span>
            Today:{' '}
            <StatDelta $tone={totalDay >= 0 ? 'up' : 'down'}>
              <Money value={totalDay} currency="SGD" /> ({pct(totalDay, totalValue).toFixed(2)}%)
            </StatDelta>
          </span>
          <span>
            Total return:{' '}
            <StatDelta $tone={totalGain >= 0 ? 'up' : 'down'}>
              <Money value={totalGain} currency="SGD" /> (
              {returnPct > 0 ? '+' : ''}
              {returnPct.toFixed(2)}%)
            </StatDelta>
          </span>
        </SummaryStats>
      </SummaryCard>

      {/* Asset allocation */}
      <Section>
        <SectionTitle>Asset allocation</SectionTitle>
        <AllocationBar portfolio={portfolio} />
      </Section>

      {/* Holdings */}
      <Section>
        <SectionTitle>Holdings</SectionTitle>
        <TableScroll>
          <Table>
            <TableHead>
              <HeadRow>
                <Th>Instrument</Th>
                <Th>Class</Th>
                <ThRight>Market value</ThRight>
                <ThRight>Cost</ThRight>
                <ThRight>Day</ThRight>
                <ThRight>Weight</ThRight>
              </HeadRow>
            </TableHead>
            <TableBody>
              {portfolio.map((h) => (
                <tr key={h.id}>
                  <TdName>{h.name}</TdName>
                  <TdClass>{h.assetClass}</TdClass>
                  <TdNumeric>
                    <Money value={h.marketValue} currency={h.currency} sign={false} />
                  </TdNumeric>
                  <TdNumeric>
                    <Money value={h.cost} currency={h.currency} sign={false} />
                  </TdNumeric>
                  <TdDelta $tone={h.dayChange >= 0 ? 'up' : 'down'}>
                    <Pct value={h.dayChangePct} />
                  </TdDelta>
                  <TdWeight>{pct(h.marketValue, totalValue).toFixed(1)}%</TdWeight>
                </tr>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      </Section>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Styled components / Styled 组件                                      */
/* ------------------------------------------------------------------ */

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Eyebrow = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${theme.colors.slate[500]};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.slate[800]};
`;

const Subtitle = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: ${theme.colors.slate[400]};
`;

const SubtitleStrong = styled.span`
  font-weight: 600;
  color: ${theme.colors.brand[700]};
`;

const RefreshButton = styled.button`
  border: 1px solid ${theme.colors.brand[200]};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.white};
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.brand[700]};
  transition: background-color 0.15s;
  cursor: pointer;
  &:hover {
    background: ${theme.colors.brand[50]};
  }
`;

/* Portfolio summary card / 资产组合摘要卡片                            */

const SummaryCard = styled.div`
  border-radius: ${theme.radius['2xl']};
  background: linear-gradient(to bottom right, ${theme.colors.brand[950]}, ${theme.colors.brand[700]});
  padding: 1.5rem;
  color: ${theme.colors.white};
  box-shadow: ${theme.shadow.md};
`;

const SummaryLabel = styled.p`
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.brand[200]};
`;

const SummaryValue = styled.p`
  margin: 0.5rem 0 0;
  font-size: 1.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

const SummaryStats = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.5rem;
  font-size: 0.875rem;
`;

const StatDelta = styled.span<{ $tone: 'up' | 'down' }>`
  color: ${(p) => (p.$tone === 'up' ? theme.colors.emerald[300] : theme.colors.rose[300])};
`;

/* Card sections / 卡片区块                                            */

const Section = styled.section`
  border-radius: ${theme.radius['2xl']};
  border: 1px solid ${theme.colors.slate[200]};
  background: ${theme.colors.white};
  padding: 1.25rem;
  box-shadow: ${theme.shadow.sm};
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.slate[500]};
`;

/* Holdings table / 持仓表                                             */

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 40rem;
  text-align: left;
  font-size: 0.875rem;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.slate[500]};
`;

const HeadRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.slate[100]};
`;

const ThBase = styled.th`
  padding: 0.5rem 0.5rem;
  font-weight: 600;
`;

const Th = styled(ThBase)``;

const ThRight = styled(ThBase)`
  text-align: right;
`;

const TableBody = styled.tbody`
  & > tr {
    border-bottom: 1px solid ${theme.colors.slate[50]};
    &:last-child {
      border-bottom: 0;
    }
  }
`;

const TdBase = styled.td`
  padding: 0.75rem 0.5rem;
`;

const TdName = styled(TdBase)`
  font-weight: 500;
  color: ${theme.colors.slate[800]};
`;

const TdClass = styled(TdBase)`
  font-size: 0.75rem;
  color: ${theme.colors.slate[500]};
`;

const TdNumeric = styled(TdBase)`
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: ${theme.colors.slate[700]};
`;

const TdDelta = styled(TdBase)<{ $tone: 'up' | 'down' }>`
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: ${(p) => (p.$tone === 'up' ? theme.colors.emerald[600] : theme.colors.rose[600])};
`;

const TdWeight = styled(TdBase)`
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: ${theme.colors.slate[500]};
`;
