interface InsightCardProps {
  insight: string;
  recommendation?: string;
  className?: string;
}

export function InsightCard({ insight, recommendation, className = '' }: InsightCardProps) {
  return (
    <div
      className={`card flex flex-col gap-4 ${className}`}
      style={{ borderColor: 'var(--color-pop-bg)' }}
    >
      <span className="pop-badge w-fit">✦ New insight</span>

      <p className="font-display text-xl leading-snug text-text">{insight}</p>

      {recommendation && (
        <div className="rounded-input border border-border bg-surface-2 p-4">
          <div className="text-xs uppercase tracking-wider text-text-muted">Suggested action</div>
          <p className="mt-1 text-sm text-text">{recommendation}</p>
        </div>
      )}
    </div>
  );
}
