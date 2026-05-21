'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface DroppedImage {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
}

interface DragDropImageProps {
  images: DroppedImage[];
  onChange: (next: DroppedImage[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
  label?: string;
  helper?: string;
  className?: string;
}

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/heic'];

export function DragDropImage({
  images,
  onChange,
  maxFiles = 6,
  maxSizeMb = 10,
  label = 'Drop a photo here',
  helper = 'Or click to pick from your device. PNG, JPG, or WEBP.',
  className = '',
}: DragDropImageProps) {
  const [isOver, setIsOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  const accept = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files);
      const remaining = Math.max(0, maxFiles - images.length);
      if (remaining === 0) {
        setError(`You can attach up to ${maxFiles} photos.`);
        return;
      }
      const rejected: string[] = [];
      const accepted: DroppedImage[] = [];

      for (const file of incoming.slice(0, remaining)) {
        if (!file.type.startsWith('image/') && !ACCEPTED.includes(file.type)) {
          rejected.push(`${file.name} (not an image)`);
          continue;
        }
        if (file.size > maxSizeMb * 1024 * 1024) {
          rejected.push(`${file.name} (over ${maxSizeMb}MB)`);
          continue;
        }
        accepted.push({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          caption: '',
        });
      }

      if (rejected.length > 0) {
        setError(`Skipped: ${rejected.join(', ')}`);
      } else {
        setError(null);
      }
      if (accepted.length > 0) {
        onChange([...images, ...accepted]);
      }
    },
    [images, maxFiles, maxSizeMb, onChange],
  );

  function onDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items?.length) setIsOver(true);
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items?.length) setIsOver(true);
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsOver(false);
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    if (e.dataTransfer.files?.length) accept(e.dataTransfer.files);
  }

  function remove(id: string) {
    const next = images.filter((img) => img.id !== id);
    const removed = images.find((img) => img.id === id);
    if (removed) URL.revokeObjectURL(removed.previewUrl);
    onChange(next);
    setError(null);
  }

  function setCaption(id: string, caption: string) {
    onChange(images.map((img) => (img.id === id ? { ...img, caption } : img)));
  }

  const limitReached = images.length >= maxFiles;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <button
        type="button"
        onClick={() => !limitReached && inputRef.current?.click()}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        disabled={limitReached}
        className={`relative flex w-full flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isOver
            ? 'bg-pop-bg'
            : limitReached
              ? 'cursor-not-allowed border-border bg-surface-2 opacity-60'
              : 'border-border bg-surface hover:bg-surface-2'
        }`}
        style={isOver ? { borderColor: 'var(--color-pop)' } : undefined}
      >
        <span
          className="font-display text-3xl leading-none"
          style={{ color: isOver ? 'var(--color-pop)' : 'var(--color-pop-light)' }}
        >
          ✦
        </span>
        <div className="font-display text-lg text-text">
          {isOver ? 'Drop to attach' : limitReached ? 'Photo limit reached' : label}
        </div>
        {!limitReached && (
          <div className="max-w-xs text-xs text-text-muted">{helper}</div>
        )}
        {!limitReached && (
          <div className="mt-1 text-[11px] text-text-subtle">
            Up to {maxFiles} photos &middot; {maxSizeMb}MB each
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) accept(e.target.files);
            e.target.value = '';
          }}
        />
      </button>

      {error && (
        <div
          role="alert"
          className="rounded-input border px-3 py-2 text-xs"
          style={{
            background: 'rgba(226, 75, 74, 0.1)',
            borderColor: 'rgba(226, 75, 74, 0.3)',
            color: 'var(--color-danger)',
          }}
        >
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {images.map((img) => (
            <div
              key={img.id}
              className="flex flex-col gap-2 rounded-card border border-border bg-surface p-3"
            >
              <div className="relative overflow-hidden rounded-input">
                <img
                  src={img.previewUrl}
                  alt={img.file.name}
                  className="aspect-video w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => remove(img.id)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-pill bg-bg/80 text-text backdrop-blur transition-colors hover:bg-bg"
                  aria-label={`Remove ${img.file.name}`}
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                value={img.caption}
                onChange={(e) => setCaption(img.id, e.target.value)}
                placeholder="Add an optional caption"
                className="input text-sm"
              />
              <div className="flex items-center justify-between text-[11px] text-text-subtle">
                <span className="truncate">{img.file.name}</span>
                <span>{(img.file.size / 1024 / 1024).toFixed(1)}MB</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
