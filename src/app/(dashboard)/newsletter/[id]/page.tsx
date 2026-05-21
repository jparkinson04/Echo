import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NewsletterEditor } from '@/components/NewsletterEditor';
import { MOCK_DASHBOARD, MOCK_NEWSLETTERS, MOCK_RECOMMENDATION, MOCK_SUBMISSION } from '@/lib/mockData';

interface NewsletterDetailPageProps {
  params: { id: string };
}

export default function NewsletterDetailPage({ params }: NewsletterDetailPageProps) {
  const newsletter = MOCK_NEWSLETTERS.find((n) => n.id === params.id);
  if (!newsletter) notFound();

  if (newsletter.sections.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <Link href="/newsletter" className="text-xs uppercase tracking-wider text-text-muted hover:text-text">
          ← Newsletters
        </Link>
        <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="pop-badge">✦ Sent</span>
          <h2 className="font-display text-2xl text-text">This newsletter has been sent</h2>
          <p className="max-w-md text-sm text-text-muted">
            Sent newsletters are read-only. To create a new one, head back to the list.
          </p>
        </div>
      </div>
    );
  }

  const dashboardData = {
    wellbeing_score: MOCK_DASHBOARD.wellbeing_score,
    wellbeing_delta: MOCK_DASHBOARD.wellbeing_delta,
    category_scores: MOCK_DASHBOARD.category_scores.map((c) => ({
      category: c.category,
      score: c.score,
    })),
    response_rate: MOCK_DASHBOARD.response_rate,
    responded: MOCK_DASHBOARD.responded,
    total_staff: MOCK_DASHBOARD.total_staff,
    top_insight: MOCK_DASHBOARD.latest_insight ?? MOCK_RECOMMENDATION,
    staff_submissions: [
      {
        type: MOCK_SUBMISSION.type,
        nominee_name: MOCK_SUBMISSION.nominee_name,
        content: MOCK_SUBMISSION.content,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/newsletter"
        className="text-xs uppercase tracking-wider text-text-muted hover:text-text"
      >
        ← Newsletters
      </Link>
      <NewsletterEditor
        newsletter={newsletter}
        organisationId="org-1"
        surveyId="survey-may-2026"
        dashboardData={dashboardData}
      />
    </div>
  );
}
