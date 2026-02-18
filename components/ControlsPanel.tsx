'use client';

/**
 * components/ControlsPanel.tsx
 *
 * Right-side controls panel. All state lives in page.tsx; this component is
 * purely presentational + interaction. Dark mode cascades from the `dark`
 * class on the root wrapper in page.tsx.
 */

import { useRef } from 'react';
import type { FrameConfig, FrameStyle, Gradient, Theme, PhonePreset } from '@/lib/types';
import { GRADIENT_CSS, GRADIENT_LABELS, PHONE_PRESETS } from '@/lib/types';

const GRADIENTS: Gradient[] = ['purple-blue', 'orange-pink', 'green-teal', 'slate'];

const FRAME_STYLES: { value: FrameStyle; label: string; desc: string }[] = [
  { value: 'macos',   label: 'macOS',   desc: 'Traffic-light chrome'   },
  { value: 'windows', label: 'Win 11',  desc: 'Fluent title bar'       },
  { value: 'minimal', label: 'Minimal', desc: 'Shadow card'            },
  { value: 'browser', label: 'Browser', desc: 'Chrome-style tab'       },
  { value: 'phone',   label: 'Phone',   desc: 'Samsung Galaxy · slim'  },
  { value: 'tablet',  label: 'Tablet',  desc: 'iPad · wide bezel'      },
];

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

interface ControlsPanelProps {
  config: FrameConfig;
  imageCount: number;
  activeIndex: number;
  maxImages: number;
  exporting: boolean;
  exportingAll: boolean;
  copying: boolean;
  canUndo: boolean;
  isBusy: boolean;
  onFrameStyleChange:  (v: FrameStyle) => void;
  onThemeChange:       (v: Theme)      => void;
  onGradientChange:    (v: Gradient)   => void;
  onPaddingChange:     (v: number)     => void;
  onBorderRadiusChange:(v: number)     => void;
  onImageScaleChange:  (v: number)     => void;
  onBgColorChange:     (v: string)     => void;
  onUseCustomBgChange: (v: boolean)    => void;
  onPhonePresetChange: (v: PhonePreset) => void;
  onUpload:            (files: File[]) => void;
  onRemoveActive:      () => void;
  onExport:            () => void;
  onExportAll:         () => void;
  onCopyToClipboard:   () => void;
  onUndo:              () => void;
}

export default function ControlsPanel({
  config,
  imageCount,
  activeIndex,
  maxImages,
  exporting,
  exportingAll,
  copying,
  canUndo,
  isBusy,
  onFrameStyleChange,
  onThemeChange,
  onGradientChange,
  onPaddingChange,
  onBorderRadiusChange,
  onImageScaleChange,
  onBgColorChange,
  onUseCustomBgChange,
  onPhonePresetChange,
  onUpload,
  onRemoveActive,
  onExport,
  onExportAll,
  onCopyToClipboard,
  onUndo,
}: ControlsPanelProps) {
  const hasImage  = imageCount > 0;
  const canAddMore = imageCount < maxImages;

  return (
    <div className="flex flex-col h-full">

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">

        {/* Images */}
        <Section title="Images">
          {hasImage ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {imageCount} of {maxImages} loaded
                  {imageCount > 1 && (
                    <span className="ml-1 text-neutral-400 dark:text-neutral-500">
                      · viewing {activeIndex + 1}
                    </span>
                  )}
                </span>
                <div className="w-16 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all"
                    style={{ width: `${(imageCount / maxImages) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {canAddMore && (
                  <InlineUploadTrigger
                    onUpload={onUpload}
                    maxImages={maxImages}
                    label="Add more"
                    multiple
                  />
                )}
                <button
                  type="button"
                  onClick={onRemoveActive}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-sm text-red-600 dark:text-red-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                  Remove
                </button>
              </div>

              {!canAddMore && (
                <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-0.5">
                  Limit of {maxImages} images reached.
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Upload an image to get started.
            </p>
          )}
        </Section>

        {/* Frame Style */}
        <Section title="Frame Style">
          <div className="grid grid-cols-2 gap-2">
            {FRAME_STYLES.map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => onFrameStyleChange(value)}
                className={[
                  'flex flex-col items-start rounded-xl px-3 py-2.5 text-left transition-colors',
                  config.frameStyle === value
                    ? 'bg-violet-50 dark:bg-violet-950/50 ring-1 ring-violet-400 dark:ring-violet-600 ring-inset'
                    : 'bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700',
                ].join(' ')}
              >
                <span className={`text-sm font-medium ${
                  config.frameStyle === value
                    ? 'text-violet-700 dark:text-violet-300'
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}>
                  {label}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-tight">{desc}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Store Format — only visible when Phone frame is selected */}
        {config.frameStyle === 'phone' && (
          <Section title="Store Format">
            {/* Free / no constraint option */}
            <button
              type="button"
              onClick={() => onPhonePresetChange('free')}
              className={[
                'w-full flex items-center justify-between rounded-xl px-3 py-2.5 mb-2 transition-colors text-left',
                config.phonePreset === 'free'
                  ? 'bg-violet-50 dark:bg-violet-950/50 ring-1 ring-violet-400 dark:ring-violet-600 ring-inset'
                  : 'bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700',
              ].join(' ')}
            >
              <span className={`text-sm font-medium ${
                config.phonePreset === 'free' ? 'text-violet-700 dark:text-violet-300' : 'text-neutral-700 dark:text-neutral-300'
              }`}>Free (2×)</span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">No constraint</span>
            </button>

            {/* App Store group */}
            <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5 mt-1">
              App Store
            </p>
            <div className="flex flex-col gap-1.5 mb-3">
              {(['appstore-67', 'appstore-65', 'appstore-55'] as const).map((key) => {
                const p = PHONE_PRESETS[key];
                const active = config.phonePreset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onPhonePresetChange(key)}
                    className={[
                      'flex items-center justify-between rounded-xl px-3 py-2 transition-colors',
                      active
                        ? 'bg-violet-50 dark:bg-violet-950/50 ring-1 ring-violet-400 dark:ring-violet-600 ring-inset'
                        : 'bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700',
                    ].join(' ')}
                  >
                    <div className="flex flex-col items-start">
                      <span className={`text-xs font-medium ${
                        active ? 'text-violet-700 dark:text-violet-300' : 'text-neutral-700 dark:text-neutral-300'
                      }`}>{p.label}</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{p.device}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 shrink-0 ml-2">
                      {p.width}&times;{p.height}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Play Store group */}
            <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
              Google Play
            </p>
            <div className="flex flex-col gap-1.5">
              {(['playstore', 'playstore-xl'] as const).map((key) => {
                const p = PHONE_PRESETS[key];
                const active = config.phonePreset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onPhonePresetChange(key)}
                    className={[
                      'flex items-center justify-between rounded-xl px-3 py-2 transition-colors',
                      active
                        ? 'bg-violet-50 dark:bg-violet-950/50 ring-1 ring-violet-400 dark:ring-violet-600 ring-inset'
                        : 'bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700',
                    ].join(' ')}
                  >
                    <div className="flex flex-col items-start">
                      <span className={`text-xs font-medium ${
                        active ? 'text-violet-700 dark:text-violet-300' : 'text-neutral-700 dark:text-neutral-300'
                      }`}>{p.label}</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{p.device}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 shrink-0 ml-2">
                      {p.width}&times;{p.height}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active preset badge */}
            {config.phonePreset !== 'free' && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="text-xs text-emerald-700 dark:text-emerald-300">
                  Export will be{' '}
                  <span className="font-semibold font-mono">
                    {PHONE_PRESETS[config.phonePreset as Exclude<PhonePreset,'free'>].width}
                    &times;
                    {PHONE_PRESETS[config.phonePreset as Exclude<PhonePreset,'free'>].height}
                  </span>
                  {' '}px
                </span>
              </div>
            )}
          </Section>
        )}

        {/* Frame Theme */}
        <Section title="Frame Theme">
          <div className="flex gap-2">
            {(['light', 'dark'] as Theme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onThemeChange(t)}
                className={[
                  'flex-1 py-2 rounded-xl text-sm font-medium transition-colors capitalize',
                  config.theme === t
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700',
                ].join(' ')}
              >
                {t}
              </button>
            ))}
          </div>
        </Section>

        {/* Background */}
        <Section title="Background">
          {/* Toggle gradient / solid colour */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => onUseCustomBgChange(false)}
              className={[
                'flex-1 text-sm py-1.5 rounded-xl font-medium transition-colors',
                !config.useCustomBg
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700',
              ].join(' ')}
            >
              Gradient
            </button>
            <button
              type="button"
              onClick={() => onUseCustomBgChange(true)}
              className={[
                'flex-1 text-sm py-1.5 rounded-xl font-medium transition-colors',
                config.useCustomBg
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700',
              ].join(' ')}
            >
              Solid
            </button>
          </div>

          {config.useCustomBg ? (
            /* Solid colour picker */
            <div className="flex items-center gap-3">
              <label
                htmlFor="bg-color-picker"
                className="relative w-10 h-10 rounded-xl overflow-hidden cursor-pointer border border-neutral-200 dark:border-neutral-700 shrink-0"
                style={{ background: config.bgColor }}
                title="Pick background colour"
              >
                <input
                  id="bg-color-picker"
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => onBgColorChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  aria-label="Background colour"
                />
              </label>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-mono text-neutral-700 dark:text-neutral-200">{config.bgColor}</span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">Click swatch to change</span>
              </div>
            </div>
          ) : (
            /* Gradient picker */
            <>
              <div className="grid grid-cols-4 gap-2">
                {GRADIENTS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    title={GRADIENT_LABELS[g]}
                    aria-label={`Gradient: ${GRADIENT_LABELS[g]}`}
                    onClick={() => onGradientChange(g)}
                    style={{ background: GRADIENT_CSS[g] }}
                    className={[
                      'h-10 rounded-xl transition-all',
                      config.gradient === g
                        ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-neutral-900 scale-105'
                        : 'hover:scale-105',
                    ].join(' ')}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500 text-center">
                {GRADIENT_LABELS[config.gradient]}
              </p>
            </>
          )}
        </Section>

        {/* Canvas Controls */}
        <Section title="Canvas">
          {/* Image scale */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Image Scale</span>
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">{config.imageScale}%</span>
            </div>
            <input
              type="range"
              className="range-input"
              min={50}
              max={100}
              step={5}
              value={config.imageScale}
              onChange={(e) => onImageScaleChange(Number(e.target.value))}
              aria-label="Image scale"
            />
            <div className="flex justify-between text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              <span>50%</span><span>100%</span>
            </div>
          </div>

          {/* Padding */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Padding</span>
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">{config.padding}px</span>
            </div>
            <input
              type="range"
              className="range-input"
              min={8}
              max={64}
              step={4}
              value={config.padding}
              onChange={(e) => onPaddingChange(Number(e.target.value))}
              aria-label="Padding"
            />
            <div className="flex justify-between text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              <span>8px</span><span>64px</span>
            </div>
          </div>

          {/* Corner radius */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Corner Radius</span>
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">{config.borderRadius}px</span>
            </div>
            <input
              type="range"
              className="range-input"
              min={0}
              max={32}
              step={2}
              value={config.borderRadius}
              onChange={(e) => onBorderRadiusChange(Number(e.target.value))}
              aria-label="Border radius"
            />
            <div className="flex justify-between text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              <span>0px</span><span>32px</span>
            </div>
          </div>
        </Section>

        {/* Keyboard hint */}
        <Section title="Shortcuts">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              ['← →', 'Navigate batch'],
              ['E', 'Export current'],
              ['Ctrl+Z', 'Undo change'],
            ].map(([key, desc]) => (
              <div key={key} className="contents">
                <kbd className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded px-1.5 py-0.5 font-mono justify-self-start">
                  {key}
                </kbd>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">{desc}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Sticky footer */}
      <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
        {/* Primary: Export current */}
        <button
          type="button"
          disabled={!hasImage || isBusy}
          onClick={onExport}
          className={[
            'w-full h-11 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2',
            hasImage && !isBusy
              ? 'bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98]'
              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed',
          ].join(' ')}
        >
          {exporting ? (
            <>
              <SpinnerIcon />
              Exporting…
            </>
          ) : 'Download Image'}
        </button>

        {/* Secondary row: Copy + Export All */}
        {hasImage && (
          <div className="flex gap-2">
            {/* Copy to clipboard */}
            <button
              type="button"
              disabled={isBusy}
              onClick={onCopyToClipboard}
              title="Copy to clipboard (PNG)"
              className={[
                'flex-1 h-9 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5',
                !isBusy
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 cursor-not-allowed',
              ].join(' ')}
            >
              {copying ? (
                <><SpinnerIcon size={12} />Copying…</>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy
                </>
              )}
            </button>

            {/* Export All (only when batch > 1) */}
            {imageCount > 1 && (
              <button
                type="button"
                disabled={isBusy}
                onClick={onExportAll}
                title={`Export all ${imageCount} images`}
                className={[
                  'flex-1 h-9 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5',
                  !isBusy
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 cursor-not-allowed',
                ].join(' ')}
              >
                {exportingAll ? (
                  <><SpinnerIcon size={12} />Exporting…</>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    All ({imageCount})
                  </>
                )}
              </button>
            )}

            {/* Undo */}
            {canUndo && (
              <button
                type="button"
                disabled={isBusy}
                onClick={onUndo}
                title="Undo last change (Ctrl+Z)"
                className={[
                  'h-9 w-9 rounded-xl text-xs font-medium transition-all flex items-center justify-center shrink-0',
                  !isBusy
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 cursor-not-allowed',
                ].join(' ')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {!hasImage && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
            Upload an image to enable export.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-4">
      <h2 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SpinnerIcon
// ---------------------------------------------------------------------------
function SpinnerIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// InlineUploadTrigger
// ---------------------------------------------------------------------------
interface InlineUploadTriggerProps {
  onUpload: (files: File[]) => void;
  maxImages: number;
  label: string;
  multiple?: boolean;
}

function InlineUploadTrigger({ onUpload, maxImages, label, multiple = false }: InlineUploadTriggerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const valid = Array.from(e.target.files).filter((f) => ALLOWED_TYPES.has(f.type));
    if (valid.length > 0) onUpload(valid.slice(0, maxImages));
    e.target.value = '';
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-sm text-neutral-600 dark:text-neutral-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple={multiple}
        className="sr-only"
        onChange={handleChange}
        aria-hidden="true"
      />
    </>
  );
}
