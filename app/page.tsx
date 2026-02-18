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
  const [siteTheme,    setSiteTheme]    = useState<'light' | 'dark'>('dark');
  const [imageUrls,    setImageUrls]    = useState<string[]>([]);
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [config,       setConfig]       = useState<FrameConfig>(DEFAULT_CONFIG);
  const [undoStack,    setUndoStack]    = useState<FrameConfig[]>([]);
  const [exporting,    setExporting]    = useState(false);
  const [exportingAll, setExportingAll] = useState(false);
  const [copying,      setCopying]      = useState(false);

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
    <div className={siteTheme === 'dark' ? 'dark' : ''}>
      <div className="h-screen flex flex-col bg-neutral-100 dark:bg-neutral-950 transition-colors duration-200 overflow-hidden">

        {/* Top bar */}
        <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center px-6 shrink-0">
          <FrameOSLogo />
          <span className="ml-2 text-xs text-neutral-400 font-medium uppercase tracking-widest hidden sm:block">
            Screenshot Framing Engine
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSiteTheme(isDark ? 'light' : 'dark')}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
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
          </div>
        </header>

        {/* Main layout */}
        <main className="flex flex-1 flex-col lg:flex-row overflow-hidden min-h-0">

          {/* Canvas */}
          <section className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden bg-neutral-100 dark:bg-neutral-950 gap-3 min-h-0 min-w-0">
            {activeImageUrl ? (
              <>
                {/* Constrain preview to remaining height so it never causes a scroll */}
                <div className="flex-1 flex items-center justify-center w-full min-h-0 min-w-0 overflow-hidden">
                  <FramePreview ref={previewRef} imageUrl={activeImageUrl} config={config} />
                </div>

                {/* Thumbnail strip -- replaces dot indicators when batch > 1 */}
                {imageUrls.length > 1 && (
                  <div className="flex shrink-0 items-center gap-3 max-w-[860px] w-full">
                    <button
                      type="button"
                      onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                      disabled={activeIndex === 0}
                      aria-label="Previous image"
                      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </button>

                    <div className="flex-1 flex gap-2 overflow-x-auto pb-1 min-w-0">
                      {imageUrls.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveIndex(i)}
                          aria-label={`View image ${i + 1}`}
                          className={[
                            'shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all',
                            i === activeIndex
                              ? 'border-violet-500 scale-105 shadow-md'
                              : 'border-transparent opacity-50 hover:opacity-100',
                          ].join(' ')}
                        >
                          <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveIndex((i) => Math.min(imageUrls.length - 1, i + 1))}
                      disabled={activeIndex === imageUrls.length - 1}
                      aria-label="Next image"
                      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
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

          {/* Controls panel */}
          <aside className="w-full lg:w-80 xl:w-88 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 overflow-y-auto min-h-0">
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
