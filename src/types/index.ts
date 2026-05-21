export interface Organisation {
  id: string;
  name: string;
  type: 'school' | 'mat';
  mat_id: string | null;
  accent_colour: string;
  logo_url: string | null;
  created_at: string;
}

export type UserRole = 'mat_admin' | 'school_admin' | 'leader' | 'staff' | 'ect';

export interface User {
  id: string;
  organisation_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  created_at: string;
}

export type RiskStatus = 'on_track' | 'watch' | 'at_risk';

export interface ECTCheckin {
  id: string;
  organisation_id: string;
  ect_user_id: string;
  mood_score: number;
  support_score: number;
  confidence_score: number;
  notes: string | null;
  submitted_at: string;
}

export type SurveyQuestionType = 'scale' | 'multiple_choice' | 'free_text' | 'photo';

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  text: string;
  category?: string;
  options?: string[];
  required: boolean;
}

export type SurveyStatus = 'draft' | 'active' | 'closed';

export interface Survey {
  id: string;
  organisation_id: string;
  title: string;
  description: string | null;
  questions: SurveyQuestion[];
  status: SurveyStatus;
  type: 'staff' | 'ect';
  created_by: string;
  created_at: string;
  closes_at: string | null;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  organisation_id: string;
  answers: Record<string, string | number | string[]>;
  submitted_at: string;
}

export type SubmissionType = 'shoutout' | 'blog' | 'suggestion';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface StaffSubmission {
  id: string;
  organisation_id: string;
  author_id: string | null;
  type: SubmissionType;
  nominee_name: string | null;
  title: string | null;
  content: string;
  anonymous: boolean;
  status: SubmissionStatus;
  submitted_at: string;
}

export type NewsletterSectionType =
  | 'welcome'
  | 'wellbeing_snapshot'
  | 'staff_spotlight'
  | 'from_the_team'
  | 'looking_ahead';

export interface NewsletterSection {
  type: NewsletterSectionType;
  heading: string;
  content: string;
  photo_url?: string;
}

export interface Newsletter {
  id: string;
  organisation_id: string;
  title: string;
  content_json: { sections: NewsletterSection[] };
  content_html: string | null;
  generated_at: string;
  sent_at: string | null;
  status: 'draft' | 'sent';
}

export interface CategoryScore {
  category: string;
  score: number;
  response_count: number;
}

export interface DashboardData {
  wellbeing_score: number;
  wellbeing_delta: number;
  wellbeing_trend: number[];
  category_scores: CategoryScore[];
  response_rate: number;
  responded: number;
  total_staff: number;
  ect_on_track: number;
  ect_watch: number;
  ect_at_risk: number;
  latest_insight: string | null;
  latest_submission: StaffSubmission | null;
}

export interface ShareableGraphic {
  id: string;
  organisation_id: string;
  survey_id: string;
  graphic_url: string;
  created_at: string;
}

export interface ECTToken {
  id: string;
  ect_user_id: string;
  organisation_id: string;
  token: string;
  created_at: string;
}
