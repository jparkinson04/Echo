import type { CategoryScore } from '@/types';

interface CategoryBarChartProps {
  data: CategoryScore[];
  className?: string;
}

export function CategoryBarChart({ data, className = '' }: CategoryBarChartProps) {
  return (
    <div className={`card flex flex-col gap-5 ${className}`}>
      <div>
        <div className="text-xs uppercase tracking-wider text-text-muted">Category breakdown</div>
        <h3 className="mt-1 font-display text-xl text-text">How staff are feeling</h3>
      </div>

      <div className="flex flex-col gap-4">
        {data.map((row) => {
          const pct = Math.max(0, Math.min(100, (row.score / 10) * 100));
          return (
            <div key={row.category} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-text">{row.category}</span>
                <span className="metric text-base text-text">{row.score.toFixed(1)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-pill bg-surface-2">
                <div
                  className="h-full rounded-pill bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
