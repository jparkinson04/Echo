'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EchoMark } from '@/components/EchoMark';

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      <Header />
      <main className="relative z-10">
        <Hero />
        <TriptychSection />
        <HowItWorksTabs />
        <AudienceToggle />
        <EvidenceGrid />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
      <EchoMark size="md" />
      <nav className="flex items-center gap-2">
        <Link
          href="/surveys/methodology"
          className="hidden text-sm text-text-muted hover:text-text md:inline"
        >
          Methodology
        </Link>
        <Link href="/login" className="btn btn-ghost">
          Sign in
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 30%, var(--color-pop-bg), transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background:
            'radial-gradient(ellipse 90% 50% at 50% 0%, rgba(27,110,243,0.10), transparent 65%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-12 pb-24 text-center md:px-10 md:pt-20 md:pb-32">
        <PulsingEchoLogo />

        <h1 className="mt-12 max-w-4xl font-display text-5xl leading-[1.05] tracking-tight text-text md:text-7xl">
          Listen to your teachers.
          <br />
          <span className="text-text-muted">Keep them.</span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
          Most staff surveys leave you with a wall of data and no idea what to do with it. Echo
          listens to your teachers, shows you exactly how to improve your school, and turns the
          wins into newsletters, reports, and visuals ready to share with your staff, your board,
          and the wider community.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="btn btn-pop px-6 py-3 text-base"
          >
            ✦ See Echo in action
          </Link>
          <Link href="/onboarding" className="btn btn-ghost px-6 py-3 text-base">
            Set up your school
          </Link>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-wider text-text-subtle">
          <TrustItem label="Research-grounded" />
          <TrustItem label="Ofsted 2025 aligned" />
          <TrustItem label="ECT module included" />
          <TrustItem label="SWEMWBS-ready" />
        </div>
      </div>
    </section>
  );
}

function PulsingEchoLogo() {
  return (
    <div className="echo-pulse-wrap h-52 w-52 md:h-64 md:w-64">
      <span aria-hidden className="echo-pulse-ring" />
      <span aria-hidden className="echo-pulse-ring delay-1" />
      <span aria-hidden className="echo-pulse-ring delay-2" />

      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, var(--color-pop-bg) 0%, transparent 70%)',
        }}
      />

      <div
        aria-hidden
        className="relative flex items-center justify-center"
        style={{ animation: 'echo-glyph-breathe 3.4s ease-in-out infinite' }}
      >
        <span
          className="absolute rounded-full"
          style={{
            width: '128px',
            height: '128px',
            border: '1.5px solid var(--color-pop)',
            opacity: 0.28,
          }}
        />
        <span
          className="absolute rounded-full"
          style={{
            width: '80px',
            height: '80px',
            border: '2.5px solid var(--color-pop)',
            opacity: 0.65,
          }}
        />
        <span
          className="rounded-full"
          style={{
            width: '40px',
            height: '40px',
            background: 'var(--color-pop)',
            boxShadow: '0 0 32px rgba(0, 224, 144, 0.55), 0 0 64px rgba(0, 224, 144, 0.25)',
          }}
        />
      </div>
    </div>
  );
}

function TrustItem({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span style={{ color: 'var(--color-pop-light)' }}>✦</span>
      {label}
    </span>
  );
}

/* ----------------------- TRIPTYCH ----------------------- */

function TriptychSection() {
  return (
    <section className="relative border-y border-border bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--color-pop-bg), transparent)',
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-wider text-text-muted">
            The product, in one glance
          </span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl leading-tight text-text md:text-5xl">
            A monthly survey.
            <br />
            <span className="text-text-muted">Three outputs.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <InteractiveSurveyMock />
          <AnimatedDashboardMock />
          <RotatingShoutoutMock />
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-text-muted">
          Five minutes from a teacher becomes a board-ready scorecard and a newsletter the
          school is proud to send. Same data, three audiences, zero spreadsheets.
        </p>
      </div>
    </section>
  );
}

function InteractiveSurveyMock() {
  const [score, setScore] = useState<number | null>(4);

  return (
    <article className="card flex flex-col gap-4 transition-transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-text-muted">
        <span>For the teacher</span>
        <span>1 of 8 · Workload</span>
      </div>
      <h3 className="font-display text-lg leading-snug text-text">
        The volume of work I am expected to complete is manageable within my contracted hours.
      </h3>
      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = score === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setScore(n)}
              className={`flex aspect-square items-center justify-center rounded-input border text-sm font-medium transition-all ${
                active
                  ? 'scale-105 border-primary bg-primary text-white'
                  : 'border-border bg-surface-2 text-text-muted hover:scale-105 hover:bg-bg hover:text-text'
              }`}
              aria-pressed={active}
              aria-label={`Score ${n}`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-text-subtle">
        <span>Strongly disagree</span>
        <span>Strongly agree</span>
      </div>
      <div className="mt-2 rounded-input border border-border bg-surface-2 px-3 py-2 text-[11px] text-text-muted">
        {score
          ? `You picked ${score}. In a real wave, this stays anonymous — no name, no device.`
          : 'Tap a number. Five minutes for the whole pulse. No login.'}
      </div>
    </article>
  );
}

function AnimatedDashboardMock() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const domains: { label: string; target: number }[] = [
    { label: 'Workload', target: 62 },
    { label: 'Wellbeing', target: 71 },
    { label: 'Leadership', target: 82 },
    { label: 'Culture', target: 79 },
  ];

  return (
    <article
      className="card flex flex-col gap-4 transition-transform hover:-translate-y-0.5"
      style={{ background: 'var(--color-surface-2)' }}
    >
      <div className="text-[10px] uppercase tracking-wider text-text-muted">For the leader</div>
      <div>
        <div className="text-xs uppercase tracking-wider text-text-muted">Retention intention</div>
        <div className="mt-2 flex items-baseline gap-2">
          <AnimatedCount target={78} suffix="%" mounted={mounted} />
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--color-success)' }}
          >
            ↑ 4 pts
          </span>
        </div>
        <div className="mt-1 text-xs text-text-muted">favourable, vs 74% last term</div>
      </div>

      <div className="flex flex-col gap-2">
        {domains.map((d, i) => (
          <div key={d.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-text">{d.label}</span>
              <AnimatedCount
                target={d.target}
                mounted={mounted}
                className="metric text-xs text-text"
              />
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-pill bg-bg">
              <div
                className="h-full rounded-pill bg-primary"
                style={
                  mounted
                    ? ({
                        width: `${d.target}%`,
                        ['--bar-target' as string]: `${d.target}%`,
                        animation: `bar-grow 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s both`,
                      } as React.CSSProperties)
                    : { width: '0%' }
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-1 rounded-input border border-border bg-bg px-3 py-2 text-[11px] text-text-muted">
        7 evidence-based domains. SWEMWBS reported separately when enabled.
      </div>
    </article>
  );
}

function AnimatedCount({
  target,
  suffix = '',
  mounted,
  className = 'metric text-5xl text-text',
}: {
  target: number;
  suffix?: string;
  mounted: boolean;
  className?: string;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!mounted) return;
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted, target]);

  return (
    <span className={className}>
      {value}
      {suffix}
    </span>
  );
}

const SHOUTOUTS: { who: string; words: string }[] = [
  {
    who: 'For Mr Patel',
    words:
      'He covered three lessons last week, unprompted, when a colleague was unwell. Quiet kindness.',
  },
  {
    who: 'For Ms Reynolds',
    words:
      'She set up a new reading corner for Year 4 over half-term, in her own time. The kids haven’t stopped going to it.',
  },
  {
    who: 'For the office team',
    words:
      'They quietly fixed the parents’ evening sign-up in twenty minutes. We didn’t even know it was broken.',
  },
];

function RotatingShoutoutMock() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((cur) => (cur + 1) % SHOUTOUTS.length), 4200);
    return () => clearInterval(id);
  }, []);

  const item = SHOUTOUTS[i];

  return (
    <article
      className="card flex flex-col gap-4 overflow-hidden p-0 transition-transform hover:-translate-y-0.5"
      style={{ background: 'var(--color-surface)' }}
    >
      <div className="h-2 w-full" style={{ background: 'var(--color-pop)' }} />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            For the school
          </span>
          <span className="flex items-center gap-1">
            {SHOUTOUTS.map((_, idx) => (
              <span
                key={idx}
                className="h-1 w-1 rounded-pill transition-all"
                style={{
                  background:
                    idx === i ? 'var(--color-pop)' : 'var(--color-text-subtle)',
                  width: idx === i ? '10px' : '4px',
                }}
              />
            ))}
          </span>
        </div>
        <span className="pop-badge w-fit">✦ Staff spotlight</span>

        <div key={i} className="flex flex-col gap-2 animate-fade">
          <h3 className="font-display text-lg leading-snug text-text">{item.who}</h3>
          <p className="text-sm leading-relaxed text-text-muted">&ldquo;{item.words}&rdquo;</p>
        </div>

        <div className="mt-1 rounded-input border border-border bg-surface-2 px-3 py-2 text-[11px] text-text-muted">
          Auto-drafted. Editable. Brand-aware. Shareable.
        </div>
      </div>
    </article>
  );
}

/* ----------------------- HOW IT WORKS (tabbed) ----------------------- */

interface Step {
  key: 'listen' | 'understand' | 'share';
  step: string;
  title: string;
  body: string;
  points: string[];
}

const STEPS: Step[] = [
  {
    key: 'listen',
    step: '01',
    title: 'Listen',
    body:
      "A five-minute monthly pulse, anonymous by design. Tokenised links, no login, no device trail. Two retention-intent items are tracked at every wave as the headline signal.",
    points: [
      '5-point Likert and free text',
      'Reverse-scored items',
      '7 evidence-based domains',
      'ECT module and Exit survey',
    ],
  },
  {
    key: 'understand',
    step: '02',
    title: 'Understand',
    body:
      "When the wave closes, Echo computes domain scores, fires risk flags, and asks Claude for three actions grounded in the actual data. Diagnostic prompts surface automatically on domains in emerging risk.",
    points: [
      '0–100 domain index',
      '8 risk-flag rules',
      'AI action recommendations',
      'Bimodal-pattern detection',
    ],
  },
  {
    key: 'share',
    step: '03',
    title: 'Share',
    body:
      "Newsletter drafts itself from the data and consented qualitative responses. A shareable PNG goes to LinkedIn in your school's brand. The board pack PDF is one click. So is the Ofsted evidence pack.",
    points: [
      'Auto-drafted newsletter',
      'Shareable social graphic',
      'Board pack PDF export',
      'Ofsted staff voice pack',
    ],
  },
];

function HowItWorksTabs() {
  const [active, setActive] = useState<Step['key']>('listen');
  const step = STEPS.find((s) => s.key === active)!;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-28">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs uppercase tracking-wider text-text-muted">How it works</span>
        <h2 className="mt-2 font-display text-3xl leading-tight text-text md:text-5xl">
          Listen. Understand. Share.
        </h2>
      </div>

      <div className="mx-auto mb-8 flex w-fit items-center gap-1 rounded-pill border border-border bg-surface p-1">
        {STEPS.map((s) => {
          const isActive = s.key === active;
          return (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`flex items-center gap-2 rounded-pill px-4 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-pop text-white'
                  : 'text-text-muted hover:text-text'
              }`}
              style={isActive ? { background: 'var(--color-pop)' } : undefined}
            >
              <span className="font-mono text-[10px] opacity-70">{s.step}</span>
              {s.title}
            </button>
          );
        })}
      </div>

      <div key={active} className="mx-auto max-w-4xl animate-fade">
        <div className="card grid grid-cols-1 gap-8 md:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-4">
            <span
              className="font-display text-7xl leading-none"
              style={{ color: 'var(--color-pop)' }}
            >
              ✦
            </span>
            <h3 className="font-display text-3xl text-text">{step.title}</h3>
            <p className="text-base leading-relaxed text-text-muted">{step.body}</p>
          </div>
          <ul className="flex flex-col gap-2">
            {step.points.map((p) => (
              <li
                key={p}
                className="flex items-center gap-3 rounded-input border border-border bg-surface-2 px-4 py-3 text-sm text-text"
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-pill"
                  style={{ background: 'var(--color-pop-light)' }}
                />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- AUDIENCE TOGGLE ----------------------- */

interface Audience {
  key: 'mat' | 'head';
  tag: string;
  role: string;
  headline: string;
  body: string;
  bullets: string[];
  cta: string;
  href: string;
}

const AUDIENCES: Audience[] = [
  {
    key: 'mat',
    tag: 'For the buyer',
    role: 'MAT executives & trust boards',
    headline: 'A defensible scorecard, not another spreadsheet.',
    body: "One trust-wide heat map across every school and every domain. RAG dots, outlier detection, ECT retention by school, and a one-click board pack PDF formatted for trustee meetings.",
    bullets: [
      'Trust-wide benchmarking across schools',
      'Anonymised peer benchmarks when N≥10',
      'Board pack PDF export',
      'Ofsted Staff Voice Evidence pack',
    ],
    cta: 'See the MAT view →',
    href: '/mat',
  },
  {
    key: 'head',
    tag: 'For the operator',
    role: 'Headteachers & SLT',
    headline: 'A morning briefing. Not a research project.',
    body: "Your school's domain scores, the items that are actually moving, three AI-suggested actions grounded in the data, and an ECT risk register that pages you before someone resigns.",
    bullets: [
      'Six-domain dashboard + retention metric',
      'AI action plan grounded in this wave',
      'ECT amber/red register with resolution flow',
      'Newsletter drafted from consented voice',
    ],
    cta: 'See the headteacher view →',
    href: '/dashboard',
  },
];

function AudienceToggle() {
  const [active, setActive] = useState<Audience['key']>('mat');
  const audience = AUDIENCES.find((a) => a.key === active)!;

  return (
    <section className="relative border-y border-border bg-surface">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-wider text-text-muted">Built for two roles</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl leading-tight text-text md:text-5xl">
            The buyer and the operator
            <br />
            need different things.
          </h2>
        </div>

        <div className="mx-auto mb-8 flex w-fit items-center gap-1 rounded-pill border border-border bg-bg p-1">
          {AUDIENCES.map((a) => {
            const isActive = a.key === active;
            return (
              <button
                key={a.key}
                onClick={() => setActive(a.key)}
                className={`rounded-pill px-5 py-2 text-sm transition-colors ${
                  isActive ? 'text-white' : 'text-text-muted hover:text-text'
                }`}
                style={isActive ? { background: 'var(--color-primary)' } : undefined}
              >
                {a.tag.replace('For the ', "I'm a ")}
              </button>
            );
          })}
        </div>

        <div key={active} className="mx-auto max-w-4xl animate-fade">
          <article
            className="card flex flex-col gap-5"
            style={{ background: 'var(--color-surface-2)' }}
          >
            <div className="flex items-center justify-between">
              <span className="pop-badge">✦ {audience.tag}</span>
              <span className="text-xs uppercase tracking-wider text-text-muted">{audience.role}</span>
            </div>
            <h3 className="font-display text-2xl leading-tight text-text md:text-3xl">
              {audience.headline}
            </h3>
            <p className="text-base leading-relaxed text-text-muted">{audience.body}</p>
            <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {audience.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 rounded-input border border-border bg-bg px-3 py-2 text-sm text-text"
                >
                  <span
                    className="mt-1 inline-block h-1 w-1 shrink-0 rounded-pill"
                    style={{ background: 'var(--color-primary-light)' }}
                  />
                  {b}
                </li>
              ))}
            </ul>
            <Link href={audience.href} className="btn btn-ghost w-fit">
              {audience.cta}
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- EVIDENCE GRID ----------------------- */

function EvidenceGrid() {
  const domains: { name: string; anchor: string; ofsted: string }[] = [
    {
      name: 'Workload',
      anchor: 'DfE Working Lives — top driver of leaving',
      ofsted: 'Leadership & Governance: staff sustainability',
    },
    {
      name: 'Wellbeing',
      anchor: 'Teacher Wellbeing Index 2025: 78% of staff stressed',
      ofsted: 'Wellbeing evaluation area',
    },
    {
      name: 'Leadership & Voice',
      anchor: '"Views not valued" cited as #1 stress factor',
      ofsted: 'Meaningful engagement with staff at all levels',
    },
    {
      name: 'Culture, Recognition & Belonging',
      anchor: 'TWIX: 50% say culture harms mental health',
      ofsted: 'Culture and inclusion',
    },
    {
      name: 'Pupil Behaviour & Safety',
      anchor: 'TWIX: 63% report rising behaviour incidents',
      ofsted: 'Behaviour and attendance',
    },
    {
      name: 'Growth, Autonomy & Career',
      anchor: 'Autonomy and development remain top stayers (DfE)',
      ofsted: 'Leadership & Governance: staff development',
    },
    {
      name: 'ECT Module',
      anchor: '30–33% of teachers leave within 5 years',
      ofsted: 'Inclusion and wellbeing of staff',
    },
  ];

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-160px] top-20 h-[380px] w-[380px] opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(27,110,243,0.15), transparent 65%)',
        }}
      />

      <div className="relative mb-10 flex flex-col items-center text-center">
        <span className="text-xs uppercase tracking-wider text-text-muted">
          Built on the evidence
        </span>
        <h2 className="mt-2 max-w-2xl font-display text-3xl leading-tight text-text md:text-5xl">
          Seven domains. Every one earns its place.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
          Each item maps to a documented attrition factor in UK research, an Ofsted 2025 evaluation
          area, and a typical MAT board KPI. No padding, no marketing.
        </p>
      </div>

      <div className="relative grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {domains.map((d, i) => (
          <article
            key={d.name}
            className="card flex flex-col gap-2.5 transition-all hover:-translate-y-0.5 hover:border-pop"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-text-subtle">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ color: 'var(--color-pop-light)' }}>✦</span>
            </div>
            <h3 className="font-display text-lg leading-tight text-text">{d.name}</h3>
            <p className="text-xs leading-relaxed text-text-muted">{d.anchor}</p>
            <p
              className="mt-1 border-t border-border pt-2 text-[11px] leading-relaxed text-text-subtle"
            >
              <span style={{ color: 'var(--color-pop-light)' }}>✦</span> {d.ofsted}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/surveys/methodology"
          className="text-sm text-text-muted hover:text-text"
        >
          Read the full methodology →
        </Link>
      </div>
    </section>
  );
}

/* ----------------------- FINAL CTA ----------------------- */

function FinalCta() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
      <div
        className="relative overflow-hidden rounded-card border px-8 py-14 md:px-14 md:py-20"
        style={{
          background: 'var(--color-pop-bg)',
          borderColor: 'var(--color-pop-bg)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 h-[300px] w-[300px] opacity-60"
          style={{
            background: 'radial-gradient(circle, var(--color-pop-bg), transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 h-[300px] w-[300px] opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(27,110,243,0.18), transparent 70%)',
          }}
        />

        <div className="relative flex flex-col items-start gap-6 md:max-w-2xl">
          <span className="pop-badge">✦ Set up takes ten minutes</span>
          <h2 className="font-display text-3xl leading-tight text-text md:text-5xl">
            Stop losing the teachers
            <br />
            you can&apos;t afford to lose.
          </h2>
          <p className="text-base leading-relaxed text-text-muted">
            Echo runs your first monthly pulse, generates the dashboard, drafts the newsletter, and
            assembles the board pack. The first wave is up before half term.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/onboarding" className="btn btn-pop px-6 py-3 text-base">
              Set up your school
            </Link>
            <Link href="/dashboard" className="btn btn-ghost px-6 py-3 text-base">
              See the demo first
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mx-auto w-full max-w-7xl border-t border-border px-6 py-8 text-xs text-text-subtle md:px-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <EchoMark size="sm" />
          <span>Built for UK schools and Multi-Academy Trusts.</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/surveys/methodology" className="hover:text-text">
            Methodology
          </Link>
          <Link href="/login" className="hover:text-text">
            Sign in
          </Link>
          <span>© Echo 2026</span>
        </div>
      </div>
    </footer>
  );
}
