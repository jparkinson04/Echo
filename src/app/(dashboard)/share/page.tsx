'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useAccent } from '@/components/AccentProvider';
import {
  ShareableGraphic,
  type ShareTemplate,
  type ShareableGraphicProps,
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

type SocialPlatform = 'linkedin' | 'x' | 'bluesky' | 'facebook';

export default function SharePage() {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [template, setTemplate] = useState<ShareTemplate>('hero');
  const [focusCategory, setFocusCategory] = useState<string>(MOCK_CATEGORIES[0].category);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const { logoDataUrl, orgName } = useAccent();

  const d = MOCK_DASHBOARD;

  const props: ShareableGraphicProps = useMemo(
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

  const caption = useMemo(() => buildCaption(props), [props]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('canShare' in navigator)) return;
    try {
      const probe = new File([new Blob(['x'])], 'probe.png', { type: 'image/png' });
      setCanNativeShare(Boolean(navigator.canShare?.({ files: [probe] })));
    } catch {
      setCanNativeShare(false);
    }
  }, []);

  function showStatus(msg: string) {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3200);
  }

  async function renderPng(): Promise<{ dataUrl: string; file: File }> {
    if (!ref.current) throw new Error('No ref');
    const dataUrl = await toPng(ref.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#0B1628',
      width: 1080,
      height: 1080,
    });
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `echo-${template}-may-2026.png`, { type: 'image/png' });
    return { dataUrl, file };
  }

  function triggerDownload(dataUrl: string) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `echo-${template}-may-2026.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function download() {
    setBusy(true);
    try {
      const { dataUrl } = await renderPng();
      triggerDownload(dataUrl);
    } finally {
      setBusy(false);
    }
  }

  async function shareNative() {
    setBusy(true);
    try {
      const { file } = await renderPng();
      if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${orgName} wellbeing update`,
          text: caption,
        });
        showStatus('Shared.');
      }
    } catch {
      // user cancelled, or platform refused — silent
    } finally {
      setBusy(false);
    }
  }

  async function shareToPlatform(platform: SocialPlatform) {
    setBusy(true);
    try {
      const { dataUrl } = await renderPng();
      triggerDownload(dataUrl);
      try {
        await navigator.clipboard.writeText(caption);
      } catch {
        // clipboard write may fail in some contexts — ignore
      }
      const composeUrl: Record<SocialPlatform, string> = {
        linkedin: 'https://www.linkedin.com/feed/?shareActive=true&mini=true',
        x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`,
        bluesky: `https://bsky.app/intent/compose?text=${encodeURIComponent(caption)}`,
        facebook: 'https://www.facebook.com/',
      };
      window.open(composeUrl[platform], '_blank', 'noopener,noreferrer');
      showStatus('Image downloaded, caption copied. Paste into the composer.');
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
            Pick a template, tweak the topic, then post it to your channels in one click.
          </p>
        </div>
        <button onClick={download} disabled={busy} className="btn btn-ghost">
          {busy ? 'Rendering…' : 'Download PNG'}
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
              <div className="font-display text-sm text-text">{t.label}</div>
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

      <section className="card flex flex-col gap-5">
        <div>
          <h2 className="font-display text-xl text-text">Post to your channels</h2>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            One click downloads the PNG, copies your caption, and opens the platform&apos;s
            composer in a new tab. On a phone or Mac you can share natively with the image
            attached. Direct API posting to LinkedIn or Facebook needs each platform&apos;s app
            approval and stores a login token, so we use the lighter web flow for now.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canNativeShare && (
            <button
              onClick={shareNative}
              disabled={busy}
              className="btn btn-pop disabled:cursor-not-allowed disabled:opacity-50"
            >
              ✦ Share via device
            </button>
          )}
          <PlatformButton
            label="LinkedIn"
            icon={<LinkedinIcon />}
            onClick={() => shareToPlatform('linkedin')}
            disabled={busy}
          />
          <PlatformButton
            label="X"
            icon={<XIcon />}
            onClick={() => shareToPlatform('x')}
            disabled={busy}
          />
          <PlatformButton
            label="Bluesky"
            icon={<BlueskyIcon />}
            onClick={() => shareToPlatform('bluesky')}
            disabled={busy}
          />
          <PlatformButton
            label="Facebook"
            icon={<FacebookIcon />}
            onClick={() => shareToPlatform('facebook')}
            disabled={busy}
          />
        </div>

        {statusMsg && (
          <div
            className="rounded-input border px-3 py-2 text-xs"
            style={{
              background: 'var(--color-pop-bg)',
              borderColor: 'var(--color-pop-bg)',
              color: 'var(--color-pop-light)',
            }}
          >
            ✦ {statusMsg}
          </div>
        )}

        <div className="rounded-input border border-border bg-surface-2 p-4">
          <div className="text-[10px] uppercase tracking-wider text-text-muted">
            Caption to paste
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-text">{caption}</p>
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

function buildCaption(props: ShareableGraphicProps): string {
  const wb = props.wellbeing.toFixed(1);
  const dArrow = props.delta > 0 ? '↑' : props.delta < 0 ? '↓' : '→';
  const dText = `${dArrow} ${Math.abs(props.delta).toFixed(1)} on last month`;

  switch (props.template) {
    case 'hero':
      return `Staff wellbeing at ${props.orgName} this month: ${wb}/10 (${dText}). ✦ Made with Echo.`;
    case 'category': {
      const cat =
        props.categories.find((c) => c.category === props.focusCategory) ??
        props.categories[0];
      return `Spotlight on ${cat.category.toLowerCase()} at ${props.orgName}: ${cat.score.toFixed(
        1,
      )}/10 from this month's anonymous pulse. ✦ Made with Echo.`;
    }
    case 'breakdown':
      return `Our six wellbeing categories at ${props.orgName} this month, ranked. ✦ Made with Echo.`;
    case 'trend':
      return `Six months of staff wellbeing at ${props.orgName}. ✦ Made with Echo.`;
    case 'response':
      return `${props.responseRate}% of our team at ${props.orgName} took five minutes to share how they're feeling this month. Thank you. ✦ Made with Echo.`;
    case 'shoutout':
      return `A staff shout-out from this month at ${props.orgName}. Submitted anonymously, shared with permission. ✦ Made with Echo.`;
  }
}

interface PlatformButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

function PlatformButton({ label, icon, onClick, disabled }: PlatformButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="flex h-4 w-4 items-center justify-center" aria-hidden>
        {icon}
      </span>
      {label}
    </button>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm-1.78 13.02H7.1V9H3.56v11.45zM22.22 0H1.77C.79 0 0 .78 0 1.74v20.51C0 23.21.79 24 1.77 24h20.45C23.2 24 24 23.21 24 22.25V1.74C24 .78 23.2 0 22.22 0z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21l-6.55 7.49L22 22h-6.86l-4.74-6.2L4.94 22H2.18l7.02-8.02L2 2h6.94l4.3 5.69L18.244 2zm-1.2 18h1.74L7.04 4H5.21l11.83 16z" />
    </svg>
  );
}

function BlueskyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M6.4 4.45c2.5 1.88 5.2 5.68 6.2 7.72 1-2.04 3.7-5.84 6.2-7.72 1.8-1.36 4.7-2.4 4.7.92 0 .66-.38 5.56-.6 6.36-.78 2.78-3.6 3.48-6.1 3.06 4.36.74 5.46 3.2 3.06 5.66-4.56 4.66-6.56-1.16-7.06-2.66l-.1-.32-.1.32c-.5 1.5-2.5 7.32-7.06 2.66-2.4-2.46-1.3-4.92 3.06-5.66-2.5.42-5.32-.28-6.1-3.06-.22-.8-.6-5.7-.6-6.36 0-3.32 2.9-2.28 4.7-.92z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.408.593 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.796.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.592 1.323-1.324V1.325C24 .593 23.408 0 22.675 0z" />
    </svg>
  );
}
