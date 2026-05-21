import Link from 'next/link';
import { EchoMark } from '@/components/EchoMark';
import { ACCENT_PRESETS } from '@/lib/accent';

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-10 flex justify-center">
          <EchoMark />
        </div>

        <div className="card flex flex-col gap-6">
          <div>
            <span className="pop-badge mb-3 w-fit">✦ Let&apos;s get you set up</span>
            <h1 className="font-display text-3xl text-text">Tell us about your school</h1>
            <p className="mt-2 text-sm text-text-muted">
              You can change any of this later in Settings.
            </p>
          </div>

          <form className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-text-muted">School or Trust name</span>
              <input className="input" placeholder="Greenfield Primary School" />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-text-muted">Account type</span>
              <select className="input">
                <option>Single school</option>
                <option>Multi-Academy Trust</option>
              </select>
            </label>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-text-muted">Accent colour</span>
              <div className="grid grid-cols-4 gap-2">
                {ACCENT_PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    type="button"
                    className="flex flex-col items-center gap-1.5 rounded-input border border-border bg-surface-2 p-3 hover:border-primary"
                  >
                    <span
                      className="h-8 w-8 rounded-pill"
                      style={{ background: p.hex }}
                    />
                    <span className="text-[10px] text-text-muted">{p.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <Link href="/dashboard" className="btn btn-primary mt-2">
              Continue
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
