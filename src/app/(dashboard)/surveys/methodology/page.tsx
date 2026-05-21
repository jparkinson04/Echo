import Link from 'next/link';

interface CategoryRationale {
  name: string;
  question: string;
  retention: string;
  reporting: string;
  ofsted: string;
}

const CATEGORIES: CategoryRationale[] = [
  {
    name: 'Workload',
    question: 'How manageable has your workload felt this month?',
    retention:
      'Unsustainable workload is consistently named in DfE and union research as the single biggest reason teachers leave the profession. Tracking it monthly catches creep early, before it becomes a resignation.',
    reporting:
      'Boards want a clear, repeatable signal on how stretched the team feels. A monthly /10 score is something governors can read at a glance and compare across terms.',
    ofsted:
      'Inspectors look for evidence that leaders consider staff workload and wellbeing. A monthly score with trend data is exactly that evidence.',
  },
  {
    name: 'Feeling supported',
    question: 'How supported by colleagues and leadership have you felt?',
    retention:
      'Feeling unsupported is in the top three reasons teachers cite for leaving. It is also the most fixable: small changes in how leaders show up can move this number quickly.',
    reporting:
      'A direct counterweight to workload. Boards can see whether a stretched team is also a cared-for team, and whether leadership response is landing.',
    ofsted:
      'Speaks directly to the Leadership and Management judgement. Demonstrates active engagement with staff wellbeing, not just policy on paper.',
  },
  {
    name: 'Leadership',
    question: 'How well has school leadership communicated and led this month?',
    retention:
      'Trust in school leadership is one of the strongest predictors of whether a teacher stays. Quiet erosion here is invisible until exit interviews — by which point it is too late.',
    reporting:
      'A hard mirror for the head and the SLT. The trend matters more than any single number: are we improving in the eyes of the people we lead?',
    ofsted:
      'Used to evidence leadership effectiveness from the staff perspective, alongside parent voice and pupil voice.',
  },
  {
    name: 'Belonging',
    question: 'How much do you feel you belong here?',
    retention:
      'Teachers who do not feel they belong leave first. This is especially true for early-career teachers and staff from underrepresented groups — the people retention strategies usually fail to hold on to.',
    reporting:
      'A culture metric that resists tokenism. Sustained high belonging means inclusion is working in practice, not just in policy.',
    ofsted:
      'Supports the Personal Development and Leadership judgements. Evidence of an inclusive, positive school culture for adults as well as pupils.',
  },
  {
    name: 'Professional development',
    question: 'How much have you grown professionally this month?',
    retention:
      'Stagnation is a quiet driver of attrition. Teachers who feel they are still learning stay; those who feel they have plateaued look elsewhere within twelve months.',
    reporting:
      'Tests whether CPD spend is being felt by the people it is meant to develop. A useful counter to "we ran the training, ergo it worked".',
    ofsted:
      'Direct evidence for CPD effectiveness and the ECF for early career teachers — both explicit inspection areas.',
  },
  {
    name: 'Work-life balance',
    question: 'How well have you been able to switch off outside of work?',
    retention:
      'Distinct from workload. A teacher can have a manageable week and still take it home with them every evening. Burnout shows up here first.',
    reporting:
      'Tracks the long-term sustainability of the workload picture. Two schools with the same workload score can have very different work-life balance scores.',
    ofsted:
      'Aligns with the DfE workload reduction toolkit and the school workload pledge. Measurable evidence of the trust honouring it.',
  },
];

export default function MethodologyPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link
          href="/surveys"
          className="text-xs uppercase tracking-wider text-text-muted hover:text-text"
        >
          ← Surveys
        </Link>
      </div>

      <header className="flex flex-col gap-4">
        <span className="pop-badge w-fit">✦ Methodology</span>
        <h1 className="font-display text-4xl leading-tight text-text">
          What we ask, and why we ask it
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-text-muted">
          The monthly pulse is six questions, one per category. Each category is here because the
          evidence is unambiguous: it predicts whether teachers stay. Together they cover what the
          board wants to know, what Ofsted looks for, and what teachers tell us actually matters.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <PillarCard
          title="Built on retention research"
          body="Every category maps to a documented driver of teachers leaving the profession. We do not measure for the sake of measuring."
        />
        <PillarCard
          title="Designed for board reporting"
          body="Each category produces a comparable /10 score and trend line. Governors get a consistent picture term-on-term."
        />
        <PillarCard
          title="Aligned with Ofsted"
          body="What we capture is what inspectors want to see evidence of: workload, wellbeing, leadership, CPD, inclusion."
        />
      </section>

      <section className="flex flex-col gap-5">
        <div>
          <h2 className="font-display text-2xl text-text">The six categories</h2>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            The pulse asks one short scale question per category, plus an open question and the
            staff voice section. Here is what each category does and why it earns its place.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {CATEGORIES.map((c, i) => (
            <CategoryRationaleCard key={c.name} category={c} index={i + 1} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <RationaleCard
          badge="✦ Monthly, not annual"
          title="One bad week shouldn't define a year"
          body="Annual surveys are the norm in schools, but they have a problem. A single bad fortnight near survey time can swing a teacher's entire year of feedback. Monthly cadence is short enough that no one month dominates the picture — and short enough that leaders can act between surveys rather than reading a verdict twelve months too late."
        />
        <RationaleCard
          badge="✦ Anonymous by design"
          title="No name, no email, no device"
          body="The survey response table holds no user_id, by design. Staff who fear retaliation answer differently — and the data we get is not the data we need. Anonymity is the only way to get a true read on how a school is actually feeling, which is the only data worth basing decisions on."
        />
        <RationaleCard
          badge="✦ Five minutes, ever"
          title="Short enough to actually do"
          body="Long surveys train staff to skim, satisfice, or stop responding. Six scale questions, one open question, and an optional staff voice section means we get high response rates and honest answers. The product is built around protecting the five-minute promise."
        />
        <RationaleCard
          badge="✦ Closing the loop"
          title="What this becomes"
          body="Every survey produces an AI insight with three recommended actions, a brand-aware newsletter that shares wins back with staff, and a shareable graphic the school can post externally. The data does not sit in a spreadsheet. It becomes recognition, action, and signal — to staff and to the outside world."
        />
      </section>

      <section className="card flex flex-col gap-4">
        <h2 className="font-display text-xl text-text">What also goes in the survey</h2>
        <ul className="flex flex-col gap-3 text-sm text-text">
          <ListRow
            label="Open question"
            body="A free-text prompt for anything else worth saying this month. Optional."
          />
          <ListRow
            label="Shout-out for a colleague"
            body="Name plus a sentence on what they did. Feeds the staff spotlight in the newsletter."
          />
          <ListRow
            label="A moment worth celebrating"
            body="Free text. Becomes the from-the-team section of the newsletter."
          />
          <ListRow
            label="One thing that would make things better"
            body="A constructive, low-stakes suggestion field. Routed to leaders for review."
          />
          <ListRow
            label="Photo upload"
            body="Drag and drop up to four photos. Goes into the newsletter if the leader approves."
          />
        </ul>
      </section>

      <section
        className="flex flex-col items-start gap-4 rounded-card border px-7 py-7"
        style={{
          background: 'var(--color-pop-bg)',
          borderColor: 'var(--color-pop-bg)',
        }}
      >
        <span className="pop-badge">✦ The point</span>
        <h2 className="max-w-2xl font-display text-2xl leading-tight text-text">
          Lots of schools collect data. Echo is built on what schools do with it.
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-text-muted">
          The questions are calibrated for retention. The cadence is calibrated for honesty. The
          output is calibrated for action and for sharing. Every part of the pulse is here for a
          reason, and the reasons live on this page so leaders can show governors, staff, and
          inspectors what they are measuring and why.
        </p>
        <Link href="/surveys" className="btn btn-pop">
          Back to surveys
        </Link>
      </section>
    </div>
  );
}

interface CategoryRationaleCardProps {
  category: CategoryRationale;
  index: number;
}

function CategoryRationaleCard({ category, index }: CategoryRationaleCardProps) {
  return (
    <article className="card flex flex-col gap-5">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill border border-border text-sm"
            style={{ color: 'var(--color-primary-light)' }}
          >
            {String(index).padStart(2, '0')}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-2xl text-text">{category.name}</h3>
            <p className="text-sm italic text-text-muted">&ldquo;{category.question}&rdquo;</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <ReasonBlock title="Why for retention" body={category.retention} />
        <ReasonBlock title="Why for the board" body={category.reporting} />
        <ReasonBlock title="Why for Ofsted" body={category.ofsted} />
      </div>
    </article>
  );
}

function ReasonBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-input border border-border bg-surface-2 p-4">
      <div className="text-[11px] uppercase tracking-wider text-text-subtle">{title}</div>
      <p className="text-xs leading-relaxed text-text">{body}</p>
    </div>
  );
}

function PillarCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card flex flex-col gap-2">
      <div className="font-display text-lg text-text">{title}</div>
      <p className="text-sm leading-relaxed text-text-muted">{body}</p>
    </div>
  );
}

function RationaleCard({ badge, title, body }: { badge: string; title: string; body: string }) {
  return (
    <article className="card flex flex-col gap-3">
      <span className="pop-badge w-fit">{badge}</span>
      <h3 className="font-display text-xl leading-tight text-text">{title}</h3>
      <p className="text-sm leading-relaxed text-text-muted">{body}</p>
    </article>
  );
}

function ListRow({ label, body }: { label: string; body: string }) {
  return (
    <li className="flex flex-col gap-1 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <span className="font-display text-base text-text">{label}</span>
      <span className="text-sm text-text-muted">{body}</span>
    </li>
  );
}
