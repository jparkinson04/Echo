import { notFound } from 'next/navigation';
import { AnonymousSurveyForm } from '@/components/AnonymousSurveyForm';
import { ClientOrgName } from '@/components/ClientOrgName';
import { EchoMark } from '@/components/EchoMark';
import { hexToRgba, lightenHex } from '@/lib/accent';
import { MOCK_SURVEYS, MOCK_SURVEY_ORG } from '@/lib/mockData';

interface PublicSurveyPageProps {
  params: { survey_id: string };
}

export default function PublicSurveyPage({ params }: PublicSurveyPageProps) {
  const survey = MOCK_SURVEYS.find((s) => s.id === params.survey_id);
  if (!survey) notFound();

  const accent = MOCK_SURVEY_ORG.accent;
  const accentLight = lightenHex(accent, 20);
  const accentBg = hexToRgba(accent, 0.12);

  const closesAt = survey.closes_at
    ? new Date(survey.closes_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
      })
    : null;

  return (
    <div
      className="min-h-screen bg-bg"
      style={
        {
          '--color-pop': accent,
          '--color-pop-light': accentLight,
          '--color-pop-bg': accentBg,
        } as React.CSSProperties
      }
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-5 py-10">
        <header className="flex flex-col items-center gap-6 text-center">
          <EchoMark size="md" />
          <div>
            <span className="pop-badge mb-3">
              ✦ <ClientOrgName fallback={MOCK_SURVEY_ORG.name} />
            </span>
            <h1 className="font-display text-4xl leading-tight text-text">
              {survey.title}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-muted">
              {survey.description ?? 'Five minutes. Completely anonymous.'}
            </p>
            {closesAt && (
              <p className="mt-3 text-xs uppercase tracking-wider text-text-subtle">
                Closes {closesAt}
              </p>
            )}
          </div>

          <div
            className="flex w-full items-start gap-3 rounded-card border px-5 py-4 text-left text-sm"
            style={{
              background: 'var(--color-pop-bg)',
              borderColor: 'var(--color-pop-bg)',
              color: 'var(--color-text)',
            }}
          >
            <span
              className="mt-0.5 font-display text-lg leading-none"
              style={{ color: 'var(--color-pop-light)' }}
            >
              ✦
            </span>
            <div>
              <div className="font-medium">This survey is completely anonymous.</div>
              <div className="mt-1 text-text-muted">
                Your name, your email, and your device are never recorded.{' '}
                <ClientOrgName fallback={MOCK_SURVEY_ORG.name} /> only sees the data and the
                words you choose to share.
              </div>
            </div>
          </div>
        </header>

        <AnonymousSurveyForm survey={survey} />

        <footer className="mt-4 text-center text-xs text-text-subtle">
          <span style={{ color: 'var(--color-pop)' }}>✦</span> Made with Echo
        </footer>
      </div>
    </div>
  );
}
