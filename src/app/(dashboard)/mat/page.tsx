'use client';

import Link from 'next/link';
import { useAccent } from '@/components/AccentProvider';
import { MOCK_MAT_SCHOOLS } from '@/lib/mockData';
import { ragColour } from '@/lib/risk';

const CATEGORIES = ['workload', 'support', 'leadership', 'belonging'] as const;

const RAG_BG: Record<'green' | 'amber' | 'red', string> = {
  green: 'rgba(61, 220, 151, 0.18)',
  amber: 'rgba(245, 158, 63, 0.18)',
  red: 'rgba(226, 75, 74, 0.20)',
};
const RAG_FG: Record<'green' | 'amber' | 'red', string> = {
  green: 'var(--color-success)',
  amber: 'var(--color-warning)',
  red: 'var(--color-danger)',
};

export default function MATDashboardPage() {
  const { trustName, schoolName } = useAccent();

  // Show the user's saved school name as the first school in the
  // trust heat map. The rest are demo placeholders to populate the grid.
  const schools = MOCK_MAT_SCHOOLS.map((s, i) =>
    i === 0 ? { ...s, name: schoolName } : s,
  );
  const avg = schools.reduce((s, x) => s + x.wellbeing, 0) / schools.length;
  const totalAtRisk = schools.reduce((s, x) => s + x.ectAtRisk, 0);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-muted">Trust overview</div>
          <h1 className="mt-1 font-display text-4xl text-text">{trustName}</h1>
          <p className="mt-2 text-sm text-text-muted">
            {schools.length} schools &middot; May 2026 pulse
          </p>
        </div>
        <button className="btn btn-primary">Export board report</button>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="card">
          <div className="text-xs uppercase tracking-wider text-text-muted">
            Trust average wellbeing
          </div>
          <div className="mt-3 metric text-5xl text-text">
            {avg.toFixed(1)}
            <span className="ml-2 text-base font-normal text-text-muted">/ 10</span>
          </div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wider text-text-muted">Schools reporting</div>
          <div className="mt-3 metric text-5xl text-text">{schools.length}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wider text-text-muted">ECTs at risk</div>
          <div className="mt-3 metric text-5xl text-danger">{totalAtRisk}</div>
        </div>
      </section>

      <section className="card overflow-hidden p-0">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-display text-xl text-text">School heat map</h2>
          <p className="mt-1 text-xs text-text-muted">
            RAG status per category &middot; click a school to drill in
          </p>
        </div>

        <table className="w-full text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="px-6 py-3 text-left font-normal">School</th>
              <th className="px-3 py-3 text-left font-normal">Wellbeing</th>
              {CATEGORIES.map((c) => (
                <th key={c} className="px-3 py-3 text-left font-normal capitalize">
                  {c}
                </th>
              ))}
              <th className="px-6 py-3 text-right font-normal">ECT risk</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((s) => (
              <tr
                key={s.id}
                className="border-b border-border last:border-0 hover:bg-surface-2"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard`}
                    className="font-display text-base text-text hover:text-primary-light"
                  >
                    {s.name}
                  </Link>
                </td>
                <td className="px-3 py-4 metric text-base text-text">
                  {s.wellbeing.toFixed(1)}
                </td>
                {CATEGORIES.map((c) => {
                  const v = s.categories[c];
                  const rag = ragColour(v);
                  return (
                    <td key={c} className="px-3 py-4">
                      <span
                        className="inline-flex h-8 w-12 items-center justify-center rounded-input text-sm font-medium"
                        style={{ background: RAG_BG[rag], color: RAG_FG[rag] }}
                      >
                        {v.toFixed(1)}
                      </span>
                    </td>
                  );
                })}
                <td className="px-6 py-4 text-right metric text-base text-text">
                  {s.ectAtRisk}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
