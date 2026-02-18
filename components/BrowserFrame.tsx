'use client';

/**
 * components/BrowserFrame.tsx
 *
 * Chrome-style browser window frame.
 *
 * Frame rendering logic:
 * – Tab strip: a single active tab with a SVG favicon proxy and truncated title.
 * – Toolbar: back / forward / reload buttons + address bar pill centred in the row.
 * – Address bar shows a lock icon and a static URL to maintain the "screenshot" illusion.
 * – Three window-control dots mirror the macOS style (they look correct in both themes).
 * – Light theme: white chrome. Dark theme: #1e1e2e chrome.
 */

interface BrowserFrameProps {
  imageUrl: string;
  theme: 'light' | 'dark';
  borderRadius: number;
}

export default function BrowserFrame({ imageUrl, theme, borderRadius }: BrowserFrameProps) {
  const isDark = theme === 'dark';

  const bg       = isDark ? '#1e1e2e' : '#f1f3f4';
  const tabBg    = isDark ? '#2a2a3c' : '#ffffff';
  const toolbar  = isDark ? '#181825' : '#ffffff';
  const text     = isDark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.75)';
  const subText  = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.10)';
  const inputBg  = isDark ? '#2a2a3c' : '#f1f3f4';

  const outer: React.CSSProperties = {
    borderRadius: `${borderRadius}px`,
    overflow: 'hidden',
    boxShadow: isDark
      ? '0 0 0 1px rgba(255,255,255,0.07), 0 32px 64px -12px rgba(0,0,0,0.75)'
      : '0 0 0 1px rgba(0,0,0,0.10), 0 32px 64px -12px rgba(0,0,0,0.30)',
  };

  return (
    <div style={outer}>

      {/* ── Tab strip ──────────────────────────────────────────────────── */}
      <div style={{ background: bg, display: 'flex', alignItems: 'flex-end', paddingLeft: 76, height: 36, borderBottom: `1px solid ${border}`, userSelect: 'none' }}>
        {/* Active tab */}
        <div style={{
          background: tabBg,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          paddingLeft: 12,
          paddingRight: 12,
          borderRadius: '8px 8px 0 0',
          minWidth: 160,
          maxWidth: 220,
          position: 'relative',
        }}>
          {/* Favicon proxy – coloured square */}
          <div style={{ width: 14, height: 14, borderRadius: 3, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
            FrameOS – Screenshot Framing
          </span>
          {/* Close tab button */}
          <div style={{ width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <path d="M1 1l6 6M7 1L1 7" stroke={subText} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        {/* New-tab button */}
        <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2v10M2 7h10" stroke={subText} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div style={{ background: toolbar, height: 44, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12, paddingRight: 12, borderBottom: `1px solid ${border}`, userSelect: 'none' }}>

        {/* Window controls */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginRight: 4 }}>
          {(['#FF5F57','#FEBC2E','#28C840'] as const).map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
          ))}
        </div>

        {/* Nav buttons */}
        <NavButton label="Back" isDark={isDark}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </NavButton>
        <NavButton label="Forward" isDark={isDark}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </NavButton>
        <NavButton label="Reload" isDark={isDark}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </NavButton>

        {/* Address bar */}
        <div style={{ flex: 1, height: 30, background: inputBg, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 12, paddingRight: 12, border: `1px solid ${border}` }}>
          {/* Lock icon */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={subText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ fontSize: 12, color: text, flex: 1, textAlign: 'center' }}>frameos.app</span>
          {/* Star / bookmark icon */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={subText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>

        {/* Extensions / menu stub */}
        <NavButton label="Menu" isDark={isDark}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
          </svg>
        </NavButton>
      </div>

      {/* ── Page content ───────────────────────────────────────────────── */}
      <div style={{ background: isDark ? '#13131f' : '#ffffff', lineHeight: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Framed screenshot" style={{ display: 'block', width: '100%', maxWidth: '100%' }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NavButton – small icon button in the toolbar
// ---------------------------------------------------------------------------
function NavButton({ label, isDark, children }: { label: string; isDark: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-label={label}
      style={{
        width: 28, height: 28,
        borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}
