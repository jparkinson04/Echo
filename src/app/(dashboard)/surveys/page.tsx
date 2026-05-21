import Link from 'next/link';
import { MOCK_SURVEYS } from '@/lib/mockData';

export default function SurveysPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-muted">Surveys</div>
          <h1 className="mt-1 font-display text-4xl text-text">Monthly pulse</h1>
          <p className="mt-2 text-sm text-text-muted">
            One survey per month. Anonymous by design.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/surveys/methodology" className="btn btn-ghost">
            ✦ What we ask, and why
          </Link>
          <button className="btn btn-primary">New survey</button>
        </div>
      </header>

      <Link
        href="/surveys/methodology"
        className="flex items-start justify-between gap-6 rounded-card border px-6 py-5 transition-colors hover:opacity-90"
        style={{
          background: 'var(--color-pop-bg)',
          borderColor: 'var(--color-pop-bg)',
        }}
      >
        <div className="flex flex-col gap-1.5">
          <span className="pop-badge w-fit">✦ Methodology</span>
          <div className="font-display text-lg text-text">
            See what each question measures and why it&apos;s in here
          </div>
          <p className="max-w-2xl text-sm text-text-muted">
            The six categories, the retention research, the Ofsted angle, and the board-reporting
            rationale. Useful for SLT, governors, and anyone asking &ldquo;why these
            questions?&rdquo;
          </p>
        </div>
        <span
          className="mt-1 shrink-0 self-center font-display text-2xl"
          style={{ color: 'var(--color-pop-light)' }}
        >
          →
        </span>
      </Link>

      <div className="card flex flex-col divide-y divide-border p-0">
        {MOCK_SURVEYS.map((s) => (
          <Link
            key={s.id}
            href={`/surveys/${s.id}`}
            className="flex items-center justify-between px-6 py-5 hover:bg-surface-2"
          >
            <div className="flex flex-col gap-1">
              <span className="font-display text-lg text-text">{s.title}</span>
              <span className="text-xs text-text-muted">
                {s.status === 'active'
                  ? `Closes ${new Date(s.closes_at ?? '').toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                    })}`
                  : `Closed ${new Date(s.closes_at ?? '').toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                    })}`}
              </span>
            </div>
            <StatusPill status={s.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: 'draft' | 'active' | 'closed' }) {
  const map = {
    draft: { bg: 'rgba(255,255,255,0.06)', fg: 'var(--color-text-muted)', label: 'Draft' },
    active: { bg: 'rgba(27,110,243,0.18)', fg: 'var(--color-primary-light)', label: 'Active' },
    closed: { bg: 'rgba(255,255,255,0.04)', fg: 'var(--color-text-muted)', label: 'Closed' },
  } as const;
  const s = map[status];
  return (
    <span
      className="pill border-transparent"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}
