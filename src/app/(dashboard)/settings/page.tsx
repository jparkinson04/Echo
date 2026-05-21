'use client';

import { useEffect, useRef, useState } from 'react';
import { useAccent } from '@/components/AccentProvider';
import { ACCENT_PRESETS } from '@/lib/accent';

const MAX_LOGO_MB = 2;

export default function SettingsPage() {
  const {
    accentHex,
    setAccentHex,
    role,
    theme,
    setTheme,
    logoDataUrl,
    setLogoDataUrl,
    orgName,
    setOrgName,
  } = useAccent();
  const canEditAccent = role === 'mat_admin';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [nameDraft, setNameDraft] = useState(orgName);
  const [logoDraft, setLogoDraft] = useState<string | null>(logoDataUrl);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setNameDraft(orgName);
  }, [orgName]);
  useEffect(() => {
    setLogoDraft(logoDataUrl);
  }, [logoDataUrl]);

  const isDirty = nameDraft.trim() !== orgName || logoDraft !== logoDataUrl;
  const canSave = isDirty && nameDraft.trim().length > 0;

  function onPickLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    setUploadError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('That file is not an image. Try a PNG or SVG.');
      return;
    }
    if (file.size > MAX_LOGO_MB * 1024 * 1024) {
      setUploadError(`That file is over ${MAX_LOGO_MB}MB. Try a smaller version.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setLogoDraft(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function saveProfile() {
    const trimmed = nameDraft.trim();
    if (!trimmed) return;
    setOrgName(trimmed);
    setLogoDataUrl(logoDraft);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2400);
  }

  function discardProfile() {
    setNameDraft(orgName);
    setLogoDraft(logoDataUrl);
    setUploadError(null);
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <div className="text-xs uppercase tracking-wider text-text-muted">Settings</div>
        <h1 className="mt-1 font-display text-4xl text-text">
          {canEditAccent ? 'Your trust' : 'Your school'}
        </h1>
      </header>

      <section className="card flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-xl text-text">Profile</h2>
          {justSaved && (
            <span
              className="rounded-pill px-3 py-1 text-xs font-medium"
              style={{ background: 'var(--color-pop-bg)', color: 'var(--color-pop-light)' }}
            >
              ✦ Saved
            </span>
          )}
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-muted">
            {canEditAccent ? 'Trust name' : 'School name'}
          </span>
          <input
            className="input"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder={canEditAccent ? 'Northstar Learning Trust' : 'Greenfield Primary'}
          />
        </label>

        <div className="flex flex-col gap-2 text-sm">
          <span className="text-text-muted">Logo</span>
          <p className="max-w-xl text-xs text-text-subtle">
            Up to {MAX_LOGO_MB}MB. PNG or SVG with a transparent background works best. Your
            logo will appear in the sidebar, on every newsletter, and in the corner of any
            shareable graphic.
          </p>
          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-card border border-border bg-surface-2"
              aria-label="Logo preview"
            >
              {logoDraft ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoDraft}
                  alt="School logo"
                  className="h-full w-full rounded-card object-contain p-2"
                />
              ) : (
                <span className="font-display text-2xl" style={{ color: 'var(--color-pop)' }}>
                  ✦
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickLogo}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-ghost w-fit"
              >
                {logoDraft ? 'Replace logo' : 'Upload logo'}
              </button>
              {logoDraft && (
                <button
                  onClick={() => setLogoDraft(null)}
                  className="text-xs text-text-muted hover:text-danger"
                >
                  Remove logo
                </button>
              )}
            </div>
          </div>
          {uploadError && (
            <div
              role="alert"
              className="rounded-input border px-3 py-2 text-xs"
              style={{
                background: 'rgba(226,75,74,0.10)',
                borderColor: 'rgba(226,75,74,0.30)',
                color: 'var(--color-danger)',
              }}
            >
              {uploadError}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
          <span className="text-xs text-text-subtle">
            {isDirty
              ? 'Unsaved changes. Save to apply them across the platform.'
              : 'Up to date.'}
          </span>
          <div className="flex items-center gap-2">
            {isDirty && (
              <button onClick={discardProfile} className="btn btn-ghost">
                Discard
              </button>
            )}
            <button
              onClick={saveProfile}
              disabled={!canSave}
              className="btn btn-pop disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save changes
            </button>
          </div>
        </div>
      </section>

      <section className="card flex flex-col gap-5">
        <div>
          <h2 className="font-display text-xl text-text">Display</h2>
          <p className="mt-1 max-w-xl text-sm text-text-muted">
            Pick the look that suits your team. This only affects the platform you use inside
            Echo. Public surveys staff fill in stay branded with your accent.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-text-muted">Theme</span>
          <div className="flex w-fit items-center gap-1 rounded-pill border border-border bg-surface-2 p-1">
            <ThemeButton active={theme === 'dark'} onClick={() => setTheme('dark')} label="Dark" hint="Default" />
            <ThemeButton active={theme === 'light'} onClick={() => setTheme('light')} label="Light" hint="Lighter platform" />
          </div>
        </div>
      </section>

      <section className="card flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl text-text">Accent colour</h2>
            <p className="mt-1 max-w-xl text-sm text-text-muted">
              {canEditAccent
                ? 'Used across every school in your trust. Newsletters, recognition cards, and shareable graphics will all pick this up.'
                : 'Set by your trust. All schools in your trust use the same accent so the brand stays consistent.'}
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

function ThemeButton({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start rounded-pill px-4 py-1.5 text-left transition-colors ${
        active ? 'text-text' : 'text-text-muted hover:text-text'
      }`}
      style={active ? { background: 'var(--color-pop)', color: '#0B1628' } : undefined}
      aria-pressed={active}
    >
      <span className="text-sm font-medium leading-tight">{label}</span>
      <span className="text-[10px] leading-tight opacity-80">{hint}</span>
    </button>
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
