interface RingChartProps {
  percent: number;
  label: string;
  caption?: string;
  className?: string;
}

export function RingChart({ percent, label, caption, className = '' }: RingChartProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className={`card flex flex-col gap-4 ${className}`}>
      <div className="text-xs uppercase tracking-wider text-text-muted">{label}</div>

      <div className="flex items-center gap-5">
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="var(--color-surface-2)"
            strokeWidth="12"
          />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="flex flex-col">
          <span className="metric text-4xl text-text">{Math.round(clamped)}%</span>
          {caption && <span className="mt-1 text-sm text-text-muted">{caption}</span>}
        </div>
      </div>
    </div>
  );
}
