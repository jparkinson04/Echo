import { MOCK_SUBMISSION } from '@/lib/mockData';
import { StaffVoiceCard } from '@/components/StaffVoiceCard';

export default function BlogPage() {
  const pending = [MOCK_SUBMISSION];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <div className="text-xs uppercase tracking-wider text-text-muted">Review queue</div>
        <h1 className="mt-1 font-display text-4xl text-text">Staff voice, ready for you</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Every monthly survey ends with a quiet, optional moment for staff to shout out a
          colleague, celebrate something, or suggest one thing that would help. Whatever they
          share lands here for you to approve. Approved items feature in the newsletter and on
          the dashboard.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {pending.map((p) => (
          <div key={p.id} className="flex flex-col gap-3">
            <StaffVoiceCard submission={p} />
            <div className="flex items-center gap-2">
              <button className="btn btn-primary flex-1">Approve</button>
              <button className="btn btn-ghost flex-1">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
