'use client';

import { useState } from 'react';
import { DragDropImage, type DroppedImage } from '@/components/DragDropImage';
import { useLocalOrgName } from '@/components/ClientOrgName';
import type { Survey, SurveyQuestion } from '@/types';

interface AnonymousSurveyFormProps {
  survey: Survey;
  orgName?: string;
}

interface Answers {
  [questionId: string]: string | number;
}

interface VoiceAnswers {
  shoutout_name: string;
  shoutout_text: string;
  celebrate_text: string;
  suggestion_text: string;
}

const EMPTY_VOICE: VoiceAnswers = {
  shoutout_name: '',
  shoutout_text: '',
  celebrate_text: '',
  suggestion_text: '',
};

export function AnonymousSurveyForm({
  survey,
  orgName: orgNameProp,
}: AnonymousSurveyFormProps) {
  const orgName = useLocalOrgName(orgNameProp ?? 'your school');
  const [answers, setAnswers] = useState<Answers>({});
  const [voice, setVoice] = useState<VoiceAnswers>(EMPTY_VOICE);
  const [photos, setPhotos] = useState<DroppedImage[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function setAnswer(id: string, value: string | number) {
    setAnswers((cur) => ({ ...cur, [id]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) {
    const hadVoiceText = Object.values(voice).some((v) => v.trim());
    return (
      <ThankYou
        orgName={orgName}
        hadVoice={hadVoiceText || photos.length > 0}
      />
    );
  }

  const scaleQs = survey.questions.filter((q) => q.type === 'scale');
  const textQs = survey.questions.filter((q) => q.type === 'free_text');

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {scaleQs.map((q, i) => (
        <ScaleQuestion
          key={q.id}
          index={i + 1}
          total={scaleQs.length}
          question={q}
          value={(answers[q.id] as number | undefined) ?? null}
          onChange={(v) => setAnswer(q.id, v)}
        />
      ))}

      {textQs.map((q) => (
        <FreeTextQuestion
          key={q.id}
          question={q}
          value={(answers[q.id] as string | undefined) ?? ''}
          onChange={(v) => setAnswer(q.id, v)}
        />
      ))}

      <VoiceSection
        voice={voice}
        setVoice={setVoice}
        photos={photos}
        setPhotos={setPhotos}
      />

      <div className="flex flex-col gap-4 rounded-card border border-border bg-surface px-6 py-5">
        <div className="text-xs text-text-muted">
          Reminder. This survey is fully anonymous. Your name is never recorded.
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full justify-center py-3 text-base disabled:opacity-50"
        >
          {submitting ? 'Sending…' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

interface ScaleQuestionProps {
  index: number;
  total: number;
  question: SurveyQuestion;
  value: number | null;
  onChange: (v: number) => void;
}

function ScaleQuestion({ index, total, question, value, onChange }: ScaleQuestionProps) {
  const labels = ['Not at all', 'Very much'];
  return (
    <div className="flex flex-col gap-5 rounded-card border border-border bg-surface px-6 py-6">
      <div className="flex flex-col gap-1.5">
        <div className="text-xs uppercase tracking-wider text-text-muted">
          {index} of {total}
          {question.category ? ` • ${question.category}` : ''}
        </div>
        <h3 className="font-display text-2xl leading-tight text-text">{question.text}</h3>
      </div>

      <div>
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
            const active = value === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                className={`aspect-square rounded-input border text-base font-medium transition-colors ${
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-surface-2 text-text-muted hover:bg-bg hover:text-text'
                }`}
                aria-label={`${n}`}
                aria-pressed={active}
              >
                {n}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-text-subtle">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      </div>
    </div>
  );
}

interface FreeTextQuestionProps {
  question: SurveyQuestion;
  value: string;
  onChange: (v: string) => void;
}

function FreeTextQuestion({ question, value, onChange }: FreeTextQuestionProps) {
  return (
    <div className="flex flex-col gap-4 rounded-card border border-border bg-surface px-6 py-6">
      <div className="flex flex-col gap-1.5">
        <div className="text-xs uppercase tracking-wider text-text-muted">Open question</div>
        <h3 className="font-display text-2xl leading-tight text-text">{question.text}</h3>
        <p className="text-xs text-text-subtle">Optional. Leave blank if you would rather not.</p>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="A sentence is enough. Or a paragraph. Up to you."
        className="input resize-y leading-relaxed"
      />
    </div>
  );
}

interface VoiceSectionProps {
  voice: VoiceAnswers;
  setVoice: (v: VoiceAnswers) => void;
  photos: DroppedImage[];
  setPhotos: (next: DroppedImage[]) => void;
}

function VoiceSection({ voice, setVoice, photos, setPhotos }: VoiceSectionProps) {
  function set<K extends keyof VoiceAnswers>(key: K, value: VoiceAnswers[K]) {
    setVoice({ ...voice, [key]: value });
  }

  return (
    <section
      className="flex flex-col gap-5 rounded-card border px-6 py-7"
      style={{
        background: 'var(--color-pop-bg)',
        borderColor: 'var(--color-pop-bg)',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="pop-badge">✦ One last thing</span>
      </div>

      <div>
        <h3 className="font-display text-2xl leading-tight text-text">
          Anything good to share this month?
        </h3>
        <p className="mt-2 max-w-xl text-sm text-text-muted">
          This part is the favourite part. Recognise a colleague who made your week easier.
          Share a moment worth celebrating. Suggest one thing that would make this place better.
          Skip any of these if nothing comes to mind.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-muted">Shout-out for a colleague (name)</span>
          <input
            className="input"
            value={voice.shoutout_name}
            onChange={(e) => set('shoutout_name', e.target.value)}
            placeholder="e.g. Mr Patel"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm md:col-span-2">
          <span className="text-text-muted">What did they do?</span>
          <textarea
            rows={3}
            value={voice.shoutout_text}
            onChange={(e) => set('shoutout_text', e.target.value)}
            placeholder="They covered three lessons when I was unwell. Quiet kindness."
            className="input resize-y"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-text-muted">A moment worth celebrating</span>
        <textarea
          rows={2}
          value={voice.celebrate_text}
          onChange={(e) => set('celebrate_text', e.target.value)}
          placeholder="Year 4 nailed their reading assessments this week."
          className="input resize-y"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-text-muted">One thing that would make things better</span>
        <textarea
          rows={2}
          value={voice.suggestion_text}
          onChange={(e) => set('suggestion_text', e.target.value)}
          placeholder="Shorter Monday briefings would give us a calmer start."
          className="input resize-y"
        />
      </label>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-text-muted">A photo worth sharing this month</span>
          <span className="text-[11px] text-text-subtle">
            A moment from your classroom, a corridor display, anything you&apos;re proud of.
            Drag it in here. It may end up in the school newsletter.
          </span>
        </div>
        <DragDropImage
          images={photos}
          onChange={setPhotos}
          maxFiles={4}
          label="Drag a photo here"
          helper="Or tap to choose from your device. PNG or JPG."
        />
      </div>

      <div className="text-[11px] text-text-subtle">
        All of these are optional. Leaders see your words and photos, never your name.
      </div>
    </section>
  );
}

function ThankYou({ orgName, hadVoice }: { orgName: string; hadVoice: boolean }) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-card border border-border bg-surface px-8 py-14 text-center">
      <span className="pop-badge">✦ Thank you</span>
      <h2 className="max-w-md font-display text-3xl leading-tight text-text">
        {hadVoice ? 'Heard. Truly.' : 'Got it. Thanks for taking five minutes.'}
      </h2>
      <p className="max-w-md text-sm text-text-muted">
        {hadVoice
          ? `Your shout-out and notes will go to leadership at ${orgName} for review. Anonymously, as always.`
          : `Your answers are now part of ${orgName}'s May pulse. You can close this tab.`}
      </p>
    </div>
  );
}
