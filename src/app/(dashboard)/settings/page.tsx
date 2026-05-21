'use client';

import { useAccent } from '@/components/AccentProvider';
import { ACCENT_PRESETS } from '@/lib/accent';

export default function SettingsPage() {
  const { accentHex, setAccentHex, role } = useAccent();
  const canEditAccent = role === 'mat_admin';

  return (
    <div className="flex flex-col gap-8">
      <header>
        <div className="text-xs uppercase tracking-wider text-text-muted">Settings</div>
        <h1 className="mt-1 font-display text-4xl text-text">
          {canEditAccent ? 'Your trust' : 'Your school'}
        </h1>
      </header>

      <section className="card flex flex-col gap-5">
        <h2 className="font-display text-xl text-text">Profile</h2>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-muted">
            {canEditAccent ? 'Trust name' : 'School name'}
          </span>
          <input
            className="input"
            defaultValue={canEditAccent ? 'Northstar Learning Trust' : 'Greenfield Primary'}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-muted">Logo</span>
          <button className="btn btn-ghost w-fit">Upload logo</button>
        </label>
      </section>

      <section className="card flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl text-text">Accent colour</h2>
            <p className="mt-1 max-w-xl text-sm text-text-muted">
              {canEditAccent
                ? 'Used across every school in your trust. Newsletters, recognition cards, and shareable graphics will all pick this up.'
                : 'Set by your trust. All schools in Northstar Learning Trust use the same accent so the brand stays consistent.'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className="h-10 w-10 rounded-pill border border-border"
              style={{ background: accentHex }}
            />
            <span className="font-mono text-[11px] text-text-muted">{accentHex}</span>
          </div>
        </div>

        {canEditAccent ? (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {ACCENT_PRESETS.map((p) => {
                const active = p.hex.toUpperCase() === accentHex.toUpperCase();
                return (
                  <button
                    key={p.hex}
                    onClick={() => setAccentHex(p.hex)}
                    className={`flex items-center gap-3 rounded-input border p-3 transition-colors ${
                      active ? 'border-pop bg-pop-bg' : 'border-border bg-surface-2 hover:border-primary'
                    }`}
                  >
                    <span
                      className="h-6 w-6 shrink-0 rounded-pill"
                      style={{ background: p.hex }}
                    />
                    <span className="truncate text-left text-sm text-text">{p.name}</span>
                  </button>
                );
              })}
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-text-muted">Custom hex</span>
              <div className="flex items-center gap-2">
                <input
                  className="input max-w-xs font-mono"
                  value={accentHex}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    if (/^#?[0-9a-f]{6}$/i.test(v)) {
                      setAccentHex(v.startsWith('#') ? v : `#${v}`);
                    } else {
                      setAccentHex(v);
                    }
                  }}
                />
                <input
                  type="color"
                  value={accentHex}
                  onChange={(e) => setAccentHex(e.target.value.toUpperCase())}
                  className="h-10 w-12 cursor-pointer rounded-input border border-border bg-surface-2 p-0.5"
                />
              </div>
            </label>

            <AccentPreview />
          </>
        ) : (
          <div className="rounded-input border border-border bg-surface-2 p-4 text-sm text-text-muted">
            To change the trust accent colour, ask a MAT admin to update it in their settings.
          </div>
        )}
      </section>

      <section className="card flex flex-col gap-5">
        <h2 className="font-display text-xl text-text">Survey schedule</h2>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-muted">Send day each month</span>
          <select className="input max-w-xs">
            <option>1st of the month</option>
            <option>15th of the month</option>
            <option>Last working day</option>
          </select>
        </label>
      </section>
    </div>
  );
}

function AccentPreview() {
  return (
    <div className="flex flex-col gap-3 rounded-input border border-border bg-bg p-5">
      <div className="text-xs uppercase tracking-wider text-text-muted">Live preview</div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="pop-badge">✦ New insight</span>
        <button className="btn btn-pop">Generate newsletter</button>
        <div
          className="h-2 w-32 rounded-pill"
          style={{ background: 'var(--color-pop)' }}
        />
        <div
          className="rounded-input px-3 py-1.5 text-xs"
          style={{ background: 'var(--color-pop-bg)', color: 'var(--color-pop-light)' }}
        >
          Recognition card
        </div>
      </div>
    </div>
  );
}
