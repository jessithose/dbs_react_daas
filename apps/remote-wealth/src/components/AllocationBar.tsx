import styled from 'styled-components';
import type { Holding } from '../types';
import { theme } from '../styles/theme';

/**
 * Renders a simple horizontal stacked bar showing each asset class's share of
 * the portfolio by market value (a tiny SVG-less CSS bar — no chart dependency).
 * 用一个简单的水平堆叠条展示各资产类别在资产组合市值中的占比（轻量 CSS 实现，
 * 无需图表依赖）。样式使用 styled-components。
 */
export function AllocationBar({ portfolio }: { portfolio: Holding[] }) {
  const total = portfolio.reduce((sum, h) => sum + h.marketValue, 0);
  if (total <= 0) return null;

  const byClass = portfolio.reduce<Record<string, number>>((acc, h) => {
    acc[h.assetClass] = (acc[h.assetClass] ?? 0) + h.marketValue;
    return acc;
  }, {});

  const classes = Object.entries(byClass);
  // A consistent palette per asset class for readability.
  // 每个资产类别一个稳定的配色，便于阅读。
  const palette = ['#4f46e5', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <Wrap>
      <Track>
        {classes.map(([cls, value], i) => (
          <Segment
            key={cls}
            title={`${cls}: ${((value / total) * 100).toFixed(1)}%`}
            $width={`${(value / total) * 100}%`}
            $color={palette[i % palette.length]}
          />
        ))}
      </Track>
      <Legend>
        {classes.map(([cls, value], i) => (
          <LegendItem key={cls}>
            <Swatch $color={palette[i % palette.length]} />
            {cls} · {((value / total) * 100).toFixed(1)}%
          </LegendItem>
        ))}
      </Legend>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Track = styled.div`
  display: flex;
  height: 0.75rem;
  width: 100%;
  overflow: hidden;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.slate[100]};
`;

const Segment = styled.div<{ $width: string; $color: string }>`
  width: ${(p) => p.$width};
  background-color: ${(p) => p.$color};
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 0.25rem;
`;

const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${theme.colors.slate[600]};
`;

const Swatch = styled.span<{ $color: string }>`
  height: 0.625rem;
  width: 0.625rem;
  border-radius: 0.125rem;
  background: ${(p) => p.$color};
`;
