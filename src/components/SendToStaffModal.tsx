'use client';

import { useEffect, useState } from 'react';

interface SendToStaffModalProps {
  open: boolean;
  surveyId: string;
  surveyUrl: string;
  onClose: () => void;
}

export function SendToStaffModal({
  open,
  surveyId,
  surveyUrl,
  onClose,
}: SendToStaffModalProps) {
  const [emails, setEmails] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!open) {
      setEmails('');
      setResult(null);
    }
  }, [open]);

  if (!open) return null;

  const parsed = emails
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
  const valid = parsed.filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  const invalid = parsed.filter((e) => !valid.includes(e));

  async function send() {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/send-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ survey_id: surveyId, emails: valid }),
      });
      const data = (await res.json()) as { sent?: number; mocked?: boolean; error?: string };
      if (!res.ok) {
        setResult({ ok: false, message: data.error ?? 'Something went wrong.' });
      } else {
        setResult({
          ok: true,
          message: data.mocked
            ? `Demo mode. We would have emailed ${data.sent ?? valid.length} staff. Add RESEND_API_KEY to send for real.`
            : `Sent to ${data.sent ?? valid.length} staff.`,
        });
      }
    } catch {
      setResult({ ok: false, message: 'Network error. Try again.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card flex w-full max-w-lg flex-col gap-5"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <span className="pop-badge mb-2 w-fit">✦ Send to your staff</span>
            <h2 className="font-display text-2xl text-text">
              Email your team this month&apos;s pulse
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Paste staff email addresses below. One per line, or comma-separated. Each
              recipient gets a clean message with the anonymous link.
            </p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            ✕
          </button>
        </header>

        <div className="rounded-input border border-border bg-surface-2 px-4 py-3 text-xs text-text-muted">
          <div className="text-text-subtle">Link being sent</div>
          <div className="mt-1 break-all font-mono text-text">{surveyUrl}</div>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-muted">Staff emails</span>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            rows={6}
            placeholder={'a.teacher@school.org\nb.teacher@school.org'}
            className="input resize-y font-mono text-[13px]"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="pill border-success/40 text-success">
            {valid.length} valid
          </span>
          {invalid.length > 0 && (
            <span className="pill border-danger/40 text-danger">
              {invalid.length} look invalid
            </span>
          )}
        </div>

        {result && (
          <div
            className={`rounded-input border px-4 py-3 text-sm ${
              result.ok
                ? 'border-success/30 bg-success/5 text-success'
                : 'border-danger/30 bg-danger/5 text-danger'
            }`}
          >
            {result.message}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            onClick={send}
            disabled={sending || valid.length === 0}
            className="btn btn-primary disabled:opacity-50"
          >
            {sending ? 'Sending…' : `Send to ${valid.length || 0} staff`}
          </button>
        </div>
      </div>
    </div>
  );
}
