import Link from 'next/link';
import { CategoryBarChart } from '@/components/CategoryBarChart';
import { ECTStatusPill } from '@/components/ECTStatusPill';
import { InsightCard } from '@/components/InsightCard';
import { RingChart } from '@/components/RingChart';
import { StaffVoiceCard } from '@/components/StaffVoiceCard';
import { StatCard } from '@/components/StatCard';
import { MOCK_DASHBOARD, MOCK_RECOMMENDATION } from '@/lib/mockData';

export default function DashboardPage() {
  const d = MOCK_DASHBOARD;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-muted">May 2026</div>
          <h1 className="mt-1 font-display text-4xl text-text">Good morning, Sarah</h1>
          <p className="mt-2 text-sm text-text-muted">
            Your May survey is open. {d.responded} of {d.total_staff} staff have responded so far.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/share" className="btn btn-ghost">
            ✦ Share
          </Link>
          <Link href="/newsletter/nl-may-2026" className="btn btn-primary">
            Generate newsletter
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard
          label="Overall wellbeing"
          value={d.wellbeing_score.toFixed(1)}
          unit="/ 10"
          delta={d.wellbeing_delta}
          trend={d.wellbeing_trend}
        />
        <RingChart
          percent={d.response_rate}
          label="Response rate"
          caption={`${d.responded} of ${d.total_staff} staff`}
        />
        <ECTRiskCard
          onTrack={d.ect_on_track}
          watch={d.ect_watch}
          atRisk={d.ect_at_risk}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CategoryBarChart data={d.category_scores} />
        </div>

        <div className="flex flex-col gap-5">
          {d.latest_insight && (
            <InsightCard insight={d.latest_insight} recommendation={MOCK_RECOMMENDATION} />
          )}
          {d.latest_submission && <StaffVoiceCard submission={d.latest_submission} />}
        </div>
      </section>
    </div>
  );
}

function ECTRiskCard({
  onTrack,
  watch,
  atRisk,
}: {
  onTrack: number;
  watch: number;
  atRisk: number;
}) {
  const total = onTrack + watch + atRisk;
  return (
    <div className="card flex flex-col gap-4">
      <div className="text-xs uppercase tracking-wider text-text-muted">ECT risk monitor</div>
      <div className="metric text-5xl text-text">
        {total}
        <span className="ml-2 text-base font-normal text-text-muted">ECTs tracked</span>
      </div>
      <div className="flex flex-col gap-2">
        <RiskRow status="on_track" count={onTrack} />
        <RiskRow status="watch" count={watch} />
        <RiskRow status="at_risk" count={atRisk} />
      </div>
    </div>
  );
}

function RiskRow({ status, count }: { status: 'on_track' | 'watch' | 'at_risk'; count: number }) {
  return (
    <div className="flex items-center justify-between">
      <ECTStatusPill status={status} />
      <span className="metric text-lg text-text">{count}</span>
    </div>
  );
}
