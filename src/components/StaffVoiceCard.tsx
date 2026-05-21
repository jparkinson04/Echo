import type { StaffSubmission } from '@/types';

interface StaffVoiceCardProps {
  submission: StaffSubmission;
  className?: string;
}

export function StaffVoiceCard({ submission, className = '' }: StaffVoiceCardProps) {
  return (
    <div
      className={`card flex flex-col gap-3 ${className}`}
      style={{ background: 'var(--color-pop-bg)', borderColor: 'var(--color-pop-bg)' }}
    >
      <div className="flex items-center justify-between">
        <span className="pop-badge">✦ Recognition</span>
        <span className="text-xs text-text-muted">
          {new Date(submission.submitted_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
      </div>

      {submission.nominee_name && (
        <div className="font-display text-lg leading-tight text-text">
          For {submission.nominee_name}
        </div>
      )}

      <p className="text-sm leading-relaxed text-text">&ldquo;{submission.content}&rdquo;</p>

      <div className="mt-1 text-xs text-text-muted">
        {submission.anonymous ? 'Shared anonymously' : 'Shared by a colleague'}
      </div>
    </div>
  );
}
