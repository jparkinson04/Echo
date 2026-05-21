import { forwardRef, type CSSProperties } from 'react';

export type ShareTemplate =
  | 'hero'
  | 'category'
  | 'breakdown'
  | 'trend'
  | 'response'
  | 'shoutout';

export interface ShareableGraphicProps {
  template: ShareTemplate;
  orgName: string;
  month: string;
  wellbeing: number;
  delta: number;
  trend: number[];
  responseRate: number;
  responded: number;
  totalStaff: number;
  categories: { category: string; score: number }[];
  categoryTrends: Record<string, number[]>;
  focusCategory?: string;
  shoutout?: { nominee?: string | null; content: string };
  logoDataUrl?: string | null;
  className?: string;
}

const SIZE = 1080;

const SYNE = "'Syne', sans-serif";
const DM = "'DM Sans', sans-serif";

const frame: CSSProperties = {
  width: SIZE,
  height: SIZE,
  background: '#0B1628',
  color: '#FFFFFF',
  fontFamily: DM,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  padding: '88px 88px 64px',
};

export const ShareableGraphic = forwardRef<HTMLDivElement, ShareableGraphicProps>(
  function ShareableGraphic(props, ref) {
    return (
      <div ref={ref} className={props.className} style={frame}>
        <Glow />
        <Stripe />

        <Header
          orgName={props.orgName}
          month={props.month}
          template={props.template}
          logoDataUrl={props.logoDataUrl}
        />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            paddingTop: 24,
            paddingBottom: 24,
          }}
        >
          {props.template === 'hero' && <HeroBody {...props} />}
          {props.template === 'category' && <CategoryBody {...props} />}
          {props.template === 'breakdown' && <BreakdownBody {...props} />}
          {props.template === 'trend' && <TrendBody {...props} />}
          {props.template === 'response' && <ResponseBody {...props} />}
          {props.template === 'shoutout' && <ShoutoutBody {...props} />}
        </div>

        <Footer />
      </div>
    );
  },
);

function Glow() {
  return (
    <div
      style={{
        position: 'absolute',
        top: -260,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 720,
        height: 720,
        borderRadius: '50%',
        background: 'var(--color-pop)',
        opacity: 0.16,
        filter: 'blur(60px)',
      }}
    />
  );
}

function Stripe() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 14,
        background: 'var(--color-pop)',
      }}
    />
  );
}

function Header({
  orgName,
  month,
  template,
  logoDataUrl,
}: {
  orgName: string;
  month: string;
  template: ShareTemplate;
  logoDataUrl?: string | null;
}) {
  const title: Record<ShareTemplate, string> = {
    hero: 'Wellbeing report',
    category: 'Category focus',
    breakdown: 'Category breakdown',
    trend: 'Six-month trend',
    response: 'Voices heard',
    shoutout: 'Recognition',
  };

  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <BrandMark />
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 16,
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: '-0.005em',
          color: '#FFFFFF',
        }}
      >
        {logoDataUrl && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.10)',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoDataUrl}
              alt={`${orgName} logo`}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
            />
          </span>
        )}
        <span>{orgName}</span>
      </div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 16,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
        }}
      >
        <span>{month}</span>
        <span style={{ color: 'var(--color-pop)' }}>•</span>
        <span>{title[template]}</span>
      </div>
    </header>
  );
}

function BrandMark() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--color-pop-bg)',
        border: '1px solid var(--color-pop-bg)',
        borderRadius: 999,
        padding: '8px 18px',
      }}
    >
      <span
        style={{
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 18,
          color: 'var(--color-pop)',
        }}
      >
        ✦
      </span>
      <span
        style={{
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '0.12em',
          color: 'var(--color-pop-light)',
          textTransform: 'uppercase',
        }}
      >
        Echo
      </span>
    </div>
  );
}

function Footer() {
  return (
    <div
      style={{
        textAlign: 'center',
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <span style={{ color: 'var(--color-pop)', marginRight: 8 }}>✦</span>
      Made with Echo
    </div>
  );
}

function DeltaBadge({ delta }: { delta: number }) {
  const positive = delta > 0;
  const negative = delta < 0;
  const colour = positive ? '#3DDC97' : negative ? '#E24B4A' : 'rgba(255,255,255,0.55)';
  const arrow = positive ? '↑' : negative ? '↓' : '→';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 999,
        padding: '10px 18px',
        fontFamily: SYNE,
        fontWeight: 700,
        fontSize: 22,
        color: colour,
      }}
    >
      {arrow} {positive ? '+' : ''}
      {delta.toFixed(1)}
      <span
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontWeight: 500,
          fontFamily: DM,
          fontSize: 16,
        }}
      >
        vs last month
      </span>
    </span>
  );
}

function HeroBody(props: ShareableGraphicProps) {
  return (
    <>
      <div
        style={{
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 320,
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
        }}
      >
        {props.wellbeing.toFixed(1)}
        <span
          style={{ fontSize: 120, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}
        >
          /10
        </span>
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 32,
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        Overall staff wellbeing
      </div>
      <div style={{ marginTop: 20 }}>
        <DeltaBadge delta={props.delta} />
      </div>
    </>
  );
}

function CategoryBody(props: ShareableGraphicProps) {
  const focus =
    props.categories.find((c) => c.category === props.focusCategory) ?? props.categories[0];
  const trend = props.categoryTrends[focus.category] ?? props.trend;
  const start = trend[0];
  const delta = focus.score - start;

  return (
    <>
      <div
        style={{
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 28,
          color: 'rgba(255,255,255,0.7)',
          marginBottom: 12,
        }}
      >
        {focus.category}
      </div>
      <div
        style={{
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 280,
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
        }}
      >
        {focus.score.toFixed(1)}
        <span style={{ fontSize: 100, color: 'rgba(255,255,255,0.4)' }}>/10</span>
      </div>
      <div style={{ marginTop: 32 }}>
        <Sparkline values={trend} width={520} height={120} accent />
      </div>
      <div style={{ marginTop: 16 }}>
        <DeltaBadge delta={parseFloat(delta.toFixed(1))} />
      </div>
    </>
  );
}

function BreakdownBody(props: ShareableGraphicProps) {
  const sorted = [...props.categories].sort((a, b) => b.score - a.score);
  return (
    <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div
        style={{
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 40,
          textAlign: 'left',
          marginBottom: 8,
        }}
      >
        How we&apos;re feeling
      </div>
      {sorted.map((c) => {
        const pct = Math.max(4, Math.min(100, (c.score / 10) * 100));
        return (
          <div key={c.category} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 500, color: '#FFFFFF' }}>
                {c.category}
              </span>
              <span style={{ fontFamily: SYNE, fontWeight: 700, fontSize: 28 }}>
                {c.score.toFixed(1)}
              </span>
            </div>
            <div
              style={{
                height: 12,
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background:
                    c.score >= 7
                      ? 'var(--color-pop)'
                      : c.score >= 5
                        ? 'var(--color-pop-light)'
                        : 'rgba(255,255,255,0.35)',
                  borderRadius: 999,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrendBody(props: ShareableGraphicProps) {
  return (
    <>
      <div
        style={{
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 220,
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
        }}
      >
        {props.wellbeing.toFixed(1)}
      </div>
      <div
        style={{
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 24,
          color: 'rgba(255,255,255,0.7)',
          marginTop: 8,
        }}
      >
        Where we are right now
      </div>
      <div style={{ marginTop: 36 }}>
        <Sparkline
          values={props.trend}
          width={780}
          height={220}
          accent
          showLabels
        />
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 18,
          color: 'rgba(255,255,255,0.6)',
          fontWeight: 500,
          letterSpacing: '0.06em',
        }}
      >
        SIX MONTHS OF MONTHLY LISTENING
      </div>
    </>
  );
}

function ResponseBody(props: ShareableGraphicProps) {
  const pct = Math.round(props.responseRate);
  const size = 460;
  const r = 200;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;

  return (
    <>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="32"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-pop)"
            strokeWidth="32"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={off}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontFamily: SYNE,
              fontWeight: 700,
              fontSize: 160,
              lineHeight: 1,
            }}
          >
            {pct}%
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 32,
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 32,
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        {props.responded} of {props.totalStaff} voices heard
      </div>
    </>
  );
}

function ShoutoutBody(props: ShareableGraphicProps) {
  const quote =
    props.shoutout?.content ??
    'No shout-out captured this month. Add one in the staff voice queue.';
  const name = props.shoutout?.nominee;
  return (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div
        style={{
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 220,
          color: 'var(--color-pop)',
          lineHeight: 0.6,
        }}
      >
        “
      </div>
      <div
        style={{
          fontFamily: SYNE,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.25,
          color: '#FFFFFF',
        }}
      >
        {quote}
      </div>
      {name && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--color-pop-bg)',
            color: 'var(--color-pop-light)',
            padding: '10px 22px',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          ✦ For {name}
        </div>
      )}
    </div>
  );
}

interface SparklineProps {
  values: number[];
  width: number;
  height: number;
  accent?: boolean;
  showLabels?: boolean;
}

function Sparkline({ values, width, height, accent, showLabels }: SparklineProps) {
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 10);
  const range = max - min || 1;
  const padX = 12;
  const padY = 18;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const points = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * innerW;
    const y = padY + innerH - ((v - min) / range) * innerH;
    return { x, y, v };
  });
  const lineColour = accent ? 'var(--color-pop)' : '#1B6EF3';
  const fillColour = accent ? 'var(--color-pop-bg)' : 'rgba(27,110,243,0.16)';
  const last = points[points.length - 1];

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColour} stopOpacity="0.35" />
          <stop offset="100%" stopColor={lineColour} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M ${points[0].x} ${height - padY} L ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} L ${last.x} ${height - padY} Z`}
        fill="url(#spark-fill)"
      />
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={lineColour}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === points.length - 1 ? 10 : 5}
          fill={i === points.length - 1 ? lineColour : '#0B1628'}
          stroke={lineColour}
          strokeWidth={i === points.length - 1 ? 0 : 3}
        />
      ))}
      {showLabels &&
        points.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.x}
            y={p.y - 16}
            textAnchor="middle"
            fontFamily={SYNE}
            fontWeight="700"
            fontSize="14"
            fill="rgba(255,255,255,0.55)"
          >
            {p.v.toFixed(1)}
          </text>
        ))}
      <rect x={0} y={0} width={width} height={height} fill={fillColour} opacity={0} />
    </svg>
  );
}
