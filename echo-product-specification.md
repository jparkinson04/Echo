# Echo — Teacher Retention Platform

**Product specification for Claude Code**

Echo is a teacher retention SaaS platform for UK primary and junior schools. It collects structured signal from teaching and support staff, applies a defensible scoring framework, surfaces risk flags to leadership, and generates qualitative content for school newsletters and wellbeing communications.

This document is written to be consumed by Claude Code as a build specification. Read it once end-to-end before generating any code. Section 11 contains the implementation order and acceptance criteria.

---

## 1. Product Context

**Product:** Echo — a teacher retention and wellbeing platform for UK primary and junior schools.
**Buyer persona:** Multi-Academy Trust (MAT) CEOs, Trust HR Directors, and Heads of Education. Secondary persona: standalone primary school headteachers.
**End user:** Teaching staff, support staff, and senior leaders within primary and junior schools.
**Launch target:** September 2025.

**The problem Echo solves.** UK schools are required by the Education Staff Wellbeing Charter to measure staff wellbeing at intervals. Ofsted's 2025 inspection framework explicitly evaluates staff workload and wellbeing as part of Leadership & Governance — inspectors look for evidence from regular staff surveys. MAT boards are legally responsible for staff wellbeing across their trusts and need defensible, comparable data to report on. Existing tools either don't exist, are expensive enterprise platforms, or are generic engagement surveys not grounded in education research.

**Echo's wedge.** A research-grounded, education-specific instrument that produces Ofsted-aligned and MAT-board-ready outputs out of the box, with an early-warning system for Early Career Teachers (ECTs) — a regulatory and retention pain point with no direct competitor.

**Platform components.**
- **Input layer:** Staff wellbeing surveys, ECT check-ins, parent surveys, teacher blog submissions
- **Intelligence layer:** Leadership dashboard, AI action recommendations, ECT risk flagging, anonymous benchmarking
- **Output layer:** AI-generated newsletter, monthly website blog, wellbeing column, staff recognition spotlight

**Tech stack.** Next.js 14 (App Router), Supabase (Postgres + Auth + RLS), Anthropic SDK for AI features.

---

## 2. Research Foundation (condensed)

Echo is built on six evidence-validated retention drivers, plus an ECT-specific module. Each maps to (a) a documented attrition factor in UK research, (b) an Ofsted 2025 evaluation area, and (c) a typical MAT board reporting KPI.

| Domain | Evidence anchor | Ofsted alignment | Board KPI |
|---|---|---|---|
| Workload & Working Hours | DfE Working Lives of Teachers (top driver of leaving intention; avg primary teacher works 53hrs/wk) | Leadership & Governance — "supports staff sustainability" | Avg working hours; workload acceptability score |
| Wellbeing & Mental Health | Teacher Wellbeing Index 2024/25 (78% staff stressed; 77% report symptoms of poor mental health) | Wellbeing evaluation area | SWEMWBS group score; sickness absence correlation |
| Leadership & Voice | Working Lives — "views not valued by policymakers" + culture as #1 stress factor | Leadership grade descriptor: "meaningful engagement with staff at all levels" | Staff voice index; action follow-through rate |
| Culture, Recognition & Belonging | TWIX — 50% staff report org culture negatively affects MH; only 27% positive | Culture; Inclusion | eNPS-equivalent; recognition frequency |
| Pupil Behaviour & Safety | TWIX — 63% report increased behaviour incidents; 82% of those say it harmed MH | Behaviour & Attendance | Behaviour-related leave; incident reports |
| Growth, Autonomy & Career | Pay satisfaction has risen but autonomy + development remain top stayers (DfE) | Leadership & Governance — staff development | CPD uptake; promotion pipeline |
| **ECT Module** (separate) | 30–33% of teachers leave within 5 years; mentoring proven to improve retention | Inclusion & Wellbeing of staff | ECT 1yr / 2yr / 5yr retention rate |

Each survey item should be tagged with the domain it serves so reporting can roll up to these seven categories.

---

## 3. Survey Architecture

### 3.1 Survey types

Echo supports four distinct survey types:

1. **Core staff survey** — full 6-domain instrument. Run termly (3x/year). Target completion time: 12 minutes.
2. **Pulse survey** — rotating subset of 3–5 items. Run monthly between Core waves. Target time: 2 minutes.
3. **ECT check-in** — separate 10-item instrument. Run monthly for staff in induction years 1–2. Target time: 5 minutes.
4. **Exit survey** — triggered when a staff member resigns or marks intent-to-leave. Target time: 8 minutes.

### 3.2 Response scales

All quantitative items use a 5-point Likert scale. Two scale types are used:

- **Agreement scale**: 1=Strongly disagree, 2=Disagree, 3=Neither agree nor disagree, 4=Agree, 5=Strongly agree
- **Frequency scale**: 1=Never, 2=Rarely, 3=Sometimes, 4=Often, 5=Always

Each item declares its scale type. The `5` end is always the favourable end after any reverse-scoring is applied.

### 3.3 Reverse-scored items

Items marked `reverse: true` in the question bank are negatively worded (e.g. "I regularly work weekends to keep up"). Before any aggregation, the score must be transformed: `corrected = 6 - raw`. All downstream logic operates on corrected scores. The raw score should still be stored for audit.

### 3.4 Anonymity floor

Echo must never display results from a sample of fewer than 5 respondents in any segment view. Default to 5 as the minimum; allow an admin setting to raise this to 7 or 10. When a segment falls below the floor, the UI must show "Suppressed — insufficient responses to preserve anonymity" rather than the data.

---

## 4. Data Model

All tables must use Row-Level Security. Multi-tenancy is via `trust_id` and `school_id` foreign keys.

### 4.1 Tables

```sql
-- Survey definitions (template — versioned)
create table surveys (
  id uuid primary key default gen_random_uuid(),
  trust_id uuid references trusts(id), -- null = global template
  name text not null,
  survey_type text not null check (survey_type in ('core', 'pulse', 'ect', 'exit')),
  version int not null default 1,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- The seven domains
create table domains (
  id text primary key, -- e.g. 'workload', 'wellbeing', 'leadership', 'culture', 'behaviour', 'growth', 'ect'
  name text not null,
  description text,
  display_order int not null
);

-- Question bank
create table questions (
  id uuid primary key default gen_random_uuid(),
  domain_id text references domains(id) not null,
  text text not null,
  scale_type text not null check (scale_type in ('agreement', 'frequency')),
  reverse boolean default false,
  is_swemwbs boolean default false, -- flag for validated SWEMWBS items, handled separately
  is_retention_intent boolean default false, -- flag the headline retention items
  tags text[] default '{}',
  active boolean default true,
  created_at timestamptz default now()
);

-- Items in a specific survey (questions can be reused across surveys/versions)
create table survey_questions (
  survey_id uuid references surveys(id) on delete cascade,
  question_id uuid references questions(id),
  display_order int not null,
  required boolean default false,
  primary key (survey_id, question_id)
);

-- Open-text qualitative prompts (separate table since structure differs)
create table qualitative_prompts (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  category text not null check (category in ('recognition', 'blog', 'diagnostic', 'exit', 'pulse')),
  active boolean default true
);

create table survey_qualitative_prompts (
  survey_id uuid references surveys(id) on delete cascade,
  prompt_id uuid references qualitative_prompts(id),
  display_order int not null,
  required boolean default false,
  primary key (survey_id, prompt_id)
);

-- A survey wave — a specific instance of a survey running at a specific school in a specific window
create table survey_waves (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid references surveys(id) not null,
  school_id uuid references schools(id) not null,
  opens_at timestamptz not null,
  closes_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'open', 'closed', 'archived')),
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Anonymous submissions (one per respondent per wave)
create table submissions (
  id uuid primary key default gen_random_uuid(),
  wave_id uuid references survey_waves(id) on delete cascade not null,
  -- IMPORTANT: no foreign key to users. Submissions are anonymous.
  -- A submission_token is generated server-side and given to the user via single-use link.
  submission_token text unique not null,
  -- Demographic segments collected on submission (all optional to preserve anonymity if small sample):
  role text, -- 'teacher', 'leader', 'support', 'ect'
  years_at_school text, -- '<1', '1-3', '3-5', '5-10', '10+'
  key_stage text, -- 'eyfs', 'ks1', 'ks2', 'mixed'
  is_ect boolean default false,
  submitted_at timestamptz default now()
);

-- Quantitative answers
create table answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade not null,
  question_id uuid references questions(id) not null,
  raw_score int not null check (raw_score between 1 and 5),
  -- corrected_score is computed and stored at insert time for query efficiency
  corrected_score int not null check (corrected_score between 1 and 5)
);

-- Qualitative answers
create table qualitative_answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade not null,
  prompt_id uuid references qualitative_prompts(id) not null,
  text text not null,
  -- AI-derived fields (populated by background job):
  sentiment numeric, -- -1.0 to 1.0
  themes text[],
  risk_flags text[], -- e.g. {'burnout', 'considering_leaving', 'safeguarding'}
  is_shareable_for_newsletter boolean default false,
  shareable_consent_given boolean default false,
  ai_processed_at timestamptz
);

-- Computed wave-level metrics (cached for dashboard performance)
create table wave_metrics (
  wave_id uuid references survey_waves(id) on delete cascade primary key,
  response_count int not null,
  response_rate numeric, -- decimal e.g. 0.72
  domain_scores jsonb not null, -- { "workload": 67.4, "wellbeing": 58.2, ... }
  swemwbs_mean numeric,
  retention_intent_school numeric, -- % favourable on item
  retention_intent_profession numeric,
  flags text[] not null default '{}',
  computed_at timestamptz default now()
);

-- ECT risk register
create table ect_risk_events (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id),
  school_id uuid references schools(id) not null,
  -- ECTs are tracked by a per-school pseudonymous code (not real identity) to allow trend tracking
  -- without breaking anonymity. The school admin maps codes to people via offline lookup.
  ect_code text not null,
  severity text not null check (severity in ('green', 'amber', 'red')),
  triggers text[] not null,
  created_at timestamptz default now(),
  resolved_at timestamptz,
  resolution_notes text
);
```

### 4.2 RLS policies (summary)

- **Staff submissions:** anyone with a valid `submission_token` can insert. No row-level read access for users on submissions or answers.
- **School admins:** can read aggregated `wave_metrics` and aggregated views over `answers` for waves at their school. Cannot read individual `submissions` or `answers`.
- **MAT admins:** same as school admins but across all schools in their `trust_id`.
- **ECT risk events:** readable only by school admins for their school; resolution notes editable.
- **Qualitative answers:** readable by school admins only when `shareable_consent_given = true` and `is_shareable_for_newsletter = true`. Diagnostic/exit responses readable in aggregate-themed form only — individual responses gated behind a separate "Sensitive view" permission with audit logging.

### 4.3 Anonymity model

Echo is fundamentally a trust product. Implementation rules:

- The submission flow generates a single-use token per recipient, sent via email or a link distributed by the school admin. The token maps to a `survey_waves.id` but not to a user identity.
- Staff identity is never stored in `submissions`, `answers`, or `qualitative_answers`.
- ECT check-ins use a per-school `ect_code` that allows month-over-month trend tracking for an individual ECT without storing their real identity. The school's induction lead maintains the code-to-person mapping offline (Echo never sees it).
- Any UI that could leak identity (filtering by a combination of demographics that produces a small N) must apply the anonymity floor (Section 3.4).

---

## 5. The Question Bank

Below is the full seed data for the question bank. This should be loaded into the `questions` table at system bootstrap. All items have been derived from validated instruments or the research base in Section 2.

### 5.1 Workload & Working Hours (domain_id: `workload`)

| # | Text | Scale | Reverse |
|---|---|---|---|
| W1 | The volume of work I am expected to complete is manageable within my contracted hours. | agreement | false |
| W2 | I am able to switch off from work outside of school hours. | frequency | false |
| W3 | The amount of time I spend on tasks unrelated to teaching is reasonable. | agreement | false |
| W4 | I regularly work in the evenings or at weekends to keep up with my workload. | frequency | **true** |
| W5 | Recent changes at school have made my workload more manageable. | agreement | false |
| W6 | The marking, planning, and assessment expectations in this school are proportionate. | agreement | false |
| W7 | I have enough time in the school day to prepare effectively for teaching. | agreement | false |
| W8 | Administrative tasks take time away from things that matter more to me as a teacher. | agreement | **true** |

### 5.2 Wellbeing & Mental Health (domain_id: `wellbeing`)

The seven SWEMWBS items must be flagged `is_swemwbs: true` and stored separately for the validated SWEMWBS score. All use the frequency scale with prompt "Over the last two weeks…".

| # | Text (SWEMWBS) | Scale | Reverse | SWEMWBS |
|---|---|---|---|---|
| S1 | I've been feeling optimistic about the future | frequency | false | true |
| S2 | I've been feeling useful | frequency | false | true |
| S3 | I've been feeling relaxed | frequency | false | true |
| S4 | I've been dealing with problems well | frequency | false | true |
| S5 | I've been thinking clearly | frequency | false | true |
| S6 | I've been feeling close to other people | frequency | false | true |
| S7 | I've been able to make up my own mind about things | frequency | false | true |

**Important — SWEMWBS licensing.** SWEMWBS is free for non-commercial use with registration via Warwick University. Commercial use (which Echo is) requires a paid licence. Echo must either obtain this licence before launch, or use the supplementary wellbeing items below as a non-licensed alternative, or run SWEMWBS only for trusts that have themselves licensed it. The codebase should support feature-flagging SWEMWBS on/off per trust.

Supplementary wellbeing context items (no licence needed):

| # | Text | Scale | Reverse |
|---|---|---|---|
| WB1 | In the last two weeks, my work has negatively affected my physical health. | frequency | **true** |
| WB2 | In the last two weeks, my work has negatively affected my sleep. | frequency | **true** |
| WB3 | I feel I have a sustainable balance between work and the rest of my life. | agreement | false |
| WB4 | I have felt close to burnout in the past term. | frequency | **true** |

### 5.3 Leadership & Voice (domain_id: `leadership`)

| # | Text | Scale | Reverse |
|---|---|---|---|
| L1 | Senior leaders in this school genuinely consider staff wellbeing when making decisions. | agreement | false |
| L2 | When I raise a concern, I trust that something will be done about it. | agreement | false |
| L3 | My line manager understands the demands of my role. | agreement | false |
| L4 | Senior leaders communicate clearly about the reasons behind decisions. | agreement | false |
| L5 | I feel comfortable being honest with senior leaders about challenges I face. | agreement | false |
| L6 | Decisions about my workload are made without consulting me. | agreement | **true** |
| L7 | Recent changes at school were communicated well in advance. | agreement | false |
| L8 | The leadership team in this school models the working culture they expect. | agreement | false |

### 5.4 Culture, Recognition & Belonging (domain_id: `culture`)

| # | Text | Scale | Reverse |
|---|---|---|---|
| C1 | I feel valued for the work I do at this school. | agreement | false |
| C2 | I am recognised when I do something well. | frequency | false |
| C3 | I would recommend this school as a place to work to a colleague I respected. | agreement | false |
| C4 | The relationships between staff in this school are positive and supportive. | agreement | false |
| C5 | People in this school are quick to criticise but slow to praise. | agreement | **true** |
| C6 | I feel a sense of belonging at this school. | agreement | false |
| C7 | I am proud to tell people I work at this school. | agreement | false |
| C8 | Different roles in the school (teaching, support, pastoral) feel equally valued. | agreement | false |

### 5.5 Pupil Behaviour & Safety (domain_id: `behaviour`)

| # | Text | Scale | Reverse |
|---|---|---|---|
| B1 | The behaviour policy in this school is consistently applied. | agreement | false |
| B2 | I feel supported by senior leaders when I deal with challenging pupil behaviour. | agreement | false |
| B3 | Pupil behaviour regularly affects my ability to teach effectively. | frequency | **true** |
| B4 | I feel physically safe at work. | agreement | false |
| B5 | I have experienced verbal abuse from a pupil or parent in the past term. | frequency | **true** |
| B6 | Parents and carers treat staff in this school respectfully. | agreement | false |
| B7 | SEND pupils receive the support they need without disproportionate strain on classroom teachers. | agreement | false |
| B8 | The school has effective routines for managing complaints from parents. | agreement | false |

### 5.6 Growth, Autonomy & Career (domain_id: `growth`)

| # | Text | Scale | Reverse | Notes |
|---|---|---|---|---|
| G1 | I have professional development opportunities that match my career goals. | agreement | false | |
| G2 | I have appropriate autonomy in how I plan and deliver lessons. | agreement | false | |
| G3 | There is a clear pathway for someone like me to grow at this school. | agreement | false | |
| G4 | My appraisal process supports my development meaningfully. | agreement | false | |
| G5 | I receive useful feedback on my teaching from a colleague or leader at least once a term. | agreement | false | |
| G6 | I feel pressure to teach in a way that doesn't match my professional judgement. | agreement | **true** | |
| G7 | I would still be working at this school in two years if circumstances stayed broadly the same. | agreement | false | **is_retention_intent: true (school)** |
| G8 | I would still be working in teaching in two years. | agreement | false | **is_retention_intent: true (profession)** |

### 5.7 ECT Module (domain_id: `ect`)

Monthly check-in for staff in induction years 1–2. Used only in `survey_type: 'ect'`.

| # | Text | Scale | Reverse |
|---|---|---|---|
| E1 | My mentor has time to support me effectively. | frequency | false |
| E2 | I feel comfortable raising concerns with my mentor. | agreement | false |
| E3 | The teaching load I have been given is appropriate for my stage of training. | agreement | false |
| E4 | I am clear about what success looks like in my role this term. | agreement | false |
| E5 | I feel I belong at this school. | agreement | false |
| E6 | I have felt overwhelmed in the past two weeks. | frequency | **true** |
| E7 | I am getting useful feedback on my teaching. | agreement | false |
| E8 | I would still choose to be in teaching if I were making the decision today. | agreement | false |
| E9 | I have someone in this school I can talk to honestly when things are hard. | agreement | false |

Plus one mandatory qualitative prompt per check-in: *"What is the single biggest thing that would help you right now?"*

### 5.8 Qualitative prompts

```
RECOGNITION (for newsletter / staff spotlight):
QR1: What is one thing a colleague has done this term that made your job easier or your week better?
QR2: Describe a moment this term when you felt proud of being a teacher.
QR3: Tell us about something a child said or did this term that reminded you why you do this.
QR4: What is something you tried in your classroom this term that worked better than you expected?
QR5: What is one small thing about this school that you would not want to change?

BLOG (for the wellbeing column, quarterly):
QB1: What helps you sustain yourself in this job?
QB2: What is the most useful piece of professional advice you've been given, and who gave it to you?
QB3: Describe a time you felt really supported by a colleague or leader. What did that look like?
QB4: What is one thing you wish someone had told you when you started teaching?
QB5: If you could give the next generation of teachers one piece of advice, what would it be?

DIAGNOSTIC (auto-surfaced when a domain is in Emerging Risk or below):
QD1: You said [DOMAIN] is a challenge — can you tell us which specific tasks or expectations contribute most?
QD2: What would have to change for you to feel differently about this?
QD3: If a senior leader was reading this, what would you want them to understand?
QD4: What is one practical change that would make the biggest difference?

EXIT (triggered on resignation or intent-to-leave):
QE1: What is pushing you towards leaving — is it this school, this profession, or both?
QE2: What would change your mind?
QE3: Has this been building for a while, or has something specific happened?
QE4: Who or what has helped you stay this long?

PULSE (rotating, optional final question on monthly pulses):
QP1: What is one thing this month that went well?
QP2: What is one thing that would have made this month easier?
```

Each qualitative answer should display a consent checkbox: *"I'm happy for an anonymised version of this response to be used in the school newsletter or wellbeing communications."* This sets `shareable_consent_given`. The school admin separately approves `is_shareable_for_newsletter` before any use.

---

## 6. Scoring Engine

### 6.1 Per-answer scoring

On insert into `answers`:

```typescript
function computeCorrectedScore(rawScore: number, reverse: boolean): number {
  return reverse ? 6 - rawScore : rawScore;
}
```

### 6.2 Per-item metrics (across submissions in a wave)

For each question within a wave, compute:

```
favourable_pct    = count(corrected_score >= 4) / total_responses * 100
unfavourable_pct  = count(corrected_score <= 2) / total_responses * 100
neutral_pct       = count(corrected_score == 3) / total_responses * 100
mean_score        = avg(corrected_score)
distribution      = histogram of corrected_score values 1..5
```

Always store and surface BOTH `favourable_pct` and `unfavourable_pct`. The gap and the distribution shape (especially bimodality) are the real signal — a mean alone hides bimodal distributions, which are the most dangerous pattern.

### 6.3 Per-domain scores

For each domain in a wave, compute a **0–100 domain index**:

```
domain_index = (mean of corrected_scores across all domain items / 5) * 100
```

Exclude SWEMWBS items from the standard wellbeing domain score — SWEMWBS is reported separately as a SWEMWBS-specific score.

### 6.4 SWEMWBS score (when licensed and enabled)

SWEMWBS scoring uses the Warwick-published metric transformation table. Raw sum (7 items × 1–5 = range 7–35) is converted to a transformed score (range ~7–35 with interval properties).

Reference thresholds (from Warwick / Health Survey for England norms):

- **Low wellbeing:** transformed score < 19.5 (bottom 15% of UK population)
- **Average wellbeing:** transformed score 19.5 – 27.5
- **High wellbeing:** transformed score > 27.5 (top 15%)

UK general adult population mean: 23.5, SD 3.9.

Echo should report the school's SWEMWBS group mean and the % of staff in each band.

### 6.5 Interpretation bands (domain index)

| Domain index | Band | Implication |
|---|---|---|
| 80–100 | Strong | Protect what's working. Surface in staff communications. |
| 65–79 | Stable | Monitor trend. Action only if declining wave-on-wave. |
| 50–64 | Emerging risk | Auto-surface diagnostic qualitative prompts. Recommend SLT discussion. |
| 35–49 | Significant risk | Generate intervention plan. Escalate to Trust if MAT-level. |
| 0–34 | Critical | Whole-school issue. Flag in board pack with red status. |

### 6.6 Headline retention metrics

Report these two items as standalone top-level metrics, NOT just part of the Growth domain:

- **Retention Intention (school)**: `favourable_pct` of item G7
- **Retention Intention (profession)**: `favourable_pct` of item G8

These are the most predictive items in the entire instrument — track them at every wave, plot them over time as the #1 dashboard chart, and report them at the top of every board pack.

---

## 7. Risk Flag Rules

A `wave_metrics.flags` array is populated when any of these conditions are met. Each flag triggers a corresponding action in the recommendations layer (Section 9).

```
FLAG: low_item_favourable
  WHEN: any single item favourable_pct < 40

FLAG: low_domain_score
  WHEN: any domain_index < 50

FLAG: retention_intent_school_low
  WHEN: G7 favourable_pct < 60

FLAG: retention_intent_profession_low
  WHEN: G8 favourable_pct < 60

FLAG: swemwbs_group_low
  WHEN: SWEMWBS group mean < 21 (well below UK norm of 23.5)

FLAG: significant_decline
  WHEN: any item or domain shows a >10 percentage point decline vs previous wave

FLAG: low_response_rate
  WHEN: response_rate < 0.5
  (NOTE: still compute metrics but mark "low confidence" in UI)

FLAG: bimodal_distribution
  WHEN: any item has both favourable_pct >= 30 AND unfavourable_pct >= 30
  (indicates polarised staff experience — often more concerning than uniformly mediocre scores)
```

### 7.1 ECT-specific risk flags

Per ECT submission, compute:

```
For each ECT item, classify:
  GREEN: corrected_score in {4, 5}
  AMBER: corrected_score == 3
  RED:   corrected_score in {1, 2}

Trigger ect_risk_events.severity = 'red' when:
  - 3+ items are RED in a single check-in, OR
  - The retention intent item (E8) is RED, OR
  - Two consecutive months show any single item declining by 1+ point

Trigger severity = 'amber' when:
  - 2 items are RED, OR
  - 4+ items are AMBER, OR
  - One consecutive month decline on E6 (overwhelmed) or E8 (intent)

Plus: scan the mandatory qualitative response for keywords:
  HIGH_CONCERN_KEYWORDS = [
    'overwhelmed', 'leaving', 'quit', "can't cope", 'crying', 'unwell',
    'no support', 'alone', 'panic', 'breakdown', 'mental health', 'depression', 'anxiety'
  ]
  If any present, escalate severity by one level.
```

When `severity = 'red'`, send a notification to the school's induction lead (line manager — NOT the mentor, since the mentor may be part of the problem). Notification template should be supportive in tone, not punitive.

---

## 8. AI / Intelligence Layer

Echo uses the Anthropic SDK for three AI-powered features.

### 8.1 Qualitative response processing

When a `qualitative_answer` is submitted, queue a background job that calls Claude to:

1. Extract `sentiment` (-1.0 to 1.0)
2. Extract `themes` (max 5 tags from a controlled vocabulary — see §8.4)
3. Identify `risk_flags` from a fixed list: `burnout`, `considering_leaving`, `bullying`, `safeguarding`, `discrimination`, `unmanageable_workload`, `behaviour_crisis`, `personal_crisis`
4. Suggest whether the response is suitable for the newsletter (positive, anonymisable, no identifiable details) — staff still has final consent control

Prompt template:

```
You are analysing an anonymous response from a teacher's wellbeing survey for Echo.
Your output must be valid JSON only, no preamble.

Response: """{TEXT}"""
Prompt context: {PROMPT_CATEGORY}

Return:
{
  "sentiment": <number -1.0 to 1.0>,
  "themes": [<up to 5 from CONTROLLED_VOCAB>],
  "risk_flags": [<from FIXED_RISK_LIST or empty>],
  "newsletter_candidate": <true|false>,
  "newsletter_reason": "<one sentence explaining>"
}

If the response indicates any of {SAFEGUARDING_CONCERNS}, set risk_flags accordingly AND set newsletter_candidate to false regardless of tone.
```

Any response flagged with `safeguarding` must be escalated to the school's designated safeguarding lead within 24 hours, by email notification — not buried in a dashboard.

### 8.2 Action recommendations

After `wave_metrics` is computed, run a generation job that produces 3–5 prioritised, actionable recommendations for the school's leadership team. Input: the metrics, the flags, the top themed qualitative responses. Output: a structured action plan, written for a headteacher audience, grounded in the actual data from the wave.

The recommendations must be specific (not generic), reference the data, and be feasible at school level. Avoid generic "implement a wellbeing initiative" platitudes.

### 8.3 Newsletter generation

Echo's newsletter feature pulls from the qualitative pool when staff have consented. Surface a "Newsletter pool" view for school admins showing all qualitative responses where:
- `shareable_consent_given = true`
- `newsletter_candidate = true` (per AI analysis)
- `risk_flags` is empty
- Admin has approved (`is_shareable_for_newsletter = true`)

### 8.4 Controlled vocabularies

Themes (for qualitative analysis):
```
['workload', 'marking', 'planning', 'time_pressure', 'mentor_support',
 'colleague_support', 'recognition', 'communication', 'pupil_behaviour',
 'parent_relations', 'send', 'leadership_visibility', 'autonomy',
 'cpd', 'pay', 'flexible_working', 'physical_environment',
 'staff_relationships', 'school_culture', 'community']
```

---

## 9. Dashboard & Reporting

### 9.1 Three audience views

Echo dashboards must support three distinct audiences with appropriate data shaping:

1. **Headteacher view** — single school, full detail, qualitative themes, action recommendations
2. **MAT executive view** — all schools in trust, benchmark-style comparison, drill-down to school
3. **Board pack view** — printable / exportable PDF formatted for trustee meetings, executive summary + key metrics + trend charts

### 9.2 Required dashboard components

**For the Headteacher view:**

- Hero metric: Retention Intention (school) — current value + trend line vs last 3 waves
- Secondary metric: Retention Intention (profession)
- Six-domain radar/spider chart showing current domain indices
- Domain-by-domain breakdown with band colours
- Active risk flags with explanations
- Top 3 AI-generated action recommendations
- Qualitative themes word-cloud or top-themes list
- Response rate (with confidence note if <50%)
- ECT risk register (list of amber/red events, resolution status)

**For the MAT executive view:**

- All schools in trust, listed with summary status (green/amber/red domain dots)
- Trust-wide benchmarks for each domain
- Schools flagged as outliers (top or bottom)
- Trend comparison: schools improving vs declining
- ECT retention rates per school

**For the Board pack export:**

- One-page executive summary
- Retention intention trend (12 months)
- Six-domain summary table
- Year-over-year SWEMWBS comparison
- Flag summary (count of red/amber/green schools)
- Action plan summary (what each school is doing)

### 9.3 Benchmarking

Once Echo has data from 10+ schools, surface anonymised benchmarks: "Your school sits at the 60th percentile for Leadership & Voice among similar-sized primary schools in MATs." Benchmarks should be peer-grouped by:
- School phase (primary, junior)
- Size band (small <200, medium 200–400, large >400 pupils)
- MAT vs LA-maintained

Benchmarking is the durable moat once data accrues — design the data model from day 1 to support it (aggregate views by peer group, cached).

### 9.4 Ofsted evidence pack

Provide a one-click export titled "Staff Voice Evidence" — a PDF showing:
- Survey methodology (validated instruments used, anonymity, response rate)
- Recent wave headline metrics
- Domain trends over 12 months
- Action recommendations and a place for the school to record actions taken
- Education Staff Wellbeing Charter alignment statement

This export is positioned as inspection-ready evidence per the Ofsted 2025 framework. Headteachers and SLTs can hand it to inspectors verbatim.

---

## 10. Survey Distribution & Anonymity Flow

### 10.1 Distribution flow

1. School admin schedules a `survey_wave` with open/close dates.
2. School admin uploads a CSV of staff email addresses (this list is stored only on the admin's machine — Echo does not retain it).
   Alternative: admin generates N anonymous links and distributes them via the school's own mailer.
3. Echo generates N submission tokens, each tied to the wave but not to an email.
4. The admin's tool sends each email a unique link `[echo-domain]/respond/{token}`.
5. Recipient opens link, completes survey, submission is stored with no identifiable trace.
6. Tokens expire at `closes_at`.

### 10.2 Demographic data tradeoff

Demographic segments (role, years at school, key stage) are valuable for segmented reporting but risk identification in small schools. Implementation rules:

- Demographics are always optional ("Prefer not to say" must be a real option)
- The anonymity floor (Section 3.4) applies to every segment view
- Echo never lets an admin combine demographic filters that produce N < anonymity floor
- For very small schools (<15 staff), default to suppressing all demographic breakdowns

### 10.3 Reminders

Echo sends 2 reminder pulses during a wave window — at 50% elapsed and 80% elapsed. These go via the same anonymous link mechanism. Never identify who has and hasn't responded.

---

## 11. Implementation Order & Acceptance Criteria

Build in this order. Each step has acceptance criteria that must pass before moving to the next.

### Phase 1 — Foundation (week 1)

**Deliverable:** Schema, seed data, auth integration, RLS policies.

- [ ] All tables from Section 4.1 created in Supabase
- [ ] All RLS policies from Section 4.2 in place and verified with test users
- [ ] Question bank from Section 5 seeded
- [ ] Qualitative prompts from Section 5.8 seeded
- [ ] Three default surveys created: Core, Pulse, ECT (with question mappings)

### Phase 2 — Submission flow (week 2)

**Deliverable:** Staff can complete a survey anonymously via a tokenised link.

- [ ] Admin can create a `survey_wave` and generate N tokens
- [ ] `/respond/{token}` page renders the correct survey with all items
- [ ] Likert items render with appropriate scale labels (agreement vs frequency)
- [ ] Reverse items are stored as raw + computed corrected scores
- [ ] Qualitative prompts capture consent checkbox state
- [ ] Submission succeeds anonymously — no user FK on submissions table
- [ ] Token is invalidated after use
- [ ] Submission completes in <12 mins for core, <5 mins for ECT, <2 mins for pulse (manual UX test)

### Phase 3 — Scoring engine (week 3)

**Deliverable:** Server-side job that computes metrics for a closed wave.

- [ ] On wave `status -> 'closed'`, a job populates `wave_metrics`
- [ ] All per-item, per-domain, retention-intent metrics correct (test with seeded data)
- [ ] SWEMWBS transformation table applied correctly (test against published values)
- [ ] All risk flag rules from Section 7 fire correctly (test each rule)
- [ ] ECT risk events created correctly for each ECT submission

### Phase 4 — Headteacher dashboard (week 4)

**Deliverable:** A school admin can view the full headteacher dashboard for their school.

- [ ] Hero metric and trend chart render with real data
- [ ] Six-domain radar chart renders
- [ ] Each domain shows index, band, and underlying items with favourable/unfavourable %
- [ ] Risk flags list displays correctly
- [ ] Anonymity floor enforced everywhere (test by attempting to view a segment with N=3)
- [ ] ECT risk register lists active amber/red events with resolution form

### Phase 5 — AI features (week 5)

**Deliverable:** Qualitative processing, action recommendations, newsletter pool.

- [ ] Background job calls Claude API to process each qualitative answer
- [ ] Themes, sentiment, risk_flags, newsletter_candidate stored
- [ ] Safeguarding flags trigger email to designated lead within 24 hours
- [ ] Action recommendations generate for each closed wave
- [ ] Newsletter pool view shows only consented + approved responses

### Phase 6 — MAT + board views (week 6)

**Deliverable:** MAT exec view and board-pack PDF export.

- [ ] MAT exec can see all schools in trust
- [ ] Outlier detection works
- [ ] PDF export contains all elements from Section 9.2 (board pack view)
- [ ] Ofsted Evidence Pack export works

### Phase 7 — Polish & launch readiness (week 7+)

- [ ] Benchmarking enabled when peer group N >= 10
- [ ] Email templates for invitations, reminders, escalations
- [ ] Onboarding flow for school admins
- [ ] Documentation for sign-ups to the Education Staff Wellbeing Charter
- [ ] SWEMWBS licence in place OR licensed-only feature flag working

---

## 12. Non-functional requirements

- **Privacy:** Submissions and answers must never be retrievable to a specific user identity. Database backups must respect the same constraint.
- **Performance:** Dashboard pages should render with cached `wave_metrics` in <500ms.
- **Audit:** Any view of individual qualitative diagnostic or exit responses must log to an audit table including the viewer's user ID and timestamp.
- **GDPR:** Survey responses are personal data even if anonymised. Echo must support data deletion requests at the wave level (delete all submissions for a wave) and at the trust level. Privacy notice must be shown before submission.
- **Accessibility:** WCAG 2.1 AA. Likert items must be operable by keyboard, screen-reader compatible, and not rely solely on colour.

---

## 13. Glossary

- **MAT** — Multi-Academy Trust. A legal entity running multiple schools.
- **ECT** — Early Career Teacher. Statutory induction lasts two years in England.
- **SWEMWBS** — Short Warwick-Edinburgh Mental Wellbeing Scale. 7-item validated wellbeing measure.
- **Domain index** — Echo's 0–100 score for a given retention driver domain.
- **Retention intention** — Items G7 and G8. The single most predictive signal in the survey.
- **Wave** — One instance of a survey running at a school in a specific time window.
- **Anonymity floor** — Minimum N below which results are suppressed in any segment.
- **DfE Education Staff Wellbeing Charter** — Voluntary commitment for state schools to measure and publish staff wellbeing.

---

## 14. References (for evidence-backed claims in this spec)

The following sources underpin the design decisions. Claude Code does not need to retrieve these — they're listed for human review:

- DfE *Working Lives of Teachers and Leaders* survey, Wave 3 (2024) and Wave 4 (2025)
- Education Support *Teacher Wellbeing Index* 2024 and 2025
- DfE *Education Staff Wellbeing Charter* (2021)
- Ofsted *Education Inspection Framework* (November 2025 update)
- DfE *Academy Trust Governance Guide* (2025)
- NFER *Teacher Labour Market in England Annual Report* 2024
- Warwick *SWEMWBS* validation and norms (Tennant et al. 2007; Stewart-Brown et al. 2017)
- CORC / Anna Freud *Wellbeing Measurement for Schools — Staff Survey* methodology

---

**End of specification.**

When implementing: read Section 11 for build order. When ambiguity arises about a design decision, default to whichever interpretation better protects respondent anonymity, even at the cost of feature richness.
