import type {
  CategoryScore,
  DashboardData,
  StaffSubmission,
  Survey,
} from '@/types';

const NOW = new Date('2026-05-18T10:00:00.000Z').toISOString();

export const MOCK_CATEGORIES: CategoryScore[] = [
  { category: 'Feeling supported', score: 8.4, response_count: 42 },
  { category: 'Leadership', score: 7.8, response_count: 42 },
  { category: 'Belonging', score: 8.1, response_count: 42 },
  { category: 'Professional development', score: 6.9, response_count: 42 },
  { category: 'Work-life balance', score: 5.7, response_count: 42 },
  { category: 'Workload', score: 5.4, response_count: 42 },
];

export const MOCK_CATEGORY_TRENDS: Record<string, number[]> = {
  'Feeling supported': [7.6, 7.8, 8.0, 8.1, 8.2, 8.4],
  Leadership: [7.2, 7.4, 7.5, 7.6, 7.7, 7.8],
  Belonging: [7.4, 7.6, 7.8, 7.9, 8.0, 8.1],
  'Professional development': [6.5, 6.6, 6.7, 6.8, 6.9, 6.9],
  'Work-life balance': [6.4, 6.2, 6.0, 5.9, 5.8, 5.7],
  Workload: [6.0, 5.8, 5.6, 5.5, 5.4, 5.4],
};

export const MOCK_SUBMISSION: StaffSubmission = {
  id: 'sub-1',
  organisation_id: 'org-1',
  author_id: null,
  type: 'shoutout',
  nominee_name: 'Mr Patel',
  title: null,
  content:
    'Mr Patel covered three of my lessons last week without being asked when I was unwell. He made sure my Year 4s still had their reading time. That kind of quiet kindness is why this school feels like home.',
  anonymous: true,
  status: 'approved',
  submitted_at: NOW,
};

export const MOCK_DASHBOARD: DashboardData = {
  wellbeing_score: 7.4,
  wellbeing_delta: 0.3,
  wellbeing_trend: [6.5, 6.7, 6.9, 7.0, 7.1, 7.4],
  category_scores: MOCK_CATEGORIES,
  response_rate: 84,
  responded: 42,
  total_staff: 50,
  ect_on_track: 3,
  ect_watch: 1,
  ect_at_risk: 1,
  latest_insight:
    'Workload remains your lowest score for the third month running, but support and belonging are climbing. Staff feel cared for even when stretched.',
  latest_submission: MOCK_SUBMISSION,
};

export const MOCK_RECOMMENDATION =
  'Run a 30-minute workload audit with each year team this month. The data shows staff feel supported by you personally, but stretched by admin load.';

const STANDARD_SCALE_QUESTIONS = [
  {
    id: 'q-workload',
    type: 'scale' as const,
    text: 'How manageable has your workload felt this month?',
    category: 'Workload',
    required: false,
  },
  {
    id: 'q-supported',
    type: 'scale' as const,
    text: 'How supported by colleagues and leadership have you felt?',
    category: 'Feeling supported',
    required: false,
  },
  {
    id: 'q-leadership',
    type: 'scale' as const,
    text: 'How well has school leadership communicated and led this month?',
    category: 'Leadership',
    required: false,
  },
  {
    id: 'q-belonging',
    type: 'scale' as const,
    text: 'How much do you feel you belong here?',
    category: 'Belonging',
    required: false,
  },
  {
    id: 'q-pd',
    type: 'scale' as const,
    text: 'How much have you grown professionally this month?',
    category: 'Professional development',
    required: false,
  },
  {
    id: 'q-wlb',
    type: 'scale' as const,
    text: 'How well have you been able to switch off outside of work?',
    category: 'Work-life balance',
    required: false,
  },
  {
    id: 'q-anything',
    type: 'free_text' as const,
    text: 'Anything else you want us to know?',
    required: false,
  },
];

export const MOCK_SURVEYS: Survey[] = [
  {
    id: 'survey-may-2026',
    organisation_id: 'org-1',
    title: 'May 2026 Wellbeing Pulse',
    description:
      'Five minutes. Completely anonymous. Your name is never recorded, ever.',
    questions: STANDARD_SCALE_QUESTIONS,
    status: 'active',
    type: 'staff',
    created_by: 'user-1',
    created_at: NOW,
    closes_at: '2026-05-31T23:59:00.000Z',
  },
  {
    id: 'survey-apr-2026',
    organisation_id: 'org-1',
    title: 'April 2026 Wellbeing Pulse',
    description: 'Closed.',
    questions: STANDARD_SCALE_QUESTIONS,
    status: 'closed',
    type: 'staff',
    created_by: 'user-1',
    created_at: '2026-04-01T09:00:00.000Z',
    closes_at: '2026-04-30T23:59:00.000Z',
  },
  {
    id: 'survey-mar-2026',
    organisation_id: 'org-1',
    title: 'March 2026 Wellbeing Pulse',
    description: 'Closed.',
    questions: STANDARD_SCALE_QUESTIONS,
    status: 'closed',
    type: 'staff',
    created_by: 'user-1',
    created_at: '2026-03-01T09:00:00.000Z',
    closes_at: '2026-03-31T23:59:00.000Z',
  },
];

export const MOCK_SURVEY_ORG: { name: string; accent: string } = {
  name: 'Greenfield Primary',
  accent: '#00E090',
};

export interface NewsletterPhoto {
  id: string;
  url: string;
  caption?: string;
  submittedBy?: string;
}

export type NewsletterSectionKind =
  | 'welcome'
  | 'wellbeing_snapshot'
  | 'staff_spotlight'
  | 'from_the_team'
  | 'looking_ahead'
  | 'photo_album';

export interface MockNewsletter {
  id: string;
  title: string;
  month: string;
  status: 'draft' | 'sent';
  generated_at: string;
  hero_stat?: { label: string; value: string; delta?: string };
  sections: {
    type: NewsletterSectionKind;
    heading: string;
    content: string;
    photo_url?: string;
    photos?: NewsletterPhoto[];
  }[];
}

export const MOCK_APPROVED_PHOTOS: NewsletterPhoto[] = [
  {
    id: 'photo-1',
    url: 'https://picsum.photos/seed/echo-classroom-1/900/600',
    caption: 'Year 4 reading corner, finally finished',
    submittedBy: 'Anonymous (Year 4)',
  },
  {
    id: 'photo-2',
    url: 'https://picsum.photos/seed/echo-art-1/900/600',
    caption: 'KS1 self-portraits gallery',
    submittedBy: 'Anonymous (KS1)',
  },
  {
    id: 'photo-3',
    url: 'https://picsum.photos/seed/echo-sports-1/900/600',
    caption: 'Sports day, the egg-and-spoon final',
    submittedBy: 'Anonymous (PE lead)',
  },
  {
    id: 'photo-4',
    url: 'https://picsum.photos/seed/echo-garden-1/900/600',
    caption: 'Eco club planting morning',
    submittedBy: 'Anonymous (Year 6)',
  },
  {
    id: 'photo-5',
    url: 'https://picsum.photos/seed/echo-staffroom-1/900/600',
    caption: 'The new staffroom kettle, much loved',
    submittedBy: 'Anonymous (Office)',
  },
  {
    id: 'photo-6',
    url: 'https://picsum.photos/seed/echo-corridor-1/900/600',
    caption: 'World book day corridor displays',
    submittedBy: 'Anonymous (Year 3)',
  },
];

export const MOCK_NEWSLETTERS: MockNewsletter[] = [
  {
    id: 'nl-may-2026',
    title: 'May, in our own words',
    month: 'May 2026',
    status: 'draft',
    generated_at: NOW,
    hero_stat: { label: 'Wellbeing', value: '7.4', delta: '+0.3' },
    sections: [
      {
        type: 'welcome',
        heading: 'Thank you for the honesty',
        content:
          "Forty two of you filled in this month's pulse. That's the highest response we've ever had, and the picture you've painted is one I'm proud of. Some of it is hard reading. Most of it is the sort of thing other schools would queue up for. Here is what you said, what it means, and what we're going to do about it.",
      },
      {
        type: 'wellbeing_snapshot',
        heading: 'Belonging climbed all year',
        content:
          "Belonging sits at 8.1 out of 10, our highest score in this category since we started measuring. That isn't an abstract number. It means that on a random Tuesday morning, more of you walk into this building feeling that you fit here than at any point last year. That is the result of the small, deliberate things you do for each other. The corridor hellos. The covering for each other when half a class is off. The way our staffroom sounds at the end of a long day. Keep doing it.",
      },
      {
        type: 'staff_spotlight',
        heading: 'For Mr Patel',
        content:
          "An anonymous shout-out arrived this month for Aman. The words were these: he covered three of my lessons last week without being asked when I was unwell, and he made sure my Year 4s still had their reading time. That kind of quiet kindness is what makes our school feel like home. Aman, thank you. The colleague who wrote this couldn't sign their name, but they wanted you to know.",
      },
      {
        type: 'photo_album',
        heading: 'A month in pictures',
        content:
          "Some of the moments you wanted to share this month. All submitted anonymously, all chosen by you.",
        photos: [MOCK_APPROVED_PHOTOS[0], MOCK_APPROVED_PHOTOS[2], MOCK_APPROVED_PHOTOS[3]],
      },
      {
        type: 'from_the_team',
        heading: 'Three things you asked for',
        content:
          "You used the open box this month to ask for three specific things. Shorter Monday briefings. A calmer lunch rota for the Year 6 team. More shared planning time for KS1. All three are reasonable. All three are happening from June. We've written up exactly how in the staffroom.",
      },
      {
        type: 'looking_ahead',
        heading: 'Workload is where we focus next',
        content:
          "Workload sits at 5.4, our lowest score, and it has not moved much for three months. That's a signal we can't ignore. Before the end of term, every year team will sit down with me for thirty minutes to walk through what we can take off the plate. Not a survey about workload. A conversation about it. Look out for the diary invite.",
      },
    ],
  },
  {
    id: 'nl-apr-2026',
    title: 'April at Greenfield',
    month: 'April 2026',
    status: 'sent',
    generated_at: '2026-04-30T12:00:00.000Z',
    sections: [],
  },
];

export interface MockSchool {
  id: string;
  name: string;
  wellbeing: number;
  responseRate: number;
  ectAtRisk: number;
  categories: { workload: number; support: number; leadership: number; belonging: number };
}

export const MOCK_MAT_SCHOOLS: MockSchool[] = [
  {
    id: 'school-1',
    name: 'Greenfield Primary',
    wellbeing: 7.4,
    responseRate: 84,
    ectAtRisk: 1,
    categories: { workload: 5.4, support: 8.4, leadership: 7.8, belonging: 8.1 },
  },
  {
    id: 'school-2',
    name: 'Oakridge Academy',
    wellbeing: 6.2,
    responseRate: 71,
    ectAtRisk: 2,
    categories: { workload: 4.8, support: 6.5, leadership: 6.1, belonging: 7.0 },
  },
  {
    id: 'school-3',
    name: 'Riverside Secondary',
    wellbeing: 8.1,
    responseRate: 92,
    ectAtRisk: 0,
    categories: { workload: 7.0, support: 8.5, leadership: 8.4, belonging: 8.6 },
  },
  {
    id: 'school-4',
    name: 'St. Margaret&apos;s C of E',
    wellbeing: 4.9,
    responseRate: 58,
    ectAtRisk: 3,
    categories: { workload: 3.5, support: 4.8, leadership: 5.0, belonging: 6.1 },
  },
  {
    id: 'school-5',
    name: 'Maple Grove Junior',
    wellbeing: 7.0,
    responseRate: 80,
    ectAtRisk: 1,
    categories: { workload: 5.9, support: 7.5, leadership: 7.2, belonging: 7.5 },
  },
];

export interface MockECT {
  id: string;
  name: string;
  cohort: string;
  mood: number;
  trend: 'up' | 'flat' | 'down';
  lastCheckin: string;
  status: 'on_track' | 'watch' | 'at_risk';
}

export const MOCK_ECTS: MockECT[] = [
  {
    id: 'ect-1',
    name: 'Hannah Reeves',
    cohort: 'Year 1',
    mood: 8.2,
    trend: 'up',
    lastCheckin: '4 days ago',
    status: 'on_track',
  },
  {
    id: 'ect-2',
    name: 'Tom Aldridge',
    cohort: 'Year 1',
    mood: 7.4,
    trend: 'flat',
    lastCheckin: '2 weeks ago',
    status: 'on_track',
  },
  {
    id: 'ect-3',
    name: 'Priya Shah',
    cohort: 'Year 2',
    mood: 6.1,
    trend: 'down',
    lastCheckin: '3 weeks ago',
    status: 'watch',
  },
  {
    id: 'ect-4',
    name: 'James Okonkwo',
    cohort: 'Year 2',
    mood: 4.2,
    trend: 'down',
    lastCheckin: '6 weeks ago',
    status: 'at_risk',
  },
  {
    id: 'ect-5',
    name: 'Beth Carruthers',
    cohort: 'Year 1',
    mood: 7.9,
    trend: 'up',
    lastCheckin: '1 week ago',
    status: 'on_track',
  },
];
