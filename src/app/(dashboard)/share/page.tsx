'use client';

import { useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useAccent } from '@/components/AccentProvider';
import {
  ShareableGraphic,
  type ShareTemplate,
} from '@/components/ShareableGraphic';
import {
  MOCK_CATEGORIES,
  MOCK_CATEGORY_TRENDS,
  MOCK_DASHBOARD,
  MOCK_SUBMISSION,
} from '@/lib/mockData';

interface TemplateOption {
  id: ShareTemplate;
  label: string;
  description: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'hero',
    label: 'Overall wellbeing',
    description: 'The headline number. Best for a monthly recap post.',
  },
  {
    id: 'category',
    label: 'Topic spotlight',
    description: 'Zoom in on one area like belonging or workload.',
  },
  {
    id: 'breakdown',
    label: 'Full breakdown',
    description: 'All six categories at a glance, ranked.',
  },
  {
    id: 'trend',
    label: 'Six-month trend',
    description: 'Show momentum with a line chart of overall wellbeing.',
  },
  {
    id: 'response',
    label: 'Response rate',
    description: 'Celebrate participation. Donut chart with count.',
  },
  {
    id: 'shoutout',
    label: 'Recognition',
    description: 'A staff shout-out, framed for sharing.',
  },
];

export default function SharePage() {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [template, setTemplate] = useState<ShareTemplate>('hero');
  const [focusCategory, setFocusCategory] = useState<string>(MOCK_CATEGORIES[0].category);
  const { logoDataUrl, orgName } = useAccent();

  const d = MOCK_DASHBOARD;

  const props = useMemo(
    () => ({
      template,
      orgName,
      month: 'May 2026',
      wellbeing: d.wellbeing_score,
      delta: d.wellbeing_delta,
      trend: d.wellbeing_trend,
      responseRate: d.response_rate,
      responded: d.responded,
      totalStaff: d.total_staff,
      categories: MOCK_CATEGORIES,
      categoryTrends: MOCK_CATEGORY_TRENDS,
      focusCategory,
      shoutout: {
        nominee: MOCK_SUBMISSION.nominee_name,
        content: MOCK_SUBMISSION.content,
      },
      logoDataUrl,
    }),
    [template, focusCategory, d, logoDataUrl, orgName],
  );

  async function download() {
    if (!ref.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0B1628',
        width: 1080,
        height: 1080,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `echo-${template}-may-2026.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-muted">Share</div>
          <h1 className="mt-1 font-display text-4xl text-text">Shareable graphics</h1>
          <p className="mt-2 max-w-xl text-sm text-text-muted">
            Pick a template, tweak the topic, download a square PNG ready for LinkedIn, your
            school website, or the staffroom screen.
          </p>
        </div>
        <button onClick={download} disabled={busy} className="btn btn-pop">
          {busy ? 'Rendering…' : '✦ Download PNG'}
        </button>
      </header>

      <section className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-6">
        {TEMPLATES.map((t) => {
          const active = t.id === template;
          return (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`flex flex-col gap-1.5 rounded-card border p-4 text-left transition-colors ${
                active
                  ? 'border-pop bg-pop-bg'
                  : 'border-border bg-surface hover:bg-surface-2'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-text-muted">
                Template
              </div>
              <div
                className={`font-display text-sm ${active ? 'text-text' : 'text-text'}`}
              >
                {t.label}
              </div>
              <div className="text-[11px] leading-snug text-text-muted">
                {t.description}
              </div>
            </button>
          );
        })}
      </section>

      {template === 'category' && (
        <section className="card flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-text-muted">Topic</div>
              <div className="mt-1 font-display text-lg text-text">
                Which area do you want to spotlight?
              </div>
            </div>
            <select
              value={focusCategory}
              onChange={(e) => setFocusCategory(e.target.value)}
              className="input max-w-xs"
            >
              {MOCK_CATEGORIES.map((c) => (
                <option key={c.category} value={c.category}>
                  {c.category} ({c.score.toFixed(1)})
                </option>
              ))}
            </select>
          </div>
        </section>
      )}

      <section className="card flex justify-center overflow-auto p-6">
        <div
          style={{
            width: 1080 * 0.5,
            height: 1080 * 0.5,
            position: 'relative',
          }}
        >
          <div
            style={{
              transform: 'scale(0.5)',
              transformOrigin: 'top left',
              width: 1080,
              height: 1080,
            }}
          >
            <ShareableGraphic ref={ref} {...props} />
          </div>
        </div>
      </section>

      <section className="card flex flex-col gap-3">
        <h2 className="font-display text-xl text-text">Where to share it</h2>
        <ul className="flex flex-col gap-2 text-sm text-text-muted">
          <li>• LinkedIn post. Tag your trust, the wellbeing community, and the local authority.</li>
          <li>• School website. Paste into your monthly update or wellbeing page.</li>
          <li>• Staffroom screen. Let staff see the number they helped create.</li>
        </ul>
      </section>
    </div>
  );
}
