import Link from 'next/link';
import { ECTStatusPill } from '@/components/ECTStatusPill';
import { MOCK_ECTS } from '@/lib/mockData';

const TREND_ICON = { up: '↑', flat: '→', down: '↓' } as const;
const TREND_COLOUR = {
  up: 'text-success',
  flat: 'text-text-muted',
  down: 'text-danger',
} as const;

export default function ECTPage() {
  const ects = MOCK_ECTS;
  const onTrack = ects.filter((e) => e.status === 'on_track').length;
  const watch = ects.filter((e) => e.status === 'watch').length;
  const atRisk = ects.filter((e) => e.status === 'at_risk').length;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-muted">ECT tracker</div>
          <h1 className="mt-1 font-display text-4xl text-text">Early career teachers</h1>
          <p className="mt-2 text-sm text-text-muted">
            Fortnightly check-ins. Tokenised links. No login for ECTs.
          </p>
        </div>
        <button className="btn btn-primary">Send check-in</button>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <SummaryCard label="On track" value={onTrack} accent="success" />
        <SummaryCard label="Watch" value={watch} accent="warning" />
        <SummaryCard label="At risk" value={atRisk} accent="danger" />
      </section>

      <section className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="px-6 py-3 text-left font-normal">ECT</th>
              <th className="px-3 py-3 text-left font-normal">Cohort</th>
              <th className="px-3 py-3 text-left font-normal">Mood</th>
              <th className="px-3 py-3 text-left font-normal">Trend</th>
              <th className="px-3 py-3 text-left font-normal">Last check-in</th>
              <th className="px-6 py-3 text-right font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {ects.map((e) => (
              <tr
                key={e.id}
                className="border-b border-border last:border-0 hover:bg-surface-2"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/ect/${e.id}`}
                    className="font-display text-base text-text hover:text-primary-light"
                  >
                    {e.name}
                  </Link>
                </td>
                <td className="px-3 py-4 text-text-muted">{e.cohort}</td>
                <td className="px-3 py-4 metric text-base text-text">{e.mood.toFixed(1)}</td>
                <td className={`px-3 py-4 ${TREND_COLOUR[e.trend]}`}>{TREND_ICON[e.trend]}</td>
                <td className="px-3 py-4 text-text-muted">{e.lastCheckin}</td>
                <td className="px-6 py-4 text-right">
                  <ECTStatusPill status={e.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: 'success' | 'warning' | 'danger';
}) {
  const map = {
    success: { c: 'var(--color-success)' },
    warning: { c: 'var(--color-warning)' },
    danger: { c: 'var(--color-danger)' },
  };
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wider text-text-muted">{label}</div>
      <div className="mt-3 metric text-5xl" style={{ color: map[accent].c }}>
        {value}
      </div>
    </div>
  );
}
