# Echo — Full Product Brief for Loveable
> Paste this entire document into a new Loveable chat before writing a single line of code.

---

## The problem we're solving

There is a serious and growing teacher retention crisis in the UK. Teachers are leaving the profession at an alarming rate, and research consistently points to the same root causes: feeling unheard, unsupported, undervalued, and burned out by the environment they work in.

Schools and Multi-Academy Trusts (MATs) currently have no structured, ongoing way to listen to their staff at scale. Exit interviews happen too late. Annual reviews are too infrequent. There is no tool that gives leaders a real-time, honest picture of how their teachers are feeling — and more importantly, what to do about it.

**Echo solves this.** It gives MATs and schools a monthly pulse on staff wellbeing and sentiment, turns that data into actionable recommendations, and helps schools communicate their culture improvements both internally and externally — so they can retain the teachers they have and attract new ones.

---

## What Echo is

Echo is a SaaS platform sold to Multi-Academy Trusts, who then roll it out across their member schools. It has three core jobs:

1. **Listen** — collect honest, structured feedback from teaching staff every month via a wellbeing survey
2. **Understand** — surface that data as clear insights and AI-powered recommendations for school leaders and MAT leaders
3. **Share** — transform the data and culture wins into a staff newsletter and shareable social graphics, so schools can demonstrate they are listening and improving

The product is not a counselling tool or a HR complaints system. It is a structured, lightweight feedback loop that gives leaders the right data to make better decisions about their school culture — and gives teachers a voice.

---

## Who uses it

### MAT leaders (the buyer)
The Multi-Academy Trust purchases Echo. A MAT leader or operations director logs in and can see aggregated data across all schools in their trust. They want a high-level view of which schools are thriving and which need support — something they can report to the board. They are not doing the day-to-day work inside individual schools.

### School leaders / headteachers (the operator)
Each school within the MAT has its own login. The headteacher or a designated leader logs in to see their school's specific data, read the AI recommendations, manage the newsletter, and act on the feedback. This is the person who uses Echo most regularly.

### Teaching staff (the contributor)
Teachers fill out the monthly survey. They may also submit a staff blog post or a shout-out for a colleague. They do not have a full dashboard login — they interact with Echo through simple, frictionless forms sent to them via link. The experience for staff must feel safe, quick, and worthwhile — not like another admin burden.

### ECTs — Early Career Teachers (a protected group)
ECTs (teachers in their first two years) are the highest-risk group for leaving the profession. Echo tracks ECT check-ins separately so school leaders and MAT leaders can identify ECTs who may be struggling before they resign.

---

## Two login types

### MAT login — trust-wide view
- Sees all schools in the trust on one dashboard
- **Heat map / RAG status** (Red, Amber, Green) for each school across each survey category (workload, support, leadership, belonging, etc.)
- Can drill into any individual school's data
- Can see trust-wide trends over time
- Generates a trust-level report suitable for board reporting
- Cannot see individual staff responses — only aggregated school-level data

### School login — single school view
- Sees their own school's dashboard only
- Full access to survey results, AI recommendations, newsletter builder, blog, ECT tracker
- Manages their school's accent colour and branding
- Invites staff to surveys via link

---

## Core features

### 1. Monthly staff wellbeing survey

The heart of the product. Every month, teaching staff receive a link to fill out a short survey. It takes no more than 5 minutes.

**Survey design:**
- Built by the school leader or MAT using Echo's survey builder
- Questions cover categories relevant to teacher retention: workload, feeling supported, leadership quality, sense of belonging, professional development, work-life balance
- Mix of question types: 1–10 scale ratings, multiple choice, and free-text responses
- **Anonymous by design** — no staff names attached to responses. This is critical for getting honest data. Staff must feel safe.
- One survey per month per school. Results aggregate automatically.

**Survey builder (for leaders):**
- Drag and drop question builder
- Leaders can add, remove, reorder questions
- Can attach photos or images to questions or the survey intro
- Preview before sending
- Send via a shareable link — staff click the link, fill it out, done. No login required for staff.

### 2. Leadership dashboard

The school leader's main screen. Should feel like a morning briefing — clear, calm, and actionable.

**Dashboard cards:**
- **Overall wellbeing score** — a single number out of 10, with a delta showing change vs last month and a sparkline trend over the past 6 months
- **Category breakdown** — horizontal bar chart showing scores per category (workload, support, belonging, etc.)
- **Survey response rate** — how many staff have responded this month (ring/donut chart)
- **Top AI insight** — one key finding generated by Claude, e.g. "Workload scores have dropped 1.4 points over 3 months — this pattern often precedes increased absence. Consider reviewing PPA time allocation."
- **ECT risk monitor** — traffic light summary of ECTs: On Track / Watch / At Risk
- **Latest recognition** — most recent staff shout-out or nomination, shown with the school's accent colour

### 3. AI recommendations

After each survey closes, Echo uses Claude (Anthropic API) to analyse the results and generate:

- A plain-English summary of what the data shows
- 3–5 specific, actionable recommendations for the school leader (e.g. "Schedule a whole-staff meeting to address workload concerns raised in Q4 responses")
- A risk flag if any category drops significantly month-on-month
- Suggested content for the newsletter based on the data

These recommendations appear on the dashboard and in the newsletter builder. They are not generic — they are generated from that school's actual data.

### 4. Qualitative data — staff voice space

Alongside the scored survey, staff have a free-text space where they can write openly. This is not a complaints box — it is framed positively as a place to share:

- Shout-outs for a colleague who did something great
- Something they noticed that made the school feel good
- A suggestion for improvement
- A moment worth celebrating

These submissions feed into the newsletter (with the author's permission, or anonymously) and into the recognition feature on the dashboard. Leaders can review and approve them before they appear publicly.

### 5. Newsletter builder

One of Echo's most distinctive features. After each monthly survey, Echo auto-generates a staff newsletter using the survey data, AI insights, and staff voice submissions.

**How it works:**
- Leader clicks "Generate newsletter" — Claude produces a structured draft using the month's data
- The newsletter is made up of sections: welcome message, wellbeing snapshot, staff spotlight, from-the-team content, what's coming up
- Leader can edit any section, drag and drop sections to reorder them
- Leader can drag and drop photos into the newsletter
- School accent colour is applied automatically to the header, section dividers, and CTA buttons
- Preview exactly how it will look before sending or exporting
- Export as HTML (for email) or as a shareable image/PDF

The newsletter serves a dual purpose: it shares the wins with staff (making them feel heard and valued), and when shared externally it signals to prospective teachers that this is a school that takes culture seriously.

### 6. Shareable social graphics

This is Echo's "Strava moment." Just like Strava produces a beautiful graphic after a run that people want to share, Echo produces a beautiful, branded graphic from the monthly data that schools will want to post on LinkedIn, Twitter/X, or their website.

**What a shareable graphic looks like:**
- Clean, bold design — the school's accent colour as the background or accent
- Key stat front and centre: e.g. "Staff wellbeing: 8.2/10 this month ↑"
- Secondary stats: response rate, top category, recognition count
- School logo (if uploaded) and school name
- Echo branding small in the corner
- Downloadable as a PNG image — one click

The graphic should look good enough that a headteacher would genuinely want to post it. Think less "data export" and more "culture badge." Schools can customise the colour to match their brand so it looks native to their social media presence.

### 7. ECT tracker

Early Career Teachers are the most at-risk group. Echo gives them a separate, lightweight check-in separate from the main staff survey.

**How it works:**
- ECTs receive a monthly (or fortnightly) check-in link — a shorter, more personal set of questions about how they are settling in, whether they feel supported by their mentor, and their overall confidence
- No login required — tokenised link
- School leaders see an ECT dashboard: a table of all ECTs with their latest mood score, trend over time, last check-in date, and a risk status (On Track / Watch / At Risk)
- Risk status is calculated automatically from: check-in frequency, mood trend direction, and score thresholds
- Leaders can click into any ECT's profile to see their full check-in history and notes
- MAT leaders can see ECT risk across all schools in their trust

### 8. Blog / staff voice feed

Staff can submit short written posts — a reflection, a story, a classroom win. Leaders approve or reject before they go live. Approved posts can be pulled into the newsletter automatically and displayed on a staff-facing feed within the platform.

---

## The school accent colour system

Every school has its own colours — their uniform, their logo, their identity. Echo lets each school set a custom accent colour so that everything Echo produces looks like it belongs to them.

**What the accent colour affects:**
- Newsletter header, CTA buttons, section dividers
- Shareable social graphics — the background or key colour of the image
- Recognition spotlight cards on the dashboard
- AI insight badges
- Onboarding and celebration moments in the UI

**How it works technically:**
- Set in Settings by the school leader (colour wheel + hex input + preset swatches)
- Stored as `accent_colour` on the `organisations` table in Supabase
- Injected as a CSS variable (`--color-pop`) at login — all components reference this variable automatically
- Passed into the newsletter HTML generator and the shareable graphic generator so exports also use the school's colour
- Default if not set: Hot Pink `#F72585`

**Why this matters for the product:**
When a school posts a wellbeing graphic to LinkedIn in their own school colours, with their logo, it looks professional and intentional. It becomes something they're proud to share. That shareability is part of how Echo attracts new teachers to the school — and it's part of how Echo markets itself.

---

## What Echo is NOT

- Not a counselling or mental health tool — it does not handle personal disclosures or mental health crises
- Not an HR or complaints system — it is not a channel for formal grievances
- Not a performance management tool — it does not track individual teacher performance
- Not a data dump — everything should be designed to be readable, beautiful, and actionable

---

## User journeys

### A MAT leader on a Monday morning
1. Logs into Echo MAT view
2. Sees the trust heat map — 6 schools displayed, colour-coded RAG by category
3. Notices one school is amber on "Leadership support" for the second month running
4. Clicks into that school — sees the detailed dashboard and reads the AI recommendation
5. Sends the headteacher a message with the recommendation attached
6. Downloads the trust-level summary to include in next week's board report

### A headteacher mid-month
1. Logs in and checks the dashboard — survey is still open, 18/28 staff have responded
2. Sends a reminder link to the remaining staff
3. Reads the latest staff voice submission — a shout-out for the Year 3 teacher
4. Approves it to appear in the newsletter
5. Checks the ECT tracker — one ECT has dropped to Watch status, schedules a conversation

### End of month — newsletter day
1. Survey closes automatically
2. Headteacher clicks "Generate newsletter"
3. Echo produces a draft using the month's data and staff submissions
4. Headteacher edits the welcome message, drags in a photo from a school event
5. Downloads the shareable graphic — posts it to the school's LinkedIn
6. Sends the newsletter to all staff

### A teacher filling in the survey
1. Receives a link by email or WhatsApp from their school
2. Opens the link — no login, no app to download
3. Fills in the survey — 8 questions, 5 minutes
4. Has the option to add a shout-out for a colleague
5. Submits. Done.

---

## Database schema (Supabase)

```sql
-- Organisations (schools / MATs)
create table organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text check (type in ('school','mat')) default 'school',
  mat_id uuid references organisations(id),  -- null if this IS the MAT
  accent_colour text default '#F72585',
  logo_url text,
  created_at timestamptz default now()
);

-- Users
create table users (
  id uuid primary key references auth.users,
  organisation_id uuid references organisations(id),
  role text check (role in ('mat_admin','school_admin','leader','staff','ect')) default 'staff',
  full_name text,
  email text,
  created_at timestamptz default now()
);

-- Surveys
create table surveys (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  title text not null,
  description text,
  questions jsonb not null default '[]',
  status text check (status in ('draft','active','closed')) default 'draft',
  type text check (type in ('staff','ect')) default 'staff',
  created_by uuid references users(id),
  created_at timestamptz default now(),
  closes_at timestamptz
);

-- Survey responses (anonymous)
create table survey_responses (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid references surveys(id),
  organisation_id uuid references organisations(id),
  answers jsonb not null default '{}',
  submitted_at timestamptz default now()
  -- no user_id intentionally — anonymous
);

-- ECT check-ins
create table ect_checkins (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  ect_user_id uuid references users(id),
  mood_score int check (mood_score between 1 and 10),
  support_score int check (support_score between 1 and 10),
  confidence_score int check (confidence_score between 1 and 10),
  notes text,
  submitted_at timestamptz default now()
);

-- Staff voice / shout-outs / blog submissions
create table staff_submissions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  author_id uuid references users(id),
  type text check (type in ('shoutout','blog','suggestion')) default 'shoutout',
  nominee_name text,         -- for shout-outs
  title text,
  content text,
  anonymous boolean default false,
  status text check (status in ('pending','approved','rejected')) default 'pending',
  submitted_at timestamptz default now()
);

-- Generated newsletters
create table newsletters (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  title text,
  content_json jsonb,
  content_html text,
  generated_at timestamptz default now(),
  sent_at timestamptz,
  status text check (status in ('draft','sent')) default 'draft'
);

-- Shareable graphics (metadata only — image generated client-side or via API)
create table shareable_graphics (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  survey_id uuid references surveys(id),
  graphic_url text,
  created_at timestamptz default now()
);
```

Enable RLS on all tables. School users can only access rows where `organisation_id` matches their school. MAT admins can access all schools where `mat_id` matches their organisation.

---

## Brand & design system

### Fonts
- **Display / headings / numbers:** Syne (weight 800) — H1, H2, stat figures, logo wordmark
- **Body / UI / labels:** DM Sans (weight 300 / 400 / 500)

Import both from Google Fonts.

### Colour palette

```css
/* Echo brand — fixed */
--color-bg:            #0B1628;   /* Deep Navy — page background */
--color-surface:       #132040;   /* Navy Mid — cards, panels */
--color-surface-2:     #192B52;   /* Navy Surface — elevated UI */
--color-border:        rgba(255,255,255,0.08);
--color-primary:       #1B6EF3;   /* Electric Blue — CTAs, links, data bars */
--color-primary-light: #4D91FF;   /* Blue Light — hover, gradients */
--color-primary-mist:  #D6E8FF;   /* Blue Mist — light-mode tints */
--color-text:          #FFFFFF;
--color-text-muted:    rgba(255,255,255,0.45);
--color-text-subtle:   rgba(255,255,255,0.2);

/* Tenant accent — set per school, injected at login */
--color-pop:           #F72585;   /* Default: Hot Pink. Replaced by school colour. */
--color-pop-light:     #FF6EB3;
--color-pop-bg:        rgba(247,37,133,0.12);

/* Semantic — data status only */
--color-success:       #3DDC97;
--color-warning:       #F59E3F;
--color-danger:        #E24B4A;
```

### Logo mark — `<EchoMark />`

Three concentric rings radiating from a filled circle — a sonar/ripple motif representing staff feedback rippling outward to create change.

```jsx
export function EchoMark({ size = 32, color = "#1B6EF3", lightColor = "#4D91FF" }) {
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="echo-grad" x1="0" y1="0" x2={size} y2={size} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={lightColor} />
        </linearGradient>
      </defs>
      <circle cx={c} cy={c} r={c * 0.34} fill={color} />
      <circle cx={c} cy={c} r={c * 0.63} fill="none" stroke="url(#echo-grad)" strokeWidth="1.5" opacity="0.55" />
      <circle cx={c} cy={c} r={c * 0.91} fill="none" stroke={color} strokeWidth="1" opacity="0.22" />
    </svg>
  );
}
```

Wordmark: Syne 800, letter-spacing -0.03em. The 'e' in `echo` is rendered in `--color-primary`.

---

## App structure & pages

### Auth
- `/login` — email + password via Supabase Auth. Role determines which dashboard loads on login (MAT view or school view).
- `/onboarding` — first-time setup: school name, type (school/MAT), accent colour picker with live preview, logo upload

### MAT dashboard — `/mat`
Only visible to users with role `mat_admin`.

- **Trust heat map** — grid of all schools, each showing RAG status across categories. Red = score below 5, Amber = 5–6.9, Green = 7+
- School cards show: school name, overall score, response rate, ECT risk count, trend arrow
- Click any school to drill into its full school dashboard (read-only for MAT admin)
- Trust-level trend charts (rolling 6 months, all schools aggregated)
- Board report export — one-click PDF summary of trust-wide data
- ECT risk overview — all ECTs across the trust in one table

### School dashboard — `/dashboard`
Main screen for school leaders.

1. Wellbeing score card — score /10, delta vs last month, 6-month sparkline
2. Category breakdown — horizontal bars: Workload / Support / Leadership / Belonging / Development / Work-life balance
3. Survey response rate — ring chart, X of Y staff responded
4. AI insight card — `✦ New insight` badge (in school accent colour), one key finding + recommendation
5. ECT risk monitor — On Track / Watch / At Risk counts
6. Latest staff voice — most recent approved shout-out or submission, accent colour border

### Surveys — `/surveys`
- List view: all surveys with status (draft / active / closed), response count, close date
- Create/edit survey: drag and drop question builder
  - Question types: 1–10 scale, multiple choice, free text, photo upload
  - Drag to reorder questions
  - Add images to survey intro
- Send: generates a shareable link — no login required for staff
- Results: per-question charts, free-text responses listed, AI summary of results

### Staff survey submission — `/s/[survey_id]`
Public page. No login required.
- Clean, minimal design — not branded heavily, just Echo wordmark
- Mobile-first — most staff will open on their phone
- Progress indicator
- Anonymous — no name collected, this is stated clearly on the page
- Optional shout-out field at the end: "Want to give a colleague a shout-out this month?"
- Submit confirmation: "Thank you — your response has been recorded anonymously."

### ECT tracker — `/ect`
- Table: all ECTs, columns for name, latest mood score, trend (↑↓→), last check-in date, risk status pill
- Risk calculated from: score + trend + check-in frequency
- Click row → ECT profile: check-in history chart, timeline of notes, mentor details
- Send check-in link: generates tokenised URL for each ECT — they click, fill in, done
- Check-in form (`/checkin/[token]`): short, warm, personal. No login. Questions about settling in, mentor support, confidence, overall mood.

### Newsletter — `/newsletter`
- List of past newsletters (month, status, open rate if sent)
- Generate: pulls latest survey data, approved staff submissions, AI recommendations → produces structured draft
- Editor:
  - Sections displayed as editable blocks
  - Drag to reorder sections
  - Click any section to edit text
  - Drag and drop photos into any section
  - School accent colour auto-applied to header stripe, CTA buttons, dividers
- Preview: full render of the newsletter as it will appear
- Export: download as HTML, copy HTML to clipboard
- Shareable graphic: one-click generation of the social graphic from this month's data (see below)

### Shareable graphic — generated from newsletter screen
- Produced as a downloadable PNG
- Bold, clean design using school accent colour
- Shows: overall wellbeing score, top category, response rate, month/year, school name + logo
- Echo mark small in corner
- "Download image" button → saves to device
- School posts to LinkedIn, Twitter, website — looks like their brand, not a generic tool

### Blog & staff voice — `/blog`
- Staff submission form (accessible via link, no login) — type (shout-out / blog post / suggestion), content, option to be anonymous
- Leader review queue: pending submissions listed, approve or reject with one click
- Approved feed: visible to logged-in staff and pulled into newsletter builder

### Settings — `/settings`
- Organisation profile: name, logo upload, school type
- **Accent colour picker:**
  - Colour wheel + hex input
  - 8 preset swatches (school-friendly: deep red, royal purple, forest green, burnt orange, gold, teal, slate, hot pink)
  - Live preview panel showing newsletter header, recognition card, insight badge, data bar — all update in real time
  - Save → writes to `organisations.accent_colour` in Supabase, re-injects CSS variable
- Team: invite staff (sends email with link), assign roles, deactivate users
- Survey schedule: set which day of month survey link is sent
- Integrations: (future) email provider connection for newsletter send

---

## AI — newsletter & insights generation

Use Anthropic SDK (`claude-sonnet-4-20250514`).

### Dashboard insight generation
Called after each survey closes. Analyses score data and generates 1 key insight + 3 recommendations.

### Newsletter generation
```js
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 2500,
  messages: [{
    role: "user",
    content: `You are generating a warm, professional monthly staff newsletter for ${orgName}, a UK primary school.

This newsletter is sent to all teaching staff. Tone: warm, human, celebratory where possible, honest and constructive where needed. Never corporate. Never clinical.

Data for this month:
- Overall wellbeing score: ${wellbeingScore}/10 (${delta > 0 ? '+' : ''}${delta} vs last month)
- Category scores: ${JSON.stringify(categoryScores)}
- Survey response rate: ${responseRate}% (${responded} of ${total} staff)
- Key AI insight: ${topInsight}
- Approved staff shout-outs and submissions: ${JSON.stringify(staffSubmissions)}
- School accent colour: ${accentColour}

Generate a newsletter with exactly these sections:
1. welcome — warm opening from leadership, 2–3 sentences, acknowledge the month
2. wellbeing_snapshot — brief, data-driven, positive framing even if scores are mixed
3. staff_spotlight — feature the top shout-out or recognition, celebratory
4. from_the_team — summarise any approved blog posts or suggestions
5. looking_ahead — forward-looking close, 1–2 sentences

Return ONLY valid JSON in this exact format, no markdown:
{
  "title": "string",
  "sections": [
    { "type": "welcome", "heading": "string", "content": "string" },
    { "type": "wellbeing_snapshot", "heading": "string", "content": "string" },
    { "type": "staff_spotlight", "heading": "string", "content": "string" },
    { "type": "from_the_team", "heading": "string", "content": "string" },
    { "type": "looking_ahead", "heading": "string", "content": "string" }
  ]
}`
  }]
});
```

---

## Key components to build

| Component | Description |
|---|---|
| `<EchoMark size />` | Logo SVG, scales with prop |
| `<TrustHeatMap schools />` | MAT overview grid, RAG colours |
| `<StatCard label value delta trend />` | Dashboard metric card with sparkline |
| `<CategoryBarChart data />` | Horizontal bars, blue gradient fill |
| `<RingChart percent label />` | Response rate donut |
| `<ECTStatusPill status />` | On Track / Watch / At Risk badge |
| `<InsightCard insight />` | AI insight with `✦` pop accent badge |
| `<StaffVoiceCard submission />` | Shout-out card, pop accent border |
| `<SurveyBuilder questions />` | Drag and drop question editor |
| `<AnonymousForm surveyId />` | Staff-facing survey, no auth, mobile-first |
| `<NewsletterEditor sections />` | Drag/drop section editor + photo upload |
| `<NewsletterPreview sections accentColour />` | Full render of newsletter |
| `<ShareableGraphic data accentColour />` | Downloadable PNG social card |
| `<ColourPicker value onChange presets />` | Accent colour picker with live preview |
| `<ECTTable ects />` | ECT tracker table with risk status |

---

## Navigation

```
Sidebar:
  Echo logo + wordmark
  ─────────────────
  Dashboard          (school view) / Trust Overview (MAT view)
  Surveys
  ECT Tracker
  Newsletter
  Blog & Voice
  Settings
  ─────────────────
  [Org name + logo]
  [User avatar + name]
```

---

## Design principles

- **Dark-first.** Navy background throughout. Cards on `#132040`. This is a professional tool used by leaders — it should feel premium.
- **Electric Blue is the system colour.** All buttons, links, active nav, chart fills use `#1B6EF3`. Blue → light-blue gradient on data bars.
- **School accent (`--color-pop`) is the culture colour.** Used sparingly: recognition, newsletter accents, insight badges, shareable graphics. Never navigation, never data. The pop colour is what makes Echo feel personal to each school.
- **Numbers use Syne 800.** All stats, scores, and metric values. The font makes data feel bold and confident.
- **`✦` is the brand motif for accent moments.** Recognition, new insights, spotlights. A small, distinctive marker that signals "something worth noticing."
- **No drop shadows.** Depth through border (`rgba(255,255,255,0.08)`) only.
- **Animations:** Cards fade in on load. Bar charts animate width on mount. Subtle, not showy.
- **Border radius:** 12px cards, 8px inputs/pills, 99px status badges.

---

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
```

---

## How to start — first Loveable prompt

After pasting this document, send this as your first build instruction:

> "Scaffold the full Next.js 14 app with Supabase auth, the database schema in this brief, and the design system (CSS variables, Google Fonts, EchoMark SVG component, base layout with sidebar nav). Then build the school leader Dashboard page with all six metric cards populated with realistic placeholder data. Apply the full colour system exactly as described — deep navy background, electric blue data, school accent colour defaulting to hot pink. The dashboard should look polished and production-ready. Do not use placeholder grey boxes — make it look real from the first render."
