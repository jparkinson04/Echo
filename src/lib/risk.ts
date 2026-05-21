import type { ECTCheckin, RiskStatus } from '@/types';

function daysBetween(a: string | Date, b: string | Date): number {
  const ad = typeof a === 'string' ? new Date(a) : a;
  const bd = typeof b === 'string' ? new Date(b) : b;
  return Math.abs(bd.getTime() - ad.getTime()) / (1000 * 60 * 60 * 24);
}

function getTrend(checkins: ECTCheckin[]): 'improving' | 'static' | 'declining' {
  if (checkins.length < 2) return 'static';
  const sorted = [...checkins].sort(
    (a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime(),
  );
  const first = sorted[0].mood_score;
  const last = sorted[sorted.length - 1].mood_score;
  const diff = last - first;
  if (diff >= 1) return 'improving';
  if (diff <= -1) return 'declining';
  return 'static';
}

export function calculateECTRisk(checkins: ECTCheckin[]): RiskStatus {
  if (checkins.length === 0) return 'watch';

  const sorted = [...checkins].sort(
    (a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime(),
  );
  const recent = sorted.slice(-3);
  const avgMood = recent.reduce((sum, c) => sum + c.mood_score, 0) / recent.length;
  const daysSinceLast = daysBetween(sorted[sorted.length - 1].submitted_at, new Date());
  const trend = getTrend(sorted);

  if (avgMood >= 7 && daysSinceLast <= 35 && trend !== 'declining') return 'on_track';
  if (avgMood < 5 || daysSinceLast > 60 || trend === 'declining') return 'at_risk';
  return 'watch';
}

export function ragColour(score: number): 'red' | 'amber' | 'green' {
  if (score >= 7) return 'green';
  if (score >= 5) return 'amber';
  return 'red';
}
