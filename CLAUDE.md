# CLAUDE.md — Echo project instructions

This file is read by Claude Code at the start of every session. Follow these instructions for all work on this project.

---

## What this project is

Echo is a SaaS platform for UK Multi-Academy Trusts and schools to measure and improve staff wellbeing and teacher retention. Read ECHO_BRIEF.md for the full product context before doing any work. If you haven't read it yet in this session, read it now.

---

## Stack

- **Framework:** Next.js 14 App Router (TypeScript)
- **Database + Auth:** Supabase (SSR pattern via @supabase/ssr)
- **AI:** Anthropic SDK — model is always `claude-sonnet-4-20250514`
- **Email:** Resend
- **Charts:** Recharts
- **Drag and drop:** @dnd-kit/core + @dnd-kit/sortable
- **Image export:** html-to-image (for shareable social graphics)
- **Styling:** Tailwind CSS + CSS custom properties (design tokens in globals.css)

---

## Project structure

```
src/
  app/                        # Next.js App Router pages
    (auth)/
      login/page.tsx
      onboarding/page.tsx
    (dashboard)/
      layout.tsx              # Sidebar layout wrapper
      dashboard/page.tsx      # School leader dashboard
      mat/page.tsx            # MAT trust overview
      surveys/page.tsx
      surveys/[id]/page.tsx
      surveys/[id]/results/page.tsx
      ect/page.tsx
      ect/[id]/page.tsx
      newsletter/page.tsx
      newsletter/[id]/page.tsx
      blog/page.tsx
      settings/page.tsx
    s/[survey_id]/page.tsx    # Public anonymous survey form
    checkin/[token]/page.tsx  # Public ECT check-in form
    api/
      generate-newsletter/route.ts
      generate-insight/route.ts
      send-survey/route.ts
  components/
    EchoMark.tsx
    Layout.tsx
    StatCard.tsx
    CategoryBarChart.tsx
    RingChart.tsx
    ECTStatusPill.tsx
    InsightCard.tsx
    StaffVoiceCard.tsx
    TrustHeatMap.tsx
    SurveyBuilder.tsx
    AnonymousForm.tsx
    NewsletterEditor.tsx
    NewsletterPreview.tsx
    ShareableGraphic.tsx
    ColourPicker.tsx
    ECTTable.tsx
  lib/
    supabase.ts               # Supabase client (SSR)
    supabase-server.ts        # Server-side Supabase client
    anthropic.ts              # Anthropic client
    resend.ts                 # Resend client
    accent.ts                 # Accent colour injection utility
    risk.ts                   # ECT risk calculation logic
  types/
    index.ts                  # All shared TypeScript types
```

---

## Code standards

### TypeScript
- Strict mode on. No `any` types — define proper interfaces for everything.
- All Supabase query results must be typed using the generated types or manual interfaces.
- All API route handlers must have typed request/response bodies.

### Components
- Functional components only. No class components.
- Props interfaces defined above each component, not inline.
- All components accept a `className?: string` prop for extensibility.
- Server components by default. Add `'use client'` only when needed (interactivity, hooks, browser APIs).

### Data fetching
- Use Supabase server client in Server Components and API routes.
- Use Supabase browser client only in Client Components that need real-time or user-triggered fetches.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. It is server-only.
- Always handle loading and error states — never render data that might be undefined without a guard.

### API routes
- All AI calls go through `/app/api/` route handlers — never call Anthropic directly from client components.
- Validate all inputs before passing to Anthropic or Supabase.
- Return consistent error shapes: `{ error: string, code: string }`.

### File naming
- Components: PascalCase (`StatCard.tsx`)
- Utilities and lib files: camelCase (`supabase.ts`)
- Pages: `page.tsx` inside their route folder

---

## Design system — follow exactly

### Colours
All colours are defined as CSS custom properties in `src/app/globals.css`. Never hardcode hex values in components — always use the CSS variable. 

```css
--color-bg:            #0B1628;
--color-surface:       #132040;
--color-surface-2:     #192B52;
--color-border:        rgba(255,255,255,0.08);
--color-primary:       #1B6EF3;
--color-primary-light: #4D91FF;
--color-text:          #FFFFFF;
--color-text-muted:    rgba(255,255,255,0.45);
--color-text-subtle:   rgba(255,255,255,0.2);
--color-pop:           #F72585;   /* injected per tenant at login */
--color-pop-light:     #FF6EB3;
--color-pop-bg:        rgba(247,37,133,0.12);
--color-success:       #3DDC97;
--color-warning:       #F59E3F;
--color-danger:        #E24B4A;
```

### Accent colour injection
On login, after fetching the user's organisation, inject the school's accent colour:

```ts
// src/lib/accent.ts
export function injectAccentColour(hex: string) {
  document.documentElement.style.setProperty('--color-pop', hex);
  document.documentElement.style.setProperty('--color-pop-light', lightenHex(hex, 20));
  document.documentElement.style.setProperty('--color-pop-bg', hexToRgba(hex, 0.12));
}
```

Call this in the root layout's client component after auth resolves.

### Typography
- Display/headings/numbers: `font-family: 'Syne', sans-serif; font-weight: 800`
- Body/UI/labels: `font-family: 'DM Sans', sans-serif; font-weight: 300 | 400 | 500`
- Import both from Google Fonts in `globals.css`
- All metric values (scores, counts, percentages) use Syne 800 — this is non-negotiable

### Spacing and radius
- Cards: `border-radius: 12px`
- Inputs and pills: `border-radius: 8px`
- Status badges: `border-radius: 99px`
- No drop shadows — use `border: 1px solid var(--color-border)` for depth

### The pop colour rule
`--color-pop` (school accent) is used ONLY for:
- Recognition / shout-out cards
- Newsletter section accents, header stripe, CTA buttons
- AI insight badge (`✦ New insight`)
- Shareable social graphic accents
- Onboarding and celebration moments

It is NEVER used for:
- Navigation (active states use `--color-primary`)
- Data charts or bars (use `--color-primary`)
- Error or status indicators (use semantic colours)

### The ✦ motif
The `✦` character prefixes pop-accent labels: `✦ New insight`, `✦ Recognition`, `✦ Staff spotlight`. Use it consistently — it is a brand marker.

---

## Authentication and multi-tenancy

### Role hierarchy
```
mat_admin   → sees all schools in their MAT, trust-wide data
school_admin → sees their school only
leader      → same as school_admin (used for non-headteacher leaders)
staff       → no dashboard, submits surveys via link only
ect         → no dashboard, submits check-ins via tokenised link
```

### RLS rules (enforced in Supabase, validated in code too)
- `mat_admin` can SELECT on all organisations where `organisations.mat_id = their organisation_id`
- All other roles can only access rows where `organisation_id = their own organisation_id`
- Never bypass RLS — always use the user's Supabase client (with their JWT), not the service role client, for data reads on the frontend

### Public routes (no auth)
- `/s/[survey_id]` — anonymous survey submission
- `/checkin/[token]` — ECT check-in via tokenised URL
These pages must never require login and must never log the respondent's identity.

---

## AI usage

### Model
Always use `claude-sonnet-4-20250514`. Never use a different model string.

### Where AI is used
1. `/api/generate-newsletter` — generates newsletter draft from survey data
2. `/api/generate-insight` — generates 1 key insight + 3 recommendations after survey closes
3. Future: shareable graphic copy generation

### Prompting rules
- Always instruct the model to return JSON only — no markdown, no preamble
- Always validate and parse the JSON response before using it
- Always pass `max_tokens: 2000` minimum for newsletter generation
- Wrap all Anthropic calls in try/catch and return a proper error response

### Example structure
```ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 2000,
  messages: [{ role: 'user', content: prompt }],
});
const text = response.content[0].type === 'text' ? response.content[0].text : '';
const parsed = JSON.parse(text);
```

---

## Key business logic

### ECT risk calculation (`src/lib/risk.ts`)
Risk status is calculated from three signals:
1. **Mood score** — average of last 3 check-ins
2. **Trend** — direction of change (improving / static / declining)  
3. **Check-in frequency** — days since last check-in

```ts
export type RiskStatus = 'on_track' | 'watch' | 'at_risk';

export function calculateECTRisk(checkins: ECTCheckin[]): RiskStatus {
  if (checkins.length === 0) return 'watch'; // no data = watch
  
  const recent = checkins.slice(-3);
  const avgMood = recent.reduce((sum, c) => sum + c.mood_score, 0) / recent.length;
  const daysSinceLast = daysBetween(recent[recent.length - 1].submitted_at, new Date());
  const trend = getTrend(checkins);

  if (avgMood >= 7 && daysSinceLast <= 35 && trend !== 'declining') return 'on_track';
  if (avgMood < 5 || daysSinceLast > 60 || trend === 'declining') return 'at_risk';
  return 'watch';
}
```

### MAT heat map RAG colours
```ts
export function ragColour(score: number): 'red' | 'amber' | 'green' {
  if (score >= 7) return 'green';
  if (score >= 5) return 'amber';
  return 'red';
}
```

### Survey anonymity
- `survey_responses` table has no `user_id` column — this is by design
- Never add user identification to survey responses
- The anonymous survey form at `/s/[survey_id]` must not set any cookies or local storage that could identify the respondent
- State this clearly on the form: "This survey is completely anonymous. Your name is never recorded."

---

## Do not do these things

- Do not use `any` TypeScript types
- Do not call Anthropic from client components — always go through an API route
- Do not use the service role key on the client side
- Do not add user identity to survey responses
- Do not use hardcoded colour hex values in components — use CSS variables
- Do not use `--color-pop` for navigation or data visualisation
- Do not use drop shadows — use borders for depth
- Do not use Inter, Roboto, or system fonts — always Syne + DM Sans
- Do not invent features not described in ECHO_BRIEF.md without flagging it first
- Do not use `console.log` in production code — use proper error handling

---

## When you're unsure

If a requirement is ambiguous, check ECHO_BRIEF.md first. If it's still unclear, implement the simplest version that fits the product description and add a TODO comment explaining the assumption. Do not invent features or make large architectural decisions without flagging them.

---

## Session startup checklist

At the start of every Claude Code session on this project:
1. Read this file (CLAUDE.md)
2. Read ECHO_BRIEF.md
3. Run `git status` to see what's in progress
4. Ask what to work on next if it's not clear

---

*Last updated: May 2026*
