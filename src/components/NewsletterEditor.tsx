'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type {
  MockNewsletter,
  NewsletterPhoto,
  NewsletterSectionKind,
} from '@/lib/mockData';
import { MOCK_APPROVED_PHOTOS } from '@/lib/mockData';
import { useAccent } from '@/components/AccentProvider';

interface DashboardSummary {
  wellbeing_score: number;
  wellbeing_delta: number;
  category_scores: { category: string; score: number }[];
  response_rate: number;
  responded: number;
  total_staff: number;
  top_insight?: string;
  staff_submissions?: { type: string; nominee_name?: string | null; content: string }[];
}

interface NewsletterEditorProps {
  newsletter: MockNewsletter;
  orgName: string;
  organisationId?: string;
  surveyId?: string;
  dashboardData?: DashboardSummary;
  accentHex?: string;
}

type Section = MockNewsletter['sections'][number];

export function NewsletterEditor({
  newsletter,
  orgName,
  organisationId = 'org-1',
  surveyId = 'survey-may-2026',
  dashboardData,
  accentHex = '#00E090',
}: NewsletterEditorProps) {
  const { logoDataUrl } = useAccent();
  const [title, setTitle] = useState(newsletter.title);
  const [sections, setSections] = useState<Section[]>(newsletter.sections);
  const [heroStat, setHeroStat] = useState(newsletter.hero_stat);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('preview');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const html = useMemo(
    () => buildHtml(title, sections, orgName, accentHex, heroStat, newsletter.month, logoDataUrl),
    [title, sections, orgName, accentHex, heroStat, newsletter.month, logoDataUrl],
  );

  function sectionKey(s: Section, i: number) {
    return s.type === 'photo_album' ? `photo_album-${i}` : s.type;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = sections.findIndex((s, i) => sectionKey(s, i) === active.id);
    const to = sections.findIndex((s, i) => sectionKey(s, i) === over.id);
    if (from === -1 || to === -1) return;
    setSections((items) => arrayMove(items, from, to));
  }

  function updateSection(idx: number, patch: Partial<Section>) {
    setSections((cur) => cur.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }

  function removeSection(idx: number) {
    setSections((cur) => cur.filter((_, i) => i !== idx));
    setEditingIdx(null);
  }

  function addPhotoAlbum() {
    setSections((cur) => [
      ...cur,
      {
        type: 'photo_album',
        heading: 'A month in pictures',
        content: 'A few moments staff wanted to share this month.',
        photos: [],
      },
    ]);
    setEditingIdx(sections.length);
  }

  async function regenerate() {
    setGenerating(true);
    setGenerateError(null);
    setGenerateMessage(null);
    try {
      const res = await fetch('/api/generate-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organisation_id: organisationId,
          survey_id: surveyId,
          orgName,
          data: dashboardData,
        }),
      });
      const data = (await res.json()) as {
        title?: string;
        sections?: Section[];
        error?: string;
        _mocked?: boolean;
      };
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');
      if (!data.title || !Array.isArray(data.sections)) throw new Error('Bad response shape');

      const photoSections = sections.filter((s) => s.type === 'photo_album');
      const merged: Section[] = [...data.sections];
      photoSections.forEach((p) => {
        const after = merged.findIndex((s) => s.type === 'staff_spotlight');
        if (after >= 0) merged.splice(after + 1, 0, p);
        else merged.push(p);
      });

      setTitle(data.title);
      setSections(merged);
      setGenerateMessage(
        data._mocked
          ? 'Demo content shown. Set ANTHROPIC_API_KEY in .env.local to write from your real survey data.'
          : 'Newsletter rewritten from this month’s data.',
      );
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }

  async function copyHtml() {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadHtml() {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
        <div className="flex-1">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent font-display text-3xl text-text outline-none focus:opacity-90 md:text-4xl"
          />
          <p className="mt-2 text-sm text-text-muted">
            {newsletter.month} &middot; drag sections to reorder, click any section to edit
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={regenerate}
            disabled={generating}
            className="btn btn-pop"
            style={{ background: 'var(--color-pop)', color: '#0B1628' }}
          >
            {generating ? (
              <>
                <Spinner />
                Writing…
              </>
            ) : (
              <>✦ {sections.length > 0 ? 'Rewrite with AI' : 'Generate with AI'}</>
            )}
          </button>

          <div className="flex rounded-input border border-border bg-surface p-1">
            <button
              onClick={() => setMode('edit')}
              className={`rounded-[6px] px-3 py-1.5 text-xs ${
                mode === 'edit' ? 'bg-surface-2 text-text' : 'text-text-muted'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`rounded-[6px] px-3 py-1.5 text-xs ${
                mode === 'preview' ? 'bg-surface-2 text-text' : 'text-text-muted'
              }`}
            >
              Preview
            </button>
          </div>
          <button onClick={copyHtml} className="btn btn-ghost">
            {copied ? 'Copied' : 'Copy HTML'}
          </button>
          <button onClick={downloadHtml} className="btn btn-primary">
            Download
          </button>
        </div>
      </header>

      {(generateMessage || generateError) && (
        <div
          className={`flex items-start gap-2 rounded-input border px-4 py-3 text-sm ${
            generateError ? 'border-danger/30 text-danger' : 'border-pop-bg text-text'
          }`}
          style={
            generateError
              ? { background: 'rgba(226,75,74,0.08)' }
              : { background: 'var(--color-pop-bg)' }
          }
        >
          <span
            className="mt-0.5"
            style={{ color: generateError ? 'var(--color-danger)' : 'var(--color-pop-light)' }}
          >
            ✦
          </span>
          <span>{generateError ?? generateMessage}</span>
        </div>
      )}

      {mode === 'edit' ? (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={sections.map((s, i) => sectionKey(s, i))}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {sections.map((s, i) => (
                  <SortableSection
                    key={sectionKey(s, i)}
                    id={sectionKey(s, i)}
                    section={s}
                    isEditing={editingIdx === i}
                    onClick={() => setEditingIdx(editingIdx === i ? null : i)}
                    onChange={(patch) => updateSection(i, patch)}
                    onRemove={() => removeSection(i)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {!sections.some((s) => s.type === 'photo_album') && (
            <button
              onClick={addPhotoAlbum}
              className="card flex w-full items-center justify-center gap-2 border-dashed text-sm text-text-muted hover:bg-surface-2 hover:text-text"
            >
              + Add photo album from approved staff submissions
            </button>
          )}
        </>
      ) : (
        <NewsletterPreview
          title={title}
          sections={sections}
          orgName={orgName}
          month={newsletter.month}
          heroStat={heroStat}
          onHeroStatChange={setHeroStat}
          logoDataUrl={logoDataUrl}
        />
      )}
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2"
      style={{ borderColor: '#0B1628', borderTopColor: 'transparent' }}
    />
  );
}

/* ----------------------- Sortable section card (edit mode) ----------------------- */

interface SortableSectionProps {
  id: string;
  section: Section;
  isEditing: boolean;
  onClick: () => void;
  onChange: (patch: Partial<Section>) => void;
  onRemove: () => void;
}

function SortableSection({ id, section, isEditing, onClick, onChange, onRemove }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="card flex flex-col gap-3 p-0">
      <div className="flex items-start gap-3 px-5 py-4">
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="mt-1 cursor-grab text-text-subtle hover:text-text-muted active:cursor-grabbing"
        >
          ⋮⋮
        </button>

        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-subtle">
            <span>{section.type === 'photo_album' ? '✦ Photo album' : section.type.replace(/_/g, ' ')}</span>
            {section.type === 'photo_album' && section.photos && (
              <span>· {section.photos.length} photos</span>
            )}
          </div>
          <button onClick={onClick} className="text-left">
            <div className="font-display text-lg text-text">{section.heading}</div>
            <p className="mt-1 line-clamp-2 text-sm text-text-muted">{section.content}</p>
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="flex flex-col gap-3 border-t border-border bg-surface-2 px-5 py-4">
          <label className="flex flex-col gap-1.5 text-xs">
            <span className="text-text-muted">Heading</span>
            <input
              value={section.heading}
              onChange={(e) => onChange({ heading: e.target.value })}
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs">
            <span className="text-text-muted">
              {section.type === 'photo_album' ? 'Intro (one line)' : 'Content'}
            </span>
            <textarea
              value={section.content}
              onChange={(e) => onChange({ content: e.target.value })}
              rows={section.type === 'photo_album' ? 2 : 6}
              className="input resize-y leading-relaxed"
            />
          </label>

          {section.type === 'photo_album' ? (
            <PhotoPicker
              selected={section.photos ?? []}
              onChange={(photos) => onChange({ photos })}
            />
          ) : (
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="text-text-muted">Hero photo URL (optional)</span>
              <input
                value={section.photo_url ?? ''}
                onChange={(e) => onChange({ photo_url: e.target.value || undefined })}
                placeholder="https://…"
                className="input"
              />
            </label>
          )}

          <div className="flex justify-end">
            <button onClick={onRemove} className="text-xs text-text-muted hover:text-danger">
              Remove section
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------- Photo picker (inside photo_album section) ----------------------- */

function PhotoPicker({
  selected,
  onChange,
}: {
  selected: NewsletterPhoto[];
  onChange: (next: NewsletterPhoto[]) => void;
}) {
  const selectedIds = new Set(selected.map((p) => p.id));
  const pool = MOCK_APPROVED_PHOTOS;

  function toggle(p: NewsletterPhoto) {
    if (selectedIds.has(p.id)) onChange(selected.filter((s) => s.id !== p.id));
    else onChange([...selected, p]);
  }

  function setCaption(id: string, caption: string) {
    onChange(selected.map((p) => (p.id === id ? { ...p, caption } : p)));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-muted">Photos in this album</span>
        <span className="text-[11px] text-text-subtle">
          Pulled from approved staff submissions. Tap to add or remove. Captions are editable.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {pool.map((p) => {
          const isSelected = selectedIds.has(p.id);
          return (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-input border transition-all ${
                isSelected ? 'border-pop' : 'border-border'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(p)}
                className="block w-full"
                aria-pressed={isSelected}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.caption ?? ''}
                  className={`aspect-[4/3] w-full object-cover transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-60'
                  }`}
                />
                <span
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-pill border text-[11px]"
                  style={{
                    background: isSelected ? 'var(--color-pop)' : 'rgba(11,22,40,0.6)',
                    color: isSelected ? '#0B1628' : 'white',
                    borderColor: isSelected ? 'var(--color-pop)' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {isSelected ? '✓' : '+'}
                </span>
              </button>
              {isSelected && (
                <input
                  value={selected.find((s) => s.id === p.id)?.caption ?? ''}
                  onChange={(e) => setCaption(p.id, e.target.value)}
                  placeholder="Caption (optional)"
                  className="w-full border-t border-border bg-bg px-2.5 py-2 text-[12px] text-text outline-none placeholder:text-text-subtle"
                />
              )}
              {!isSelected && p.submittedBy && (
                <div className="border-t border-border bg-bg px-2.5 py-1.5 text-[10px] text-text-subtle">
                  {p.submittedBy}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------- Newsletter preview (editorial layout) ----------------------- */

interface NewsletterPreviewProps {
  title: string;
  sections: Section[];
  orgName: string;
  month: string;
  heroStat?: { label: string; value: string; delta?: string };
  onHeroStatChange?: (next: { label: string; value: string; delta?: string }) => void;
  logoDataUrl?: string | null;
}

function NewsletterPreview({
  title,
  sections,
  orgName,
  month,
  heroStat,
  logoDataUrl,
}: NewsletterPreviewProps) {
  return (
    <div className="card overflow-hidden bg-white p-0 text-[#0B1628]">
      {/* Editorial hero banner */}
      <header
        className="relative overflow-hidden px-10 pb-10 pt-14"
        style={{
          background:
            'linear-gradient(135deg, var(--color-pop) 0%, #0A8A60 55%, #0B1628 110%)',
        }}
      >
        {/* Echo concentric-circles motif as decoration */}
        <svg
          aria-hidden
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="absolute -right-16 -top-20 opacity-25"
        >
          <circle cx="160" cy="160" r="40" fill="white" />
          <circle cx="160" cy="160" r="80" fill="none" stroke="white" strokeWidth="3" opacity="0.6" />
          <circle cx="160" cy="160" r="128" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
        </svg>
        <svg
          aria-hidden
          width="220"
          height="220"
          viewBox="0 0 220 220"
          className="absolute -bottom-24 -left-16 opacity-15"
        >
          <circle cx="110" cy="110" r="28" fill="white" />
          <circle cx="110" cy="110" r="56" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
          <circle cx="110" cy="110" r="92" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
        </svg>

        <div className="relative flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-white/85">
            <div className="flex items-center gap-3">
              {logoDataUrl && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-pill bg-white/15 backdrop-blur">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoDataUrl}
                    alt={`${orgName} logo`}
                    className="h-full w-full object-contain p-1"
                  />
                </span>
              )}
              <span className="font-semibold">{orgName}</span>
            </div>
            <span>{month}</span>
          </div>

          <h1 className="max-w-2xl font-display text-4xl leading-[1.05] text-white md:text-5xl">
            {title}
          </h1>

          {heroStat && (
            <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="text-xs uppercase tracking-[0.16em] text-white/70">
                {heroStat.label}
              </span>
              <span
                className="font-display text-5xl leading-none text-white"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {heroStat.value}
              </span>
              {heroStat.delta && (
                <span className="rounded-pill bg-white/15 px-3 py-1 text-xs font-medium text-white">
                  {heroStat.delta}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-col gap-12 px-10 py-12">
        {sections.map((s, i) =>
          s.type === 'photo_album' ? (
            <PhotoAlbumSection key={`pa-${i}`} section={s} />
          ) : (
            <TextSection key={`${s.type}-${i}`} section={s} />
          ),
        )}

        <footer className="flex items-center justify-between border-t border-[#0B1628]/10 pt-6 text-xs text-[#0B1628]/50">
          <span>{orgName}</span>
          <span>
            <span style={{ color: '#0A8A60' }}>✦</span> Made with Echo
          </span>
        </footer>
      </div>
    </div>
  );
}

function TextSection({ section }: { section: Section }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: 'var(--color-pop)' }}
        />
        <span
          className="h-px flex-none"
          style={{ width: '32px', background: 'rgba(11,22,40,0.15)' }}
        />
      </div>

      <h2 className="font-display text-3xl leading-tight text-[#0B1628]">
        {section.heading}
      </h2>

      {section.photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={section.photo_url}
          alt=""
          className="my-2 max-h-80 w-full rounded-input object-cover"
        />
      )}

      <p
        className="text-[15px] leading-[1.7] text-[#0B1628]/85"
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {section.content}
      </p>
    </section>
  );
}

function PhotoAlbumSection({ section }: { section: Section }) {
  const photos = section.photos ?? [];
  const cols = photos.length === 1 ? 1 : photos.length === 2 ? 2 : 3;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full" style={{ background: 'var(--color-pop)' }} />
        <span className="h-px flex-none" style={{ width: '32px', background: 'rgba(11,22,40,0.15)' }} />
      </div>

      <h2 className="font-display text-3xl leading-tight text-[#0B1628]">
        {section.heading}
      </h2>

      {section.content && (
        <p className="text-[15px] leading-[1.7] text-[#0B1628]/75">{section.content}</p>
      )}

      {photos.length === 0 ? (
        <div className="rounded-input border border-dashed border-[#0B1628]/15 bg-[#0B1628]/[0.02] px-4 py-8 text-center text-sm text-[#0B1628]/50">
          No photos selected yet. In edit mode, pick from the approved pool.
        </div>
      ) : (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {photos.map((p) => (
            <figure key={p.id} className="flex flex-col gap-2">
              <div className="overflow-hidden rounded-input">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.caption ?? ''}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              {p.caption && (
                <figcaption className="text-[12px] leading-snug text-[#0B1628]/60">
                  {p.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

/* ----------------------- HTML export ----------------------- */

function buildHtml(
  title: string,
  sections: Section[],
  orgName: string,
  accentHex: string,
  heroStat: MockNewsletter['hero_stat'],
  month: string,
  logoDataUrl: string | null,
): string {
  const accentDark = '#0A8A60';

  const sectionHtml = sections
    .map((s) => {
      if (s.type === 'photo_album') {
        const photos = s.photos ?? [];
        const cols = photos.length === 1 ? 1 : photos.length === 2 ? 2 : 3;
        const grid = photos
          .map(
            (p) => `
        <figure style="margin: 0;">
          <div style="overflow: hidden; border-radius: 8px;">
            <img src="${escapeHtml(p.url)}" alt="${escapeHtml(p.caption ?? '')}" style="display: block; width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
          </div>
          ${p.caption ? `<figcaption style="margin-top: 8px; font-size: 12px; line-height: 1.4; color: rgba(11,22,40,0.6);">${escapeHtml(p.caption)}</figcaption>` : ''}
        </figure>`,
          )
          .join('');
        return `
    <section style="margin: 48px 0;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span style="height: 8px; width: 8px; border-radius: 99px; background: ${accentHex};"></span>
        <span style="height: 1px; width: 32px; background: rgba(11,22,40,0.15);"></span>
      </div>
      <h2 style="font-family: Syne, sans-serif; font-weight: 700; font-size: 28px; color: #0B1628; margin: 0 0 12px;">${escapeHtml(s.heading)}</h2>
      ${s.content ? `<p style="font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; color: rgba(11,22,40,0.75); margin: 0 0 16px;">${escapeHtml(s.content)}</p>` : ''}
      <div style="display: grid; grid-template-columns: repeat(${cols}, minmax(0, 1fr)); gap: 12px;">${grid}</div>
    </section>`;
      }

      return `
    <section style="margin: 48px 0;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span style="display: inline-block; height: 8px; width: 8px; border-radius: 99px; background: ${accentHex};"></span>
        <span style="display: inline-block; height: 1px; width: 32px; background: rgba(11,22,40,0.15);"></span>
      </div>
      <h2 style="font-family: Syne, sans-serif; font-weight: 700; font-size: 28px; color: #0B1628; margin: 0 0 12px;">${escapeHtml(s.heading)}</h2>
      ${s.photo_url ? `<img src="${escapeHtml(s.photo_url)}" alt="" style="max-width: 100%; max-height: 320px; object-fit: cover; border-radius: 8px; margin: 16px 0;" />` : ''}
      <p style="font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; color: rgba(11,22,40,0.85); margin: 0; white-space: pre-wrap;">${escapeHtml(s.content)}</p>
    </section>`;
    })
    .join('');

  const heroStatHtml = heroStat
    ? `
        <div style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px 24px; margin-top: 8px;">
          <span style="font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.7);">${escapeHtml(heroStat.label)}</span>
          <span style="font-family: Syne, sans-serif; font-weight: 700; font-size: 56px; line-height: 1; color: white; font-variant-numeric: tabular-nums;">${escapeHtml(heroStat.value)}</span>
          ${heroStat.delta ? `<span style="background: rgba(255,255,255,0.15); color: white; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 500;">${escapeHtml(heroStat.delta)}</span>` : ''}
        </div>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root { --accent: ${accentHex}; --accent-dark: ${accentDark}; }
    body { margin: 0; background: #f5f5f7; font-family: 'DM Sans', sans-serif; color: #0B1628; }
    .wrap { max-width: 720px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; }
    .hero { position: relative; padding: 56px 40px 40px; background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 55%, #0B1628 110%); color: white; overflow: hidden; }
    .meta { display: flex; justify-content: space-between; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.85); margin-bottom: 24px; }
    .meta-name { font-weight: 600; }
    .hero h1 { font-family: Syne, sans-serif; font-weight: 700; font-size: 44px; line-height: 1.05; margin: 0; color: white; max-width: 520px; }
    .body-pad { padding: 16px 40px 40px; }
    footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(11,22,40,0.1); font-size: 12px; color: rgba(11,22,40,0.5); display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="hero">
      <div class="meta">
        <span class="meta-name">
          ${
            logoDataUrl
              ? `<img src="${logoDataUrl}" alt="${escapeHtml(orgName)} logo" style="display:inline-block; vertical-align:middle; height:32px; width:32px; object-fit:contain; padding:3px; background:rgba(255,255,255,0.15); border-radius:99px; margin-right:10px;" />`
              : ''
          }
          ${escapeHtml(orgName)}
        </span>
        <span>${escapeHtml(month)}</span>
      </div>
      <h1>${escapeHtml(title)}</h1>
      ${heroStatHtml}
    </header>
    <div class="body-pad">
      ${sectionHtml}
      <footer>
        <span>${escapeHtml(orgName)}</span>
        <span><span style="color: var(--accent-dark);">✦</span> Made with Echo</span>
      </footer>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Suppress unused-warning for the props the parent might not pass; kept for future DB wiring
export type { NewsletterSectionKind };
