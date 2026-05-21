# Echo — Loveable Project Brief
> Paste this entire document into a new Loveable chat to kick off the build.

---

## What we're building

**Echo** is a SaaS platform for UK primary and junior schools that helps school and MAT (Multi-Academy Trust) leaders understand and act on staff wellbeing. It collects staff feedback, surfaces AI-powered insights on a leadership dashboard, flags ECT (Early Career Teacher) risk, and auto-generates a staff newsletter and blog content from that data.

The stack is **Next.js 14 + Supabase + Anthropic SDK**. Build a complete, production-ready scaffold with auth, database, and all core UI screens.

---

## Brand & design system

### Fonts
- **Display / headings:** Syne (weight 800) — use for all H1/H2, stat numbers, logo wordmark
- **Body / UI:** DM Sans (weight 300 / 400 / 500) — use for all body copy, labels, nav

Import both from Google Fonts.

### Default colour palette (Echo brand)

```css
--color-bg:           #0B1628;   /* Deep Navy — page background */
--color-surface:      #132040;   /* Navy Mid — cards, panels */
--color-surface-2:    #192B52;   /* Navy Surface — elevated elements */
--color-border:       rgba(255,255,255,0.08);
--color-primary:      #1B6EF3;   /* Electric Blue — primary actions, links, data */
--color-primary-light:#4D91FF;   /* Blue Light — hover states, gradients */
--color-primary-mist: #D6E8FF;   /* Blue Mist — subtle backgrounds on light mode */
--color-pop:          #F72585;   /* Hot Pink — accent, recognition, highlights */
--color-pop-light:    #FF6EB3;
--color-pop-bg:       rgba(247,37,133,0.12);
--color-text:         #FFFFFF;
--color-text-muted:   rgba(255,255,255,0.45);
--color-text-subtle:  rgba(255,255,255,0.2);

/* Semantic — data only */
--color-success:      #3DDC97;   /* positive trend */
--color-warning:      #F59E3F;   /* watch / alert */
--color-danger:       #E24B4A;   /* at risk */
```

### School accent colour (tenant-level customisation)

Each school/MAT can set a custom **accent colour** that replaces `--color-pop` (#F72585) across their instance. This colour is stored in the `organisations` table and injected as a CSS variable at the tenant level. It affects:

- Newsletter header stripe and CTA buttons
- Recognition spotlight cards
- AI insight badges
- Chart accent highlights
- LinkedIn/shareable export backgrounds

The default fallback is always `#F72585` (Hot Pink). When a school sets their accent, it persists across all their data exports and newsletter outputs so everything matches their school brand.

### Logo mark

The Echo logo is three concentric rings radiating from a filled circle — a sonar/ripple motif. Build it as an inline SVG component `<EchoMark />`:

```jsx
// EchoMark.jsx — scalable via `size` prop (default 32)
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

Wordmark: `<span style="fontFamily:'Syne',sans-serif; fontWeight:800; fontSize:22px; letterSpacing:'-0.03em'"><span style="color:var(--color-primary)">e</span>cho</span>`

---

## Database schema (Supabase)

```sql
-- Organisations (schools / MATs)
create table organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text check (type in ('school','mat')) default 'school',
  accent_colour text default '#F72585',   -- school's custom brand colour
  logo_url text,
  created_at timestamptz default now()
);

-- Users
create table users (
  id uuid primary key references auth.users,
  organisation_id uuid references organisations(id),
  role text check (role in ('admin','leader','staff','ect')) default 'staff',
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
  -- no user_id — anonymous by design
);

-- ECT check-ins
create table ect_checkins (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  ect_user_id uuid references users(id),
  mood_score int check (mood_score between 1 and 10),
  notes text,
  submitted_at timestamptz default now()
);

-- Staff blog submissions
create table blog_submissions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  author_id uuid references users(id),
  title text,
  content text,
  status text check (status in ('pending','approved','rejected')) default 'pending',
  submitted_at timestamptz default now()
);

-- Generated newsletters
create table newsletters (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  title text,
  content_json jsonb,       -- structured sections for rendering
  content_html text,        -- rendered HTML for email send
  generated_at timestamptz default now(),
  sent_at timestamptz,
  status text check (status in ('draft','sent')) default 'draft'
);

-- Recognition nominations
create table recognitions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  nominee_id uuid references users(id),
  nominated_by_id uuid references users(id),
  message text,
  created_at timestamptz default now()
);
```

Enable RLS on all tables. Users can only read/write rows matching their `organisation_id`.

---

## App structure & pages

### Auth
- `/login` — email + password, Supabase Auth
- `/onboarding` — org setup: school name, type, accent colour picker (with preview), logo upload

### Dashboard (leadership view) — `/dashboard`

The main screen. Cards and charts showing:

1. **Wellbeing score card** — current average, delta vs last term, sparkline trend
2. **ECT risk monitor** — three-column: On Track / Watch / At Risk counts with coloured backgrounds
3. **Survey response rate** — donut/ring chart, responded vs pending
4. **Top insight card** — AI-generated text insight, tagged with pop accent `✦ New insight`
5. **Category breakdown** — horizontal bar chart: Workload / Support / Belonging / Belonging scores
6. **Recent recognition** — latest staff nomination, shown with pop accent colour

All charts use Electric Blue (`#1B6EF3`) as the primary data colour with blue → light-blue gradients on bars. Semantic colours (green/amber/red) for ECT status only.

### Surveys — `/surveys`

- List of surveys (status badge: draft / active / closed)
- Create survey — question builder (multiple choice, 1–10 scale, free text)
- Anonymous submission page `/s/[survey_id]` — no auth required, clean minimal UI
- Survey results view — per-question breakdown charts

### ECT tracker — `/ect`

- Table of all ECTs with latest mood score, trend arrow, last check-in date
- Risk status pill (on track / watch / at risk) — calculated from: check-in frequency + mood trend
- Individual ECT profile — check-in history chart, notes timeline
- ECTs submit check-ins via `/checkin/[token]` — tokenised link, no login required

### Newsletter — `/newsletter`

- List of generated newsletters
- Generate button — calls Anthropic API to produce a structured newsletter from:
  - Latest survey insights
  - Approved blog submissions
  - Recognition nominations
  - Wellbeing score summary
- Preview — rendered newsletter with school accent colour applied to header, CTA bar, and section dividers
- Export — download as HTML, copy for email

### Blog — `/blog`

- Staff submission form — title + rich text body
- Leader review queue — approve / reject submissions
- Approved posts feed

### Settings — `/settings`

- Organisation profile: name, logo upload
- **Accent colour picker** — colour wheel + hex input + preset swatches (school-friendly palette)
  - Live preview panel showing: newsletter header, recognition card, insight badge, data bar — all updating in real time as the colour changes
  - Save applies `accent_colour` to the organisation row in Supabase
- Team management: invite users, assign roles

---

## Accent colour system — implementation detail

### How it works

1. On login, fetch `organisation.accent_colour` from Supabase
2. Inject as a CSS variable on `:root`:
   ```js
   document.documentElement.style.setProperty('--color-pop', org.accent_colour);
   document.documentElement.style.setProperty('--color-pop-light', lighten(org.accent_colour, 20));
   document.documentElement.style.setProperty('--color-pop-bg', hexToRgba(org.accent_colour, 0.12));
   ```
3. All components reference `var(--color-pop)` — they automatically pick up the school's colour
4. Newsletter HTML generation passes `accent_colour` to the Anthropic prompt and inlines it into the HTML output
5. Default if unset: `#F72585`

### Colour picker UI (settings page)

```
┌─────────────────────────────────────────────────────┐
│  School accent colour                                │
│                                                      │
│  [colour wheel / gradient picker]                    │
│                                                      │
│  Presets:  ● ● ● ● ● ● ● ● (8 school-friendly)     │
│  Hex: [  #F72585  ]   [ Save ]                      │
│                                                      │
│  Preview:                                            │
│  ┌──────────────────┐  ┌─────────────────┐          │
│  │ Newsletter header│  │ ✦ Recognition   │          │
│  │ ████████████████ │  │ Sarah nominated │          │
│  │ December Roundup │  │ by 4 colleagues │          │
│  └──────────────────┘  └─────────────────┘          │
│  ┌──────────────────┐  ┌─────────────────┐          │
│  │ ✦ New insight    │  │ Data bar sample │          │
│  │ Wellbeing down   │  │ ████░░░░  8.2   │          │
│  └──────────────────┘  └─────────────────┘          │
└─────────────────────────────────────────────────────┘
```

### Suggested preset swatches

```js
const presets = [
  { name: "Hot Pink (default)", hex: "#F72585" },
  { name: "Royal Purple",       hex: "#7B2FBE" },
  { name: "Forest Green",       hex: "#2D6A4F" },
  { name: "Burnt Orange",       hex: "#E85D04" },
  { name: "Deep Red",           hex: "#C1121F" },
  { name: "Gold",               hex: "#D4A017" },
  { name: "Teal",               hex: "#1D9E75" },
  { name: "Slate",              hex: "#3D5A80" },
];
```

---

## AI / newsletter generation

Use the Anthropic SDK. Newsletter generation endpoint:

```js
// /api/generate-newsletter
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 2000,
  messages: [{
    role: "user",
    content: `You are generating a warm, professional staff newsletter for ${orgName}, a UK primary school.

Use this data:
- Wellbeing score this term: ${wellbeingScore}/10 (${delta} vs last term)
- Top themes from staff surveys: ${surveyInsights}
- Staff recognition nominations: ${recognitions}
- Approved blog submissions: ${blogPosts}
- Accent colour for this school: ${accentColour}

Generate a newsletter with these sections:
1. Welcome message from leadership (warm, 2-3 sentences)
2. Wellbeing snapshot (brief, data-driven, positive framing)
3. Staff spotlight (recognition feature, use pop accent styling)
4. From the team (blog post summaries)
5. What's coming up (forward-looking close)

Return as JSON: { title, sections: [{ type, heading, content }] }
Do not include markdown. JSON only.`
  }]
});
```

---

## Component reference

### Key reusable components to build

| Component | Usage |
|---|---|
| `<EchoMark size={n} />` | Logo icon, scalable |
| `<StatCard label value delta />` | Dashboard metric cards |
| `<RingChart percent />` | Response rate donut |
| `<BarChart data />` | Horizontal wellbeing bars — blue gradient fill |
| `<ECTStatusPill status />` | On track / Watch / At risk |
| `<InsightCard text />` | AI insight with `✦` pop accent badge |
| `<RecognitionCard nominee message />` | Staff spotlight, pop accent border |
| `<NewsletterPreview sections accentColour />` | Full newsletter render |
| `<ColourPicker value onChange />` | Accent colour picker with presets + preview |
| `<SurveyBuilder questions />` | Drag-and-drop question editor |
| `<AnonymousForm surveyId />` | Public survey submission, no auth |

---

## Navigation structure

```
Sidebar (collapsed to icons on mobile):
  🔵  Dashboard
  📋  Surveys
  👩‍🏫  ECT Tracker
  📰  Newsletter
  ✍️   Blog
  ⚙️   Settings

Top bar:
  [Echo logo + wordmark]          [Org name]  [User avatar]
```

---

## Tone and design notes for Loveable

- Dark-first UI — navy background throughout, cards in `#132040`
- Electric Blue is the primary interactive colour — buttons, links, active nav states, chart fills
- Hot Pink / school accent is used sparingly — recognition, newsletter highlights, insight badges, onboarding CTAs only. Never for navigation or data.
- All stat numbers use Syne 800 font
- Border radius: 12px for cards, 8px for inputs and pills, 99px for status badges
- No drop shadows — use subtle border (`rgba(255,255,255,0.08)`) for depth instead
- Animations: subtle fade-in on dashboard cards on load; bar charts animate width on mount
- The `✦` symbol is the brand motif for pop-accent moments — use it as a prefix on recognition and insight labels

---

## Environment variables needed

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
```

---

## First prompt for Loveable

Paste the above, then follow with:

> "Start by scaffolding the full Next.js 14 app with Supabase auth, the database schema above, and the design system (fonts, CSS variables, EchoMark component). Then build the Dashboard page first with all six cards populated with realistic placeholder data. Apply the full colour system — navy background, electric blue data, hot pink accent. Make it look polished and production-ready from the start."
