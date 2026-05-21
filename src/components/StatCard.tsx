import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  trend?: number[];
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaLabel = 'vs last month',
  trend,
  className = '',
}: StatCardProps) {
  const deltaPositive = delta !== undefined && delta > 0;
  const deltaNegative = delta !== undefined && delta < 0;
  const deltaText =
    delta !== undefined ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)}` : null;

  return (
    <div className={`card flex flex-col gap-4 ${className}`}>
      <div className="text-xs uppercase tracking-wider text-text-muted">{label}</div>

      <div className="flex items-baseline gap-2">
        <span className="metric text-5xl text-text">{value}</span>
        {unit && <span className="text-base text-text-muted">{unit}</span>}
      </div>

      <div className="flex items-center justify-between">
        {deltaText !== null ? (
          <span
            className={`text-sm font-medium ${
              deltaPositive ? 'text-success' : deltaNegative ? 'text-danger' : 'text-text-muted'
            }`}
          >
            {deltaPositive && '↑'}
            {deltaNegative && '↓'} {deltaText}
            <span className="ml-1 text-text-muted">{deltaLabel}</span>
          </span>
        ) : (
          <span />
        )}

        {trend && trend.length > 1 && <Sparkline values={trend} />}
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const w = 80;
  const h = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} className="text-primary-light">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
