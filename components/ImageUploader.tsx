'use client';

/**
 * components/ImageUploader.tsx
 *
 * File upload logic:
 * – Accepts PNG, JPG, JPEG, WEBP via click-to-browse and drag-and-drop.
 * – Multiple files can be selected at once (up to `maxImages`). Files that
 *   exceed the cap or have an invalid MIME type are rejected with an inline error.
 * – The component does NOT manage object URLs – that responsibility belongs to
 *   page.tsx so cleanup (revokeObjectURL) is centralised.
 * – `onUpload` receives a validated File[] (never empty).
 */

import { useCallback, useRef, useState } from 'react';

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const ALLOWED_LABEL = 'PNG, JPG, JPEG or WEBP';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  /** Maximum number of images the user may load at once (shown in the UI). */
  maxImages: number;
}

export default function ImageUploader({ onUpload, maxImages }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate each file's MIME type and enforce the maxImages cap.
  const processFiles = useCallback(
    (raw: FileList | File[]) => {
      const list = Array.from(raw);

      // Filter out invalid types first so the error message is accurate.
      const invalid = list.filter((f) => !ALLOWED_TYPES.has(f.type));
      if (invalid.length > 0) {
        setError(
          `${invalid.length} unsupported file${invalid.length > 1 ? 's' : ''} skipped. Please use ${ALLOWED_LABEL}.`
        );
      } else {
        setError(null);
      }

      const valid = list.filter((f) => ALLOWED_TYPES.has(f.type));
      if (valid.length === 0) return;

      if (valid.length > maxImages) {
        setError(`Only the first ${maxImages} images were loaded (limit: ${maxImages}).`);
      }

      const capped = valid.slice(0, maxImages);
      onUpload(capped);
    },
    [onUpload, maxImages]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg px-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload images"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          'w-full rounded-2xl border-2 border-dashed transition-colors cursor-pointer',
          'flex flex-col items-center justify-center gap-4 py-16 px-8 text-center',
          dragging
            ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
            : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 hover:border-violet-400 hover:bg-neutral-50 dark:hover:bg-neutral-800',
        ].join(' ')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-neutral-400" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>

        <div>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Drop images here, or{' '}
            <span className="text-violet-600 dark:text-violet-400 underline underline-offset-2">browse</span>
          </p>
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            {ALLOWED_LABEL} · Up to {maxImages} images at once
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
      />

      {error && (
        <p role="alert" className="text-sm text-amber-600 dark:text-amber-400 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
