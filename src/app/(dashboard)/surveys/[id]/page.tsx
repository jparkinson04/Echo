'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SendToStaffModal } from '@/components/SendToStaffModal';
import { MOCK_DASHBOARD, MOCK_SURVEYS } from '@/lib/mockData';

export default function SurveyDetailPage() {
  const params = useParams<{ id: string }>();
  const surveyId = params.id;
  const survey = MOCK_SURVEYS.find((s) => s.id === surveyId);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const surveyUrl = useMemo(() => {
    if (typeof window === 'undefined') return `/s/${surveyId}`;
    return `${window.location.origin}/s/${surveyId}`;
  }, [surveyId]);

  if (!survey) {
    notFound();
  }

  async function copy() {
    await navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const responded = survey.status === 'active' ? MOCK_DASHBOARD.responded : MOCK_DASHBOARD.total_staff;
  const totalStaff = MOCK_DASHBOARD.total_staff;
  const pct = Math.round((responded / totalStaff) * 100);

  const closesAt = survey.closes_at
    ? new Date(survey.closes_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/surveys"
          className="text-xs uppercase tracking-wider text-text-muted hover:text-text"
        >
          ← Surveys
        </Link>
      </div>

      <header className="flex items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-muted">
            {survey.status === 'active'
              ? `Open until ${closesAt}`
              : `Closed ${closesAt}`}
          </div>
          <h1 className="mt-1 font-display text-4xl text-text">{survey.title}</h1>
          <p className="mt-2 max-w-xl text-sm text-text-muted">
            {survey.description ?? 'A monthly anonymous pulse of how staff are feeling.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {survey.status === 'closed' ? (
            <Link href={`/dashboard`} className="btn btn-primary">
              View results
            </Link>
          ) : (
            <>
              <a
                href={surveyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Preview
              </a>
              <button onClick={() => setModalOpen(true)} className="btn btn-primary">
                Send to staff
              </button>
            </>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="card flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wider text-text-muted">Responses</div>
          <div className="metric text-5xl text-text">
            {responded}
            <span className="ml-1 text-base font-normal text-text-muted">/ {totalStaff}</span>
          </div>
          <div className="text-xs text-text-muted">{pct}% so far</div>
        </div>
        <div className="card flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wider text-text-muted">Questions</div>
          <div className="metric text-5xl text-text">
            {survey.questions.length}
          </div>
          <div className="text-xs text-text-muted">Plus an optional staff voice close</div>
        </div>
        <div className="card flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wider text-text-muted">Status</div>
          <div className="metric text-3xl text-text capitalize">{survey.status}</div>
          <div className="text-xs text-text-muted">
            {survey.status === 'active' ? 'Accepting responses' : 'No longer accepting responses'}
          </div>
        </div>
      </section>

      <section className="card flex flex-col gap-5">
        <div>
          <h2 className="font-display text-xl text-text">How staff get this</h2>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Echo emails a unique link to each staff member you nominate. They click it, fill the
            pulse in their browser, and submit. No login, no app, no data trail back to them.
            You can also copy the link and paste it anywhere: a newsletter, a poster, a staffroom
            screen.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-input border border-border bg-surface-2 p-4">
          <div className="text-xs uppercase tracking-wider text-text-muted">Public link</div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1 break-all rounded-input border border-border bg-bg px-3 py-2.5 font-mono text-[13px] text-text">
              {surveyUrl}
            </div>
            <div className="flex gap-2">
              <button onClick={copy} className="btn btn-ghost">
                {copied ? 'Copied' : 'Copy link'}
              </button>
              <a
                href={surveyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Open
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <DistributionTile
            badge="Primary"
            title="Email each staff member"
            body="One click from their inbox. The simplest way to keep monthly cadence."
            cta="Send to staff"
            onClick={() => setModalOpen(true)}
            highlight
          />
          <DistributionTile
            badge="Backup"
            title="Share the link"
            body="Drop it into your school newsletter, staffroom poster, or intranet page."
            cta={copied ? 'Copied' : 'Copy link'}
            onClick={copy}
          />
          <DistributionTile
            badge="Coming soon"
            title="Auto-send each month"
            body="Pick a send day and Echo emails the new survey automatically. Set and forget."
            cta="On the roadmap"
            disabled
          />
        </div>
      </section>

      {survey.status === 'active' && (
        <section className="card flex flex-col gap-3">
          <h2 className="font-display text-xl text-text">What staff will see</h2>
          <p className="text-sm text-text-muted">
            Six short scale questions covering workload, support, leadership, belonging,
            professional development, and work-life balance. An open question for anything else
            they want to say. Then a built-in &ldquo;one last thing&rdquo; section inviting them
            to shout out a colleague, celebrate a moment, or suggest one thing that would make
            the school better. Every part of the closing is optional and never identifies them.
          </p>
          <div
            className="mt-2 flex items-start gap-3 rounded-input border px-4 py-3 text-sm"
            style={{
              background: 'var(--color-pop-bg)',
              borderColor: 'var(--color-pop-bg)',
            }}
          >
            <span
              className="mt-0.5 font-display text-base leading-none"
              style={{ color: 'var(--color-pop-light)' }}
            >
              ✦
            </span>
            <div className="text-text">
              <div className="font-medium">Staff can drag in photos too.</div>
              <div className="mt-1 text-text-muted">
                Up to four photos per response, fully anonymous. Photos that catch your eye can
                drop straight into the monthly newsletter.
              </div>
            </div>
          </div>
        </section>
      )}

      <SendToStaffModal
        open={modalOpen}
        surveyId={surveyId}
        surveyUrl={surveyUrl}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

interface DistributionTileProps {
  badge: string;
  title: string;
  body: string;
  cta: string;
  onClick?: () => void;
  highlight?: boolean;
  disabled?: boolean;
}

function DistributionTile({
  badge,
  title,
  body,
  cta,
  onClick,
  highlight = false,
  disabled = false,
}: DistributionTileProps) {
  return (
    <div
      className={`flex flex-col gap-2.5 rounded-card border p-5 ${
        highlight ? 'border-pop bg-pop-bg/40' : 'border-border bg-surface-2'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider text-text-muted">{badge}</div>
      <div className="font-display text-base text-text">{title}</div>
      <p className="text-xs text-text-muted">{body}</p>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`mt-2 w-fit ${highlight ? 'btn btn-primary' : 'btn btn-ghost'} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {cta}
      </button>
    </div>
  );
}
