import type { RiskStatus } from '@/types';

interface ECTStatusPillProps {
  status: RiskStatus;
  className?: string;
}

const LABELS: Record<RiskStatus, string> = {
  on_track: 'On track',
  watch: 'Watch',
  at_risk: 'At risk',
};

export function ECTStatusPill({ status, className = '' }: ECTStatusPillProps) {
  const styles: Record<RiskStatus, { bg: string; fg: string; dot: string }> = {
    on_track: {
      bg: 'rgba(61, 220, 151, 0.12)',
      fg: 'var(--color-success)',
      dot: 'var(--color-success)',
    },
    watch: {
      bg: 'rgba(245, 158, 63, 0.12)',
      fg: 'var(--color-warning)',
      dot: 'var(--color-warning)',
    },
    at_risk: {
      bg: 'rgba(226, 75, 74, 0.12)',
      fg: 'var(--color-danger)',
      dot: 'var(--color-danger)',
    },
  };
  const s = styles[status];

  return (
    <span
      className={`pill border-transparent ${className}`}
      style={{ background: s.bg, color: s.fg }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-pill"
        style={{ background: s.dot }}
      />
      {LABELS[status]}
    </span>
  );
}
