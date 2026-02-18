'use client';

/**
 * app/page.tsx – Root client page for FrameOS
 *
 * State:
 * – siteTheme     site UI dark/light, independent of frame theme
 * – imageUrls     base64 data URLs (not blob:) – html-to-image never re-fetches them
 * – activeIndex   which batch image is on the canvas
 * – undoStack     last 20 FrameConfig snapshots; Ctrl/Cmd+Z restores the last one
 * – exporting / exportingAll / copying  prevent double-fires on async actions
 *
 * Keyboard shortcuts (disabled while focused on inputs):
 *   ← / →   navigate batch         E        export current image
 *   Ctrl+Z   undo last config edit
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import type { FrameConfig, FrameStyle, Gradient, Theme, PhonePreset } from '@/lib/types';
import { PHONE_PRESETS } from '@/lib/types';
import ImageUploader  from '@/components/ImageUploader';
import FramePreview   from '@/components/FramePreview';
import ControlsPanel  from '@/components/ControlsPanel';
import FrameOSLogo    from '@/components/FrameOSLogo';

const MAX_IMAGES  = 10;
const UNDO_LIMIT  = 20;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const DEFAULT_CONFIG: FrameConfig = {
  frameStyle:  'macos',
  theme:       'dark',
  gradient:    'purple-blue',
  padding:     32,
  borderRadius: 12,
  imageScale:  100,
  bgColor:     '#7c3aed',
  useCustomBg: false,
  phonePreset: 'free',
};

export default function Page() {
  const [siteTheme,      setSiteTheme]      = useState<'light' | 'dark'>('dark');
  const [imageUrls,      setImageUrls]      = useState<string[]>([]);
  const [activeIndex,    setActiveIndex]    = useState(0);
  const [config,         setConfig]         = useState<FrameConfig>(DEFAULT_CONFIG);
  const [undoStack,      setUndoStack]      = useState<FrameConfig[]>([]);
  const [exporting,      setExporting]      = useState(false);
  const [exportingAll,   setExportingAll]   = useState(false);
  const [copying,        setCopying]        = useState(false);
  // Mobile: controls panel open/closed (accordion-style below the preview)
  const [controlsOpen,   setControlsOpen]   = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // updateConfig – pushes current config onto the undo stack first.
  // ---------------------------------------------------------------------------
  const updateConfig = useCallback((updates: Partial<FrameConfig>) => {
    setUndoStack((s) => [...s.slice(-(UNDO_LIMIT - 1)), config]);
    setConfig((c) => ({ ...c, ...updates }));
  }, [config]);

  const handleUndo = useCallback(() => {
    setUndoStack((s) => {
      if (s.length === 0) return s;
      setConfig(s[s.length - 1]);
      return s.slice(0, -1);
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Upload
  // ---------------------------------------------------------------------------
  const handleUpload = useCallback(async (files: File[]) => {
    const isFirstBatch = imageUrls.length === 0;
    const slots = isFirstBatch ? MAX_IMAGES : MAX_IMAGES - imageUrls.length;
    if (slots <= 0) return;
    const toAdd      = files.slice(0, slots);
    const newDataUrls = await Promise.all(toAdd.map(fileToDataUrl));
    setImageUrls((prev) => {
      if (isFirstBatch) { setActiveIndex(0); return newDataUrls; }
      setActiveIndex(prev.length);
      return [...prev, ...newDataUrls];
    });
  }, [imageUrls.length]);

  const handleRemoveActive = useCallback(() => {
    setImageUrls((prev) => {
      const next = prev.filter((_, i) => i !== activeIndex);
      setActiveIndex((idx) => Math.min(idx, Math.max(0, next.length - 1)));
      return next;
    });
  }, [activeIndex]);

  // ---------------------------------------------------------------------------
  // Export: current image at 2x resolution, or exact store dimensions if a
  // phone preset is active.
  // ---------------------------------------------------------------------------
  const handleExport = useCallback(async () => {
    if (!previewRef.current || imageUrls.length === 0) return;
    setExporting(true);
    try {
      const { toPng } = await import('html-to-image');
      const preset = config.phonePreset;
      const exportOpts =
        preset !== 'free' && config.frameStyle === 'phone'
          ? { canvasWidth: PHONE_PRESETS[preset].width, canvasHeight: PHONE_PRESETS[preset].height }
          : { pixelRatio: 2 };
      const dataUrl = await toPng(previewRef.current, exportOpts);
      const a = document.createElement('a');
      a.download = `frameos-${activeIndex + 1}.png`;
      a.href = dataUrl;
      a.click();
    } finally {
      setExporting(false);
    }
  }, [imageUrls.length, activeIndex, config.phonePreset, config.frameStyle]);

  // ---------------------------------------------------------------------------
  // Export All: cycles through each image, captures + downloads sequentially.
  // A 220 ms gap lets React re-render before html-to-image reads the DOM.
  // ---------------------------------------------------------------------------
  const handleExportAll = useCallback(async () => {
    if (!previewRef.current || imageUrls.length === 0) return;
    setExportingAll(true);
    const saved = activeIndex;
    try {
      const { toPng } = await import('html-to-image');
      const preset = config.phonePreset;
      const exportOpts =
        preset !== 'free' && config.frameStyle === 'phone'
          ? { canvasWidth: PHONE_PRESETS[preset].width, canvasHeight: PHONE_PRESETS[preset].height }
          : { pixelRatio: 2 };
      for (let i = 0; i < imageUrls.length; i++) {
        setActiveIndex(i);
        await new Promise((r) => setTimeout(r, 220));
        if (!previewRef.current) break;
        const dataUrl = await toPng(previewRef.current, exportOpts);
        const a = document.createElement('a');
        a.download = `frameos-${i + 1}.png`;
        a.href = dataUrl;
        a.click();
        if (i < imageUrls.length - 1) await new Promise((r) => setTimeout(r, 350));
      }
    } finally {
      setActiveIndex(saved);
      setExportingAll(false);
    }
  }, [imageUrls, activeIndex, config.phonePreset, config.frameStyle]);

  // ---------------------------------------------------------------------------
  // Copy to clipboard via Clipboard API
  // ---------------------------------------------------------------------------
  const handleCopyToClipboard = useCallback(async () => {
    if (!previewRef.current || imageUrls.length === 0) return;
    setCopying(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2 });
      const blob = await fetch(dataUrl).then((r) => r.blob());
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    } finally {
      setCopying(false);
    }
  }, [imageUrls.length]);

  // ---------------------------------------------------------------------------
  // Keyboard shortcuts
  // ---------------------------------------------------------------------------
  const handleExportRef = useRef(handleExport);
  const handleUndoRef   = useRef(handleUndo);
  handleExportRef.current = handleExport;
  handleUndoRef.current   = handleUndo;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft')  setActiveIndex((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setActiveIndex((i) => Math.min(imageUrls.length - 1, i + 1));
      if ((e.key === 'e' || e.key === 'E') && !e.metaKey && !e.ctrlKey) handleExportRef.current();
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); handleUndoRef.current(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [imageUrls.length]);

  const isDark         = siteTheme === 'dark';
  const activeImageUrl = imageUrls[activeIndex] ?? null;
  const isBusy         = exporting || exportingAll || copying;

  return (
    // `dark` class on root enables dark: variants everywhere below
    <div className={siteTheme === 'dark' ? 'dark' : ''}>
      {/*
       * Outer shell:
       * – Mobile/tablet (<lg): full viewport height, flex-col, allows natural
       *   stacking of header → canvas → controls drawer.
       * – Desktop (lg+): overflow-hidden locks to exactly one screen, no scroll.
       * `overflow-x-hidden` prevents any accidental horizontal bleed on mobile.
       */}
      <div className="h-screen flex flex-col bg-neutral-100 dark:bg-neutral-950 transition-colors duration-200 overflow-x-hidden lg:overflow-hidden">

        {/* ── Top bar ────────────────────────────────────────────────────────── */}
        <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center px-4 sm:px-6 shrink-0 z-20">
          <FrameOSLogo />
          {/* Tagline hidden on small screens to save horizontal space */}
          <span className="ml-2 text-xs text-neutral-400 font-medium uppercase tracking-widest hidden sm:block">
            Screenshot Framing Engine
          </span>

          <div className="ml-auto flex items-center gap-2">
            {/* Dark/light toggle – min 44px tap target via w-11 h-11 on mobile */}
            <button
              type="button"
              onClick={() => setSiteTheme(isDark ? 'light' : 'dark')}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-11 h-11 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center transition-colors bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/*
             * Mobile-only controls toggle button (hidden lg+, where the aside
             * is always visible in the two-column layout).
             */}
            <button
              type="button"
              onClick={() => setControlsOpen((v) => !v)}
              aria-label={controlsOpen ? 'Hide controls' : 'Show controls'}
              aria-expanded={controlsOpen}
              className="lg:hidden w-11 h-11 rounded-lg flex items-center justify-center transition-colors bg-violet-600 text-white hover:bg-violet-700 active:scale-95"
            >
              {controlsOpen ? (
                // X icon when open
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                // Sliders icon when closed
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="4" y1="12" x2="20" y2="12"/>
                  <line x1="4" y1="18" x2="20" y2="18"/>
                  <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/>
                  <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/>
                  <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/>
                </svg>
              )}
            </button>
          </div>
        </header>

        {/*
         * ── Main layout ──────────────────────────────────────────────────────
         * Desktop (lg+):  side-by-side, overflow-hidden – fits exactly in viewport.
         * Tablet/Mobile:  stacked column. Canvas fills available space; controls
         *                 panel is conditionally rendered below as an accordion.
         */}
        <main className="flex flex-1 flex-col lg:flex-row overflow-hidden lg:overflow-hidden min-h-0">

          {/*
           * ── Canvas section ───────────────────────────────────────────────
           * `flex-1 min-h-0` lets it shrink/grow within the flex column.
           * On mobile: fixed reasonable height so it doesn't consume the full
           * viewport when controls are open. On desktop: fills remaining width.
           */}
          <section
            className={[
              'flex flex-col items-center justify-center gap-3 bg-neutral-100 dark:bg-neutral-950',
              // Mobile: when controls are open, give canvas a fixed portion;
              // when controls are closed, let it fill available space.
              controlsOpen
                ? 'p-3 overflow-hidden'
                : 'flex-1 p-3 sm:p-4 overflow-hidden',
              // Desktop: always flex-1, never shrinks out
              'lg:flex-1 lg:p-4 min-h-0 min-w-0',
            ].join(' ')}
            // Fixed height on mobile when controls drawer is open so preview
            // stays visible and doesn't get pushed completely off screen.
            style={controlsOpen ? { height: '45dvh', flexShrink: 0 } : undefined}
          >
            {activeImageUrl ? (
              <>
                {/* Preview wrapper – constrains to available height, never overflows */}
                <div className="flex-1 flex items-center justify-center w-full min-h-0 min-w-0 overflow-hidden">
                  <FramePreview ref={previewRef} imageUrl={activeImageUrl} config={config} />
                </div>

                {/* Thumbnail strip — hidden when controls are open on mobile to save space */}
                {imageUrls.length > 1 && (
                  <div className={[
                    'flex shrink-0 items-center gap-2 sm:gap-3 w-full',
                    // Cap width to match max preview width
                    'max-w-[860px]',
                    // Hide strip on mobile when controls drawer is open
                    controlsOpen ? 'hidden sm:flex' : 'flex',
                  ].join(' ')}>
                    {/* Prev arrow */}
                    <button
                      type="button"
                      onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                      disabled={activeIndex === 0}
                      aria-label="Previous image"
                      // min 44px tap target on mobile
                      className="shrink-0 w-11 h-11 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </button>

                    {/* Scrollable thumbnail row */}
                    <div className="flex-1 flex gap-2 overflow-x-auto pb-1 min-w-0 scrollbar-hide">
                      {imageUrls.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveIndex(i)}
                          aria-label={`View image ${i + 1}`}
                          // Slightly larger thumbnails on mobile for easier tapping
                          className={[
                            'shrink-0 w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all',
                            i === activeIndex
                              ? 'border-violet-500 scale-105 shadow-md'
                              : 'border-transparent opacity-50 hover:opacity-100',
                          ].join(' ')}
                        >
                          <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    {/* Next arrow */}
                    <button
                      type="button"
                      onClick={() => setActiveIndex((i) => Math.min(imageUrls.length - 1, i + 1))}
                      disabled={activeIndex === imageUrls.length - 1}
                      aria-label="Next image"
                      className="shrink-0 w-11 h-11 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>

                    <span className="shrink-0 text-xs text-neutral-400 dark:text-neutral-500 tabular-nums">
                      {activeIndex + 1}/{imageUrls.length}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <ImageUploader onUpload={handleUpload} maxImages={MAX_IMAGES} />
            )}
          </section>

          {/*
           * ── Controls aside ───────────────────────────────────────────────
           * Desktop (lg+): fixed-width column (w-80 / w-96), always visible,
           *                scrollable internally.
           * Mobile/Tablet: full-width, slides in below the canvas when
           *                `controlsOpen` is true. Rendered in DOM regardless
           *                to avoid remounting and losing scroll position.
           */}
          <aside
            className={[
              // Base: full width, white/dark bg, left border on desktop
              'w-full lg:w-80 xl:w-96 bg-white dark:bg-neutral-900',
              'border-neutral-200 dark:border-neutral-800',
              // Desktop: always show, internal scroll, fixed height
              'lg:border-l lg:flex lg:flex-col lg:min-h-0 lg:overflow-y-auto lg:shrink-0',
              // Mobile: accordion – visible only when controlsOpen, overflow-y scroll
              // flex-1 so it can fill remaining space below the canvas
              controlsOpen
                ? 'flex flex-col flex-1 overflow-y-auto border-t'
                : 'hidden lg:flex lg:flex-col',
            ].join(' ')}
          >
            <ControlsPanel
              config={config}
              imageCount={imageUrls.length}
              activeIndex={activeIndex}
              maxImages={MAX_IMAGES}
              exporting={exporting}
              exportingAll={exportingAll}
              copying={copying}
              canUndo={undoStack.length > 0}
              isBusy={isBusy}
              onFrameStyleChange={(v) => updateConfig({ frameStyle: v })}
              onThemeChange={(v) => updateConfig({ theme: v })}
              onGradientChange={(v) => updateConfig({ gradient: v })}
              onPaddingChange={(v) => updateConfig({ padding: v })}
              onBorderRadiusChange={(v) => updateConfig({ borderRadius: v })}
              onImageScaleChange={(v) => updateConfig({ imageScale: v })}
              onBgColorChange={(v) => updateConfig({ bgColor: v })}
              onUseCustomBgChange={(v) => updateConfig({ useCustomBg: v })}
              onPhonePresetChange={(v) => updateConfig({ phonePreset: v })}
              onUpload={handleUpload}
              onRemoveActive={handleRemoveActive}
              onExport={handleExport}
              onExportAll={handleExportAll}
              onCopyToClipboard={handleCopyToClipboard}
              onUndo={handleUndo}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}
