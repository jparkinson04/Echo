import Link from 'next/link';
import { MOCK_NEWSLETTERS } from '@/lib/mockData';

export default function NewsletterPage() {
  const newsletters = MOCK_NEWSLETTERS;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-muted">Newsletters</div>
          <h1 className="mt-1 font-display text-4xl text-text">Your monthly newsletter</h1>
          <p className="mt-2 max-w-xl text-sm text-text-muted">
            Auto-drafted from your survey, brand-aware, ready to share with staff or the world.
          </p>
        </div>
        <Link href="/newsletter/nl-may-2026" className="btn btn-pop">
          ✦ Generate newsletter
        </Link>
      </header>

      <div className="card flex flex-col divide-y divide-border p-0">
        {newsletters.map((n) => (
          <Link
            key={n.id}
            href={`/newsletter/${n.id}`}
            className="flex items-center justify-between px-6 py-5 hover:bg-surface-2"
          >
            <div className="flex flex-col gap-1">
              <span className="font-display text-lg text-text">{n.title}</span>
              <span className="text-xs text-text-muted">
                {n.month} &middot;{' '}
                {n.status === 'draft' ? 'Draft, ready to edit' : 'Sent'}
              </span>
            </div>
            <span
              className="pill border-transparent"
              style={
                n.status === 'draft'
                  ? { background: 'var(--color-pop-bg)', color: 'var(--color-pop-light)' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-muted)' }
              }
            >
              {n.status === 'draft' ? '✦ Draft' : 'Sent'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
